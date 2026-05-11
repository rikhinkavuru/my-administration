"use client";
/**
 * Economy & Fiscal district — financial canyons, cargo crane at the
 * waterfront edge, dense towers with warm-white window strips.
 *
 * Covers: Taxes + Spending/Debt + Entitlements.
 */
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import CityBlock from "../primitives/CityBlock";
import HolographicLabel from "../primitives/HolographicLabel";
import Drones from "../primitives/Drones";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.ECONOMY;

export default function EconomyDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  const tickerRef = useRef<THREE.Mesh>(null!);

  // A subtle ticker-band facade — a tall thin emissive plane on the
  // largest building. We translate its texture UVs over time to fake
  // a stock crawl.
  const tickerMat = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 64;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = "500 42px 'Kode Mono', ui-monospace, monospace";
    ctx.fillStyle = "#D63D44";
    let x = 10;
    const symbols = ["SPX +0.42", "DJI +1.21", "QQQ +0.66", "GDP 2.4%", "CPI 2.1%", "DEBT 36.4T", "TAX -5.0", "GROWTH +3.1"];
    for (const s of symbols) {
      ctx.fillText(s, x, 46);
      x += ctx.measureText(s).width + 60;
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true });
  }, []);

  useFrame((_, dt) => {
    if (tickerMat.map) {
      tickerMat.map.offset.x = (tickerMat.map.offset.x + dt * 0.08) % 1;
    }
  });

  return (
    <group>
      {/* Far backdrop — low-detail short buildings */}
      <CityBlock
        center={[-40, 0, CZ]}
        extent={[28, 60]}
        count={56}
        seed={101}
        heightRange={[6, 22]}
        baseColor="#0e0e10"
        capColor="#1a1a1c"
        capEmissive="#FFE7BD"
        capEmissiveIntensity={0.9}
      />
      <CityBlock
        center={[40, 0, CZ]}
        extent={[28, 60]}
        count={56}
        seed={102}
        heightRange={[6, 22]}
        baseColor="#0e0e10"
        capColor="#1a1a1c"
        capEmissive="#FFE7BD"
        capEmissiveIntensity={0.9}
      />
      {/* Mid-detail flanking the camera corridor */}
      <CityBlock
        center={[0, 0, CZ]}
        extent={[28, 50]}
        count={70}
        seed={103}
        heightRange={[18, 56]}
        baseColor="#101012"
        capColor="#2a2a2e"
        capEmissive="#FFE2B0"
        capEmissiveIntensity={1.8}
        keepOut={{ x: 0, z: CZ, radius: 7 }}
      />

      {/* Hero finance tower — the tallest box, anchors the district */}
      <mesh position={[-7, 0, CZ - 6]}>
        <boxGeometry args={[6, 78, 6]} />
        <meshStandardMaterial color="#0a0a0c" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh ref={tickerRef} position={[-7, 30, CZ - 6 + 3.02]} material={tickerMat}>
        <planeGeometry args={[5.6, 2.6]} />
      </mesh>

      {/* Cargo crane — angled boom suggesting the waterfront */}
      <group position={[14, 0, CZ + 4]}>
        <mesh position={[0, 9, 0]}>
          <boxGeometry args={[0.6, 18, 0.6]} />
          <meshStandardMaterial color="#1a1a1c" metalness={0.7} roughness={0.45} />
        </mesh>
        <mesh position={[6, 17, 0]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[14, 0.5, 0.5]} />
          <meshStandardMaterial color="#1a1a1c" metalness={0.7} roughness={0.45} />
        </mesh>
        <mesh position={[10, 12, 0]}>
          <boxGeometry args={[0.2, 8, 0.2]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <mesh position={[10, 8, 0]}>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          <meshStandardMaterial color="#2a2a2e" metalness={0.5} roughness={0.6} />
        </mesh>
      </group>

      <Drones center={[0, 18, CZ]} count={28} radius={26} yJitter={8} color="#FFE7BD" speed={0.35} seed={5} />

      <HolographicLabel
        position={[6, 16, CZ + 8]}
        kicker="DISTRICT 01 / 06 — ECONOMY & FISCAL"
        heading="Honest math."
        pillar="Growth, restraint, and a debt we confront."
        body="Make TCJA permanent. Lower the corporate rate to 18%. Three brackets, indexed capital gains. Cap discretionary spending growth at inflation minus 1% for five years. Restore PAYGO with teeth. Honor commitments to current retirees; phase honest reforms for younger workers."
        progressRef={progressRef}
        visibleRange={[0.10, 0.24]}
      />
    </group>
  );
}
