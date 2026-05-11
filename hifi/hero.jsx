// hero.jsx — identity-led hero
function Hero() {
  return (
    <section id="hero" style={{ paddingTop: 56, paddingBottom: 28 }}>
      <div className="container">
        {/* identity row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          {/* small placeholder portrait */}
          <div
            aria-label="portrait placeholder"
            style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'var(--surf)',
              border: '1px solid var(--line-2)',
              backgroundImage: 'repeating-linear-gradient(135deg, color-mix(in oklab, var(--ink-4) 50%, transparent) 0 1px, transparent 1px 6px)',
              flex: 'none',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 11 }}>// portfolio · v1 · 2026</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--ink-2)' }}>
              <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Maksim Khovrov</strong>
              <span style={{ color: 'var(--ink-4)' }}>·</span>
              <span>Novi Sad, Serbia</span>
              <span style={{ color: 'var(--ink-4)' }}>·</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>GMT+2</span>
            </div>
          </div>
        </div>

        {/* the statement */}
        <h1 style={{ margin: '0 0 20px', maxWidth: 1040, letterSpacing: '-0.02em', fontWeight: 600 }}>
          <span style={{
            display: 'block',
            fontSize: 'clamp(28px, 4vw, 48px)',
            lineHeight: 1.08,
            color: 'var(--ink-2)',
            fontWeight: 500,
            marginBottom: 10,
          }}>
            AI Automation Engineer
          </span>
          <span style={{
            display: 'block',
            fontSize: 'clamp(40px, 6.6vw, 84px)',
            lineHeight: 1.02,
            color: 'var(--ink)',
          }}>
            building <span style={{ color: 'var(--accent)' }}>production voice agents</span>, <span style={{ color: 'var(--accent)' }}>RAG systems</span> &amp; automation workflows.
          </span>
        </h1>

        {/* subline */}
        <p style={{
          fontSize: 16.5,
          color: 'var(--ink-2)',
          margin: '0 0 28px',
          maxWidth: 720,
        }}>
          4.5 years in development and automation, with 2+ years focused on LLM systems and AI agents.
          I combine engineering, evaluation and business judgement; I&rsquo;ve managed a team of 10. Open to remote.
        </p>

        {/* CTA row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 18 }}>
          <a href="#cv-download" className="btn primary lg" id="cv-download">
            <span>↓</span><span>Download CV</span>
          </a>
          <a href="#demos" className="btn lg">
            <span>Try the demos</span><span>→</span>
          </a>
          <a href="#contact" className="btn ghost lg">Contact</a>
          <span style={{ flex: 1 }} />
          <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 11 }}>
            press <span className="kbd">⌘</span>+<span className="kbd">K</span> · or scroll ↓
          </span>
        </div>

        {/* tag rail */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {['Voice agents', 'RAG (Qdrant · Zep)', 'n8n', 'LangChain', 'OpenAI', 'Python', 'TypeScript', 'Bitrix24 · amoCRM · 1С', 'Prompt Engineering'].map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
