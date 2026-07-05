import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import CodeGateForm from "@/components/code-gate-form";
import { GALLERY_CATEGORIES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Espace privé",
  description:
    "Accès par code aux galeries privées Brussels Emergency 112 — équipes, clients et partenaires.",
};

export default function GaleriePriveePage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-6 pb-24 pt-32 text-center md:px-10">
      <Reveal>
        <p className="text-[11px] uppercase tracking-widest2 text-mute">Espace privé</p>
        <h1 className="mt-4 font-display text-display-lg">Galeries d&apos;intervention</h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-mute">
          Chaque galerie est protégée par un code unique, communiqué directement aux équipes
          concernées. Les photos sont automatiquement supprimées après leur période de
          disponibilité.
        </p>
      </Reveal>

      <Reveal delay={100} className="mt-12 w-full">
        <CodeGateForm />
      </Reveal>

      <Reveal delay={160} className="mt-16">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest2 text-mute">
          {GALLERY_CATEGORIES.filter((c) => c.value !== "autre").map((c) => (
            <span key={c.value}>{c.label}</span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
