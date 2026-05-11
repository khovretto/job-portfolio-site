import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { logEvent, logError } from "@/lib/logging";
import { getRequestMeta } from "@/lib/request-meta";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  type: z.string().trim().min(1).max(80),
  metadata: z.record(z.unknown()).optional().default({}),
});

export async function POST(request: NextRequest) {
  const meta = getRequestMeta(request);
  const limit = checkRateLimit(`events:${meta.ipHash}`, 120, 60 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const body = schema.parse(await request.json());
    await logEvent(request, body.type, body.metadata);
    return NextResponse.json({ ok: true });
  } catch (error) {
    await logError(request, "event route failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
