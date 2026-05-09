"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Icosahedron, Torus } from "@react-three/drei";
import { useRef, Suspense } from "react";
import type { Mesh } from "three";

function Monument() {
  const ico = useRef<Mesh>(null);
  const torus = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (ico.current) {
      ico.current.rotation.x += delta * 0.12;
      ico.current.rotation.y += delta * 0.18;
    }
    if (torus.current) {
      torus.current.rotation.x += delta * 0.05;
      torus.current.rotation.z -= delta * 0.10;
      const t = state.clock.getElapsedTime();
      torus.current.position.y = Math.sin(t * 0.5) * 0.08;
    }
  });

  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
        <Icosahedron ref={ico} args={[1.35, 1]} position={[0, 0.05, 0]}>
          <MeshDistortMaterial
            color="#C45561"
            roughness={0.18}
            metalness={0.65}
            distort={0.32}
            speed={1.6}
            envMapIntensity={1.1}
          />
        </Icosahedron>
      </Float>
      <Torus ref={torus} args={[2.2, 0.012, 16, 200]} position={[0, 0, -0.4]} rotation={[Math.PI / 2.6, 0, 0]}>
        <meshStandardMaterial color="#C9A227" roughness={0.25} metalness={0.85} emissive="#C9A227" emissiveIntensity={0.18} />
      </Torus>
      <Torus args={[2.7, 0.006, 16, 200]} position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0.8, 0]}>
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
      camera={{ position: [0, 0, 5], fov: 38 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} color="#FFD9C0" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#7B6CFF" />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Monument />
      </Suspense>
    </Canvas>
  );
}
