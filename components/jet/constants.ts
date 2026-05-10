/**
 * Single source of truth for jet flight choreography. All scroll-linked
 * motion reads from these constants so visual tuning happens in one place.
 */

export const FLIGHT = {
  // X position in scene units across the scroll progress 0..1.
  // Range tightened so the jet spends more of the progress on-screen,
  // which combined with the wider scroll-trigger range below makes the
  // pass feel noticeably slower.
  X_START: -13,
  X_END: 13,
  // Y climb across the section. Raised so the jet crosses the upper third
  // of the viewport rather than the lower third.
  Y_START: -0.4,
  Y_END: 2.6,
  // Z parallax — jet dips closer to camera at midpoint for perspective bump.
  // Pushed further back so the jet reads smaller overall.
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
