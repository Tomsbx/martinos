import { useState, useEffect, useRef } from 'react';
import { getAllProductsAdmin, toggleProduct, createProduct, updateProductImage } from '../../api/adminApi';

const VALID_CATEGORIES = [
  'combo', 'burger', 'bebida', 'postre', 'envasado',
  'napoles', 'promo', 'mila', 'guarnicion',
];

const CATEGORY_LABELS = {
  combo:      'Combo',
  burger:     'Burger',
  bebida:     'Bebida',
  postre:     'Postre',
  envasado:   'Envasado',
  napoles:    'Nápoles',
  promo:      'Promo',
  mila:       'Mila',
  guarnicion: 'Guarnición',
};

const CATEGORY_COLORS = {
  combo:      { bg: '#1D3461', color: '#60A5FA' },
  burger:     { bg: '#3B1414', color: '#F87171' },
  bebida:     { bg: '#0E2D2D', color: '#22D3EE' },
  postre:     { bg: '#2D1B4E', color: '#C084FC' },
  envasado:   { bg: '#0D2D1A', color: '#4ADE80' },
  napoles:    { bg: '#3B2000', color: '#FB923C' },
  promo:      { bg: '#2D2A00', color: '#FDE047' },
  mila:       { bg: '#2D1800', color: '#FDBA74' },
  guarnicion: { bg: '#1A2800', color: '#BEF264' },
};

const EMPTY_FORM = { name: '', description: '', price: '', category: 'burger' };

function formatPrice(price) {
  return '$ ' + Math.round(Number(price)).toLocaleString('es-UY');
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [addImage, setAddImage] = useState(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const [uploadingId, setUploadingId] = useState(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    getAllProductsAdmin()
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

  function handleImageBtnClick(id) {
    setUploadingId(id);
    imageInputRef.current.value = '';
    imageInputRef.current.click();
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file || !uploadingId) { setUploadingId(null); return; }
    const fd = new FormData();
    fd.append('image', file);
    try {
      const updated = await updateProductImage(uploadingId, fd);
      setProducts(prev => prev.map(p => p.id === uploadingId ? updated : p));
    } catch (err) {
      console.error(err);
    }
    setUploadingId(null);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setAdding(true);
    setAddError('');
    try {
      const fd = new FormData();
      fd.append('name', addForm.name.trim());
      fd.append('description', addForm.description.trim());
      fd.append('price', addForm.price);
      fd.append('category', addForm.category);
      if (addImage) fd.append('image', addImage);
      const created = await createProduct(fd);
      setProducts(prev => [created, ...prev]);
      setAddForm(EMPTY_FORM);
      setAddImage(null);
      setShowForm(false);
    } catch (err) {
      setAddError(err.message || 'Error al crear producto');
    } finally {
      setAdding(false);
    }
  }

  const canSubmit = addForm.name.trim() &&
    addForm.price && !isNaN(Number(addForm.price)) && Number(addForm.price) > 0;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Productos</h1>
        <button
          onClick={() => { setShowForm(p => !p); setAddError(''); }}
          style={{
            padding: '8px 16px',
            background: showForm ? 'transparent' : '#111111',
            border: `1px solid ${showForm ? 'var(--border)' : '#ffffff'}`,
            borderRadius: 8,
            color: 'var(--text)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          {showForm ? 'Cancelar' : '+ Agregar producto'}
        </button>
      </div>

      {/* Hidden file input reutilizado por todos los botones "Cambiar imagen" */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />

      {/* Form: nuevo producto */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 16 }}>
            Nuevo producto
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Nombre *</label>
              <input
                className="form-input"
                value={addForm.name}
                onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Nombre del producto"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Precio *</label>
              <input
                className="form-input"
                type="number"
                min="1"
                step="1"
                value={addForm.price}
                onChange={e => setAddForm(p => ({ ...p, price: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 12 }}>
            <label>Descripción <span className="label-optional">(opcional)</span></label>
            <input
              className="form-input"
              value={addForm.description}
              onChange={e => setAddForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Ingredientes, variantes, etc."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Categoría *</label>
              <select
                className="form-input"
                value={addForm.category}
                onChange={e => setAddForm(p => ({ ...p, category: e.target.value }))}
                style={{ colorScheme: 'dark' }}
              >
                {VALID_CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Imagen <span className="label-optional">(opcional)</span></label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 14px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                }}
              >
                <CameraIcon />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {addImage ? addImage.name : 'Seleccionar...'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  style={{ display: 'none' }}
                  onChange={e => setAddImage(e.target.files[0] || null)}
                />
              </label>
            </div>
          </div>

          {addError && (
            <p className="checkout-error" style={{ marginTop: 12, marginBottom: 0 }}>{addError}</p>
          )}

          <button
            type="submit"
            className="btn-pay"
            disabled={!canSubmit || adding}
            style={{ marginTop: 16, opacity: (!canSubmit || adding) ? 0.5 : 1 }}
          >
            {adding ? 'Guardando...' : 'Guardar producto'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="admin-loading">Cargando...</div>
      ) : (
        <div className="product-admin-list">
          {products.map(product => {
            const cat = CATEGORY_COLORS[product.category] || { bg: '#222', color: '#888' };
            return (
              <div key={product.id} className={`product-admin-row${product.available ? '' : ' unavailable'}`}>

                {/* Thumbnail */}
                <div style={{ width: 44, height: 44, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#111' }}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <CameraIcon />
                    </div>
                  )}
                </div>

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
                  <button
                    onClick={() => handleImageBtnClick(product.id)}
                    disabled={uploadingId === product.id}
                    title="Cambiar imagen"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      color: 'var(--text-muted)',
                      fontSize: 12,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <CameraIcon />
                    {uploadingId === product.id ? '...' : 'Imagen'}
                  </button>
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
