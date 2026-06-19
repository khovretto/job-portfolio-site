"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { locales, type Locale } from "@/lib/i18n/config";
import { useLocale, useMessages } from "@/lib/i18n/provider";

function logCvDownload() {
  void fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target: "cv" }),
    keepalive: true,
  }).catch(() => undefined);
}

export function CvDownload({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const locale = useLocale();
  const m = useMessages();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const others = locales.filter((item) => item !== locale);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function languageLabel(item: Locale) {
    return item === "ru" ? m.cv.russian : m.cv.english;
  }

  return (
    <span className="cv-download" ref={wrapRef}>
      <a
        href={`/api/cv?lang=${locale}`}
        className={className}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => {
          logCvDownload();
          setOpen(true);
        }}
      >
        {children}
      </a>
      {open && others.length > 0 ? (
        <span className="cv-popup surf" role="dialog" aria-label={m.cv.otherPrompt}>
          <span className="mono cv-popup-prompt">{m.cv.otherPrompt}</span>
          <span className="cv-popup-actions">
            {others.map((item) => (
              <a
                key={item}
                href={`/api/cv?lang=${item}`}
                className="btn sm"
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => {
                  logCvDownload();
                  setOpen(false);
                }}
              >
                {languageLabel(item)}
              </a>
            ))}
          </span>
        </span>
      ) : null}
    </span>
  );
}
