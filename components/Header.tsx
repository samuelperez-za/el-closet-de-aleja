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
    <header className="section-shell sticky top-4 z-30 pt-4">
      <div className="glass-panel flex items-center justify-between rounded-full px-4 py-3 sm:px-5 sm:py-4">
        {/* Logo + brand name — constrained so it never pushes the hamburger off-screen */}
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/80 shadow-[inset_0_0_0_1px_rgba(189,91,133,0.08)] sm:h-12 sm:w-12">
            {!logoError ? (
              <Image
                src="/logo.png"
                alt="Logo El Closet de Aleja"
                width={48}
                height={48}
                className="h-full w-full object-contain p-1"
                onError={() => setLogoError(true)}
              />
            ) : (
              <BrandMark />
            )}
          </span>
          <span className="min-w-0">
            <span className="display-title block truncate text-xl font-semibold leading-none text-primary-strong sm:text-2xl md:text-3xl">
              {brand.name}
            </span>
            <span className="block truncate text-xs text-muted sm:text-sm">{brand.phrase}</span>
          </span>
        </Link>

        {/* Hamburger button — fixed size, never deforms */}
        <button
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white/80 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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

      {/* Mobile nav — slides below the header bar */}
      {open ? (
        <nav className="mt-2 flex flex-col gap-3 rounded-[2rem] border border-border bg-white/95 p-5 shadow-[0_20px_44px_rgba(175,150,132,0.12)] backdrop-blur-lg lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-primary/5 hover:text-primary-strong"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
            <Button className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </a>
        </nav>
      ) : null}
    </header>
  );
}
