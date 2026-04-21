export const categories = ["sacos", "crop-tops", "jean", "deportivo"] as const;

export type CategorySlug = (typeof categories)[number];

export type ProductImage = {
  id?: string;
  image_url: string;
  sort_order: number;
};

export type ProductStatus = "disponible" | "reservado" | "oculto";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: CategorySlug;
  is_promo: boolean;
  is_active: boolean;
  is_reserved: boolean;
  whatsapp_message: string | null;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
};

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: CategorySlug;
  is_promo: boolean;
  is_active: boolean;
  is_reserved: boolean;
  whatsapp_message?: string | null;
  image_urls?: string[];
};
