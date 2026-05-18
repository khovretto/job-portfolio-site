import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getOverviewStats } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const stats = await getOverviewStats();
  const cards = [
    ["events", "/admin/visits", "Custom public-site events", stats.events],
    ["chats", "/admin/chat", "Assistant requests", stats.chats],
    ["assistant", "/admin/assistant", "Prompt and public context", "edit"],
    ["audits", "/admin/audits", "KB audit estimates", stats.audits],
    ["errors", "/admin/errors", "Client and server errors", stats.errors],
  ] as const;

  return (
    <AdminShell>
      <section>
        <span className="mono">overview / last 30 days</span>
        <h1 style={{ margin: "6px 0 18px", fontSize: 34 }}>Operational dashboard</h1>
        <div className="admin-grid">
          {cards.map(([key, href, description, value]) => (
            <Link key={key} href={href} className="surf" style={{ padding: 18 }}>
              <span className="mono">{key}</span>
              <div style={{ marginTop: 12, fontSize: 36, fontWeight: 600 }}>{value}</div>
              <p style={{ margin: "8px 0 0", color: "var(--ink-3)" }}>{description}</p>
            </Link>
          ))}
        </div>
        <div className="surf-2" style={{ marginTop: 18, padding: 16, color: "var(--ink-3)" }}>
          Umami should handle traffic analytics at <code>stats.khovrov.dev</code>. This admin panel is for portfolio-specific operational logs.
        </div>
      </section>
    </AdminShell>
  );
}
