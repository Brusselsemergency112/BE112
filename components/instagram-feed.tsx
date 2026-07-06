"use client";

import { useEffect } from "react";

const PROVIDER = process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_PROVIDER;
const WIDGET_ID = process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_ID;

export default function InstagramFeed() {
  useEffect(() => {
    if (PROVIDER !== "behold" || !WIDGET_ID) return;

    if (!document.querySelector("script[data-behold-widget]")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://w.behold.so/widget.js";
      script.dataset.beholdWidget = "true";
      document.head.append(script);
    }
  }, []);

  if (!PROVIDER || !WIDGET_ID) {
    return <InstagramPlaceholder />;
  }

  if (PROVIDER === "snapwidget") {
    return (
      <iframe
        src={`https://snapwidget.com/embed/${WIDGET_ID}`}
        title="Fil Instagram"
        className="w-full border-0"
        style={{ height: 900 }}
        loading="lazy"
      />
    );
  }

  // Behold "compatibility embed": a plain div the widget script upgrades.
  return <div data-behold-id={WIDGET_ID} className="min-h-[400px] w-full" />;
}

function InstagramPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-line px-6 py-24 text-center">
      <p className="text-sm text-ink">Fil Instagram non connecté</p>
      <p className="max-w-sm text-xs leading-relaxed text-mute">
        Renseigne <code className="text-[11px]">NEXT_PUBLIC_INSTAGRAM_WIDGET_PROVIDER</code> et{" "}
        <code className="text-[11px]">NEXT_PUBLIC_INSTAGRAM_WIDGET_ID</code> pour afficher
        automatiquement les derniers posts Instagram ici, voir le README.
      </p>
    </div>
  );
}
