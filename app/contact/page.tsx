import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/reveal";
import ContactForm from "@/components/contact-form";
import PrivacyPolicy from "@/components/privacy-policy";
import { SITE, SITE_INSTAGRAM_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter Ilias Remchani — BE112. Confidentialité et RGPD.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
      <Reveal>
        <p className="text-[11px] uppercase tracking-widest2 text-mute">Contact</p>
        <h1 className="mt-4 font-display text-display-xl">Écrivons-nous</h1>
      </Reveal>

      <div className="mt-16 grid gap-16 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal delay={80}>
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-widest2 text-mute">E-mail</p>
              <a href={`mailto:${SITE.email}`} className="mt-2 block text-lg underline-hover">
                {SITE.email}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest2 text-mute">Instagram</p>
              <a
                href={SITE_INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-lg underline-hover"
              >
                @{SITE.instagramHandle}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest2 text-mute">Basé à</p>
              <p className="mt-2 text-lg">Bruxelles, Belgique</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest2 text-mute">Équipes &amp; services</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-mute">
                Une galerie d&apos;intervention à consulter ? Rendez-vous dans l&apos;
                <Link href="/galerie-privee" className="underline-hover text-ink">espace privé</Link>{" "}
                avec le code qui t&apos;a été communiqué.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <ContactForm />
        </Reveal>
      </div>

      <section id="confidentialite" className="mt-32 border-t border-line pt-16">
        <p className="text-xs uppercase tracking-widest2 text-mute">Confidentialité</p>
        <h2 className="mt-3 font-display text-4xl">Vie privée &amp; RGPD</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mute">
          Voici comment tes données sont utilisées lorsque tu contactes ce site ou accèdes à une
          galerie privée. Le détail complet est aussi disponible sur la page{" "}
          <Link href="/confidentialite" className="underline-hover text-ink">Confidentialité</Link>.
        </p>
        <div className="mt-10">
          <PrivacyPolicy />
        </div>
      </section>
    </div>
  );
}
