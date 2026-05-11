// contact.jsx — contact panel
function Contact() {
  const links = [
    { k: 'email',    v: 'mkhovrov01@gmail.com', href: 'mailto:mkhovrov01@gmail.com', primary: true },
    { k: 'linkedin', v: 'in/maksim-khovrov-113633293', href: 'https://www.linkedin.com/in/maksim-khovrov-113633293/' },
    { k: 'github',   v: 'github.com/mkhovrov01', href: 'https://github.com/mkhovrov01' },
  ];
  return (
    <div className="surf" style={{ padding: 28, display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 24, alignItems: 'center' }}>
      <div>
        <span className="mono">contact</span>
        <h2 style={{ margin: '6px 0 8px', fontSize: 'clamp(28px, 3.4vw, 40px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          Hire a reliable AI engineer.
        </h2>
        <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: 15, maxWidth: 540 }}>
          Open to remote — AI development, automation, or technical product management. Based in Novi Sad (GMT+2), comfortable with EU + US-East overlap.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
          <a href="mailto:mkhovrov01@gmail.com" className="btn primary lg">✉ Email me</a>
          <a href="#cv-download" className="btn lg">↓ Download CV</a>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {links.map((l, i) => (
          <a key={l.k} href={l.href} target={l.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer noopener"
             style={{
               display: 'grid', gridTemplateColumns: '90px 1fr 24px', gap: 12, alignItems: 'center',
               padding: '14px 4px',
               borderTop: i === 0 ? 'none' : '1px dashed var(--line)',
               color: 'var(--ink)', transition: 'background .12s ease', borderRadius: 6,
             }}
          >
            <span className="mono">{l.k}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 13.5, color: l.primary ? 'var(--accent)' : 'var(--ink)' }}>{l.v}</span>
            <span style={{ color: 'var(--ink-4)', textAlign: 'right' }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
window.Contact = Contact;
