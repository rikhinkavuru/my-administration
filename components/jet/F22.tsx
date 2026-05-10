"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "./constants";

/**
 * Procedural F-22 Raptor.
 *
 * ~1.2k triangles. "Have Glass V" two-tone gunship gray livery, gold-amber
 * radar-defeating canopy coating, twin canted vertical stabilizers,
 * diamond-planform wings (ExtrudeGeometry), heat-stained nozzles, blue
 * afterburner shock-diamond core inside an orange flame disk.
 *
 * Geometry reused via useMemo. Materials inlined per-mesh so each gets its
 * own three.js material instance.
 *
 * The architecture is GLB-ready: swap this component's body for a
 * `useGLTF("/models/f22.glb")` call if a confirmed-license model is added.
 */
export default function F22() {
  // Diamond-planform main wing
  const wingShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(-1.4, 2.4);
    s.lineTo(-1.75, 2.0);
    s.lineTo(-2.6, 0);
    s.closePath();
    return s;
  }, []);

  // Smaller swept horizontal stabilizer
  const stabShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(-0.5, 0.95);
    s.lineTo(-0.65, 0.8);
    s.lineTo(-0.95, 0);
    s.closePath();
    return s;
  }, []);

  // Canted vertical stabilizer
  const tailShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(-0.65, 1.25);
    s.lineTo(-0.95, 1.25);
    s.lineTo(-1.2, 0);
    s.closePath();
    return s;
  }, []);

  return (
    <group>
      {/* Main fuselage — capsule along X */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.3, 4.4, 8, 16]} />
        <meshStandardMaterial color={COLORS.body} metalness={0.22} roughness={0.58} />
      </mesh>
      {/* Top spine — lighter two-tone overlay */}
      <mesh
        position={[0, 0.16, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[1, 0.95, 0.5]}
      >
        <capsuleGeometry args={[0.26, 3.8, 6, 12]} />
        <meshStandardMaterial color={COLORS.bodyLight} metalness={0.22} roughness={0.58} />
      </mesh>

      {/* Nose cone */}
      <mesh position={[2.55, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.28, 0.65, 16]} />
        <meshStandardMaterial color={COLORS.body} metalness={0.22} roughness={0.58} />
      </mesh>
      <mesh position={[2.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
        <meshStandardMaterial color="#0F1421" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cockpit canopy — gold-amber radar-defeating coating */}
      <mesh position={[0.95, 0.24, 0]} scale={[0.9, 0.3, 0.34]}>
        <sphereGeometry args={[1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={COLORS.cockpit}
          metalness={0.7}
          roughness={0.06}
          transmission={0.12}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.04}
          emissive={COLORS.cockpitEmissive}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Wings — mirrored ExtrudeGeometry */}
      <mesh position={[1.0, -0.08, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[wingShape, { depth: 0.06, bevelEnabled: false }]} />
        <meshStandardMaterial color={COLORS.body} metalness={0.22} roughness={0.58} />
      </mesh>
      <mesh
        position={[1.0, -0.08, -0.28]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, -1, 1]}
      >
        <extrudeGeometry args={[wingShape, { depth: 0.06, bevelEnabled: false }]} />
        <meshStandardMaterial color={COLORS.body} metalness={0.22} roughness={0.58} />
      </mesh>

      {/* Horizontal stabilizers */}
      <mesh position={[-1.55, -0.05, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[stabShape, { depth: 0.05, bevelEnabled: false }]} />
        <meshStandardMaterial color={COLORS.body} metalness={0.22} roughness={0.58} />
      </mesh>
      <mesh
        position={[-1.55, -0.05, -0.28]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, -1, 1]}
      >
        <extrudeGeometry args={[stabShape, { depth: 0.05, bevelEnabled: false }]} />
        <meshStandardMaterial color={COLORS.body} metalness={0.22} roughness={0.58} />
      </mesh>

      {/* Vertical stabilizers — twin, canted ~26° outward */}
      <mesh position={[-1.4, 0.28, 0.28]} rotation={[0.45, 0, 0]}>
        <extrudeGeometry args={[tailShape, { depth: 0.04, bevelEnabled: false }]} />
        <meshStandardMaterial color={COLORS.body} metalness={0.22} roughness={0.58} />
      </mesh>
      <mesh position={[-1.4, 0.28, -0.28]} rotation={[-0.45, 0, 0]}>
        <extrudeGeometry args={[tailShape, { depth: 0.04, bevelEnabled: false }]} />
        <meshStandardMaterial color={COLORS.body} metalness={0.22} roughness={0.58} />
      </mesh>

      {/* Air intakes */}
      <mesh position={[0.6, -0.22, 0.28]}>
        <boxGeometry args={[0.9, 0.18, 0.14]} />
        <meshStandardMaterial color={COLORS.intake} metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh position={[0.6, -0.22, -0.28]}>
        <boxGeometry args={[0.9, 0.18, 0.14]} />
        <meshStandardMaterial color={COLORS.intake} metalness={0.35} roughness={0.55} />
      </mesh>

      {/* Engine nozzles — heat-stained near-black */}
      <mesh position={[-2.4, -0.05, 0.18]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.18, 0.4, 14]} />
        <meshStandardMaterial color={COLORS.nozzle} metalness={0.7} roughness={0.45} />
      </mesh>
      <mesh position={[-2.4, -0.05, -0.18]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.18, 0.4, 14]} />
        <meshStandardMaterial color={COLORS.nozzle} metalness={0.7} roughness={0.45} />
      </mesh>

      {/* Afterburner — outer orange flame disk */}
      <mesh position={[-2.62, -0.05, 0.18]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial
          color={COLORS.afterburnerOrange}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[-2.62, -0.05, -0.18]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial
          color={COLORS.afterburnerOrange}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Afterburner — inner blue shock-diamond core */}
      <mesh position={[-2.625, -0.05, 0.18]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.062, 12]} />
        <meshBasicMaterial
          color={COLORS.afterburnerBlue}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[-2.625, -0.05, -0.18]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.062, 12]} />
        <meshBasicMaterial
          color={COLORS.afterburnerBlue}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Engine point lights for emissive glow */}
      <pointLight position={[-2.85, -0.05, 0.18]} color="#FF8C42" intensity={3} distance={3} />
      <pointLight position={[-2.85, -0.05, -0.18]} color="#FF8C42" intensity={3} distance={3} />

      {/* USAF insignia — Old Glory red roundel */}
      <mesh position={[0.7, 0, 0.31]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial
          color={COLORS.insignia}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0.7, 0, -0.31]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial
          color={COLORS.insignia}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
