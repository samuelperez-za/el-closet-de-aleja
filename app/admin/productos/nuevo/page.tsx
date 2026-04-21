import { AdminProductForm } from "@/components/AdminProductForm";
import { requireAdminSession } from "@/lib/admin-session";

export default async function NewProductPage() {
  await requireAdminSession();

  return (
    <main className="section-shell flex-1 py-10">
      <section className="mb-8 max-w-3xl">
        <span className="rounded-full border border-border bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
          Nueva prenda
        </span>
        <h1 className="display-title mt-4 text-6xl font-semibold leading-none text-primary-strong">
          Añadir producto
        </h1>
        <p className="mt-4 text-base leading-8 text-muted">
          Crea una nueva ficha con imágenes, categoría, estado y mensaje de reserva por WhatsApp.
        </p>
      </section>
      <AdminProductForm />
    </main>
  );
}
