import { useCart } from '../context/CartContext';

const formatPrice = (price) =>
  '$' + Math.round(Number(price)).toLocaleString('es-UY');

export default function CartBar() {
  const { itemCount, total, openDrawer } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="cart-bar" onClick={openDrawer} role="button">
      <span className="cart-bar-left">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        Tu pedido · {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </span>
      <span className="cart-bar-right">{formatPrice(total)}</span>
    </div>
  );
}
