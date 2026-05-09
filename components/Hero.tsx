"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function Hero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  const words = title.split(" ");
  return (
    <section className="relative hero-radial grain border-b border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-32">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] md:text-xs uppercase tracking-[0.35em] text-[var(--accent)] mb-6"
          >
            {eyebrow}
          </motion.div>
        )}
        <h1 className="text-5xl md:text-7xl lg:text-[88px] leading-[0.95] font-semibold tracking-tight">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-[0.25em]"
            >
              {w}
            </motion.span>
          ))}
        </h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 max-w-2xl text-lg md:text-xl text-[var(--fg-muted)] leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
