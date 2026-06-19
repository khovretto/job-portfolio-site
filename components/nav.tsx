"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/components/event-tracker";
import { useMessages } from "@/lib/i18n/provider";
import { LanguageToggle } from "@/components/language-toggle";
import { CvDownload } from "@/components/cv-download";

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

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
            className="btn sm icon-btn"
            type="button"
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark";
              setTheme(next);
              trackEvent("theme_toggle", { theme: next });
            }}
            aria-label={theme === "dark" ? m.nav.switchToLight : m.nav.switchToDark}
            title={theme === "dark" ? m.nav.switchToLight : m.nav.switchToDark}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <CvDownload className="btn primary sm">CV</CvDownload>
        </div>
      </div>
    </nav>
  );
}
