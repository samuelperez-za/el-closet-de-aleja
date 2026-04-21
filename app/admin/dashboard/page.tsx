import Link from "next/link";
import { requireAdminSession } from "@/lib/admin-session";
import { getAdminProducts, getCategoryCounts, getDashboardStats } from "@/lib/products";
import { categoryLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  await requireAdminSession();
  const products = await getAdminProducts();
  const stats = getDashboardStats(products);
  const categories = getCategoryCounts(products);

  return (
    <main className="section-shell flex-1 py-10">
      <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="rounded-full border border-border bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
            Panel principal
          </span>
          <h1 className="display-title mt-4 text-6xl font-semibold leading-none text-primary-strong">
            Dashboard de El Closet de Aleja
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Una vista rápida para revisar el estado de tus prendas, promociones activas y categorías más nutridas.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/categorias">
            <Button variant="secondary">Categorías</Button>
          </Link>
          <Link href="/admin/productos">
            <Button variant="secondary">Ver productos</Button>
          </Link>
          <Link href="/admin/productos/nuevo">
            <Button>Nueva prenda</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Productos totales", value: stats.total },
          { label: "Promociones activas", value: stats.promos },
          { label: "Prendas reservadas", value: stats.reserved },
          { label: "Productos visibles", value: stats.active },
        ].map((item) => (
          <Card key={item.label} className="rounded-[2rem] p-6">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="display-title mt-3 text-5xl font-semibold text-primary-strong">{item.value}</p>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem] p-6">
          <h2 className="display-title text-4xl font-semibold text-primary-strong">Resumen por categoría</h2>
          <div className="mt-6 grid gap-4">
            {categories.map((item) => (
              <div key={item.category} className="flex items-center justify-between rounded-2xl border border-border bg-white/80 px-4 py-4">
                <span className="text-sm text-muted">{categoryLabel(item.category)}</span>
                <span className="text-lg font-semibold text-primary-strong">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <h2 className="display-title text-4xl font-semibold text-primary-strong">Estado del proyecto</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-muted">
            <li>Panel admin protegido con credenciales privadas desde variables de entorno.</li>
            <li>Productos dinámicos conectados a Neon Postgres.</li>
            <li>Diseño responsive y premium, pensado para conversión vía WhatsApp.</li>
            <li>Fallback de demo incluido para desarrollo antes de conectar la base real.</li>
          </ul>
        </Card>
      </section>
    </main>
  );
}
