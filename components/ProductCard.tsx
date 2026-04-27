"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { formatPrice, getProductStatus, getWhatsAppLink, categoryLabel } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const status = getProductStatus(product);
  const imageUrls = product.images.map((image) => image.image_url);

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] p-0">
      <div className="relative">
        {product.is_promo ? <Badge className="absolute left-4 top-4 z-10">Promoción especial</Badge> : null}
        <ProductImageGallery images={imageUrls} productName={product.name} aspectClassName="aspect-[4/4.7]" />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-primary-strong sm:text-lg">{product.name}</h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted sm:mt-2">
              {categoryLabel(product.category)}
            </p>
          </div>
          <span className="shrink-0 text-sm font-extrabold text-primary-strong">{formatPrice(product.price)}</span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted sm:mt-4 sm:leading-7">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
          <Badge>Prenda única</Badge>
          <Badge>{status === "disponible" ? "Disponible" : "Por confirmar"}</Badge>
        </div>

        <div className="mt-auto pt-4 sm:pt-6">
          <a href={getWhatsAppLink(product)} target="_blank" rel="noreferrer">
            <Button className="w-full text-sm">Reservar por WhatsApp</Button>
          </a>
        </div>
      </div>
    </Card>
  );
}
