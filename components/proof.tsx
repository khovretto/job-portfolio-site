import { CopyLink } from "@/components/copy-link";
import { getMessages } from "@/lib/i18n/server";

const tiles = [
  { id: "voiceRobots", value: "30+" },
  { id: "ragAccuracy", value: "70 -> 98%", bar: 0.98 },
  { id: "deals", value: "$400K+" },
  { id: "team", value: "3 -> 10+" },
] as const;

export async function Proof() {
  const m = await getMessages();
  return (
    <section id="numbers" className="section-pad">
      <div className="container">
        <div className="sec-hd">
          <span className="num">01</span>
          <span className="name">{m.proof.heading}</span>
          <CopyLink hash="numbers" />
          <span className="rule" />
          <span className="mono" style={{ color: "var(--ink-4)" }}>
            {m.proof.note}
          </span>
        </div>

        <div className="proof-grid">
          {tiles.map((tile) => {
            const copy = m.proof.tiles[tile.id];
            const sub = "sub" in copy ? copy.sub : undefined;
            return (
              <div key={tile.id} className="surf metric-card">
                <div className="metric-top">
                  <span className="mono">{copy.label}</span>
                  <span className="dot ok" />
                </div>
                <div className="metric-value">{tile.value}</div>
                {"bar" in tile ? (
                  <div className="metric-bar">
                    <span style={{ width: `${tile.bar * 100}%` }} />
                  </div>
                ) : null}
                <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--ink-3)" }}>{copy.hint}</p>
                {sub ? (
                  <p className="mono" style={{ marginTop: 6, fontSize: 10.5, color: "var(--ink-4)", textTransform: "none", letterSpacing: ".02em" }}>
                    {sub}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="surf-2 sector-strip">
          <span className="mono" style={{ color: "var(--ink-3)" }}>
            {m.proof.sectorsLabel}
          </span>
          <span style={{ color: "var(--ink-4)" }}>-&gt;</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {m.proof.sectors.map((sector) => (
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
