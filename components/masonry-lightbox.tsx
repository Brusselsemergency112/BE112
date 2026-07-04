"use client";

import { useEffect, useState } from "react";

export type MasonryItem = {
  id: string;
  src: string;
  alt: string;
  downloadHref?: string;
  downloadName?: string;
};

export default function MasonryLightbox({ items }: { items: MasonryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setEntering(false));

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, [index, items.length]);

  if (items.length === 0) {
    return (
      <p className="border border-dashed border-line px-6 py-16 text-center text-sm text-mute">
        Aucune photo à afficher pour le moment.
      </p>
    );
  }

  const active = index !== null ? items[index] : null;

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setEntering(true);
              setIndex(i);
            }}
            aria-label={`Agrandir la photo ${i + 1}`}
            className="group relative mb-5 block w-full break-inside-avoid overflow-hidden bg-paper-dim text-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              className="img-zoom w-full"
            />
            <span className="caption-veil absolute bottom-3 right-3 bg-ink/70 px-2.5 py-1 font-sans text-[10px] tabular-nums tracking-widest2 text-paper">
              {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          className={`fixed inset-0 z-[60] flex flex-col bg-ink/97 backdrop-blur-sm transition-opacity duration-300 ${
            entering ? "opacity-0" : "opacity-100"
          }`}
          onClick={() => setIndex(null)}
        >
          <div className="flex items-center justify-between px-6 py-5 text-paper md:px-10">
            <span className="font-sans text-xs tabular-nums tracking-widest2 text-paper/50">
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-6">
              {active.downloadHref && (
                <a
                  href={active.downloadHref}
                  download={active.downloadName}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs uppercase tracking-widest2 underline-hover"
                >
                  Télécharger
                </a>
              )}
              <button
                type="button"
                onClick={() => setIndex(null)}
                aria-label="Fermer"
                className="text-xs uppercase tracking-widest2 underline-hover"
              >
                Fermer
              </button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 pb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={active.id}
              src={active.src}
              alt={active.alt}
              className="fade-in-slow max-h-full max-w-full object-contain"
              style={{ "--d": "0ms" } as React.CSSProperties}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Photo précédente"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 px-4 py-6 font-display text-3xl text-paper/60 transition-colors hover:text-paper md:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Photo suivante"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) => (i === null ? i : (i + 1) % items.length));
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-6 font-display text-3xl text-paper/60 transition-colors hover:text-paper md:right-6"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
