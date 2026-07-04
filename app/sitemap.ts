import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/biographie`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/galerie`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/boutique`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE.url}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
