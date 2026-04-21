"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, MessageCircle } from "lucide-react";
import { useState } from "react";
import { brand, navLinks } from "@/lib/constants";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";

export function Header() {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573000000000";

  return (
    <header className="section-shell sticky top-4 z-30 pt-4">
      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-full px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/80 shadow-[inset_0_0_0_1px_rgba(189,91,133,0.08)]">
            {!logoError ? (
              <Image
                src="/logo.png"
                alt="Logo El Closet de Aleja"
                width={48}
                height={48}
                className="h-12 w-12 object-contain p-1"
                onError={() => setLogoError(true)}
              />
            ) : (
              <BrandMark />
            )}
          </span>
          <span>
            <span className="display-title block text-3xl font-semibold leading-none text-primary-strong">
              {brand.name}
            </span>
            <span className="text-sm text-muted">{brand.phrase}</span>
          </span>
        </Link>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/80 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } w-full flex-col gap-3 rounded-[2rem] border border-border bg-white/85 p-4 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-5 lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted hover:text-primary-strong">
              {link.label}
            </Link>
          ))}
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
            <Button className="w-full lg:w-auto">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </a>
        </nav>
      </div>
    </header>
  );
}
