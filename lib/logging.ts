import type { NextRequest } from "next/server";
import { safeQuery } from "@/lib/db";
import { getRequestMeta } from "@/lib/request-meta";

type Json = Record<string, unknown>;

export async function logEvent(request: NextRequest, type: string, metadata: Json = {}) {
  const meta = getRequestMeta(request);
  await safeQuery(
    `insert into events (type, path, referrer, user_agent, ip_hash, metadata)
     values ($1, $2, $3, $4, $5, $6)`,
    [type, meta.path, meta.referrer, meta.userAgent, meta.ipHash, metadata],
  );
}

export async function logError(request: NextRequest, message: string, metadata: Json = {}) {
  const meta = getRequestMeta(request);
  await safeQuery(
    `insert into error_logs (message, path, user_agent, ip_hash, metadata)
     values ($1, $2, $3, $4, $5)`,
    [message, meta.path, meta.userAgent, meta.ipHash, metadata],
  );
}
