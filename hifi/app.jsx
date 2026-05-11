// app.jsx — main App for Hi-fi
const { useState, useEffect } = React;

const HIFI_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "#E63426",
  "density": "regular"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = window.useTweaks(HIFI_DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  return (
    <>
      <window.Nav theme={t.theme} onTheme={(v) => setTweak('theme', v)} />
      <main>
        <window.Hero />
        <window.Proof />
        {/* placeholder anchors — fill in next pass */}
        <section id="demos" style={{ padding: '40px 0' }}>
          <div className="container">
            <div className="sec-hd">
              <span className="num">§ 02</span>
              <span className="name">interactive demos</span>
              <span className="rule" />
            </div>
            {window.Demos ? <window.Demos /> : (
              <div className="surf" style={{ padding: 28, color: 'var(--ink-3)' }}>
                <span className="mono">module · loading</span>
                <p style={{ marginTop: 8 }}>Three interactive modules drop in here next: <strong style={{ color: 'var(--ink)' }}>Personal AI · KB Audit + RAG · Conlang + Audio</strong>.</p>
              </div>
            )}
          </div>
        </section>
        <section id="experience" style={{ padding: '40px 0' }}>
          <div className="container">
            <div className="sec-hd">
              <span className="num">§ 03</span>
              <span className="name">experience · operating model</span>
              <span className="rule" />
            </div>
            {window.Experience ? <window.Experience /> : null}
          </div>
        </section>
        <section id="stack" style={{ padding: '40px 0' }}>
          <div className="container">
            <div className="sec-hd">
              <span className="num">§ 04</span>
              <span className="name">technical stack</span>
              <span className="rule" />
            </div>
            {window.Stack ? <window.Stack /> : null}
          </div>
        </section>
        <section id="contact" style={{ padding: '40px 0 80px' }}>
          <div className="container">
            <div className="sec-hd">
              <span className="num">§ 05</span>
              <span className="name">contact</span>
              <span className="rule" />
            </div>
            {window.Contact ? <window.Contact /> : null}
          </div>
        </section>
      </main>

      <a href="#cv-download" className="btn primary floating-cv" aria-label="Download CV">
        <span>↓</span><span>CV</span>
      </a>

      <window.TweaksPanel>
        <window.TweakSection label="Theme" />
        <window.TweakRadio
          label="Mode"
          value={t.theme}
          options={['dark', 'light']}
          onChange={(v) => setTweak('theme', v)}
        />
        <window.TweakColor
          label="Accent"
          value={t.accent}
          options={['#E63426', '#FF6A3D', '#4FB3FF', '#86E08C', '#B8B8B8']}
          onChange={(v) => setTweak('accent', v)}
        />
      </window.TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
