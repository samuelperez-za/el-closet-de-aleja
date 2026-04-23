import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "closet_admin_session";

type AdminCredential = {
  email: string;
  password: string;
};

function parseAdminCredentials(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separatorIndex = entry.indexOf(":");
      if (separatorIndex === -1) return null;

      const email = entry.slice(0, separatorIndex).trim();
      const password = entry.slice(separatorIndex + 1).trim();
      if (!email || !password) return null;

      return { email, password };
    })
    .filter((credential): credential is AdminCredential => Boolean(credential));
}

function getAdminEnv() {
  return {
    email: process.env.ADMIN_EMAIL || "",
    password: process.env.ADMIN_PASSWORD || "",
    credentials: process.env.ADMIN_CREDENTIALS || "",
    secret: process.env.ADMIN_SESSION_SECRET || "",
  };
}

function getAdminCredentials() {
  const env = getAdminEnv();
  const multipleCredentials = parseAdminCredentials(env.credentials);

  if (multipleCredentials.length > 0) {
    return multipleCredentials;
  }

  if (env.email && env.password) {
    return [{ email: env.email, password: env.password }];
  }

  return [];
}

export function hasAdminCredentials() {
  const { secret } = getAdminEnv();
  return getAdminCredentials().length > 0 && Boolean(secret);
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

  const { secret } = getAdminEnv();
  const expectedValues = getAdminCredentials().map((credential) => signValue(credential.email, secret));

  const currentBuffer = Buffer.from(current);
  return expectedValues.some((expected) => {
    const expectedBuffer = Buffer.from(expected);
    if (currentBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(currentBuffer, expectedBuffer);
  });
}

export async function requireAdminSession() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
}

export function validateAdminCredentials(email: string, password: string) {
  return getAdminCredentials().some((credential) => credential.email === email && credential.password === password);
}
