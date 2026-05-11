"use client";
/**
 * HolographicLabel — DEPRECATED in-world variant.
 * ------------------------------------------------
 * The district hero copy used to live INSIDE the 3D scene as a billboarded
 * plane, which meant taller foreground geometry happily occluded the
 * letters at certain camera positions. We now render district hero copy
 * via the DOM HUD layer in `CitySequence` (always on top of the canvas),
 * which guarantees readability across every camera angle and tier.
 *
 * This component is kept as a no-op shim so existing imports in each
 * district file compile and the per-district hero copy continues to flow
 * up to the DOM HUD via the page wrapper. The shim renders nothing.
 */
import type { CityProgressRef } from "../useCityProgress";

export default function HolographicLabel(_: {
  position: [number, number, number];
  kicker: string;
  heading: string;
  body: string;
  pillar?: string;
  progressRef: CityProgressRef;
  visibleRange: [number, number];
}) {
  void _;
  return null;
}
