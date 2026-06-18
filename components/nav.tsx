"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/components/event-tracker";
import { useMessages } from "@/lib/i18n/provider";
import { LanguageToggle } from "@/components/language-toggle";

const linkIds = ["numbers", "demos", "experience", "stack", "contact"] as const;

export function Nav() {
  const m = useMessages();
  const [active, setActive] = useState("hero");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const links = linkIds.map((id, index) => [id, `0${index + 1} / ${m.nav.links[id]}`] as const);

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
            / {m.nav.role}
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
            <span>{m.nav.status}</span>
          </span>
          <LanguageToggle />
          <button
            className="btn sm"
            type="button"
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              trackEvent("theme_toggle", { theme: next });
            }}
            aria-label={theme === "dark" ? m.nav.switchToLight : m.nav.switchToDark}
            title={theme === "dark" ? m.nav.switchToLight : m.nav.switchToDark}
          >
            <span>{theme === "dark" ? m.nav.themeDark : m.nav.themeLight}</span>
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
