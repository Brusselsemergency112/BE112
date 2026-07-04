"use client";

import { useActionState, useRef } from "react";
import { createProductAction, type CreateProductState } from "./actions";

const initialState: CreateProductState = { status: "idle" };

export default function CreateProductForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prev: CreateProductState, formData: FormData) => {
    const result = await createProductAction(prev, formData);
    if (result.status === "success") formRef.current?.reset();
    return result;
  }, initialState);

  return (
    <form ref={formRef} action={formAction} className="grid gap-6 border border-line p-8 md:grid-cols-2">
      <div>
        <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor="name">Nom</label>
        <input id="name" name="name" required maxLength={200} className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor="priceLabel">Prix (texte libre)</label>
        <input id="priceLabel" name="priceLabel" placeholder="À partir de 45€" className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink" />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} className="mt-2 w-full resize-none border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor="image">Visuel</label>
        <input id="image" name="image" type="file" accept="image/*" className="mt-2 w-full text-sm" />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor="sortOrder">Ordre d&apos;affichage</label>
        <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink" />
      </div>

      {state.status === "error" && <p className="text-sm text-accent md:col-span-2">{state.message}</p>}
      {state.status === "success" && <p className="text-sm text-ink md:col-span-2">Produit ajouté.</p>}

      <button type="submit" disabled={pending} className="text-xs uppercase tracking-widest2 underline-hover disabled:opacity-50 md:col-span-2 md:w-fit">
        {pending ? "Ajout…" : "Ajouter le produit →"}
      </button>
    </form>
  );
}
