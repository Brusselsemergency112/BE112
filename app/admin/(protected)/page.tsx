import Link from "next/link";
import { listGalleries } from "@/lib/data/galleries";
import { listAllProducts } from "@/lib/data/products";
import { listContactMessages } from "@/lib/data/messages";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [galleries, products, messages] = await Promise.all([
    safe(() => listGalleries(), []),
    safe(() => listAllProducts(), []),
    safe(() => listContactMessages(), []),
  ]);

  const unread = messages.filter((m) => !m.read).length;

  const cards = [
    { label: "Galeries privées", value: galleries.length, href: "/admin/galeries" },
    { label: "Produits boutique", value: products.length, href: "/admin/boutique" },
    { label: "Messages non lus", value: unread, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Tableau de bord</h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-line p-8 transition-colors hover:bg-paper-dim"
          >
            <p className="font-display text-5xl">{card.value}</p>
            <p className="mt-2 text-xs uppercase tracking-widest2 text-mute">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(err);
    return fallback;
  }
}
