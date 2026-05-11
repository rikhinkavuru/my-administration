"use client";
/**
 * Doors
 * -----
 * Heavy mechanical blast-doors at the threshold (z=0). Two visible
 * layers: front armored slabs slide outward, back inner gates reveal a
 * widening warm beam of city light. Aesthetic load:
 *   - panel divisions + hairline cuts give scale
 *   - 18-bolt instanced grid per door (visible at the close camera dist)
 *   - beveled inner edge with red emissive seam (the campaign-coded "tell")
 *   - brushed-steel material (metalness 0.85, roughness 0.32)
 *   - rim-lit edge glow that warms as the doors part
 *   - dust/spark particles billowing from the seam
 *   - a volumetric warm cone of light escaping through the widening gap
 *   - "THE PLATFORM" wordmark BEHIND the doors, fades up with the gap
 * Animation: easeInOutQuart for the slab travel + decaying oscillator on
 * the final ~12% so the doors visibly "settle" instead of hard-locking.
 */
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { CityProgressRef } from "./useCityProgress";
import { DOOR_END } from "./CameraRail";

const DOOR_W = 22;
const DOOR_H = 38;
const DOOR_D = 1.4;

function easeInOutQuart(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

const BOLT_GEOM = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 10);
const RIB_GEOM = new THREE.BoxGeometry(0.6, 0.4, 0.18);
const BOLT_COUNT = 18; // 3 cols x 6 rows

function DoorPanel({
  side,
  groupRef,
}: {
  side: -1 | 1;
  groupRef: React.RefObject<THREE.Group | null>;
}) {
  const boltsRef = useRef<THREE.InstancedMesh>(null!);
  const ribsRef = useRef<THREE.InstancedMesh>(null!);

  useEffect(() => {
    const mesh = boltsRef.current;
    if (mesh) {
      const dummy = new THREE.Object3D();
      const cols = 3,
        rows = 6;
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c - (cols - 1) / 2) * (DOOR_W / 4);
          const y = (r - (rows - 1) / 2) * (DOOR_H / 7);
          dummy.position.set(x, y, DOOR_D / 2 + 0.06);
          dummy.rotation.set(Math.PI / 2, 0, 0);
          dummy.updateMatrix();
          mesh.setMatrixAt(idx++, dummy.matrix);
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
    const ribs = ribsRef.current;
    if (ribs) {
      const dummy = new THREE.Object3D();
      // 6 horizontal ribs across the door face
      let idx = 0;
      for (let i = 0; i < 6; i++) {
        const y = -DOOR_H / 2 + 3 + i * ((DOOR_H - 6) / 5);
        dummy.position.set(0, y, DOOR_D / 2 + 0.02);
        dummy.scale.set(DOOR_W * 0.92, 0.18, 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        ribs.setMatrixAt(idx++, dummy.matrix);
      }
      ribs.count = idx;
      ribs.instanceMatrix.needsUpdate = true;
    }
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main armored slab — brushed steel */}
      <mesh castShadow={false}>
        <boxGeometry args={[DOOR_W, DOOR_H, DOOR_D]} />
        <meshStandardMaterial
          color="#3a3d44"
          metalness={0.85}
          roughness={0.32}
          envMapIntensity={0.9}
        />
      </mesh>

      {/* Inner armored secondary plate (offset behind primary so the
          door looks layered when caught in profile) */}
      <mesh position={[0, 0, -DOOR_D * 0.55]}>
        <boxGeometry args={[DOOR_W - 1.4, DOOR_H - 1.4, DOOR_D * 0.5]} />
        <meshStandardMaterial
          color="#2a2d34"
          metalness={0.9}
          roughness={0.4}
        />
      </mesh>

      {/* Recessed central panel — the "window" of the door */}
      <mesh position={[0, 0, DOOR_D / 2 + 0.005]}>
        <boxGeometry args={[DOOR_W - 4, DOOR_H - 6, 0.04]} />
        <meshStandardMaterial
          color="#1d2026"
          metalness={0.95}
          roughness={0.28}
        />
      </mesh>

      {/* Side beveled rim (top + bottom + outer edge) — catches the
          warm key + rim lights so the door has visible 3D shape */}
      <mesh position={[0, DOOR_H / 2 - 0.5, 0]}>
        <boxGeometry args={[DOOR_W, 1, DOOR_D + 0.2]} />
        <meshStandardMaterial
          color="#4a4d54"
          metalness={0.9}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, -DOOR_H / 2 + 0.5, 0]}>
        <boxGeometry args={[DOOR_W, 1, DOOR_D + 0.2]} />
        <meshStandardMaterial
          color="#4a4d54"
          metalness={0.9}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[(DOOR_W / 2) * side, 0, 0]}>
        <boxGeometry args={[1, DOOR_H, DOOR_D + 0.2]} />
        <meshStandardMaterial
          color="#4a4d54"
          metalness={0.9}
          roughness={0.28}
        />
      </mesh>

      {/* INNER edge — facing the seam — brighter cut metal with red
          emissive trim */}
      <mesh position={[(DOOR_W / 2) * -side, 0, 0]}>
        <boxGeometry args={[0.5, DOOR_H, DOOR_D + 0.3]} />
        <meshStandardMaterial
          color="#5a5d64"
          metalness={1}
          roughness={0.22}
          emissive="#D63D44"
          emissiveIntensity={0.55}
        />
      </mesh>
      {/* Red glowing strip along the inner edge */}
      <mesh position={[(DOOR_W / 2 - 0.1) * -side, 0, 0]}>
        <boxGeometry args={[0.06, DOOR_H - 1, DOOR_D + 0.34]} />
        <meshBasicMaterial color="#FF5560" toneMapped={false} />
      </mesh>

      {/* Horizontal ribs (instanced) — panel divisions */}
      <instancedMesh ref={ribsRef} args={[RIB_GEOM, undefined, 6]}>
        <meshStandardMaterial
          color="#22252c"
          metalness={0.85}
          roughness={0.4}
        />
      </instancedMesh>

      {/* Bolts (instanced) — brushed steel pucks */}
      <instancedMesh ref={boltsRef} args={[BOLT_GEOM, undefined, BOLT_COUNT]}>
        <meshStandardMaterial
          color="#9aa0aa"
          metalness={1}
          roughness={0.2}
        />
      </instancedMesh>

      {/* Hazard chevrons painted on the lower outer corner — a small
          graphic accent that sells the "industrial weight" read */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[(DOOR_W / 2 - 3 - i * 0.6) * side, -DOOR_H / 2 + 2, DOOR_D / 2 + 0.03]}
          rotation={[0, 0, (Math.PI / 4) * (side === -1 ? 1 : -1)]}
        >
          <boxGeometry args={[0.4, 1.6, 0.04]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#FFC83C" : "#1d2026"}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function InnerGate({
  side,
  groupRef,
}: {
  side: -1 | 1;
  groupRef: React.RefObject<THREE.Group | null>;
}) {
  // Secondary, simpler inner gate sitting behind the primary doors. Plays
  // depth tricks — when the primaries part you see this layer parting too.
  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[DOOR_W - 2, DOOR_H - 2, DOOR_D * 0.6]} />
        <meshStandardMaterial
          color="#1c1f25"
          metalness={0.9}
          roughness={0.35}
        />
      </mesh>
      {/* Bright inner edge */}
      <mesh position={[(DOOR_W / 2 - 1) * -side, 0, 0]}>
        <boxGeometry args={[0.18, DOOR_H - 2, DOOR_D * 0.6 + 0.2]} />
        <meshBasicMaterial color="#FFB070" toneMapped={false} />
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
  const innerLeftRef = useRef<THREE.Group>(null!);
  const innerRightRef = useRef<THREE.Group>(null!);
  const sparksRef = useRef<THREE.Points>(null!);
  const dustRef = useRef<THREE.Points>(null!);
  const beamRef = useRef<THREE.Mesh>(null!);
  const slitRef = useRef<THREE.Mesh>(null!);
  const titleRef = useRef<THREE.Mesh>(null!);

  // Sparks at the seam — small, bright, additive
  const sparkGeom = useMemo(() => {
    const N = 220;
    const positions = new Float32Array(N * 3);
    const velocities = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 2] = 0;
      velocities[i * 3 + 0] = (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 3);
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    return g;
  }, []);

  // Soft dust cloud — larger, slower, semi-transparent
  const dustGeom = useMemo(() => {
    const N = 140;
    const positions = new Float32Array(N * 3);
    const velocities = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = -DOOR_H / 2 + Math.random() * DOOR_H * 0.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      velocities[i * 3 + 0] = (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.8);
      velocities[i * 3 + 1] = Math.random() * 0.4 + 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    return g;
  }, []);

  // "THE PLATFORM" wordmark texture behind the doors
  const titleTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "700 320px 'Geist Sans', ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("THE PLATFORM", c.width / 2, c.height / 2);
    // soft warm tick under it
    ctx.fillStyle = "#D63D44";
    ctx.fillRect(c.width / 2 - 120, c.height - 80, 240, 6);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }, []);

  useFrame((_, dt) => {
    const p = progressRef.current?.progress ?? 0;
    const dp = Math.min(1, Math.max(0, p / DOOR_END));
    let e = easeInOutQuart(dp);
    // Add a decaying oscillator near the end so the doors "settle"
    if (dp > 0.85) {
      const k = (dp - 0.85) / 0.15;
      const osc = Math.sin(k * Math.PI * 6) * Math.exp(-k * 4) * 0.04;
      e += osc * (1 - k);
    }
    e = Math.max(0, Math.min(1, e));

    const slide = e * 14;
    const swing = e * 0.18;
    const innerSlide = e * 11; // inner gates slightly less travel

    if (leftRef.current) {
      leftRef.current.position.x = -DOOR_W / 2 - 0.05 - slide;
      leftRef.current.rotation.y = -swing;
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
    if (innerLeftRef.current) {
      innerLeftRef.current.position.x = -DOOR_W / 2 + 0.4 - innerSlide;
      if (p > DOOR_END) innerLeftRef.current.position.x -= (p - DOOR_END) * 80;
    }
    if (innerRightRef.current) {
      innerRightRef.current.position.x = DOOR_W / 2 - 0.4 + innerSlide;
      if (p > DOOR_END) innerRightRef.current.position.x += (p - DOOR_END) * 80;
    }

    // Slit between the doors — wider as they open until they fully part
    if (slitRef.current) {
      const mat = slitRef.current.material as THREE.MeshBasicMaterial;
      const w = 0.6 + e * 12;
      slitRef.current.scale.x = w / 0.6;
      mat.opacity = Math.max(0, 1 - dp * 0.9);
    }

    // Volumetric beam: a flat warm rectangle in the gap, additive, scales
    // with the opening and fades as the camera passes through.
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      const w = Math.max(0.001, e * 26);
      beamRef.current.scale.x = w;
      const post = Math.max(0, p - DOOR_END);
      mat.opacity = Math.min(0.85, e * 1.05) * Math.max(0, 1 - post * 18);
    }

    // Title behind the doors — fades up as they open, then out as the
    // camera passes through.
    if (titleRef.current) {
      const mat = titleRef.current.material as THREE.MeshBasicMaterial;
      const intro = Math.max(0, (dp - 0.15) / 0.6);
      const fade = Math.max(0, 1 - Math.max(0, p - DOOR_END) * 20);
      mat.opacity = Math.min(1, intro) * fade;
    }

    // Sparks
    if (sparksRef.current) {
      const mat = sparksRef.current.material as THREE.PointsMaterial;
      const burst = dp < 0.85 ? Math.sin(dp * Math.PI) : Math.max(0, 1 - (dp - 0.85) * 6);
      mat.opacity = 0.85 * burst;
      const posAttr = sparkGeom.getAttribute("position") as THREE.BufferAttribute;
      const velAttr = sparkGeom.getAttribute("velocity") as THREE.BufferAttribute;
      const speed = 0.08 * (1 + dp * 2);
      for (let i = 0; i < posAttr.count; i++) {
        posAttr.array[i * 3 + 0] += velAttr.array[i * 3 + 0] * speed;
        posAttr.array[i * 3 + 1] += velAttr.array[i * 3 + 1] * speed * 0.4;
        posAttr.array[i * 3 + 2] += velAttr.array[i * 3 + 2] * speed;
        if (Math.abs(posAttr.array[i * 3 + 0]) > 18) {
          posAttr.array[i * 3 + 0] = (Math.random() - 0.5) * 0.6;
          posAttr.array[i * 3 + 1] = (Math.random() - 0.5) * 32;
          posAttr.array[i * 3 + 2] = 0;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Dust billows — slow, low, drift up + outward
    if (dustRef.current) {
      const mat = dustRef.current.material as THREE.PointsMaterial;
      const billow = dp > 0.05 ? Math.min(1, (dp - 0.05) * 1.4) : 0;
      const fadeAway = Math.max(0, 1 - Math.max(0, p - DOOR_END) * 14);
      mat.opacity = 0.42 * billow * fadeAway;
      const posAttr = dustGeom.getAttribute("position") as THREE.BufferAttribute;
      const velAttr = dustGeom.getAttribute("velocity") as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        posAttr.array[i * 3 + 0] += velAttr.array[i * 3 + 0] * dt * 0.6;
        posAttr.array[i * 3 + 1] += velAttr.array[i * 3 + 1] * dt;
        posAttr.array[i * 3 + 2] += velAttr.array[i * 3 + 2] * dt * 0.4;
        if (
          Math.abs(posAttr.array[i * 3 + 0]) > 12 ||
          posAttr.array[i * 3 + 1] > DOOR_H / 2 + 4
        ) {
          posAttr.array[i * 3 + 0] = (Math.random() - 0.5) * 4;
          posAttr.array[i * 3 + 1] = -DOOR_H / 2 + Math.random() * 4;
          posAttr.array[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, DOOR_H / 2 - 1, 0]}>
      {/* Title BEHIND the doors — visible through the widening seam */}
      <mesh
        ref={titleRef}
        position={[0, 4, -36]}
        renderOrder={1}
      >
        <planeGeometry args={[60, 15]} />
        <meshBasicMaterial
          map={titleTex}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Volumetric warm light beam in the gap — a tall, additive,
          warm rectangle that scales with the opening */}
      <mesh ref={beamRef} position={[0, 0, -0.3]} renderOrder={1}>
        <planeGeometry args={[1, DOOR_H + 6]} />
        <meshBasicMaterial
          color="#FFC080"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Inner gates — sit behind the primaries (z = -2.4) */}
      <group position={[0, 0, -2.4]}>
        <InnerGate side={-1} groupRef={innerLeftRef} />
        <InnerGate side={1} groupRef={innerRightRef} />
      </group>

      {/* Primary armored doors */}
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

      {/* Dust billows at the seam */}
      <points ref={dustRef} geometry={dustGeom} position={[0, 0, 0.1]}>
        <pointsMaterial
          size={1.2}
          color="#E8C8A0"
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Backlit slit while doors are mostly closed */}
      <mesh ref={slitRef} position={[0, 0, -0.05]}>
        <planeGeometry args={[0.6, DOOR_H]} />
        <meshBasicMaterial
          color="#FFD8A0"
          toneMapped={false}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Floor reflection plate — a low subtle warm strip in front of
          the doors so the seam light "spills" onto the tarmac */}
      <mesh
        position={[0, -DOOR_H / 2 - 0.5, 6]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[DOOR_W * 1.4, 14]} />
        <meshBasicMaterial
          color="#FFB070"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
