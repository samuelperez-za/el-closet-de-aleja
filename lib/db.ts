import { neon } from "@neondatabase/serverless";

type SqlClient = {
  query: <TRow = unknown>(query: string, params?: unknown[]) => Promise<TRow[]>;
};

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Falta DATABASE_URL.");
  }

  const sql = neon(process.env.DATABASE_URL) as unknown as SqlClient;
  return {
    query: <TRow = unknown>(query: string, params: unknown[] = []) => sql.query<TRow>(query, params),
  };
}
