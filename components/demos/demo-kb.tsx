"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/components/event-tracker";
import { useMessages } from "@/lib/i18n/provider";
import type { Messages } from "@/lib/i18n/dictionaries";

const stages = [
  { id: "crawl", label: "crawl", detail: "fetch + dedupe pages" },
  { id: "validate", label: "validate", detail: "check robots.txt, content-type" },
  { id: "chunk", label: "chunk", detail: "semantic split / 800 tok" },
  { id: "embed", label: "embed", detail: "text-embedding-3-small" },
  { id: "evaluate", label: "evaluate", detail: "eval set / retrieval@k" },
] as const;

type StageId = (typeof stages)[number]["id"];
type Progress = Partial<Record<StageId, number>>;
type Result = {
  pages: number;
  tokens: number;
  estimatedCost: number;
  eta: string;
  confidence: number;
};

function validatePublicUrl(input: string, errors: Messages["demoKb"]["errors"]) {
  try {
    const url = new URL(input);
    if (!["http:", "https:"].includes(url.protocol)) return errors.protocol;
    if (/(^localhost$)|(^127\.)|(^0\.0\.0\.0$)|(^10\.)|(^192\.168\.)|(\.local$)/i.test(url.hostname)) {
      return errors.privateHost;
    }
    if (/example\.(com|org|net)$/i.test(url.hostname)) return errors.exampleHost;
    return null;
  } catch {
    return errors.invalid;
  }
}

export function DemoKB() {
  const m = useMessages();
  const t = m.demoKb;
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [progress, setProgress] = useState<Progress>({});
  const [active, setActive] = useState<StageId | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const cancelRef = useRef(false);

  async function run() {
    setError(null);
    setDone(false);
    setResult(null);
    setProgress({});
    setActive(null);
    cancelRef.current = false;

    const validation = validatePublicUrl(url, t.errors);
    if (validation) {
      setError(validation);
      trackEvent("audit_validation_failed", { reason: validation });
      return;
    }

    trackEvent("audit_started", { host: new URL(url).host, companyProvided: Boolean(company), emailProvided: Boolean(email) });
    const timings = [650, 460, 720, 820, 560];

    for (let index = 0; index < stages.length; index += 1) {
      if (cancelRef.current) return;
      const stage = stages[index];
      setActive(stage.id);
      const start = performance.now();
      const duration = timings[index];

      while (performance.now() - start < duration) {
        if (cancelRef.current) return;
        const percent = Math.min(1, (performance.now() - start) / duration);
        setProgress((current) => ({ ...current, [stage.id]: percent }));
        await new Promise((resolve) => setTimeout(resolve, 30));
      }

      setProgress((current) => ({ ...current, [stage.id]: 1 }));
    }

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email, company }),
      });
      const body = (await response.json()) as Result | { error: string };
      if (!response.ok || "error" in body) throw new Error("error" in body ? body.error : t.errors.auditFailed);
      setResult(body);
      setDone(true);
      setActive(null);
      trackEvent("audit_completed", { host: new URL(url).host });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.auditEstimateFailed);
      setActive(null);
    }
  }

  function reset() {
    cancelRef.current = true;
    setProgress({});
    setActive(null);
    setDone(false);
    setError(null);
    setResult(null);
  }

  const state = error ? "failure" : active ? "loading" : done ? "success" : url ? "default" : "empty";

  return (
    <div className="surf demo-shell">
      <div className="panel-header">
        <span className={`dot ${error ? "bad" : done ? "ok" : active ? "live" : ""}`} />
        <span className="mono" style={{ color: "var(--ink-2)" }}>
          kb_audit / rag-builder
        </span>
        <span className="state-chips">
          {["default", "loading", "success", "empty", "failure"].map((item) => (
            <span key={item} className="chip" style={{ opacity: item === state ? 1 : 0.35 }}>
              {item}
            </span>
          ))}
        </span>
      </div>

      <div className="two-pane equal">
        <div className="pane divider-right">
          <span className="mono">{t.inputs}</span>
          <div className="form-stack">
            <input
              placeholder={t.urlPlaceholder}
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="form-input mono-input"
            />
            <div className="form-row">
              <input placeholder={t.emailPlaceholder} value={email} onChange={(event) => setEmail(event.target.value)} className="form-input" />
              <input placeholder={t.companyPlaceholder} value={company} onChange={(event) => setCompany(event.target.value)} className="form-input" />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
              <button className="btn primary" type="button" onClick={() => void run()} disabled={Boolean(active)}>
                {active ? t.running : t.estimate}
              </button>
              <button className="btn" type="button" onClick={reset}>
                {t.reset}
              </button>
              {error ? (
                <span className="mono" style={{ color: "var(--bad)", alignSelf: "center" }}>
                  failure / {error}
                </span>
              ) : null}
            </div>
          </div>
          <p style={{ marginTop: 16, fontSize: 12.5, color: "var(--ink-3)" }}>
            {t.description}
          </p>
        </div>

        <div className="pane">
          <span className="mono">{t.pipeline}</span>
          <div className="pipeline-stack">
            {stages.map((stage) => {
              const percent = progress[stage.id] ?? 0;
              const isDone = percent >= 1;
              const isActive = active === stage.id;
              return (
                <div key={stage.id} className="pipeline-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className={`dot ${isDone ? "ok" : isActive ? "live" : ""}`} />
                    <span className="mono" style={{ color: isActive || isDone ? "var(--ink-2)" : "var(--ink-4)" }}>
                      {stage.label}
                    </span>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${percent * 100}%`, background: isDone ? "var(--ok)" : "var(--accent)" }} />
                  </div>
                  <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)", textAlign: "right" }}>
                    {Math.round(percent * 100)}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="output-grid">
            {[
              ["pages", result ? result.pages.toLocaleString() : "-"],
              ["eta", result ? result.eta : "-"],
              ["est. cost", result ? `$${result.estimatedCost.toFixed(0)}` : "-"],
              ["confidence", result ? result.confidence.toFixed(2) : "-"],
            ].map(([key, value]) => (
              <div key={key} className="surf-2 output-card">
                <span className="mono" style={{ fontSize: 10 }}>
                  {key}
                </span>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, letterSpacing: "-0.01em", color: result ? "var(--ink)" : "var(--ink-4)" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {result ? (
            <p className="mono" style={{ marginTop: 10, color: "var(--ink-4)", textTransform: "none", letterSpacing: ".02em", fontSize: 11 }}>
              chunked ~{result.tokens.toLocaleString()} tokens / qdrant collection / text-embedding-3-small / evals would run on your real eval set
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
