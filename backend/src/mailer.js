const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function formatPrice(price) {
  return '$ ' + Math.round(Number(price)).toLocaleString('es-UY');
}

async function sendNewOrderMail(order) {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:6px 12px;">${item.quantity} × ${item.name}</td>
      <td style="padding:6px 12px;text-align:right;">${formatPrice(item.price * item.quantity)}</td>
    </tr>`).join('');

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
      <h2 style="margin-bottom:4px;">🍔 Nuevo pedido #${order.id}</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr><td style="padding:6px 12px;color:#666;">Nombre</td><td style="padding:6px 12px;">${order.customer_name}</td></tr>
        <tr><td style="padding:6px 12px;color:#666;">Teléfono</td><td style="padding:6px 12px;">${order.customer_phone}</td></tr>
        <tr><td style="padding:6px 12px;color:#666;">Dirección</td><td style="padding:6px 12px;">${order.delivery_address}</td></tr>
        ${order.notes ? `<tr><td style="padding:6px 12px;color:#666;">Indicaciones</td><td style="padding:6px 12px;">${order.notes}</td></tr>` : ''}
      </table>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee;">
        ${itemRows}
        <tr style="border-top:1px solid #eee;">
          <td style="padding:10px 12px;font-weight:bold;">Total</td>
          <td style="padding:10px 12px;text-align:right;font-weight:bold;">${formatPrice(order.total)}</td>
        </tr>
      </table>
    </div>
  `;

  await transporter.sendMail({
    from: `Martinos <${process.env.SMTP_USER}>`,
    to: `${process.env.ADMIN_EMAIL}, ${process.env.ADMIN_EMAIL2}`,
    subject: `🍔 Nuevo pedido #${order.id} — ${formatPrice(order.total)}`,
    html,
  });
}

module.exports = { sendNewOrderMail };
