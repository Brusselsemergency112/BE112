"use client";

import { useRef, useState } from "react";
import { prepareUploadsAction, registerUploadsAction } from "../actions";

type Phase = "idle" | "uploading" | "done" | "error";

export default function UploadPhotosForm({ galleryId }: { galleryId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload() {
    const files = Array.from(inputRef.current?.files ?? []);
    if (files.length === 0) {
      setMessage("Choisis d'abord des photos.");
      setPhase("error");
      return;
    }

    setPhase("uploading");
    setMessage(null);
    setProgress({ done: 0, total: files.length });

    const prepared = await prepareUploadsAction(
      galleryId,
      files.map((f) => ({ name: f.name }))
    );

    if (prepared.status === "error") {
      setPhase("error");
      setMessage(prepared.message);
      return;
    }

    const registered: {
      storagePath: string;
      filename: string;
      contentType: string | null;
      sizeBytes: number | null;
    }[] = [];
    const failed: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const target = prepared.targets[i];
      try {
        const res = await fetch(target.signedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        registered.push({
          storagePath: target.storagePath,
          filename: file.name,
          contentType: file.type || null,
          sizeBytes: file.size,
        });
      } catch (err) {
        console.error(`upload failed for ${file.name}`, err);
        failed.push(file.name);
      }
      setProgress({ done: i + 1, total: files.length });
    }

    if (registered.length > 0) {
      await registerUploadsAction(galleryId, registered);
    }

    if (failed.length > 0) {
      setPhase("error");
      setMessage(
        `${registered.length} photo(s) envoyée(s), ${failed.length} en échec : ${failed.slice(0, 3).join(", ")}${failed.length > 3 ? "…" : ""}, réessaie pour celles-ci.`
      );
    } else {
      setPhase("done");
      setMessage(`${registered.length} photo(s) envoyée(s).`);
    }

    if (inputRef.current) inputRef.current.value = "";
  }

  const uploading = phase === "uploading";

  return (
    <div className="space-y-3 border border-dashed border-line p-6">
      <div className="flex flex-wrap items-center gap-4">
        <input ref={inputRef} type="file" accept="image/*" multiple className="text-sm" disabled={uploading} />
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="text-xs uppercase tracking-widest2 underline-hover disabled:opacity-50"
        >
          {uploading
            ? `Envoi ${progress.done}/${progress.total}…`
            : "Ajouter les photos →"}
        </button>
      </div>
      {message && (
        <p className={`text-sm ${phase === "error" ? "text-accent" : "text-mute"}`}>{message}</p>
      )}
      <p className="text-[11px] text-mute">
        Les photos partent directement vers le stockage sécurisé, pas de limite de taille
        d&apos;envoi, jusqu&apos;à 100 photos à la fois.
      </p>
    </div>
  );
}
