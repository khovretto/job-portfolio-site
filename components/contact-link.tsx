"use client";

import type { ReactNode } from "react";

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
        void fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: targetName }),
          keepalive: true,
        }).catch(() => undefined);
      }}
    >
      {children}
    </a>
  );
}
