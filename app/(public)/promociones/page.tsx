import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { getPromoProducts } from "@/lib/products";

export default async function PromotionsPage() {
  const products = await getPromoProducts();

  return (
    <>
      <Header />
      <main className="section-shell flex-1 py-10">
        <section className="mb-10 max-w-3xl">
          <Link href="/" className={buttonVariants({ variant: "secondary", size: "sm", className: "mb-6" })}>
            Volver
          </Link>
          <span className="rounded-full border border-border bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
            Destacados
          </span>
          <h1 className="display-title mt-4 text-6xl font-semibold leading-none text-primary-strong">
            Promociones con encanto especial
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            Una selección de prendas únicas con precios que enamoran y una vibra femenina, fresca y muy vendible.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="mx-auto w-full max-w-[320px]">
              <ProductCard product={product} />
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
