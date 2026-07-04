import { Readable } from "stream";
import { PassThrough } from "stream";
import archiver from "archiver";
import { getGalleryBySlug, listGalleryPhotos, downloadPhotoBuffer } from "@/lib/data/galleries";
import { hasGalleryAccess } from "@/lib/auth/gallery-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const gallery = await getGalleryBySlug(slug);
  if (!gallery) {
    return new Response("Galerie introuvable", { status: 404 });
  }

  const authorized = await hasGalleryAccess(gallery.id);
  if (!authorized) {
    return new Response("Non autorisé", { status: 401 });
  }

  const photos = await listGalleryPhotos(gallery.id);
  if (photos.length === 0) {
    return new Response("Galerie vide", { status: 404 });
  }

  const archive = archiver("zip", { zlib: { level: 6 } });
  const passthrough = new PassThrough();
  archive.on("warning", (err) => console.warn("archiver warning", err));
  archive.on("error", (err) => passthrough.destroy(err));
  archive.pipe(passthrough);

  void (async () => {
    try {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const { buffer } = await downloadPhotoBuffer(photo.storage_path);
        archive.append(buffer, { name: `${String(i + 1).padStart(3, "0")}-${photo.filename}` });
      }
      await archive.finalize();
    } catch (err) {
      passthrough.destroy(err instanceof Error ? err : new Error(String(err)));
    }
  })();

  const webStream = Readable.toWeb(passthrough) as ReadableStream;

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${gallery.slug}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
