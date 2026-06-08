import { useState, useEffect } from 'react';
import { getProducts, toggleProduct } from '../../api/adminApi';

const CATEGORY_LABELS = {
  combo: 'Combo',
  burger: 'Burger',
  bebida: 'Bebida',
  postre: 'Postre',
  envasado: 'Envasado',
  napoles: 'Nápoles',
};

const CATEGORY_COLORS = {
  combo:    { bg: '#1D3461', color: '#60A5FA' },
  burger:   { bg: '#3B1414', color: '#F87171' },
  bebida:   { bg: '#0E2D2D', color: '#22D3EE' },
  postre:   { bg: '#2D1B4E', color: '#C084FC' },
  envasado: { bg: '#0D2D1A', color: '#4ADE80' },
  napoles:  { bg: '#3B2000', color: '#FB923C' },
};

function formatPrice(price) {
  return '$ ' + Math.round(Number(price)).toLocaleString('es-UY');
}

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(id) {
    try {
      const updated = await toggleProduct(id);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Productos</h1>
      </div>

      {loading ? (
        <div className="admin-loading">Cargando...</div>
      ) : (
        <div className="product-admin-list">
          {products.map(product => {
            const cat = CATEGORY_COLORS[product.category] || { bg: '#222', color: '#888' };
            return (
              <div key={product.id} className={`product-admin-row${product.available ? '' : ' unavailable'}`}>
                <div className="product-admin-info">
                  <span className="product-admin-name">{product.name}</span>
                  <span
                    className="product-admin-badge"
                    style={{ background: cat.bg, color: cat.color }}
                  >
                    {CATEGORY_LABELS[product.category] || product.category}
                  </span>
                </div>
                <div className="product-admin-right">
                  <span className="product-admin-price">{formatPrice(product.price)}</span>
                  <button
                    className={`product-toggle${product.available ? ' on' : ' off'}`}
                    onClick={() => handleToggle(product.id)}
                    title={product.available ? 'Deshabilitar' : 'Habilitar'}
                    aria-label={product.available ? 'Deshabilitar producto' : 'Habilitar producto'}
                  >
                    <span className="product-toggle-thumb" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
