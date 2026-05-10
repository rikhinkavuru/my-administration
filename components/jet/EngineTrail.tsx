"use client";
import { Trail } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { COLORS } from "./constants";

/**
 * Three concentric drei <Trail> components emitted from the engine exhaust.
 * Outer dusky smoke -> mid orange flame -> white-hot core. Each tracks an
 * invisible point at the same world position; drei uses world coordinates
 * by default so the trail is anchored to the screen, not the moving group.
 */
export default function EngineTrail() {
  const t1 = useRef<THREE.Mesh>(null);
  const t2 = useRef<THREE.Mesh>(null);
  const t3 = useRef<THREE.Mesh>(null);

  return (
    <>
      <Trail
        width={2.6}
        length={12}
        color={COLORS.trailOuter}
        decay={1.4}
        attenuation={(x) => x}
      >
        <mesh ref={t1} position={[-2.7, -0.05, 0]} visible={false}>
          <sphereGeometry args={[0.04, 4, 4]} />
        </mesh>
      </Trail>
      <Trail
        width={1.4}
        length={8}
        color={COLORS.trailMid}
        decay={1.0}
        attenuation={(x) => x * x}
      >
        <mesh ref={t2} position={[-2.7, -0.05, 0]} visible={false}>
          <sphereGeometry args={[0.04, 4, 4]} />
        </mesh>
      </Trail>
      <Trail
        width={0.55}
        length={5}
        color={COLORS.trailInner}
        decay={0.85}
        attenuation={(x) => x * x}
      >
        <mesh ref={t3} position={[-2.7, -0.05, 0]} visible={false}>
          <sphereGeometry args={[0.04, 4, 4]} />
        </mesh>
      </Trail>
    </>
  );
}
