const tiles = [
  {
    label: "voice robots",
    value: "30+",
    hint: "launched into production",
    sub: "medical / retail / recruitment / finance / municipal",
  },
  {
    label: "rag accuracy",
    value: "70 -> 98%",
    hint: "3 pipelines / Qdrant + Zep",
    bar: 0.98,
  },
  {
    label: "deals supported",
    value: "$400K+",
    hint: "15+ technical audits + commercial proposals",
  },
  {
    label: "team scaled",
    value: "3 -> 10+",
    hint: "during automation team restructuring",
  },
];

const sectors = ["medical", "retail", "recruitment", "finance", "municipal infrastructure", "b2c support"];

export function Proof() {
  return (
    <section id="numbers" className="section-pad">
      <div className="container">
        <div className="sec-hd">
          <span className="num">01</span>
          <span className="name">numbers</span>
          <span className="rule" />
          <span className="mono" style={{ color: "var(--ink-4)" }}>
            anonymized / production figures
          </span>
        </div>

        <div className="proof-grid">
          {tiles.map((tile) => (
            <div key={tile.label} className="surf metric-card">
              <div className="metric-top">
                <span className="mono">{tile.label}</span>
                <span className="dot ok" />
              </div>
              <div className="metric-value">{tile.value}</div>
              {tile.bar !== undefined ? (
                <div className="metric-bar">
                  <span style={{ width: `${tile.bar * 100}%` }} />
                </div>
              ) : null}
              <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--ink-3)" }}>{tile.hint}</p>
              {tile.sub ? (
                <p className="mono" style={{ marginTop: 6, fontSize: 10.5, color: "var(--ink-4)", textTransform: "none", letterSpacing: ".02em" }}>
                  {tile.sub}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="surf-2 sector-strip">
          <span className="mono" style={{ color: "var(--ink-3)" }}>
            sectors shipped
          </span>
          <span style={{ color: "var(--ink-4)" }}>-&gt;</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {sectors.map((sector) => (
              <span key={sector} className="chip solid">
                {sector}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
