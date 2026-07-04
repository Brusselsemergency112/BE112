"use client";

import { useTransition } from "react";
import { deleteGalleryAction } from "./actions";

export default function DeleteGalleryButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Supprimer définitivement cette galerie et toutes ses photos ?")) return;
        startTransition(() => deleteGalleryAction(id));
      }}
      className="text-xs uppercase tracking-widest2 text-accent underline-hover disabled:opacity-50"
    >
      {pending ? "Suppression…" : "Supprimer"}
    </button>
  );
}
