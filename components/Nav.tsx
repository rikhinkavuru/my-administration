"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Menu, X } from "./Icons";
import { motion, AnimatePresence } from "framer-motion";

const links = [
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[color-mix(in_oklab,var(--bg)_70%,transparent)] border-b border-[var(--hairline)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between h-16">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-lg tracking-tight text-[var(--ink)]">
            Sackett <span className="text-[var(--accent)]">/</span> Kavuru
          </span>
          <span className="text-[10px] tabular-nums tracking-[0.25em] text-[var(--ink-muted)] uppercase">2028</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className="relative px-3 py-1.5 text-sm transition">
                <span className={active ? "text-[var(--ink)]" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"}>
                  {l.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-[2px] h-px bg-[var(--accent)]"
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-full text-[var(--ink-muted)] hover:text-[var(--ink)] transition">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setOpen((o) => !o)} aria-label="Open menu" className="p-2 rounded-full lg:hidden text-[var(--ink-muted)] hover:text-[var(--ink)]">
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden lg:hidden border-t border-[var(--hairline)] bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] backdrop-blur-xl"
          >
            <div className="container-page py-3 flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`px-1 py-3 text-base border-b border-[var(--hairline)] last:border-0 ${pathname === l.href ? "text-[var(--accent)]" : "text-[var(--ink-muted)]"}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
