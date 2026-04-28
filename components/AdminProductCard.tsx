"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { categoryLabel, cn, formatPrice, getOriginalPrice, getProductStatus, getWhatsAppLink } from "@/lib/utils";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AdminProductCard({ product }: { product: Product }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const status = getProductStatus(product);
  const originalPrice = getOriginalPrice(product);

  async function handleDelete() {
    const confirmed = window.confirm("¿Quieres eliminar esta prenda?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] p-0">
      <ProductImageGallery
        images={product.images.map((image) => image.image_url)}
        productName={product.name}
        aspectClassName="aspect-[4/3.6]"
      />

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-primary-strong sm:text-lg">{product.name}</h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted sm:mt-2">
              {categoryLabel(product.category)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5 text-right sm:gap-1">
            {product.is_promo && originalPrice ? (
              <span className="relative inline-flex text-xs font-medium text-muted/70 sm:text-sm">
                <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-current" aria-hidden="true" />
                <span>{formatPrice(originalPrice)}</span>
              </span>
            ) : null}
            <span
              className={cn(
                "shrink-0 text-sm font-extrabold sm:text-base",
                product.is_promo ? "text-primary-strong" : "text-primary-strong",
              )}
            >
              {formatPrice(product.price)}
            </span>
            {product.is_promo && product.discount_percentage ? (
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d14b32] sm:text-xs">
                {product.discount_percentage}% OFF
              </span>
            ) : null}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted sm:mt-4 sm:leading-7">{product.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
          <Badge>
            {product.is_promo 
              ? (product.discount_percentage ? `Promoción ${product.discount_percentage}%` : "Promoción")
              : "Colección"}
          </Badge>
          <Badge>{status}</Badge>
          <Badge>{product.is_active ? "Visible" : "Oculto"}</Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
          <Link href={`/admin/productos/${product.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <a href={getWhatsAppLink(product)} target="_blank" rel="noreferrer">
            <Button variant="ghost" size="sm">
              Reservar
            </Button>
          </a>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
}
