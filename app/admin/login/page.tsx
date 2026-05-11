import { LoginForm } from "@/app/admin/login/login-form";

export default function AdminLoginPage() {
  return (
    <main className="login-panel surf">
      <span className="mono">admin</span>
      <h1 style={{ margin: "6px 0 8px", fontSize: 30 }}>Portfolio operations</h1>
      <p style={{ margin: "0 0 20px", color: "var(--ink-3)" }}>
        Private access for reviewing chat, audit, event and error logs.
      </p>
      <LoginForm />
    </main>
  );
}
