"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/components/event-tracker";

const links = [
  ["numbers", "01 / numbers"],
  ["demos", "02 / demos"],
  ["experience", "03 / experience"],
  ["stack", "04 / stack"],
  ["contact", "05 / contact"],
] as const;

export function Nav() {
  const [active, setActive] = useState("hero");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const ids = ["hero", "numbers", "demos", "experience", "stack", "contact"];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#hero" className="brand">
          <span className="mark">MK</span>
          <span>Maksim Khovrov</span>
          <span className="mono" style={{ color: "var(--ink-4)", marginLeft: 4 }}>
            / AI Automation Engineer
          </span>
        </a>
        <div className="nav-links">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>
              {label}
            </a>
          ))}
        </div>
        <div className="nav-cta">
          <span className="status">
            <span className="dot ok live" />
            <span>open to remote</span>
          </span>
          <button
            className="btn sm"
            type="button"
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              trackEvent("theme_toggle", { theme: next });
            }}
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"}`}
          >
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </button>
          <a
            href="/cv.pdf"
            className="btn primary sm"
            onClick={() => trackEvent("contact_click", { target: "cv", source: "nav" })}
          >
            <span>CV.pdf</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
