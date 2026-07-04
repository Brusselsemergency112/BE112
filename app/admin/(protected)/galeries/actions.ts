"use server";

import { revalidatePath } from "next/cache";
import {
  addGalleryPhoto,
  createGallery,
  deleteGallery,
  deleteGalleryPhoto,
  getGalleryById,
} from "@/lib/data/galleries";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/lib/site";

export type CreateGalleryState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; slug: string; title: string; code: string };

const VALID_CATEGORIES = new Set(GALLERY_CATEGORIES.map((c) => c.value));

export async function createGalleryAction(
  _prev: CreateGalleryState,
  formData: FormData
): Promise<CreateGalleryState> {
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "") as GalleryCategory;
  const durationDays = Number(formData.get("durationDays") || 0);

  if (!title || title.length > 200) {
    return { status: "error", message: "Titre invalide." };
  }
  if (!VALID_CATEGORIES.has(category)) {
    return { status: "error", message: "Catégorie invalide." };
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
  await deleteGallery(id);
  revalidatePath("/admin/galeries");
}

export async function uploadPhotosAction(galleryId: string, formData: FormData): Promise<void> {
  const gallery = await getGalleryById(galleryId);
  if (!gallery) return;

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    await addGalleryPhoto(gallery, file);
  }
  revalidatePath(`/admin/galeries/${galleryId}`);
}

export async function deletePhotoAction(galleryId: string, photoId: string): Promise<void> {
  await deleteGalleryPhoto(photoId);
  revalidatePath(`/admin/galeries/${galleryId}`);
}
