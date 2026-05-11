import crypto from "node:crypto";
import type { NextRequest } from "next/server";

function firstForwardedValue(value: string | null): string {
  return value?.split(",")[0]?.trim() || "";
}

export function getClientIp(request: NextRequest): string {
  return (
    firstForwardedValue(request.headers.get("x-forwarded-for")) ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET || "development-ip-hash-secret";
  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}

export function getRequestMeta(request: NextRequest) {
  const ip = getClientIp(request);
  return {
    ipHash: hashIp(ip),
    userAgent: request.headers.get("user-agent") || "",
    referrer: request.headers.get("referer") || "",
    path: request.nextUrl.pathname,
  };
}
