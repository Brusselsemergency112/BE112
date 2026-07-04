import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/galeries", label: "Galeries privées" },
  { href: "/admin/boutique", label: "Boutique" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 md:px-10">
          <nav className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest2">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="underline-hover text-mute hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs uppercase tracking-widest2 underline-hover text-mute hover:text-ink">
              Voir le site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-14 md:px-10">{children}</main>
    </div>
  );
}
