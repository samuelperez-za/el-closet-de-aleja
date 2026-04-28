import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getProductMutationErrorMessage, parseProductInput } from "@/lib/product-input";
import { createProduct } from "@/lib/products";

function revalidateProductPaths(category: string) {
  revalidatePath("/");
  revalidatePath("/promociones");
  revalidatePath("/admin/productos");
  revalidatePath(`/categoria/${category}`);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }

  try {
    const body = parseProductInput(await request.json());
    const id = await createProduct(body);

    revalidateProductPaths(body.category);

    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: getProductMutationErrorMessage(error) }, { status: 400 });
  }
}
