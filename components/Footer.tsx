import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/constants";
import { categories } from "@/types/product";
import { categoryHref, categoryLabel } from "@/lib/utils";

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573216480578";

  return (
    <footer className="section-shell pb-8 sm:pb-10">
      <div className="glass-panel grid gap-6 rounded-[2rem] p-5 sm:gap-8 sm:p-8 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/80 shadow-[inset_0_0_0_1px_rgba(189,91,133,0.08)]">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-full w-full object-contain p-0.5" />
            </span>
            <div>
              <h3 className="display-title text-3xl font-semibold text-primary-strong">{brand.name}</h3>
              <p className="text-sm text-muted">{brand.supportLine}</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted">
            Un rincón bonito para descubrir prendas únicas con estilo, cercanía y atención personalizada.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-strong">Contacto</h4>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="block text-sm text-muted">
            WhatsApp
          </a>
          <a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="block text-sm text-muted">
            Instagram
          </a>
          <p className="text-sm text-muted">{brand.city}</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-strong">Categorías</h4>
          {categories.map((category) => (
            <Link key={category} href={categoryHref(category)} className="block text-sm text-muted">
              {categoryLabel(category)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
