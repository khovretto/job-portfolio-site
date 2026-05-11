// demo-conlang.jsx — Conlang word generator + audio recognition
const { useState: useStateCL, useMemo: useMemoCL, useEffect: useEffectCL, useRef: useRefCL } = React;

// Phonotactics-driven generator (rule-based; no API)
const ONSETS = ['', 'k','t','p','m','n','s','sh','v','l','r','b','d','g','f','h','kr','tr','pr','sl','vr','mn','sk'];
const NUCLEI = ['a','e','i','o','u','ai','ei','ou','an','en','in'];
const CODAS = ['', '', '', 'n','sh','k','l','r','m','t','s'];
const SYLL_DIST = [1, 2, 2, 2, 3, 3, 4]; // weighted

function rand(arr, seedFn) { return arr[Math.floor(seedFn() * arr.length)]; }
function makeRng(seed) {
  let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
function genWord(rng) {
  const n = rand(SYLL_DIST, rng);
  let w = '';
  for (let i = 0; i < n; i++) {
    const o = rand(ONSETS, rng);
    const u = rand(NUCLEI, rng);
    const c = i === n - 1 ? rand(CODAS, rng) : rand(['', '', 'n', 's', 'l'], rng);
    w += o + u + c;
  }
  return w.replace(/(.)\1{2,}/g, '$1$1');
}
function genLexicon(count, seed) {
  const rng = makeRng(seed);
  const set = new Set();
  while (set.size < count) {
    const w = genWord(rng);
    if (w.length >= 3 && w.length <= 11) set.add(w);
  }
  return [...set].sort();
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 1; j <= n; j++) {
    let prev = dp[0]; dp[0] = j;
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i];
      dp[i] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[i - 1], dp[i]);
      prev = tmp;
    }
  }
  return dp[m];
}

function DemoConlang() {
  const [seed, setSeed] = useStateCL(0xCAFE);
  const lex = useMemoCL(() => genLexicon(150, seed), [seed]);
  const [q, setQ] = useStateCL('');
  const [picked, setPicked] = useStateCL(null);
  const [listening, setListening] = useStateCL(false);
  const [heard, setHeard] = useStateCL(null);
  const [err, setErr] = useStateCL(null);
  const recRef = useRefCL(null);
  const [supported, setSupported] = useStateCL(true);

  useEffectCL(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const r = new SR();
    r.continuous = false; r.interimResults = false; r.lang = 'en-US';
    r.onresult = (ev) => {
      const heardRaw = ev.results[0][0].transcript.trim().toLowerCase().replace(/[^a-z]/g, '');
      analyse(heardRaw);
    };
    r.onerror = (ev) => { setErr(ev.error || 'recognition failed'); setListening(false); };
    r.onend = () => setListening(false);
    recRef.current = r;
    return () => { try { r.abort(); } catch {} };
  }, []);

  const analyse = (heardRaw) => {
    const scored = lex
      .map((w) => ({ w, d: levenshtein(heardRaw, w) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 4);
    const best = scored[0];
    const conf = best ? Math.max(0, 1 - best.d / Math.max(3, best.w.length)) : 0;
    setHeard({ raw: heardRaw, best: best?.w, conf, alts: scored.slice(1).map((x) => x.w) });
  };

  const start = () => {
    if (!recRef.current) return;
    setErr(null); setHeard(null);
    try { recRef.current.start(); setListening(true); } catch (e) { setErr(e.message); }
  };
  const stop = () => { try { recRef.current?.stop(); } catch {} setListening(false); };

  const filtered = q
    ? lex.filter((w) => w.includes(q.toLowerCase()))
    : lex;

  return (
    <div className="surf" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-1)' }}>
        <span className={`dot ${listening ? 'live' : (heard ? 'ok' : (err ? 'bad' : ''))}`} />
        <span className="mono" style={{ color: 'var(--ink-2)' }}>conlang · 150 words · audio recognition</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="mono" style={{ color: 'var(--ink-4)' }}>seed 0x{seed.toString(16).toUpperCase()}</span>
          <button
            type="button"
            className="btn sm"
            onClick={() => { setSeed((Math.random() * 0xFFFFFF) | 0); setPicked(null); setHeard(null); setQ(''); }}
            title="Regenerate the lexicon with a new seed"
          >
            <span>↻</span><span>new set</span>
          </button>
          <span className="mono">{filtered.length} / {lex.length}</span>
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)' }}>
        {/* lexicon */}
        <div style={{ padding: 16, borderRight: '1px solid var(--line)' }}>
          <input
            placeholder="search the lexicon…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px', borderRadius: 6,
              border: '1px solid var(--line-2)', background: 'var(--bg-1)', color: 'var(--ink)',
              fontFamily: 'var(--mono)', fontSize: 12.5,
            }}
          />
          <div style={{ marginTop: 10, maxHeight: 280, overflow: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 4, padding: 6, border: '1px solid var(--line)', borderRadius: 6, background: 'var(--bg-1)' }}>
            {filtered.length === 0 && <span className="mono" style={{ color: 'var(--ink-4)', padding: 8 }}>no matches.</span>}
            {filtered.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setPicked(w)}
                className="chip"
                style={{
                  cursor: 'pointer',
                  borderColor: picked === w ? 'var(--accent)' : 'var(--line-2)',
                  color: picked === w ? 'var(--accent)' : 'var(--ink-2)',
                  background: 'transparent',
                  textAlign: 'left',
                }}
              >
                {w}
              </button>
            ))}
          </div>
          {picked && (
            <div className="surf-2" style={{ marginTop: 10, padding: 10 }}>
              <span className="mono">selected</span>
              <div style={{ marginTop: 4, fontFamily: 'var(--mono)', fontSize: 18, color: 'var(--ink)' }}>{picked}</div>
              <span className="mono" style={{ color: 'var(--ink-4)' }}>say it; the recognizer will tell you what it heard.</span>
            </div>
          )}
        </div>
        {/* recogniser */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="mono">audio · pick a word + say it</span>
          {!supported ? (
            <div className="surf-2" style={{ padding: 12, borderColor: 'var(--warn)' }}>
              <span className="mono" style={{ color: 'var(--warn)' }}>● failure</span>
              <p style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-2)' }}>
                Your browser doesn't support the Web Speech API. Try Chrome or Safari.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={listening ? stop : start}
                  className={listening ? 'btn primary' : 'btn'}
                  style={{ minWidth: 120 }}
                >
                  {listening ? '■ stop' : '● record'}
                </button>
                <Wave on={listening} />
              </div>
              {heard && (
                <div className="surf-2" style={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="mono">heard</span>
                    <span className="mono" style={{ color: 'var(--ink-4)' }}>conf {heard.conf.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginTop: 4 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 18, color: 'var(--ink)' }}>{heard.best || '—'}</span>
                    <span className="mono" style={{ color: 'var(--ink-4)' }}>raw: "{heard.raw}"</span>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {heard.alts.map((a) => <span key={a} className="chip">{a}</span>)}
                  </div>
                </div>
              )}
              {err && (
                <div className="surf-2" style={{ padding: 10, borderColor: 'var(--bad)' }}>
                  <span className="mono" style={{ color: 'var(--bad)' }}>● failure</span>
                  <p style={{ marginTop: 4, fontSize: 12.5, color: 'var(--ink-2)' }}>{err}</p>
                </div>
              )}
              {!heard && !listening && !err && (
                <p className="mono" style={{ color: 'var(--ink-4)', textTransform: 'none', letterSpacing: '.02em', fontSize: 12 }}>
                  empty · pick a word from the lexicon and try saying it. the recogniser scores closeness with edit distance.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Wave({ on }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 28 }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <span key={i} style={{
          width: 3, borderRadius: 99, background: on ? 'var(--accent)' : 'var(--ink-4)',
          height: on ? `${20 + Math.sin((i + Date.now() / 200)) * 8 + Math.random() * 14}px` : '6px',
          transition: 'height .12s ease',
          animation: on ? `wbar ${0.6 + (i % 5) * 0.15}s ease-in-out ${i * 0.04}s infinite alternate` : 'none',
        }} />
      ))}
      <style>{`@keyframes wbar{from{height:6px}to{height:24px}}`}</style>
    </div>
  );
}

window.DemoConlang = DemoConlang;
