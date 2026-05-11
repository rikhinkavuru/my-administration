"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Menu, X } from "./Icons";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

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
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "bg-[var(--bg)]/85 backdrop-blur-xl border-b border-[var(--hairline)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between h-16">
        {/* Wordmark */}
        <Link href="/" className="flex items-baseline gap-2.5 group" aria-label="Sackett / Kavuru 2028 — home">
          <span className="relative flex items-center">
            <span
              aria-hidden
              className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-red)] pulse-dot"
            />
            <span className="font-mono text-[12px] font-semibold tracking-[0.08em] text-[var(--fg)] uppercase">
              Sackett <span className="text-[var(--accent-red)] mx-0.5">/</span> Kavuru
            </span>
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--fg-40)] hidden sm:inline">
            — 2028
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                data-active={active}
                aria-current={active ? "page" : undefined}
                className={`link-underline text-[13px] tracking-[-0.005em] transition-colors duration-200 ${
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

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle color theme"
            className="relative p-2 text-[var(--fg-60)] hover:text-[var(--fg)] transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <Link
            href="/platform"
            className="hidden md:inline-flex btn btn-primary !py-2 !px-4 !text-[12px]"
          >
            Platform <span aria-hidden>→</span>
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="p-2 lg:hidden text-[var(--fg-60)] hover:text-[var(--fg)]"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="origin-left h-px w-full bg-[var(--accent-red)]"
      />

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden lg:hidden border-t border-[var(--hairline)] bg-[var(--bg)]"
          >
            <div className="container-page py-3 flex flex-col">
              {links.map((l, i) => {
                const active = pathname === l.href;
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.03 + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-1 py-3.5 text-base border-b border-[var(--hairline)] last:border-0 ${
                        active ? "text-[var(--fg)]" : "text-[var(--fg-60)]"
                      }`}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {l.label}
                      </span>
                      {active && (
                        <span className="font-mono text-[10px] text-[var(--accent-red)] tracking-[0.06em] uppercase">
                          Here
                        </span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
