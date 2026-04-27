import { FadeIn } from "@/components/FadeIn";
import { CategoryCardClient } from "@/components/CategoryCardClient";
import { getCategoryArtwork } from "@/lib/categories";
import { categories } from "@/types/product";

export async function CategoryGrid() {
  const artwork = await getCategoryArtwork();

  return (
    <section id="coleccion" className="section-shell py-10 sm:py-14">
      <FadeIn className="mb-6 max-w-3xl sm:mb-8">
        <span className="rounded-full border border-border bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
          Explora por estilo
        </span>
        <h2 className="display-title mt-4 text-3xl font-semibold leading-none text-primary-strong sm:text-5xl md:text-6xl">
          Categorías que enamoran a primera vista
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted sm:mt-4 sm:text-base sm:leading-8">
          Un espacio delicado y lleno de oportunidades para descubrir prendas lindas, versátiles y fáciles de combinar.
        </p>
      </FadeIn>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <FadeIn key={category} delay={index * 0.06}>
            <CategoryCardClient category={category} artwork={artwork[category]} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
