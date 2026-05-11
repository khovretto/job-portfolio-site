import { AdminShell } from "@/components/admin-shell";
import { formatDate, getRecentChats } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const chats = await getRecentChats();
  return (
    <AdminShell>
      <span className="mono">chat</span>
      <h1 style={{ margin: "6px 0 18px", fontSize: 30 }}>Assistant requests</h1>
      <div className="surf" style={{ overflow: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Sources</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((chat) => (
              <tr key={chat.id}>
                <td>{formatDate(chat.created_at)}</td>
                <td>{chat.question}</td>
                <td>{chat.answer}</td>
                <td>{chat.sources.join(", ")}</td>
                <td>{Number(chat.confidence).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
