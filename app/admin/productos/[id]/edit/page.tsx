import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/AdminProductForm";
import { getProductById } from "@/lib/products";
import { requireAdminSession } from "@/lib/admin-session";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  await requireAdminSession();
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <main className="section-shell flex-1 py-10">
      <section className="mb-8 max-w-3xl">
        <span className="rounded-full border border-border bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
          Editar prenda
        </span>
        <h1 className="display-title mt-4 text-6xl font-semibold leading-none text-primary-strong">
          {product.name}
        </h1>
        <p className="mt-4 text-base leading-8 text-muted">
          Ajusta su precio, visibilidad, promoción o reserva con una experiencia simple y clara.
        </p>
      </section>
      <AdminProductForm product={product} />
    </main>
  );
}
