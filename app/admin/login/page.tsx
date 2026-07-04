"use client";

import { useActionState } from "react";
import { adminLogin, type AdminLoginState } from "./actions";

const initialState: AdminLoginState = { status: "idle" };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-widest2 text-mute">BE112</p>
      <h1 className="mt-3 font-display text-4xl">Administration</h1>

      <form action={formAction} className="mt-10 w-full space-y-6">
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
          autoFocus
          className="w-full border-b border-line bg-transparent py-3 text-center text-sm outline-none focus:border-ink"
        />
        {state.status === "error" && <p className="text-sm text-accent">{state.message}</p>}
        <button
          type="submit"
          disabled={pending}
          className="text-xs uppercase tracking-widest2 underline-hover disabled:opacity-50"
        >
          {pending ? "Connexion…" : "Se connecter →"}
        </button>
      </form>
    </div>
  );
}
