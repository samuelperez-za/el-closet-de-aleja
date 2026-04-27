import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "No se enviaron archivos." },
        { status: 400 },
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `El archivo "${file.name}" no es una imagen válida.` },
          { status: 400 },
        );
      }

      const timestamp = Date.now();
      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .toLowerCase();
      const pathname = `productos/${timestamp}-${safeName}`;

      const blob = await put(pathname, file, {
        access: "public",
        addRandomSuffix: true,
      });

      uploadedUrls.push(blob.url);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "No fue posible subir las imágenes." },
      { status: 500 },
    );
  }
}
