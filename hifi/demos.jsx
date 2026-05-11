// demos.jsx — switchable single-element demo container
const { useState: useStateDM } = React;

const DEMOS = [
  { id: 'ai',      num: '01', title: 'Personal AI Assistant',                       sub: 'Grounded chat — answers only from public knowledge about my work.',                comp: 'DemoAI' },
  { id: 'kb',      num: '02', title: 'Public Knowledge Base Audit + RAG Builder',   sub: 'Drop a URL — get an honest pipeline estimate (ETA, cost, confidence).',          comp: 'DemoKB' },
  { id: 'conlang', num: '03', title: 'Conlang + Audio Recognition',                 sub: '~150 generated words. Pick one, say it, see what was heard.',                    comp: 'DemoConlang' },
];

function Demos() {
  const [active, setActive] = useStateDM('ai');
  const cur = DEMOS.find((d) => d.id === active) || DEMOS[0];
  const Comp = window[cur.comp];

  return (
    <div>
      {/* tab strip */}
      <div className="surf" style={{ padding: 6, display: 'flex', gap: 4, marginBottom: 14, overflowX: 'auto' }}>
        {DEMOS.map((d) => {
          const isActive = d.id === active;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(d.id)}
              style={{
                flex: '1 1 0',
                minWidth: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 4,
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid',
                borderColor: isActive ? 'var(--accent)' : 'transparent',
                background: isActive ? 'color-mix(in oklab, var(--accent) 10%, transparent)' : 'transparent',
                color: 'var(--ink)',
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
                textAlign: 'left',
                transition: 'background .12s ease, border-color .12s ease',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--surf-2)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="mono" style={{ color: isActive ? 'var(--accent)' : 'var(--ink-4)' }}>module {d.num}</span>
                {isActive && <span className="dot live" />}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? 'var(--ink)' : 'var(--ink-2)' }}>
                {d.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* active demo header + body */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <span className="mono" style={{ color: 'var(--ink-4)' }}>module {cur.num} · active</span>
          <h3 style={{ margin: '2px 0 4px', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>{cur.title}</h3>
          <p style={{ margin: 0, color: 'var(--ink-3)', fontSize: 13.5, maxWidth: 720 }}>{cur.sub}</p>
        </div>
        <div className="mono" style={{ color: 'var(--ink-4)' }}>
          {DEMOS.findIndex((d) => d.id === active) + 1} / {DEMOS.length}
        </div>
      </div>
      {Comp ? <Comp /> : <div className="surf" style={{ padding: 24, color: 'var(--ink-3)' }}>loading…</div>}
    </div>
  );
}

window.Demos = Demos;
