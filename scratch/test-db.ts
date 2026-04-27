import { neon } from "@neondatabase/serverless";

type SqlClient = {
  query: <TRow = unknown>(query: string, params?: unknown[]) => Promise<TRow[]>;
};

async function test() {
  const url = process.env.DATABASE_URL;
  if (!url) return;
  const sql = neon(url) as unknown as SqlClient;

  try {
    console.log("Running migrations...");
    await sql.query("alter table category_settings add column if not exists image_url text");
    await sql.query("alter table category_settings alter column image_base64 drop not null");
    console.log("Migrations successful!");

    const category = "sacos";
    const imageUrl = "https://example.com/test-v2.jpg";
    console.log("Testing insert/update for category:", category);
    await sql.query(`
      insert into category_settings (id, image_url, updated_at)
      values ($1, $2, now())
      on conflict (id) do update set
        image_url = excluded.image_url,
        updated_at = now()
    `, [category, imageUrl]);
    console.log("Success!");
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
