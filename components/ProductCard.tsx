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
    <Card className="flex h-full flex-col overflow-hidden rounded-[1.6rem] p-0 sm:rounded-[2rem]">
      <div className="relative">
        {product.is_promo ? (
          <Badge className="absolute left-2 top-2 z-10 text-[10px] sm:left-4 sm:top-4 sm:text-xs">
            Promo
          </Badge>
        ) : null}
        <ProductImageGallery
          images={imageUrls}
          productName={product.name}
          aspectClassName="aspect-[3/4]"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="flex items-start justify-between gap-1.5 sm:gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold text-primary-strong sm:text-base">
              {product.name}
            </h3>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted sm:mt-1 sm:text-xs sm:tracking-[0.16em]">
              {categoryLabel(product.category)}
            </p>
          </div>
          <span className="shrink-0 text-[11px] font-extrabold text-primary-strong sm:text-sm">
            {formatPrice(product.price)}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-muted sm:mt-3 sm:text-sm sm:leading-7">
          {product.description}
        </p>

        <div className="mt-auto pt-2.5 sm:pt-4">
          <a href={getWhatsAppLink(product)} target="_blank" rel="noreferrer">
            <Button className="w-full text-[10px] sm:text-sm" size="sm">
              Reservar
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
}
