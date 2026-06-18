import { getMessages } from "@/lib/i18n/server";

const groups = [
  { id: "languages", items: ["JavaScript", "TypeScript", "Python", "SQL"] },
  { id: "aiData", items: ["LangChain", "RAG", "Qdrant", "Zep", "Pinecone", "OpenAI API", "Prompt Engineering", "Fine-tuning"] },
  { id: "automation", items: ["n8n", "REST", "Swagger", "Docker", "CI/CD", "Git", "GitHub", "Linux", "Jupyter"] },
  { id: "dataCrm", items: ["PostgreSQL", "JSON", "Bitrix24", "amoCRM", "1C", "VoIP", "Jira", "Notion"] },
] as const;

export async function Stack() {
  const m = await getMessages();
  return (
    <div className="stack-grid">
      {groups.map((group) => (
        <div key={group.id} className="surf" style={{ padding: 16 }}>
          <span className="mono">{m.stack.groups[group.id]}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {group.items.map((item) => (
              <span key={item} className="chip solid">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
