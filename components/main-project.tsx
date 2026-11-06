"use client";

import { trackEvent } from "@/components/event-tracker";
import { ProjectTour } from "@/components/project-tour";
import { useMessages } from "@/lib/i18n/provider";

const stack = "FastAPI / React + TypeScript / SQLite / TipTap / Docling + OCR / Docker";

export function MainProject() {
  const t = useMessages().mainProject;

  return (
    <div className="project-stack">
      <div className="project-intro">
        <div>
          <div className="project-title-row">
            <h3 className="project-title">{t.title}</h3>
            <span className="chip accent">
              <span className="dot live" />
              {t.status}
            </span>
          </div>
          <p className="project-lede">{t.lede}</p>
        </div>
        <div className="project-cta">
          <a
            className="btn primary"
            href="https://editor.khovrov.dev"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("document_editor_opened", { target: "editor.khovrov.dev" })}
          >
            {t.openDemo}
          </a>
          <p className="project-note">{t.accessNote}</p>
        </div>
      </div>

      <ProjectTour />

      <div className="surf-2 project-footer">
        <p className="mono project-stack-line">{stack}</p>
        <p className="project-boundary">{t.boundary}</p>
      </div>
    </div>
  );
}
