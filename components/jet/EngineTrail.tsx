"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { COLORS } from "./constants";

/**
 * Animated additive-blended exhaust cones attached to the jet group.
 *
 * A single useFrame walks the cone children once per frame and writes
 * scale + material opacity directly to the Object3D / Material instances
 * (no React state, no re-renders). Each cone gets a unique phase via its
 * userData.phase so the flicker reads as turbulent flame rather than a
 * synchronized pulse.
 *
 * Two-layer per nozzle (outer orange plume + inner hot core) plus a long
 * faint smoke wash trailing further behind.
 */
export default function EngineTrail() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = groupRef.current;
    if (!g) return;
    for (let i = 0; i < g.children.length; i++) {
      const child = g.children[i] as THREE.Mesh;
      const ud = child.userData as { phase?: number; baseOpacity?: number };
      const phase = ud.phase ?? 0;
      // Length flicker (faster) + width flicker (slower)
      const len = 1 + Math.sin(t * 14 + phase) * 0.22 + Math.sin(t * 31 + phase * 1.7) * 0.07;
      const wid = 1 + Math.sin(t * 9 + phase * 1.7) * 0.10;
      child.scale.set(wid, len, wid);
      const mat = child.material as THREE.MeshBasicMaterial;
      const base = ud.baseOpacity ?? 0.4;
      mat.opacity = base * (0.78 + Math.sin(t * 18 + phase * 1.3) * 0.22);
    }
  });

  const sharedAdd = {
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  } as const;

  return (
    <group ref={groupRef}>
      {/* RIGHT engine: outer orange plume */}
      <mesh
        position={[-3.55, -0.05, 0.18]}
        rotation={[0, 0, -Math.PI / 2]}
        userData={{ phase: 0.0, baseOpacity: 0.45 }}
      >
        <coneGeometry args={[0.28, 1.9, 12, 1, true]} />
        <meshBasicMaterial color={COLORS.afterburnerOrange} opacity={0.45} {...sharedAdd} />
      </mesh>
      {/* RIGHT engine: inner hot core */}
      <mesh
        position={[-3.05, -0.05, 0.18]}
        rotation={[0, 0, -Math.PI / 2]}
        userData={{ phase: 0.9, baseOpacity: 0.72 }}
      >
        <coneGeometry args={[0.1, 1.1, 8, 1, true]} />
        <meshBasicMaterial color={COLORS.trailInner} opacity={0.72} {...sharedAdd} />
      </mesh>

      {/* LEFT engine: outer orange plume */}
      <mesh
        position={[-3.55, -0.05, -0.18]}
        rotation={[0, 0, -Math.PI / 2]}
        userData={{ phase: 1.7, baseOpacity: 0.45 }}
      >
        <coneGeometry args={[0.28, 1.9, 12, 1, true]} />
        <meshBasicMaterial color={COLORS.afterburnerOrange} opacity={0.45} {...sharedAdd} />
      </mesh>
      {/* LEFT engine: inner hot core */}
      <mesh
        position={[-3.05, -0.05, -0.18]}
        rotation={[0, 0, -Math.PI / 2]}
        userData={{ phase: 2.4, baseOpacity: 0.72 }}
      >
        <coneGeometry args={[0.1, 1.1, 8, 1, true]} />
        <meshBasicMaterial color={COLORS.trailInner} opacity={0.72} {...sharedAdd} />
      </mesh>

      {/* Long faint smoke wash trailing behind both engines.
          Shortened so the cone tip stays clear of the campaign banner that
          trails further back at local x ≈ -7. Prevents additive-blend
          flame from bleeding into the cloth. */}
      <mesh
        position={[-4.4, -0.05, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        userData={{ phase: 3.3, baseOpacity: 0.18 }}
      >
        <coneGeometry args={[0.45, 1.6, 10, 1, true]} />
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
