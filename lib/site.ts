export const SITE = {
  name: "Ilias Remchani",
  project: "BE112",
  tagline: "Photographe — Bruxelles",
  description:
    "Photographie documentaire et d'auteur à Bruxelles. Portfolio, galeries privées d'intervention et tirages, par Ilias Remchani — BE112.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@brusselsemergency112.be",
  instagramHandle: (process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "brusselsemergency112").replace(/^@/, ""),
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.brusselsemergency112.be",
};

export const SITE_INSTAGRAM_URL = `https://instagram.com/${SITE.instagramHandle}`;

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/biographie", label: "Biographie" },
  { href: "/galerie", label: "Galerie" },
  { href: "/galerie-privee", label: "Espace privé" },
  { href: "/boutique", label: "Boutique" },
  { href: "/contact", label: "Contact" },
] as const;

export const GALLERY_CATEGORIES = [
  { value: "section", label: "Section" },
  { value: "medicalteam", label: "Medical Team" },
  { value: "ambulancier", label: "Ambulanciers" },
  { value: "services", label: "Services" },
  { value: "autre", label: "Autre" },
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]["value"];

export function categoryLabel(value: string): string {
  return GALLERY_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export const DURATION_PRESETS_DAYS = [30, 60, 90] as const;
