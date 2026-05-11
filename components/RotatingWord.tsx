"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function RotatingWord({
  words,
  interval = 2400,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (words.length < 2 || reduced) return;
    const id = setInterval(() => setI((p) => (p + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduced]);

  // Invisible placeholder sized to the longest word so layout never jumps.
  const longest = words.reduce((a, b) => (a.length > b.length ? a : b), "");

  // Reduced-motion users (or anyone where useReducedMotion() picks up
  // the OS pref via the site-wide MotionConfig) get a static render —
  // no AnimatePresence, no transform. Avoids the case where the
  // word ends up stuck at opacity 0 on first paint.
  if (reduced) {
    return (
      <span
        className={`relative inline-block align-baseline text-[var(--accent-red)] ${className}`}
        aria-label={words[i]}
      >
        <span className="whitespace-nowrap">{words[i]}</span>
      </span>
    );
  }
  return (
    <span
      className={`relative inline-block overflow-hidden align-baseline text-[var(--accent-red)] ${className}`}
      aria-live="polite"
      aria-label={words[i]}
    >
      {/* Placeholder reserves width + height */}
      <span aria-hidden className="invisible whitespace-nowrap">
        {longest}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          aria-hidden
          className="absolute inset-0 whitespace-nowrap"
          initial={{ y: "110%", opacity: 0, filter: "blur(12px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-110%", opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
