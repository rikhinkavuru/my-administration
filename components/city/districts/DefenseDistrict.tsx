"use client";
/**
 * Defense + Foreign Policy district — command-center mesa with radar
 * arrays, satellite uplinks, distant aircraft silhouettes (kept as
 * generic delta-wing pylons; no F-22, which belongs to the jet sequence).
 */
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import CityBlock from "../primitives/CityBlock";
import HolographicLabel from "../primitives/HolographicLabel";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.DEFENSE;

function RadarDish({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5;
  });
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[1.2, 6, 1.2]} />
        <meshStandardMaterial color="#1c1c1f" metalness={0.7} roughness={0.4} />
      </mesh>
      <group ref={ref} position={[0, 6, 0]}>
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <coneGeometry args={[2.4, 0.6, 24, 1, true]} />
          <meshStandardMaterial color="#2a2a2e" metalness={0.7} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
          <meshStandardMaterial color="#444" />
        </mesh>
      </group>
    </group>
  );
}

function SatelliteUplink({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 8, 8]} />
        <meshStandardMaterial color="#222226" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* uplink beam */}
      <mesh position={[0, 30, 0]}>
        <cylinderGeometry args={[0.02, 0.4, 52, 8, 1, true]} />
        <meshBasicMaterial color="#D63D44" toneMapped={false} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function AircraftPylon({ position }: { position: [number, number, number] }) {
  // Stylized silhouette: a thin delta + cylindrical fuselage. Generic.
  return (
    <group position={position}>
      <mesh>
        <coneGeometry args={[0.6, 2.4, 4]} />
        <meshStandardMaterial color="#15151a" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 2.6, 0.3]} />
        <meshStandardMaterial color="#15151a" metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function DefenseDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  return (
    <group>
      {/* Low bunker complex — short wide buildings, cool blue-grey */}
      <CityBlock
        center={[0, 0, CZ]}
        extent={[26, 36]}
        count={50}
        seed={501}
        heightRange={[3, 10]}
        baseColor="#0c0d10"
        capColor="#1c1f24"
        capEmissive="#8FB0FF"
        capEmissiveIntensity={0.9}
        keepOut={{ x: 0, z: CZ, radius: 5 }}
      />

      {/* The "mesa" — a raised platform the radars sit on */}
      <mesh position={[-10, 1, CZ - 6]}>
        <boxGeometry args={[14, 2, 10]} />
        <meshStandardMaterial color="#15151a" metalness={0.5} roughness={0.6} />
      </mesh>

      <RadarDish position={[-14, 2, CZ - 8]} />
      <RadarDish position={[-8, 2, CZ - 4]} />
      <SatelliteUplink position={[-4, 2, CZ - 10]} />
      <SatelliteUplink position={[12, 0, CZ - 14]} />

      {/* Distant aircraft silhouettes (not F-22) */}
      <AircraftPylon position={[18, 22, CZ - 30]} />
      <AircraftPylon position={[-22, 26, CZ - 20]} />
      <AircraftPylon position={[6, 28, CZ - 38]} />

      {/* Digital sweep map projected on a bunker wall */}
      <mesh position={[6, 4, CZ + 4]} rotation={[0, -0.3, 0]}>
        <planeGeometry args={[8, 4]} />
        <meshBasicMaterial color="#8FB0FF" toneMapped={false} transparent opacity={0.18} />
      </mesh>

      <HolographicLabel
        position={[8, 16, CZ + 4]}
        kicker="DISTRICT 05 / 06 — DEFENSE & FOREIGN POLICY"
        heading="Peace through strength."
        pillar="Modernize, recapitalize, reform the Pentagon."
        body="Modernize the nuclear triad. Expand the Navy toward 355 ships. Invest in cyber, space, AI. Reform acquisition. NATO + Indo-Pacific alliances — Japan, South Korea, Australia, Taiwan. Firm with China. Israel and Ukraine's right to self-defense without open-ended blank checks."
        progressRef={progressRef}
        visibleRange={[0.70, 0.84]}
      />
    </group>
  );
}
