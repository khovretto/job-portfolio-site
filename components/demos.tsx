"use client";

import { useState } from "react";
import { DemoAI } from "@/components/demos/demo-ai";
import { DemoKB } from "@/components/demos/demo-kb";
import { DemoConlang } from "@/components/demos/demo-conlang";
import { trackEvent } from "@/components/event-tracker";

const demos = [
  {
    id: "ai",
    num: "01",
    title: "Personal AI Assistant",
    sub: "Grounded chat: answers only from public knowledge about my work.",
    component: DemoAI,
  },
  {
    id: "kb",
    num: "02",
    title: "Public Knowledge Base Audit + RAG Builder",
    sub: "Drop a URL and get an honest pipeline estimate: ETA, cost and confidence.",
    component: DemoKB,
  },
  {
    id: "conlang",
    num: "03",
    title: "Conlang + Audio Recognition",
    sub: "150 generated words. Pick one, say it, and see what was heard.",
    component: DemoConlang,
  },
] as const;

export function Demos() {
  const [active, setActive] = useState<(typeof demos)[number]["id"]>("ai");
  const current = demos.find((demo) => demo.id === active) || demos[0];
  const ActiveComponent = current.component;

  return (
    <div>
      <div className="surf demo-tabs" role="tablist" aria-label="Portfolio demo modules">
        {demos.map((demo) => {
          const isActive = demo.id === active;
          return (
            <button
              key={demo.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`demo-tab ${isActive ? "active" : ""}`}
              onClick={() => {
                setActive(demo.id);
                trackEvent("demo_tab", { demo: demo.id });
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="mono" style={{ color: isActive ? "var(--accent)" : "var(--ink-4)" }}>
                  module {demo.num}
                </span>
                {isActive ? <span className="dot live" /> : null}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? "var(--ink)" : "var(--ink-2)" }}>
                {demo.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="demo-header">
        <div>
          <span className="mono" style={{ color: "var(--ink-4)" }}>
            module {current.num} / active
          </span>
          <h3 style={{ margin: "2px 0 4px", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {current.title}
          </h3>
          <p style={{ margin: 0, color: "var(--ink-3)", fontSize: 13.5, maxWidth: 720 }}>
            {current.sub}
          </p>
        </div>
        <div className="mono" style={{ color: "var(--ink-4)" }}>
          {demos.findIndex((demo) => demo.id === active) + 1} / {demos.length}
        </div>
      </div>

      <ActiveComponent />
    </div>
  );
}
