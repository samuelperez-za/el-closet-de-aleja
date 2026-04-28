"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { categoryLabel, cn, formatPrice, getOriginalPrice, getWhatsAppLink } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const imageUrls = product.images.map((image) => image.image_url);
  const originalPrice = getOriginalPrice(product);

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-[1.6rem] p-0 sm:rounded-[2rem]">
      <div className="relative">
        {product.is_promo ? (
          <Badge className="absolute left-2 top-2 z-10 text-[10px] sm:left-4 sm:top-4 sm:text-xs">
            {product.discount_percentage ? `Promo ${product.discount_percentage}%` : "Promo"}
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
          <div className="flex flex-col items-end gap-0.5 text-right sm:gap-1">
            {product.is_promo && originalPrice ? (
              <span className="relative inline-flex text-[10px] font-medium text-muted/70 sm:text-sm">
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
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d14b32] sm:text-xs">
                {product.discount_percentage}% OFF
              </span>
            ) : null}
          </div>
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
