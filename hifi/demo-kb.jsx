// demo-kb.jsx — KB Audit + RAG Builder (simulated pipeline)
const { useState: useStateKB, useRef: useRefKB } = React;

const STAGES = [
  { id: 'crawl',    label: 'crawl',    detail: 'fetch + dedupe pages' },
  { id: 'validate', label: 'validate', detail: 'check robots.txt, content-type' },
  { id: 'chunk',    label: 'chunk',    detail: 'semantic split · 800 tok' },
  { id: 'embed',    label: 'embed',    detail: 'text-embedding-3-small' },
  { id: 'evaluate', label: 'evaluate', detail: 'eval set · retrieval@k' },
];

function DemoKB() {
  const [url, setUrl] = useStateKB('');
  const [email, setEmail] = useStateKB('');
  const [company, setCompany] = useStateKB('');
  const [progress, setProgress] = useStateKB({}); // {id: 0..1}
  const [active, setActive] = useStateKB(null);
  const [done, setDone] = useStateKB(false);
  const [err, setErr] = useStateKB(null);
  const [result, setResult] = useStateKB(null);
  const cancelRef = useRefKB(false);

  const validate = (u) => {
    try {
      const x = new URL(u);
      if (!['http:', 'https:'].includes(x.protocol)) return 'Only http/https URLs allowed.';
      if (/localhost|127\.|0\.0\.0\.0|^192\.168\.|^10\.|\.local$/.test(x.host)) return 'Private / local hosts are blocked.';
      if (/example\.(com|org|net)$/.test(x.host)) return 'example.* is blocked — use a real public URL.';
      return null;
    } catch {
      return 'That doesn\'t look like a valid URL.';
    }
  };

  const run = async () => {
    setErr(null); setDone(false); setResult(null); setProgress({}); setActive(null);
    cancelRef.current = false;
    const v = validate(url);
    if (v) { setErr(v); return; }
    // realistic-ish per-stage timing (ms)
    const timings = [900, 600, 1100, 1500, 800];
    for (let i = 0; i < STAGES.length; i++) {
      if (cancelRef.current) return;
      setActive(STAGES[i].id);
      const t0 = performance.now();
      const dur = timings[i];
      while (performance.now() - t0 < dur) {
        if (cancelRef.current) return;
        const p = Math.min(1, (performance.now() - t0) / dur);
        setProgress((s) => ({ ...s, [STAGES[i].id]: p }));
        await new Promise((r) => setTimeout(r, 30));
      }
      setProgress((s) => ({ ...s, [STAGES[i].id]: 1 }));
    }
    setActive(null);
    setDone(true);
    // derive output
    const host = (() => { try { return new URL(url).host; } catch { return ''; } })();
    const seedHash = [...host].reduce((a, c) => a + c.charCodeAt(0), 0);
    const pages = 80 + (seedHash % 220);
    const tokens = pages * 700;
    const cost = (tokens / 1000) * 0.02 + 4;
    const eta = `${Math.max(1, Math.round(pages / 60))}h`;
    const conf = 0.78 + ((seedHash % 18) / 100);
    setResult({ pages, tokens, cost, eta, conf });
  };

  const reset = () => { cancelRef.current = true; setProgress({}); setActive(null); setDone(false); setErr(null); setResult(null); };

  const stateLabel = err ? 'failure' : (active ? 'loading' : done ? 'success' : (url ? 'default' : 'empty'));

  return (
    <div className="surf" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-1)' }}>
        <span className={`dot ${err ? 'bad' : (done ? 'ok' : (active ? 'live' : ''))}`} />
        <span className="mono" style={{ color: 'var(--ink-2)' }}>kb_audit · rag-builder</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['default', 'loading', 'success', 'empty', 'failure'].map((s) => (
            <span key={s} className="chip" style={{ fontSize: 10, padding: '2px 7px', opacity: s === stateLabel ? 1 : 0.35 }}>{s}</span>
          ))}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)', gap: 0 }}>
        {/* form */}
        <div style={{ padding: 18, borderRight: '1px solid var(--line)' }}>
          <span className="mono">inputs</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            <KBInput placeholder="https://your-public-site.com" value={url} onChange={setUrl} mono />
            <div style={{ display: 'flex', gap: 8 }}>
              <KBInput placeholder="email (optional)" value={email} onChange={setEmail} />
              <KBInput placeholder="company (optional)" value={company} onChange={setCompany} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button className="btn primary" onClick={run} disabled={!!active}>
                {active ? 'running…' : 'estimate →'}
              </button>
              <button className="btn" onClick={reset}>reset</button>
              {err && <span className="mono" style={{ color: 'var(--bad)', alignSelf: 'center' }}>● {err}</span>}
            </div>
          </div>
          <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--ink-3)' }}>
            This simulates the same audit I'd run for a client engagement: scope, chunk, embed, and a quick retrieval eval — with a confidence number so estimates aren't fictional.
          </p>
        </div>
        {/* pipeline */}
        <div style={{ padding: 18 }}>
          <span className="mono">pipeline</span>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STAGES.map((s) => {
              const p = progress[s.id] ?? 0;
              const isDone = p >= 1;
              const isActive = active === s.id;
              return (
                <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 36px', gap: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className={`dot ${isDone ? 'ok' : (isActive ? 'live' : '')}`} />
                    <span className="mono" style={{ color: isActive || isDone ? 'var(--ink-2)' : 'var(--ink-4)' }}>{s.label}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: 'var(--surf-2)', border: '1px solid var(--line)', overflow: 'hidden' }}>
                    <div style={{ width: `${p * 100}%`, height: '100%', background: isDone ? 'var(--ok)' : 'var(--accent)', transition: 'width .04s linear' }} />
                  </div>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', textAlign: 'right' }}>{Math.round(p * 100)}%</span>
                </div>
              );
            })}
          </div>
          {/* output */}
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              ['pages',      result ? result.pages.toLocaleString() : '—'],
              ['eta',        result ? result.eta : '—'],
              ['est. cost',  result ? `$${result.cost.toFixed(0)}` : '—'],
              ['confidence', result ? result.conf.toFixed(2) : '—'],
            ].map(([k, v]) => (
              <div key={k} className="surf-2" style={{ padding: 10 }}>
                <span className="mono" style={{ fontSize: 10 }}>{k}</span>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, letterSpacing: '-0.01em', color: result ? 'var(--ink)' : 'var(--ink-4)' }}>{v}</div>
              </div>
            ))}
          </div>
          {result && (
            <p className="mono" style={{ marginTop: 10, color: 'var(--ink-4)', textTransform: 'none', letterSpacing: '.02em', fontSize: 11 }}>
              chunked ~{result.tokens.toLocaleString()} tokens · qdrant collection · text-embedding-3-small · evals would run on your real eval set
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function KBInput({ placeholder, value, onChange, mono }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        flex: 1, padding: '9px 12px', borderRadius: 6,
        border: '1px solid var(--line-2)', background: 'var(--bg-1)', color: 'var(--ink)',
        fontFamily: mono ? 'var(--mono)' : 'var(--sans)', fontSize: mono ? 12.5 : 14,
      }}
    />
  );
}

window.DemoKB = DemoKB;
