const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const { sendNewOrderMail } = require('../mailer');

function getMpClient() {
  return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
}

router.post('/checkout', async (req, res) => {
  const { customer_name, customer_phone, delivery_address, items, payment_method, notes, total: clientTotal } = req.body;
  if (!customer_name || !customer_phone || !delivery_address || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
  const total = clientTotal != null ? Number(clientTotal) : subtotal;

  const skipMP = !process.env.MP_ACCESS_TOKEN || payment_method !== 'tarjeta';

  try {
    if (skipMP) {
      const { rows } = await pool.query(
        `INSERT INTO orders (customer_name, customer_phone, delivery_address, items, subtotal, total, payment_status, payment_method, notes)
         VALUES ($1, $2, $3, $4, $5, $6, 'paid', $7, $8) RETURNING *`,
        [customer_name, customer_phone, delivery_address, JSON.stringify(items), subtotal, total, payment_method || 'efectivo', notes || null]
      );
      const order = { ...rows[0], items };
      try { await sendNewOrderMail(order); } catch (_) {}
      return res.json({ order_id: rows[0].id, init_point: null });
    }

    const { rows } = await pool.query(
      `INSERT INTO orders (customer_name, customer_phone, delivery_address, items, subtotal, total, payment_status, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7, $8) RETURNING id`,
      [customer_name, customer_phone, delivery_address, JSON.stringify(items), subtotal, total, payment_method || 'tarjeta', notes || null]
    );
    const orderId = rows[0].id;

    const preference = new Preference(getMpClient());
    const prefResult = await preference.create({
      body: {
        items: [{
          title: 'Pedido Martinos',
          quantity: 1,
          unit_price: parseFloat(total),
          currency_id: 'UYU',
        }],
        external_reference: String(orderId),
        back_urls: {
          success: `${process.env.FRONTEND_URL}/order/success`,
          failure: `${process.env.FRONTEND_URL}/order/failure`,
          pending: `${process.env.FRONTEND_URL}/order/pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/orders/webhook`,
      },
    });

    await pool.query(
      'UPDATE orders SET mp_preference_id = $1 WHERE id = $2',
      [prefResult.id, orderId]
    );

    res.json({
      order_id: orderId,
      preference_id: prefResult.id,
      init_point: prefResult.init_point,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/webhook', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'payment' && data?.id) {
    try {
      const payment = new Payment(getMpClient());
      const paymentInfo = await payment.get({ id: data.id });
      if (paymentInfo.status === 'approved') {
        const { rows } = await pool.query(
          `UPDATE orders SET payment_status = 'paid', mp_payment_id = $1 WHERE id = $2 RETURNING *`,
          [String(paymentInfo.id), paymentInfo.external_reference]
        );
        if (rows.length) {
          try { await sendNewOrderMail(rows[0]); } catch (_) {}
        }
      }
    } catch (err) {
      console.error('Webhook error:', err.message);
    }
  }

  res.sendStatus(200);
});

router.post('/manual', authMiddleware, async (req, res) => {
  let { customer_name, customer_phone, delivery_type, delivery_address, items, notes } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }
  if (items.some(i => !i.product_id || Number(i.quantity) < 1)) {
    return res.status(400).json({ error: 'Each item must have a valid product_id and quantity >= 1' });
  }

  customer_name = (customer_name || '').trim() || 'Pedido mostrador';
  customer_phone = (customer_phone || '').trim();

  const isDelivery = delivery_type === 'delivery';
  if (isDelivery && !(delivery_address || '').trim()) {
    return res.status(400).json({ error: 'delivery_address is required for delivery orders' });
  }
  const resolvedAddress = isDelivery ? delivery_address.trim() : 'Retiro en local';

  const productIds = [...new Set(items.map(i => Number(i.product_id)))];

  try {
    const { rows: foundProducts } = await pool.query(
      'SELECT id, name, price FROM products WHERE id = ANY($1) AND available = true',
      [productIds]
    );

    if (foundProducts.length !== productIds.length) {
      return res.status(400).json({ error: 'One or more products not found or unavailable' });
    }

    const productMap = {};
    for (const p of foundProducts) productMap[p.id] = p;

    const resolvedItems = items.map(i => ({
      product_id: Number(i.product_id),
      name: productMap[Number(i.product_id)].name,
      price: parseFloat(productMap[Number(i.product_id)].price),
      quantity: Number(i.quantity),
    }));

    const subtotal = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const { rows } = await pool.query(
      `INSERT INTO orders (customer_name, customer_phone, delivery_address, items, subtotal, total, payment_status, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5, $6, 'paid', 'local', $7) RETURNING *`,
      [customer_name, customer_phone, resolvedAddress, JSON.stringify(resolvedItems), subtotal, subtotal, notes || null]
    );

    res.status(201).json({ order_id: rows[0].id, order: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const params = [];
    let query = `SELECT * FROM orders WHERE payment_status = 'paid'`;
    if (req.query.date) {
      params.push(req.query.date);
      query += ` AND DATE(created_at) = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { order_status } = req.body;
  const valid = ['received', 'preparing', 'on_the_way', 'delivered'];
  if (!valid.includes(order_status)) {
    return res.status(400).json({ error: 'Invalid order_status' });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *',
      [order_status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
