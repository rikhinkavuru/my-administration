"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Hero({
  eyebrow,
  title,
  italicAccent,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  italicAccent?: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative border-b border-[var(--hairline)]">
      <div className="container-page pt-28 md:pt-40 pb-20 md:pb-28">
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="eyebrow"
          >
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, delay: 0.1, ease: EASE }}
          className="font-display mt-8 text-[44px] sm:text-[72px] md:text-[112px] lg:text-[140px] max-w-[16ch]"
        >
          {title}
          {italicAccent && (
            <>
              {" "}
              <span className="font-serif-italic text-[var(--fg-60)]">{italicAccent}</span>
            </>
          )}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.32, ease: EASE }}
            className="mt-10 max-w-2xl text-base md:text-lg text-[var(--fg-60)] leading-[1.55]"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.46, ease: EASE }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
