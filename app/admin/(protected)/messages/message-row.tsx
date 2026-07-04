"use client";

import { useTransition } from "react";
import { deleteMessageAction, markMessageReadAction } from "./actions";
import type { ContactMessageRow } from "@/lib/supabase/types";

export default function MessageRow({ message }: { message: ContactMessageRow }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className={`border border-line p-6 ${message.read ? "" : "bg-paper-dim"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">
            {message.name} <span className="text-mute">— {message.email}</span>
          </p>
          {message.subject && <p className="mt-1 text-sm text-mute">{message.subject}</p>}
        </div>
        <p className="text-xs text-mute">{new Date(message.created_at).toLocaleString("fr-BE")}</p>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
      <div className="mt-4 flex items-center gap-6 text-xs uppercase tracking-widest2">
        <a href={`mailto:${message.email}`} className="underline-hover">
          Répondre
        </a>
        {!message.read && (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => markMessageReadAction(message.id))}
            className="underline-hover disabled:opacity-50"
          >
            Marquer comme lu
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!window.confirm("Supprimer ce message ?")) return;
            startTransition(() => deleteMessageAction(message.id));
          }}
          className="text-accent underline-hover disabled:opacity-50"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
