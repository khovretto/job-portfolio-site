import { Pool, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var __portfolioPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for database operations");
  }

  if (!global.__portfolioPool) {
    global.__portfolioPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 8,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return global.__portfolioPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params);
}

export async function safeQuery(text: string, params: unknown[] = []): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  try {
    await query(text, params);
    return true;
  } catch (error) {
    console.warn("database write skipped", error instanceof Error ? error.message : error);
    return false;
  }
}
