import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function OrdersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="2" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">Martinos</div>
        <nav className="admin-sidebar-nav">
          <NavLink
            to="/admin/comandas"
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            <OrdersIcon />
            <span className="admin-nav-label">Comandas</span>
          </NavLink>
          <NavLink
            to="/admin/productos"
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            <ProductsIcon />
            <span className="admin-nav-label">Productos</span>
          </NavLink>
        </nav>
        <button className="admin-sidebar-logout" onClick={handleLogout}>
          <LogoutIcon />
          <span className="admin-nav-label">Cerrar sesión</span>
        </button>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
