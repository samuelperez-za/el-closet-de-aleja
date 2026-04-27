import { neon } from "@neondatabase/serverless";

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Falta DATABASE_URL.");
  }

  const sql = neon(process.env.DATABASE_URL);
  return {
    query: (query: string, params: any[] = []) => (sql as any).query(query, params),
  };
}
