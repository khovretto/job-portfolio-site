import { getMessages } from "@/lib/i18n/server";

export async function SiteFooter() {
  const m = await getMessages();
  return (
    <footer style={{ padding: "24px 0 40px", borderTop: "1px solid var(--line)" }}>
      <div className="container">
        <p className="mono" style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
          {m.footer.note}
        </p>
      </div>
    </footer>
  );
}
