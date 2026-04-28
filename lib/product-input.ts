import { z } from "zod";
import { slugify } from "@/lib/utils";
import { categories, type ProductInput } from "@/types/product";

const productInputSchema = z.object({
  name: z.string().min(3, "Escribe un nombre más completo."),
  description: z.string().min(12, "Agrega una descripción útil."),
  price: z.number().min(1000, "Ingresa un precio válido."),
  category: z.enum(categories),
  is_promo: z.boolean(),
  is_active: z.boolean(),
  is_reserved: z.boolean(),
  whatsapp_message: z.string().nullable().optional(),
  discount_percentage: z.number().min(1, "Ingresa un descuento válido.").max(100, "El descuento no puede superar el 100%.").nullable().optional(),
  original_price: z.number().min(1000, "Ingresa un precio original válido.").nullable().optional(),
  image_urls: z.array(z.string().min(1)).min(1, "Sube al menos una imagen para la prenda.").optional(),
}).superRefine((value, ctx) => {
  if (!value.is_promo) return;

  if (!value.original_price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["original_price"],
      message: "Agrega el precio original para calcular la promoción.",
    });
  }

  if (!value.discount_percentage) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["discount_percentage"],
      message: "Agrega el porcentaje de descuento de la promoción.",
    });
  }
}).transform((value) => {
  if (!value.is_promo || !value.original_price || !value.discount_percentage) {
    return {
      ...value,
      discount_percentage: null,
      original_price: null,
      slug: slugify(value.name),
    };
  }

  const discountedPrice = Math.round(value.original_price * (1 - value.discount_percentage / 100));

  return {
    ...value,
    price: discountedPrice,
    slug: slugify(value.name),
  };
});

export function parseProductInput(value: unknown): ProductInput {
  return productInputSchema.parse(value);
}

export function getProductMutationErrorMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message || "Revisa los datos del producto.";
  }

  if (error instanceof Error) {
    if (error.message.includes("products_slug_key")) {
      return "Ya existe un producto con ese enlace. Usa otro slug.";
    }

    if (error.message.includes("DATABASE_URL")) {
      return "Falta configurar la base de datos del proyecto.";
    }
  }

  return "Ocurrió un error guardando la prenda.";
}
