export const SITE = {
  name: "Brussels Emergency 112",
  author: "Ilias Remchani",
  tagline: "Photographie documentaire, Bruxelles",
  description:
    "Brussels Emergency 112, photographie documentaire au cœur des services d'urgence bruxellois. Galeries, espace privé pour les équipes, séances sur demande et tirages, par Ilias Remchani.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "brusselsemergency112@outlook.be",
  instagramHandle: (process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "brusselsemergency112").replace(/^@/, ""),
  linkedinUrl:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ||
    "https://be.linkedin.com/in/ilias-remchani-004bab301",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.brusselsemergency112.be",
};

export const SITE_INSTAGRAM_URL = `https://instagram.com/${SITE.instagramHandle}`;

export const POSETONCASQUE = {
  name: "Pose Ton Casque",
  url: "https://posetoncasque.be",
  instagram: "https://www.instagram.com/posetoncasque.brussels/",
};

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/galerie", label: "Galerie" },
  { href: "/galerie-privee", label: "Espace privé" },
  { href: "/boutique", label: "Boutique" },
  { href: "/biographie", label: "Ilias Remchani" },
  { href: "/contact", label: "Contact" },
] as const;

export const GALLERY_CATEGORIES = [
  { value: "section", label: "Section" },
  { value: "medicalteam", label: "Medical Team" },
  { value: "ambulancier", label: "Ambulanciers" },
  { value: "services", label: "Services" },
  { value: "autre", label: "Autre" },
] as const;

// Catégorie libre : n'importe quel nom de section saisi dans l'admin
// (les entrées ci-dessus servent de suggestions et de libellés hérités).
export type GalleryCategory = string;

export function categoryLabel(value: string): string {
  return GALLERY_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export const DURATION_PRESETS_DAYS = [30, 60, 90] as const;

export const BOOKING_SERVICES = [
  {
    id: "mariage",
    title: "Mariage",
    blurb: "Un récit complet de votre journée, du matin aux dernières lumières, sobre, vrai, sans poses forcées.",
    detail: "Couverture demi-journée ou journée complète · galerie privée de livraison incluse",
  },
  {
    id: "entreprise",
    title: "Entreprise & institutions",
    blurb: "Reportages métier, portraits d'équipe, événements internes, une image professionnelle qui raconte le terrain.",
    detail: "Sur devis · droits d'utilisation adaptés à vos supports",
  },
  {
    id: "portrait",
    title: "Portrait & séance privée",
    blurb: "Une séance en lumière naturelle, à Bruxelles, seul·e, en couple ou en famille.",
    detail: "1 à 2 heures · sélection retouchée livrée en galerie privée",
  },
  {
    id: "evenement",
    title: "Événement",
    blurb: "Concerts, cérémonies, compétitions, vie associative, la couverture discrète d'un moment qui compte.",
    detail: "Formule adaptée à la durée et au lieu",
  },
  {
    id: "autre",
    title: "Autre projet",
    blurb: "Un projet documentaire, une collaboration, une idée hors cadre ? Parlons-en.",
    detail: "Sur mesure",
  },
] as const;

export type BookingServiceId = (typeof BOOKING_SERVICES)[number]["id"];
