"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, SITE, SITE_INSTAGRAM_URL } from "@/lib/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide when scrolling down past the hero, reveal on any scroll up
      if (y > lastY.current && y > 320) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`border-b transition-colors duration-500 ${
          scrolled || open
            ? "border-line bg-paper/92 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <Link
            href="/"
            className={`font-display text-xl tracking-tight transition-colors duration-500 ${
              scrolled || open || pathname !== "/" ? "text-ink" : "text-paper"
            }`}
          >
            Ilias Remchani<span className="text-accent">.</span>
            <span className="ml-2 hidden font-sans text-[11px] uppercase tracking-widest2 opacity-60 md:inline">
              BE112
            </span>
          </Link>

          <nav
            className={`hidden items-center gap-8 text-[12px] uppercase tracking-widest2 transition-colors duration-500 md:flex ${
              scrolled || pathname !== "/" ? "text-mute" : "text-paper/70"
            }`}
          >
            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`underline-hover pb-1 transition-colors ${
                    active
                      ? scrolled || pathname !== "/"
                        ? "text-ink"
                        : "text-paper"
                      : "hover:text-ink"
                  } ${!scrolled && pathname === "/" ? "hover:text-paper" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={`block h-px w-6 transition-all duration-300 ${
                open ? "translate-y-[3px] rotate-45 bg-ink" : scrolled || pathname !== "/" ? "bg-ink" : "bg-paper"
              }`}
            />
            <span
              className={`block h-px w-6 transition-all duration-300 ${
                open ? "-translate-y-[3px] -rotate-45 bg-ink" : scrolled || pathname !== "/" ? "bg-ink" : "bg-paper"
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-[69px] bottom-0 z-40 flex flex-col justify-between overflow-y-auto bg-paper px-8 pb-10 pt-12 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="rise-in flex items-baseline gap-4 border-b border-line py-4"
                style={{ "--d": `${i * 60}ms` } as React.CSSProperties}
              >
                <span className="font-sans text-[11px] tabular-nums text-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-4xl text-ink">{link.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-12 flex items-center justify-between text-xs uppercase tracking-widest2 text-mute">
            <span>Bruxelles</span>
            <a href={SITE_INSTAGRAM_URL} target="_blank" rel="noreferrer" className="underline-hover">
              @{SITE.instagramHandle}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
