const wins = [
  "Launched 30+ voice robots into production across medical, retail, recruitment, finance and municipal sectors.",
  "Designed and deployed 3 RAG pipelines with Qdrant and Zep, improving reported response accuracy from 70% to 98%.",
  "Stood up an internal voice AI with RAG for company B2C customer interactions.",
  "Conducted 15+ technical audits and supported commercial proposals that closed $400K+ in deals.",
  "Core developer through restructuring: onboarded specialists and scaled the team from 3 to 10+.",
];

const responsibilities = [
  "Integration architecture with Bitrix24, amoCRM, 1C and IP telephony.",
  "Custom business logic in n8n with JavaScript and Python functions.",
  "RAG pipeline ownership: dataset prep, vector store config, retriever tuning.",
  "Prompt engineering and scenario design for higher LLM accuracy.",
  "Alerting and error handling for external APIs.",
  "Mentoring, code review, internal knowledge-base maintenance.",
];

const loop = [
  ["01", "requirements + decomposition", "Translate ambiguous asks into specs and testable cases."],
  ["02", "integration architecture", "Sketch data flow, external systems and failure modes before coding."],
  ["03", "build + ship", "Use JS, Python and n8n with version control, review and runbooks."],
  ["04", "evaluate + tune", "Use eval sets, prompt iteration, retriever tuning and latency budgets."],
  ["05", "monitor + handoff", "Add alerting, Swagger docs and knowledge transfer to the next owner."],
];

export function Experience() {
  return (
    <div className="experience-grid">
      <div className="surf" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <div>
            <span className="mono">role</span>
            <h3 style={{ margin: "4px 0 2px", fontSize: 20, fontWeight: 600 }}>
              Project Manager / Automation Engineer
            </h3>
            <span style={{ color: "var(--ink-3)", fontSize: 13.5 }}>[Company anonymized]</span>
          </div>
          <span className="mono">2020 - 2024 / 4 yrs 5 mo</span>
        </div>
        <hr className="hr" style={{ margin: "14px 0" }} />
        <span className="mono">key wins</span>
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
        <span className="mono">responsibilities</span>
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
        <span className="mono">how i operate</span>
        <h3 style={{ margin: "4px 0 14px", fontSize: 20, fontWeight: 600 }}>Operating loop</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {loop.map(([num, title, description], index) => (
            <div
              key={num}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: 10,
                padding: "12px 0",
                borderTop: index === 0 ? "none" : "1px dashed var(--line)",
              }}
            >
              <span className="mono" style={{ color: "var(--accent)" }}>
                {num}
              </span>
              <div>
                <div style={{ fontWeight: 500, color: "var(--ink)" }}>{title}</div>
                <div style={{ color: "var(--ink-3)", fontSize: 13, marginTop: 2 }}>{description}</div>
              </div>
            </div>
          ))}
        </div>
        <hr className="hr" style={{ margin: "16px 0" }} />
        <span className="mono">education</span>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 14.5, color: "var(--ink)", fontWeight: 500 }}>
            Computer Science and Software Engineering studies
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Software Engineering</div>
        </div>
      </div>
    </div>
  );
}
