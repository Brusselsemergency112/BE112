import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import { BIOGRAPHY } from "@/content/biographie";
import { SITE, SITE_INSTAGRAM_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ilias Remchani",
  description:
    "Ilias Remchani, photographe à Bruxelles — fondateur du projet Brussels Emergency 112. Reportages, mariages, portraits et missions d'entreprise.",
};

export default function BiographiePage() {
  return (
    <article className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
      <Reveal>
        <p className="text-[11px] uppercase tracking-widest2 text-mute">{BIOGRAPHY.eyebrow}</p>
        <h1 className="mt-4 font-display text-display-xl">
          Ilias <em className="italic text-accent">Remchani</em>
        </h1>
      </Reveal>

      <div className="mt-16 grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <Reveal delay={80}>
          <div className="relative aspect-[4/5] overflow-hidden bg-paper-dim">
            <Image
              src={BIOGRAPHY.portrait}
              alt={`Portrait — ${SITE.author}`}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          <dl className="mt-8 divide-y divide-line border-t border-line">
            {BIOGRAPHY.facts.map((fact) => (
              <div key={fact.label} className="flex items-center justify-between py-3 text-sm">
                <dt className="text-mute">{fact.label}</dt>
                <dd className="text-right text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={SITE.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 border border-ink px-5 py-3 text-xs uppercase tracking-widest2 transition-colors hover:bg-ink hover:text-paper"
            >
              LinkedIn
              <span className="arrow-orbit">↗</span>
            </a>
            <a
              href={SITE_INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 border border-line px-5 py-3 text-xs uppercase tracking-widest2 text-mute transition-colors hover:border-ink hover:text-ink"
            >
              Instagram
              <span className="arrow-orbit">↗</span>
            </a>
          </div>
        </Reveal>

        <div className="space-y-8">
          <Reveal delay={120}>
            <p className="font-display text-display-md">{BIOGRAPHY.intro}</p>
          </Reveal>
          {BIOGRAPHY.paragraphs.map((p, i) => (
            <Reveal key={i} delay={160 + i * 60}>
              <p className="text-base leading-relaxed text-ink-soft">{p}</p>
            </Reveal>
          ))}

          <Reveal delay={240}>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {BIOGRAPHY.highlights.map((h, i) => (
                <div key={h.title} className="grid gap-2 py-6 md:grid-cols-[0.35fr_1fr] md:gap-8">
                  <p className="flex items-baseline gap-3 font-display text-xl">
                    <span className="font-sans text-[10px] tabular-nums text-mute">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {h.title}
                  </p>
                  <p className="text-sm leading-relaxed text-mute">{h.text}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link
                href="/boutique"
                className="group flex items-center gap-4 bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper transition-opacity hover:opacity-90"
              >
                Réserver une séance
                <span className="arrow-orbit">↗</span>
              </Link>
              <Link href="/contact" className="text-xs uppercase tracking-widest2 underline-hover">
                Me contacter →
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
