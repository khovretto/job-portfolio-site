// experience.jsx — experience + operating loop
function Experience() {
  const role = {
    company: '[Company — anonymised]',
    title: 'Project Manager / Automation Engineer',
    period: '2020 — 2024 · 4 yrs 5 mo',
  };
  const wins = [
    'Launched 30+ voice robots into production across medical, retail, recruitment, finance and municipal sectors.',
    'Designed and deployed 3 RAG pipelines (Qdrant, Zep) — improved response accuracy from 70% to 98%.',
    'Stood up an internal voice AI with RAG handling all company B2C customer interactions.',
    'Conducted 15+ technical audits and supported commercial proposals that closed $400K+ in deals.',
    'Core developer through restructuring — onboarded specialists, scaled the team from 3 to 10+.',
  ];
  const responsibilities = [
    'Integration architecture (Bitrix24, amoCRM, 1С, IP telephony).',
    'Custom business logic in n8n with JavaScript / Python functions.',
    'RAG pipeline ownership: dataset prep, vector store config, retriever tuning.',
    'Prompt engineering and scenario design for higher LLM accuracy.',
    'Alerting + error-handling for external APIs (high uptime).',
    'Mentoring, code review, internal knowledge-base maintenance.',
  ];
  const loop = [
    ['01', 'requirements + decomposition', 'Translate ambiguous asks into typed specs and test cases.'],
    ['02', 'integration architecture', 'Sketch data flow, external systems, failure modes — before coding.'],
    ['03', 'build + ship', 'JS / Python / n8n. Version control, code review, runbooks.'],
    ['04', 'evaluate + tune', 'Eval sets, prompt iteration, retriever tuning, latency budget.'],
    ['05', 'monitor + handoff', 'Alerting, Swagger docs, knowledge transfer to the next owner.'],
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 16 }}>
      <div className="surf" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <span className="mono">role</span>
            <h3 style={{ margin: '4px 0 2px', fontSize: 20, fontWeight: 600 }}>{role.title}</h3>
            <span style={{ color: 'var(--ink-3)', fontSize: 13.5 }}>{role.company}</span>
          </div>
          <span className="mono">{role.period}</span>
        </div>
        <hr className="hr" style={{ margin: '14px 0' }} />
        <span className="mono">key wins</span>
        <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
          {wins.map((w, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--ink-2)' }}>
              <span className="mono" style={{ color: 'var(--accent)', flex: 'none', width: 20 }}>0{i + 1}</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
        <hr className="hr" style={{ margin: '16px 0' }} />
        <span className="mono">responsibilities</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          {responsibilities.map((r) => (
            <div key={r} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-3)' }}>
              <span style={{ color: 'var(--ink-4)', flex: 'none' }}>·</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="surf" style={{ padding: 22 }}>
        <span className="mono">how i operate</span>
        <h3 style={{ margin: '4px 0 14px', fontSize: 20, fontWeight: 600 }}>Operating loop</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {loop.map(([n, t, d], i) => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 10, padding: '12px 0', borderTop: i === 0 ? 'none' : '1px dashed var(--line)' }}>
              <span className="mono" style={{ color: 'var(--accent)' }}>{n}</span>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--ink)' }}>{t}</div>
                <div style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 2 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        <hr className="hr" style={{ margin: '16px 0' }} />
        <span className="mono">education</span>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 14.5, color: 'var(--ink)', fontWeight: 500 }}>
            MIREA — Russian Technological University
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
            Moscow · Computer Science &amp; Software Engineering
          </div>
        </div>
      </div>
    </div>
  );
}

window.Experience = Experience;
