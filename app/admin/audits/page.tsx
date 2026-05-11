import { AdminShell } from "@/components/admin-shell";
import { formatDate, getRecentAudits } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AuditsPage() {
  const audits = await getRecentAudits();
  return (
    <AdminShell>
      <span className="mono">audits</span>
      <h1 style={{ margin: "6px 0 18px", fontSize: 30 }}>KB audit runs</h1>
      <div className="surf" style={{ overflow: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Host</th>
              <th>Pages</th>
              <th>Tokens</th>
              <th>Cost</th>
              <th>ETA</th>
              <th>Email?</th>
              <th>Company?</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((audit) => (
              <tr key={audit.id}>
                <td>{formatDate(audit.created_at)}</td>
                <td>{audit.host}</td>
                <td>{audit.pages?.toLocaleString() || "-"}</td>
                <td>{audit.tokens?.toLocaleString() || "-"}</td>
                <td>{audit.estimated_cost ? `$${Number(audit.estimated_cost).toFixed(0)}` : "-"}</td>
                <td>{audit.eta || "-"}</td>
                <td>{audit.email_provided ? "yes" : "no"}</td>
                <td>{audit.company_provided ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
