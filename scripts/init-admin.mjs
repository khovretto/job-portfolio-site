import process from "node:process";
import bcrypt from "bcryptjs";
import { Client } from "pg";

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!ADMIN_EMAIL) throw new Error("ADMIN_EMAIL is required");
if (!ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD is required");
if (ADMIN_PASSWORD.length < 14) {
  throw new Error("ADMIN_PASSWORD must be at least 14 characters");
}

const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
const client = new Client({ connectionString: DATABASE_URL });
await client.connect();

try {
  await client.query(
    `insert into admin_users (email, password_hash)
     values ($1, $2)
     on conflict (email)
     do update set password_hash = excluded.password_hash, updated_at = now()`,
    [ADMIN_EMAIL.toLowerCase(), hash],
  );
  console.log(`admin ready: ${ADMIN_EMAIL.toLowerCase()}`);
} finally {
  await client.end();
}
