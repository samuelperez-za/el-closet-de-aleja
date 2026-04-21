/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { categoryLabel, formatPrice, getProductStatus, getWhatsAppLink } from "@/lib/utils";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AdminProductCard({ product }: { product: Product }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const status = getProductStatus(product);

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
      <div className="aspect-[4/3.6] bg-[linear-gradient(135deg,rgba(238,187,187,0.5),rgba(203,189,232,0.42))]">
        {product.images[0]?.image_url ? (
          <img src={product.images[0].image_url} alt={product.name} className="h-full w-full object-cover" />
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
          <Badge>{product.is_promo ? "Promoción" : "Colección"}</Badge>
          <Badge>{status}</Badge>
          <Badge>{product.is_active ? "Visible" : "Oculto"}</Badge>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
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
