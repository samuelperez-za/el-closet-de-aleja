import { z } from "zod";
import { categories, type ProductInput } from "@/types/product";

const productInputSchema = z.object({
  name: z.string().min(3, "Escribe un nombre más completo."),
  slug: z.string().min(3, "El slug es obligatorio."),
  description: z.string().min(12, "Agrega una descripción útil."),
  price: z.number().min(1000, "Ingresa un precio válido."),
  category: z.enum(categories),
  is_promo: z.boolean(),
  is_active: z.boolean(),
  is_reserved: z.boolean(),
  whatsapp_message: z.string().nullable().optional(),
  image_urls: z.array(z.string().min(1)).min(1, "Sube al menos una imagen para la prenda.").optional(),
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
