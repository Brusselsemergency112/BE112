import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import InstagramFeed from "@/components/instagram-feed";
import MasonryLightbox from "@/components/masonry-lightbox";
import { getWorks } from "@/lib/works";
import { SITE, SITE_INSTAGRAM_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Galerie publique Brussels Emergency 112, fil Instagram et sélection d'œuvres documentaires.",
};

export default function GaleriePage() {
  const works = getWorks();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
      <Reveal>
        <p className="text-[11px] uppercase tracking-widest2 text-mute">Galerie publique</p>
        <h1 className="mt-4 font-display text-display-xl">Œuvres</h1>
      </Reveal>

      <section className="mt-24">
        <Reveal>
          <div className="mb-10 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <h2 className="flex items-baseline gap-4 font-display text-display-lg">
              <span className="font-sans text-xs tabular-nums text-mute">01</span>
              En direct d&apos;Instagram
            </h2>
            <a
              href={SITE_INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-widest2 underline-hover"
            >
              Suivre @{SITE.instagramHandle} →
            </a>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <InstagramFeed />
        </Reveal>
      </section>

      <section className="mt-32">
        <Reveal>
          <div className="mb-10 border-b border-line pb-6">
            <h2 className="flex items-baseline gap-4 font-display text-display-lg">
              <span className="font-sans text-xs tabular-nums text-mute">02</span>
              La série
            </h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <MasonryLightbox items={works.map((w) => ({ id: w.src, src: w.src, alt: w.alt }))} />
        </Reveal>
      </section>
    </div>
  );
}
