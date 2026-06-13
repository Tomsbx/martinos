import { useCart } from '../context/CartContext';
import { trackAddToCart } from '../utils/analytics';

const formatPrice = (price) =>
  '$' + Math.round(Number(price)).toLocaleString('es-UY');

export default function ProductCard({ product, horizontal = false }) {
  const { addItem } = useCart();

  function handleAddItem() {
    addItem(product);
    trackAddToCart({ product_id: product.id, name: product.name, price: Number(product.price), quantity: 1 });
  }

  if (horizontal) {
    return (
      <div className="product-card product-card-horizontal">
        <div className="product-body">
          <p className="product-name">{product.name}</p>
          {product.description && (
            <p className="product-desc">{product.description}</p>
          )}
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>
        <div className="product-img-wrap">
          {product.image_url ? (
            <img
              className="product-img"
              src={product.image_url}
              alt={product.name}
              loading="lazy"
            />
          ) : (
            <div className="product-img-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M7 11.5h10M7 14.5h10M8.5 8.5a3.5 3.5 0 0 1 7 0" />
              </svg>
            </div>
          )}
          <button
            className="btn-add"
            onClick={handleAddItem}
            aria-label={`Agregar ${product.name}`}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      {product.image_url ? (
        <img
          className="product-img"
          src={product.image_url}
          alt={product.name}
          loading="lazy"
        />
      ) : (
        <div className="product-img-placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M7 11.5h10M7 14.5h10M8.5 8.5a3.5 3.5 0 0 1 7 0" />
          </svg>
        </div>
      )}
      <div className="product-body">
        <p className="product-name">{product.name}</p>
        {product.description && (
          <p className="product-desc">{product.description}</p>
        )}
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            className="btn-add"
            onClick={handleAddItem}
            aria-label={`Agregar ${product.name}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
