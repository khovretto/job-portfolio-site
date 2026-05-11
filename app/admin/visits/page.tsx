import { AdminShell } from "@/components/admin-shell";
import { formatDate, getRecentEvents } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function VisitsPage() {
  const events = await getRecentEvents();
  return (
    <AdminShell>
      <span className="mono">events</span>
      <h1 style={{ margin: "6px 0 18px", fontSize: 30 }}>Visits and public events</h1>
      <div className="surf" style={{ overflow: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Path</th>
              <th>Referrer</th>
              <th>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{formatDate(event.created_at)}</td>
                <td>{event.type}</td>
                <td>{event.path}</td>
                <td>{event.referrer || "-"}</td>
                <td>
                  <code>{JSON.stringify(event.metadata)}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
