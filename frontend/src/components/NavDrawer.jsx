export default function NavDrawer({ open, onClose, categories, onCategoryClick }) {
  function handleCategoryClick(key) {
    onCategoryClick(key);
    onClose();
  }

  return (
    <>
      <div className={`nav-drawer-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`nav-drawer${open ? ' open' : ''}`}>
        <div className="nav-drawer-header">
          <span className="nav-drawer-title">Categorías</span>
          <button className="nav-drawer-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <nav className="nav-drawer-list">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              className="nav-drawer-item"
              onClick={() => handleCategoryClick(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
