const groups = [
  ["languages", ["JavaScript", "TypeScript", "Python", "SQL"]],
  ["ai / data", ["LangChain", "RAG", "Qdrant", "Zep", "Pinecone", "OpenAI API", "Prompt Engineering", "Fine-tuning"]],
  ["automation", ["n8n", "REST", "Swagger", "Docker", "CI/CD", "Git", "GitHub", "Linux", "Jupyter"]],
  ["data / crm", ["PostgreSQL", "JSON", "Bitrix24", "amoCRM", "1C", "VoIP", "Jira", "Notion"]],
] as const;

export function Stack() {
  return (
    <div className="stack-grid">
      {groups.map(([title, items]) => (
        <div key={title} className="surf" style={{ padding: 16 }}>
          <span className="mono">{title}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {items.map((item) => (
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
