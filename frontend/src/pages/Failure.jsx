import { Link } from 'react-router-dom';

export default function Failure() {
  return (
    <div className="success-page">
      <div className="success-icon" style={{ background: '#e53e3e22', border: '2px solid #e53e3e55' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <h1 className="success-title">El pago no fue procesado</h1>
      <p className="success-subtitle">
        Podés intentarlo nuevamente o elegir otro medio de pago
      </p>
      <Link to="/menu" className="btn-back-menu">
        Volver al menú
      </Link>
    </div>
  );
}
