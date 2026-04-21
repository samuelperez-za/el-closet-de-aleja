import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getProductsByCategory } from "@/lib/products";
import { categoryDescription, categoryLabel, isValidCategory } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  if (!isValidCategory(slug)) notFound();

  const products = await getProductsByCategory(slug);

  return (
    <>
      <Header />
      <main className="section-shell flex-1 py-10">
        <section className="mb-10 max-w-3xl">
          <span className="rounded-full border border-border bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
            Categoría
          </span>
          <h1 className="display-title mt-4 text-6xl font-semibold leading-none text-primary-strong">
            {categoryLabel(slug)}
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">{categoryDescription(slug)}</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        <div className="mt-8">
          <Link href="/#coleccion">
            <Button variant="secondary">Volver a la home</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
