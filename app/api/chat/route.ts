import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { answerPublicQuestion } from "@/lib/mock-chat";
import { safeQuery } from "@/lib/db";
import { getRequestMeta } from "@/lib/request-meta";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";

const schema = z.object({
  message: z.string().trim().min(1).max(800),
});

export async function POST(request: NextRequest) {
  const meta = getRequestMeta(request);
  const limit = checkRateLimit(`chat:${meta.ipHash}`, 20, 60 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many chat requests. Try again later." },
      { status: 429 },
    );
  }

  try {
    const body = schema.parse(await request.json());
    const result = answerPublicQuestion(body.message);

    await safeQuery(
      `insert into chat_requests
        (question, answer, sources, confidence, scope, mocked, user_agent, ip_hash)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        body.message,
        result.answer,
        result.sources,
        result.confidence,
        result.scope,
        result.mocked,
        meta.userAgent,
        meta.ipHash,
      ],
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid message." }, { status: 400 });
    }

    await logError(request, "chat route failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Chat is unavailable." }, { status: 500 });
  }
}
