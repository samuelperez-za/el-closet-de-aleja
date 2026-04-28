import type { Product } from "@/types/product";

export const demoProducts: Product[] = [
  {
    id: "1ceca111-8b8d-4c42-9799-4af926f8f101",
    name: "Saco romántico blush",
    slug: "saco-romantico-blush",
    description: "Tejido suave con caída delicada y un tono rosado perfecto para looks dulces y modernos.",
    price: 48000,
    category: "sacos",
    is_promo: true,
    is_active: true,
    is_reserved: false,
    whatsapp_message: null,
    discount_percentage: 20,
    original_price: 60000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
        sort_order: 0,
      },
    ],
  },
  {
    id: "1ceca111-8b8d-4c42-9799-4af926f8f102",
    name: "Crop top lavanda chic",
    slug: "crop-top-lavanda-chic",
    description: "Una pieza fresca, femenina y fácil de combinar para resaltar tu estilo con delicadeza.",
    price: 32000,
    category: "crop-tops",
    is_promo: true,
    is_active: true,
    is_reserved: false,
    whatsapp_message: null,
    discount_percentage: 20,
    original_price: 40000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
        sort_order: 0,
      },
    ],
  },
  {
    id: "1ceca111-8b8d-4c42-9799-4af926f8f103",
    name: "Jean clásico de tiro alto",
    slug: "jean-clasico-de-tiro-alto",
    description: "Versátil, favorecedor y listo para acompañarte en looks casuales o más arreglados.",
    price: 56000,
    category: "jean",
    is_promo: false,
    is_active: true,
    is_reserved: false,
    whatsapp_message: null,
    discount_percentage: null,
    original_price: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
        sort_order: 0,
      },
    ],
  },
  {
    id: "1ceca111-8b8d-4c42-9799-4af926f8f104",
    name: "Set deportivo soft rose",
    slug: "set-deportivo-soft-rose",
    description: "Comodidad femenina y linda para tus días activos, planes relajados o escapadas de fin de semana.",
    price: 64000,
    category: "deportivo",
    is_promo: true,
    is_active: true,
    is_reserved: false,
    whatsapp_message: null,
    discount_percentage: 20,
    original_price: 80000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1506629905607-d9a31748a9a6?auto=format&fit=crop&w=900&q=80",
        sort_order: 0,
      },
    ],
  },
];
