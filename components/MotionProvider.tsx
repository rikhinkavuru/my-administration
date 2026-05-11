"use client";
/**
 * MotionProvider — site-wide framer-motion config.
 *
 * Sets `reducedMotion="user"` so every motion component anywhere in the
 * tree automatically respects the OS-level `prefers-reduced-motion`
 * setting. With this in place, individual motion components don't each
 * need their own `useReducedMotion()` guard — framer-motion drops
 * transform-distance animations (y/x/scale/rotate) and keeps only
 * opacity for users who request reduced motion.
 */
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
