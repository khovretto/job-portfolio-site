import { z } from "zod";
import {
  ASSISTANT_MODEL_OPTIONS,
  DEFAULT_ASSISTANT_MODEL,
  type AssistantModelId,
  isAssistantModelId,
  normalizeAssistantModelId,
} from "@/lib/assistant-models";
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

const PUBLIC_CONTEXT = `
Maksim Khovrov is an AI Automation Engineer focused on production voice agents, RAG systems, and automation workflows.

Public proof points:
- 4.5 years of automation experience.
- 2+ years working with LLMs and AI agents.
- Launched 30+ production voice robots across medical, retail, recruitment, finance, municipal infrastructure, and B2C support scenarios.
- Built RAG pipelines with Qdrant and Zep, including dataset preparation, vector-store configuration, retriever tuning, and answer-quality evaluation.
- Reported RAG response-accuracy improvement from 70% to 98%.
- Supported $400K+ in deal value through technical work and demos.
- Helped scale an automation team from 3 to 10+ people.

Public stack:
JavaScript, TypeScript, Python, SQL, n8n, LangChain, OpenAI API, Qdrant, Zep, REST APIs, Swagger, Linux, Git, Docker, CRM systems, PostgreSQL, and VoIP integrations.

Public contact:
Email: mkhovrov01@gmail.com
GitHub: github.com/mkhovrov01
LinkedIn: linkedin.com/in/maksim-khovrov-113633293
`.trim();

const SYSTEM_PROMPT = `
You are the public portfolio assistant for Maksim Khovrov.
Answer only from the public context below.
If the question asks for private, confidential, speculative, personal, or unavailable information, return a scope boundary instead of guessing.
Do not invent client names, private implementation details, hidden credentials, personal data, salary expectations, or non-public facts.
Return only valid JSON with this exact shape:
{"answer":"string","sources":["public-summary"],"confidence":0.0,"scope":"public"}
Use scope "limited" when the public context does not support a direct answer.

Public context:
${PUBLIC_CONTEXT}
`.trim();

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
          { role: "system", content: SYSTEM_PROMPT },
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
