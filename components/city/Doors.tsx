"use client";
/**
 * Doors
 * -----
 * Two heavy mechanical slabs hinged at the screen's left/right edges (at
 * z = 0, the threshold the camera passes through). On the first ~8% of
 * scroll progress they slide outward — translate.x ± plus a slight
 * rotateY swing for the hinge feel. Mechanical detail (bolts, hairline
 * cuts, internal light strips) is built into the material + extra child
 * meshes.
 *
 * Once the doors are fully open they translate further out + dim so they
 * don't fight the city for the camera's attention later in the journey.
 */
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { CityProgressRef } from "./useCityProgress";
import { DOOR_END } from "./CameraRail";

const DOOR_W = 22;
const DOOR_H = 38;
const DOOR_D = 1.4;

function easeOutExpo(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.pow(2, -10 * t);
}

const BOLT_GEOM = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 8);
const BOLT_COUNT = 18; // 3 cols x 6 rows

function DoorPanel({
  side, // -1 left, +1 right
  groupRef,
}: {
  side: -1 | 1;
  groupRef: React.RefObject<THREE.Group | null>;
}) {
  // Bolt grid: one InstancedMesh of 18 small cylinders embedded in the
  // door face. Single draw call instead of 18.
  const boltsRef = useRef<THREE.InstancedMesh>(null!);
  useEffect(() => {
    const mesh = boltsRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const cols = 3, rows = 6;
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * (DOOR_W / 4);
        const y = (r - (rows - 1) / 2) * (DOOR_H / 7);
        dummy.position.set(x, y, DOOR_D / 2 + 0.04);
        dummy.rotation.set(Math.PI / 2, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx++, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main door slab */}
      <mesh>
        <boxGeometry args={[DOOR_W, DOOR_H, DOOR_D]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.45}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Beveled inner edge (the side facing the seam): brighter metal */}
      <mesh position={[(DOOR_W / 2) * -side, 0, 0]}>
        <boxGeometry args={[0.4, DOOR_H, DOOR_D + 0.2]} />
        <meshStandardMaterial
          color="#1c1c1c"
          metalness={1}
          roughness={0.25}
          emissive="#D63D44"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Internal light strip — runs vertically near the inner edge.
          This is what visually "leaks" between the doors when they're shut. */}
      <mesh position={[(DOOR_W / 2 - 0.6) * -side, 0, DOOR_D / 2 + 0.05]}>
        <boxGeometry args={[0.08, DOOR_H - 4, 0.05]} />
        <meshBasicMaterial color="#FFE7BD" toneMapped={false} />
      </mesh>

      {/* Hairline horizontal cuts — three of them, suggesting panels */}
      {[-8, 0, 8].map((y, i) => (
        <mesh key={i} position={[0, y, DOOR_D / 2 + 0.02]}>
          <boxGeometry args={[DOOR_W - 1, 0.05, 0.04]} />
          <meshStandardMaterial color="#222" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Bolts — instanced */}
      <instancedMesh ref={boltsRef} args={[BOLT_GEOM, undefined, BOLT_COUNT]}>
        <meshStandardMaterial color="#3a3a3a" metalness={1} roughness={0.3} />
      </instancedMesh>
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
  const sparksRef = useRef<THREE.Points>(null!);

  // Spark particles ejected from the seam at the impact moment.
  const sparkGeom = useMemo(() => {
    const N = 220;
    const positions = new Float32Array(N * 3);
    const velocities = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 2] = 0;
      // outward velocity, mostly ±x with a touch of y/z scatter
      velocities[i * 3 + 0] = (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 3);
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    return g;
  }, []);

  useFrame(() => {
    const p = progressRef.current?.progress ?? 0;
    // Door open progress: 0 at p=0, 1 at p=DOOR_END.
    const dp = Math.min(1, Math.max(0, p / DOOR_END));
    const e = easeOutExpo(dp);

    // Translate outward (heavy, slow); slight outward rotation for hinge.
    const slide = e * 14; // up to 14 units each side
    const swing = e * 0.18;

    if (leftRef.current) {
      leftRef.current.position.x = -DOOR_W / 2 - 0.05 - slide;
      leftRef.current.rotation.y = -swing;
      // After the doors fully open, push them way out so they don't read
      // in subsequent frames.
      if (p > DOOR_END) {
        const post = (p - DOOR_END) * 4;
        leftRef.current.position.x -= post * 30;
      }
    }
    if (rightRef.current) {
      rightRef.current.position.x = DOOR_W / 2 + 0.05 + slide;
      rightRef.current.rotation.y = swing;
      if (p > DOOR_END) {
        const post = (p - DOOR_END) * 4;
        rightRef.current.position.x += post * 30;
      }
    }

    // Sparks: animate positions outward during impact window, fade afterward.
    if (sparksRef.current) {
      const mat = sparksRef.current.material as THREE.PointsMaterial;
      // Only visible across the door window with peak around 30-70%.
      const burst = dp < 0.85 ? Math.sin(dp * Math.PI) : Math.max(0, 1 - (dp - 0.85) * 6);
      mat.opacity = 0.9 * burst;
      // Advance positions along velocities once per frame (light work).
      const posAttr = sparkGeom.getAttribute("position") as THREE.BufferAttribute;
      const velAttr = sparkGeom.getAttribute("velocity") as THREE.BufferAttribute;
      const speed = 0.08 * (1 + dp * 2);
      for (let i = 0; i < posAttr.count; i++) {
        posAttr.array[i * 3 + 0] += velAttr.array[i * 3 + 0] * speed;
        posAttr.array[i * 3 + 1] += velAttr.array[i * 3 + 1] * speed * 0.4;
        posAttr.array[i * 3 + 2] += velAttr.array[i * 3 + 2] * speed;
        // recycle particles that drift too far
        if (Math.abs(posAttr.array[i * 3 + 0]) > 18) {
          posAttr.array[i * 3 + 0] = (Math.random() - 0.5) * 0.6;
          posAttr.array[i * 3 + 1] = (Math.random() - 0.5) * 32;
          posAttr.array[i * 3 + 2] = 0;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <DoorPanel side={-1} groupRef={leftRef} />
      <DoorPanel side={1} groupRef={rightRef} />

      {/* Sparks at the seam */}
      <points ref={sparksRef} geometry={sparkGeom} position={[0, 0, 0]}>
        <pointsMaterial
          size={0.18}
          color="#FFE7BD"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      {/* Backlit slit visible while doors are still mostly closed */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[0.6, DOOR_H]} />
        <meshBasicMaterial color="#FFE7BD" toneMapped={false} />
      </mesh>
    </group>
  );
}
