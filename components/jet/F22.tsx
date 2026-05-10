"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { COLORS } from "./constants";

/**
 * Procedural F-22 Raptor, performance-tuned.
 *
 * ~700 triangles total (down from ~1.2k): reduced subdivisions on the
 * fuselage capsule, cockpit half-sphere, cone nose, engine cylinders;
 * cockpit material switched from meshPhysicalMaterial (transmission +
 * clearcoat = multi-pass shader) to a gold-amber meshStandardMaterial
 * with high metalness + low roughness, which renders in a single pass.
 *
 * GLB-ready: the entire body could be replaced by `useGLTF(...)` if a
 * licensed model is added to /public/models/.
 */
export default function F22() {
  const wingShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(-1.4, 2.4);
    s.lineTo(-1.75, 2.0);
    s.lineTo(-2.6, 0);
    s.closePath();
    return s;
  }, []);

  const stabShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(-0.5, 0.95);
    s.lineTo(-0.65, 0.8);
    s.lineTo(-0.95, 0);
    s.closePath();
    return s;
  }, []);

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
      {/* Main fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.3, 4.4, 4, 10]} />
        <meshStandardMaterial color={COLORS.body} metalness={0.22} roughness={0.58} />
      </mesh>
      {/* Top spine */}
      <mesh
        position={[0, 0.16, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[1, 0.95, 0.5]}
      >
        <capsuleGeometry args={[0.26, 3.8, 4, 8]} />
        <meshStandardMaterial color={COLORS.bodyLight} metalness={0.22} roughness={0.58} />
      </mesh>

      {/* Nose */}
      <mesh position={[2.55, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.28, 0.65, 10]} />
        <meshStandardMaterial color={COLORS.body} metalness={0.22} roughness={0.58} />
      </mesh>
      <mesh position={[2.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.18, 6]} />
        <meshStandardMaterial color="#0F1421" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cockpit canopy — simplified gold-amber material (single-pass) */}
      <mesh position={[0.95, 0.24, 0]} scale={[0.9, 0.3, 0.34]}>
        <sphereGeometry args={[1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={COLORS.cockpit}
          metalness={0.85}
          roughness={0.12}
          emissive={COLORS.cockpitEmissive}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Wings */}
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

      {/* Vertical stabilizers (canted ~26° outward) */}
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

      {/* Engine nozzles */}
      <mesh position={[-2.4, -0.05, 0.18]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.18, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.nozzle} metalness={0.7} roughness={0.45} />
      </mesh>
      <mesh position={[-2.4, -0.05, -0.18]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.18, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.nozzle} metalness={0.7} roughness={0.45} />
      </mesh>

      {/* Afterburner orange flame disks */}
      <mesh position={[-2.62, -0.05, 0.18]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.13, 12]} />
        <meshBasicMaterial color={COLORS.afterburnerOrange} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-2.62, -0.05, -0.18]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.13, 12]} />
        <meshBasicMaterial color={COLORS.afterburnerOrange} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Blue shock-diamond cores */}
      <mesh position={[-2.625, -0.05, 0.18]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.062, 8]} />
        <meshBasicMaterial color={COLORS.afterburnerBlue} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-2.625, -0.05, -0.18]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.062, 8]} />
        <meshBasicMaterial color={COLORS.afterburnerBlue} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Single warm point light at the engines (was two) */}
      <pointLight position={[-2.85, -0.05, 0]} color="#FF8C42" intensity={3.5} distance={3.2} />

      {/* Insignia */}
      <mesh position={[0.7, 0, 0.31]}>
        <circleGeometry args={[0.13, 12]} />
        <meshBasicMaterial color={COLORS.insignia} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.7, 0, -0.31]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.13, 12]} />
        <meshBasicMaterial color={COLORS.insignia} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
