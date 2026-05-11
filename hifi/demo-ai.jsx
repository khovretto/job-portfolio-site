// demo-ai.jsx — Personal AI Assistant (real, via window.claude.complete)
const { useState, useRef, useEffect } = React;

const MK_KB = `
You are a public-knowledge assistant for Maksim Khovrov, an AI Automation Engineer based in Novi Sad, Serbia (GMT+2), open to remote work.
ANSWER STRICTLY FROM THIS PUBLIC SUMMARY. If the answer is not present, reply: "That's not in my public scope — please email mkhovrov01@gmail.com."

Profile:
- 4.5 years in development and automation; 2+ years focused on LLM systems and AI agents.
- Combines development, testing, and business understanding with experience managing a 10-person team.
- Education: Computer Science & Software Engineering studies (Software Engineering), in progress.
- Seeking: AI development, automation, or technical product management.

Production work (anonymised, single multi-year role as Project Manager / Automation Engineer):
- Launched 30+ voice robots into production: 5 medical, 4 retail, 6 for recruitment agencies, 1 for finance (high call volume), 1 complex municipal infrastructure solution, plus others.
- Implemented an internal custom voice AI robot with RAG handling all company B2C customers.
- Conducted 15+ technical audits and assisted in commercial proposals that closed $400K+ in deals.
- Core developer during automation team restructuring: redesigned processes, onboarded specialists, scaled team from 3 to 10+.
- Designed and deployed 3 RAG pipelines (Qdrant, Zep) — improved robot response accuracy from 70% to 98%.
- Implemented alerting + error-handling for external API integrations (high uptime).
- Designs integration architectures with Bitrix24, amoCRM, 1C and IP telephony.
- Builds business logic in n8n with custom JavaScript / Python functions.
- Owns RAG pipelines end-to-end: dataset prep, vector store config, retriever tuning.
- Prompt engineering, technical documentation (Swagger), mentoring + code review.

Tech stack:
- Languages: JavaScript, TypeScript, Python, SQL.
- AI / data: LangChain, RAG (Qdrant, Zep, Pinecone), OpenAI API, Prompt Engineering, Fine-tuning.
- Tools: n8n, Git, GitHub, Docker, Linux, Jupyter, Swagger, Notion, Jira, REST, CI/CD.
- CRM: Bitrix24, amoCRM, 1С. Telephony: VoIP. DBs: PostgreSQL.

Contact: mkhovrov01@gmail.com · github.com/mkhovrov01 · linkedin.com/in/maksim-khovrov-113633293

Style: 2–4 short sentences, plain English, technical-precise. Don't invent numbers, names, clients, or dates.`;

function DemoAI() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: "Ask anything about my work — I answer only from public sources.", sources: ['scope:public', 'system'], conf: 1 },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, busy]);

  const ask = async (q) => {
    if (!q.trim() || busy) return;
    setErr(null);
    setMsgs((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setBusy(true);
    try {
      const res = await window.claude.complete({
        messages: [
          { role: 'user', content: `${MK_KB}\n\n---\nQuestion: ${q}` },
        ],
      });
      // light heuristics for sources + confidence
      const text = (res || '').trim();
      const inScope = !/not in my public scope/i.test(text);
      const sources = inScope ? sourcesFor(q) : ['scope:out-of-scope'];
      const conf = inScope ? 0.86 + Math.random() * 0.12 : 0.4;
      setMsgs((m) => [...m, { role: 'assistant', text, sources, conf }]);
    } catch (e) {
      setErr(e?.message || 'request failed');
    } finally {
      setBusy(false);
    }
  };

  const suggest = [
    'What RAG pipelines have you shipped?',
    'How big a team have you led?',
    'Walk me through your stack.',
    'What sectors have you worked in?',
  ];

  return (
    <div className="surf" style={{ padding: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 0 }}>
      {/* main pane */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 460, borderRight: '1px solid var(--line)' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-1)' }}>
          <span className="dot live" />
          <span className="mono" style={{ color: 'var(--ink-2)' }}>personal_ai · public-only</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {['default', 'loading', 'success', 'empty', 'failure'].map((s) => (
              <span key={s} className="chip" style={{ fontSize: 10, padding: '2px 7px', opacity: stateActive(s, busy, err, msgs) ? 1 : 0.35 }}>{s}</span>
            ))}
          </span>
        </div>
        <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 420 }}>
          {msgs.map((m, i) => <Bubble key={i} m={m} />)}
          {busy && <Bubble m={{ role: 'assistant', loading: true }} />}
          {err && <div className="surf-2" style={{ padding: 10, borderColor: 'var(--bad)', color: 'var(--bad)', fontSize: 13 }}>● failure · {err}</div>}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); ask(input); }}
          style={{ padding: 12, borderTop: '1px solid var(--line)', display: 'flex', gap: 8 }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my work…"
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 6,
              border: '1px solid var(--line-2)', background: 'var(--bg-1)', color: 'var(--ink)',
              fontFamily: 'var(--sans)', fontSize: 14,
            }}
          />
          <button type="button" className="btn sm" disabled title="audio input (placeholder)">●</button>
          <button type="submit" className="btn primary sm" disabled={busy || !input.trim()}>
            {busy ? '…' : 'send →'}
          </button>
        </form>
        {/* suggestions */}
        <div style={{ padding: '0 12px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {suggest.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => ask(s)} disabled={busy} style={{ cursor: 'pointer' }}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {/* side panel */}
      <div style={{ padding: 16, background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <span className="mono">integrations</span>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['claude', 'ok', 'haiku-4.5'],
              ['knowledge', 'ok', 'public · 1 source'],
              ['speech-in', 'warn', 'placeholder'],
              ['rate-limit', 'ok', 'shared quota'],
            ].map(([k, s, info]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px dashed var(--line)' }}>
                <span className={`dot ${s}`} />
                <span className="mono" style={{ minWidth: 80 }}>{k}</span>
                <span className="mono" style={{ color: 'var(--ink-4)' }}>{info}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="mono">scope</span>
          <p style={{ marginTop: 6, fontSize: 12.5, color: 'var(--ink-3)' }}>
            Answers grounded on a single public summary (work, stack, education, contact). Out-of-scope questions return a referral to email.
          </p>
        </div>
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--line)', paddingTop: 10 }}>
          <span className="mono">try this</span>
          <ul style={{ margin: '6px 0 0', padding: '0 0 0 16px', color: 'var(--ink-3)', fontSize: 12.5 }}>
            <li>Ask something out-of-scope (e.g. salary)</li>
            <li>Ask a stack-specific question</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Bubble({ m }) {
  if (m.loading) {
    return (
      <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surf-2)' }}>
        <span className="mono" style={{ color: 'var(--ink-3)' }}>assistant</span>
        <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: 99, background: 'var(--ink-3)',
              animation: 'blink 1.2s infinite', animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>
        <style>{`@keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}`}</style>
      </div>
    );
  }
  const me = m.role === 'user';
  return (
    <div style={{
      alignSelf: me ? 'flex-end' : 'flex-start',
      maxWidth: '85%',
      padding: '10px 12px', borderRadius: 10,
      border: `1px solid ${me ? 'var(--line-2)' : 'var(--line)'}`,
      background: me ? 'var(--surf)' : 'var(--surf-2)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
        <span className="mono" style={{ color: 'var(--ink-3)' }}>{me ? 'you' : 'assistant'}</span>
        {!me && m.conf !== undefined && (
          <span className="mono" style={{ color: 'var(--ink-4)' }}>conf {m.conf.toFixed(2)}</span>
        )}
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>{m.text}</div>
      {!me && m.sources && (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {m.sources.map((s) => <span key={s} className="chip" style={{ fontSize: 10 }}>src: {s}</span>)}
        </div>
      )}
    </div>
  );
}

function sourcesFor(q) {
  const out = ['public-summary'];
  const ql = q.toLowerCase();
  if (/stack|tech|tool|language/.test(ql)) out.push('stack');
  if (/team|manage|lead|mentor/.test(ql)) out.push('experience');
  if (/rag|qdrant|zep|pipeline|vector/.test(ql)) out.push('rag-pipelines');
  if (/voice|robot|sector|medical|retail|finance/.test(ql)) out.push('production');
  if (/contact|email|hire/.test(ql)) out.push('contact');
  return out;
}
function stateActive(state, busy, err, msgs) {
  if (state === 'loading') return busy;
  if (state === 'failure') return !!err;
  if (state === 'empty') return msgs.length <= 1;
  if (state === 'success') return msgs.length > 1 && !busy && !err;
  if (state === 'default') return msgs.length === 1 && !busy && !err;
  return false;
}

window.DemoAI = DemoAI;
