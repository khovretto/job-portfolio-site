import { z } from "zod";
import {
  ASSISTANT_MODEL_OPTIONS,
  DEFAULT_ASSISTANT_MODEL,
  type AssistantModelId,
  isAssistantModelId,
  normalizeAssistantModelId,
} from "@/lib/assistant-models";
import { buildAssistantSystemPrompt, getAssistantConfig } from "@/lib/assistant-config";
import { answerPublicQuestion } from "@/lib/mock-chat";

export type AssistantHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantResult = {
  answer: string;
  sources: string[];
  confidence: number;
  scope: "public" | "limited";
  mocked: boolean;
  model: AssistantModelId;
  status: "live" | "mock";
  latencyMs: number;
};

export class AssistantUnavailableError extends Error {
  constructor(message = "Assistant is unavailable.") {
    super(message);
    this.name = "AssistantUnavailableError";
  }
}

const assistantAnswerSchema = z.object({
  answer: z.string().trim().min(1),
  sources: z.array(z.string().trim().min(1)).min(1).default(["assistant:model"]),
  confidence: z.coerce.number().min(0).max(1).default(0.65),
  scope: z.enum(["public", "limited"]).default("public"),
});

const openWebUiResponseSchema = z
  .object({
    choices: z
      .array(
        z
          .object({
            message: z
              .object({
                content: z.union([
                  z.string(),
                  z.array(
                    z
                      .object({
                        type: z.string().optional(),
                        text: z.string().optional(),
                      })
                      .passthrough(),
                  ),
                ]),
              })
              .passthrough()
              .optional(),
            text: z.string().optional(),
          })
          .passthrough(),
      )
      .min(1),
  })
  .passthrough();

const brokerSearchSchema = z
  .object({
    citations: z
      .array(
        z
          .object({
            title: z.string().nullish(),
            heading_path: z.array(z.string()).nullish(),
            snippet: z.string().nullish(),
            source_path: z.string().nullish(),
          })
          .passthrough(),
      )
      .default([]),
  })
  .passthrough();

export type RetrievedKnowledge = { context: string; sources: string[] };

// Deterministic RAG: query the profile-pinned career_public broker ourselves and
// inject the retrieved snippets into the prompt, rather than relying on Open WebUI
// to invoke an OpenAPI tool (which a plain /api/chat/completions call does not do
// reliably). Fails open to no-context so a broker hiccup never breaks the demo.
export async function retrievePublicKnowledge(query: string): Promise<RetrievedKnowledge> {
  const token = process.env.MNM_BROKER_TOKEN;
  if (!token) return { context: "", sources: [] };

  const baseUrl = (
    process.env.MNM_BROKER_URL || "http://mnemosyne-broker-api-public:8765"
  ).replace(/\/+$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(`${baseUrl}/search`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        top_k: 5,
        include_snippets: true,
        snippet_chars: 700,
      }),
    });

    if (!response.ok) return { context: "", sources: [] };

    const parsed = brokerSearchSchema.safeParse(await response.json());
    if (!parsed.success) return { context: "", sources: [] };

    const cites = parsed.data.citations.filter(
      (c) => (c.snippet || "").trim().length > 0,
    );
    if (cites.length === 0) return { context: "", sources: [] };

    const lines = cites.map((c) => {
      const heading =
        Array.isArray(c.heading_path) && c.heading_path.length
          ? c.heading_path.join(" › ")
          : c.title || "source";
      return `- [${heading}] ${(c.snippet || "").trim()}`;
    });
    const sources = Array.from(
      new Set(cites.map((c) => c.title || c.source_path || "Mnemosyne")),
    ).filter((s): s is string => Boolean(s));

    return { context: lines.join("\n"), sources };
  } catch {
    return { context: "", sources: [] };
  } finally {
    clearTimeout(timeout);
  }
}

export function getAllowedAssistantModels(): AssistantModelId[] {
  const configured = process.env.ASSISTANT_ALLOWED_MODELS?.split(",")
    .map(normalizeAssistantModelId)
    .filter(isAssistantModelId);

  return configured?.length
    ? configured
    : ASSISTANT_MODEL_OPTIONS.map((model) => model.id);
}

export function resolveAssistantModel(model?: string): AssistantModelId | null {
  const configuredDefault = process.env.ASSISTANT_DEFAULT_MODEL
    ? normalizeAssistantModelId(process.env.ASSISTANT_DEFAULT_MODEL)
    : DEFAULT_ASSISTANT_MODEL;
  const fallbackDefault = isAssistantModelId(configuredDefault)
    ? configuredDefault
    : DEFAULT_ASSISTANT_MODEL;
  const normalized = model ? normalizeAssistantModelId(model) : fallbackDefault;

  if (!isAssistantModelId(normalized)) return null;
  if (!getAllowedAssistantModels().includes(normalized)) return null;
  return normalized;
}

export async function answerAssistantQuestion(input: {
  message: string;
  model: AssistantModelId;
  history?: AssistantHistoryMessage[];
}): Promise<AssistantResult> {
  const startedAt = Date.now();
  const apiKey = process.env.OPENWEBUI_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new AssistantUnavailableError("Assistant API key is not configured.");
    }

    const result = answerPublicQuestion(input.message);
    return {
      ...result,
      scope: result.scope === "limited" ? "limited" : "public",
      model: input.model,
      status: "mock",
      latencyMs: Date.now() - startedAt,
    };
  }

  const baseUrl = (process.env.OPENWEBUI_BASE_URL || "http://openwebui:8080").replace(
    /\/+$/,
    "",
  );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const config = await getAssistantConfig();
    const baseSystemPrompt = buildAssistantSystemPrompt(config);
    const retrieved = await retrievePublicKnowledge(input.message);
    const systemPrompt = retrieved.context
      ? `${baseSystemPrompt}

Retrieved project knowledge (authoritative for questions about specific projects — prefer it over the summary above, and name the relevant project in your answer):
${retrieved.context}`
      : baseSystemPrompt;

    const response = await fetch(`${baseUrl}/api/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: input.model,
        chat_id: "local:portfolio-demo",
        stream: false,
        temperature: 0.2,
        max_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt },
          ...sanitizeHistory(input.history),
          { role: "user", content: input.message },
        ],
      }),
    });

    if (!response.ok) {
      throw new AssistantUnavailableError(`Open WebUI returned ${response.status}.`);
    }

    const payload = (await response.json()) as unknown;
    const rawAnswer = extractOpenWebUiText(payload);
    const parsed = parseAssistantAnswer(rawAnswer);

    return {
      ...parsed,
      // Prefer the real retrieved project titles as sources when we grounded the
      // answer; fall back to whatever the model returned otherwise.
      sources: retrieved.sources.length ? retrieved.sources : parsed.sources,
      model: input.model,
      mocked: false,
      status: "live",
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    if (error instanceof AssistantUnavailableError) throw error;
    throw new AssistantUnavailableError(
      error instanceof Error ? error.message : "Open WebUI request failed.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

function sanitizeHistory(history: AssistantHistoryMessage[] = []) {
  return history
    .slice(-6)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1200),
    }))
    .filter((message) => message.content.length > 0);
}

function extractOpenWebUiText(payload: unknown) {
  const parsed = openWebUiResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new AssistantUnavailableError("Open WebUI returned an unexpected response.");
  }

  const choice = parsed.data.choices[0];
  const content = choice.message?.content;

  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => part.text || "")
      .join("\n")
      .trim();
  }
  if (choice.text) return choice.text;

  throw new AssistantUnavailableError("Open WebUI returned an empty response.");
}

function parseAssistantAnswer(rawAnswer: string) {
  const candidates = [
    rawAnswer,
    rawAnswer.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, ""),
    rawAnswer.slice(rawAnswer.indexOf("{"), rawAnswer.lastIndexOf("}") + 1),
  ].filter((candidate) => candidate.trim().startsWith("{"));

  for (const candidate of candidates) {
    try {
      const parsed = assistantAnswerSchema.safeParse(JSON.parse(candidate));
      if (parsed.success) return parsed.data;
    } catch {
      // Try the next candidate.
    }
  }

  return {
    answer: rawAnswer.trim() || "The assistant returned an empty answer.",
    sources: ["assistant:model"],
    confidence: 0.65,
    scope: "public" as const,
  };
}
