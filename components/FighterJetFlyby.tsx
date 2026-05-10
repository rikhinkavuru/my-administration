"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FighterJet from "./FighterJet";

const SESSION_KEY = "skj-jet-flyby-played";

/**
 * Plays a one-time per-session fighter-jet flyby across the viewport when
 * the user scrolls past ~55% of the first viewport on the landing page.
 *
 * - Trigger: scrollY > 0.55 * innerHeight (after first paint).
 * - Once-per-session: gated by sessionStorage; new tabs replay it.
 * - Honors prefers-reduced-motion (skipped).
 * - The jet enters from the left, climbs and banks slightly, exits to
 *   the right over ~4.6s with perspective scale, dragging twin contrails.
 */
export default function FighterJetFlyby() {
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      /* sessionStorage may be unavailable; fall through and arm anyway */
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
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [armed]);

  return (
    <AnimatePresence>
      {playing && (
        <div
          key="jet-overlay"
          aria-hidden
          className="fixed inset-0 z-[60] pointer-events-none overflow-hidden"
        >
          <motion.div
            initial={{ x: "-25vw", y: 10, rotate: -2.4, scale: 0.86 }}
            animate={{
              x: ["-25vw", "22vw", "68vw", "108vw"],
              y: [10, -8, -22, -38],
              rotate: [-2.4, 0.4, 1.2, 1.8],
              scale: [0.86, 1.04, 1.0, 0.93],
            }}
            transition={{
              duration: 4.6,
              times: [0, 0.42, 0.86, 1],
              ease: "linear",
            }}
            onAnimationComplete={() => setPlaying(false)}
            style={{
              position: "absolute",
              top: "30%",
              left: 0,
              transformOrigin: "center",
              willChange: "transform",
            }}
            className="w-[clamp(360px,55vw,640px)]"
          >
            <FighterJet />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
