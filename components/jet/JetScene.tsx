"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import F22 from "./F22";
import Flag from "./Flag";
import EngineTrail from "./EngineTrail";
import { FLIGHT, type ProgressRef } from "./constants";

/**
 * Drives the jet group purely from the scroll-progress ref. Zero React state
 * is read here; useFrame samples progressRef.current.progress on every frame
 * and writes directly to Object3D transforms.
 *
 * Smoothstep eases the linear scroll into a more natural acceleration curve.
 */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function smoothstep(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * (3 - 2 * t);
}

export default function JetScene({ progressRef }: { progressRef: ProgressRef }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const raw = progressRef.current?.progress ?? 0;
    const e = smoothstep(raw);

    g.position.x = lerp(FLIGHT.X_START, FLIGHT.X_END, e);
    g.position.y = lerp(FLIGHT.Y_START, FLIGHT.Y_END, e);
    g.position.z =
      FLIGHT.Z_BASE + Math.sin(e * Math.PI) * (FLIGHT.Z_PEAK - FLIGHT.Z_BASE);
    g.rotation.z = FLIGHT.PITCH;
    // Subtle bank wobble keyed to progress (deterministic on backscroll).
    g.rotation.x = Math.sin(e * Math.PI * 3) * FLIGHT.BANK_AMP;
    g.rotation.y = -FLIGHT.YAW_RANGE / 2 + e * FLIGHT.YAW_RANGE;
  });

  return (
    <group ref={groupRef}>
      <F22 />
      <Flag />
      <EngineTrail />
    </group>
  );
}
