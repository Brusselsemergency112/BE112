import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import CodeGateForm from "@/components/code-gate-form";
import MasonryLightbox from "@/components/masonry-lightbox";
import { getGalleryBySlug, listGalleryPhotosWithUrls } from "@/lib/data/galleries";
import { hasGalleryAccess } from "@/lib/auth/gallery-session";
import { categoryLabel } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Galerie privée" };

function formatDistanceToExpiry(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  if (days <= 1) return "dans moins de 24h";
  return `dans ${days} jours`;
}

export default async function PrivateGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let gallery = null;
  try {
    gallery = await getGalleryBySlug(slug);
  } catch (err) {
    console.error("getGalleryBySlug failed", err);
  }

  if (!gallery) {
    return (
      <div className="mx-auto max-w-lg px-6 py-32 text-center">
        <h1 className="font-display text-4xl">Galerie introuvable</h1>
        <p className="mt-4 text-sm text-mute">
          Ce lien n&apos;existe plus, ou la galerie a expiré et ses fichiers ont été
          automatiquement supprimés.
        </p>
      </div>
    );
  }

  const authorized = await hasGalleryAccess(gallery.id);

  if (!authorized) {
    return (
      <div className="mx-auto max-w-lg px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-widest2 text-mute">{categoryLabel(gallery.category)}</p>
        <h1 className="mt-3 font-display text-4xl">{gallery.title}</h1>
        <p className="mt-4 text-sm text-mute">
          Saisis le code qui t&apos;a été communiqué pour accéder à cette galerie.
        </p>
        <div className="mt-10">
          <CodeGateForm />
        </div>
      </div>
    );
  }

  const photos = await listGalleryPhotosWithUrls(gallery.id);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest2 text-mute">{categoryLabel(gallery.category)}</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">{gallery.title}</h1>
            <p className="mt-2 text-sm text-mute">
              {photos.length} photo{photos.length > 1 ? "s" : ""} · suppression automatique{" "}
              {formatDistanceToExpiry(gallery.expires_at)}
            </p>
          </div>
          {photos.length > 0 && (
            <a
              href={`/api/private-gallery/${gallery.slug}/download-all`}
              className="text-xs uppercase tracking-widest2 underline-hover"
            >
              Tout télécharger (.zip) →
            </a>
          )}
        </div>
      </Reveal>

      <div className="mt-12">
        <MasonryLightbox
          items={photos.map((p) => ({
            id: p.id,
            src: p.viewUrl,
            alt: p.filename,
            downloadHref: p.downloadUrl,
            downloadName: p.filename,
          }))}
        />
      </div>
    </div>
  );
}
