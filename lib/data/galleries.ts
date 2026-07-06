import "server-only";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { GalleryPhotoRow, GalleryRow } from "@/lib/supabase/types";
import { generateAccessCode, hashAccessCode } from "@/lib/auth/crypto";
import { slugify } from "@/lib/utils/slug";
import type { GalleryCategory } from "@/lib/site";

const BUCKET = "private-photos";
const SIGNED_URL_TTL_SECONDS = 2 * 60 * 60; // long enough for a full viewing session

export async function listGalleries(): Promise<(GalleryRow & { photo_count: number })[]> {
  const { data, error } = await supabaseAdmin()
    .from("galleries")
    .select("*, gallery_photos(count)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const { gallery_photos, ...rest } = row as GalleryRow & { gallery_photos: { count: number }[] };
    return { ...rest, photo_count: gallery_photos?.[0]?.count ?? 0 };
  });
}

export async function getGalleryById(id: string): Promise<GalleryRow | null> {
  const { data, error } = await supabaseAdmin().from("galleries").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getGalleryBySlug(slug: string): Promise<GalleryRow | null> {
  const { data, error } = await supabaseAdmin()
    .from("galleries")
    .select("*")
    .eq("slug", slug)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function verifyAccessCode(code: string): Promise<GalleryRow | null> {
  const codeHash = hashAccessCode(code);
  const { data, error } = await supabaseAdmin()
    .from("galleries")
    .select("*")
    .eq("code_hash", codeHash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createGallery(input: {
  title: string;
  category: GalleryCategory;
  durationDays: number;
}): Promise<{ gallery: GalleryRow; code: string }> {
  const base = slugify(input.title) || "galerie";
  const slug = `${base}-${randomUUID().slice(0, 6)}`;
  const code = generateAccessCode();
  const expiresAt = new Date(Date.now() + input.durationDays * 24 * 60 * 60 * 1000);

  const { data, error } = await supabaseAdmin()
    .from("galleries")
    .insert({
      slug,
      title: input.title,
      category: input.category,
      code_hash: hashAccessCode(code),
      code_hint: `${code.slice(0, 2)}••••${code.slice(-2)}`,
      duration_days: input.durationDays,
      expires_at: expiresAt.toISOString(),
    })
    .select("*")
    .single();

  if (error) throw error;
  return { gallery: data, code };
}

export async function deleteGallery(id: string): Promise<void> {
  const gallery = await getGalleryById(id);
  if (!gallery) return;

  await purgeGalleryStorage(gallery.slug);

  const { error } = await supabaseAdmin().from("galleries").delete().eq("id", id);
  if (error) throw error;
}

async function purgeGalleryStorage(slug: string): Promise<void> {
  const client = supabaseAdmin();
  const { data: objects, error } = await client.storage.from(BUCKET).list(slug, { limit: 1000 });
  if (error) throw error;
  if (objects && objects.length > 0) {
    const paths = objects.map((o) => `${slug}/${o.name}`);
    const { error: removeError } = await client.storage.from(BUCKET).remove(paths);
    if (removeError) throw removeError;
  }
}

export async function listGalleryPhotos(galleryId: string): Promise<GalleryPhotoRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("gallery_photos")
    .select("*")
    .eq("gallery_id", galleryId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listGalleryPhotosWithUrls(
  galleryId: string
): Promise<(GalleryPhotoRow & { viewUrl: string; downloadUrl: string })[]> {
  const photos = await listGalleryPhotos(galleryId);
  const client = supabaseAdmin();

  const withUrls = await Promise.all(
    photos.map(async (photo) => {
      const [view, download] = await Promise.all([
        client.storage.from(BUCKET).createSignedUrl(photo.storage_path, SIGNED_URL_TTL_SECONDS),
        client.storage.from(BUCKET).createSignedUrl(photo.storage_path, SIGNED_URL_TTL_SECONDS, {
          download: photo.filename,
        }),
      ]);
      return {
        ...photo,
        viewUrl: view.data?.signedUrl ?? "",
        downloadUrl: download.data?.signedUrl ?? "",
      };
    })
  );

  return withUrls;
}

export type UploadTarget = {
  filename: string;
  storagePath: string;
  signedUrl: string;
};

/**
 * Direct browser-to-storage uploads: the server only mints short-lived signed
 * upload URLs, so photo bytes never pass through the Netlify/Vercel function
 * (whose request-body limits break multi-photo uploads).
 */
export async function createPhotoUploadTargets(
  gallery: GalleryRow,
  files: { name: string }[]
): Promise<UploadTarget[]> {
  const client = supabaseAdmin();

  return Promise.all(
    files.map(async (file) => {
      const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
      const storagePath = `${gallery.slug}/${randomUUID()}.${extension}`;
      const { data, error } = await client.storage.from(BUCKET).createSignedUploadUrl(storagePath);
      if (error) throw error;
      return { filename: file.name, storagePath, signedUrl: data.signedUrl };
    })
  );
}

export async function registerGalleryPhotos(
  galleryId: string,
  entries: { storagePath: string; filename: string; contentType: string | null; sizeBytes: number | null }[]
): Promise<void> {
  if (entries.length === 0) return;
  const { error } = await supabaseAdmin()
    .from("gallery_photos")
    .insert(
      entries.map((e) => ({
        gallery_id: galleryId,
        storage_path: e.storagePath,
        filename: e.filename,
        content_type: e.contentType,
        size_bytes: e.sizeBytes,
      }))
    );
  if (error) throw error;
}

export async function deleteGalleryPhoto(photoId: string): Promise<void> {
  const client = supabaseAdmin();
  const { data: photo, error: fetchError } = await client
    .from("gallery_photos")
    .select("*")
    .eq("id", photoId)
    .maybeSingle();
  if (fetchError) throw fetchError;
  if (!photo) return;

  const { error: removeError } = await client.storage.from(BUCKET).remove([photo.storage_path]);
  if (removeError) throw removeError;

  const { error } = await client.from("gallery_photos").delete().eq("id", photoId);
  if (error) throw error;
}

export async function listFavoritePhotoIds(galleryId: string): Promise<string[]> {
  const { data, error } = await supabaseAdmin()
    .from("gallery_favorites")
    .select("photo_id")
    .eq("gallery_id", galleryId);
  if (error) throw error;
  return (data ?? []).map((row) => row.photo_id);
}

export async function toggleGalleryFavorite(galleryId: string, photoId: string): Promise<boolean> {
  const client = supabaseAdmin();

  const { data: photo, error: photoError } = await client
    .from("gallery_photos")
    .select("id")
    .eq("id", photoId)
    .eq("gallery_id", galleryId)
    .maybeSingle();
  if (photoError) throw photoError;
  if (!photo) throw new Error("Photo introuvable dans cette galerie");

  const { data: existing, error: fetchError } = await client
    .from("gallery_favorites")
    .select("id")
    .eq("photo_id", photoId)
    .maybeSingle();
  if (fetchError) throw fetchError;

  if (existing) {
    const { error } = await client.from("gallery_favorites").delete().eq("id", existing.id);
    if (error) throw error;
    return false;
  }

  const { error } = await client
    .from("gallery_favorites")
    .insert({ gallery_id: galleryId, photo_id: photoId });
  if (error) throw error;
  return true;
}

export async function pruneExpiredGalleries(): Promise<{ deletedGalleries: number; deletedPhotos: number }> {
  const { data: expired, error } = await supabaseAdmin()
    .from("galleries")
    .select("id, slug, gallery_photos(count)")
    .lt("expires_at", new Date().toISOString());

  if (error) throw error;
  if (!expired || expired.length === 0) return { deletedGalleries: 0, deletedPhotos: 0 };

  let deletedPhotos = 0;
  for (const row of expired as unknown as { id: string; slug: string; gallery_photos: { count: number }[] }[]) {
    deletedPhotos += row.gallery_photos?.[0]?.count ?? 0;
    await purgeGalleryStorage(row.slug);
  }

  const ids = expired.map((g) => (g as { id: string }).id);
  const { error: deleteError } = await supabaseAdmin().from("galleries").delete().in("id", ids);
  if (deleteError) throw deleteError;

  return { deletedGalleries: ids.length, deletedPhotos };
}

export async function downloadPhotoBuffer(storagePath: string): Promise<{ buffer: Buffer; contentType: string }> {
  const client = supabaseAdmin();
  const { data, error } = await client.storage.from(BUCKET).download(storagePath);
  if (error) throw error;
  const buffer = Buffer.from(await data.arrayBuffer());
  return { buffer, contentType: data.type || "application/octet-stream" };
}
