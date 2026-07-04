import { notFound } from "next/navigation";
import Link from "next/link";
import { getGalleryById, listGalleryPhotosWithUrls } from "@/lib/data/galleries";
import { categoryLabel } from "@/lib/site";
import UploadPhotosForm from "./upload-photos-form";
import DeletePhotoButton from "./delete-photo-button";

export const dynamic = "force-dynamic";

export default async function AdminGalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gallery = await getGalleryById(id);
  if (!gallery) notFound();

  const photos = await listGalleryPhotosWithUrls(id);

  return (
    <div className="space-y-10">
      <div>
        <Link href="/admin/galeries" className="text-xs uppercase tracking-widest2 underline-hover text-mute">
          ← Galeries
        </Link>
        <p className="mt-4 text-xs uppercase tracking-widest2 text-mute">{categoryLabel(gallery.category)}</p>
        <h1 className="mt-2 font-display text-3xl">{gallery.title}</h1>
        <p className="mt-1 text-xs text-mute">
          Code {gallery.code_hint} · expire le {new Date(gallery.expires_at).toLocaleDateString("fr-BE")} ·{" "}
          <Link href={`/galerie-privee/${gallery.slug}`} className="underline-hover">
            voir la page publique
          </Link>
        </p>
      </div>

      <UploadPhotosForm galleryId={gallery.id} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((p) => (
          <div key={p.id} className="group relative aspect-square overflow-hidden bg-paper-dim">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.viewUrl} alt={p.filename} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-end bg-ink/0 p-2 opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100">
              <DeletePhotoButton galleryId={gallery.id} photoId={p.id} />
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <p className="col-span-full text-sm text-mute">Aucune photo pour le moment.</p>
        )}
      </div>
    </div>
  );
}
