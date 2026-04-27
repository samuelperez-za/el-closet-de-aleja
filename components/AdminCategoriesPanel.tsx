"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { categories, type CategorySlug } from "@/types/product";
import { categoryDescription, categoryLabel, getCategoryArtworkStyle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AdminCategoriesPanel({ initialArtwork }: { initialArtwork: Record<CategorySlug, string> }) {
  const [artwork, setArtwork] = useState(initialArtwork);
  const [loadingCategory, setLoadingCategory] = useState<CategorySlug | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleImageChange(category: CategorySlug, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoadingCategory(category);
    setStatusMessage(null);

    try {
      // 1. Subir a Vercel Blob usando nuestra API existente
      const formData = new FormData();
      formData.append("files", file);

      const uploadResponse = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Error al subir la imagen a la nube.");
      }
      
      const { urls } = await uploadResponse.json();
      const url = urls?.[0];

      if (!url) {
        throw new Error("No se recibió la URL de la imagen subida.");
      }

      // 2. Guardar la URL en la configuración de la categoría
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, imageUrl: url }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar la configuración de la categoría en la base de datos.");
      }

      setArtwork((prev) => ({ ...prev, [category]: url }));
      setStatusMessage({ type: "success", text: `Imagen de ${categoryLabel(category)} actualizada correctamente.` });
    } catch (error: unknown) {
      console.error("Error en handleImageChange:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      setStatusMessage({ type: "error", text: errorMessage });
    } finally {
      setLoadingCategory(null);
      // Limpiar el input para permitir subir la misma imagen si fuera necesario
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="display-title text-4xl font-semibold text-primary-strong">Personalización de Categorías</h2>
          <p className="mt-2 text-sm text-muted">Cambia las imágenes principales de tus categorías para darle un toque fresco a tu tienda.</p>
        </div>
      </div>

      {statusMessage && (
        <div className={`rounded-xl p-4 text-sm font-medium ${
          statusMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-rose-50 text-rose-700 border border-rose-100"
        }`}>
          {statusMessage.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const isThisLoading = loadingCategory === category;
          const currentArtwork = artwork[category] || "";

          return (
            <Card key={category} className="overflow-hidden rounded-[2rem] border-none bg-white p-0 shadow-sm transition-all hover:shadow-md">
              <div className="relative group">
                <div 
                  className="h-64 w-full bg-slate-100 transition-opacity group-hover:opacity-90" 
                  style={getCategoryArtworkStyle(currentArtwork)} 
                />
                {isThisLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                  <p className="px-4 text-center text-xs font-medium text-white">Usa el botón de abajo para cambiar la foto</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="min-h-[100px]">
                  <h3 className="text-xl font-bold text-primary-strong">{categoryLabel(category)}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted line-clamp-3">{categoryDescription(category)}</p>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted/80">Imagen actual</p>
                    <p className="mt-0.5 truncate text-[10px] text-muted italic">
                      {currentArtwork.startsWith("http") ? "Imagen en la nube" : "Imagen predeterminada"}
                    </p>
                  </div>
                  
                  <div className="relative ml-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(category, e)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      disabled={isThisLoading}
                    />
                    <Button variant="outline" size="sm" className="pointer-events-none rounded-full" disabled={isThisLoading}>
                      {isThisLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-2" />}
                      Cambiar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
