import { neon } from "@neondatabase/serverless";

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Falta DATABASE_URL.");
  }

  return neon(process.env.DATABASE_URL);
}
