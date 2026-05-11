"use client";
/**
 * PageTransition — site-wide route fade.
 *
 * Transform + opacity only (was animating `filter: blur`, which is GPU
 * expensive on every route change). Duration 0.35s — sits under the
 * ≤400ms guideline for navigation transitions. Bails entirely for users
 * with `prefers-reduced-motion`.
 */
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  if (reduced) {
    return <>{children}</>;
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
