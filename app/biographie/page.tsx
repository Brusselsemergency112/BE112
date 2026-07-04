import Image from "next/image";
import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import { BIOGRAPHY } from "@/content/biographie";
import { withBrandMark } from "@/lib/utils/brand-mark";

export const metadata: Metadata = {
  title: "Biographie",
  description: "Biographie d'Ilias Remchani, photographe à Bruxelles X BE112.",
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
              alt="Portrait — Ilias Remchani"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          <dl className="mt-8 divide-y divide-line border-t border-line">
            {BIOGRAPHY.facts.map((fact) => (
              <div key={fact.label} className="flex items-center justify-between py-3 text-sm">
                <dt className="text-mute">{fact.label}</dt>
                <dd className="text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="space-y-8">
          <Reveal delay={120}>
            <p className="font-display text-3xl leading-snug md:text-4xl">
              {withBrandMark(BIOGRAPHY.intro)}
            </p>
          </Reveal>
          {BIOGRAPHY.paragraphs.map((p, i) => (
            <Reveal key={i} delay={160 + i * 60}>
              <p className="text-base leading-relaxed text-ink-soft">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  );
}
