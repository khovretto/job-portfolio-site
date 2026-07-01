"use client";

import { trackEvent } from "@/components/event-tracker";
import { useMessages } from "@/lib/i18n/provider";

const stats = [
  ["runtime", "FastAPI + React"],
  ["template", "103 sections"],
  ["sources", "DOCX / PDF"],
  ["status", "deployed"],
] as const;

export function DemoDocumentEditor() {
  const m = useMessages();
  const t = m.demoDocumentEditor;

  return (
    <div className="surf demo-shell document-demo">
      <div className="panel-header">
        <span className="dot ok" />
        <span className="mono" style={{ color: "var(--ink-2)" }}>
          document_editor / evidence workspace
        </span>
        <span className="state-chips">
          <span className="chip accent">{t.chips.liveDemo}</span>
          <span className="chip">{t.chips.protected}</span>
          <span className="chip">{t.chips.sanitized}</span>
        </span>
      </div>

      <div className="two-pane document-demo-layout">
        <div className="pane divider-right">
          <span className="mono">{t.problemLabel}</span>
          <h4 className="document-demo-title">{t.title}</h4>
          <p className="document-demo-copy">{t.body}</p>

          <div className="document-demo-actions">
            <a
              className="btn primary"
              href="https://editor.khovrov.dev"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("document_editor_opened", { target: "editor.khovrov.dev" })}
            >
              {t.openDemo}
            </a>
          </div>
          <p className="document-demo-access">{t.accessNote}</p>

          <div className="output-grid document-demo-stats">
            {stats.map(([key, value]) => (
              <div key={key} className="surf-2 output-card">
                <span className="mono" style={{ fontSize: 10 }}>
                  {key}
                </span>
                <div className="document-demo-stat-value">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pane">
          <span className="mono">{t.workflowLabel}</span>
          <div className="document-workflow">
            {t.steps.map((step, index) => (
              <div key={step.label} className="document-workflow-row">
                <span className="document-workflow-index mono">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <div className="document-workflow-label">{step.label}</div>
                  <p>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
