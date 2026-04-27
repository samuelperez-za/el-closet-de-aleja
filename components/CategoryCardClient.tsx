"use client";

import Link from "next/link";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryDescription, categoryHref, categoryLabel } from "@/lib/utils";
import type { CategorySlug } from "@/types/product";

/** Category card with fallback for broken/missing images */
export function CategoryCardClient({
  category,
  artwork,
}: {
  category: CategorySlug;
  artwork: string;
}) {
  const [imageError, setImageError] = useState(false);
  const hasRealImage = artwork.includes("url(");

  return (
    <Card className="overflow-hidden rounded-[1.8rem] p-0 shadow-sm transition-shadow hover:shadow-md sm:rounded-[2rem]">
      {hasRealImage && !imageError ? (
        <div
          className="h-36 w-full sm:h-64"
          style={getArtworkStyle(artwork)}
          role="img"
          aria-label={categoryLabel(category)}
        >
          {/* Hidden img to detect load errors */}
          <img
            src={extractImageUrl(artwork)}
            alt=""
            className="hidden"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <CategoryPlaceholder category={category} />
      )}
      <div className="p-3.5 sm:p-6">
        <h3 className="truncate text-sm font-semibold text-primary-strong sm:text-xl">{categoryLabel(category)}</h3>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted sm:mt-3 sm:text-sm sm:leading-7">{categoryDescription(category)}</p>
        <Link href={categoryHref(category)} className="mt-3 inline-flex w-full sm:mt-5 sm:w-auto">
          <Button variant="ghost" size="sm" className="w-full text-[10px] sm:text-sm">Ver prendas</Button>
        </Link>
      </div>
    </Card>
  );
}

/** Gradient placeholder when no image is available or it fails to load */
function CategoryPlaceholder({ category }: { category: CategorySlug }) {
  const gradients: Record<CategorySlug, string> = {
    sacos: "linear-gradient(135deg, #f5e6e0 0%, #e8d5cf 50%, #dfc4be 100%)",
    "crop-tops": "linear-gradient(135deg, #f0e0f0 0%, #e4d0e8 50%, #d8c0dc 100%)",
    jean: "linear-gradient(135deg, #dce6f0 0%, #c8d8e8 50%, #b4cae0 100%)",
    deportivo: "linear-gradient(135deg, #e0f0e6 0%, #cfe8d8 50%, #bee0ca 100%)",
  };

  return (
    <div
      className="flex h-36 w-full items-center justify-center sm:h-64"
      style={{ background: gradients[category] }}
    >
      <div className="flex flex-col items-center gap-1 text-muted/60">
        <ImageOff className="h-5 w-5 sm:h-8 sm:w-8" />
        <span className="text-[10px] font-medium uppercase tracking-widest sm:text-xs">{categoryLabel(category)}</span>
      </div>
    </div>
  );
}

function getArtworkStyle(artwork: string): React.CSSProperties {
  const value = artwork.trim();
  const overlay = "linear-gradient(180deg, rgba(85, 62, 79, 0.08), rgba(85, 62, 79, 0.08))";

  if (value.startsWith("data:") || value.startsWith("/") || value.startsWith("http")) {
    return {
      backgroundImage: `${overlay}, url("${value}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return {
    backgroundImage: value.replace(/\s+center\/cover\s*$/, ""),
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/** Extract the image URL from a CSS background string like `url('/path/to/img.png')` */
function extractImageUrl(artwork: string): string {
  const match = artwork.match(/url\(['"]?([^'")\s]+)['"]?\)/);
  return match?.[1] || "";
}
