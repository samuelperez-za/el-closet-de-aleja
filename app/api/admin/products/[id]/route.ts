import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { deleteProduct, updateProduct } from "@/lib/products";
import type { ProductInput } from "@/types/product";

type Params = Promise<{ id: string }>;

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json()) as ProductInput;

  await updateProduct(id, body);

  revalidatePath("/");
  revalidatePath("/promociones");
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}/edit`);

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }
  const { id } = await params;

  await deleteProduct(id);

  revalidatePath("/");
  revalidatePath("/promociones");
  revalidatePath("/admin/productos");

  return NextResponse.json({ ok: true });
}
