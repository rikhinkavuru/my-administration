"use client";
import { useEffect, useState } from "react";

export type Tier = "high" | "mid" | "low" | "none";

/**
 * Detects device capability for the jet sequence.
 *
 * - "none" — prefers-reduced-motion is set, or no WebGL: skip the effect entirely.
 * - "low"  — touch device or narrow viewport: render with no HDRI, capped DPR, no AA.
 * - "mid"  — desktop with limited cores: render with HDRI, capped DPR.
 * - "high" — capable desktop: full quality.
 *
 * Detection runs once on mount; tier does not change with viewport resize.
 */
export function useDeviceTier(): Tier {
  const [tier, setTier] = useState<Tier>("high");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTier("none");
      return;
    }

    // WebGL availability check
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2") ||
      probe.getContext("webgl") ||
      probe.getContext("experimental-webgl");
    if (!gl) {
      setTier("none");
      return;
    }

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isNarrow = window.innerWidth < 768;
    if (isTouch || isNarrow) {
      setTier("low");
      return;
    }

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory =
      ((navigator as unknown as { deviceMemory?: number }).deviceMemory) ?? 4;

    if (cores >= 8 && memory >= 8) setTier("high");
    else if (cores >= 4) setTier("mid");
    else setTier("low");
  }, []);

  return tier;
}
