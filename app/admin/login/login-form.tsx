"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: "" });

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label className="mono" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        Email
        <input name="email" type="email" className="form-input" autoComplete="username" />
      </label>
      <label className="mono" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        Password
        <input name="password" type="password" className="form-input" autoComplete="current-password" />
      </label>
      {state.error ? <div style={{ color: "var(--bad)", fontSize: 13 }}>{state.error}</div> : null}
      <button className="btn primary" type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
