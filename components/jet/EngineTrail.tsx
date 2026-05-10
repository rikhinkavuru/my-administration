"use client";
import * as THREE from "three";
import { COLORS } from "./constants";

/**
 * Static additive-blended exhaust cones attached to the jet group, so they
 * scale and translate with the jet for free — zero per-frame CPU.
 *
 * Replaces three drei <Trail>s, which rebuilt thick-line geometry every
 * frame and were the heaviest CPU cost in the previous setup. Each cone
 * has its apex at the engine nozzle and base extending backward, opening
 * outward to suggest the afterburner plume.
 *
 * Two-layer per nozzle: outer wider orange glow + inner narrower hot core.
 */
export default function EngineTrail() {
  const sharedAfter = {
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  } as const;

  return (
    <group>
      {/* RIGHT engine: outer orange plume */}
      <mesh position={[-3.55, -0.05, 0.18]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.28, 1.9, 12, 1, true]} />
        <meshBasicMaterial color={COLORS.afterburnerOrange} opacity={0.42} {...sharedAfter} />
      </mesh>
      {/* RIGHT engine: inner hot core */}
      <mesh position={[-3.05, -0.05, 0.18]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.1, 1.1, 8, 1, true]} />
        <meshBasicMaterial color={COLORS.trailInner} opacity={0.7} {...sharedAfter} />
      </mesh>

      {/* LEFT engine: outer orange plume */}
      <mesh position={[-3.55, -0.05, -0.18]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.28, 1.9, 12, 1, true]} />
        <meshBasicMaterial color={COLORS.afterburnerOrange} opacity={0.42} {...sharedAfter} />
      </mesh>
      {/* LEFT engine: inner hot core */}
      <mesh position={[-3.05, -0.05, -0.18]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.1, 1.1, 8, 1, true]} />
        <meshBasicMaterial color={COLORS.trailInner} opacity={0.7} {...sharedAfter} />
      </mesh>

      {/* Long faint smoke wash trailing further behind */}
      <mesh position={[-4.6, -0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.55, 2.2, 10, 1, true]} />
        <meshBasicMaterial
          color={COLORS.trailOuter}
          opacity={0.18}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
