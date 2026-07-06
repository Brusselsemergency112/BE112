import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import InstagramFeed from "@/components/instagram-feed";
import { getBanners, getWorks } from "@/lib/works";
import { BRAND } from "@/content/biographie";
import { SITE, SITE_INSTAGRAM_URL } from "@/lib/site";

const GRID_LAYOUT = [
  "md:col-span-5 md:row-span-2 aspect-[3/4]",
  "md:col-span-4 aspect-[4/3] md:mt-16",
  "md:col-span-3 aspect-square md:mt-32",
  "md:col-span-4 md:col-start-6 aspect-[4/5]",
  "md:col-span-3 aspect-[3/4] md:-mt-10",
];

export default async function HomePage() {
  const [works, banners] = await Promise.all([getWorks(), getBanners()]);
  const hero = banners[0] ?? works[0];
  const selection = works.slice(1, 6);

  return (
    <>
      {/* HERO */}
      <section className="noise-veil relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
        {hero && (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              priority
              sizes="100vw"
              className="hero-pan object-cover opacity-65"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 md:px-10 md:pb-24">
          <p
            className="rise-in text-[11px] uppercase tracking-widest2 text-paper/60"
            style={{ "--d": "150ms" } as React.CSSProperties}
          >
            Photographie documentaire · Bruxelles
          </p>
          <h1 className="mt-5 font-display text-display-xl text-paper">
            <span className="rise-in block" style={{ "--d": "300ms" } as React.CSSProperties}>
              Brussels
            </span>
            <span
              className="rise-in block italic text-accent"
              style={{ "--d": "420ms" } as React.CSSProperties}
            >
              Emergency 112
            </span>
          </h1>

          <div
            className="rise-in mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
            style={{ "--d": "600ms" } as React.CSSProperties}
          >
            <p className="max-w-md text-sm leading-relaxed text-paper/70 md:text-base">
              Au plus près des services d&apos;urgence bruxellois, un projet documentaire mené par
              le photographe{" "}
              <Link href="/biographie" className="underline-hover text-paper">
                {SITE.author}
              </Link>
              .
            </p>
            <div className="flex items-center gap-6">
              <span className="scroll-hint text-paper/50" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-widest2 text-paper/50">Défiler</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="mx-auto max-w-4xl px-6 py-32 text-center md:px-10 md:py-40">
        <Reveal>
          <p className="text-[11px] uppercase tracking-widest2 text-mute">Le projet</p>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 font-display text-display-md text-ink">{BRAND.intro}</p>
        </Reveal>
        <Reveal delay={200} className="mt-10">
          <Link
            href="/biographie"
            className="text-xs uppercase tracking-widest2 underline-hover text-mute hover:text-ink"
          >
            Rencontrer le photographe →
          </Link>
        </Reveal>
      </section>

      {/* SELECTION, editorial collage */}
      <section className="mx-auto max-w-6xl px-6 pb-16 md:px-10">
        <Reveal>
          <div className="mb-14 flex items-end justify-between border-b border-line pb-6">
            <h2 className="flex items-baseline gap-4 font-display text-display-lg">
              <span className="font-sans text-xs tabular-nums text-mute">01</span>
              Sélection
            </h2>
            <Link
              href="/galerie"
              className="hidden text-xs uppercase tracking-widest2 underline-hover md:inline"
            >
              Galerie complète →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-9 md:gap-6">
          {selection.map((work, i) => (
            <Reveal
              key={work.src}
              delay={i * 80}
              className={GRID_LAYOUT[i] ?? "md:col-span-3 aspect-[4/5]"}
            >
              <Link
                href="/galerie"
                className="group relative block h-full w-full overflow-hidden bg-paper-dim"
              >
                <Image
                  src={work.src}
                  alt={work.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="img-zoom object-cover"
                />
                <span className="caption-veil absolute bottom-0 left-0 flex items-baseline gap-3 bg-gradient-to-t from-ink/70 to-transparent px-5 pb-4 pt-10 text-paper">
                  <span className="font-sans text-[10px] tabular-nums text-paper/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg italic">La série</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 md:hidden">
          <Link href="/galerie" className="text-xs uppercase tracking-widest2 underline-hover">
            Galerie complète →
          </Link>
        </Reveal>
      </section>

      {/* INSTAGRAM, GALERIE PRINCIPALE */}
      <section className="mx-auto max-w-6xl px-6 py-32 md:px-10">
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <h2 className="flex items-baseline gap-4 font-display text-display-lg">
              <span className="font-sans text-xs tabular-nums text-mute">02</span>
              En direct d&apos;Instagram
            </h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href={SITE_INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-widest2 underline-hover"
              >
                Suivre @{SITE.instagramHandle} →
              </a>
              <Link href="/galerie" className="text-xs uppercase tracking-widest2 underline-hover">
                Galerie publique →
              </Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <InstagramFeed />
        </Reveal>
      </section>

      {/* CTA BAND */}
      <section className="grid border-t border-line md:grid-cols-2">
        <Link
          href="/galerie-privee"
          className="group flex flex-col justify-between gap-10 border-b border-line p-10 transition-colors duration-500 hover:bg-ink hover:text-paper md:border-b-0 md:border-r md:p-16"
        >
          <p className="text-[11px] uppercase tracking-widest2 opacity-50">
            Réservé aux équipes &amp; clients
          </p>
          <div>
            <h3 className="font-display text-display-md">Espace privé</h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-60">
              Accès par code aux galeries d&apos;intervention et de livraison, photos
              téléchargeables, supprimées automatiquement à l&apos;échéance.
            </p>
          </div>
          <span className="flex items-center gap-4 text-xs uppercase tracking-widest2">
            Entrer un code
            <span className="arrow-orbit flex h-10 w-10 items-center justify-center rounded-full border border-current">
              ↗
            </span>
          </span>
        </Link>

        <Link
          href="/boutique"
          className="group flex flex-col justify-between gap-10 p-10 transition-colors duration-500 hover:bg-ink hover:text-paper md:p-16"
        >
          <p className="text-[11px] uppercase tracking-widest2 opacity-50">
            Mariage · Entreprise · Portrait · Événement
          </p>
          <div>
            <h3 className="font-display text-display-md">Réserver une séance</h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-60">
              Confiez votre projet en quelques clics, et découvrez les tirages issus des séries.
            </p>
          </div>
          <span className="flex items-center gap-4 text-xs uppercase tracking-widest2">
            Boutique &amp; séances
            <span className="arrow-orbit flex h-10 w-10 items-center justify-center rounded-full border border-current">
              ↗
            </span>
          </span>
        </Link>
      </section>
    </>
  );
}
