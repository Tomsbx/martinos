import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const formatPrice = (price) =>
  '$' + Math.round(Number(price)).toLocaleString('es-UY');

export default function CartDrawer({ open, onClose }) {
  const { items, addItem, removeItem, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div
        className={`drawer-overlay${open ? ' open' : ''}`}
        onClick={onClose}
      />
      <div className={`cart-drawer${open ? ' open' : ''}`}>
        <div className="drawer-header">
          <h2>Tu pedido</h2>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="drawer-content">
          {items.length === 0 ? (
            <div className="drawer-empty">Tu carrito está vacío</div>
          ) : (
            items.map(item => (
              <div key={item.product_id} className="drawer-item">
                <img
                  className="drawer-item-img"
                  src={item.image_url || ''}
                  alt={item.name}
                />
                <div className="drawer-item-info">
                  <span className="drawer-item-name">{item.name}</span>
                  <span className="drawer-item-price">{formatPrice(item.price)}</span>
                </div>
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => removeItem(item.product_id)}
                    aria-label="Reducir cantidad"
                  >
                    −
                  </button>
                  <span className="qty-count">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => addItem({ id: item.product_id, name: item.name, price: item.price, image_url: item.image_url })}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-subtotal">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button className="btn-go-checkout" onClick={handleCheckout}>
              Confirmar pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
}
