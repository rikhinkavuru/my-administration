"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Icosahedron, Torus } from "@react-three/drei";
import { useRef, Suspense } from "react";
import type { Mesh } from "three";

function Monument() {
  const ico = useRef<Mesh>(null);
  const torus = useRef<Mesh>(null);
  const torus2 = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (ico.current) {
      ico.current.rotation.x += delta * 0.10;
      ico.current.rotation.y += delta * 0.16;
    }
    if (torus.current) {
      torus.current.rotation.x += delta * 0.05;
      torus.current.rotation.z -= delta * 0.10;
      const t = state.clock.getElapsedTime();
      torus.current.position.y = Math.sin(t * 0.5) * 0.06;
    }
    if (torus2.current) {
      torus2.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group>
      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.9}>
        <Icosahedron ref={ico} args={[0.95, 1]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#C45561"
            roughness={0.22}
            metalness={0.6}
            distort={0.28}
            speed={1.4}
            envMapIntensity={1.0}
          />
        </Icosahedron>
      </Float>
      <Torus ref={torus} args={[1.7, 0.008, 16, 200]} position={[0, 0, -0.3]} rotation={[Math.PI / 2.6, 0, 0]}>
        <meshStandardMaterial color="#C9A227" roughness={0.25} metalness={0.85} emissive="#C9A227" emissiveIntensity={0.20} />
      </Torus>
      <Torus ref={torus2} args={[2.05, 0.005, 16, 200]} position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0.8, 0]}>
        <meshStandardMaterial color="#F2EFE6" roughness={0.4} metalness={0.5} emissive="#C45561" emissiveIntensity={0.10} />
      </Torus>
    </group>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 7.5], fov: 32 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} color="#FFD9C0" />
      <directionalLight position={[-4, -2, -3]} intensity={0.55} color="#7B6CFF" />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Monument />
      </Suspense>
    </Canvas>
  );
}
