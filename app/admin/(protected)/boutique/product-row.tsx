"use client";

import { useTransition } from "react";
import { deleteProductAction, toggleProductAction } from "./actions";
import type { ShopProductRow } from "@/lib/supabase/types";

export default function ProductRow({ product, imageUrl }: { product: ShopProductRow; imageUrl: string | null }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden bg-paper-dim">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-xs text-mute">
          {product.price_label || "Sans prix"} · {product.active ? "Visible" : "Masqué"}
        </p>
      </div>
      <div className="flex items-center gap-4 text-xs uppercase tracking-widest2">
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => toggleProductAction(product.id, !product.active))}
          className="underline-hover disabled:opacity-50"
        >
          {product.active ? "Masquer" : "Afficher"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!window.confirm(`Supprimer « ${product.name} » ?`)) return;
            startTransition(() => deleteProductAction(product.id));
          }}
          className="text-accent underline-hover disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
