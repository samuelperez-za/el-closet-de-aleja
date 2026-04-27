"use client";

import Link from "next/link";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryDescription, categoryHref, categoryLabel } from "@/lib/utils";
import type { CategorySlug } from "@/types/product";

export function CategoryCardClient({
  category,
  artwork,
}: {
  category: CategorySlug;
  artwork: string;
}) {
  const [imageError, setImageError] = useState(false);
  
  // Detect if we have a valid image URL or CSS value
  const hasRealImage = artwork && artwork !== "none" && (
    artwork.includes("url(") || 
    artwork.startsWith("http") || 
    artwork.startsWith("/") || 
    artwork.startsWith("data:")
  );

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-[1.8rem] border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:rounded-[2.2rem]">
      {/* Image Area */}
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[4/5.5]">
        {hasRealImage && !imageError ? (
          <div
            className="h-full w-full"
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
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4 sm:p-7">
        <h3 className="text-base font-bold text-primary-strong sm:text-2xl">
          {categoryLabel(category)}
        </h3>
        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted sm:mt-3 sm:text-sm sm:leading-7">
          {categoryDescription(category)}
        </p>
        
        <div className="mt-auto pt-4 sm:pt-6">
          <Link href={categoryHref(category)} className="block w-full">
            <Button 
              variant="secondary" 
              className="h-9 w-full rounded-full bg-primary/5 text-[11px] font-bold text-primary hover:bg-primary hover:text-white sm:h-12 sm:text-sm"
            >
              Ver prendas
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

function CategoryPlaceholder({ category }: { category: CategorySlug }) {
  const gradients: Record<CategorySlug, string> = {
    sacos: "linear-gradient(135deg, #f5e6e0 0%, #e8d5cf 50%, #dfc4be 100%)",
    "crop-tops": "linear-gradient(135deg, #f0e0f0 0%, #e4d0e8 50%, #d8c0dc 100%)",
    jean: "linear-gradient(135deg, #dce6f0 0%, #c8d8e8 50%, #b4cae0 100%)",
    deportivo: "linear-gradient(135deg, #e0f0e6 0%, #cfe8d8 50%, #bee0ca 100%)",
  };

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: gradients[category] }}
    >
      <div className="flex flex-col items-center gap-2 text-primary/30">
        <ImageOff className="h-6 w-6 sm:h-10 sm:w-10" />
        <span className="text-[10px] font-bold uppercase tracking-widest sm:text-xs">
          {categoryLabel(category)}
        </span>
      </div>
    </div>
  );
}

function getArtworkStyle(artwork: string): React.CSSProperties {
  const value = artwork.trim();
  const overlay = "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 100%)";

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

function extractImageUrl(artwork: string): string {
  if (artwork.startsWith("http") || artwork.startsWith("/") || artwork.startsWith("data:")) {
    return artwork;
  }
  const match = artwork.match(/url\(['"]?([^'")\s]+)['"]?\)/);
  return match?.[1] || "";
}
