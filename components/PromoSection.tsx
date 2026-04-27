import Link from "next/link";
import type { Product } from "@/types/product";
import { FadeIn } from "@/components/FadeIn";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export function PromoSection({ products }: { products: Product[] }) {
  const featuredProducts = products.slice(0, 3);

  return (
    <section id="promociones" className="section-shell py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <FadeIn className="max-w-2xl">
          <span className="rounded-full border border-border bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
            Prendas destacadas
          </span>
          <h2 className="display-title mt-4 text-3xl font-semibold leading-none text-primary-strong sm:text-5xl md:text-6xl">
            Promociones con encanto especial
          </h2>
        </FadeIn>
        <FadeIn delay={0.06} className="max-w-xl">
          <p className="text-base leading-8 text-muted">
            Cada prenda es única. Si una te roba el corazón, resérvala antes de que otra persona se enamore primero.
          </p>
        </FadeIn>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredProducts.map((product, index) => (
          <FadeIn key={product.id} delay={index * 0.05}>
            <ProductCard product={product} />
          </FadeIn>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/promociones">
          <Button variant="secondary">Ver todas las promociones</Button>
        </Link>
      </div>
    </section>
  );
}
