"use server";

import { revalidatePath } from "next/cache";
import {
  createGallery,
  createPhotoUploadTargets,
  deleteGallery,
  deleteGalleryPhoto,
  getGalleryById,
  registerGalleryPhotos,
  type UploadTarget,
} from "@/lib/data/galleries";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";

export type CreateGalleryState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; slug: string; title: string; code: string };

async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Non autorisé");
  }
}

export async function createGalleryAction(
  _prev: CreateGalleryState,
  formData: FormData
): Promise<CreateGalleryState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const durationDays = Number(formData.get("durationDays") || 0);

  if (!title || title.length > 200) {
    return { status: "error", message: "Titre invalide." };
  }
  if (!category || category.length > 60) {
    return { status: "error", message: "Section invalide (60 caractères max)." };
  }
  if (!Number.isFinite(durationDays) || durationDays < 1 || durationDays > 365) {
    return { status: "error", message: "Durée invalide (1 à 365 jours)." };
  }

  try {
    const { gallery, code } = await createGallery({ title, category, durationDays });
    revalidatePath("/admin/galeries");
    return { status: "success", slug: gallery.slug, title: gallery.title, code };
  } catch (err) {
    console.error("createGallery failed", err);
    return { status: "error", message: "Erreur lors de la création de la galerie." };
  }
}

export async function deleteGalleryAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteGallery(id);
  revalidatePath("/admin/galeries");
}

export type PrepareUploadResult =
  | { status: "error"; message: string }
  | { status: "ok"; targets: UploadTarget[] };

export async function prepareUploadsAction(
  galleryId: string,
  files: { name: string }[]
): Promise<PrepareUploadResult> {
  await requireAdmin();

  if (files.length === 0 || files.length > 100) {
    return { status: "error", message: "Sélectionne entre 1 et 100 photos." };
  }

  const gallery = await getGalleryById(galleryId);
  if (!gallery) {
    return { status: "error", message: "Galerie introuvable." };
  }

  try {
    const targets = await createPhotoUploadTargets(gallery, files);
    return { status: "ok", targets };
  } catch (err) {
    console.error("prepareUploads failed", err);
    return { status: "error", message: "Impossible de préparer l'envoi." };
  }
}

export async function registerUploadsAction(
  galleryId: string,
  entries: { storagePath: string; filename: string; contentType: string | null; sizeBytes: number | null }[]
): Promise<void> {
  await requireAdmin();
  await registerGalleryPhotos(galleryId, entries);
  revalidatePath(`/admin/galeries/${galleryId}`);
}

export async function deletePhotoAction(galleryId: string, photoId: string): Promise<void> {
  await requireAdmin();
  await deleteGalleryPhoto(photoId);
  revalidatePath(`/admin/galeries/${galleryId}`);
}
