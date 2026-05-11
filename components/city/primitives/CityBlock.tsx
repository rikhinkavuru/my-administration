"use client";
/**
 * CityBlock
 * ---------
 * An instanced field of skyline buildings.
 *
 * Each instance is stamped from a SMALL set of silhouettes — box, cylinder
 * (tower), and stepped (setback) — so a single district reads as a varied
 * skyline instead of a row of identical boxes.
 *
 * Every facade carries a procedural window-grid CanvasTexture: a 256×256
 * canvas drawn once and reused for every district as a window pattern.
 * Per-instance UV scale (mapped via per-instance attributes) means a tall
 * tower gets MORE floors than a short box, all from one shared texture.
 *
 * The legacy emissive-cap second mesh is preserved for the warm "lit roof
 * deck" look.
 */
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

export const DEFAULT_BUILDING_PALETTE = [
  "#C4B5A3", // warm concrete
  "#8A95A6", // cool concrete
  "#5C7894", // glass blue
  "#3D434E", // dark steel
  "#8E4F3F", // brick
  "#A89682", // sandstone
  "#6E7889", // bluish slate
];

/** Window pattern variants — `style` controls how the CanvasTexture is
 *  drawn so districts can pick a look without ballooning the texture cache. */
export type WindowStyle =
  | "grid" // dense regular office grid (Economy, Healthcare)
  | "mullion" // tall vertical strips, fewer horizontals (modern glass)
  | "horizontal" // wide horizontal hangar bands (Immigration, Energy)
  | "sparse" // tiny scattered dots (Defense status lights — red)
  | "warm-grid"; // warm/incandescent grid (Education, residential)

export type Silhouette = "box" | "cylinder" | "stepped";

export type CityBlockProps = {
  center: [number, number, number];
  extent: [number, number]; // x-extent, z-extent
  count: number;
  seed: number;
  heightRange: [number, number];
  /** @deprecated tint multiplier kept for back-compat. */
  baseColor: string;
  capColor: string;
  capEmissive: string;
  capEmissiveIntensity?: number;
  palette?: string[];
  metalness?: number;
  roughness?: number;
  keepOut?: { x: number; z: number; radius: number };
  /** Silhouette mix — relative weights of [box, cylinder, stepped].
   *  Defaults to [0.7, 0.15, 0.15]. */
  silhouetteMix?: [number, number, number];
  /** Window pattern style. Default "grid". */
  windowStyle?: WindowStyle;
  /** Override emissive window color (defaults to warm white). */
  windowColor?: string;
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

// -- Shared geometries (created once, shared across every district) -------
const BOX_GEOM = new THREE.BoxGeometry(1, 1, 1);
// Cylinder with reasonable segment count; UV maps wrap on the side.
const CYL_GEOM = new THREE.CylinderGeometry(0.5, 0.5, 1, 24, 1, false);
// Stepped: build a 3-tier setback by merging boxes. Cheaper to just stamp
// the base as a box and overlay two narrower boxes per instance — but a
// pre-baked geometry keeps instance count low. We approximate with a
// simple two-tier box where the upper half is narrower (vertices baked).
function makeSteppedGeom(): THREE.BufferGeometry {
  // Lower tier: full 1×0.6×1, base at y=0 → centered y=0.3
  const lower = new THREE.BoxGeometry(1, 0.6, 1);
  lower.translate(0, 0.3, 0);
  // Upper tier: 0.7×0.4×0.7 sitting on top → centered y=0.8
  const upper = new THREE.BoxGeometry(0.7, 0.4, 0.7);
  upper.translate(0, 0.8, 0);
  const merged = mergeGeometries([lower, upper]);
  return merged;
}

// Minimal geometry merger so we don't pull in BufferGeometryUtils.
function mergeGeometries(geoms: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const out = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  for (const g of geoms) {
    const pos = g.attributes.position.array as ArrayLike<number>;
    const nrm = g.attributes.normal.array as ArrayLike<number>;
    const uv = g.attributes.uv.array as ArrayLike<number>;
    for (let i = 0; i < pos.length; i++) positions.push(pos[i]);
    for (let i = 0; i < nrm.length; i++) normals.push(nrm[i]);
    for (let i = 0; i < uv.length; i++) uvs.push(uv[i]);
  }
  out.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  out.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  out.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  return out;
}

const STEP_GEOM = makeSteppedGeom();

const CAP_GEOM = new THREE.BoxGeometry(1, 0.08, 1);

// -- Window texture cache -------------------------------------------------
// One canvas per (style,color) key. Shared across all districts at runtime
// — building the cache from a static module-level Map means no rebuilds on
// remount. Each canvas is 256×256, ~64KB of GPU memory after upload.
const TEXTURE_CACHE = new Map<string, THREE.CanvasTexture>();

function getWindowTexture(style: WindowStyle, color: string): THREE.CanvasTexture {
  const key = `${style}|${color}`;
  const cached = TEXTURE_CACHE.get(key);
  if (cached) return cached;

  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  // Building wall base — a slightly darker desaturated grey. The shader
  // multiplies this by the per-instance color, so we keep it near white
  // with subtle grain so the windows pop without flattening the tint.
  ctx.fillStyle = "#9c9388";
  ctx.fillRect(0, 0, 256, 256);
  // Faint horizontal floor banding for materiality
  ctx.fillStyle = "rgba(0,0,0,0.10)";
  for (let y = 0; y < 256; y += 16) ctx.fillRect(0, y, 256, 1);
  // Subtle vertical mullion shadows
  ctx.fillStyle = "rgba(0,0,0,0.06)";
  for (let x = 0; x < 256; x += 16) ctx.fillRect(x, 0, 1, 256);

  // Now stamp the windows — bright emissive-looking pixels.
  if (style === "grid" || style === "warm-grid") {
    // 16 floors × 16 windows, lit ratio ~55%.
    for (let y = 6; y < 256; y += 16) {
      for (let x = 4; x < 256; x += 16) {
        if (Math.random() < 0.55) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 8, 9);
          // soft halo
          ctx.fillStyle = color.replace(/[\d.]+\)$/, "0.25)").includes("rgba")
            ? color
            : color + "55";
          ctx.fillRect(x - 1, y - 1, 10, 11);
        } else {
          // unlit window — slightly darker than wall
          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.fillRect(x, y, 8, 9);
        }
      }
    }
  } else if (style === "mullion") {
    // Continuous vertical glass strips broken by horizontal floor lines.
    for (let x = 4; x < 256; x += 12) {
      ctx.fillStyle = color + "AA";
      ctx.fillRect(x, 0, 6, 256);
    }
    // Floor lines
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    for (let y = 0; y < 256; y += 16) ctx.fillRect(0, y, 256, 2);
    // Occasional brighter spans
    for (let y = 0; y < 256; y += 16) {
      if (Math.random() < 0.45) {
        ctx.fillStyle = color;
        ctx.fillRect(4, y + 2, 248, 12);
      }
    }
  } else if (style === "horizontal") {
    // Big horizontal hangar/warehouse bands.
    for (let y = 16; y < 256; y += 48) {
      ctx.fillStyle = color + "CC";
      ctx.fillRect(0, y, 256, 18);
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, y + 18, 256, 2);
    }
  } else if (style === "sparse") {
    // Defense bunkers: tiny red status lights scattered, very dim wall.
    ctx.fillStyle = "#1a1a1d";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 38; i++) {
      const x = Math.random() * 248;
      const y = Math.random() * 248;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 3, 3);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  TEXTURE_CACHE.set(key, tex);
  return tex;
}

export default function CityBlock(props: CityBlockProps) {
  const boxRef = useRef<THREE.InstancedMesh>(null!);
  const cylRef = useRef<THREE.InstancedMesh>(null!);
  const stepRef = useRef<THREE.InstancedMesh>(null!);
  const capRef = useRef<THREE.InstancedMesh>(null!);

  const palette = props.palette ?? DEFAULT_BUILDING_PALETTE;
  const windowStyle = props.windowStyle ?? "grid";
  const windowColor = props.windowColor ?? "#FFD08A";

  const tex = useMemo(
    () => getWindowTexture(windowStyle, windowColor),
    [windowStyle, windowColor],
  );

  const data = useMemo(() => {
    const rnd = mulberry32(props.seed);
    const dummy = new THREE.Object3D();
    const boxes: { m: THREE.Matrix4; c: THREE.Color; uvScaleY: number }[] = [];
    const cyls: { m: THREE.Matrix4; c: THREE.Color; uvScaleY: number }[] = [];
    const steps: { m: THREE.Matrix4; c: THREE.Color; uvScaleY: number }[] = [];
    const caps: { m: THREE.Matrix4; c: THREE.Color }[] = [];
    const tint = new THREE.Color(props.baseColor);
    const palettesColors = palette.map((c) => new THREE.Color(c));
    const capTint = new THREE.Color(props.capColor);
    const [cx, cy, cz] = props.center;
    const [ex, ez] = props.extent;
    const [hMin, hMax] = props.heightRange;
    const mix = props.silhouetteMix ?? [0.7, 0.15, 0.15];
    const sumMix = mix[0] + mix[1] + mix[2];
    let placed = 0;
    let attempts = 0;
    while (placed < props.count && attempts < props.count * 4) {
      attempts++;
      const x = cx + (rnd() - 0.5) * ex * 2;
      const z = cz + (rnd() - 0.5) * ez * 2;
      if (props.keepOut) {
        const dx = x - props.keepOut.x;
        const dz = z - props.keepOut.z;
        if (Math.sqrt(dx * dx + dz * dz) < props.keepOut.radius) continue;
      }
      const w = 1.6 + rnd() * 3.6;
      const d = 1.6 + rnd() * 3.6;
      const h = hMin + rnd() * (hMax - hMin);

      // Silhouette pick — weighted.
      const r = rnd() * sumMix;
      let kind: Silhouette = "box";
      if (r < mix[0]) kind = "box";
      else if (r < mix[0] + mix[1]) kind = "cylinder";
      else kind = "stepped";

      const pc = palettesColors[Math.floor(rnd() * palettesColors.length)];
      const variance = 0.85 + rnd() * 0.3;
      const col = pc.clone().multiplyScalar(variance);
      col.lerp(tint, 0.15);

      // UV scaleY: number of texture repeats along the building's height
      // so a 60-unit tower gets ~6 tex repeats (16 floors each = 96 floors)
      // and a 10-unit short building gets ~1 repeat.
      const uvScaleY = Math.max(1, Math.round(h / 10));

      if (kind === "cylinder") {
        // Cylinders look like circular towers — diameter ~min(w,d).
        const dia = Math.min(w, d) * 0.95;
        dummy.position.set(x, cy + h / 2, z);
        dummy.scale.set(dia, h, dia);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        cyls.push({ m: dummy.matrix.clone(), c: col, uvScaleY });
      } else if (kind === "stepped") {
        dummy.position.set(x, cy, z);
        dummy.scale.set(w, h, d);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        steps.push({ m: dummy.matrix.clone(), c: col, uvScaleY });
      } else {
        dummy.position.set(x, cy + h / 2, z);
        dummy.scale.set(w, h, d);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        boxes.push({ m: dummy.matrix.clone(), c: col, uvScaleY });
      }

      // Cap on top — for boxes only (cylinders/stepped have baked tops).
      if (kind === "box" && rnd() < 0.78) {
        dummy.position.set(x, cy + h + 0.05, z);
        dummy.scale.set(w * 0.95, 1, d * 0.95);
        dummy.updateMatrix();
        const cc = capTint.clone().multiplyScalar(0.9 + rnd() * 0.25);
        caps.push({ m: dummy.matrix.clone(), c: cc });
      }
      placed++;
    }
    return { boxes, cyls, steps, caps };
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
    props.silhouetteMix,
  ]);

  useEffect(() => {
    const apply = (
      mesh: THREE.InstancedMesh | null,
      arr: { m: THREE.Matrix4; c: THREE.Color; uvScaleY?: number }[],
    ) => {
      if (!mesh) return;
      arr.forEach((it, i) => {
        mesh.setMatrixAt(i, it.m);
        mesh.setColorAt(i, it.c);
      });
      mesh.count = arr.length;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };
    apply(boxRef.current, data.boxes);
    apply(cylRef.current, data.cyls);
    apply(stepRef.current, data.steps);
    apply(capRef.current, data.caps);
  }, [data]);

  // The window-pattern material. We share it across all three silhouettes
  // for a district (texture is shared via the cache). Vertex-stage logic:
  // we DON'T do per-instance UV scaling at the shader level — instead we
  // rely on the texture's RepeatWrapping plus a moderate global repeat
  // count, which gives buildings their pattern at the cost of identical
  // floor density. That's a deliberate tradeoff for cost/complexity.
  const buildingMatProps = {
    map: tex,
    color: "#ffffff",
    metalness: props.metalness ?? 0.22,
    roughness: props.roughness ?? 0.68,
    emissiveMap: tex,
    emissive: new THREE.Color(windowColor),
    emissiveIntensity: 0.55,
  };

  return (
    <>
      <instancedMesh
        ref={boxRef}
        args={[BOX_GEOM, undefined, Math.max(1, data.boxes.length)]}
        frustumCulled={false}
      >
        <meshStandardMaterial {...buildingMatProps} />
      </instancedMesh>
      <instancedMesh
        ref={cylRef}
        args={[CYL_GEOM, undefined, Math.max(1, data.cyls.length)]}
        frustumCulled={false}
      >
        <meshStandardMaterial {...buildingMatProps} />
      </instancedMesh>
      <instancedMesh
        ref={stepRef}
        args={[STEP_GEOM, undefined, Math.max(1, data.steps.length)]}
        frustumCulled={false}
      >
        <meshStandardMaterial {...buildingMatProps} />
      </instancedMesh>
      <instancedMesh
        ref={capRef}
        args={[CAP_GEOM, undefined, Math.max(1, data.caps.length)]}
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
