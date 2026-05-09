"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float, Torus, Environment } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

/**
 * Constellation of 50 stars (one per state) rotating slowly in 3D,
 * with a soft cream polestar and two gold orbiting rings.
 * Replaces the previous red icosahedron.
 */

function Polestar() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = 1.0 + Math.sin(t * 1.4) * 0.18;
    ref.current.scale.setScalar(1 + Math.sin(t * 1.0) * 0.04);
  });
  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshStandardMaterial
          color="#FFF6E6"
          emissive="#FFE3B5"
          emissiveIntensity={1.0}
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>
      {/* Soft halo */}
      <mesh>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshBasicMaterial color="#FFD6A0" transparent opacity={0.10} depthWrite={false} />
      </mesh>
    </Float>
  );
}

function StateStars() {
  // Deterministic positions for 50 stars on a slightly oblate sphere
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    const N = 50;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const r = 2.4 + ((i * 53) % 7) * 0.06; // slight depth jitter
      arr.push([
        Math.cos(theta) * radius * r,
        y * r * 0.9,
        Math.sin(theta) * radius * r,
      ]);
    }
    return arr;
  }, []);

  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.06;
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <Star key={i} position={p} seed={i} />
      ))}
    </group>
  );
}

function Star({ position, seed }: { position: [number, number, number]; seed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const m = ref.current.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = 0.55 + Math.sin(t * 1.2 + seed * 0.7) * 0.35;
    const s = 1 + Math.sin(t * 0.9 + seed * 0.5) * 0.15;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.04, 12, 12]} />
      <meshStandardMaterial
        color="#F2EFE6"
        emissive="#F2EFE6"
        emissiveIntensity={0.7}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

function GoldRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (r1.current) {
      r1.current.rotation.x += delta * 0.05;
      r1.current.rotation.z -= delta * 0.07;
    }
    if (r2.current) {
      r2.current.rotation.y += delta * 0.04;
      r2.current.rotation.x -= delta * 0.03;
    }
  });
  return (
    <group>
      <Torus ref={r1} args={[1.45, 0.006, 16, 200]} rotation={[Math.PI / 2.4, 0, 0]}>
        <meshStandardMaterial
          color="#C9A227"
          emissive="#C9A227"
          emissiveIntensity={0.45}
          metalness={0.9}
          roughness={0.25}
        />
      </Torus>
      <Torus ref={r2} args={[1.85, 0.004, 16, 200]} rotation={[Math.PI / 2, 0.6, 0]}>
        <meshStandardMaterial
          color="#F2EFE6"
          emissive="#C9A227"
          emissiveIntensity={0.20}
          metalness={0.6}
          roughness={0.4}
        />
      </Torus>
    </group>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6.5], fov: 38 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={1.4} color="#FFE3B5" distance={6} decay={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#FFD9C0" />
      <Suspense fallback={null}>
        <Environment preset="night" />
        <Polestar />
        <GoldRings />
        <StateStars />
        {/* Background sparkles for depth */}
        <Sparkles count={120} scale={[10, 10, 10]} size={1.5} speed={0.25} color="#F2EFE6" opacity={0.55} />
      </Suspense>
    </Canvas>
  );
}
