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
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--hairline)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between h-16">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="font-mono text-[12px] font-semibold tracking-[0.06em] text-[var(--fg)] uppercase">
            Sackett <span className="text-[var(--fg-40)]">/</span> Kavuru
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--fg-40)]">
            — 2028
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[13px] transition-colors ${
                  active
                    ? "text-[var(--fg)]"
                    : "text-[var(--fg-60)] hover:text-[var(--fg)]"
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
            className="p-2 text-[var(--fg-60)] hover:text-[var(--fg)] transition-colors"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link
            href="/platform"
            className="hidden md:inline-flex btn btn-primary !py-2 !px-4 !text-[12px]"
          >
            Platform →
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
            className="p-2 lg:hidden text-[var(--fg-60)] hover:text-[var(--fg)]"
          >
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden lg:hidden border-t border-[var(--hairline)] bg-[var(--bg)]"
          >
            <div className="container-page py-3 flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`px-1 py-3 text-base border-b border-[var(--hairline)] last:border-0 ${
                    pathname === l.href
                      ? "text-[var(--fg)]"
                      : "text-[var(--fg-60)]"
                  }`}
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
