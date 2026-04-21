"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { categories, type Product, type ProductInput } from "@/types/product";
import { categoryLabel, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const productSchema = z.object({
  name: z.string().min(3, "Escribe un nombre más completo."),
  slug: z.string().min(3, "El slug es obligatorio."),
  description: z.string().min(12, "Agrega una descripción útil."),
  price: z.coerce.number().min(1000, "Ingresa un precio válido."),
  category: z.enum(categories),
  is_promo: z.boolean(),
  is_reserved: z.boolean(),
  is_active: z.boolean(),
  whatsapp_message: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;
type ProductFormInput = z.input<typeof productSchema>;

export function AdminProductForm({ product }: { product?: Product | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "sacos",
      is_promo: product?.is_promo || false,
      is_reserved: product?.is_reserved || false,
      is_active: product?.is_active ?? true,
      whatsapp_message: product?.whatsapp_message || "",
    },
  });

  const watchedPromo = useWatch({ control: form.control, name: "is_promo" });
  const watchedReserved = useWatch({ control: form.control, name: "is_reserved" });
  const watchedActive = useWatch({ control: form.control, name: "is_active" });
  const imagePreview = selectedImages.length
    ? selectedImages
    : product?.images.map((image) => image.image_url) || [];

  function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      try {
        const finalImages = selectedImages.length
          ? selectedImages
          : product?.images.map((image) => image.image_url) || [];

        if (!finalImages.length) {
          throw new Error("Sube al menos una imagen para la prenda.");
        }

        const payload: ProductInput = {
          name: values.name,
          slug: slugify(values.slug || values.name),
          description: values.description,
          price: values.price,
          category: values.category,
          is_promo: values.is_promo,
          is_reserved: values.is_reserved,
          is_active: values.is_active,
          whatsapp_message: values.whatsapp_message || null,
          image_urls: finalImages,
        };

        const response = await fetch(
          product ? `/api/admin/products/${product.id}` : "/api/admin/products",
          {
            method: product ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        const data = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(data.error || "No fue posible guardar el producto.");
        }

        router.push("/admin/productos");
        router.refresh();
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : "Ocurrió un error guardando la prenda.");
      }
    });
  }

  async function handleImageSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      setSelectedImages([]);
      return;
    }

    const imageDataUrls = await Promise.all(files.map(readFileAsDataUrl));
    setSelectedImages(imageDataUrls);
  }

  return (
    <Card className="rounded-[2rem] p-7 md:p-8">
      <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Nombre del producto</Label>
            <Input
              {...form.register("name")}
              placeholder="Ej. Blazer rosa vintage"
              onChange={(event) => {
                form.register("name").onChange(event);
                if (!form.getValues("slug")) {
                  form.setValue("slug", slugify(event.target.value));
                }
              }}
            />
            <p className="mt-2 text-xs text-rose-600">{form.formState.errors.name?.message}</p>
          </div>

          <div>
            <Label>Slug automático</Label>
            <Input {...form.register("slug")} placeholder="blazer-rosa-vintage" />
            <p className="mt-2 text-xs text-rose-600">{form.formState.errors.slug?.message}</p>
          </div>
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea
            {...form.register("description")}
            placeholder="Describe el estilo, el fit y por qué esta prenda enamora."
          />
          <p className="mt-2 text-xs text-rose-600">{form.formState.errors.description?.message}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Precio</Label>
            <Input {...form.register("price")} type="number" min={0} placeholder="45000" />
            <p className="mt-2 text-xs text-rose-600">{form.formState.errors.price?.message}</p>
          </div>

          <div>
            <Label>Categoría</Label>
            <select
              {...form.register("category")}
              className="w-full rounded-2xl border border-border bg-white/90 px-4 py-3 text-sm outline-none focus:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabel(category)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label>Mensaje personalizado de WhatsApp</Label>
          <Textarea
            {...form.register("whatsapp_message")}
            placeholder='Opcional. Ej. Hola, vi la prenda "Blazer rosa vintage" y quiero reservarla.'
            className="min-h-24"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ToggleField
            label="Marcar como promoción"
            checked={watchedPromo}
            onChange={(value) => form.setValue("is_promo", value)}
          />
          <ToggleField
            label="Marcar como reservada"
            checked={watchedReserved}
            onChange={(value) => form.setValue("is_reserved", value)}
          />
          <ToggleField
            label="Producto visible"
            checked={watchedActive}
            onChange={(value) => form.setValue("is_active", value)}
          />
        </div>

        <div>
          <Label>Imágenes del producto</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelection}
          />
          <p className="mt-2 text-xs text-muted">
            Puedes subir varias imágenes desde el celular o desde el computador. La primera será la principal.
          </p>
        </div>

        {imagePreview.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {imagePreview.map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.4rem] border border-border bg-white/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={`Vista previa ${index + 1}`} className="h-36 w-full object-cover" />
              </div>
            ))}
          </div>
        ) : null}

        {statusMessage ? <p className="text-sm text-primary-strong">{statusMessage}</p> : null}

        <div className="flex flex-wrap gap-4">
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {product ? "Guardar cambios" : "Crear producto"}
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => router.push("/admin/productos")}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`No se pudo leer el archivo ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-[1.6rem] border border-border bg-white/80 px-4 py-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[var(--primary-strong)]"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}
