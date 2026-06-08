import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const formatPrice = (price) =>
  '$' + Math.round(Number(price)).toLocaleString('es-UY');

export default function CartBar() {
  const { itemCount, total } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) return null;

  return (
    <div className="cart-bar" onClick={() => navigate('/checkout')} role="button">
      <span className="cart-bar-left">
        {itemCount} producto{itemCount !== 1 ? 's' : ''} en tu pedido
      </span>
      <span className="cart-bar-right">{formatPrice(total)}</span>
    </div>
  );
}
