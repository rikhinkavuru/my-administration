"use client";
/**
 * CityBlock
 * ---------
 * One instanced field of buildings. A single `THREE.InstancedMesh` of a
 * box geometry, plus a SECOND instanced mesh of thinner boxes used as
 * emissive window-band caps stacked on top of each tower (so we get the
 * "lit windows at night" silhouette without an emissive texture).
 *
 * Building heights, footprints, and positions are seeded deterministically
 * (no per-frame work). The caller passes the district center, an extent
 * (footprint radius), a seed, a count, and a palette. Total = 2 draw
 * calls per district.
 */
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

export type CityBlockProps = {
  center: [number, number, number];
  extent: [number, number]; // x-extent, z-extent
  count: number;
  seed: number;
  heightRange: [number, number];
  baseColor: string;
  capColor: string;
  capEmissive: string;
  capEmissiveIntensity?: number;
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

  const { matrices, capMatrices } = useMemo(() => {
    const rnd = mulberry32(props.seed);
    const dummy = new THREE.Object3D();
    const ms: THREE.Matrix4[] = [];
    const cs: THREE.Matrix4[] = [];
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
      // Emissive cap on top — only some buildings get one (lit night look)
      if (rnd() < 0.72) {
        dummy.position.set(x, cy + h + 0.05, z);
        dummy.scale.set(w * 0.95, 1, d * 0.95);
        dummy.updateMatrix();
        cs.push(dummy.matrix.clone());
      }
      placed++;
    }
    return { matrices: ms, capMatrices: cs };
  }, [props.seed, props.count, props.center, props.extent, props.heightRange, props.keepOut]);

  useEffect(() => {
    const base = baseRef.current;
    const cap = capRef.current;
    if (!base || !cap) return;
    matrices.forEach((m, i) => base.setMatrixAt(i, m));
    capMatrices.forEach((m, i) => cap.setMatrixAt(i, m));
    base.count = matrices.length;
    cap.count = capMatrices.length;
    base.instanceMatrix.needsUpdate = true;
    cap.instanceMatrix.needsUpdate = true;
  }, [matrices, capMatrices]);

  return (
    <>
      <instancedMesh
        ref={baseRef}
        args={[BASE_GEOM, undefined, Math.max(1, matrices.length)]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color={props.baseColor}
          metalness={0.4}
          roughness={0.72}
        />
      </instancedMesh>
      <instancedMesh
        ref={capRef}
        args={[CAP_GEOM, undefined, Math.max(1, capMatrices.length)]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color={props.capColor}
          emissive={props.capEmissive}
          emissiveIntensity={props.capEmissiveIntensity ?? 1.6}
          metalness={0.2}
          roughness={0.4}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}
