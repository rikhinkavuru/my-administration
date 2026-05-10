"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import JetScene from "./JetScene";
import { CAMERA, type ProgressRef } from "./constants";
import type { Tier } from "./useDeviceTier";

/**
 * R3F Canvas wrapper. Tuned aggressively for performance:
 *  - DPR clamped to <=1.25 even on high tier (4x fewer Retina fragments)
 *  - AA only on high tier
 *  - HDRI Environment dropped (was the single biggest GPU cost)
 *  - Single key directional light + ambient (was 2 directionals)
 *  - powerPreference biases toward dGPU
 */
export default function JetCanvas({
  progressRef,
  tier,
}: {
  progressRef: ProgressRef;
  tier: Tier;
}) {
  const dpr: [number, number] =
    tier === "low" ? [1, 1] : tier === "mid" ? [1, 1] : [1, 1.25];
  const aa = tier === "high";

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: aa,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: CAMERA.POSITION, fov: CAMERA.FOV }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.3}
        color="#FFE7BD"
      />
      <Suspense fallback={null}>
        <JetScene progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
