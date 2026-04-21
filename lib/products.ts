import { cache } from "react";
import { demoProducts } from "@/lib/mock-data";
import { getSql, hasDatabaseUrl } from "@/lib/db";
import { categories, type CategorySlug, type Product, type ProductInput } from "@/types/product";

type ProductRow = Omit<Product, "images"> & {
  image_url: string | null;
  sort_order: number | null;
};

function normalizeProducts(rows: ProductRow[]): Product[] {
  const map = new Map<string, Product>();

  rows.forEach((row) => {
    const current = map.get(row.id);

    if (!current) {
      map.set(row.id, {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        price: Number(row.price),
        category: row.category,
        is_promo: row.is_promo,
        is_active: row.is_active,
        is_reserved: row.is_reserved,
        whatsapp_message: row.whatsapp_message,
        created_at: row.created_at,
        updated_at: row.updated_at,
        images: row.image_url
          ? [{ image_url: row.image_url, sort_order: row.sort_order ?? 0 }]
          : [],
      });
      return;
    }

    if (row.image_url) {
      current.images.push({ image_url: row.image_url, sort_order: row.sort_order ?? current.images.length });
    }
  });

  return [...map.values()].map((product) => ({
    ...product,
    images: product.images.sort((a, b) => a.sort_order - b.sort_order),
  }));
}

async function queryProducts(whereClause = "", params: unknown[] = []) {
  if (!hasDatabaseUrl()) return null;

  const sql = getSql();
  const query = `
    select
      p.id,
      p.name,
      p.slug,
      p.description,
      p.price,
      p.category,
      p.is_promo,
      p.is_active,
      p.is_reserved,
      p.whatsapp_message,
      p.created_at,
      p.updated_at,
      pi.image_url,
      pi.sort_order
    from products p
    left join product_images pi on pi.product_id = p.id
    ${whereClause}
    order by p.created_at desc, pi.sort_order asc
  `;

  const rows = await sql.query(query, params);
  return normalizeProducts(rows as ProductRow[]);
}

export const getPublicProducts = cache(async (): Promise<Product[]> => {
  const products = await queryProducts("where p.is_active = $1 and p.is_reserved = $2", [true, false]);
  return products || demoProducts.filter((product) => product.is_active && !product.is_reserved);
});

export const getAdminProducts = cache(async (): Promise<Product[]> => {
  const products = await queryProducts();
  return products || demoProducts;
});

export async function getPromoProducts() {
  const products = await getPublicProducts();
  return products.filter((product) => product.is_promo);
}

export async function getProductsByCategory(category: CategorySlug) {
  const products = await getPublicProducts();
  return products.filter((product) => product.category === category);
}

export async function getProductById(id: string) {
  const products = await getAdminProducts();
  return products.find((product) => product.id === id) || null;
}

export async function createProduct(input: ProductInput) {
  const sql = getSql();
  const result = await sql.query(
    `
      insert into products
        (name, slug, description, price, category, is_promo, is_active, is_reserved, whatsapp_message)
      values
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning id
    `,
    [
      input.name,
      input.slug,
      input.description,
      input.price,
      input.category,
      input.is_promo,
      input.is_active,
      input.is_reserved,
      input.whatsapp_message || null,
    ],
  );

  const productId = (result[0] as { id: string }).id;
  await replaceProductImages(productId, input.image_urls || []);
  return productId;
}

export async function updateProduct(id: string, input: ProductInput) {
  const sql = getSql();
  await sql.query(
    `
      update products
      set
        name = $2,
        slug = $3,
        description = $4,
        price = $5,
        category = $6,
        is_promo = $7,
        is_active = $8,
        is_reserved = $9,
        whatsapp_message = $10,
        updated_at = now()
      where id = $1
    `,
    [
      id,
      input.name,
      input.slug,
      input.description,
      input.price,
      input.category,
      input.is_promo,
      input.is_active,
      input.is_reserved,
      input.whatsapp_message || null,
    ],
  );

  await replaceProductImages(id, input.image_urls || []);
}

export async function deleteProduct(id: string) {
  const sql = getSql();
  await sql.query("delete from products where id = $1", [id]);
}

async function replaceProductImages(productId: string, imageUrls: string[]) {
  const sql = getSql();
  await sql.query("delete from product_images where product_id = $1", [productId]);

  for (const [index, imageUrl] of imageUrls.entries()) {
    await sql.query(
      `
        insert into product_images (product_id, image_url, sort_order)
        values ($1, $2, $3)
      `,
      [productId, imageUrl, index],
    );
  }
}

export function getDashboardStats(products: Product[]) {
  return {
    total: products.length,
    promos: products.filter((product) => product.is_promo).length,
    reserved: products.filter((product) => product.is_reserved).length,
    active: products.filter((product) => product.is_active).length,
  };
}

export function getCategoryCounts(products: Product[]) {
  return categories.map((category) => ({
    category,
    count: products.filter((product) => product.category === category).length,
  }));
}
