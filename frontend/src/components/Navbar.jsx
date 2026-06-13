import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar({ onMenuOpen }) {
  const { drawerOpen, closeDrawer, openDrawer, itemCount } = useCart();

  return (
    <>
      <nav className="navbar">
        <button
          className="header-menu-btn"
          onClick={onMenuOpen}
          aria-label="Abrir menú"
          style={{ visibility: onMenuOpen ? 'visible' : 'hidden' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <img src="/images/logo.png" alt="Martinos" style={{ height: '40px', width: 'auto' }} />
        </Link>

        <button className="cart-btn" onClick={openDrawer} aria-label="Ver carrito">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>
      </nav>
      <CartDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
