import { readdirSync, statSync } from "fs";
import path from "path";

const WORKS_DIR = path.join(process.cwd(), "public", "works");
const MIN_VALID_SIZE_BYTES = 10_000; // skip corrupt/placeholder files

export type WorkImage = { src: string; alt: string };

export function getWorks(): WorkImage[] {
  let files: string[] = [];
  try {
    files = readdirSync(WORKS_DIR).filter((f) => {
      if (!/\.(jpe?g|png|webp|avif)$/i.test(f)) return false;
      try {
        return statSync(path.join(WORKS_DIR, f)).size >= MIN_VALID_SIZE_BYTES;
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }

  files.sort((a, b) => {
    const na = parseInt(a.match(/(\d+)/)?.[1] ?? "0", 10);
    const nb = parseInt(b.match(/(\d+)/)?.[1] ?? "0", 10);
    return na - nb;
  });

  return files.map((f, i) => ({
    src: `/works/${f}`,
    alt: `Brussels Emergency 112 — photographie ${i + 1}, par Ilias Remchani`,
  }));
}
