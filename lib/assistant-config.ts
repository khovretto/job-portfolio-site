import { query } from "@/lib/db";

export const DEFAULT_PUBLIC_CONTEXT = `
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

export const DEFAULT_SYSTEM_PROMPT = `
You are the public portfolio assistant for Maksim Khovrov.
Answer only from the public context below.
If the question asks for private, confidential, speculative, personal, or unavailable information, return a scope boundary instead of guessing.
Do not invent client names, private implementation details, hidden credentials, personal data, salary expectations, or non-public facts.
Return only valid JSON with this exact shape:
{"answer":"string","sources":["public-summary"],"confidence":0.0,"scope":"public"}
Use scope "limited" when the public context does not support a direct answer.
`.trim();

export type AssistantConfig = {
  systemPrompt: string;
  publicContext: string;
  updatedAt: Date | null;
};

export function buildAssistantSystemPrompt(config: Pick<AssistantConfig, "systemPrompt" | "publicContext">) {
  return `
${config.systemPrompt.trim()}

Public context:
${config.publicContext.trim()}
`.trim();
}

export async function getAssistantConfig(): Promise<AssistantConfig> {
  if (!process.env.DATABASE_URL) return getDefaultAssistantConfig();

  try {
    const result = await query<{
      system_prompt: string;
      public_context: string;
      updated_at: Date;
    }>(
      `select system_prompt, public_context, updated_at
       from assistant_config
       where id = true
       limit 1`,
    );

    const row = result.rows[0];
    if (!row) return getDefaultAssistantConfig();

    return {
      systemPrompt: row.system_prompt,
      publicContext: row.public_context,
      updatedAt: row.updated_at,
    };
  } catch (error) {
    console.warn(
      "assistant config fallback",
      error instanceof Error ? error.message : error,
    );
    return getDefaultAssistantConfig();
  }
}

export function getDefaultAssistantConfig(): AssistantConfig {
  return {
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    publicContext: DEFAULT_PUBLIC_CONTEXT,
    updatedAt: null,
  };
}
