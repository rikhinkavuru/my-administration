"use client";
/**
 * Finale: the wordmark itself is rendered in the DOM HUD (CitySequence) so
 * it's CSS-clamped and always fits the viewport. This scene-level Finale
 * now only contributes a soft warm light spill behind the camera so the
 * sky reads dramatically during the aerial pull-back, without competing
 * world-space type that overflows on narrow viewports.
 */
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { CityProgressRef } from "./useCityProgress";
import { FINALE_START } from "./CameraRail";

export default function Finale({ progressRef }: { progressRef: CityProgressRef }) {
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const light = lightRef.current;
    if (!light) return;
    const p = progressRef.current?.progress ?? 0;
    const t = Math.max(0, Math.min(1, (p - FINALE_START) / (1 - FINALE_START)));
    // smoothstep
    light.intensity = (t * t * (3 - 2 * t)) * 18;
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 80, -1080]}
      intensity={0}
      color="#FFD8A0"
      distance={600}
      decay={1.2}
    />
  );
}
