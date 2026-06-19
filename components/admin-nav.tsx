import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

const links = [
  ["/admin", "Overview"],
  ["/admin/visits", "Visits/events"],
  ["/admin/chat", "Chat"],
  ["/admin/assistant", "Assistant"],
  ["/admin/cv", "CV"],
  ["/admin/audits", "Audits"],
  ["/admin/errors", "Errors"],
];

export function AdminNav({ email }: { email: string }) {
  return (
    <div className="surf" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
      <span className="mono" style={{ color: "var(--accent)" }}>
        admin / {email}
      </span>
      <nav style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="btn sm">
            {label}
          </Link>
        ))}
      </nav>
      <form action={logoutAction} style={{ marginLeft: "auto" }}>
        <button className="btn sm" type="submit">
          Log out
        </button>
      </form>
    </div>
  );
}
