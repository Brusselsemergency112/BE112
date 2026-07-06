import { existsSync, readdirSync, statSync } from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MIN_VALID_SIZE_BYTES = 10_000; // skip corrupt/placeholder files
const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;

export type WorkImage = { src: string; alt: string };

function listImages(folder: string): string[] {
  const dir = path.join(PUBLIC_DIR, folder);
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((f) => {
      if (!IMAGE_RE.test(f)) return false;
      try {
        return statSync(path.join(dir, f)).size >= MIN_VALID_SIZE_BYTES;
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
    return na - nb || a.localeCompare(b);
  });

  return files;
}

export function getWorks(): WorkImage[] {
  return listImages("works").map((f, i) => ({
    src: `/works/${f}`,
    alt: `Brussels Emergency 112, photographie ${i + 1}, par Ilias Remchani`,
  }));
}

/**
 * Landscape "epic" edits meant for full-width banners (hero sections).
 * Drop files into public/banners/ ; ordered by number in filename.
 */
export function getBanners(): WorkImage[] {
  return listImages("banners").map((f, i) => ({
    src: `/banners/${f}`,
    alt: `Brussels Emergency 112, bannière ${i + 1}, par Ilias Remchani`,
  }));
}

/** First image found in public/portrait/, else the provided fallback. */
export function getPortraitSrc(fallback: string): string {
  const files = listImages("portrait");
  if (files.length > 0) return `/portrait/${files[0]}`;
  return existsSync(path.join(PUBLIC_DIR, fallback.replace(/^\//, ""))) ? fallback : "";
}
