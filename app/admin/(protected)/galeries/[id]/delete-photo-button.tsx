"use client";

import { useTransition } from "react";
import { deletePhotoAction } from "../actions";

export default function DeletePhotoButton({
  galleryId,
  photoId,
}: {
  galleryId: string;
  photoId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Supprimer cette photo ?")) return;
        startTransition(() => deletePhotoAction(galleryId, photoId));
      }}
      className="bg-paper px-3 py-1.5 text-[10px] uppercase tracking-widest2 text-ink disabled:opacity-50"
    >
      Supprimer
    </button>
  );
}
