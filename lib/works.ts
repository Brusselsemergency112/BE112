import { readdirSync } from "fs";
import path from "path";

const WORKS_DIR = path.join(process.cwd(), "public", "works");

export type WorkImage = { src: string; alt: string };

export function getWorks(): WorkImage[] {
  let files: string[] = [];
  try {
    files = readdirSync(WORKS_DIR).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
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
    alt: `Ilias Remchani — BE112, photographie ${i + 1}`,
  }));
}
