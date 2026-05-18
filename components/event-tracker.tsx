"use client";

import { useEffect } from "react";

export function trackEvent(type: string, metadata: Record<string, unknown> = {}) {
  const payload = JSON.stringify({ type, metadata });
  void fetch("/api/site-actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

export function EventTracker() {
  useEffect(() => {
    trackEvent("page_view", {
      path: window.location.pathname,
      title: document.title,
    });
  }, []);

  return null;
}
