"use client";
/**
 * R3F Canvas wrapper for the platform city journey. Same conservative
 * settings as the jet sequence: clamped DPR, no shadows, antialias only
 * when we can afford it.
 */
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CityScene from "./CityScene";
import type { CityProgressRef } from "./useCityProgress";
import type { Tier } from "../jet/useDeviceTier";

export default function CityCanvas({
  progressRef,
  tier,
}: {
  progressRef: CityProgressRef;
  tier: Tier;
}) {
  const dpr: [number, number] =
    tier === "low" ? [1, 1] : tier === "mid" ? [1, 1.1] : [1, 1.25];
  const aa = tier === "high";
  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: aa,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{ position: [0, 3, 60], fov: 55, near: 0.5, far: 1800 }}
      style={{ width: "100%", height: "100%", background: "#000" }}
    >
      <Suspense fallback={null}>
        <CityScene progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
