import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getRequestMeta } from "@/lib/request-meta";
import { checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logging";
import { CHAT_RATE_LIMIT } from "@/lib/assistant";

export const runtime = "nodejs";

const healthSchema = z
  .object({
    status: z.string().nullish(),
    profile_slug: z.string().nullish(),
    allowed_collections: z.array(z.string()).nullish(),
    embedding_provider: z.string().nullish(),
    embedding_model: z.string().nullish(),
    db_ok: z.boolean().nullish(),
    qdrant_ok: z.boolean().nullish(),
    vector_mismatch_count: z.number().nullish(),
  })
  .passthrough();

async function fetchMnemosyneHealth() {
  const baseUrl = process.env.MNM_BROKER_URL;
  if (!baseUrl) return { reachable: false as const };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);

  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/health`, {
      signal: controller.signal,
    });
    if (!response.ok) return { reachable: false as const };

    const parsed = healthSchema.safeParse(await response.json());
    if (!parsed.success) return { reachable: false as const };

    return {
      reachable: true as const,
      status: parsed.data.status ?? null,
      profileSlug: parsed.data.profile_slug ?? null,
      allowedCollections: parsed.data.allowed_collections ?? [],
      embeddingProvider: parsed.data.embedding_provider ?? null,
      embeddingModel: parsed.data.embedding_model ?? null,
      dbOk: parsed.data.db_ok ?? null,
      qdrantOk: parsed.data.qdrant_ok ?? null,
      vectorMismatchCount: parsed.data.vector_mismatch_count ?? null,
    };
  } catch {
    return { reachable: false as const };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const meta = getRequestMeta(request);
  const limit = checkRateLimit(`assistant-status:${meta.ipHash}`, 30, 60 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json({ reachable: false }, { status: 429 });
  }

  try {
    const knowledge = await fetchMnemosyneHealth();
    return NextResponse.json({
      knowledge,
      chatRateLimit: {
        max: CHAT_RATE_LIMIT.max,
        windowMinutes: Math.round(CHAT_RATE_LIMIT.windowMs / 60_000),
      },
    });
  } catch (error) {
    await logError(request, "assistant status route failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ knowledge: { reachable: false } });
  }
}
