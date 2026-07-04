import "server-only";
import { cookies } from "next/headers";
import { signSessionToken, verifySessionToken } from "./crypto";

const COOKIE_PREFIX = "be112_g_";
const ACCESS_DURATION_MS = 6 * 60 * 60 * 1000; // 6h, capped by the gallery's own expiry

function cookieName(galleryId: string): string {
  return `${COOKIE_PREFIX}${galleryId}`;
}

export async function grantGalleryAccess(galleryId: string, galleryExpiresAtIso: string): Promise<void> {
  const galleryExpiryMs = new Date(galleryExpiresAtIso).getTime();
  const expiresAt = Math.min(Date.now() + ACCESS_DURATION_MS, galleryExpiryMs);
  const maxAgeSeconds = Math.max(1, Math.floor((expiresAt - Date.now()) / 1000));

  const token = signSessionToken(`gallery:${galleryId}`, expiresAt);
  const store = await cookies();
  store.set(cookieName(galleryId), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function hasGalleryAccess(galleryId: string): Promise<boolean> {
  const store = await cookies();
  const token = store.get(cookieName(galleryId))?.value;
  if (!token) return false;
  return verifySessionToken(token, `gallery:${galleryId}`);
}
