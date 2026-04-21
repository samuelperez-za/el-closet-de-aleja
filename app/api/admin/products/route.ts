import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { createProduct } from "@/lib/products";
import type { ProductInput } from "@/types/product";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }
  const body = (await request.json()) as ProductInput;
  const id = await createProduct(body);

  revalidatePath("/");
  revalidatePath("/promociones");
  revalidatePath("/admin/productos");

  return NextResponse.json({ id });
}
