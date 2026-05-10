/**
 * Single source of truth for jet flight choreography. All scroll-linked
 * motion reads from these constants so visual tuning happens in one place.
 */

export const FLIGHT = {
  // X range tightened further: jet's center stays inside the visible
  // horizontal frustum for nearly all of progress.
  X_START: -10,
  X_END: 10,
  // Straight-line screen path. Math derivation:
  //   - Canvas is position:fixed, so screen_y(t) = camera_project(jet_world_y(t)).
  //     There is no additional scroll-derived term.
  //   - Visible scene height at z = -3.5 with camera (z=22, fov=28°):
  //       distance      = 22 - (-3.5) = 25.5
  //       visibleHeight = 25.5 * 2 * tan(14°) ≈ 12.7 scene units
  //     so 1 scene unit ≈ viewport_h / 12.7 (≈ 63 px on a 800-px viewport).
  //   - For the jet to render as a flat horizontal line in screen space,
  //     d(screen_y) / d(progress) must equal zero, i.e. Y_START === Y_END.
  //     Any nonzero gap reintroduces visible vertical motion scaled by
  //     ~63 px per scene unit, which is what produced the previous
  //     diagonal sweep.
  // Aggressive upward climb. Jet enters from below the viewport at the
  // bottom-left and exits above at the top-right; mid-progress sweeps it
  // through the visible Y window for a steep climbing pass.
  Y_START: -10,
  Y_END: 10,
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
  // Reduced further: 0.32 -> 0.24 (~25 percent smaller again).
  SCALE: 0.24,
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
