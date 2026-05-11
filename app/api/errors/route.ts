import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { logError } from "@/lib/logging";

const schema = z.object({
  message: z.string().trim().min(1).max(500),
  metadata: z.record(z.unknown()).optional().default({}),
});

export async function POST(request: NextRequest) {
  const body = schema.parse(await request.json());
  await logError(request, body.message, body.metadata);
  return NextResponse.json({ ok: true });
}
