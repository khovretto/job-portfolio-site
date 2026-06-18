import { getMessages } from "@/lib/i18n/server";

export async function Experience() {
  const m = await getMessages();
  const { wins, responsibilities, loop } = m.experience;
  return (
    <div className="experience-grid">
      <div className="surf" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span className="mono">{m.experience.roleLabel}</span>
            <h3 style={{ margin: "4px 0 2px", fontSize: 20, fontWeight: 600 }}>
              {m.experience.roleTitle}
            </h3>
            <span style={{ color: "var(--ink-3)", fontSize: 13.5 }}>{m.experience.company}</span>
          </div>
          <span className="mono">{m.experience.period}</span>
        </div>
        <hr className="hr" style={{ margin: "14px 0" }} />
        <span className="mono">{m.experience.keyWinsLabel}</span>
        <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
          {wins.map((win, index) => (
            <li key={win} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--ink-2)" }}>
              <span className="mono" style={{ color: "var(--accent)", flex: "none", width: 20 }}>
                0{index + 1}
              </span>
              <span>{win}</span>
            </li>
          ))}
        </ul>
        <hr className="hr" style={{ margin: "16px 0" }} />
        <span className="mono">{m.experience.responsibilitiesLabel}</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8, marginTop: 8 }}>
          {responsibilities.map((item) => (
            <div key={item} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--ink-3)" }}>
              <span style={{ color: "var(--ink-4)", flex: "none" }}>/</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="surf" style={{ padding: 22 }}>
        <span className="mono">{m.experience.operateLabel}</span>
        <h3 style={{ margin: "4px 0 14px", fontSize: 20, fontWeight: 600 }}>{m.experience.operateTitle}</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {loop.map((step, index) => (
            <div
              key={step.title}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: 10,
                padding: "12px 0",
                borderTop: index === 0 ? "none" : "1px dashed var(--line)",
              }}
            >
              <span className="mono" style={{ color: "var(--accent)" }}>
                0{index + 1}
              </span>
              <div>
                <div style={{ fontWeight: 500, color: "var(--ink)" }}>{step.title}</div>
                <div style={{ color: "var(--ink-3)", fontSize: 13, marginTop: 2 }}>{step.description}</div>
              </div>
            </div>
          ))}
        </div>
        <hr className="hr" style={{ margin: "16px 0" }} />
        <span className="mono">{m.experience.educationLabel}</span>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 14.5, color: "var(--ink)", fontWeight: 500 }}>
            {m.experience.educationTitle}
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{m.experience.educationSub}</div>
        </div>
      </div>
    </div>
  );
}
