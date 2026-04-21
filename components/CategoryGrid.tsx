import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCategoryArtwork } from "@/lib/categories";
import { categoryDescription, categoryHref, categoryLabel, getCategoryArtworkStyle } from "@/lib/utils";
import { categories, type CategorySlug } from "@/types/product";

export async function CategoryGrid() {
  const artwork = await getCategoryArtwork();

  return (
    <section id="coleccion" className="section-shell py-14">
      <FadeIn className="mb-8 max-w-3xl">
        <span className="rounded-full border border-border bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
          Explora por estilo
        </span>
        <h2 className="display-title mt-4 text-5xl font-semibold leading-none text-primary-strong md:text-6xl">
          Categorías que enamoran a primera vista
        </h2>
        <p className="mt-4 text-base leading-8 text-muted">
          Un espacio delicado y lleno de oportunidades para descubrir prendas lindas, versátiles y fáciles de combinar.
        </p>
      </FadeIn>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <FadeIn key={category} delay={index * 0.06}>
            <CategoryCard category={category} artwork={artwork[category]} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category, artwork }: { category: CategorySlug; artwork: string }) {
  return (
    <Card className="overflow-hidden rounded-[2rem] p-0">
      <div className="h-64 w-full" style={getCategoryArtworkStyle(artwork)} />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary-strong">{categoryLabel(category)}</h3>
        <p className="mt-3 text-sm leading-7 text-muted">{categoryDescription(category)}</p>
        <Link href={categoryHref(category)} className="mt-5 inline-flex">
          <Button variant="ghost">Ver prendas</Button>
        </Link>
      </div>
    </Card>
  );
}
