/**
 * Single source of truth for jet flight choreography. All scroll-linked
 * motion reads from these constants so visual tuning happens in one place.
 */

export const FLIGHT = {
  // X range tightened so the jet's center stays inside the visible
  // horizontal frustum for ~95% of progress — jet enters near the left
  // edge and exits near the right edge rather than starting/ending far
  // off-screen.
  X_START: -11,
  X_END: 11,
  // Y range deliberately wide. Jet starts in the lower-left of the
  // viewport and finishes in the upper-right, so as the user scrolls
  // (which moves the surrounding page content up past the fixed canvas)
  // the jet's straight-line path reads as a long diagonal sweep.
  Y_START: -3.5,
  Y_END: 3.5,
  // Z parallax — jet dips closer to camera at midpoint for perspective bump.
  Z_BASE: -3.5,
  Z_PEAK: -1.0,
  // Static pitch (nose up) as it climbs.
  PITCH: 0.04,
  // Bank wobble amplitude (radians).
  BANK_AMP: 0.05,
  // Yaw range across full progress.
  YAW_RANGE: 0.14,
  // Uniform scale of the jet group. Smaller = jet reads further away.
  SCALE: 0.4,
} as const;

export const CAMERA = {
  POSITION: [0, 2, 22] as [number, number, number],
  FOV: 28,
} as const;

/** F-22 "Have Glass V" livery + cinematic accent palette. */
export const COLORS = {
  body: "#5C6970",
  bodyLight: "#788390",
  cockpit: "#C9A55E",
  cockpitEmissive: "#3A2A0F",
  nozzle: "#1F1B17",
  intake: "#0F1014",
  insignia: "#B22234",
  afterburnerOrange: "#FF8C42",
  afterburnerBlue: "#5DBFFF",
  trailOuter: "#3A1A12",
  trailMid: "#E04D1F",
  trailInner: "#FFE9A8",
} as const;

export type ProgressRef = { current: { progress: number } };
