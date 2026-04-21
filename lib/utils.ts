import { clsx, type ClassValue } from "clsx";
import type { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";
import { categories, type CategorySlug, type Product, type ProductStatus } from "@/types/product";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function categoryLabel(category: CategorySlug) {
  const labels: Record<CategorySlug, string> = {
    sacos: "Sacos",
    "crop-tops": "Crop tops",
    jean: "Jean",
    deportivo: "Deportivo",
  };
  return labels[category];
}

export function categoryDescription(category: CategorySlug) {
  const descriptions: Record<CategorySlug, string> = {
    sacos: "Capas suaves y femeninas para elevar cualquier look.",
    "crop-tops": "Piezas frescas, coquetas y juveniles con mucho encanto.",
    jean: "Favoritos atemporales para combinar estilo y comodidad.",
    deportivo: "Looks relajados, modernos y lindos para el día a día.",
  };
  return descriptions[category];
}

export function categoryHref(category: CategorySlug) {
  return `/categoria/${category}`;
}

export function getCategoryArtworkStyle(artwork: string): CSSProperties {
  const value = artwork.trim();
  const overlay = "linear-gradient(180deg, rgba(85, 62, 79, 0.08), rgba(85, 62, 79, 0.08))";

  if (value.startsWith("data:") || value.startsWith("/") || value.startsWith("http")) {
    return {
      backgroundImage: `${overlay}, url("${value}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return {
    backgroundImage: value.replace(/\s+center\/cover\s*$/, ""),
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

export function getProductStatus(product: Pick<Product, "is_active" | "is_reserved">): ProductStatus {
  if (!product.is_active) return "oculto";
  if (product.is_reserved) return "reservado";
  return "disponible";
}

export function getWhatsAppLink(product: Pick<Product, "name" | "price" | "category" | "whatsapp_message">) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573000000000";
  const message =
    product.whatsapp_message ||
    `Hola, vi la prenda "${product.name}" en El Closet de Aleja y quiero reservarla.\nCategoría: ${categoryLabel(
      product.category,
    )}\nPrecio: ${formatPrice(product.price)}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function isValidCategory(value: string): value is CategorySlug {
  return categories.includes(value as CategorySlug);
}
