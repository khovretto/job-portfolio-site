"use client";

import type { ReactNode } from "react";
import { useMessages } from "@/lib/i18n/provider";

// Lightweight copies of product screens with made-up data. Everything is text and CSS, so the tour stays
// sharp at any zoom, is translated with the site and weighs almost nothing.
// `data-spot` marks what the tour highlights on each screen.

export type TourScreen = "agent" | "ai" | "formatting" | "templates" | "library" | "extraction" | "release";

type Mock = ReturnType<typeof useMessages>["mainProject"]["tour"]["mock"];

function Shell({ mock, active, children }: { mock: Mock; active: number; children: ReactNode }) {
  return (
    <>
      <div className="pm-top">
        <span className="pm-mark">{mock.mark}</span>
        <nav className="pm-nav">
          {mock.nav.map((item, index) => (
            <span key={item} className={index === active ? "is-on" : ""}>
              {item}
            </span>
          ))}
        </nav>
        <span className="pm-project">{mock.project}</span>
      </div>
      <div className="pm-body">{children}</div>
    </>
  );
}

function AgentScreen({ mock }: { mock: Mock }) {
  const s = mock.agent;
  return (
    <Shell mock={mock} active={6}>
      <div className="pm-split pm-split-agent">
        <div className="pm-card">
          <div className="pm-card-head">
            <strong>{s.sandboxTitle}</strong>
            <span className="pm-pill is-ok">{s.sandboxScore}</span>
          </div>
          <p className="pm-note">{s.sandboxNote}</p>
          <div className="pm-rows">
            {s.scenarios.map((row) => (
              <div key={row.name} className="pm-row">
                <span className={`pm-dot ${row.ok ? "is-ok" : "is-bad"}`} />
                <span className="pm-grow">{row.name}</span>
                <span className="pm-faint">{row.check}</span>
              </div>
            ))}
          </div>
          <div className="pm-flow">
            {s.loop.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
        </div>
        <div className="pm-card pm-dock" data-spot>
          <div className="pm-card-head">
            <strong>{s.dockTitle}</strong>
            <span className="pm-pill">{s.area}</span>
          </div>
          <div className="pm-msg">
            <span className="pm-chip">{s.linkChip}</span> {s.message}
          </div>
          <div className="pm-trace">
            {s.trace.map((step) => (
              <code key={step}>{step}</code>
            ))}
          </div>
          <div className="pm-proposal">
            <span className="pm-faint">{s.proposalKind}</span>
            <strong>{s.proposalTitle}</strong>
            <div className="pm-diff">
              <s>{s.oldValue}</s> <b>{s.newValue}</b>
            </div>
            <span className="pm-faint">{s.proposalSource}</span>
            <div className="pm-actions">
              <span className="pm-btn is-primary">{s.accept}</span>
              <span className="pm-btn">{s.edit}</span>
              <span className="pm-btn">{s.reject}</span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function AiScreen({ mock }: { mock: Mock }) {
  const s = mock.ai;
  return (
    <Shell mock={mock} active={6}>
      <div className="pm-split pm-split-ai" data-spot>
        <div className="pm-card">
          <strong>{s.title}</strong>
          <div className="pm-rows">
            {s.surfaces.map((surface, index) => (
              <div key={surface.name} className={`pm-row ${index === 0 ? "is-on" : ""}`}>
                <span className="pm-grow">{surface.name}</span>
                <span className="pm-count">{surface.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pm-card">
          <div className="pm-rows">
            {s.actions.map((action, index) => (
              <div key={action} className={`pm-row ${index === 0 ? "is-on" : ""}`}>
                <span className="pm-grow">{action}</span>
                <span className="pm-switch" />
              </div>
            ))}
          </div>
        </div>
        <div className="pm-card">
          <strong>{s.actions[0]}</strong>
          <p className="pm-note">{s.chainTitle}</p>
          <div className="pm-chain">
            {s.chain.map((level, index) => (
              <span key={level} className={index === 2 ? "is-on" : ""}>
                {level}
              </span>
            ))}
          </div>
          <div className="pm-kv">
            {s.params.map((param) => (
              <div key={param.key}>
                <span className="pm-faint">{param.key}</span>
                <strong>{param.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function FormattingScreen({ mock }: { mock: Mock }) {
  const s = mock.formatting;
  return (
    <Shell mock={mock} active={3}>
      <div className="pm-split pm-split-format">
        <div className="pm-card">
          <strong>{s.blocksTitle}</strong>
          <div className="pm-rows">
            {s.blocks.map((block, index) => (
              <div key={block} className={`pm-row ${index === 2 ? "is-on" : ""}`}>
                <span className="pm-grow">{block}</span>
              </div>
            ))}
          </div>
          <p className="pm-note">{s.blocksNote}</p>
        </div>
        <div className="pm-card" data-spot>
          <div className="pm-card-head">
            <strong>{s.title}</strong>
            <span className="pm-pill">{s.version}</span>
          </div>
          <p className="pm-note">{s.inherits}</p>
          <div className="pm-rows">
            {s.rules.map((rule) => (
              <div key={rule.name} className="pm-row">
                <span className="pm-grow">{rule.name}</span>
                <strong>{rule.value}</strong>
                <span className="pm-chip">{rule.source}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pm-outputs">
          <div className="pm-sheet">
            <span className="pm-sheet-label">{s.tableLabel}</span>
            <div className="pm-sheet-table">
              {Array.from({ length: 12 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            <span className="pm-line" />
            <span className="pm-line" />
            <span className="pm-line is-short" />
          </div>
          <div className="pm-actions">
            <span className="pm-btn is-primary">PDF</span>
            <span className="pm-btn is-primary">DOCX</span>
          </div>
          <span className="pm-faint">{s.outputsNote}</span>
        </div>
      </div>
    </Shell>
  );
}

function TemplatesScreen({ mock }: { mock: Mock }) {
  const s = mock.templates;
  return (
    <Shell mock={mock} active={0}>
      <div className="pm-split pm-split-template">
        <div className="pm-card">
          <div className="pm-card-head">
            <strong>{s.title}</strong>
            <span className="pm-pill is-ok">{s.version}</span>
          </div>
          <div className="pm-rows">
            {s.tree.map((node, index) => (
              <div key={node.name} className={`pm-row pm-depth-${node.depth} ${index === 3 ? "is-on" : ""}`}>
                <span className="pm-grow">{node.name}</span>
                <span className="pm-faint">{node.tag}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pm-stack">
          <div className="pm-card" data-spot>
            <strong>{s.tree[3].name}</strong>
            <div className="pm-kv">
              {s.fields.map((field) => (
                <div key={field.key}>
                  <span className="pm-faint">{field.key}</span>
                  <strong>{field.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="pm-card">
            <strong>{s.projectsTitle}</strong>
            <div className="pm-flow">
              {s.migration.map((step) => (
                <span key={step}>{step}</span>
              ))}
            </div>
            <div className="pm-rows">
              {s.projects.map((project) => (
                <div key={project.name} className="pm-row">
                  <span className="pm-grow">{project.name}</span>
                  <span className="pm-faint">{project.version}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function LibraryScreen({ mock }: { mock: Mock }) {
  const s = mock.library;
  return (
    <Shell mock={mock} active={2}>
      <div className="pm-card pm-act">
        <strong>{s.act}</strong>
        <span className="pm-pill is-ok">{s.inForce}</span>
        <span className="pm-faint">{s.counts}</span>
      </div>
      <div className="pm-split pm-split-library">
        <div className="pm-card">
          <div className="pm-rows">
            {s.clauses.map((clause, index) => (
              <div key={clause.name} className={`pm-row ${index === 1 ? "is-on" : ""}`}>
                <span className="pm-count">{clause.name}</span>
                <span className="pm-grow">{clause.text}</span>
                <span className={`pm-pill ${clause.done ? "is-ok" : ""}`}>{clause.state}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pm-card" data-spot>
          <strong>{s.clauses[1].name}</strong>
          <p className="pm-condition">{s.condition}</p>
          <ul className="pm-items">
            {s.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className="pm-faint">{s.questionLabel}</span>
          <strong className="pm-question">{s.question}</strong>
          <span className="pm-faint">{s.usedLabel}</span>
          <div className="pm-flow">
            {s.used.map((use) => (
              <span key={use}>{use}</span>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ExtractionScreen({ mock }: { mock: Mock }) {
  const s = mock.extraction;
  return (
    <Shell mock={mock} active={1}>
      <div className="pm-split pm-split-source">
        <div className="pm-card">
          <strong>{s.railTitle}</strong>
          <div className="pm-rows">
            {s.fragments.map((fragment, index) => (
              <div key={fragment.name} className={`pm-row ${index === 2 ? "is-on" : ""}`}>
                <span className="pm-faint">{fragment.type}</span>
                <span className="pm-grow">{fragment.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pm-page">
          <div className="pm-box">
            <em>{s.boxes[0]}</em>
            <span className="pm-line is-title" />
          </div>
          <div className="pm-box">
            <em>{s.boxes[1]}</em>
            <span className="pm-line" />
            <span className="pm-line" />
            <span className="pm-line is-short" />
          </div>
          <div className="pm-box is-on" data-spot>
            <em>{s.boxes[2]}</em>
            <div className="pm-sheet-table">
              {Array.from({ length: 12 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
          </div>
          <div className="pm-box">
            <em>{s.boxes[3]}</em>
            <span className="pm-line" />
            <span className="pm-line is-short" />
          </div>
        </div>
        <div className="pm-card">
          <strong>{s.journalTitle}</strong>
          <p className="pm-note">{s.journalNote}</p>
          <div className="pm-trace">
            {s.operations.map((operation) => (
              <code key={operation}>{operation}</code>
            ))}
          </div>
          <div className="pm-actions">
            <span className="pm-btn is-primary">{s.verify}</span>
            <span className="pm-btn">{s.flag}</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ReleaseScreen({ mock }: { mock: Mock }) {
  const s = mock.release;
  return (
    <Shell mock={mock} active={4}>
      <div className="pm-split pm-split-release" data-spot>
        <div className="pm-card">
          <div className="pm-card-head">
            <strong>{s.title}</strong>
            <span className="pm-pill">{s.forecast}</span>
          </div>
          <div className="pm-rows">
            {s.checks.map((check) => (
              <div key={check.name} className="pm-row">
                <span className={`pm-dot ${check.state === "ok" ? "is-ok" : check.state === "bad" ? "is-bad" : "is-warn"}`} />
                <span className="pm-grow">{check.name}</span>
                <span className="pm-faint">{check.note}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pm-card">
          <strong>{s.revisionsTitle}</strong>
          <div className="pm-rows">
            {s.revisions.map((revision) => (
              <div key={revision.name} className="pm-row">
                <span className="pm-grow">{revision.name}</span>
                <code>{revision.hash}</code>
              </div>
            ))}
          </div>
          <div className="pm-rows">
            {s.files.map((file) => (
              <div key={file} className="pm-row">
                <span className="pm-grow">{file}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

const screens: Record<TourScreen, (props: { mock: Mock }) => ReactNode> = {
  agent: AgentScreen,
  ai: AiScreen,
  formatting: FormattingScreen,
  templates: TemplatesScreen,
  library: LibraryScreen,
  extraction: ExtractionScreen,
  release: ReleaseScreen,
};

export function TourScreens({ order, active }: { order: TourScreen[]; active: TourScreen }) {
  const mock = useMessages().mainProject.tour.mock;
  return (
    <>
      {order.map((id) => {
        const Screen = screens[id];
        return (
          <div key={id} data-screen={id} className={`pm ${id === active ? "is-active" : ""}`}>
            <Screen mock={mock} />
          </div>
        );
      })}
    </>
  );
}
