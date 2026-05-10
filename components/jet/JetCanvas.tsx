"use client";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense } from "react";
import JetScene from "./JetScene";
import { CAMERA, type ProgressRef } from "./constants";
import type { Tier } from "./useDeviceTier";

/**
 * R3F Canvas wrapper. DPR, AA, HDRI, and lighting intensity are tuned per
 * tier so weak GPUs/mobile devices stay smooth.
 *
 * powerPreference: "high-performance" hints to the browser to use the
 * dGPU on dual-GPU laptops. CSS `contain: strict` on the parent overlay
 * isolates layout/paint.
 */
export default function JetCanvas({
  progressRef,
  tier,
}: {
  progressRef: ProgressRef;
  tier: Tier;
}) {
  const dpr: [number, number] =
    tier === "low" ? [1, 1] : tier === "mid" ? [1, 1.2] : [1, 1.5];
  const useEnv = tier === "high" || tier === "mid";

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: tier !== "low",
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: CAMERA.POSITION, fov: CAMERA.FOV }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={tier === "low" ? 0.7 : 0.5} />
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.2}
        color="#FFE7BD"
      />
      <directionalLight
        position={[-5, -3, -2]}
        intensity={0.4}
        color="#7B98D6"
      />
      <Suspense fallback={null}>
        {useEnv && <Environment preset="sunset" />}
        <JetScene progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
