import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Comandas from './pages/admin/Comandas';
import Productos from './pages/admin/Productos';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

function AdminIndex() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/admin/comandas' : '/admin/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin" element={<AdminIndex />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/comandas"
              element={
                <RequireAuth>
                  <AdminLayout><Comandas /></AdminLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/admin/productos"
              element={
                <RequireAuth>
                  <AdminLayout><Productos /></AdminLayout>
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
