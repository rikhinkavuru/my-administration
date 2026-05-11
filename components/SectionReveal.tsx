"use client";
/**
 * SectionReveal — site-wide scroll-reveal wrapper.
 *
 * Transform + opacity ONLY (no filter blur — animating filter forces a
 * GPU compositor repaint every frame and shows up as jank on mid-range
 * devices). Duration tuned to 0.5s per the UI-UX-Pro-Max §7 animation
 * rules (`duration-timing`: ≤400ms ideal, ≤500ms tolerated for editorial
 * reveals). Honors `prefers-reduced-motion` by rendering children with
 * no animation wrapper at all.
 */
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function SectionReveal({
  children,
  delay = 0,
  className = "",
  y = 16,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
