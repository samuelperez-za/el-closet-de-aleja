import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { updateCategoryArtwork } from "@/lib/categories";
import { revalidatePath } from "next/cache";

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }

  try {
    const { category, imageBase64 } = await request.json();

    if (!category || !imageBase64) {
      return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
    }

    await updateCategoryArtwork(category, imageBase64);

    revalidatePath("/");
    revalidatePath("/admin/categorias");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating category artwork:", error);
    return NextResponse.json({ error: "Error en el servidor." }, { status: 500 });
  }
}
