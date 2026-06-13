import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/api';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import NavDrawer from '../components/NavDrawer';
import ProductCard from '../components/ProductCard';
import CartBar from '../components/CartBar';
import StoreHero from '../components/StoreHero';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

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

const CATEGORY_ORDER = CATEGORIES.map(c => c.key);
const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.key, c.label]));

export default function Menu() {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(catParam || 'promo');
  const [navOpen, setNavOpen] = useState(false);

  const sectionRefs = useRef({});
  const visibleSections = useRef(new Set());

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Scrollspy
  useEffect(() => {
    if (loading) return;
    visibleSections.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const cat = entry.target.dataset.category;
          if (entry.isIntersecting) {
            visibleSections.current.add(cat);
          } else {
            visibleSections.current.delete(cat);
          }
        });
        const first = CATEGORY_ORDER.find(cat => visibleSections.current.has(cat));
        if (first) setActiveCategory(first);
      },
      { threshold: 0.3 }
    );

    CATEGORY_ORDER.forEach(cat => {
      const el = sectionRefs.current[cat];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  function scrollWithOffset(el) {
    const navbarHeight = 56;
    const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Scroll to section from URL param on initial load
  useEffect(() => {
    if (loading || !catParam) return;
    const el = sectionRefs.current[catParam];
    if (el) scrollWithOffset(el);
  }, [loading, catParam]);

  function scrollToSection(cat) {
    if (cat === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = sectionRefs.current[cat];
    if (el) scrollWithOffset(el);
  }

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = products.filter(p => p.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const availableCategories = Object.keys(grouped);
  const availableCategoryObjects = CATEGORIES.filter(c => availableCategories.includes(c.key));

  return (
    <div style={{ paddingTop: '56px' }}>
      <Navbar onMenuOpen={() => setNavOpen(true)} />
      <NavDrawer
        open={navOpen}
        onClose={() => setNavOpen(false)}
        categories={availableCategoryObjects}
        onCategoryClick={scrollToSection}
      />
      <Header />
      <StoreHero />
      <div className="menu-content">
        {loading ? (
          <div className="menu-section-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        ) : (
          availableCategories.map(cat => (
            <div
              key={cat}
              ref={el => { sectionRefs.current[cat] = el; }}
              data-category={cat}
              className="menu-section"
            >
              <h2 className="menu-section-title">{CATEGORY_LABEL[cat]}</h2>
              {cat === 'burger' && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Todas las burgers vienen con papas 🍟
                </p>
              )}
              <div className="menu-section-grid">
                {grouped[cat].map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
      <CartBar />
      <WhatsAppButton />
    </div>
  );
}
