import { MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CTASection() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573000000000";

  return (
    <section id="contacto" className="section-shell py-10 sm:py-14">
      <FadeIn>
        <Card className="rounded-[2.25rem] bg-[linear-gradient(135deg,rgba(255,248,249,0.95),rgba(245,239,250,0.88))] p-8 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="rounded-full border border-border bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-strong">
                Reserva tu próxima favorita
              </span>
              <h2 className="display-title mt-4 text-3xl font-semibold leading-none text-primary-strong sm:text-5xl md:text-6xl">
                ¿Lista para encontrar tu próxima prenda favorita?
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                Escríbenos por WhatsApp y reserva esa prenda única que te encantó antes de que alguien más se enamore de ella.
              </p>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "Hola, quiero reservar una prenda de El Closet de Aleja.",
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                Hablar con el administrador
              </Button>
            </a>
          </div>
        </Card>
      </FadeIn>
    </section>
  );
}
