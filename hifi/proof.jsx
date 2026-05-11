// proof.jsx — production proof tiles + sectors strip
function Proof() {
  const tiles = [
    {
      label: 'voice robots',
      value: '30+',
      hint: 'launched into production',
      sub: 'medical · retail · recruitment · finance · municipal',
    },
    {
      label: 'rag accuracy',
      value: '70 → 98%',
      hint: '3 pipelines · Qdrant + Zep',
      bar: 0.98,
    },
    {
      label: 'deals supported',
      value: '$400K+',
      hint: '15+ technical audits + commercial proposals',
    },
    {
      label: 'team scaled',
      value: '3 → 10+',
      hint: 'during automation team restructuring',
    },
  ];

  return (
    <section id="numbers" style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="sec-hd">
          <span className="num">§ 01</span>
          <span className="name">numbers</span>
          <span className="rule" />
          <span className="mono" style={{ color: 'var(--ink-4)' }}>anonymised · production figures</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          {tiles.map((t) => (
            <div key={t.label} className="surf" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono">{t.label}</span>
                <span className="dot ok" />
              </div>
              <div style={{
                fontSize: 'clamp(28px, 3.2vw, 40px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginTop: 14,
                lineHeight: 1,
              }}>
                {t.value}
              </div>
              {t.bar !== undefined && (
                <div style={{ marginTop: 14, height: 4, borderRadius: 99, background: 'var(--surf-2)', border: '1px solid var(--line)', overflow: 'hidden' }}>
                  <div style={{ width: `${t.bar * 100}%`, height: '100%', background: 'var(--accent)' }} />
                </div>
              )}
              <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--ink-3)' }}>{t.hint}</p>
              {t.sub && (
                <p className="mono" style={{ marginTop: 6, fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'none', letterSpacing: '.02em' }}>{t.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* sectors strip */}
        <div className="surf-2" style={{ marginTop: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span className="mono" style={{ color: 'var(--ink-3)' }}>sectors shipped</span>
          <span style={{ color: 'var(--ink-4)' }}>→</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['medical', 'retail', 'recruitment', 'finance', 'municipal infrastructure', 'b2c support'].map((s) => (
              <span key={s} className="chip solid">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.Proof = Proof;
