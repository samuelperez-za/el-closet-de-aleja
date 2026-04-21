"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { AdminProductCard } from "@/components/AdminProductCard";
import { Button } from "@/components/ui/button";

export function AdminProductsPanel({ products }: { products: Product[] }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="display-title text-4xl font-semibold text-primary-strong">Productos publicados</h2>
          <p className="mt-2 text-sm text-muted">Crea, edita, reserva u oculta prendas desde un solo lugar.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/productos/nuevo">
            <Button>Nueva prenda</Button>
          </Link>
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {products.map((product) => (
          <AdminProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
