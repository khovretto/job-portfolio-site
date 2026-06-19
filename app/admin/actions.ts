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
import { deleteCvFile, upsertCvFile } from "@/lib/cv-data";
import { isLocale } from "@/lib/i18n/config";

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

const MAX_CV_BYTES = 8 * 1024 * 1024;

export async function uploadCvAction(formData: FormData) {
  await requireAdmin();

  const locale = String(formData.get("locale") || "");
  if (!isLocale(locale)) {
    redirect("/admin/cv?error=locale");
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect(`/admin/cv?error=empty`);
  }

  if (file.size > MAX_CV_BYTES) {
    redirect(`/admin/cv?error=size`);
  }

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    redirect(`/admin/cv?error=type`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.trim() || `cv-${locale}.pdf`;
  await upsertCvFile(locale, filename, "application/pdf", buffer);

  revalidatePath("/admin/cv");
  redirect("/admin/cv?saved=1");
}

export async function deleteCvAction(formData: FormData) {
  await requireAdmin();

  const locale = String(formData.get("locale") || "");
  if (!isLocale(locale)) {
    redirect("/admin/cv?error=locale");
  }

  await deleteCvFile(locale);
  revalidatePath("/admin/cv");
  redirect("/admin/cv?saved=deleted");
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
