"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createGalleryAction, type CreateGalleryState } from "./actions";
import { GALLERY_CATEGORIES, DURATION_PRESETS_DAYS } from "@/lib/site";

const initialState: CreateGalleryState = { status: "idle" };

export default function CreateGalleryForm() {
  const [state, formAction, pending] = useActionState(createGalleryAction, initialState);
  const [duration, setDuration] = useState(30);
  const [copied, setCopied] = useState(false);

  if (state.status === "success") {
    return (
      <div className="border border-line bg-paper-dim p-8">
        <p className="text-xs uppercase tracking-widest2 text-mute">Galerie créée</p>
        <h3 className="mt-2 font-display text-2xl">{state.title}</h3>
        <p className="mt-4 text-sm text-mute">
          Code d&apos;accès, communique-le maintenant, il ne sera plus jamais affiché :
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <code className="text-2xl tracking-[0.3em]">{state.code}</code>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(state.code);
              setCopied(true);
            }}
            className="text-xs uppercase tracking-widest2 underline-hover"
          >
            {copied ? "Copié ✓" : "Copier"}
          </button>
        </div>
        <div className="mt-6 flex gap-6">
          <Link href={`/admin/galeries/${state.slug}`} className="text-xs uppercase tracking-widest2 underline-hover">
            Ajouter des photos →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-6 border border-line p-8 md:grid-cols-2">
      <div>
        <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor="title">
          Titre
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink"
          placeholder="Intervention 12 mai, Ambulanciers"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor="category">
          Section
        </label>
        <input
          id="category"
          name="category"
          required
          maxLength={60}
          list="category-suggestions"
          placeholder="DMP 24h Vélo, Med Team, Couleur Café…"
          className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink"
        />
        <datalist id="category-suggestions">
          {GALLERY_CATEGORIES.map((c) => (
            <option key={c.value} value={c.label} />
          ))}
        </datalist>
        <p className="mt-1 text-[11px] text-mute">
          Tape un nom libre, les sections existantes sont proposées automatiquement.
        </p>
      </div>

      <div className="md:col-span-2">
        <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor="durationDays">
          Durée avant suppression automatique
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {DURATION_PRESETS_DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className={`border px-3 py-1 text-xs uppercase tracking-widest2 ${
                duration === d ? "border-ink bg-ink text-paper" : "border-line text-mute"
              }`}
            >
              {d} j
            </button>
          ))}
          <input
            id="durationDays"
            name="durationDays"
            type="number"
            min={1}
            max={365}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-24 border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink"
          />
          <span className="text-xs text-mute">jours</span>
        </div>
      </div>

      {state.status === "error" && <p className="text-sm text-accent md:col-span-2">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="text-xs uppercase tracking-widest2 underline-hover disabled:opacity-50 md:col-span-2 md:w-fit"
      >
        {pending ? "Création…" : "Créer la galerie →"}
      </button>
    </form>
  );
}
