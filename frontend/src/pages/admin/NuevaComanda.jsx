import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createManualOrder } from '../../api/adminApi';

const CATEGORY_LABELS = {
  combo: 'Combos',
  burger: 'Hamburguesas',
  mila: 'Milanesas',
  napoles: 'Nápoles',
  promo: 'Promos',
  guarnicion: 'Guarniciones',
  postre: 'Postres',
  bebida: 'Bebidas',
  envasado: 'Envasados',
};

const CATEGORY_ORDER = ['combo', 'burger', 'mila', 'napoles', 'promo', 'guarnicion', 'postre', 'bebida', 'envasado'];

function formatPrice(price) {
  return '$ ' + Math.round(Number(price)).toLocaleString('es-UY');
}

const qtyBtn = {
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text)',
  cursor: 'pointer',
  fontSize: 16,
  lineHeight: 1,
  flexShrink: 0,
  padding: 0,
};

export default function NuevaComanda() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', notes: '' });
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data.filter(p => p.available)))
      .catch(() => setError('Error al cargar productos'))
      .finally(() => setLoadingProducts(false));
  }, []);

  function addToCart(product) {
    setCart(prev => {
      const idx = prev.findIndex(i => i.product_id === product.id);
      if (idx >= 0) {
        return prev.map((i, n) => n === idx ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product_id: product.id, name: product.name, price: Number(product.price), quantity: 1 }];
    });
  }

  function changeQty(product_id, delta) {
    setCart(prev =>
      prev.map(i => i.product_id === product_id ? { ...i, quantity: i.quantity + delta } : i)
          .filter(i => i.quantity > 0)
    );
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function handleSubmit() {
    if (!cart.length) { setError('Agregá al menos un producto'); return; }
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      setError('La dirección es obligatoria para delivery');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await createManualOrder({
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        delivery_type: deliveryType,
        delivery_address: deliveryAddress.trim(),
        items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        notes: form.notes.trim(),
      });
      navigate('/admin/comandas');
    } catch (err) {
      setError(err.message || 'Error al crear la comanda');
      setSubmitting(false);
    }
  }

  const grouped = {};
  for (const p of products) {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  }
  const categories = CATEGORY_ORDER.filter(c => grouped[c]?.length);

  return (
    <div className="admin-page" style={{ maxWidth: 1200 }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Nueva Comanda</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

        {/* Catálogo de productos */}
        <div>
          {loadingProducts ? (
            <div className="admin-loading">Cargando productos...</div>
          ) : (
            categories.map(cat => (
              <div key={cat} style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>
                  {CATEGORY_LABELS[cat] ?? cat}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {grouped[cat].map(p => {
                    const inCart = cart.find(i => i.product_id === p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => addToCart(p)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 14px',
                          background: inCart ? 'rgba(232,144,10,0.08)' : 'var(--bg-card)',
                          border: `1px solid ${inCart ? 'rgba(232,144,10,0.4)' : 'var(--border)'}`,
                          borderRadius: 8,
                          color: 'var(--text)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: 14,
                          transition: 'border-color 0.15s, background 0.15s',
                        }}
                      >
                        <span>
                          {p.name}
                          {inCart && (
                            <span style={{ color: 'var(--accent)', marginLeft: 8, fontWeight: 600 }}>×{inCart.quantity}</span>
                          )}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 13, flexShrink: 0, marginLeft: 12 }}>
                          {formatPrice(p.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel: carrito + formulario */}
        <div style={{ position: 'sticky', top: 24 }}>

          {/* Carrito */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 12 }}>
              Pedido
            </p>
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
                Seleccioná productos del catálogo
              </p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.product_id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 13 }}>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </span>
                    <button style={qtyBtn} onClick={() => changeQty(item.product_id, -1)}>−</button>
                    <span style={{ minWidth: 18, textAlign: 'center' }}>{item.quantity}</span>
                    <button style={qtyBtn} onClick={() => changeQty(item.product_id, 1)}>+</button>
                    <span style={{ color: 'var(--text-muted)', minWidth: 56, textAlign: 'right', flexShrink: 0 }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 }}>
                  <span>Total</span>
                  <span style={{ color: '#fff' }}>{formatPrice(subtotal)}</span>
                </div>
              </>
            )}
          </div>

          {/* Formulario */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div className="form-group">
              <label>Tipo de entrega</label>
              <div className="delivery-toggle">
                <button
                  type="button"
                  className={`delivery-toggle-btn${deliveryType === 'pickup' ? ' active' : ''}`}
                  onClick={() => setDeliveryType('pickup')}
                >
                  Retiro en local
                </button>
                <button
                  type="button"
                  className={`delivery-toggle-btn${deliveryType === 'delivery' ? ' active' : ''}`}
                  onClick={() => setDeliveryType('delivery')}
                >
                  Delivery
                </button>
              </div>
            </div>

            {deliveryType === 'delivery' && (
              <div className="form-group">
                <label>Dirección</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Calle, número, apartamento..."
                />
              </div>
            )}

            <div className="form-group">
              <label>Nombre cliente <span className="label-optional">(opcional)</span></label>
              <input
                className="form-input"
                value={form.customer_name}
                onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                placeholder="Pedido mostrador"
              />
            </div>

            <div className="form-group">
              <label>Teléfono <span className="label-optional">(opcional)</span></label>
              <input
                className="form-input"
                type="tel"
                value={form.customer_phone}
                onChange={e => setForm(p => ({ ...p, customer_phone: e.target.value }))}
                placeholder="099 000 000"
              />
            </div>

            <div className="form-group">
              <label>Indicaciones <span className="label-optional">(opcional)</span></label>
              <textarea
                className="form-input"
                rows={2}
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Sin mostaza, alergia a..., etc."
              />
            </div>

            {error && (
              <p className="checkout-error" style={{ marginTop: 0, marginBottom: 12 }}>{error}</p>
            )}

            <button
              className="btn-pay"
              onClick={handleSubmit}
              disabled={submitting || !cart.length}
              style={{ marginTop: 8 }}
            >
              {submitting ? 'Confirmando...' : 'Confirmar comanda'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
