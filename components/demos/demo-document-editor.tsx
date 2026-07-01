"use client";

import { trackEvent } from "@/components/event-tracker";
import { useMessages } from "@/lib/i18n/provider";

const workflow = [
  { id: "upload", label: "Upload", detail: "DOCX/PDF sources stay preserved." },
  { id: "extract", label: "Extract", detail: "Headings, pages, tables, and paragraphs become fragments." },
  { id: "map", label: "Map", detail: "Fragments are assigned to target report sections." },
  { id: "draft", label: "Draft", detail: "Section text keeps citations back to source evidence." },
  { id: "export", label: "Export", detail: "The workspace produces a DOCX working package." },
] as const;

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
            <span className="mono" style={{ color: "var(--ink-4)", textTransform: "none", letterSpacing: ".02em" }}>
              {t.accessNote}
            </span>
          </div>

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
            {workflow.map((step, index) => (
              <div key={step.id} className="document-workflow-row">
                <span className="document-workflow-index mono">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <div className="document-workflow-label">{step.label}</div>
                  <p>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="surf-2 document-demo-boundary">
            <span className="mono">{t.boundaryLabel}</span>
            <p>{t.boundaryText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
