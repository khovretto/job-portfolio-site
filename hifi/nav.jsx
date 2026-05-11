// nav.jsx — sticky top nav
const { useEffect, useState } = React;

function Nav({ onTheme, theme }) {
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const ids = ['hero', 'numbers', 'demos', 'experience', 'stack', 'contact'];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#hero" className="brand">
          <span className="mark">MK</span>
          <span>Maksim Khovrov</span>
          <span className="mono" style={{ color: 'var(--ink-4)', marginLeft: 4 }}>· AI Automation Engineer</span>
        </a>
        <div className="nav-links">
          {[
            ['numbers', '01 / numbers'],
            ['demos', '02 / demos'],
            ['experience', '03 / experience'],
            ['stack', '04 / stack'],
            ['contact', '05 / contact'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} style={active === id ? { color: 'var(--ink)', background: 'var(--surf)' } : {}}>
              {label}
            </a>
          ))}
        </div>
        <div className="nav-cta">
          <span className="status">
            <span className="dot ok live" />
            <span>open to remote</span>
          </span>
          <button
            className="btn sm"
            onClick={() => onTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <span style={{ fontSize: 13 }}>{theme === 'dark' ? '☾' : '☀'}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
          </button>
          <a href="#cv-download" className="btn primary sm">
            <span>↓</span><span>CV.pdf</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

window.Nav = Nav;
