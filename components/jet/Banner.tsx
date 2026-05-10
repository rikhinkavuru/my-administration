"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

/**
 * Stylish trailing campaign banner — the kind small planes tow over
 * stadiums and beaches. Procedurally drawn on a CanvasTexture (no asset
 * loading). The same vertex-shader cloth motion ripples the banner
 * with amplitude scaling from the leading edge so it stays anchored
 * behind the jet's tail and waves harder toward the trailing edge.
 *
 * Visual: dark gradient field bordered top + bottom by thin red accent
 * stripes, with bold sans "VOTE  SACKETT / KAVURU  2028" centered in
 * white — except the slash, which is rendered in oxblood to mirror
 * the campaign wordmark used elsewhere in the site.
 */
function makeBannerTexture(): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Subtle vertical gradient background
  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, "#0E1014");
  bg.addColorStop(0.5, "#15171C");
  bg.addColorStop(1, "#0A0B0F");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top + bottom oxblood accent stripes
  ctx.fillStyle = "#D63D44";
  ctx.fillRect(0, 0, canvas.width, 5);
  ctx.fillRect(0, canvas.height - 5, canvas.width, 5);

  // Inner thin hairlines
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.fillRect(0, 14, canvas.width, 1);
  ctx.fillRect(0, canvas.height - 15, canvas.width, 1);

  // TEXT — bold uppercase sans, with red slash separator
  const fontStack =
    "700 138px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.font = fontStack;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const left = "VOTE   SACKETT ";
  const slash = "/";
  const right = " KAVURU   2028";

  const wL = ctx.measureText(left).width;
  const wS = ctx.measureText(slash).width;
  const wR = ctx.measureText(right).width;
  const total = wL + wS + wR;
  const startX = (canvas.width - total) / 2;
  const cy = canvas.height / 2;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(left, startX, cy);
  ctx.fillStyle = "#D63D44";
  ctx.fillText(slash, startX + wL, cy);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(right, startX + wL + wS, cy);

  // Edge vignettes so the banner reads cleanly against any background
  const vL = ctx.createLinearGradient(0, 0, 80, 0);
  vL.addColorStop(0, "rgba(0,0,0,0.55)");
  vL.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = vL;
  ctx.fillRect(0, 0, 80, canvas.height);
  const vR = ctx.createLinearGradient(canvas.width, 0, canvas.width - 80, 0);
  vR.addColorStop(0, "rgba(0,0,0,0.55)");
  vR.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = vR;
  ctx.fillRect(canvas.width - 80, 0, 80, canvas.height);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export default function Banner() {
  const texture = useMemo(() => makeBannerTexture(), []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uMap: { value: texture } }),
    [texture]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  if (!texture) return null;

  // Plane local: 8 wide x 1 tall (8:1, matches texture). Leading edge at
  // local +4 (anchor near jet's tail), trailing edge at local -4. Wave
  // amplitude scales 0..1 from leading to trailing.
  const vertexShader = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 p = position;
      float t = clamp((4.0 - p.x) / 8.0, 0.0, 1.0);
      float wave1 = sin(p.x * 3.5 + uTime * 6.5) * 0.18 * t;
      float wave2 = sin(p.x * 5.0 - uTime * 4.5 + p.y * 3.0) * 0.08 * t;
      p.y += wave1 + wave2;
      p.z += sin(p.x * 4.0 + uTime * 5.5) * 0.20 * t;
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
    <mesh position={[-7, -0.18, 0]}>
      <planeGeometry args={[8, 1, 24, 6]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
