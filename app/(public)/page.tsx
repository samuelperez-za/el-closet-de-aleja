import { CTASection } from "@/components/CTASection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PromoSection } from "@/components/PromoSection";
import { WhyBuySection } from "@/components/WhyBuySection";
import { getPromoProducts } from "@/lib/products";

export default async function HomePage() {
  const promoProducts = await getPromoProducts();

  return (
    <>
      <Header />
      <main className="flex-1 pb-12">
        <Hero />
        <CategoryGrid />
        <PromoSection products={promoProducts} />
        <WhyBuySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
