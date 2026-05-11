"use client";
/**
 * Doors
 * -----
 * Two clean monumental panels that part to reveal the city corridor.
 *
 * Intentionally stripped of the previous 3D wordmark / kicker /
 * floating motes — those rendered as billboards in world space that
 * the camera flew past at clipping angles ("EPLA FO" half-cropped by
 * buildings was the worst offender). The title card is now owned by
 * the DOM intro overlay in CitySequence, which is what 2D titles
 * should be.
 *
 * What's still here:
 *  - Two PBR-shaded panels with polished steel inner-edge chamfer.
 *  - A thin red light line down each inner seam.
 *  - A warm volumetric beam in the widening gap.
 *  - An off-camera warm point light at the seam.
 *
 * Motion: easeInOutQuint over [0, DOOR_END]. After DOOR_END the
 * panels keep accelerating out of frame so they don't clip behind
 * geometry.
 */
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { CityProgressRef } from "./useCityProgress";
import { DOOR_END } from "./CameraRail";

const DOOR_W = 18;
const DOOR_H = 36;
const DOOR_D = 1.6;
const GROOVE_Y = DOOR_H * 0.16;

function easeInOutQuint(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function DoorPanel({
  side,
  groupRef,
}: {
  side: -1 | 1;
  groupRef: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group ref={groupRef}>
      {/* Main slab — dark anodized face */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[DOOR_W, DOOR_H, DOOR_D]} />
        <meshStandardMaterial
          color="#1A1B1F"
          metalness={0.35}
          roughness={0.5}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Polished steel inner-edge chamfer */}
      <mesh
        position={[(DOOR_W / 2 - 0.06) * -side, 0, DOOR_D / 2 - 0.04]}
        castShadow={false}
      >
        <boxGeometry args={[0.12, DOOR_H - 0.6, 0.04]} />
        <meshStandardMaterial
          color="#C6CAD2"
          metalness={0.95}
          roughness={0.18}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* Thin red light line on the inner edge */}
      <mesh position={[(DOOR_W / 2 - 0.02) * -side, 0, DOOR_D / 2 + 0.01]}>
        <boxGeometry args={[0.04, DOOR_H - 2, 0.02]} />
        <meshBasicMaterial color="#FF4F58" toneMapped={false} />
      </mesh>
      {/* Single horizontal accent groove */}
      <mesh
        position={[0, GROOVE_Y, DOOR_D / 2 + 0.01]}
        castShadow={false}
      >
        <boxGeometry args={[DOOR_W - 0.6, 0.06, 0.03]} />
        <meshStandardMaterial
          color="#9CA0A8"
          metalness={0.9}
          roughness={0.22}
          envMapIntensity={1.0}
        />
      </mesh>
      {/* Top + bottom polished steel caps */}
      <mesh position={[0, DOOR_H / 2 - 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[DOOR_W + 0.08, 0.36, DOOR_D + 0.08]} />
        <meshStandardMaterial
          color="#B8BCC4"
          metalness={0.92}
          roughness={0.2}
          envMapIntensity={1.1}
        />
      </mesh>
      <mesh position={[0, -DOOR_H / 2 + 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[DOOR_W + 0.08, 0.36, DOOR_D + 0.08]} />
        <meshStandardMaterial
          color="#A4A8B0"
          metalness={0.92}
          roughness={0.24}
          envMapIntensity={1.0}
        />
      </mesh>
      {/* Outer side trim */}
      <mesh position={[(DOOR_W / 2 - 0.04) * side, 0, 0]}>
        <boxGeometry args={[0.08, DOOR_H - 0.4, DOOR_D + 0.06]} />
        <meshStandardMaterial
          color="#7C8088"
          metalness={0.85}
          roughness={0.32}
        />
      </mesh>
    </group>
  );
}

export default function Doors({
  progressRef,
}: {
  progressRef: CityProgressRef;
}) {
  const leftRef = useRef<THREE.Group>(null!);
  const rightRef = useRef<THREE.Group>(null!);
  const beamRef = useRef<THREE.Mesh>(null!);
  const slitRef = useRef<THREE.Mesh>(null!);
  const beamLightRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const p = progressRef.current?.progress ?? 0;
    const dp = Math.min(1, Math.max(0, p / DOOR_END));
    const e = easeInOutQuint(dp);

    const baseSlide = e * (DOOR_W / 2 + 4);
    const postSlide =
      p > DOOR_END ? Math.min(1, (p - DOOR_END) * 6) * 28 : 0;
    const totalSlide = baseSlide + postSlide;

    if (leftRef.current) {
      leftRef.current.position.x = -DOOR_W / 2 - totalSlide;
    }
    if (rightRef.current) {
      rightRef.current.position.x = DOOR_W / 2 + totalSlide;
    }

    if (slitRef.current) {
      const mat = slitRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - dp * 1.4);
    }

    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      const w = Math.max(0.04, e * (DOOR_W * 0.7));
      beamRef.current.scale.x = w;
      const post = Math.max(0, p - DOOR_END);
      mat.opacity = Math.min(0.6, e * 0.85) * Math.max(0, 1 - post * 14);
    }

    if (beamLightRef.current) {
      const post = Math.max(0, p - DOOR_END);
      beamLightRef.current.intensity =
        Math.min(20, e * 28) * Math.max(0, 1 - post * 12);
    }
  });

  return (
    <group position={[0, DOOR_H / 2 - 1, 0]}>
      {/* Warm beam in the gap */}
      <mesh ref={beamRef} position={[0, 0, -0.4]} renderOrder={1}>
        <planeGeometry args={[1, DOOR_H + 4]} />
        <meshBasicMaterial
          color="#FFE8C4"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Warm bounce light at the seam */}
      <pointLight
        ref={beamLightRef}
        position={[0, 0, -0.5]}
        color={"#FFE0B0"}
        intensity={0}
        distance={30}
        decay={2}
      />

      {/* Backlit slit before the gap opens */}
      <mesh ref={slitRef} position={[0, 0, -0.05]} renderOrder={1}>
        <planeGeometry args={[0.18, DOOR_H - 0.6]} />
        <meshBasicMaterial
          color="#FFD8A0"
          toneMapped={false}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>

      <DoorPanel side={-1} groupRef={leftRef} />
      <DoorPanel side={1} groupRef={rightRef} />

      {/* Warm spill on the road */}
      <mesh
        position={[0, -DOOR_H / 2 - 0.6, 4]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[DOOR_W * 1.6, 12]} />
        <meshBasicMaterial
          color="#FFC890"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
