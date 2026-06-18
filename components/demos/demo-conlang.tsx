"use client";

import { useMemo, useRef, useState } from "react";
import { trackEvent } from "@/components/event-tracker";
import { useMessages } from "@/lib/i18n/provider";

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const onsets = ["", "k", "t", "p", "m", "n", "s", "sh", "v", "l", "r", "b", "d", "g", "f", "h", "kr", "tr", "pr", "sl", "vr", "mn", "sk"];
const nuclei = ["a", "e", "i", "o", "u", "ai", "ei", "ou", "an", "en", "in"];
const codas = ["", "", "", "n", "sh", "k", "l", "r", "m", "t", "s"];
const syllableDistribution = [1, 2, 2, 2, 3, 3, 4];

function makeRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function choose<T>(items: T[], rng: () => number) {
  return items[Math.floor(rng() * items.length)];
}

function generateWord(rng: () => number) {
  const syllables = choose(syllableDistribution, rng);
  let word = "";
  for (let index = 0; index < syllables; index += 1) {
    const onset = choose(onsets, rng);
    const nucleus = choose(nuclei, rng);
    const coda = index === syllables - 1 ? choose(codas, rng) : choose(["", "", "n", "s", "l"], rng);
    word += onset + nucleus + coda;
  }
  return word.replace(/(.)\1{2,}/g, "$1$1");
}

function generateLexicon(count: number, seed: number) {
  const rng = makeRng(seed);
  const words = new Set<string>();
  while (words.size < count) {
    const word = generateWord(rng);
    if (word.length >= 3 && word.length <= 11) words.add(word);
  }
  return [...words].sort();
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;

  const dp = Array.from({ length: m + 1 }, (_, index) => index);
  for (let j = 1; j <= n; j += 1) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= m; i += 1) {
      const tmp = dp[i];
      dp[i] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[i - 1], dp[i]);
      prev = tmp;
    }
  }
  return dp[m];
}

type Heard = {
  raw: string;
  best: string;
  confidence: number;
  alternatives: string[];
};

export function DemoConlang() {
  const m = useMessages();
  const t = m.demoConlang;
  const [seed, setSeed] = useState(0xcafe);
  const lexicon = useMemo(() => generateLexicon(150, seed), [seed]);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<Heard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechConstructor =
    typeof window === "undefined" ? undefined : window.SpeechRecognition || window.webkitSpeechRecognition;
  const supported = Boolean(speechConstructor);

  function analyze(raw: string) {
    const scored = lexicon
      .map((word) => ({ word, distance: levenshtein(raw, word) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4);
    const best = scored[0];
    const confidence = best ? Math.max(0, 1 - best.distance / Math.max(3, best.word.length)) : 0;
    setHeard({
      raw,
      best: best?.word || "",
      confidence,
      alternatives: scored.slice(1).map((item) => item.word),
    });
    trackEvent("conlang_recognized", { confidence: Number(confidence.toFixed(2)) });
  }

  function start() {
    if (!speechConstructor) return;
    if (!recognitionRef.current) {
      const recognizer = new speechConstructor();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = "en-US";
      recognizer.onresult = (event) => {
        const raw = event.results[0][0].transcript.trim().toLowerCase().replace(/[^a-z]/g, "");
        analyze(raw);
      };
      recognizer.onerror = (event) => {
        setError(event.error || "recognition failed");
        setListening(false);
      };
      recognizer.onend = () => setListening(false);
      recognitionRef.current = recognizer;
    }
    setError(null);
    setHeard(null);
    try {
      recognitionRef.current.start();
      setListening(true);
      trackEvent("conlang_record_start", { picked });
    } catch (err) {
      setError(err instanceof Error ? err.message : "recognition failed");
    }
  }

  function stop() {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore browser-specific stop failures.
    }
    setListening(false);
  }

  const filtered = query ? lexicon.filter((word) => word.includes(query.toLowerCase())) : lexicon;

  return (
    <div className="surf demo-shell">
      <div className="panel-header">
        <span className={`dot ${listening ? "live" : heard ? "ok" : error ? "bad" : ""}`} />
        <span className="mono" style={{ color: "var(--ink-2)" }}>
          conlang / 150 words / audio recognition
        </span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="mono" style={{ color: "var(--ink-4)" }}>
            seed 0x{seed.toString(16).toUpperCase()}
          </span>
          <button
            type="button"
            className="btn sm"
            onClick={() => {
              try {
                recognitionRef.current?.abort();
              } catch {
                // Ignore browser-specific abort failures.
              }
              recognitionRef.current = null;
              setSeed((Math.random() * 0xffffff) | 0);
              setPicked(null);
              setHeard(null);
              setQuery("");
              trackEvent("conlang_regenerate");
            }}
            title={t.newSet}
          >
            {t.newSet}
          </button>
          <span className="mono">
            {filtered.length} / {lexicon.length}
          </span>
        </span>
      </div>

      <div className="two-pane">
        <div className="pane divider-right">
          <input
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="form-input mono-input"
          />
          <div className="lexicon-grid">
            {filtered.length === 0 ? (
              <span className="mono" style={{ color: "var(--ink-4)", padding: 8 }}>
                {t.noMatches}
              </span>
            ) : null}
            {filtered.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => setPicked(word)}
                className="chip"
                style={{
                  borderColor: picked === word ? "var(--accent)" : "var(--line-2)",
                  color: picked === word ? "var(--accent)" : "var(--ink-2)",
                  background: "transparent",
                }}
              >
                {word}
              </button>
            ))}
          </div>
          {picked ? (
            <div className="surf-2" style={{ marginTop: 10, padding: 10 }}>
              <span className="mono">{t.selected}</span>
              <div style={{ marginTop: 4, fontFamily: "var(--mono)", fontSize: 18, color: "var(--ink)" }}>{picked}</div>
              <span className="mono" style={{ color: "var(--ink-4)" }}>
                {t.selectedHint}
              </span>
            </div>
          ) : null}
        </div>

        <div className="pane" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="mono">{t.audioLabel}</span>
          {!supported ? (
            <div className="surf-2" style={{ padding: 12, borderColor: "var(--warn)" }}>
              <span className="mono" style={{ color: "var(--warn)" }}>
                failure
              </span>
              <p style={{ marginTop: 6, fontSize: 13, color: "var(--ink-2)" }}>
                {t.unsupported}
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button type="button" onClick={listening ? stop : start} className={listening ? "btn primary" : "btn"} style={{ minWidth: 120 }}>
                  {listening ? t.stop : t.record}
                </button>
                <Wave on={listening} />
              </div>
              {heard ? (
                <div className="surf-2" style={{ padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="mono">{t.heard}</span>
                    <span className="mono" style={{ color: "var(--ink-4)" }}>
                      conf {heard.confidence.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 18, color: "var(--ink)" }}>{heard.best || "-"}</span>
                    <span className="mono" style={{ color: "var(--ink-4)", textTransform: "none" }}>
                      raw: &quot;{heard.raw}&quot;
                    </span>
                  </div>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {heard.alternatives.map((alternative) => (
                      <span key={alternative} className="chip">
                        {alternative}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {error ? (
                <div className="surf-2" style={{ padding: 10, borderColor: "var(--bad)" }}>
                  <span className="mono" style={{ color: "var(--bad)" }}>
                    failure
                  </span>
                  <p style={{ marginTop: 4, fontSize: 12.5, color: "var(--ink-2)" }}>{error}</p>
                </div>
              ) : null}
              {!heard && !listening && !error ? (
                <p className="mono" style={{ color: "var(--ink-4)", textTransform: "none", letterSpacing: ".02em", fontSize: 12 }}>
                  {t.emptyHint}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Wave({ on }: { on: boolean }) {
  return (
    <div className={`wave ${on ? "on" : ""}`} aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          style={{
            height: on ? undefined : 6,
            animationDelay: `${index * 0.04}s`,
          }}
        />
      ))}
    </div>
  );
}
