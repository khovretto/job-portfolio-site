"use client";

import { useState } from "react";
import { DemoAI } from "@/components/demos/demo-ai";
import { DemoKB } from "@/components/demos/demo-kb";
import { DemoConlang } from "@/components/demos/demo-conlang";
import { trackEvent } from "@/components/event-tracker";
import { useMessages } from "@/lib/i18n/provider";

const demos = [
  { id: "ai", num: "01", component: DemoAI },
  { id: "kb", num: "02", component: DemoKB },
  { id: "conlang", num: "03", component: DemoConlang },
] as const;

export function Demos() {
  const m = useMessages();
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
                  {m.demos.module} {demo.num}
                </span>
                {isActive ? <span className="dot live" /> : null}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? "var(--ink)" : "var(--ink-2)" }}>
                {m.demos.items[demo.id].title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="demo-header">
        <div>
          <span className="mono" style={{ color: "var(--ink-4)" }}>
            {m.demos.module} {current.num} / {m.demos.active}
          </span>
          <h3 style={{ margin: "2px 0 4px", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {m.demos.items[current.id].title}
          </h3>
          <p style={{ margin: 0, color: "var(--ink-3)", fontSize: 13.5, maxWidth: 720 }}>
            {m.demos.items[current.id].sub}
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
