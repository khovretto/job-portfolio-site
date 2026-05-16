import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { safeQuery } from "@/lib/db";
import { getRequestMeta } from "@/lib/request-meta";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";
import {
  AssistantUnavailableError,
  answerAssistantQuestion,
  resolveAssistantModel,
} from "@/lib/assistant";
import type { AssistantModelId } from "@/lib/assistant-models";

const schema = z.object({
  message: z.string().trim().min(1).max(800),
  model: z.string().trim().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(1200),
      }),
    )
    .max(8)
    .optional(),
});

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const meta = getRequestMeta(request);
  const limit = checkRateLimit(`chat:${meta.ipHash}`, 20, 60 * 60 * 1000);
  let parsedBody: z.infer<typeof schema> | null = null;
  let resolvedModel: AssistantModelId | null = null;
  const startedAt = Date.now();

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many chat requests. Try again later." },
      { status: 429 },
    );
  }

  try {
    parsedBody = schema.parse(await request.json());
    resolvedModel = resolveAssistantModel(parsedBody.model);

    if (!resolvedModel) {
      return NextResponse.json({ error: "Invalid assistant model." }, { status: 400 });
    }

    const result = await answerAssistantQuestion({
      message: parsedBody.message,
      model: resolvedModel,
      history: parsedBody.history,
    });

    await safeQuery(
      `insert into chat_requests
        (question, answer, sources, confidence, scope, mocked, model, status, latency_ms, user_agent, ip_hash)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        parsedBody.message,
        result.answer,
        result.sources,
        result.confidence,
        result.scope,
        result.mocked,
        result.model,
        result.status,
        result.latencyMs,
        meta.userAgent,
        meta.ipHash,
      ],
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid message." }, { status: 400 });
    }

    if (error instanceof AssistantUnavailableError) {
      if (parsedBody && resolvedModel) {
        await safeQuery(
          `insert into chat_requests
            (question, answer, sources, confidence, scope, mocked, model, status, latency_ms, user_agent, ip_hash)
           values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            parsedBody.message,
            "[assistant unavailable]",
            ["assistant:error"],
            0,
            "limited",
            false,
            resolvedModel,
            "error",
            Date.now() - startedAt,
            meta.userAgent,
            meta.ipHash,
          ],
        );
      }

      await logError(request, "assistant unavailable", {
        error: error.message,
      });
      return NextResponse.json(
        { error: "Assistant is temporarily unavailable." },
        { status: 503 },
      );
    }

    await logError(request, "chat route failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Chat is unavailable." }, { status: 500 });
  }
}
