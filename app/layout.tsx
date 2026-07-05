import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { SITE } from "@/lib/site";

const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-serif",
  display: "swap",
});

const grotesk = Manrope({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Photographie documentaire, Bruxelles`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — Photographie documentaire, Bruxelles`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "fr_BE",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  sameAs: [`https://instagram.com/${SITE.instagramHandle}`, SITE.linkedinUrl],
  founder: {
    "@type": "Person",
    name: SITE.author,
    jobTitle: "Photographe",
    address: { "@type": "PostalAddress", addressLocality: "Bruxelles", addressCountry: "BE" },
    sameAs: [SITE.linkedinUrl],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${grotesk.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
