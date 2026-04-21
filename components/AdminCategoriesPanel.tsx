"use client";

import { useState, useTransition } from "react";
import { Loader2, Upload } from "lucide-react";
import { categories, type CategorySlug } from "@/types/product";
import { categoryDescription, categoryLabel, getCategoryArtworkStyle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AdminCategoriesPanel({ initialArtwork }: { initialArtwork: Record<CategorySlug, string> }) {
  const [artwork, setArtwork] = useState(initialArtwork);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleImageChange(category: CategorySlug, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = String(reader.result || "");
      
      startTransition(async () => {
        try {
          const response = await fetch("/api/admin/categories", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, imageBase64: base64 }),
          });

          if (!response.ok) throw new Error("No se pudo guardar la imagen.");

          setArtwork((prev) => ({ ...prev, [category]: base64 }));
          setStatusMessage({ type: "success", text: `Imagen de ${categoryLabel(category)} actualizada.` });
        } catch (error) {
          setStatusMessage({ type: "error", text: "Error al actualizar la imagen." });
        }
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="display-title text-4xl font-semibold text-primary-strong">Personalización de Categorías</h2>
        <p className="mt-2 text-sm text-muted">Cambia las imágenes principales de tus categorías para darle un toque fresco a tu tienda.</p>
      </div>

      {statusMessage && (
        <p className={`text-sm font-medium ${statusMessage.type === "success" ? "text-green-600" : "text-rose-600"}`}>
          {statusMessage.text}
        </p>
      )}

      <p className="text-sm text-muted">Vista previa real de cómo se verán en la colección principal.</p>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Card key={category} className="overflow-hidden rounded-[2rem] p-0">
            <div className="relative group">
              <div className="h-64 w-full" style={getCategoryArtworkStyle(artwork[category])} />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-center text-sm font-medium text-white">Haz clic en subir foto para reemplazar esta imagen</p>
              </div>
            </div>
            <div className="p-6">
              <div className="min-h-32">
                <h3 className="text-xl font-semibold text-primary-strong">{categoryLabel(category)}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{categoryDescription(category)}</p>
                <Button variant="ghost" className="mt-5" disabled>
                  Ver prendas
                </Button>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Reemplazar imagen</p>
                  <p className="mt-1 text-xs text-muted">Se actualizará la vista previa al instante.</p>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(category, e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isPending}
                  />
                  <Button variant="outline" size="sm" className="pointer-events-none">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Subir foto
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
