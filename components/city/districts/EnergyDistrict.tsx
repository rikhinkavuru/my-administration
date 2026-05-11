"use client";
/**
 * Energy & Environment district — industrial mid-zone transitioning from
 * soot-grey smokestacks to nuclear cooling towers + wind farms as the
 * camera pushes through. Covers: Energy + Environment.
 */
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import CityBlock from "../primitives/CityBlock";
import HolographicLabel from "../primitives/HolographicLabel";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.ENERGY;

function CoolingTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[3.5, 5, 18, 24, 1, true]} />
        <meshStandardMaterial color="#161618" metalness={0.3} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 9.5, 0]}>
        <cylinderGeometry args={[3.4, 3.4, 0.4, 24]} />
        <meshStandardMaterial color="#0c0c0e" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Smokestack({ position, h = 18 }: { position: [number, number, number]; h?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.7, 1.0, h, 12]} />
        <meshStandardMaterial color="#222226" metalness={0.4} roughness={0.55} />
      </mesh>
      <mesh position={[0, h - 0.5, 0]}>
        <torusGeometry args={[1.1, 0.15, 8, 16]} />
        <meshStandardMaterial color="#3a3a3e" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function WindTurbine({ position }: { position: [number, number, number] }) {
  const bladesRef = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (bladesRef.current) bladesRef.current.rotation.z += dt * 0.6;
  });
  return (
    <group position={position}>
      <mesh position={[0, 7, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 14, 8]} />
        <meshStandardMaterial color="#d8d8d8" metalness={0.3} roughness={0.6} />
      </mesh>
      <group ref={bladesRef} position={[0, 14, 0.4]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]} position={[0, 2.6, 0]}>
            <boxGeometry args={[0.4, 5.2, 0.1]} />
            <meshStandardMaterial color="#e8e8e8" metalness={0.2} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function EnergyDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  // Smoke particle plume tied to a smokestack
  const smokeGeom = useMemo(() => {
    const N = 60;
    const positions = new Float32Array(N * 3);
    const seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      seeds[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));
    return g;
  }, []);
  const smokeMat = useMemo(() => new THREE.PointsMaterial({
    color: "#3a3a3e",
    size: 2.2,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
    sizeAttenuation: true,
  }), []);

  useFrame((_, dt) => {
    const pos = smokeGeom.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      pos.array[i * 3 + 1] += dt * 1.2;
      if (pos.array[i * 3 + 1] > 14) {
        pos.array[i * 3 + 1] = 0;
        pos.array[i * 3 + 0] = (Math.random() - 0.5) * 2;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <group>
      {/* Industrial backdrop on the entry side (south, +Z within district) */}
      <CityBlock
        center={[-22, 0, CZ + 28]}
        extent={[16, 14]}
        count={36}
        seed={211}
        heightRange={[3, 9]}
        baseColor="#0c0c0e"
        capColor="#1a1a1c"
        capEmissive="#FFE7BD"
        capEmissiveIntensity={0.4}
      />
      <Smokestack position={[-14, 0, CZ + 22]} h={22} />
      <Smokestack position={[-8, 0, CZ + 28]} h={16} />
      <Smokestack position={[-4, 0, CZ + 14]} h={28} />
      <points geometry={smokeGeom} material={smokeMat} position={[-4, 22, CZ + 14]} />

      {/* Transition zone: nuclear cooling towers in the middle */}
      <CoolingTower position={[10, 0, CZ - 4]} />
      <CoolingTower position={[18, 0, CZ + 2]} />
      <CoolingTower position={[14, 0, CZ - 16]} />

      {/* Wind farm on the exit side (north, -Z within district) */}
      {[-18, -12, -6, 6, 12, 18].map((x, i) => (
        <WindTurbine key={i} position={[x, 0, CZ - 28 - (i % 2) * 6]} />
      ))}

      {/* Soft ground emissive plate suggesting clean grid */}
      <mesh position={[0, 0.02, CZ - 20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 20]} />
        <meshBasicMaterial color="#0a1e1a" toneMapped={false} transparent opacity={0.6} />
      </mesh>

      <HolographicLabel
        position={[8, 18, CZ - 4]}
        kicker="DISTRICT 02 / 06 — ENERGY & ENVIRONMENT"
        heading="All of the above."
        pillar="Abundance, stewardship, no mandates."
        body="Oil, gas, nuclear, and renewables that stand on their own. Approve pipelines, expand LNG to allies, restart nuclear construction, NEPA reform. Conserve land, air, and water through markets and property rights. Carbon capture and natural gas as a bridge."
        progressRef={progressRef}
        visibleRange={[0.26, 0.40]}
      />
    </group>
  );
}
