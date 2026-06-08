import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { postCheckout } from '../api/api';

const formatPrice = (price) =>
  '$' + Math.round(Number(price)).toLocaleString('es-UY');

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const orderPlaced = useRef(false);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced.current) navigate('/');
  }, [items, navigate]);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      const body = {
        customer_name: form.name,
        customer_phone: form.phone,
        delivery_address: form.address,
        items: items.map(i => ({
          product_id: i.product_id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      };
      const { init_point } = await postCheckout(body);
      orderPlaced.current = true;
      clearCart();
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
            <label>Nombre completo</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Juan García"
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input
              className="form-input"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="099 000 000"
            />
          </div>
          <div className="form-group">
            <label>Dirección de entrega</label>
            <textarea
              className="form-input"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="Calle, número, apartamento..."
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
          <div className="order-total-row">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
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
