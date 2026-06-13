import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { postCheckout } from '../api/api';
import { trackBeginCheckout } from '../utils/analytics';

const formatPrice = (price) =>
  '$' + Math.round(Number(price)).toLocaleString('es-UY');

const CARD_SURCHARGE = 0.15;

export default function Checkout() {
  const { items, total: subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const orderPlaced = useRef(false);

  const surcharge = paymentMethod === 'tarjeta' ? Math.round(subtotal * CARD_SURCHARGE) : 0;
  const total = subtotal + surcharge;

  useEffect(() => {
    if (items.length === 0 && !orderPlaced.current) navigate('/');
  }, [items, navigate]);

  useEffect(() => {
    trackBeginCheckout(items, subtotal);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'El nombre es obligatorio';
    if (!form.phone.trim()) errors.phone = 'El teléfono es obligatorio';
    if (deliveryType === 'delivery' && !form.address.trim())
      errors.address = 'La dirección es obligatoria para delivery';
    return errors;
  };

  const handlePay = async () => {
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body = {
        customer_name: form.name,
        customer_phone: form.phone,
        delivery_address: deliveryType === 'delivery' ? form.address : 'Retiro en local',
        notes: form.notes,
        payment_method: paymentMethod,
        items: items.map(i => ({
          product_id: i.product_id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        total,
      };
      const { init_point } = await postCheckout(body);
      orderPlaced.current = true;
      clearCart();
      sessionStorage.setItem('martinos_last_order', JSON.stringify({
        orderId: Date.now().toString(),
        items,
        total,
      }));
      if (init_point) {
        window.location.href = init_point;
      } else {
        navigate('/success');
      }
    } catch (err) {
      setError('Hubo un problema al procesar el pedido. Intentá de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <button className="checkout-back" onClick={() => navigate('/')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver al menú
      </button>

      <div className="checkout-content">
        <div className="checkout-section">
          <h2>Tus datos</h2>

          <div className="form-group">
            <label>Tipo de entrega</label>
            <div className="delivery-toggle">
              <button
                type="button"
                className={`delivery-toggle-btn${deliveryType === 'delivery' ? ' active' : ''}`}
                onClick={() => setDeliveryType('delivery')}
              >
                Delivery
              </button>
              <button
                type="button"
                className={`delivery-toggle-btn${deliveryType === 'pickup' ? ' active' : ''}`}
                onClick={() => setDeliveryType('pickup')}
              >
                Retiro en local
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Nombre completo</label>
            <input
              className={`form-input${fieldErrors.name ? ' input-error' : ''}`}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Juan García"
            />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              className={`form-input${fieldErrors.phone ? ' input-error' : ''}`}
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="099 000 000"
            />
            {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
          </div>

          {deliveryType === 'delivery' && (
            <div className="form-group">
              <label>Dirección de entrega</label>
              <textarea
                className={`form-input${fieldErrors.address ? ' input-error' : ''}`}
                name="address"
                rows={3}
                value={form.address}
                onChange={handleChange}
                placeholder="Calle, número, apartamento..."
              />
              {fieldErrors.address && <span className="field-error">{fieldErrors.address}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Indicaciones adicionales <span className="label-optional">(opcional)</span></label>
            <textarea
              className="form-input"
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              placeholder="Sin mostaza, alergia a..., timbre roto, etc."
            />
          </div>
        </div>

        <div className="checkout-section">
          <h2>Tu pedido</h2>
          {items.map(item => (
            <div key={item.product_id} className="order-summary-item">
              <div className="order-summary-item-left">
                <span>{item.name}</span>
                <span>{item.quantity} × {formatPrice(item.price)}</span>
              </div>
              <span className="order-summary-item-right">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}

          {paymentMethod === 'tarjeta' && (
            <>
              <div className="order-summary-item">
                <div className="order-summary-item-left">
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                </div>
                <span className="order-summary-item-right" style={{ color: 'var(--text-muted)' }}>
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="order-summary-item">
                <div className="order-summary-item-left">
                  <span style={{ color: 'var(--text-muted)' }}>Recargo tarjeta</span>
                </div>
                <span className="order-summary-item-right" style={{ color: 'var(--text-muted)' }}>
                  {formatPrice(surcharge)}
                </span>
              </div>
            </>
          )}

          <div className="order-total-row">
            <span>Total</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 8 }}>
          <label>Método de pago</label>
          <div className="delivery-toggle">
            <button
              type="button"
              className={`delivery-toggle-btn${paymentMethod === 'efectivo' ? ' active' : ''}`}
              onClick={() => setPaymentMethod('efectivo')}
            >
              Efectivo
            </button>
            <button
              type="button"
              className={`delivery-toggle-btn${paymentMethod === 'tarjeta' ? ' active' : ''}`}
              onClick={() => setPaymentMethod('tarjeta')}
            >
              Tarjeta
            </button>
          </div>
        </div>

        {error && <p className="checkout-error">{error}</p>}
        <button className="btn-pay" onClick={handlePay} disabled={loading}>
          {loading ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </div>
    </div>
  );
}
