import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/auth";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <main className="admin-shell">
      <AdminNav email={session.email} />
      {children}
    </main>
  );
}
