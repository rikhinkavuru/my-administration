"use client";
/**
 * Doors
 * -----
 * Monumental architectural threshold at z=0. Two symmetric panels part
 * with precision and weight to reveal the city corridor behind.
 *
 * Design ethos: sleek, minimal, luxurious — not industrial-chaotic.
 *   - Dark anodized face (low metalness, mid roughness) with picked-up
 *     env reflections.
 *   - Polished steel chamfered trim on the inner seam edge + horizontal
 *     accent groove + top/bottom cap. The chamfer is what reads as
 *     "real architectural detailing" without bolts/ribs/chevrons.
 *   - A single thin red emissive light line down the inner seam.
 *   - "THE PLATFORM" wordmark on a deep back wall, fades up as the
 *     panels part.
 *   - A narrow warm-white volumetric beam in the widening gap.
 *   - A handful of fine drifting motes near the seam (replaces the old
 *     billowing dust + spark systems).
 *
 * Motion: easeInOutQuint, NO oscillator settle, NO door-impact shake.
 * Camera is safe — panels exit beyond x=±28, well clear of the central
 * camera axis.
 */
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { CityProgressRef } from "./useCityProgress";
import { DOOR_END } from "./CameraRail";

const DOOR_W = 18;
const DOOR_H = 36;
const DOOR_D = 1.6;
const GROOVE_Y = DOOR_H * 0.16; // accent groove, slightly above center

function easeInOutQuint(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function DoorPanel({
  side,
  groupRef,
}: {
  side: -1 | 1;
  groupRef: React.RefObject<THREE.Group | null>;
}) {
  // Inner edge sits at local x = +DOOR_W/2 * (-side); outer edge at +DOOR_W/2 * side.
  // Each panel's origin is placed by the parent so its inner edge sits at the seam.
  return (
    <group ref={groupRef}>
      {/* Main slab — dark anodized face. envMap reflection at low
          intensity is what sells "real architecture" vs flat ambient. */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[DOOR_W, DOOR_H, DOOR_D]} />
        <meshStandardMaterial
          color="#1A1B1F"
          metalness={0.35}
          roughness={0.5}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Polished steel inner-edge chamfer. Thin vertical bar inset at
          the inner seam — catches the sun + env reflection and gives
          the panel a luxurious metallic trim along the seam. */}
      <mesh
        position={[(DOOR_W / 2 - 0.06) * -side, 0, DOOR_D / 2 - 0.04]}
        castShadow={false}
      >
        <boxGeometry args={[0.12, DOOR_H - 0.6, 0.04]} />
        <meshStandardMaterial
          color="#C6CAD2"
          metalness={0.95}
          roughness={0.18}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Thin red light line along the very inner edge, facing forward.
          Sits inside the chamfer. Emissive, NOT toneMapped so the bloom
          pass catches it cleanly. */}
      <mesh position={[(DOOR_W / 2 - 0.02) * -side, 0, DOOR_D / 2 + 0.01]}>
        <boxGeometry args={[0.04, DOOR_H - 2, 0.02]} />
        <meshBasicMaterial color="#FF4F58" toneMapped={false} />
      </mesh>

      {/* Horizontal accent groove — a single polished trim line across
          the panel face. ONE detail, not six ribs. */}
      <mesh
        position={[0, GROOVE_Y, DOOR_D / 2 + 0.01]}
        castShadow={false}
      >
        <boxGeometry args={[DOOR_W - 0.6, 0.06, 0.03]} />
        <meshStandardMaterial
          color="#9CA0A8"
          metalness={0.9}
          roughness={0.22}
          envMapIntensity={1.0}
        />
      </mesh>

      {/* Top cap — polished steel band, catches the sun. */}
      <mesh position={[0, DOOR_H / 2 - 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[DOOR_W + 0.08, 0.36, DOOR_D + 0.08]} />
        <meshStandardMaterial
          color="#B8BCC4"
          metalness={0.92}
          roughness={0.2}
          envMapIntensity={1.1}
        />
      </mesh>

      {/* Bottom cap — same trim, grounds the panel against the road. */}
      <mesh position={[0, -DOOR_H / 2 + 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[DOOR_W + 0.08, 0.36, DOOR_D + 0.08]} />
        <meshStandardMaterial
          color="#A4A8B0"
          metalness={0.92}
          roughness={0.24}
          envMapIntensity={1.0}
        />
      </mesh>

      {/* Outer side trim — a softer matching band, only visible briefly
          when the panel slides out and presents its outer edge to the
          camera. */}
      <mesh position={[(DOOR_W / 2 - 0.04) * side, 0, 0]}>
        <boxGeometry args={[0.08, DOOR_H - 0.4, DOOR_D + 0.06]} />
        <meshStandardMaterial
          color="#7C8088"
          metalness={0.85}
          roughness={0.32}
        />
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
  const beamRef = useRef<THREE.Mesh>(null!);
  const slitRef = useRef<THREE.Mesh>(null!);
  const wordmarkRef = useRef<THREE.Mesh>(null!);
  const kickerRef = useRef<THREE.Mesh>(null!);
  const motesRef = useRef<THREE.Points>(null!);
  const beamLightRef = useRef<THREE.PointLight>(null!);

  // Wordmark — "THE PLATFORM", clean Geist sans, large. Pure white on
  // transparent so the bloom doesn't pick it up while the doors are
  // closed (texture revealed only as gap widens).
  const wordmarkTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#F5F5F0";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "700 280px 'Geist Sans', ui-sans-serif, system-ui, sans-serif";
    // letter-spacing emulation: draw each letter with extra spacing
    const text = "THE PLATFORM";
    const letterSpacing = 18;
    const widths: number[] = [];
    let total = 0;
    for (const ch of text) {
      const w = ctx.measureText(ch).width;
      widths.push(w);
      total += w + letterSpacing;
    }
    total -= letterSpacing;
    let x = (c.width - total) / 2;
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], x + widths[i] / 2, c.height / 2);
      x += widths[i] + letterSpacing;
    }
    // single red underscore tick
    ctx.fillStyle = "#D63D44";
    ctx.fillRect(c.width / 2 - 60, c.height / 2 + 180, 120, 5);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Kode-Mono kicker above the wordmark: "/// PARTY PLATFORM ›››"
  const kickerTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "500 56px 'Kode Mono', ui-monospace, monospace";
    // red prefix
    const prefix = "/// ";
    const body = "PARTY PLATFORM ";
    const suffix = "›››";
    const prefixW = ctx.measureText(prefix).width;
    const bodyW = ctx.measureText(body).width;
    const suffixW = ctx.measureText(suffix).width;
    const total = prefixW + bodyW + suffixW;
    let x = (c.width - total) / 2;
    ctx.fillStyle = "#D63D44";
    ctx.fillText(prefix, x + prefixW / 2, c.height / 2);
    x += prefixW;
    ctx.fillStyle = "#D8D8D2";
    ctx.fillText(body, x + bodyW / 2, c.height / 2);
    x += bodyW;
    ctx.fillStyle = "#D8D8D2";
    ctx.fillText(suffix, x + suffixW / 2, c.height / 2);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Minimal floating motes — replaces the old dust + spark systems.
  // 24 fine particles drifting upward through the seam, additive, tiny.
  const moteGeom = useMemo(() => {
    const N = 24;
    const positions = new Float32Array(N * 3);
    const seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * DOOR_H;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      seeds[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));
    return g;
  }, []);

  useFrame((_, dt) => {
    const p = progressRef.current?.progress ?? 0;
    const dp = Math.min(1, Math.max(0, p / DOOR_END));
    const e = easeInOutQuint(dp); // 0 -> 1 over the door zone

    // Slide each panel apart by up to DOOR_W/2 + 4 = 13 units locally.
    // After DOOR_END (camera flying through), keep accelerating the slide
    // so the panels exit the frame and never clip the camera or finale
    // geometry behind.
    const baseSlide = e * (DOOR_W / 2 + 4);
    const postSlide =
      p > DOOR_END ? Math.min(1, (p - DOOR_END) * 6) * 28 : 0;
    const totalSlide = baseSlide + postSlide;

    if (leftRef.current) {
      leftRef.current.position.x = -DOOR_W / 2 - totalSlide;
    }
    if (rightRef.current) {
      rightRef.current.position.x = DOOR_W / 2 + totalSlide;
    }

    // Backlit slit while the doors are still very close together —
    // a thin warm sliver of light at the seam. Fades out as the gap
    // widens and the volumetric beam takes over.
    if (slitRef.current) {
      const mat = slitRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - dp * 1.4);
    }

    // Volumetric warm beam in the gap. Width scales with the opening,
    // opacity peaks mid-open then fades as camera passes through.
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      const w = Math.max(0.04, e * (DOOR_W * 0.7));
      beamRef.current.scale.x = w;
      const post = Math.max(0, p - DOOR_END);
      mat.opacity = Math.min(0.6, e * 0.85) * Math.max(0, 1 - post * 14);
    }

    // Off-camera point light at the seam, scaled with gap. Adds a
    // believable warm bounce onto the inner panel edges + the road in
    // front of the doors.
    if (beamLightRef.current) {
      const post = Math.max(0, p - DOOR_END);
      beamLightRef.current.intensity =
        Math.min(20, e * 28) * Math.max(0, 1 - post * 12);
    }

    // Wordmark + kicker fade up as the gap reveals them.
    if (wordmarkRef.current) {
      const mat = wordmarkRef.current.material as THREE.MeshBasicMaterial;
      const intro = Math.max(0, (dp - 0.25) / 0.6);
      const fade = Math.max(0, 1 - Math.max(0, p - DOOR_END) * 18);
      mat.opacity = Math.min(1, intro) * fade;
    }
    if (kickerRef.current) {
      const mat = kickerRef.current.material as THREE.MeshBasicMaterial;
      const intro = Math.max(0, (dp - 0.35) / 0.5);
      const fade = Math.max(0, 1 - Math.max(0, p - DOOR_END) * 18);
      mat.opacity = Math.min(0.9, intro) * fade;
    }

    // Motes — gentle upward drift, fade with door progress, hidden once
    // camera is past the threshold.
    if (motesRef.current) {
      const mat = motesRef.current.material as THREE.PointsMaterial;
      const breath = dp > 0.08 ? Math.min(1, (dp - 0.08) * 1.2) : 0;
      const fadeAway = Math.max(0, 1 - Math.max(0, p - DOOR_END) * 10);
      mat.opacity = 0.55 * breath * fadeAway;
      const posAttr = moteGeom.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        posAttr.array[i * 3 + 1] += dt * 0.6;
        if (posAttr.array[i * 3 + 1] > DOOR_H / 2 + 2) {
          posAttr.array[i * 3 + 1] = -DOOR_H / 2;
          posAttr.array[i * 3 + 0] = (Math.random() - 0.5) * 0.6;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    // Group origin sits at mid-door height; door geometry centers on this.
    <group position={[0, DOOR_H / 2 - 1, 0]}>
      {/* Deep back chamber wall — gives the reveal real depth and a
          surface for the wordmark to read against. Sits well behind the
          doors (z = -54) so the camera passes wordmark plane (z = -32)
          well before reaching this wall, which is removed (alpha-faded)
          by the time the camera arrives. */}
      <mesh position={[0, -DOOR_H / 2 + 8, -54]}>
        <planeGeometry args={[140, DOOR_H * 1.4]} />
        <meshStandardMaterial
          color="#15161A"
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>

      {/* "// PARTY PLATFORM >>>" kicker above the wordmark. */}
      <mesh
        ref={kickerRef}
        position={[0, 6.5, -32]}
        renderOrder={1}
      >
        <planeGeometry args={[28, 3.5]} />
        <meshBasicMaterial
          map={kickerTex}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* "THE PLATFORM" wordmark — large, clean Geist, white on transparent. */}
      <mesh
        ref={wordmarkRef}
        position={[0, 1.5, -32]}
        renderOrder={1}
      >
        <planeGeometry args={[52, 13]} />
        <meshBasicMaterial
          map={wordmarkTex}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Volumetric warm beam in the gap — narrow, additive, scales with
          the opening. */}
      <mesh ref={beamRef} position={[0, 0, -0.4]} renderOrder={1}>
        <planeGeometry args={[1, DOOR_H + 4]} />
        <meshBasicMaterial
          color="#FFE8C4"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Warm bounce light at the seam — makes the inner panel chamfers
          glow with reflected warmth as the doors part. */}
      <pointLight
        ref={beamLightRef}
        position={[0, 0, -0.5]}
        color={"#FFE0B0"}
        intensity={0}
        distance={30}
        decay={2}
      />

      {/* Backlit slit while the doors are nearly closed — a thin warm
          sliver that smoothly hands off to the volumetric beam. */}
      <mesh ref={slitRef} position={[0, 0, -0.05]} renderOrder={1}>
        <planeGeometry args={[0.18, DOOR_H - 0.6]} />
        <meshBasicMaterial
          color="#FFD8A0"
          toneMapped={false}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>

      {/* Primary panels */}
      <DoorPanel side={-1} groupRef={leftRef} />
      <DoorPanel side={1} groupRef={rightRef} />

      {/* Minimal motes drifting through the seam. */}
      <points ref={motesRef} geometry={moteGeom} position={[0, 0, 0]}>
        <pointsMaterial
          size={0.09}
          color="#FFEFC8"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      {/* Warm spill on the road right at the threshold — sells the beam
          as a real light source escaping the seam. */}
      <mesh
        position={[0, -DOOR_H / 2 - 0.6, 4]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[DOOR_W * 1.6, 12]} />
        <meshBasicMaterial
          color="#FFC890"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
