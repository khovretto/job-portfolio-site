import { query } from "@/lib/db";

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export async function getOverviewStats() {
  const [events, chats, audits, errors] = await Promise.all([
    query<{ count: string }>(`select count(*)::text as count from events where created_at > now() - interval '30 days'`),
    query<{ count: string }>(`select count(*)::text as count from chat_requests where created_at > now() - interval '30 days'`),
    query<{ count: string }>(`select count(*)::text as count from audit_runs where created_at > now() - interval '30 days'`),
    query<{ count: string }>(`select count(*)::text as count from error_logs where created_at > now() - interval '30 days'`),
  ]);

  return {
    events: Number(events.rows[0]?.count || 0),
    chats: Number(chats.rows[0]?.count || 0),
    audits: Number(audits.rows[0]?.count || 0),
    errors: Number(errors.rows[0]?.count || 0),
  };
}

export async function getRecentEvents(limit = 50) {
  return query<{
    id: number;
    type: string;
    path: string;
    referrer: string;
    metadata: Record<string, unknown>;
    created_at: Date;
  }>(
    `select id, type, path, referrer, metadata, created_at
     from events
     order by created_at desc
     limit $1`,
    [limit],
  ).then((result) => result.rows);
}

export async function getRecentChats(limit = 50) {
  return query<{
    id: number;
    question: string;
    answer: string;
    sources: string[];
    confidence: string;
    scope: string;
    mocked: boolean;
    created_at: Date;
  }>(
    `select id, question, answer, sources, confidence::text, scope, mocked, created_at
     from chat_requests
     order by created_at desc
     limit $1`,
    [limit],
  ).then((result) => result.rows);
}

export async function getRecentAudits(limit = 50) {
  return query<{
    id: number;
    url: string;
    host: string;
    company_provided: boolean;
    email_provided: boolean;
    pages: number;
    tokens: number;
    estimated_cost: string;
    eta: string;
    confidence: string;
    status: string;
    created_at: Date;
  }>(
    `select id, url, host, company_provided, email_provided, pages, tokens,
            estimated_cost::text, eta, confidence::text, status, created_at
     from audit_runs
     order by created_at desc
     limit $1`,
    [limit],
  ).then((result) => result.rows);
}

export async function getRecentErrors(limit = 50) {
  return query<{
    id: number;
    message: string;
    path: string;
    metadata: Record<string, unknown>;
    created_at: Date;
  }>(
    `select id, message, path, metadata, created_at
     from error_logs
     order by created_at desc
     limit $1`,
    [limit],
  ).then((result) => result.rows);
}
