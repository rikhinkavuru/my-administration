"use client";
import { useEffect, useState } from "react";

/**
 * Shared capability probe for the 3D moments. Returns one of:
 *   - "off"     — prefers-reduced-motion is set; render the static fallback.
 *   - "mobile"  — coarse pointer or narrow viewport; render a simplified
 *                 (lower-perspective, no scroll-pin) version.
 *   - "full"    — desktop with fine pointer; full 3D choreography.
 *
 * Detection runs once on mount. Mirrors the jet sequence's tier model so
 * a11y + perf behavior stays consistent across moments.
 */
export type Motion3DMode = "off" | "mobile" | "full";

export function useMotion3DMode(): Motion3DMode {
  const [mode, setMode] = useState<Motion3DMode>("full");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("off");
      return;
    }
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 768;
    if (coarse || narrow) {
      setMode("mobile");
      return;
    }
    setMode("full");
  }, []);

  return mode;
}
