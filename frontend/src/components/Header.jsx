import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="header">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <img src="/images/logo.png" alt="Martinos" style={{ height: '40px', width: 'auto' }} />
        </Link>

        <button className="cart-btn" onClick={() => setDrawerOpen(true)} aria-label="Abrir carrito">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>
      </header>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
