import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Hamburguesas', to: '/menu?cat=combo' },
  { label: 'Nápoles', to: '/menu?cat=napoles' },
  { label: 'Envasados', to: '/menu?cat=envasado' },
];

function isNavActive(to, pathname, searchParams) {
  if (to === '/') return pathname === '/';
  const [path, search] = to.split('?');
  if (pathname !== path) return false;
  if (!search) return true;
  const param = new URLSearchParams(search);
  return searchParams.get('cat') === param.get('cat');
}

export default function Header() {
  const { itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return (
    <>
      <header className="header">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          Martinos
        </Link>

        <nav className="nav-desktop">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link${isNavActive(link.to, location.pathname, searchParams) ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

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
