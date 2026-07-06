"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  if (state.status === "success") {
    return (
      <div className="border border-line bg-paper-dim px-8 py-12 text-center">
        <p className="font-display text-2xl">Message envoyé.</p>
        <p className="mt-2 text-sm text-mute">Merci, je reviens vers toi rapidement.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-7" noValidate>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-7 md:grid-cols-2">
        <Field label="Nom" name="name" required />
        <Field label="E-mail" name="email" type="email" required />
      </div>

      <Field label="Sujet" name="subject" />

      <div>
        <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor="message">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="mt-2 w-full resize-none border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink"
        />
      </div>

      {state.status === "error" && <p className="text-sm text-accent">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="text-xs uppercase tracking-widest2 underline-hover disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Envoyer →"}
      </button>

      <p className="text-xs leading-relaxed text-mute">
        En envoyant ce formulaire, tu acceptes que ces informations soient utilisées pour te
        répondre. Voir la section confidentialité ci-dessous.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest2 text-mute" htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink"
      />
    </div>
  );
}
