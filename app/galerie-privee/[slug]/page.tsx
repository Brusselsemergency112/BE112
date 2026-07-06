import Image from "next/image";
import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import CodeGateForm from "@/components/code-gate-form";
import DeliveryGallery from "@/components/delivery-gallery";
import {
  getGalleryBySlug,
  listFavoritePhotoIds,
  listGalleryPhotosWithUrls,
} from "@/lib/data/galleries";
import { hasGalleryAccess } from "@/lib/auth/gallery-session";
import { categoryLabel } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Galerie privée", robots: { index: false } };

function formatDistanceToExpiry(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  if (days <= 1) return "moins de 24h";
  return `${days} jours`;
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
      <div className="mx-auto max-w-lg px-6 py-40 text-center">
        <h1 className="font-display text-display-md">Galerie introuvable</h1>
        <p className="mt-4 text-sm leading-relaxed text-mute">
          Ce lien n&apos;existe plus, ou la galerie a expiré et ses fichiers ont été
          automatiquement supprimés.
        </p>
      </div>
    );
  }

  const authorized = await hasGalleryAccess(gallery.id);

  if (!authorized) {
    return (
      <div className="mx-auto max-w-lg px-6 py-40 text-center">
        <p className="text-[11px] uppercase tracking-widest2 text-mute">
          {categoryLabel(gallery.category)}
        </p>
        <h1 className="mt-3 font-display text-display-md">{gallery.title}</h1>
        <p className="mt-4 text-sm text-mute">
          Saisis le code qui t&apos;a été communiqué pour ouvrir cette galerie.
        </p>
        <div className="mt-10">
          <CodeGateForm />
        </div>
      </div>
    );
  }

  const [photos, favoriteIds] = await Promise.all([
    listGalleryPhotosWithUrls(gallery.id),
    listFavoritePhotoIds(gallery.id).catch(() => [] as string[]),
  ]);
  const favoriteSet = new Set(favoriteIds);
  const cover = photos[0];

  return (
    <>
      {/* COUVERTURE DE LIVRAISON */}
      <section className="noise-veil relative flex min-h-[88svh] flex-col justify-end overflow-hidden bg-ink">
        {cover && (
          <Image
            src={cover.viewUrl}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="hero-pan object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/40" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-14 md:px-10 md:pb-16">
          <p
            className="rise-in text-[11px] uppercase tracking-widest2 text-paper/60"
            style={{ "--d": "150ms" } as React.CSSProperties}
          >
            {categoryLabel(gallery.category)} · Brussels Emergency 112
          </p>
          <h1
            className="rise-in mt-4 font-display text-display-lg text-paper"
            style={{ "--d": "300ms" } as React.CSSProperties}
          >
            {gallery.title}
          </h1>
          <div
            className="rise-in mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
            style={{ "--d": "450ms" } as React.CSSProperties}
          >
            <p className="text-sm text-paper/70">
              {photos.length} photo{photos.length > 1 ? "s" : ""} · disponible encore{" "}
              {formatDistanceToExpiry(gallery.expires_at)}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#photos"
                className="border border-paper/60 px-5 py-3 text-xs uppercase tracking-widest2 text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Découvrir ↓
              </a>
              {photos.length > 0 && (
                <a
                  href={`/api/private-gallery/${gallery.slug}/download-all`}
                  className="bg-paper px-5 py-3 text-xs uppercase tracking-widest2 text-ink transition-opacity hover:opacity-90"
                >
                  Tout télécharger (.zip)
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <div id="photos" className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <Reveal>
          <DeliveryGallery
            slug={gallery.slug}
            items={photos.map((p) => ({
              id: p.id,
              src: p.viewUrl,
              alt: p.filename,
              downloadHref: p.downloadUrl,
              downloadName: p.filename,
              favorited: favoriteSet.has(p.id),
            }))}
          />
        </Reveal>
      </div>
    </>
  );
}
