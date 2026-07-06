import { existsSync, readdirSync, statSync } from "fs";
import path from "path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MIN_VALID_SIZE_BYTES = 10_000; // skip corrupt/placeholder files
const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;

export type WorkImage = { src: string; alt: string; width: number; height: number };

const dimsCache = new Map<string, { width: number; height: number }>();

async function readDims(absPath: string): Promise<{ width: number; height: number }> {
  const cached = dimsCache.get(absPath);
  if (cached) return cached;
  try {
    const meta = await sharp(absPath).metadata();
    const dims = { width: meta.width || 1600, height: meta.height || 1067 };
    dimsCache.set(absPath, dims);
    return dims;
  } catch {
    const dims = { width: 1600, height: 1067 };
    dimsCache.set(absPath, dims);
    return dims;
  }
}

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

async function collect(folder: string, altPrefix: string): Promise<WorkImage[]> {
  const files = listImages(folder);
  return Promise.all(
    files.map(async (f, i) => {
      const dims = await readDims(path.join(PUBLIC_DIR, folder, f));
      return {
        src: `/${folder}/${f}`,
        alt: `${altPrefix} ${i + 1}, par Ilias Remchani`,
        ...dims,
      };
    })
  );
}

export function getWorks(): Promise<WorkImage[]> {
  return collect("works", "Brussels Emergency 112, photographie");
}

/**
 * Landscape "epic" edits meant for full-width banners (hero sections).
 * Drop files into public/banners/ ; ordered by number in filename.
 */
export function getBanners(): Promise<WorkImage[]> {
  return collect("banners", "Brussels Emergency 112, bannière");
}

/** First image found in public/portrait/, else the provided fallback. */
export function getPortraitSrc(fallback: string): string {
  const files = listImages("portrait");
  if (files.length > 0) return `/portrait/${files[0]}`;
  return existsSync(path.join(PUBLIC_DIR, fallback.replace(/^\//, ""))) ? fallback : "";
}
