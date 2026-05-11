"use client";
/**
 * Education + Civil Rights / Constitutional Order district —
 * research campus + Capitol-rotunda silhouette. Knowledge-flow rails
 * (thin emissive lines connecting buildings) carry the policy metaphor.
 */
import { useMemo } from "react";
import * as THREE from "three";
import CityBlock from "../primitives/CityBlock";
import HolographicLabel from "../primitives/HolographicLabel";
import Drones from "../primitives/Drones";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.EDUCATION;

function Capitol({ position }: { position: [number, number, number] }) {
  // Stylized: a wide low base + columned facade + a hemisphere dome.
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[18, 6, 10]} />
        <meshStandardMaterial color="#1a1a1d" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Columns */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-7.5 + i * 2.15, 7, 4.6]}>
          <cylinderGeometry args={[0.3, 0.3, 4, 12]} />
          <meshStandardMaterial color="#2a2a2e" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      {/* Pediment */}
      <mesh position={[0, 9.2, 4.6]}>
        <boxGeometry args={[17, 0.6, 0.4]} />
        <meshStandardMaterial color="#1a1a1d" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Drum + dome */}
      <mesh position={[0, 11, 0]}>
        <cylinderGeometry args={[2.6, 2.8, 3, 24]} />
        <meshStandardMaterial color="#1a1a1d" metalness={0.4} roughness={0.55} />
      </mesh>
      <mesh position={[0, 13.4, 0]}>
        <sphereGeometry args={[2.6, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2a2a30" metalness={0.5} roughness={0.45} />
      </mesh>
      {/* Subtle warm-light inner glow under the dome */}
      <mesh position={[0, 12, 0]}>
        <sphereGeometry args={[1.6, 16, 10]} />
        <meshBasicMaterial color="#FFE7BD" toneMapped={false} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function EducationDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  // Knowledge-flow rails: a few catenary-style lines connecting points
  const linesGeom = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const anchors: [number, number, number][] = [
      [-10, 8, CZ + 14],
      [-4, 14, CZ + 4],
      [4, 10, CZ - 6],
      [10, 16, CZ - 18],
      [-6, 12, CZ - 24],
    ];
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = new THREE.Vector3(...anchors[i]);
      const b = new THREE.Vector3(...anchors[i + 1]);
      const steps = 20;
      for (let s = 0; s < steps; s++) {
        const t1 = s / steps;
        const t2 = (s + 1) / steps;
        // sag in y for catenary feel
        const sag = (t: number) => -Math.sin(t * Math.PI) * 1.4;
        const p1 = new THREE.Vector3().lerpVectors(a, b, t1);
        const p2 = new THREE.Vector3().lerpVectors(a, b, t2);
        p1.y += sag(t1);
        p2.y += sag(t2);
        pts.push(p1, p2);
      }
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    return g;
  }, []);

  return (
    <group>
      <CityBlock
        center={[0, 0, CZ]}
        extent={[24, 36]}
        count={48}
        seed={401}
        heightRange={[10, 30]}
        baseColor="#0d0d10"
        capColor="#25252a"
        capEmissive="#A0C0FF"
        capEmissiveIntensity={1.4}
        keepOut={{ x: 0, z: CZ, radius: 5 }}
      />

      <Capitol position={[6, 0, CZ - 16]} />

      {/* Knowledge-flow rails */}
      <lineSegments geometry={linesGeom}>
        <lineBasicMaterial color="#A0C0FF" toneMapped={false} transparent opacity={0.6} />
      </lineSegments>

      {/* Light dots along the rails */}
      <Drones center={[-2, 12, CZ]} count={50} radius={18} yJitter={6} color="#A0C0FF" size={0.18} speed={0.5} seed={41} />

      <HolographicLabel
        position={[-8, 18, CZ + 6]}
        kicker="DISTRICT 04 / 06 — EDUCATION & CIVIL ORDER"
        heading="Federalism. Speech."
        pillar="Equal treatment, robust speech, school choice."
        body="Minimize the federal role. Expand school choice via tax credits, defend parental rights. End Grad PLUS and tie aid to outcomes. Equal protection means equal treatment under law, not group preferences. Defend the First Amendment against censorship — on campuses, on platforms, in government."
        progressRef={progressRef}
        visibleRange={[0.56, 0.70]}
      />
    </group>
  );
}
