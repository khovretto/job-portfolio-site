import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

const COOKIE_NAME = "portfolio_admin_session";
const SESSION_DAYS = 14;

function sign(value: string) {
  const secret = process.env.SESSION_SECRET || "development-session-secret";
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function encodeSession(id: string) {
  return `${id}.${sign(id)}`;
}

function decodeSession(value?: string) {
  if (!value) return null;
  const [id, signature] = value.split(".");
  if (!id || !signature) return null;
  const expected = sign(id);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  return id;
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(adminUserId: number) {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await query(
    `insert into sessions (id, admin_user_id, expires_at)
     values ($1, $2, $3)`,
    [id, adminUserId, expiresAt],
  );
  return { value: encodeSession(id), expiresAt };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const id = decodeSession(cookieStore.get(COOKIE_NAME)?.value);
  if (!id) return null;

  const result = await query<{
    session_id: string;
    admin_user_id: number;
    email: string;
  }>(
    `select s.id as session_id, u.id as admin_user_id, u.email
     from sessions s
     join admin_users u on u.id = s.admin_user_id
     where s.id = $1 and s.expires_at > now()`,
    [id],
  );

  return result.rows[0] || null;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function setSessionCookie(value: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  const id = decodeSession(cookieStore.get(COOKIE_NAME)?.value);
  if (id) await query(`delete from sessions where id = $1`, [id]);
  cookieStore.delete(COOKIE_NAME);
}
