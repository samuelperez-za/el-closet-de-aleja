import { whyBuyItems } from "@/lib/constants";
import { FadeIn } from "@/components/FadeIn";
import { Card } from "@/components/ui/card";

export function WhyBuySection() {
  return (
    <section id="por-que" className="section-shell py-14">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(255,250,251,0.94),rgba(255,246,248,0.9))] px-5 py-10 md:px-8 md:py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(223,127,154,0.08),transparent_68%)]" />
        <div className="pointer-events-none absolute -left-16 bottom-8 h-44 w-44 rounded-full bg-[rgba(238,187,187,0.16)] blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-6 h-40 w-40 rounded-full bg-[rgba(203,189,232,0.14)] blur-3xl" />

        <FadeIn className="relative mx-auto mb-8 max-w-3xl text-center">
          <span className="rounded-full border border-border bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
            Tu closet bonito y consciente
          </span>
          <h2 className="display-title mt-4 text-5xl font-semibold leading-none text-primary-strong md:text-6xl">
            ¿Por qué comprar aquí?
          </h2>
          <p className="mt-4 text-base leading-8 text-muted">
            En El Closet de Aleja cada detalle está pensado para ofrecerte una experiencia linda, práctica y con mucho estilo, mientras eliges prendas únicas que también aportan a una compra más consciente.
          </p>
        </FadeIn>

        <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {whyBuyItems.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.05}>
              <Card className="h-full rounded-[2rem] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,251,252,0.92))] p-7 shadow-[0_18px_40px_rgba(198,146,166,0.1)]">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-primary-strong">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{item.description}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
