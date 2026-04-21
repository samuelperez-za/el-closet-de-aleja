import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "El Closet de Aleja",
  description:
    "Boutique digital femenina con prendas únicas, promociones especiales y reservas directas por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
