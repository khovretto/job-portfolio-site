"use server";

import { redirect } from "next/navigation";
import { createSession, clearSessionCookie, setSessionCookie, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";

export type LoginState = { error: string };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const result = await query<{ id: number; email: string; password_hash: string }>(
    `select id, email, password_hash from admin_users where email = $1`,
    [email],
  );
  const user = result.rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: "Invalid admin credentials." };
  }

  const session = await createSession(user.id);
  await setSessionCookie(session.value, session.expiresAt);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
