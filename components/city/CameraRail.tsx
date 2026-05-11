"use client";
/**
 * CameraRail
 * ----------
 * Drives the single PerspectiveCamera along a baked CatmullRomCurve3 spline
 * keyed off the scroll-progress ref. Two parallel curves are sampled per
 * frame:
 *   - `path` — camera position
 *   - `look` — camera lookAt target (slightly ahead of the path so the
 *     camera "leads" into corners cinematically)
 *
 * Smoothed with a fixed-step lerp on the read side so micro-jitter from
 * Lenis scroll deltas never makes it onto the camera transform.
 *
 * The first ~8% of progress is dedicated to the doors set piece — the
 * camera holds near origin and dollies slowly forward (it does NOT yet
 * enter the city; the doors part to reveal it). After that the camera
 * eases through districts D1..D6 (Economy, Energy, Healthcare, Education,
 * Defense, Immigration) and finally rises into an aerial pull-back.
 */
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { CityProgressRef } from "./useCityProgress";

export const DISTRICT_Z = {
  // Center Z of each district. Camera path threads through these.
  ECONOMY: -160,
  ENERGY: -320,
  HEALTHCARE: -480,
  EDUCATION: -640,
  DEFENSE: -800,
  IMMIGRATION: -960,
} as const;

/**
 * Door-zone end (in progress units). The doors choreography reads progress
 * in [0, DOOR_END]; the city camera curve starts being sampled after.
 */
export const DOOR_END = 0.08;
export const FINALE_START = 0.92;

// --- Spline construction -------------------------------------------------
// One CatmullRomCurve3 carrying the camera through the doors, every
// district, and up into the finale. Banking handled by lookAt offsets,
// not roll — orthographic stability beats showy banking on a typographic
// site.
const PATH_POINTS: [number, number, number][] = [
  // Doors approach — wide cinematic establishing shot. Start far back
  // and elevated so the doors read as a MONUMENT against sky/ground
  // (the previous start was so close it cropped the doors edge-on).
  // Dolly forward + descend through the widening seam as scroll
  // progresses.
  [0, 16, 95], // wide establishing — see full door silhouette + horizon
  [0, 9, 32],  // mid-approach — doors now dominant in frame
  [0, 5, -10], // passing through the threshold (doors fully open)
  // Economy district (financial canyons)
  [-12, 5, -90],
  [-4, 7, -160], // economy hero
  [10, 6, -220],
  // Energy district (smokestacks -> clean)
  [18, 6, -280],
  [12, 8, -340], // energy hero, slight rise
  [-2, 7, -400],
  // Healthcare (glowing medical towers)
  [-14, 9, -460],
  [-8, 10, -510], // healthcare hero
  [4, 8, -560],
  // Education (research campus + Capitol)
  [14, 7, -610],
  [6, 9, -660], // education hero
  [-6, 8, -710],
  // Defense (command mesa)
  [-16, 10, -770],
  [-8, 11, -820], // defense hero
  [6, 10, -870],
  // Immigration / port-of-entry
  [14, 9, -930],
  [4, 11, -980], // immigration hero
  // Finale: gentle rise above the skyline — was a steep 11→100 climb
  // across just 160m which felt clunky. New profile rises more
  // gradually with the same final aerial vantage point.
  [0, 18, -1010],
  [0, 38, -1070],
  [0, 72, -1160], // far aerial pull-back
];

// Look-ahead points: where the camera is gazing at each path sample. We
// build this as a separate curve and sample with a small forward offset
// so the camera "leads" into turns instead of locking to its own position.
const LOOK_POINTS: [number, number, number][] = [
  // Wide establishing — look at the seam-area (y=16 on doors group).
  [0, 14, 0],
  [0, 12, -10],
  [0, 6, -40],
  // economy
  [-4, 5, -140],
  [4, 6, -200],
  [14, 6, -260],
  // energy
  [16, 7, -320],
  [4, 8, -390],
  [-8, 7, -440],
  // healthcare
  [-10, 9, -500],
  [-2, 10, -540],
  [10, 8, -600],
  // education
  [10, 8, -650],
  [-2, 9, -700],
  [-12, 8, -750],
  // defense
  [-12, 10, -810],
  [0, 11, -860],
  [12, 10, -910],
  // immigration
  [10, 9, -970],
  [-4, 11, -1020],
  // finale: look down and forward at the skyline behind us
  [-2, 14, -900],
  [0, 8, -500],
  [0, 4, 0],
];

const PATH_VECTORS = PATH_POINTS.map((p) => new THREE.Vector3(...p));
const LOOK_VECTORS = LOOK_POINTS.map((p) => new THREE.Vector3(...p));

export default function CameraRail({
  progressRef,
}: {
  progressRef: CityProgressRef;
}) {
  const { camera } = useThree();
  const pathCurve = useMemo(
    () => new THREE.CatmullRomCurve3(PATH_VECTORS, false, "catmullrom", 0.5),
    [],
  );
  const lookCurve = useMemo(
    () => new THREE.CatmullRomCurve3(LOOK_VECTORS, false, "catmullrom", 0.5),
    [],
  );

  // Reusable vectors — never allocate inside useFrame.
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3(0, 3, 60));
  const currentLook = useRef(new THREE.Vector3(0, 3, 0));

  useFrame(() => {
    const raw = progressRef.current?.progress ?? 0;
    // Drive the camera with explicit travel + DWELL segments. Each
    // segment maps a scroll-progress window [p0,p1] to a curve-parameter
    // range [u0,u1]; when u0 === u1 the camera HOLDS at a hero stop so
    // the viewer can read the HUD copy without the scene drifting past.
    //
    // Travels use smoothstep easing so the camera arrives gently into
    // the dwell rather than slamming to a stop.
    //
    // 16 segments mapped over 100% of scroll:
    //   doors travel  (8)  → threshold dwell (6)
    //   travel (4) → Economy dwell (8)
    //   travel (4) → Energy dwell (8)
    //   travel (4) → Healthcare dwell (8)
    //   travel (4) → Education dwell (8)
    //   travel (4) → Defense dwell (8)
    //   travel (4) → Immigration dwell (8)
    //   travel (6) → Finale dwell (8)
    type Segment = { p0: number; p1: number; u0: number; u1: number };
    const SEGMENTS: Segment[] = [
      { p0: 0.00, p1: DOOR_END, u0: 0.00, u1: 0.11 }, // through doors
      { p0: DOOR_END, p1: 0.14, u0: 0.11, u1: 0.11 }, // dwell at reveal
      { p0: 0.14, p1: 0.18, u0: 0.11, u1: 0.21 },     // travel to Economy
      { p0: 0.18, p1: 0.26, u0: 0.21, u1: 0.21 },     // Economy dwell
      { p0: 0.26, p1: 0.30, u0: 0.21, u1: 0.34 },     // travel to Energy
      { p0: 0.30, p1: 0.38, u0: 0.34, u1: 0.34 },     // Energy dwell
      { p0: 0.38, p1: 0.42, u0: 0.34, u1: 0.46 },     // travel to Healthcare
      { p0: 0.42, p1: 0.50, u0: 0.46, u1: 0.46 },     // Healthcare dwell
      { p0: 0.50, p1: 0.54, u0: 0.46, u1: 0.59 },     // travel to Education
      { p0: 0.54, p1: 0.62, u0: 0.59, u1: 0.59 },     // Education dwell
      { p0: 0.62, p1: 0.66, u0: 0.59, u1: 0.72 },     // travel to Defense
      { p0: 0.66, p1: 0.74, u0: 0.72, u1: 0.72 },     // Defense dwell
      { p0: 0.74, p1: 0.78, u0: 0.72, u1: 0.85 },     // travel to Immigration
      { p0: 0.78, p1: 0.84, u0: 0.85, u1: 0.85 },     // Immigration dwell
      { p0: 0.84, p1: 1.00, u0: 0.85, u1: 1.00 },     // SLOW finale rise
    ];
    let u = SEGMENTS[SEGMENTS.length - 1].u1;
    for (let i = 0; i < SEGMENTS.length; i++) {
      const s = SEGMENTS[i];
      if (raw >= s.p0 && raw <= s.p1) {
        const span = Math.max(0.0001, s.p1 - s.p0);
        let t = (raw - s.p0) / span;
        if (s.u0 !== s.u1) {
          // Finale travel uses an ease-out (slow at end) so the camera
          // floats to its final aerial vantage instead of snapping.
          // All other travels use a balanced smoothstep.
          if (i === SEGMENTS.length - 1) {
            const inv = 1 - t;
            t = 1 - inv * inv * inv;
          } else {
            t = t * t * (3 - 2 * t);
          }
        }
        u = s.u0 + (s.u1 - s.u0) * t;
        break;
      }
    }
    u = Math.min(1, Math.max(0, u));

    pathCurve.getPointAt(u, tmpPos.current);
    lookCurve.getPointAt(u, tmpLook.current);

    // Smooth toward target. 0.12 ≈ "expensive butter" — enough damping
    // that scroll micro-jitter from Lenis doesn't show on the camera.
    currentPos.current.lerp(tmpPos.current, 0.18);
    currentLook.current.lerp(tmpLook.current, 0.18);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}
