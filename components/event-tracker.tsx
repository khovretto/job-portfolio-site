"use client";

import { useEffect } from "react";

export function trackEvent(type: string, metadata: Record<string, unknown> = {}) {
  const payload = JSON.stringify({ type, metadata });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/events", new Blob([payload], { type: "application/json" }));
    return;
  }

  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
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
