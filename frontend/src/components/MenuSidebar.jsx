const CATEGORIES = [
  { key: 'promo',      label: 'Promos' },
  { key: 'burger',     label: 'Burgers' },
  { key: 'mila',       label: 'Milas' },
  { key: 'guarnicion', label: 'Guarniciones' },
  { key: 'bebida',     label: 'Bebidas' },
  { key: 'postre',     label: 'Postres' },
  { key: 'envasado',   label: 'Envasados' },
  { key: 'napoles',    label: 'Nápoles' },
];

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.key, c.label]));

export default function MenuSidebar({ categories, activeCategory, onCategoryClick }) {
  return (
    <aside className="menu-sidebar">
      {categories.map(cat => (
        <button
          key={cat}
          className={`menu-sidebar-item${activeCategory === cat ? ' active' : ''}`}
          onClick={() => onCategoryClick(cat)}
        >
          {CATEGORY_LABEL[cat]}
        </button>
      ))}
    </aside>
  );
}
