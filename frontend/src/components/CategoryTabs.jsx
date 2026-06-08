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

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="category-tabs">
      {CATEGORIES.map(cat => (
        <button
          key={cat.key}
          className={`tab${active === cat.key ? ' active' : ''}`}
          onClick={() => onChange(cat.key)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
