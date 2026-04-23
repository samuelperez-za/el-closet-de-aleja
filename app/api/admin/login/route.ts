import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, hasAdminCredentials, validateAdminCredentials } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  if (!hasAdminCredentials()) {
    return NextResponse.json(
      { error: "Configura ADMIN_CREDENTIALS o ADMIN_EMAIL/ADMIN_PASSWORD junto con ADMIN_SESSION_SECRET en .env.local." },
      { status: 400 },
    );
  }

  const body = await request.json();
  const email = String(body.email || "");
  const password = String(body.password || "");

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
  }

  await createAdminSession(email);
  return NextResponse.json({ ok: true });
}
