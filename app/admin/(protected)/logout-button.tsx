"use client";

import { useTransition } from "react";
import { adminLogout } from "./actions";

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => adminLogout())}
      className="text-xs uppercase tracking-widest2 underline-hover disabled:opacity-50"
    >
      Déconnexion
    </button>
  );
}
