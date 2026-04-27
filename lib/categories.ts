import { getSql, hasDatabaseUrl } from "@/lib/db";
import { type CategorySlug } from "@/types/product";
import { categoryArtwork as defaultArtwork } from "@/lib/constants";

type CategorySettingsRow = {
  id: string;
  image_url: string;
};

export async function getCategoryArtwork(): Promise<Record<CategorySlug, string>> {
  if (!hasDatabaseUrl()) return defaultArtwork;

  try {
    const sql = getSql();
    
    // Ensure table exists
    await sql.query(`
      create table if not exists public.category_settings (
        id text primary key,
        image_url text not null default '',
        updated_at timestamptz not null default now()
      );
    `);

    // Migración: Si la tabla existe pero no tiene image_url, la agregamos
    // Y nos aseguramos que image_base64 sea opcional (puede venir de una versión antigua)
    try {
      await sql.query("alter table category_settings add column if not exists image_url text");
      await sql.query("alter table category_settings alter column image_base64 drop not null");
    } catch {
      // Ignorar si hay error menor (ej. la columna no existe)
    }

    const rows = await sql.query("select id, image_url from category_settings");
    
    const artwork = { ...defaultArtwork };
    (rows as CategorySettingsRow[]).forEach((row) => {
      if (row.id in artwork) {
        artwork[row.id as CategorySlug] = row.image_url;
      }
    });

    return artwork;
  } catch (error) {
    console.error("Error fetching category artwork:", error);
    return defaultArtwork;
  }
}

export async function updateCategoryArtwork(category: CategorySlug, imageUrl: string) {
  const sql = getSql();
  await sql.query(
    `
    insert into category_settings (id, image_url, updated_at)
    values ($1, $2, now())
    on conflict (id) do update set
      image_url = excluded.image_url,
      updated_at = now()
    `,
    [category, imageUrl]
  );
}
