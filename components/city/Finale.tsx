"use client";
/**
 * Finale: a billboarded "SACKETT / KAVURU 2028" wordmark high above the
 * skyline that fades up during the last ~6% of progress as the camera
 * rises into the aerial pull-back.
 *
 * Pure CanvasTexture on a plane — no DOM overlay, no extra deps.
 */
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { CityProgressRef } from "./useCityProgress";
import { FINALE_START } from "./CameraRail";

export default function Finale({ progressRef }: { progressRef: CityProgressRef }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Wordmark
    ctx.fillStyle = "#FFFFFF";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "700 220px 'Geist Sans', ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("SACKETT / KAVURU", canvas.width / 2, 360);

    // Year — italic serif
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "italic 200px 'Noto Serif', Georgia, serif";
    ctx.fillText("2028", canvas.width / 2, 580);

    // Red rule
    ctx.fillStyle = "#D63D44";
    ctx.fillRect(canvas.width / 2 - 100, 700, 200, 4);

    // Tagline
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "500 44px 'Kode Mono', ui-monospace, monospace";
    ctx.fillText("READ THE FULL PLATFORM →", canvas.width / 2, 780);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }, []);

  useFrame(({ camera }) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;
    const p = progressRef.current?.progress ?? 0;
    const t = Math.max(0, Math.min(1, (p - FINALE_START) / (1 - FINALE_START)));
    mat.opacity = t * t * (3 - 2 * t);
    mesh.visible = mat.opacity > 0.01;
    // Billboard
    mesh.lookAt(camera.position);
  });

  return (
    <mesh ref={meshRef} position={[0, 80, -1100]}>
      <planeGeometry args={[110, 55]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
