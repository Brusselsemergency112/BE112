"use client";

import { useRef, useTransition } from "react";
import { uploadPhotosAction } from "../actions";

export default function UploadPhotosForm({ galleryId }: { galleryId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData: FormData) => {
        startTransition(async () => {
          await uploadPhotosAction(galleryId, formData);
          formRef.current?.reset();
        });
      }}
      className="flex flex-wrap items-center gap-4 border border-dashed border-line p-6"
    >
      <input type="file" name="photos" accept="image/*" multiple required className="text-sm" />
      <button
        type="submit"
        disabled={pending}
        className="text-xs uppercase tracking-widest2 underline-hover disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Ajouter les photos →"}
      </button>
    </form>
  );
}
