"use client";
/**
 * CityBlock
 * ---------
 * An instanced field of skyline buildings — rewritten for realistic
 * modern architecture instead of the previous striped-cardboard look.
 *
 * Design notes:
 *  - Materials are PBR glass / concrete / steel — NO emissive window
 *    grid at daytime. Reflections come from the scene's HDRI
 *    environment map, which is what gives a real "glass tower" look.
 *  - Texture is a SUBTLE horizontal floor-banding pattern only. At city
 *    distance, real buildings read as reflective slabs with faint floor
 *    lines, not as visible window-by-window grids.
 *  - Building proportions are TALL and SLIM (real downtown towers
 *    average 1:5+ footprint:height). Footprints range 5–14m, heights
 *    20–80m depending on district params.
 *  - Per-instance min-spacing rejection sampling so buildings don't
 *    clump or overlap.
 *  - Default count is interpreted as a TARGET — actual placed count
 *    may be lower if spacing constraints force rejections.
 *
 * `windowStyle` in the legacy API now maps to a MATERIAL SCHEME:
 *  - "mullion"     → modern glass curtain (slim, cool blue-grey)
 *  - "grid"        → glass-and-concrete office block
 *  - "horizontal"  → concrete with ribbon banding (institutional)
 *  - "warm-grid"   → warm bronze glass (residential / mid-rise)
 *  - "sparse"      → dark security steel (defense)
 */
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

export const DEFAULT_BUILDING_PALETTE = [
  "#C4CAD2", // cool concrete
  "#8E97A4", // mid blue-grey
  "#5C6878", // slate
  "#3E4652", // dark steel
  "#A6ADB8", // soft grey
  "#6A7888", // cool blue-grey
];

export type WindowStyle =
  | "grid"
  | "mullion"
  | "horizontal"
  | "sparse"
  | "warm-grid";

export type Silhouette = "box" | "cylinder" | "stepped";

type Scheme = {
  /** Base color override applied if district passes a generic palette. */
  tint: THREE.Color;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  /** Texture style — drives the banding canvas. */
  bandStyle: "fine" | "ribbon" | "concrete" | "minimal";
};

function makeScheme(style: WindowStyle): Scheme {
  switch (style) {
    case "mullion":
      return {
        tint: new THREE.Color("#5e6f82"),
        metalness: 0.18,
        roughness: 0.12,
        envMapIntensity: 1.6,
        bandStyle: "fine",
      };
    case "grid":
      return {
        tint: new THREE.Color("#7f8898"),
        metalness: 0.22,
        roughness: 0.32,
        envMapIntensity: 1.1,
        bandStyle: "fine",
      };
    case "horizontal":
      return {
        tint: new THREE.Color("#b8bcc4"),
        metalness: 0.08,
        roughness: 0.62,
        envMapIntensity: 0.55,
        bandStyle: "ribbon",
      };
    case "warm-grid":
      return {
        tint: new THREE.Color("#8a7866"),
        metalness: 0.28,
        roughness: 0.22,
        envMapIntensity: 1.3,
        bandStyle: "fine",
      };
    case "sparse":
      return {
        tint: new THREE.Color("#3a4048"),
        metalness: 0.55,
        roughness: 0.42,
        envMapIntensity: 0.85,
        bandStyle: "minimal",
      };
  }
}

export type CityBlockProps = {
  center: [number, number, number];
  extent: [number, number];
  count: number;
  seed: number;
  heightRange: [number, number];
  /** @deprecated retained for back-compat; folded into scheme tint. */
  baseColor: string;
  capColor: string;
  capEmissive: string;
  capEmissiveIntensity?: number;
  palette?: string[];
  metalness?: number;
  roughness?: number;
  keepOut?: { x: number; z: number; radius: number };
  silhouetteMix?: [number, number, number];
  windowStyle?: WindowStyle;
  /** @deprecated kept for back-compat — daytime buildings are not lit. */
  windowColor?: string;
  /** Minimum spacing between building centers (default derived from footprint). */
  minSpacing?: number;
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

const BOX_GEOM = new THREE.BoxGeometry(1, 1, 1);
const CYL_GEOM = new THREE.CylinderGeometry(0.5, 0.5, 1, 28, 1, false);

function makeSteppedGeom(): THREE.BufferGeometry {
  // Three-tier setback: 1×0.55×1 → 0.78×0.30×0.78 → 0.55×0.15×0.55
  const lower = new THREE.BoxGeometry(1, 0.55, 1);
  lower.translate(0, 0.275, 0);
  const mid = new THREE.BoxGeometry(0.78, 0.3, 0.78);
  mid.translate(0, 0.55 + 0.15, 0);
  const top = new THREE.BoxGeometry(0.55, 0.15, 0.55);
  top.translate(0, 0.55 + 0.3 + 0.075, 0);
  return mergeGeometries([lower, mid, top]);
}

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
const CAP_GEOM = new THREE.BoxGeometry(1, 0.1, 1);

// --- Texture cache -------------------------------------------------------
// Subtle banding only — the env map does the visual work. One canvas per
// band style, shared globally. NO per-building or per-color caching since
// instance tinting handles color variation.
const TEXTURE_CACHE = new Map<Scheme["bandStyle"], THREE.CanvasTexture>();

function getBandingTexture(bandStyle: Scheme["bandStyle"]): THREE.CanvasTexture {
  const cached = TEXTURE_CACHE.get(bandStyle);
  if (cached) return cached;

  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  // Base — neutral white so instance color tints cleanly.
  ctx.fillStyle = "#F2F2F2";
  ctx.fillRect(0, 0, 256, 1024);

  if (bandStyle === "fine") {
    // Glass curtain wall — fine horizontal floor slab edges every ~24px
    // (≈ one slab per 4m of height when stretched onto a 60m tower).
    ctx.fillStyle = "rgba(10,14,22,0.32)";
    for (let y = 0; y < 1024; y += 24) {
      ctx.fillRect(0, y, 256, 1);
    }
    // Optional thin vertical mullion every 32px — very faint.
    ctx.fillStyle = "rgba(10,14,22,0.10)";
    for (let x = 0; x < 256; x += 32) {
      ctx.fillRect(x, 0, 1, 1024);
    }
  } else if (bandStyle === "ribbon") {
    // Concrete with ribbon windows — alternating concrete band + dark
    // glass band (3:1 ratio) to suggest mid-century institutional facade.
    for (let y = 0; y < 1024; y += 48) {
      // concrete band (lighter)
      ctx.fillStyle = "#E8E8E4";
      ctx.fillRect(0, y, 256, 32);
      // ribbon glass band (darker, slight blue tint)
      ctx.fillStyle = "#3a4250";
      ctx.fillRect(0, y + 32, 256, 16);
    }
    // very faint vertical structural columns every 64px
    ctx.fillStyle = "rgba(60,60,70,0.22)";
    for (let x = 0; x < 256; x += 64) {
      ctx.fillRect(x, 0, 2, 1024);
    }
  } else if (bandStyle === "concrete") {
    // Pure concrete — almost no banding, just faint horizontal pour lines.
    ctx.fillStyle = "rgba(30,30,40,0.06)";
    for (let y = 0; y < 1024; y += 64) {
      ctx.fillRect(0, y, 256, 1);
    }
  } else if (bandStyle === "minimal") {
    // Dark steel — almost flat. Subtle horizontal lines every 64px to
    // hint at panelization.
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    for (let y = 0; y < 1024; y += 64) {
      ctx.fillRect(0, y, 256, 1);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  TEXTURE_CACHE.set(bandStyle, tex);
  return tex;
}

export default function CityBlock(props: CityBlockProps) {
  const boxRef = useRef<THREE.InstancedMesh>(null!);
  const cylRef = useRef<THREE.InstancedMesh>(null!);
  const stepRef = useRef<THREE.InstancedMesh>(null!);
  const capRef = useRef<THREE.InstancedMesh>(null!);

  const palette = props.palette ?? DEFAULT_BUILDING_PALETTE;
  const windowStyle: WindowStyle = props.windowStyle ?? "grid";
  const scheme = useMemo(() => makeScheme(windowStyle), [windowStyle]);
  const tex = useMemo(() => getBandingTexture(scheme.bandStyle), [scheme]);

  const data = useMemo(() => {
    const rnd = mulberry32(props.seed);
    const dummy = new THREE.Object3D();
    const boxes: { m: THREE.Matrix4; c: THREE.Color }[] = [];
    const cyls: { m: THREE.Matrix4; c: THREE.Color }[] = [];
    const steps: { m: THREE.Matrix4; c: THREE.Color }[] = [];
    const caps: { m: THREE.Matrix4; c: THREE.Color }[] = [];
    const placedPositions: { x: number; z: number; r: number }[] = [];
    const palettesColors = palette.map((c) => new THREE.Color(c));
    const capTint = new THREE.Color(props.capColor);
    const [cx, cy, cz] = props.center;
    const [ex, ez] = props.extent;
    const [hMin, hMax] = props.heightRange;
    const mix = props.silhouetteMix ?? [0.7, 0.15, 0.15];
    const sumMix = mix[0] + mix[1] + mix[2];

    let placed = 0;
    let attempts = 0;
    const maxAttempts = props.count * 8;
    while (placed < props.count && attempts < maxAttempts) {
      attempts++;
      const x = cx + (rnd() - 0.5) * ex * 2;
      const z = cz + (rnd() - 0.5) * ez * 2;
      if (props.keepOut) {
        const dx = x - props.keepOut.x;
        const dz = z - props.keepOut.z;
        if (Math.sqrt(dx * dx + dz * dz) < props.keepOut.radius) continue;
      }

      // Realistic footprints: 4–13m, with occasional larger anchor
      // building (10–18m).
      const isAnchor = rnd() < 0.08;
      const w = isAnchor ? 10 + rnd() * 8 : 4 + rnd() * 9;
      const d = isAnchor ? 10 + rnd() * 8 : 4 + rnd() * 9;
      const h = hMin + Math.pow(rnd(), 1.4) * (hMax - hMin);
      const footprint = Math.max(w, d);

      // Min spacing — rejection sampling so buildings don't crowd
      // each other. Default: 0.85 × max neighbour footprint, with at
      // least 4m of breathing room.
      const minSpacing = props.minSpacing ?? Math.max(4, footprint * 0.55);
      let conflict = false;
      for (const p of placedPositions) {
        const dx = p.x - x;
        const dz = p.z - z;
        const minDist = minSpacing + p.r;
        if (dx * dx + dz * dz < minDist * minDist) {
          conflict = true;
          break;
        }
      }
      if (conflict) continue;
      placedPositions.push({ x, z, r: footprint * 0.55 });

      const r = rnd() * sumMix;
      let kind: Silhouette = "box";
      if (r < mix[0]) kind = "box";
      else if (r < mix[0] + mix[1]) kind = "cylinder";
      else kind = "stepped";

      // Color — pick from palette, very small variance, blended into the
      // scheme tint so the architectural read dominates per-building drift.
      const pc = palettesColors[Math.floor(rnd() * palettesColors.length)];
      const variance = 0.92 + rnd() * 0.16;
      const col = pc.clone().multiplyScalar(variance);
      col.lerp(scheme.tint, 0.5);

      if (kind === "cylinder") {
        const dia = Math.min(w, d);
        dummy.position.set(x, cy + h / 2, z);
        dummy.scale.set(dia, h, dia);
        dummy.rotation.set(0, rnd() * Math.PI, 0);
        dummy.updateMatrix();
        cyls.push({ m: dummy.matrix.clone(), c: col });
      } else if (kind === "stepped") {
        dummy.position.set(x, cy, z);
        dummy.scale.set(w, h, d);
        dummy.rotation.set(0, rnd() < 0.5 ? 0 : Math.PI / 2, 0);
        dummy.updateMatrix();
        steps.push({ m: dummy.matrix.clone(), c: col });
      } else {
        dummy.position.set(x, cy + h / 2, z);
        dummy.scale.set(w, h, d);
        dummy.rotation.set(0, rnd() < 0.5 ? 0 : (rnd() < 0.5 ? Math.PI / 2 : Math.PI / 4), 0);
        dummy.updateMatrix();
        boxes.push({ m: dummy.matrix.clone(), c: col });
      }

      // Roof cap (mech-room / parapet) on boxes — small dark slab.
      if (kind === "box" && rnd() < 0.55) {
        const capW = w * (0.4 + rnd() * 0.3);
        const capD = d * (0.4 + rnd() * 0.3);
        const capH = 1 + rnd() * 2.5;
        dummy.position.set(x, cy + h + capH / 2, z);
        dummy.scale.set(capW, capH, capD);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        const cc = capTint.clone().multiplyScalar(0.85 + rnd() * 0.3);
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
    props.minSpacing,
    palette,
    props.silhouetteMix,
    props.capColor,
    scheme,
  ]);

  useEffect(() => {
    const apply = (
      mesh: THREE.InstancedMesh | null,
      arr: { m: THREE.Matrix4; c: THREE.Color }[],
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

  // Building material — PBR glass/concrete with HDRI env reflections.
  // No emissive map (daytime). The texture provides only faint banding
  // for materiality; the env map provides the actual "alive" look.
  const buildingMatProps = {
    map: tex,
    color: "#ffffff",
    metalness: props.metalness ?? scheme.metalness,
    roughness: props.roughness ?? scheme.roughness,
    envMapIntensity: scheme.envMapIntensity,
  };

  return (
    <>
      <instancedMesh
        ref={boxRef}
        args={[BOX_GEOM, undefined, Math.max(1, data.boxes.length)]}
        frustumCulled={false}
        receiveShadow
      >
        <meshStandardMaterial {...buildingMatProps} />
      </instancedMesh>
      <instancedMesh
        ref={cylRef}
        args={[CYL_GEOM, undefined, Math.max(1, data.cyls.length)]}
        frustumCulled={false}
        receiveShadow
      >
        <meshStandardMaterial {...buildingMatProps} />
      </instancedMesh>
      <instancedMesh
        ref={stepRef}
        args={[STEP_GEOM, undefined, Math.max(1, data.steps.length)]}
        frustumCulled={false}
        receiveShadow
      >
        <meshStandardMaterial {...buildingMatProps} />
      </instancedMesh>
      <instancedMesh
        ref={capRef}
        args={[CAP_GEOM, undefined, Math.max(1, data.caps.length)]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#2a2c33"
          metalness={0.4}
          roughness={0.55}
          envMapIntensity={0.6}
        />
      </instancedMesh>
    </>
  );
}
