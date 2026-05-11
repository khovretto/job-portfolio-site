import { AdminShell } from "@/components/admin-shell";
import { formatDate, getRecentErrors } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function ErrorsPage() {
  const errors = await getRecentErrors();
  return (
    <AdminShell>
      <span className="mono">errors</span>
      <h1 style={{ margin: "6px 0 18px", fontSize: 30 }}>Error logs</h1>
      <div className="surf" style={{ overflow: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Path</th>
              <th>Message</th>
              <th>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((error) => (
              <tr key={error.id}>
                <td>{formatDate(error.created_at)}</td>
                <td>{error.path || "-"}</td>
                <td>{error.message}</td>
                <td>
                  <code>{JSON.stringify(error.metadata)}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
