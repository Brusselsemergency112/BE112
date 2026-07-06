"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toggleFavoriteAction } from "@/app/galerie-privee/actions";

export type DeliveryItem = {
  id: string;
  src: string;
  alt: string;
  downloadHref: string;
  downloadName: string;
  favorited: boolean;
};

const SLIDESHOW_INTERVAL_MS = 4000;

export default function DeliveryGallery({
  slug,
  items: initialItems,
}: {
  slug: string;
  items: DeliveryItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [entering, setEntering] = useState(false);
  const playTimer = useRef<number | null>(null);

  const favoriteCount = items.filter((i) => i.favorited).length;

  const toggleFavorite = useCallback(
    async (photoId: string) => {
      setItems((prev) =>
        prev.map((it) => (it.id === photoId ? { ...it, favorited: !it.favorited } : it))
      );
      const result = await toggleFavoriteAction(slug, photoId);
      if ("error" in result) {
        setItems((prev) =>
          prev.map((it) => (it.id === photoId ? { ...it, favorited: !it.favorited } : it))
        );
      }
    },
    [slug]
  );

  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length]
  );

  const close = useCallback(() => {
    setIndex(null);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setEntering(false));

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, [index, next, prev, close]);

  useEffect(() => {
    if (!playing || index === null) return;
    playTimer.current = window.setInterval(next, SLIDESHOW_INTERVAL_MS);
    return () => {
      if (playTimer.current) window.clearInterval(playTimer.current);
    };
  }, [playing, index, next]);

  if (items.length === 0) {
    return (
      <p className="border border-dashed border-line px-6 py-16 text-center text-sm text-mute">
        Les photos arrivent bientôt — repasse un peu plus tard.
      </p>
    );
  }

  const active = index !== null ? items[index] : null;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <button
          type="button"
          onClick={() => {
            setEntering(true);
            setIndex(0);
            setPlaying(true);
          }}
          className="group flex items-center gap-3 border border-ink px-5 py-3 text-xs uppercase tracking-widest2 transition-colors hover:bg-ink hover:text-paper"
        >
          <span aria-hidden="true">▶</span> Diaporama
        </button>
        <p className="text-xs uppercase tracking-widest2 text-mute">
          {favoriteCount > 0
            ? `♥ ${favoriteCount} favori${favoriteCount > 1 ? "s" : ""}`
            : "Touche ♡ pour marquer tes préférées"}
        </p>
      </div>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]">
        {items.map((item, i) => (
          <div key={item.id} className="group relative mb-5 break-inside-avoid overflow-hidden bg-paper-dim">
            <button
              type="button"
              onClick={() => {
                setEntering(true);
                setIndex(i);
              }}
              aria-label={`Agrandir la photo ${i + 1}`}
              className="block w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="img-zoom w-full" />
            </button>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="font-sans text-[10px] tabular-nums tracking-widest2 text-paper/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pointer-events-auto flex items-center gap-2">
                <a
                  href={item.downloadHref}
                  download={item.downloadName}
                  aria-label={`Télécharger la photo ${i + 1}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink transition-transform hover:scale-105"
                >
                  ↓
                </a>
              </span>
            </div>

            <button
              type="button"
              onClick={() => toggleFavorite(item.id)}
              aria-label={item.favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
              aria-pressed={item.favorited}
              className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                item.favorited
                  ? "bg-accent text-paper opacity-100"
                  : "bg-ink/40 text-paper opacity-0 backdrop-blur-sm hover:bg-ink/60 group-hover:opacity-100"
              }`}
            >
              {item.favorited ? "♥" : "♡"}
            </button>
          </div>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          className={`fixed inset-0 z-[60] flex flex-col bg-ink/97 backdrop-blur-sm transition-opacity duration-300 ${
            entering ? "opacity-0" : "opacity-100"
          }`}
          onClick={close}
        >
          <div className="flex items-center justify-between px-6 py-5 text-paper md:px-10">
            <span className="font-sans text-xs tabular-nums tracking-widest2 text-paper/50">
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-5 md:gap-7">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPlaying((p) => !p);
                }}
                className="text-xs uppercase tracking-widest2 underline-hover"
              >
                {playing ? "Pause" : "Diaporama"}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(active.id);
                }}
                aria-pressed={active.favorited}
                className={`text-lg leading-none ${active.favorited ? "text-accent" : "text-paper/70 hover:text-paper"}`}
                aria-label={active.favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                {active.favorited ? "♥" : "♡"}
              </button>
              <a
                href={active.downloadHref}
                download={active.downloadName}
                onClick={(e) => e.stopPropagation()}
                className="text-xs uppercase tracking-widest2 underline-hover"
              >
                Télécharger
              </a>
              <button
                type="button"
                onClick={close}
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
                  prev();
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
                  next();
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
