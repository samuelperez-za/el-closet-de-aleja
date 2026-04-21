/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice, getProductStatus, getWhatsAppLink, categoryLabel } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const status = getProductStatus(product);
  const mainImage = product.images[0]?.image_url;

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] p-0">
      <div className="relative aspect-[4/4.7] overflow-hidden bg-[linear-gradient(135deg,rgba(238,187,187,0.5),rgba(203,189,232,0.42))]">
        {product.is_promo ? <Badge className="absolute left-4 top-4 z-10">Promoción especial</Badge> : null}
        {mainImage ? (
          <img src={mainImage} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">Sin imagen</div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-strong">{product.name}</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {categoryLabel(product.category)}
            </p>
          </div>
          <span className="text-sm font-extrabold text-primary-strong">{formatPrice(product.price)}</span>
        </div>

        <p className="mt-4 text-sm leading-7 text-muted">{product.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge>Prenda única</Badge>
          <Badge>{status === "disponible" ? "Disponible hasta reservar" : "Solo por confirmar"}</Badge>
          <Badge>Solo una unidad</Badge>
        </div>

        <div className="mt-6">
          <a href={getWhatsAppLink(product)} target="_blank" rel="noreferrer">
            <Button className="w-full">Reservar por WhatsApp</Button>
          </a>
        </div>
      </div>
    </Card>
  );
}
