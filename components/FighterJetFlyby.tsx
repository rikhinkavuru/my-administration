"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const FighterJet3D = dynamic(() => import("./FighterJet3D"), {
  ssr: false,
  loading: () => null,
});

const SESSION_KEY = "skj-jet-flyby-v3-played";

/**
 * Plays a one-time per-session F-22 flyby (3D, with American flag streaming
 * from the tail and a layered fire trail) when the user scrolls past ~55% of
 * the first viewport on the landing page.
 *
 * - Trigger: scrollY > 0.55 * innerHeight.
 * - Once-per-session: gated by sessionStorage; new tabs replay it.
 * - Honors prefers-reduced-motion (skipped).
 */
export default function FighterJetFlyby() {
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      /* sessionStorage unavailable; fall through and arm */
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    let triggered = false;
    const onScroll = () => {
      if (triggered) return;
      if (window.scrollY > window.innerHeight * 0.55) {
        triggered = true;
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
        setPlaying(true);
        // Total render lifespan slightly longer than animation so the trails fade.
        setTimeout(() => setPlaying(false), 5400);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [armed]);

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key="jet3d-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          aria-hidden
          className="fixed inset-0 z-[60] pointer-events-none"
        >
          <FighterJet3D />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
