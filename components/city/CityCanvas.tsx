"use client";
/**
 * R3F Canvas wrapper for the platform city journey.
 *
 * Render pipeline:
 *  - ACES Filmic tone mapping at exposure 1.0 — clean whites, rich blacks.
 *  - sRGB output color space.
 *  - PCF soft shadow map (high tier only) so the sun casts believable
 *    architectural shadows without shimmering edges.
 *  - High-tier post: a SMALL bloom (windows + emissives only, not the whole
 *    frame) + an almost-imperceptible vignette to keep the corners
 *    grounded without darkening the scene.
 *
 * Mid/low tiers ship no postprocessing — the lighting/material upgrade is
 * what makes the scene read cinematically, not the bloom stack.
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
    tier === "low" ? [1, 1] : tier === "mid" ? [1, 1.25] : [1, 1.5];
  const aa = tier === "high";
  return (
    <Canvas
      dpr={dpr}
      shadows={tier === "high"}
      gl={{
        antialias: aa,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        if (tier === "high") {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }
      }}
      camera={{ position: [0, 3, 60], fov: 50, near: 0.5, far: 6000 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <CityScene progressRef={progressRef} />
        {tier === "high" && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <SMAA />
            <Bloom
              intensity={0.32}
              luminanceThreshold={0.95}
              luminanceSmoothing={0.25}
              mipmapBlur
            />
            <Vignette
              offset={0.55}
              darkness={0.12}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
