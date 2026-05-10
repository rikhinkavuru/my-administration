"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

/**
 * American flag trailing the jet's tail. Shader-driven cloth motion (no
 * physics solver). The procedural canvas texture renders 13 stripes + 50
 * stars in the correct 9-row alternating 6/5 pattern. Vertex shader applies
 * two interfering sine waves whose amplitude scales with distance from the
 * leading edge, so the hoist edge stays anchored to the jet while the fly
 * edge ripples in Y and Z.
 */
function makeFlagTexture(): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 13 stripes (Old Glory red / white)
  const stripeH = canvas.height / 13;
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#B22234" : "#FFFFFF";
    ctx.fillRect(0, i * stripeH, canvas.width, stripeH + 1);
  }

  // Canton (blue, 7 stripes tall, 2/5 width)
  const cantonW = canvas.width * (2 / 5);
  const cantonH = stripeH * 7;
  ctx.fillStyle = "#3C3B6E";
  ctx.fillRect(0, 0, cantonW, cantonH);

  // 50 stars in 9 rows of alternating 6/5/6/5/6/5/6/5/6 = 50 total
  ctx.fillStyle = "#FFFFFF";
  const drawStar = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const radius = i % 2 === 0 ? r : r * 0.4;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };
  const rH = cantonH / 10;
  const cW = cantonW / 12;
  const starR = Math.min(rH, cW) * 0.42;
  for (let row = 0; row < 9; row++) {
    const y = rH * (row + 1);
    const isOdd = row % 2 === 0;
    const numStars = isOdd ? 6 : 5;
    const startCol = isOdd ? 1 : 2;
    for (let s = 0; s < numStars; s++) {
      drawStar(cW * (startCol + s * 2), y, starR);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export default function Flag() {
  const texture = useMemo(() => makeFlagTexture(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMap: { value: texture },
    }),
    [texture]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  if (!texture) return null;

  const vertexShader = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 p = position;
      float t = clamp((1.75 - p.x) / 3.5, 0.0, 1.0);
      float wave1 = sin(p.x * 3.5 + uTime * 7.0) * 0.20 * t;
      float wave2 = sin(p.x * 5.5 - uTime * 5.0 + p.y * 2.5) * 0.10 * t;
      p.y += wave1 + wave2;
      p.z += sin(p.x * 4.0 + uTime * 6.0) * 0.22 * t;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform sampler2D uMap;
    varying vec2 vUv;
    void main() {
      gl_FragColor = texture2D(uMap, vUv);
    }
  `;

  return (
    <mesh position={[-4.25, -0.18, 0]}>
      <planeGeometry args={[3.5, 2.0, 36, 18]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
