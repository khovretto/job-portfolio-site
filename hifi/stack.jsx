// stack.jsx — categorized technical stack
function Stack() {
  const groups = [
    ['languages',  ['JavaScript', 'TypeScript', 'Python', 'SQL']],
    ['ai · data',  ['LangChain', 'RAG', 'Qdrant', 'Zep', 'Pinecone', 'OpenAI API', 'Prompt Engineering', 'Fine-tuning']],
    ['automation', ['n8n', 'REST', 'Swagger', 'Docker', 'CI/CD', 'Git', 'GitHub', 'Linux', 'Jupyter']],
    ['data · crm', ['PostgreSQL', 'JSON', 'Bitrix24', 'amoCRM', '1С', 'VoIP', 'Jira', 'Notion']],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {groups.map(([title, items]) => (
        <div key={title} className="surf" style={{ padding: 16 }}>
          <span className="mono">{title}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {items.map((x) => <span key={x} className="chip solid">{x}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
window.Stack = Stack;
