"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { verifyAccessCode } from "@/lib/data/galleries";
import { grantGalleryAccess } from "@/lib/auth/gallery-session";
import { rateLimit } from "@/lib/auth/rate-limit";

export type GalleryAccessState = { status: "idle" | "error"; message?: string };

export async function accessGallery(
  _prevState: GalleryAccessState,
  formData: FormData
): Promise<GalleryAccessState> {
  const code = String(formData.get("code") || "").trim();
  if (!code) {
    return { status: "error", message: "Merci de saisir un code." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`gallery-code:${ip}`, 10, 15 * 60 * 1000)) {
    return { status: "error", message: "Trop de tentatives — réessaie dans quelques minutes." };
  }

  let gallery;
  try {
    gallery = await verifyAccessCode(code);
  } catch (err) {
    console.error("verifyAccessCode failed", err);
    return { status: "error", message: "Service momentanément indisponible." };
  }

  if (!gallery) {
    return { status: "error", message: "Code invalide ou galerie expirée." };
  }

  await grantGalleryAccess(gallery.id, gallery.expires_at);
  redirect(`/galerie-privee/${gallery.slug}`);
}
