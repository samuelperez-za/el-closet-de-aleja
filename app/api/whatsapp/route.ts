import { NextRequest, NextResponse } from "next/server";
import { categoryLabel, formatPrice, isValidCategory } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573000000000";
  const category = isValidCategory(body.category) ? body.category : "sacos";

  const text =
    body.message ||
    `Hola, vi la prenda "${body.name}" en El Closet de Aleja y quiero reservarla.\nCategoría: ${categoryLabel(
      category,
    )}\nPrecio: ${formatPrice(Number(body.price || 0))}`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  return NextResponse.json({ url });
}
