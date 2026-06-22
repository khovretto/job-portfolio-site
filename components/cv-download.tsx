"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { locales, type Locale } from "@/lib/i18n/config";
import { useLocale, useMessages } from "@/lib/i18n/provider";

// Short delay before switching to the opened CV tab, so the language popup is
// visible/acknowledged first. Stays well within the click's activation window,
// so the deferred window.open is not treated as a blocked popup.
const SWITCH_DELAY_MS = 1200;

function logCvDownload() {
  void fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target: "cv" }),
    keepalive: true,
  }).catch(() => undefined);
}

function cvHref(locale: Locale) {
  return `/api/cv?lang=${locale}`;
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
  const [pending, setPending] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);

  const others = locales.filter((item) => item !== locale);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

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

  function handlePrimary(event: React.MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks (new tab/window, save) behave natively.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    logCvDownload();
    setOpen(true);
    setPending(true);
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      window.open(cvHref(locale), "_blank", "noopener");
      setPending(false);
      timerRef.current = null;
    }, SWITCH_DELAY_MS);
  }

  function handleOther() {
    // An explicit language choice supersedes the pending auto-open.
    clearTimer();
    setPending(false);
    setOpen(false);
    logCvDownload();
  }

  return (
    <span className="cv-download" ref={wrapRef}>
      <a href={cvHref(locale)} className={className} onClick={handlePrimary}>
        {children}
      </a>
      {open ? (
        <span className="cv-popup surf" role="dialog" aria-label={m.cv.otherPrompt}>
          <span className="mono cv-popup-prompt">
            {pending ? m.cv.opening : m.cv.otherPrompt}
          </span>
          <span className="cv-popup-actions">
            {others.map((item) => (
              <a
                key={item}
                href={cvHref(item)}
                className="btn sm"
                target="_blank"
                rel="noreferrer noopener"
                onClick={handleOther}
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
