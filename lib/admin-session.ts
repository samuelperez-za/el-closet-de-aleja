import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "closet_admin_session";

function getAdminEnv() {
  return {
    email: process.env.ADMIN_EMAIL || "",
    password: process.env.ADMIN_PASSWORD || "",
    secret: process.env.ADMIN_SESSION_SECRET || "",
  };
}

export function hasAdminCredentials() {
  const { email, password, secret } = getAdminEnv();
  return Boolean(email && password && secret);
}

function signValue(email: string, secret: string) {
  return createHmac("sha256", secret).update(email).digest("hex");
}

export async function createAdminSession(email: string) {
  const cookieStore = await cookies();
  const { secret } = getAdminEnv();

  cookieStore.set(SESSION_COOKIE, signValue(email, secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  if (!hasAdminCredentials()) return false;

  const cookieStore = await cookies();
  const current = cookieStore.get(SESSION_COOKIE)?.value;
  if (!current) return false;

  const { email, secret } = getAdminEnv();
  const expected = signValue(email, secret);

  const currentBuffer = Buffer.from(current);
  const expectedBuffer = Buffer.from(expected);
  if (currentBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(currentBuffer, expectedBuffer);
}

export async function requireAdminSession() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
}

export function validateAdminCredentials(email: string, password: string) {
  const env = getAdminEnv();
  return email === env.email && password === env.password;
}
