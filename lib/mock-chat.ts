const answerBank = [
  {
    terms: ["rag", "retrieval", "qdrant", "zep", "vector", "knowledge"],
    answer:
      "I have designed and deployed 3 RAG pipelines using Qdrant and Zep, including dataset preparation, vector-store configuration, retriever tuning, and answer-quality evaluation. The strongest public metric is a reported response-accuracy improvement from 70% to 98%.",
    sources: ["public-summary", "rag-pipelines"],
    confidence: 0.92,
  },
  {
    terms: ["voice", "robot", "agent", "call", "telephony", "voip"],
    answer:
      "I launched 30+ production voice robots across medical, retail, recruitment, finance, municipal infrastructure, and B2C support scenarios. The work combined LLM behavior, CRM integrations, telephony, error handling, and operational reliability.",
    sources: ["public-summary", "production-voice-agents"],
    confidence: 0.91,
  },
  {
    terms: ["team", "lead", "manage", "mentor", "review"],
    answer:
      "During an automation-team restructuring, I acted as a core developer, redesigned processes, onboarded specialists, mentored developers, reviewed work, maintained internal knowledge material, and helped scale the team from 3 to 10+ people.",
    sources: ["public-summary", "team-scaling"],
    confidence: 0.89,
  },
  {
    terms: ["stack", "tools", "tech", "language", "typescript", "python", "n8n"],
    answer:
      "My public stack includes JavaScript, TypeScript, Python, SQL, n8n, LangChain, OpenAI API, Qdrant, Zep, REST APIs, Swagger, Linux, Git, Docker, CRM systems, PostgreSQL, and VoIP integrations.",
    sources: ["public-summary", "technical-stack"],
    confidence: 0.9,
  },
  {
    terms: ["contact", "email", "hire", "remote"],
    answer:
      "I am open to remote roles in AI automation, AI development, or technical product work. Public contact: mkhovrov01@gmail.com, GitHub at github.com/mkhovrov01, and LinkedIn at linkedin.com/in/maksim-khovrov-113633293.",
    sources: ["public-summary", "contact"],
    confidence: 0.88,
  },
];

export function answerPublicQuestion(message: string) {
  const normalized = message.toLowerCase();
  const selected =
    answerBank.find((entry) => entry.terms.some((term) => normalized.includes(term))) ||
    null;

  if (!selected) {
    return {
      answer:
        "That is not in my public scope. The public summary supports questions about production voice agents, RAG systems, automation work, team scaling, stack, and contact details.",
      sources: ["scope:out-of-scope"],
      confidence: 0.42,
      scope: "limited",
      mocked: true,
    };
  }

  return {
    ...selected,
    scope: "public",
    mocked: true,
  };
}
