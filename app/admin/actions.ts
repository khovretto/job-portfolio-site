"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createSession,
  clearSessionCookie,
  requireAdmin,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { query } from "@/lib/db";
import {
  DEFAULT_PUBLIC_CONTEXT,
  DEFAULT_SYSTEM_PROMPT,
} from "@/lib/assistant-config";

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

const assistantConfigSchema = z.object({
  systemPrompt: z.string().trim().min(50).max(8000),
  publicContext: z.string().trim().min(50).max(20000),
});

export async function updateAssistantConfigAction(formData: FormData) {
  await requireAdmin();

  const parsed = assistantConfigSchema.safeParse({
    systemPrompt: formData.get("systemPrompt"),
    publicContext: formData.get("publicContext"),
  });

  if (!parsed.success) {
    redirect("/admin/assistant?error=invalid");
  }

  await query(
    `insert into assistant_config (id, system_prompt, public_context, updated_at)
     values (true, $1, $2, now())
     on conflict (id) do update
       set system_prompt = excluded.system_prompt,
           public_context = excluded.public_context,
           updated_at = now()`,
    [parsed.data.systemPrompt, parsed.data.publicContext],
  );

  revalidatePath("/admin/assistant");
  redirect("/admin/assistant?saved=1");
}

export async function resetAssistantConfigAction() {
  await requireAdmin();

  await query(
    `insert into assistant_config (id, system_prompt, public_context, updated_at)
     values (true, $1, $2, now())
     on conflict (id) do update
       set system_prompt = excluded.system_prompt,
           public_context = excluded.public_context,
           updated_at = now()`,
    [DEFAULT_SYSTEM_PROMPT, DEFAULT_PUBLIC_CONTEXT],
  );

  revalidatePath("/admin/assistant");
  redirect("/admin/assistant?saved=reset");
}
