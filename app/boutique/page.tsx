import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import { SITE } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { listActiveProducts, productImageUrl } from "@/lib/data/products";
import type { ShopProductRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Tirages et éditions d'Ilias Remchani — BE112.",
};

function requestMailto(product: ShopProductRow): string {
  const subject = encodeURIComponent(`Demande — ${product.name}`);
  const body = encodeURIComponent(
    `Bonjour Ilias,\n\nJe suis intéressé·e par « ${product.name} ». Peux-tu me donner plus de détails (disponibilité, tarif, délais) ?\n\nMerci,`
  );
  return `mailto:${SITE.email}?subject=${subject}&body=${body}`;
}

export default async function BoutiquePage() {
  let products: ShopProductRow[] = [];
  let configured = true;

  try {
    configured = isSupabaseConfigured();
    if (configured) products = await listActiveProducts();
  } catch (err) {
    console.error("listActiveProducts failed", err);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
      <Reveal>
        <p className="text-[11px] uppercase tracking-widest2 text-mute">Boutique</p>
        <h1 className="mt-4 font-display text-display-xl">Tirages &amp; éditions</h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-mute">
          Une sélection de tirages et d&apos;objets, disponibles sur demande. Chaque commande est
          traitée individuellement — écris-moi pour les formats, tarifs et délais.
        </p>
      </Reveal>

      {!configured && (
        <p className="mt-16 border border-dashed border-line px-6 py-10 text-center text-sm text-mute">
          La boutique n&apos;est pas encore configurée.
        </p>
      )}

      {configured && products.length === 0 && (
        <p className="mt-16 border border-dashed border-line px-6 py-10 text-center text-sm text-mute">
          Aucun article disponible pour le moment — revenez bientôt.
        </p>
      )}

      <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 md:gap-x-8">
        {products.map((product, i) => {
          const image = productImageUrl(product.image_path);
          return (
            <Reveal key={product.id} delay={i * 60}>
              <article>
                <div className="relative aspect-[4/5] overflow-hidden bg-paper-dim">
                  {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl">{product.name}</h2>
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
    </div>
  );
}
