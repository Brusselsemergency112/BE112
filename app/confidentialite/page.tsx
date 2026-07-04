import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import PrivacyPolicy from "@/components/privacy-policy";

export const metadata: Metadata = {
  title: "Confidentialité & RGPD",
  description: "Politique de confidentialité et RGPD du site d'Ilias Remchani — BE112.",
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
      <Reveal>
        <p className="text-[11px] uppercase tracking-widest2 text-mute">Légal</p>
        <h1 className="mt-4 font-display text-display-lg">Confidentialité &amp; RGPD</h1>
        <p className="mt-6 text-sm leading-relaxed text-mute">
          Cette page détaille comment les données personnelles sont collectées, utilisées et
          protégées sur ce site, conformément au Règlement général sur la protection des données
          (RGPD).
        </p>
      </Reveal>

      <div className="mt-16">
        <PrivacyPolicy />
      </div>
    </div>
  );
}
