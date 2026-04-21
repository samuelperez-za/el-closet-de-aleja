import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { brand } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const highlights = [
  { value: "Únicas", label: "prendas con encanto" },
  { value: "Top", label: "estilo femenino y lindo" },
  { value: "100%", label: "compra consciente" },
  { value: "Directa", label: "atención por WhatsApp" },
];

export function Hero() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573000000000";

  return (
    <section
      id="inicio"
      className="section-shell grid gap-10 pb-12 pt-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)] lg:items-center"
    >
      <FadeIn className="max-w-4xl">
        <Badge className="border-[#efcbd2] bg-[#f8dde2]/85 px-6 py-3 text-sm font-bold text-primary-strong shadow-[0_10px_24px_rgba(223,127,154,0.08)]">
          {brand.heroBadge}
        </Badge>

        <h1 className="display-title mt-8 max-w-[8.7ch] text-[3.6rem] leading-[0.9] font-semibold text-primary-strong md:text-[5.1rem] xl:text-[6.35rem]">
          Descubre tu mejor versión con El Closet de Aleja
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-9 text-muted">
          Encuentra prendas femeninas, modernas y llenas de estilo para que te sientas segura, hermosa y lista para destacar en cualquier ocasión. Aquí no solo compras ropa: transformas tu look con piezas que enamoran a primera vista.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/#coleccion">
            <Button size="lg" className="min-w-52 rounded-full px-8">
              Ver colección
            </Button>
          </Link>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Hola, quiero conocer la colección de El Closet de Aleja.",
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="secondary"
              size="lg"
              className="min-w-64 rounded-full border-[rgba(223,127,154,0.4)] bg-white/92 px-8 text-primary-strong shadow-[0_10px_24px_rgba(223,127,154,0.06)]"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Pedir por WhatsApp
            </Button>
          </a>
        </div>
      </FadeIn>

      <FadeIn delay={0.08} className="flex justify-center lg:justify-end">
        <div className="relative w-full max-w-[31.5rem] rounded-[2.55rem] border border-[#efcbd2] bg-[linear-gradient(155deg,#f5c6cf,#f6d6d8_54%,#fbe9e9)] p-4 shadow-[0_28px_70px_rgba(223,127,154,0.16)]">
          <div className="pointer-events-none absolute -left-12 bottom-10 h-44 w-44 rounded-full bg-[rgba(255,255,255,0.22)] blur-2xl" />
          <div className="pointer-events-none absolute -right-8 -top-10 h-48 w-48 rounded-full bg-[rgba(255,255,255,0.26)] blur-xl" />

          <div className="relative rounded-[2.05rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,250,250,0.56))] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-[8px] md:p-9">
            <div className="rounded-full border border-white/70 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-strong">
              Moda que vende estilo
            </div>

            <h2 className="display-title mt-6 max-w-[6ch] text-[3.35rem] leading-[0.92] font-semibold text-primary-strong md:text-[4.15rem]">
              Moda que vende estilo
            </h2>

            <p className="mt-5 max-w-sm text-[1.04rem] leading-8 text-[rgba(95,74,89,0.84)]">
              Ropa femenina, juvenil y cómoda con una selección delicada, cercana y pensada para enamorar a primera vista.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.6rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,215,222,0.58))] px-4 py-5 text-center shadow-[0_14px_30px_rgba(223,127,154,0.08)]"
                >
                  <p className="text-[2.05rem] font-extrabold leading-none tracking-tight text-primary-strong">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(95,74,89,0.74)]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
