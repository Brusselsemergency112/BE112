"use client";

import { useActionState } from "react";
import { accessGallery, type GalleryAccessState } from "@/app/galerie-privee/actions";

const initialState: GalleryAccessState = { status: "idle" };

export default function CodeGateForm() {
  const [state, formAction, pending] = useActionState(accessGallery, initialState);

  return (
    <form action={formAction} className="mx-auto flex max-w-sm flex-col items-center gap-6">
      <input
        name="code"
        placeholder="CODE D'ACCÈS"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        required
        className="w-full border-b border-line bg-transparent py-3 text-center text-lg uppercase tracking-[0.3em] outline-none focus:border-ink"
      />
      {state.status === "error" && <p className="text-sm text-accent">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="text-xs uppercase tracking-widest2 underline-hover disabled:opacity-50"
      >
        {pending ? "Vérification…" : "Accéder →"}
      </button>
    </form>
  );
}
