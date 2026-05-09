"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Menu, X } from "./Icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/platform", label: "Platform" },
  { href: "/strategy", label: "Strategy" },
  { href: "/constitution", label: "Constitution" },
  { href: "/executive", label: "Executive" },
  { href: "/judicial", label: "Judicial" },
  { href: "/address", label: "Address" },
  { href: "/budget", label: "Budget" },
  { href: "/media", label: "Media" },
];

export default function Nav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[color-mix(in_oklab,var(--bg)_80%,transparent)] border-b border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--fg-muted)] group-hover:text-[var(--accent)] transition">2028</span>
          <span className="font-semibold tracking-tight">Sackett &middot; Kavuru</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 text-sm rounded-md transition ${
                  active
                    ? "text-[var(--accent)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded-md border border-[var(--border)] hover:border-[var(--accent)] transition text-[var(--fg-muted)] hover:text-[var(--accent)]"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
            className="p-2 rounded-md border border-[var(--border)] lg:hidden text-[var(--fg-muted)]"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)]">
          <div className="max-w-[1200px] mx-auto px-6 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-2 py-2 text-sm rounded-md ${
                  pathname === l.href ? "text-[var(--accent)]" : "text-[var(--fg-muted)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
