"use client";
/**
 * MotionCard — small client wrapper that adds the site's standard
 * hover-lift + tap-scale interaction to a card without forcing the
 * parent page out of "server component" mode.
 *
 * - Lift: 2px translateY on hover
 * - Tap: scale 0.995
 * - 220ms, site ease curve
 * - Honors prefers-reduced-motion
 *
 * Layout-neutral wrapper — pass through className so callers can
 * keep the visual styling on the same element that owns the motion.
 */
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function MotionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.22, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
