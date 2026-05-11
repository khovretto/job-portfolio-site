import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { safeQuery } from "@/lib/db";
import { getRequestMeta } from "@/lib/request-meta";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

const schema = z.object({
  url: z.string().trim().url().max(500),
  company: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().optional().or(z.literal("")).default(""),
});

function validatePublicUrl(input: string) {
  const url = new URL(input);
  if (!["http:", "https:"].includes(url.protocol)) {
    return "Only http/https URLs are allowed.";
  }
  if (
    /(^localhost$)|(^127\.)|(^0\.0\.0\.0$)|(^10\.)|(^192\.168\.)|(^172\.(1[6-9]|2\d|3[0-1])\.)|(\.local$)/i.test(
      url.hostname,
    )
  ) {
    return "Private and local hosts are blocked.";
  }
  return null;
}

function estimate(host: string) {
  const seedHash = [...host].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const pages = 80 + (seedHash % 220);
  const tokens = pages * 700;
  const estimatedCost = Number(((tokens / 1000) * 0.02 + 4).toFixed(2));
  const eta = `${Math.max(1, Math.round(pages / 60))}h`;
  const confidence = Number((0.78 + (seedHash % 18) / 100).toFixed(3));
  return { pages, tokens, estimatedCost, eta, confidence };
}

export async function POST(request: NextRequest) {
  const meta = getRequestMeta(request);
  const limit = checkRateLimit(`audit:${meta.ipHash}`, 30, 60 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Too many audit runs. Try again later." }, { status: 429 });
  }

  try {
    const body = schema.parse(await request.json());
    const blocked = validatePublicUrl(body.url);
    if (blocked) {
      return NextResponse.json({ error: blocked }, { status: 400 });
    }

    const parsed = new URL(body.url);
    const result = estimate(parsed.host);

    await safeQuery(
      `insert into audit_runs
        (url, host, company_provided, email_provided, pages, tokens, estimated_cost, eta, confidence, user_agent, ip_hash)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        body.url,
        parsed.host,
        Boolean(body.company),
        Boolean(body.email),
        result.pages,
        result.tokens,
        result.estimatedCost,
        result.eta,
        result.confidence,
        meta.userAgent,
        meta.ipHash,
      ],
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid audit input." }, { status: 400 });
    }

    await logError(request, "audit route failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Audit estimate is unavailable." }, { status: 500 });
  }
}
