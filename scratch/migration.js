import { getSql } from "./lib/db";

async function run() {
  const sql = getSql();
  console.log("Creando tabla category_settings...");
  
  await sql.query(`
    create table if not exists public.category_settings (
      id text primary key,
      image_base64 text not null,
      updated_at timestamptz not null default now()
    );
  `);
  
  console.log("Tabla creada exitosamente.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
