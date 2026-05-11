"use client";
/**
 * CityBlock
 * ---------
 * One instanced field of buildings. A single `THREE.InstancedMesh` of a
 * box geometry, plus a SECOND instanced mesh of thinner boxes used as
 * emissive window-band caps stacked on top of each tower.
 *
 * Per-instance color is sampled deterministically from a curated palette
 * (warm concrete, cool concrete, glass-blue, dark steel, brick) via
 * `instanceColor` so the city reads as a varied SKYLINE rather than a
 * single grey blob. Heights/footprints stay seed-deterministic.
 */
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

// Curated city palette — variation without losing the cinematic warm/cool
// read. Each district can override via `palette` to skew toward their tone
// (e.g. defense → cool blue-grey, healthcare → cleaner whites).
export const DEFAULT_BUILDING_PALETTE = [
  "#C4B5A3", // warm concrete
  "#8A95A6", // cool concrete
  "#5C7894", // glass blue
  "#3D434E", // dark steel
  "#8E4F3F", // brick
  "#A89682", // sandstone
  "#6E7889", // bluish slate
];

export type CityBlockProps = {
  center: [number, number, number];
  extent: [number, number]; // x-extent, z-extent
  count: number;
  seed: number;
  heightRange: [number, number];
  /** @deprecated Use `palette` for per-instance variation. Kept as a
   *  fallback tint multiplier. */
  baseColor: string;
  capColor: string;
  capEmissive: string;
  capEmissiveIntensity?: number;
  /** Optional palette of base colors sampled per-instance. */
  palette?: string[];
  /** Material tuning per district. */
  metalness?: number;
  roughness?: number;
  // Optional: skip buildings whose XZ falls within this radius of `keepOut`
  // (used to carve a road through the middle for the camera).
  keepOut?: { x: number; z: number; radius: number };
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE_GEOM = new THREE.BoxGeometry(1, 1, 1);
const CAP_GEOM = new THREE.BoxGeometry(1, 0.08, 1);

export default function CityBlock(props: CityBlockProps) {
  const baseRef = useRef<THREE.InstancedMesh>(null!);
  const capRef = useRef<THREE.InstancedMesh>(null!);

  const palette = props.palette ?? DEFAULT_BUILDING_PALETTE;

  const { matrices, capMatrices, colors, capColors } = useMemo(() => {
    const rnd = mulberry32(props.seed);
    const dummy = new THREE.Object3D();
    const ms: THREE.Matrix4[] = [];
    const cs: THREE.Matrix4[] = [];
    const cols: THREE.Color[] = [];
    const capCols: THREE.Color[] = [];
    const tint = new THREE.Color(props.baseColor);
    const palettesColors = palette.map((c) => new THREE.Color(c));
    const capTint = new THREE.Color(props.capColor);
    const [cx, cy, cz] = props.center;
    const [ex, ez] = props.extent;
    const [hMin, hMax] = props.heightRange;
    let placed = 0;
    let attempts = 0;
    while (placed < props.count && attempts < props.count * 4) {
      attempts++;
      const x = cx + (rnd() - 0.5) * ex * 2;
      const z = cz + (rnd() - 0.5) * ez * 2;
      // Carve a corridor
      if (props.keepOut) {
        const dx = x - props.keepOut.x;
        const dz = z - props.keepOut.z;
        if (Math.sqrt(dx * dx + dz * dz) < props.keepOut.radius) continue;
      }
      const w = 1.6 + rnd() * 3.6;
      const d = 1.6 + rnd() * 3.6;
      const h = hMin + rnd() * (hMax - hMin);
      // Building base
      dummy.position.set(x, cy + h / 2, z);
      dummy.scale.set(w, h, d);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      ms.push(dummy.matrix.clone());

      // Per-instance color: sampled from palette, then nudged by the
      // legacy `baseColor` so districts can desaturate or warm the field.
      const pc = palettesColors[Math.floor(rnd() * palettesColors.length)];
      const variance = 0.85 + rnd() * 0.3;
      const col = pc.clone().multiplyScalar(variance);
      // Light blend toward tint for district mood (15%)
      col.lerp(tint, 0.15);
      cols.push(col);

      // Emissive cap on top — only some buildings get one (lit night look)
      if (rnd() < 0.78) {
        dummy.position.set(x, cy + h + 0.05, z);
        dummy.scale.set(w * 0.95, 1, d * 0.95);
        dummy.updateMatrix();
        cs.push(dummy.matrix.clone());
        // Cap color slight variation around capColor
        const cc = capTint.clone().multiplyScalar(0.9 + rnd() * 0.25);
        capCols.push(cc);
      }
      placed++;
    }
    return { matrices: ms, capMatrices: cs, colors: cols, capColors: capCols };
  }, [
    props.seed,
    props.count,
    props.center,
    props.extent,
    props.heightRange,
    props.keepOut,
    props.baseColor,
    props.capColor,
    palette,
  ]);

  useEffect(() => {
    const base = baseRef.current;
    const cap = capRef.current;
    if (!base || !cap) return;
    matrices.forEach((m, i) => base.setMatrixAt(i, m));
    capMatrices.forEach((m, i) => cap.setMatrixAt(i, m));
    colors.forEach((c, i) => base.setColorAt(i, c));
    capColors.forEach((c, i) => cap.setColorAt(i, c));
    base.count = matrices.length;
    cap.count = capMatrices.length;
    base.instanceMatrix.needsUpdate = true;
    cap.instanceMatrix.needsUpdate = true;
    if (base.instanceColor) base.instanceColor.needsUpdate = true;
    if (cap.instanceColor) cap.instanceColor.needsUpdate = true;
  }, [matrices, capMatrices, colors, capColors]);

  return (
    <>
      <instancedMesh
        ref={baseRef}
        args={[BASE_GEOM, undefined, Math.max(1, matrices.length)]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#ffffff"
          metalness={props.metalness ?? 0.22}
          roughness={props.roughness ?? 0.68}
        />
      </instancedMesh>
      <instancedMesh
        ref={capRef}
        args={[CAP_GEOM, undefined, Math.max(1, capMatrices.length)]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#ffffff"
          emissive={props.capEmissive}
          emissiveIntensity={props.capEmissiveIntensity ?? 1.6}
          metalness={0.25}
          roughness={0.42}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}
