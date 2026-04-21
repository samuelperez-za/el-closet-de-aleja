import { AdminLoginForm } from "@/components/AdminLoginForm";
import { Header } from "@/components/Header";

export default function AdminLoginPage() {
  return (
    <>
      <Header />
      <main className="section-shell flex flex-1 items-center py-14">
        <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-5 self-center">
            <span className="rounded-full border border-border bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
              Acceso privado
            </span>
            <h1 className="display-title text-6xl font-semibold leading-none text-primary-strong">
              Ingresa al panel del administrador
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted">
              Desde aquí podrás crear productos, editar detalles, marcar reservas, ocultar prendas y mantener la boutique siempre actualizada.
            </p>
          </section>

          <AdminLoginForm />
        </div>
      </main>
    </>
  );
}
