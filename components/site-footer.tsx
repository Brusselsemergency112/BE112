import Link from "next/link";
import LocalTime from "@/components/local-time";
import { SITE, SITE_INSTAGRAM_URL } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="noise-veil border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-20 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-widest2 text-paper/40">
              Photographie documentaire — Bruxelles
            </p>
            <p className="mt-6 max-w-sm font-display text-2xl leading-snug text-paper/90">
              Un regard porté sur Bruxelles, ses services d&apos;urgence et les personnes qui font
              tenir la ville.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-8 inline-block text-sm underline-hover text-paper/80"
            >
              {SITE.email}
            </a>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-widest2 text-paper/40">Navigation</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li><Link className="underline-hover" href="/galerie">Galerie</Link></li>
              <li><Link className="underline-hover" href="/galerie-privee">Espace privé</Link></li>
              <li><Link className="underline-hover" href="/boutique">Boutique &amp; séances</Link></li>
              <li><Link className="underline-hover" href="/biographie">Ilias Remchani</Link></li>
              <li><Link className="underline-hover" href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-widest2 text-paper/40">Ailleurs</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <a className="underline-hover" href={SITE_INSTAGRAM_URL} target="_blank" rel="noreferrer">
                  Instagram — @{SITE.instagramHandle}
                </a>
              </li>
              <li>
                <a className="underline-hover" href={SITE.linkedinUrl} target="_blank" rel="noreferrer">
                  LinkedIn — {SITE.author}
                </a>
              </li>
              <li>
                <Link className="underline-hover" href="/confidentialite">
                  Confidentialité &amp; RGPD
                </Link>
              </li>
            </ul>
            <p className="mt-8 text-[11px] uppercase tracking-widest2 text-paper/40">
              Bruxelles — <LocalTime />
            </p>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="pointer-events-none mt-20 select-none whitespace-nowrap font-display text-[clamp(2.6rem,8.6vw,6.6rem)] leading-none text-paper/[0.07]"
        >
          Brussels Emergency 112
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-paper/10 pt-6 text-xs text-paper/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name} — photographies : {SITE.author}. Tous droits
            réservés.
          </p>
          <p>Bruxelles, Belgique</p>
        </div>
      </div>
    </footer>
  );
}
