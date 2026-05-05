import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Auth simples por senha master (env var ADMIN_PASSWORD).
 * Após o login, gera um JWT de sessão guardado em cookie HTTP-only.
 *
 * Para produção, defina ADMIN_PASSWORD e SESSION_SECRET nas env vars
 * da Vercel. Em dev, defaults razoáveis são usados se não estiverem setados.
 */

const SESSION_COOKIE = "matilha_session";
const SESSION_TTL_DAYS = 30;

function getSecret(): Uint8Array {
  const raw =
    process.env.SESSION_SECRET ||
    "dev-only-secret-change-me-in-production-please-32chars+";
  if (raw.length < 32) {
    throw new Error("SESSION_SECRET deve ter pelo menos 32 caracteres.");
  }
  return new TextEncoder().encode(raw);
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "matilha2026";
}

export async function checkPassword(password: string): Promise<boolean> {
  const expected = getAdminPassword();
  if (!password || !expected) return false;
  // comparação simples; senha master não justifica timing-safe pois é env compartilhada
  return password === expected;
}

export async function createSessionCookie(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(getSecret());

  const c = await cookies();
  c.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function destroySessionCookie(): Promise<void> {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
}

export async function isLoggedIn(): Promise<boolean> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

/** Verifica token de sessão. Usado em middleware (sem acesso a cookies()). */
export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}
