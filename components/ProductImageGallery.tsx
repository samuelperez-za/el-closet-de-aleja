"use client";

/* eslint-disable @next/next/no-img-element */

import { ChevronRight, ImageOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ProductImageGallery({
  images,
  productName,
  aspectClassName,
}: {
  images: string[];
  productName: string;
  aspectClassName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;
  const currentFailed = failedImages.has(activeIndex);

  function goToNextImage() {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }

  function handleImageError(index: number) {
    setFailedImages((prev) => new Set(prev).add(index));
  }

  return (
    <div>
      <div className={`relative overflow-hidden bg-[linear-gradient(135deg,rgba(238,187,187,0.5),rgba(203,189,232,0.42))] ${aspectClassName}`}>
        {hasImages && !currentFailed ? (
          <img
            src={images[activeIndex]}
            alt={`${productName} - imagen ${activeIndex + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => handleImageError(activeIndex)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted">
            <ImageOff className="h-8 w-8 opacity-40" />
            <span>{hasImages ? "Imagen no disponible" : "Sin imagen"}</span>
          </div>
        )}

        {hasMultipleImages ? (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full px-0"
              onClick={goToNextImage}
              aria-label="Ver siguiente imagen"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-primary-strong backdrop-blur-sm">
              {activeIndex + 1}/{images.length}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
