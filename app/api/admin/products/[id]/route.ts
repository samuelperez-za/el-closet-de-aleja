import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getProductMutationErrorMessage, parseProductInput } from "@/lib/product-input";
import { deleteProduct, updateProduct } from "@/lib/products";

type Params = Promise<{ id: string }>;

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = parseProductInput(await request.json());

    await updateProduct(id, body);

    revalidatePath("/");
    revalidatePath("/promociones");
    revalidatePath("/admin/productos");
    revalidatePath(`/admin/productos/${id}/edit`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getProductMutationErrorMessage(error) }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteProduct(id);

    revalidatePath("/");
    revalidatePath("/promociones");
    revalidatePath("/admin/productos");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getProductMutationErrorMessage(error) }, { status: 400 });
  }
}
