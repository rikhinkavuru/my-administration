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
  // Doors approach (progress 0 -> ~0.08) — start much closer to the
  // doors so they read as MONUMENTAL geometry rather than small props
  // in the void. The camera dollies forward and pushes through the
  // widening seam.
  [0, 4, 26], // start: just in front of the seam, low + close
  [0, 4, 10], // approaching the seam
  [0, 4, -8], // passing through the threshold (doors fully open)
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
  // Finale: rise above the skyline
  [-4, 26, -1020],
  [0, 60, -1080], // wide pull-back
  [0, 100, -1140], // far aerial
];

// Look-ahead points: where the camera is gazing at each path sample. We
// build this as a separate curve and sample with a small forward offset
// so the camera "leads" into turns instead of locking to its own position.
const LOOK_POINTS: [number, number, number][] = [
  [0, 4, 0],
  [0, 4, -20],
  [0, 4, -40],
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
    // Drive the camera by stop-keyed segments so each district owns the
    // intended slice of scroll, regardless of catmullrom arc-length.
    // STOPS maps a progress key to a curve `u` parameter chosen so the
    // camera sits at the appropriate hero position inside the district.
    const STOPS: [number, number][] = [
      [0.0, 0.0], // entry
      [DOOR_END, 0.11], // doors fully open, just past threshold
      [0.18, 0.21], // economy hero (path idx 4)
      [0.32, 0.34], // energy hero (path idx 7)
      [0.48, 0.46], // healthcare hero (path idx 10)
      [0.62, 0.59], // education hero (path idx 13)
      [0.76, 0.72], // defense hero (path idx 16)
      [0.88, 0.85], // immigration hero (path idx 19)
      [0.96, 0.95], // finale rise
      [1.0, 1.0], // far aerial
    ];
    let u = 0;
    for (let i = 0; i < STOPS.length - 1; i++) {
      const [pa, ua] = STOPS[i];
      const [pb, ub] = STOPS[i + 1];
      if (raw >= pa && raw <= pb) {
        const t = (raw - pa) / (pb - pa || 1);
        u = ua + (ub - ua) * t;
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
