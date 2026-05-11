import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { logEvent } from "@/lib/logging";

const schema = z.object({
  target: z.enum(["email", "github", "linkedin", "cv"]),
});

export async function POST(request: NextRequest) {
  const body = schema.parse(await request.json());
  await logEvent(request, "contact_click", { target: body.target });
  return NextResponse.json({ ok: true });
}
