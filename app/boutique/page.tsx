import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import BookingFlow from "@/components/booking-flow";
import { SITE } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { listActiveProducts, productImageUrl } from "@/lib/data/products";
import type { ShopProductRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Boutique & séances",
  description:
    "Réserver une séance photo — mariage, entreprise, portrait, événement — et découvrir les tirages Brussels Emergency 112.",
};

function requestMailto(product: ShopProductRow): string {
  const subject = encodeURIComponent(`Demande — ${product.name}`);
  const body = encodeURIComponent(
    `Bonjour,\n\nJe suis intéressé·e par « ${product.name} ». Pouvez-vous me donner plus de détails (disponibilité, tarif, délais) ?\n\nMerci,`
  );
  return `mailto:${SITE.email}?subject=${subject}&body=${body}`;
}

export default async function BoutiquePage() {
  let products: ShopProductRow[] = [];

  try {
    if (isSupabaseConfigured()) products = await listActiveProducts();
  } catch (err) {
    console.error("listActiveProducts failed", err);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
      <Reveal>
        <p className="text-[11px] uppercase tracking-widest2 text-mute">Boutique &amp; séances</p>
        <h1 className="mt-4 font-display text-display-xl">
          Travaillons <em className="italic text-accent">ensemble</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-mute">
          Choisis le type de séance qui te correspond, décris ton projet en deux minutes — et
          reçois une proposition sur mesure sous 48h. Plus bas : les tirages issus des séries.
        </p>
      </Reveal>

      {/* RÉSERVATION */}
      <section id="seances" className="mt-20">
        <Reveal>
          <div className="mb-10 border-b border-line pb-6">
            <h2 className="flex items-baseline gap-4 font-display text-display-lg">
              <span className="font-sans text-xs tabular-nums text-mute">01</span>
              Réserver une séance
            </h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <BookingFlow />
        </Reveal>
      </section>

      {/* TIRAGES */}
      <section id="tirages" className="mt-32">
        <Reveal>
          <div className="mb-10 border-b border-line pb-6">
            <h2 className="flex items-baseline gap-4 font-display text-display-lg">
              <span className="font-sans text-xs tabular-nums text-mute">02</span>
              Tirages &amp; éditions
            </h2>
          </div>
        </Reveal>

        {products.length === 0 ? (
          <Reveal>
            <p className="border border-dashed border-line px-6 py-10 text-center text-sm text-mute">
              Les premiers tirages arrivent bientôt — en attendant, parle-nous de ta séance
              ci-dessus.
            </p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 md:gap-x-8">
            {products.map((product, i) => {
              const image = productImageUrl(product.image_path);
              return (
                <Reveal key={product.id} delay={i * 60}>
                  <article className="group">
                    <div className="relative aspect-[4/5] overflow-hidden bg-paper-dim">
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={product.name}
                          loading="lazy"
                          className="img-zoom h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl">{product.name}</h3>
                        {product.price_label && (
                          <p className="mt-1 text-sm text-mute">{product.price_label}</p>
                        )}
                      </div>
                    </div>
                    {product.description && (
                      <p className="mt-2 text-sm leading-relaxed text-mute">{product.description}</p>
                    )}
                    <a
                      href={requestMailto(product)}
                      className="mt-3 inline-block text-xs uppercase tracking-widest2 underline-hover"
                    >
                      Demander →
                    </a>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
