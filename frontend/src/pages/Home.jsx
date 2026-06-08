import { Link } from 'react-router-dom';
import Header from '../components/Header';

function BurgerIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 8C4 6 7.6 4.5 12 4.5S20 6 20 8" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="3" y1="14" x2="21" y2="14" />
      <path d="M5 17.5h14l-.5 1.5h-13L5 17.5z" />
    </svg>
  );
}

function PizzaIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 20h20L12 2z" />
      <path d="M7 15h10" />
      <circle cx="10" cy="17.5" r="1" fill="white" />
      <circle cx="14" cy="11" r="1" fill="white" />
    </svg>
  );
}

function JarIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
      <rect x="8" y="2" width="8" height="3" rx="1" />
      <path d="M6.5 5h11l-1.5 15a2 2 0 01-2 2h-5a2 2 0 01-2-2L6.5 5z" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8.5" y1="14" x2="15.5" y2="14" />
    </svg>
  );
}

function CategoryCard({ to, image, label, icon }) {
  return (
    <Link
      to={to}
      className="category-card"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="category-card-content">
        {icon}
        <span className="category-card-label">{label}</span>
      </div>
    </Link>
  );
}

const S = {
  accentLabel: {
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontSize: 13,
    fontWeight: 600,
  },
  sectionLabel: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: '0.15em',
    fontWeight: 600,
  },
  mutedText: {
    color: 'var(--text-muted)',
    lineHeight: 1.7,
    fontSize: 15,
  },
};

export default function Home() {
  return (
    <div>
      <Header />

      {/* ── Hero ─────────────────────────────── */}
      <section className="home-hero">
        {/* Watermark */}
        <span style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'Dancing Script', cursive",
          fontSize: '20vw',
          fontWeight: 700,
          color: '#fff',
          opacity: 0.04,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0,
          lineHeight: 1,
        }}>
          Martinos
        </span>

        {/* Social floating icons */}
        <div className="home-hero-socials">
          <a href="#" style={{ color: 'var(--text-muted)' }} aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
            </svg>
          </a>
          <a href="#" style={{ color: 'var(--text-muted)' }} aria-label="WhatsApp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
          </a>
          <a href="#" style={{ color: 'var(--text-muted)' }} aria-label="Ubicación">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </a>
        </div>

        <div className="home-hero-inner">
          {/* Left text */}
          <div className="home-hero-left">
            <span style={S.accentLabel}>SMASH BURGERS</span>
            <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, marginTop: 12, color: '#fff', textTransform: 'uppercase' }}>
              SABOR REAL,<br />EXPERIENCIA
            </h1>
            <p style={{ fontFamily: "'Dancing Script', cursive", color: 'var(--accent)', fontSize: 56, fontWeight: 700, lineHeight: 1.2, marginTop: 4 }}>
              Martinos
            </p>
            <p style={{ ...S.mutedText, maxWidth: 400, marginTop: 16, marginBottom: 32 }}>
              Las mejores smash burgers de Pando. Ingredientes frescos, sabor auténtico y entrega rápida a tu puerta.
            </p>
            <Link to="/menu" style={{
              display: 'inline-block',
              background: 'var(--accent)',
              color: '#000',
              fontWeight: 700,
              fontSize: 14,
              padding: '14px 32px',
              borderRadius: 4,
              textDecoration: 'none',
              letterSpacing: '0.07em',
            }}>
              PEDÍ AHORA
            </Link>
          </div>

          {/* Right image */}
          <div className="home-hero-right">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700"
              alt="Smash burger Martinos"
              style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 480 }}
            />
          </div>
        </div>
      </section>

      {/* ── Category cards ───────────────────── */}
      <section style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="home-category-grid">
          <CategoryCard
            to="/menu?cat=envasado"
            image="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600"
            label="Envasados"
            icon={<JarIcon />}
          />
          <CategoryCard
            to="/menu?cat=napoles"
            image="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"
            label="Nápoles"
            icon={<PizzaIcon />}
          />
          <CategoryCard
            to="/menu?cat=combo"
            image="https://images.unsplash.com/photo-1550547660-d9450f859349?w=600"
            label="Hamburguesas y Combos"
            icon={<BurgerIcon />}
          />
        </div>
      </section>

      {/* ── About ────────────────────────────── */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="home-about">
          <div>
            <img
              src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600"
              alt="Interior Martinos"
              style={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: 8, filter: 'grayscale(30%)' }}
            />
          </div>
          <div>
            <span style={S.sectionLabel}>SOBRE</span>
            <p style={{ fontFamily: "'Dancing Script', cursive", color: 'var(--accent)', fontSize: 48, fontWeight: 700, lineHeight: 1.1, margin: '8px 0 24px' }}>
              Martinos
            </p>
            <p style={{ ...S.mutedText, marginBottom: 16 }}>
              Somos un emprendimiento familiar de Pando con pasión por las smash burgers. Cada hamburguesa se prepara a pedido, con ingredientes frescos y recetas propias.
            </p>
            <p style={{ ...S.mutedText, marginBottom: 32 }}>
              También ofrecemos productos envasados artesanales y pizzas estilo Nápoles para una experiencia gastronómica completa sin salir de casa.
            </p>
            <button style={{
              background: 'transparent',
              border: '2px solid #fff',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              padding: '12px 28px',
              borderRadius: 4,
              letterSpacing: '0.07em',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              CONOCÉ MÁS
            </button>
          </div>
        </div>
      </section>

      {/* ── Info strip ───────────────────────── */}
      <div style={{ background: '#111111', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '32px 24px' }}>
        <div className="info-strip-inner">
          <div className="info-item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 4v4h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>20:30 a 00:30</span>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pagos</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Débito, Crédito, Efectivo</span>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zona de reparto</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Pando y alrededores</span>
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────── */}
      <footer style={{ background: '#0A0A0A', padding: '40px 24px' }}>
        <div className="footer-inner">
          <div>
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Martinos</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href="#" style={{ color: 'var(--text-muted)' }} aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              </a>
              <a href="#" style={{ color: 'var(--text-muted)' }} aria-label="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p style={{ color: '#fff', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.1em' }}>Contacto</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {
                  icon: <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1A19.5 19.5 0 013.1 10.8a19.8 19.8 0 01-3-8.6A2 2 0 012.2 0H5.2a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.4 2.1L6.1 7.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.9.6 2.8.7A2 2 0 0122 16.9z" />,
                  text: '094 573 638',
                },
                {
                  icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>,
                  text: 'Pando, Canelones',
                },
                {
                  icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
                  text: 'martinosgrill@gmail.com',
                },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round">
                    {icon}
                  </svg>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ color: '#fff', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.1em' }}>Horarios</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8 }}>Lunes a Domingo</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>20:30 a 00:30</p>
          </div>
        </div>

        <p style={{ textAlign: 'center', paddingTop: 24, fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          © 2024 MARTINOS GRILL · TODOS LOS DERECHOS RESERVADOS
        </p>
      </footer>
    </div>
  );
}
