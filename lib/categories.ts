import { getSql, hasDatabaseUrl } from "@/lib/db";
import { type CategorySlug } from "@/types/product";
import { categoryArtwork as defaultArtwork } from "@/lib/constants";

export async function getCategoryArtwork(): Promise<Record<CategorySlug, string>> {
  if (!hasDatabaseUrl()) return defaultArtwork;

  try {
    const sql = getSql();
    
    // Ensure table exists
    await sql.query(`
      create table if not exists public.category_settings (
        id text primary key,
        image_base64 text not null,
        updated_at timestamptz not null default now()
      );
    `);

    const rows = await sql.query("select id, image_base64 from category_settings");
    
    const artwork = { ...defaultArtwork };
    rows.forEach((row: any) => {
      if (row.id in artwork) {
        artwork[row.id as CategorySlug] = row.image_base64;
      }
    });

    return artwork;
  } catch (error) {
    console.error("Error fetching category artwork:", error);
    return defaultArtwork;
  }
}

export async function updateCategoryArtwork(category: CategorySlug, imageBase64: string) {
  const sql = getSql();
  await sql.query(
    `
    insert into category_settings (id, image_base64, updated_at)
    values ($1, $2, now())
    on conflict (id) do update set
      image_base64 = excluded.image_base64,
      updated_at = now()
    `,
    [category, imageBase64]
  );
}
