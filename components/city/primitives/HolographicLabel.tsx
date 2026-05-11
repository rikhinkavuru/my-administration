"use client";
/**
 * HolographicLabel
 * ----------------
 * A billboarded text panel attached to a world position. Renders as a
 * single transparent plane with a CanvasTexture so we keep the Geist /
 * Kode Mono typography that the rest of the site uses, embedded inside
 * the 3D scene (no DOM overlays, no react-three-drei dependency).
 *
 * Three text tiers per label:
 *   - kicker: small mono uppercase line at the top (e.g. "DISTRICT 02 / 06 — ENERGY")
 *   - heading: large display word
 *   - body: short paragraph (wraps to 28-char-ish lines)
 *
 * The plane billboards toward the camera but is anchored at `position`,
 * with a thin red rule along the left edge — same visual language as the
 * rest of the site's hairline cards.
 */
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { CityProgressRef } from "../useCityProgress";

const PANEL_W = 22;
const PANEL_H = 11;
const TEX_W = 1024;
const TEX_H = 512;

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const test = current ? current + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export default function HolographicLabel({
  position,
  kicker,
  heading,
  body,
  pillar,
  progressRef,
  visibleRange,
}: {
  position: [number, number, number];
  kicker: string;
  heading: string;
  body: string;
  pillar?: string; // optional italic hero phrase
  progressRef: CityProgressRef;
  visibleRange: [number, number]; // [startProgress, endProgress] when this label is visible
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = TEX_W;
    canvas.height = TEX_H;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, TEX_W, TEX_H);

    // Faint backing panel — translucent #000 with a 1px hairline border
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(20, 20, TEX_W - 40, TEX_H - 40);
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, TEX_W - 40, TEX_H - 40);

    // Red left rail
    ctx.fillStyle = "#D63D44";
    ctx.fillRect(20, 20, 4, TEX_H - 40);

    // Red corner brackets
    ctx.strokeStyle = "#D63D44";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 36); ctx.lineTo(40, 56); ctx.moveTo(40, 36); ctx.lineTo(60, 36);
    ctx.moveTo(TEX_W - 40, TEX_H - 36); ctx.lineTo(TEX_W - 40, TEX_H - 56);
    ctx.moveTo(TEX_W - 40, TEX_H - 36); ctx.lineTo(TEX_W - 60, TEX_H - 36);
    ctx.stroke();

    // Kicker (mono)
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "500 22px 'Kode Mono', 'Geist Mono', ui-monospace, monospace";
    ctx.textBaseline = "top";
    ctx.fillText(kicker, 56, 50);

    // Tick (red)
    ctx.fillStyle = "#D63D44";
    ctx.fillRect(56, 86, 40, 2);

    // Heading (display, white)
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 84px 'Geist Sans', ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(heading, 56, 110);

    // Optional pillar italic phrase
    let yBody = 220;
    if (pillar) {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = "italic 40px 'Noto Serif', Georgia, serif";
      ctx.fillText(pillar, 56, 210);
      yBody = 280;
    }

    // Body (Geist Sans, 60% white, wrapped)
    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.font = "400 26px 'Geist Sans', ui-sans-serif, system-ui, sans-serif";
    const lines = wrapLines(ctx, body, TEX_W - 120);
    let y = yBody;
    for (const line of lines.slice(0, 5)) {
      ctx.fillText(line, 56, y);
      y += 36;
    }

    // Bottom mono footer
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "500 18px 'Kode Mono', 'Geist Mono', ui-monospace, monospace";
    ctx.fillText("PLATFORM // SACKETT KAVURU 2028", 56, TEX_H - 56);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [kicker, heading, body, pillar]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ camera }) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;
    // Billboard
    mesh.lookAt(camera.position);
    // Fade based on visibleRange — sharp on, soft off.
    const p = progressRef.current?.progress ?? 0;
    const [a, b] = visibleRange;
    const center = (a + b) / 2;
    const halfSpan = (b - a) / 2;
    const d = Math.abs(p - center) / halfSpan;
    const opacity = Math.max(0, Math.min(1, 1.6 - 1.6 * d));
    mat.opacity = opacity;
    mesh.visible = opacity > 0.01;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[PANEL_W, PANEL_H]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
