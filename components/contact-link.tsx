"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/components/event-tracker";

type Props = {
  href: string;
  targetName: "email" | "github" | "linkedin" | "cv";
  className?: string;
  children: ReactNode;
};

export function ContactLink({ href, targetName, className, children }: Props) {
  return (
    <a
      href={href}
      className={className}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      onClick={() => {
        trackEvent("contact_click", { target: targetName, href });
        void fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: targetName }),
          keepalive: true,
        });
      }}
    >
      {children}
    </a>
  );
}
