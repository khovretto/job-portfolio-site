export const ASSISTANT_MODEL_OPTIONS = [
  {
    id: "google/gemini-flash-latest",
    label: "Gemini Flash",
  },
  {
    id: "openai/gpt-mini-latest",
    label: "GPT Mini",
  },
  {
    id: "anthropic/claude-haiku-latest",
    label: "Claude Haiku",
  },
] as const;

export type AssistantModelId = (typeof ASSISTANT_MODEL_OPTIONS)[number]["id"];

export const DEFAULT_ASSISTANT_MODEL: AssistantModelId = "openai/gpt-mini-latest";

const assistantModelIds = new Set<string>(
  ASSISTANT_MODEL_OPTIONS.map((model) => model.id),
);

export function normalizeAssistantModelId(value: string) {
  return value.trim().replace(/^~+/, "");
}

export function isAssistantModelId(value: string): value is AssistantModelId {
  return assistantModelIds.has(normalizeAssistantModelId(value));
}

export function getAssistantModelLabel(modelId: string) {
  return (
    ASSISTANT_MODEL_OPTIONS.find((model) => model.id === modelId)?.label ||
    modelId
  );
}
