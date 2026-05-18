import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { logEvent } from "@/lib/logging";
import { getRequestMeta } from "@/lib/request-meta";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  target: z.enum(["email", "github", "linkedin", "cv"]),
});

export async function POST(request: NextRequest) {
  const meta = getRequestMeta(request);
  const limit = checkRateLimit(`contact:${meta.ipHash}`, 30, 60 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const body = parsed.data;
  await logEvent(request, "contact_click", { target: body.target });
  return NextResponse.json({ ok: true });
}
