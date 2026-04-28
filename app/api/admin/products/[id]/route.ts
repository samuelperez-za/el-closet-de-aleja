import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getProductMutationErrorMessage, parseProductInput } from "@/lib/product-input";
import { deleteProduct, getProductById, updateProduct } from "@/lib/products";

type Params = Promise<{ id: string }>;

function revalidateProductPaths(category: string, id?: string) {
  revalidatePath("/");
  revalidatePath("/promociones");
  revalidatePath("/admin/productos");
  revalidatePath(`/categoria/${category}`);
  if (id) {
    revalidatePath(`/admin/productos/${id}/edit`);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = parseProductInput(await request.json());
    const existingProduct = await getProductById(id);

    await updateProduct(id, body);

    if (existingProduct && existingProduct.category !== body.category) {
      revalidatePath(`/categoria/${existingProduct.category}`);
    }
    revalidateProductPaths(body.category, id);

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
    const existingProduct = await getProductById(id);
    await deleteProduct(id);

    if (existingProduct) {
      revalidateProductPaths(existingProduct.category);
    } else {
      revalidatePath("/");
      revalidatePath("/promociones");
      revalidatePath("/admin/productos");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getProductMutationErrorMessage(error) }, { status: 400 });
  }
}
