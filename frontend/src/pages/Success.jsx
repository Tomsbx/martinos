import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trackPurchase } from '../utils/analytics';

export default function Success() {
  useEffect(() => {
    const raw = sessionStorage.getItem('martinos_last_order');
    if (raw) {
      const { orderId, items, total } = JSON.parse(raw);
      trackPurchase(orderId, items, total);
      sessionStorage.removeItem('martinos_last_order');
    }
  }, []);

  return (
    <div className="success-page">
      <div className="success-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="success-title">¡Pedido recibido!</h1>
      <p className="success-subtitle">
        Te avisamos cuando tu delivery esté en camino
      </p>
      <Link to="/" className="btn-back-menu">
        Volver al menú
      </Link>
    </div>
  );
}
