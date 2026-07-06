"use client";

import { useActionState, useRef, useState } from "react";
import { submitBookingAction, type BookingState } from "@/app/boutique/actions";
import { BOOKING_SERVICES, SITE } from "@/lib/site";

const initialState: BookingState = { status: "idle" };

export default function BookingFlow() {
  const [selected, setSelected] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(submitBookingAction, initialState);
  const formRef = useRef<HTMLDivElement>(null);

  const service = BOOKING_SERVICES.find((s) => s.id === selected) ?? null;

  if (state.status === "success") {
    return (
      <div className="border border-line bg-paper-dim px-8 py-16 text-center">
        <p className="font-display text-display-md">Demande envoyée.</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mute">
          Merci pour ta confiance, une réponse personnalisée arrive sous 48h avec une
          proposition adaptée à ton projet. En cas d&apos;urgence, écris directement à{" "}
          <a href={`mailto:${SITE.email}`} className="underline-hover text-ink">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Étape 1, choix du type de séance */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BOOKING_SERVICES.map((s, i) => {
          const active = selected === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelected(s.id);
                requestAnimationFrame(() =>
                  formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
                );
              }}
              aria-pressed={active}
              className={`group flex flex-col gap-4 border p-7 text-left transition-colors duration-300 ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line hover:border-ink"
              }`}
            >
              <span className={`font-sans text-[10px] tabular-nums ${active ? "text-paper/50" : "text-mute"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-2xl leading-tight">{s.title}</span>
              <span className={`text-sm leading-relaxed ${active ? "text-paper/70" : "text-mute"}`}>
                {s.blurb}
              </span>
              <span
                className={`mt-auto text-[11px] uppercase tracking-widest2 ${
                  active ? "text-paper/50" : "text-mute/70"
                }`}
              >
                {s.detail}
              </span>
            </button>
          );
        })}
      </div>

      {/* Étape 2, coordonnées et détails */}
      <div ref={formRef} className={service ? "mt-10" : "hidden"}>
        {service && (
          <form action={formAction} className="border border-line p-8 md:p-10" noValidate>
            <input type="hidden" name="service" value={service.id} />
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-6">
              <p className="font-display text-2xl">
                {service.title} <span className="text-accent">·</span>{" "}
                <span className="text-mute text-lg">parle-nous de ton projet</span>
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-[11px] uppercase tracking-widest2 underline-hover text-mute"
              >
                ← Changer de formule
              </button>
            </div>

            <div className="mt-8 grid gap-7 md:grid-cols-2">
              <Field label="Nom" name="name" required autoComplete="name" />
              <Field label="E-mail" name="email" type="email" required autoComplete="email" />
              <Field label="Date souhaitée" name="date" placeholder="ex. 14 juin 2027, ou flexible" />
              <Field label="Lieu" name="location" placeholder="ex. Bruxelles et alentours" />
            </div>

            <div className="mt-7">
              <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor="details">
                Ton projet en quelques lignes
              </label>
              <textarea
                id="details"
                name="details"
                rows={5}
                placeholder="Contexte, nombre de personnes, ambiance recherchée, contraintes…"
                className="mt-2 w-full resize-none border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink"
              />
            </div>

            {state.status === "error" && (
              <p className="mt-6 text-sm text-accent">{state.message}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button
                type="submit"
                disabled={pending}
                className="group flex items-center gap-4 bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {pending ? "Envoi…" : "Envoyer ma demande"}
                <span className="arrow-orbit">↗</span>
              </button>
              <p className="max-w-xs text-[11px] leading-relaxed text-mute">
                Réponse personnalisée sous 48h, aucune obligation, le devis est gratuit.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor={`booking-${name}`}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={`booking-${name}`}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none placeholder:text-mute/50 focus:border-ink"
      />
    </div>
  );
}
