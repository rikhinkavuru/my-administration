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
/**
 * Banner texture is 10:1, sized so the bold sans message fits with margin.
 * Font size is chosen to leave generous safe-area padding on both sides so
 * the message remains readable under any wave displacement.
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

  // Inner hairlines
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.fillRect(0, 14, canvas.width, 1);
  ctx.fillRect(0, canvas.height - 15, canvas.width, 1);

  const cy = canvas.height / 2;
  const fontStack =
    "700 134px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.font = fontStack;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const left = "VOTE SACKETT ";
  const slash = "/";
  const right = " KAVURU 2028";
  const wL = ctx.measureText(left).width;
  const wS = ctx.measureText(slash).width;
  const wR = ctx.measureText(right).width;
  const total = wL + wS + wR;
  const startX = (canvas.width - total) / 2;

  // Horizontal condensation: scale text to 82% of natural width about the
  // canvas center, preserving full character height. Same effect as a
  // condensed font weight, without depending on a system font being
  // installed.
  const COMPRESS = 0.82;
  ctx.save();
  ctx.translate(canvas.width / 2, 0);
  ctx.scale(COMPRESS, 1);
  ctx.translate(-canvas.width / 2, 0);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(left, startX, cy);
  ctx.fillStyle = "#D63D44";
  ctx.fillText(slash, startX + wL, cy);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(right, startX + wL + wS, cy);

  ctx.restore();

  // Soft edge vignettes
  const vL = ctx.createLinearGradient(0, 0, 100, 0);
  vL.addColorStop(0, "rgba(0,0,0,0.55)");
  vL.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = vL;
  ctx.fillRect(0, 0, 100, canvas.height);
  const vR = ctx.createLinearGradient(canvas.width, 0, canvas.width - 100, 0);
  vR.addColorStop(0, "rgba(0,0,0,0.55)");
  vR.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = vR;
  ctx.fillRect(canvas.width - 100, 0, 100, canvas.height);

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

  // Plane local: 8 wide x 1 tall, hung directly below the jet.
  // Multi-harmonic wave for a more organic, flowy ripple. Mass is weighted
  // to the bottom edge so the cloth pivots from the cable line rather than
  // rippling off the top. Drape ramps amplitude from 0 at the cables
  // (uv.y ~ 1) to full at the bottom edge (uv.y ~ 0).
  const vertexShader = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 p = position;
      float drape = pow(1.0 - uv.y, 1.3);
      // Two interfering Z-axis ripples + a slow long-wavelength sway
      float w1 = sin(p.x * 1.1 + uTime * 1.5) * 0.18 * drape;
      float w2 = sin(p.x * 2.3 - uTime * 1.0 + p.y * 1.6) * 0.08 * drape;
      float w3 = sin(p.x * 0.55 + uTime * 0.9) * 0.07 * drape;
      p.z += w1 + w2 + w3;
      // Y modulates so the bottom hem flutters
      p.y += sin(p.x * 1.4 + uTime * 1.8) * 0.05 * drape;
      p.y -= (1.0 - abs(p.x) / 4.0) * 0.07 * drape;
      // Small X sway so the cloth feels alive
      p.x += sin(p.y * 2.0 + uTime * 0.7) * 0.03 * drape;
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

  // Banner now hangs directly beneath the jet (instead of trailing behind
  // it), suspended from two cables. This keeps the banner co-located with
  // the jet on screen for the full diagonal sweep — the banner becomes
  // visible the moment the jet enters the viewport rather than appearing
  // to lag a beat behind.
  return (
    <mesh position={[0, -2.0, 0]}>
      <planeGeometry args={[8, 1, 32, 10]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
