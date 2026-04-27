"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { brand, navLinks } from "@/lib/constants";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";

export function Header() {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573000000000";

  return (
    <header className="section-shell sticky top-2 z-30 pt-2 sm:top-4 sm:pt-4">
      <div className="glass-panel flex items-center justify-between rounded-full px-3 py-2 sm:px-5 sm:py-4">
        {/* Logo + brand name */}
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/80 shadow-[inset_0_0_0_1px_rgba(189,91,133,0.08)] sm:h-12 sm:w-12">
            {!logoError ? (
              <Image
                src="/logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="h-full w-full object-contain p-0.5"
                onError={() => setLogoError(true)}
              />
            ) : (
              <BrandMark />
            )}
          </span>
          <span className="min-w-0">
            <span className="display-title block truncate text-base font-semibold leading-tight text-primary-strong sm:text-2xl">
              {brand.name}
            </span>
            <span className="hidden truncate text-[10px] text-muted xs:block sm:text-sm">{brand.phrase}</span>
          </span>
        </Link>

        {/* Hamburger button */}
        <button
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white/80 transition-transform active:scale-90 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="h-4 w-4 text-primary-strong" /> : <Menu className="h-4 w-4 text-primary-strong" />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex lg:items-center lg:gap-5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted hover:text-primary-strong">
              {link.label}
            </Link>
          ))}
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
            <Button className="w-auto">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </a>
        </nav>
      </div>

      {/* Mobile nav */}
      {open ? (
        <nav className="mx-auto mt-2 flex max-w-[95%] flex-col gap-1 rounded-[1.8rem] border border-border bg-white/95 p-3 shadow-xl backdrop-blur-lg lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors active:bg-primary/10 active:text-primary-strong"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 pt-2 border-t border-border/50">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
              <Button className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
