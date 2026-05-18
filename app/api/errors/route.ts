import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { logError } from "@/lib/logging";
import { getRequestMeta } from "@/lib/request-meta";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  message: z.string().trim().min(1).max(500),
  metadata: z.record(z.unknown()).optional().default({}),
});

export async function POST(request: NextRequest) {
  const meta = getRequestMeta(request);
  const limit = checkRateLimit(`client-errors:${meta.ipHash}`, 60, 60 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const body = parsed.data;
  await logError(request, body.message, body.metadata);
  return NextResponse.json({ ok: true });
}
