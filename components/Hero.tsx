"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function Hero({
  eyebrow,
  title,
  subtitle,
  children,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  const ease = [0.16, 1, 0.3, 1] as const;
  return (
    <section
      className={`relative border-b border-[var(--hairline)] ${
        align === "center" ? "text-center" : ""
      }`}
    >
      <div
        className={`container-page pt-24 pb-20 md:pt-36 md:pb-28 ${
          align === "center" ? "flex flex-col items-center" : ""
        }`}
      >
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="smallcaps"
          >
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.1, ease }}
          className="font-display mt-6 text-[44px] sm:text-6xl md:text-[80px] leading-[0.98] font-medium tracking-[-0.02em] max-w-[18ch]"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.32, ease }}
            className="mt-7 max-w-2xl text-lg text-[var(--ink-muted)] leading-[1.65]"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.46, ease }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
