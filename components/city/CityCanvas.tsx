"use client";
/**
 * R3F Canvas wrapper for the platform city journey. ACES tone mapping +
 * sRGB output give the warm/cool palette room to breathe. On `tier === "high"`
 * we mount a SMALL bloom + a tasteful vignette via @react-three/postprocessing
 * so emissive windows actually glow; mid/low skip postprocessing entirely.
 */
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  Vignette,
  SMAA,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
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
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      camera={{ position: [0, 3, 60], fov: 55, near: 0.5, far: 4500 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <CityScene progressRef={progressRef} />
        {tier === "high" && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <SMAA />
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
            <Vignette
              offset={0.5}
              darkness={0.35}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
