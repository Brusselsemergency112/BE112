import type { ReactNode } from "react";

/**
 * Instrument Serif's numerals render "1" close to a lowercase "l", which makes
 * "BE112" hard to read inline in large display type. This keeps the brand
 * mark in the sans-serif font wherever it appears inside serif copy.
 */
export function withBrandMark(text: string): ReactNode[] {
  return text.split(/(BE112)/g).map((part, i) =>
    part === "BE112" ? (
      <span key={i} className="font-sans">
        BE112
      </span>
    ) : (
      part
    )
  );
}
