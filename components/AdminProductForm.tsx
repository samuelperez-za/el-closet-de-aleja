"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { categories, type Product, type ProductInput } from "@/types/product";
import { categoryLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const productSchema = z.object({
  name: z.string().min(3, "Escribe un nombre más completo."),
  description: z.string().min(12, "Agrega una descripción útil."),
  price: z.coerce.number().min(1000, "Ingresa un precio válido."),
  category: z.enum(categories),
  is_promo: z.boolean(),
  is_reserved: z.boolean(),
  is_active: z.boolean(),
  whatsapp_message: z.string().optional(),
  discount_percentage: z.coerce.number().optional().nullable(),
  original_price: z.coerce.number().optional().nullable(),
});

type ProductFormValues = z.infer<typeof productSchema>;
type ProductFormInput = z.input<typeof productSchema>;

function toOptionalNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Uploads image files to Vercel Blob via the admin upload endpoint. Returns the public URLs. */
async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as { urls?: string[]; error?: string };

  if (!response.ok || !data.urls) {
    throw new Error(data.error || "No fue posible subir las imágenes.");
  }

  return data.urls;
}

export function AdminProductForm({ product }: { product?: Product | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Keep selected File objects for upload and local preview URLs
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "sacos",
      is_promo: product?.is_promo || false,
      is_reserved: product?.is_reserved || false,
      is_active: product?.is_active ?? true,
      whatsapp_message: product?.whatsapp_message || "",
      discount_percentage: product?.discount_percentage || null,
      original_price: product?.original_price || null,
    },
  });

  const watchedPromo = useWatch({ control: form.control, name: "is_promo" });
  const watchedReserved = useWatch({ control: form.control, name: "is_reserved" });
  const watchedActive = useWatch({ control: form.control, name: "is_active" });
  const watchedOriginalPrice = useWatch({ control: form.control, name: "original_price" });
  const watchedDiscountPercentage = useWatch({ control: form.control, name: "discount_percentage" });

  // Auto-calculate price from original price and percentage when in promo
  useEffect(() => {
    const originalPrice = toOptionalNumber(watchedOriginalPrice);
    const discountPercentage = toOptionalNumber(watchedDiscountPercentage);

    if (watchedPromo && originalPrice && discountPercentage !== null) {
      const newPrice = Math.round(originalPrice * (1 - discountPercentage / 100));
      if (form.getValues("price") !== newPrice) {
        form.setValue("price", newPrice);
      }
    }
  }, [watchedOriginalPrice, watchedDiscountPercentage, watchedPromo, form]);

  // Update WhatsApp message automatically when promo details change
  useEffect(() => {
    if (watchedPromo && watchedDiscountPercentage) {
      const currentName = form.getValues("name");
      form.setValue(
        "whatsapp_message",
        `¡Hola Aleja! Me interesa este producto que está en PROMOCIÓN (${watchedDiscountPercentage}% OFF): ${currentName || "esta prenda"}. ✨`
      );
    }
  }, [watchedDiscountPercentage, watchedPromo, form]);

  // Show local previews for new files, or existing product images
  const imagePreview = previewUrls.length
    ? previewUrls
    : product?.images.map((image) => image.image_url) || [];

  function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      try {
        setStatusMessage(null);

        // 1. Determine image URLs: upload new files or keep existing ones
        let finalImageUrls: string[];

        if (pendingFiles.length) {
          setUploadProgress("Subiendo imágenes…");
          finalImageUrls = await uploadImages(pendingFiles);
          setUploadProgress(null);
        } else {
          finalImageUrls = product?.images.map((image) => image.image_url) || [];
        }

        if (!finalImageUrls.length) {
          throw new Error("Sube al menos una imagen para la prenda.");
        }

        // 2. Save the product with the real Blob URLs
        const payload: ProductInput = {
          name: values.name,
          description: values.description,
          price: values.price,
          category: values.category,
          is_promo: values.is_promo,
          is_reserved: values.is_reserved,
          is_active: values.is_active,
          whatsapp_message: values.whatsapp_message || null,
          discount_percentage: values.discount_percentage || null,
          original_price: values.original_price || null,
          image_urls: finalImageUrls,
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
        setUploadProgress(null);
        setStatusMessage(error instanceof Error ? error.message : "Ocurrió un error guardando la prenda.");
      }
    });
  }

  function handleImageSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      setPendingFiles([]);
      setPreviewUrls([]);
      return;
    }

    // Revoke old object URLs to avoid memory leaks
    previewUrls.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    // Create lightweight object URLs for preview (no base64 conversion)
    const urls = files.map((file) => URL.createObjectURL(file));
    setPendingFiles(files);
    setPreviewUrls(urls);
    setStatusMessage(null);
  }

  function removeImage(index: number) {
    const url = previewUrls[index];
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);

    const newFiles = pendingFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPendingFiles(newFiles);
    setPreviewUrls(newUrls);

    // Reset file input so the user can re-select
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <Card className="rounded-[2rem] p-7 md:p-8">
      <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Nombre del producto</Label>
            <Input {...form.register("name")} placeholder="Ej. Blazer rosa vintage" />
            <p className="mt-2 text-xs text-rose-600">{form.formState.errors.name?.message}</p>
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
          {!watchedPromo ? (
            <div>
              <Label>Precio de Venta</Label>
              <Input {...form.register("price")} type="number" min={0} placeholder="45000" />
              <p className="mt-2 text-xs text-rose-600">{form.formState.errors.price?.message}</p>
            </div>
          ) : (
            <>
              <div>
                <Label>Precio Original</Label>
                <Input {...form.register("original_price")} type="number" min={0} placeholder="Ej. 60000" />
                <p className="mt-2 text-xs text-muted">Precio antes del descuento.</p>
                <p className="mt-2 text-xs text-rose-600">{form.formState.errors.original_price?.message}</p>
              </div>
              <div>
                <Label>Descuento (%)</Label>
                <Input {...form.register("discount_percentage")} type="number" min={0} max={100} placeholder="20" />
                <p className="mt-2 text-xs text-muted">Porcentaje a rebajar.</p>
                <p className="mt-2 text-xs text-rose-600">{form.formState.errors.discount_percentage?.message}</p>
              </div>
              <div>
                <Label>Precio Final (Calculado)</Label>
                <Input {...form.register("price")} type="number" readOnly className="bg-muted/10 font-bold text-primary-strong" />
                <p className="mt-2 text-xs text-primary-strong">Este precio se calcula solo.</p>
              </div>
            </>
          )}

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
            onChange={(value) => {
              form.setValue("is_promo", value);
              if (!value) {
                form.setValue("original_price", null);
                form.setValue("discount_percentage", null);
              }
            }}
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
            ref={fileInputRef}
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
              <div key={`img-${index}`} className="group relative overflow-hidden rounded-[1.4rem] border border-border bg-white/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={`Vista previa ${index + 1}`} className="h-36 w-full object-cover" />
                {previewUrls.length > 0 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Eliminar imagen ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {uploadProgress ? (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            {uploadProgress}
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
