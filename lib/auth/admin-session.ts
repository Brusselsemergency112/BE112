import "server-only";
import { cookies } from "next/headers";
import { signSessionToken, timingSafeEqualStr, verifySessionToken } from "./crypto";

const COOKIE_NAME = "be112_admin";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12h

export async function createAdminSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const token = signSessionToken("admin", expiresAt);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token, "admin");
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqualStr(password, expected);
}
