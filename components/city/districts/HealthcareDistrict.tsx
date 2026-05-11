"use client";
/**
 * Healthcare district — glowing hospital towers, drone deliveries on
 * rails of warm light, emergency-response holograms above rooftops.
 */
import CityBlock from "../primitives/CityBlock";
import HolographicLabel from "../primitives/HolographicLabel";
import Drones from "../primitives/Drones";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.HEALTHCARE;

export default function HealthcareDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  return (
    <group>
      {/* Wide hospital-tower field — taller, cleaner buildings, brighter
          warm-white caps (the "glowing medical district" silhouette). */}
      <CityBlock
        center={[-14, 0, CZ]}
        extent={[14, 50]}
        count={48}
        seed={301}
        heightRange={[20, 54]}
        baseColor="#d4c8b8"
        capColor="#403c38"
        capEmissive="#FFF0D8"
        capEmissiveIntensity={2.6}
        palette={["#D4C8B8", "#B8B0A4", "#9CA0A8", "#C4B5A3", "#A8B0B8"]}
        metalness={0.18}
        roughness={0.6}
        keepOut={{ x: 0, z: CZ, radius: 6 }}
        windowStyle="grid"
        windowColor="#FFF0D8"
        silhouetteMix={[0.6, 0.2, 0.2]}
      />
      <CityBlock
        center={[14, 0, CZ]}
        extent={[14, 50]}
        count={48}
        seed={302}
        heightRange={[20, 54]}
        baseColor="#d4c8b8"
        capColor="#403c38"
        capEmissive="#FFF0D8"
        capEmissiveIntensity={2.6}
        palette={["#D4C8B8", "#B8B0A4", "#9CA0A8", "#C4B5A3", "#A8B0B8"]}
        metalness={0.18}
        roughness={0.6}
        keepOut={{ x: 0, z: CZ, radius: 6 }}
        windowStyle="grid"
        windowColor="#FFF0D8"
        silhouetteMix={[0.6, 0.2, 0.2]}
      />

      {/* Hero hospital — a tall slab with a glowing red cross on its face */}
      <mesh position={[-9, 0, CZ - 4]}>
        <boxGeometry args={[8, 60, 8]} />
        <meshStandardMaterial color="#0a0a0d" metalness={0.5} roughness={0.55} />
      </mesh>
      {/* Red cross */}
      <mesh position={[-9, 30, CZ - 4 + 4.02]}>
        <boxGeometry args={[1.2, 5, 0.1]} />
        <meshBasicMaterial color="#D63D44" toneMapped={false} />
      </mesh>
      <mesh position={[-9, 30, CZ - 4 + 4.02]}>
        <boxGeometry args={[5, 1.2, 0.1]} />
        <meshBasicMaterial color="#D63D44" toneMapped={false} />
      </mesh>

      {/* "Rails of light" — thin emissive rods at altitude representing
           drone delivery corridors */}
      {[18, 24, 30].map((y, i) => (
        <mesh key={i} position={[0, y, CZ + (i - 1) * 10]}>
          <boxGeometry args={[60, 0.04, 0.04]} />
          <meshBasicMaterial color="#FFE7BD" toneMapped={false} />
        </mesh>
      ))}

      {/* Drone swarm — medical delivery */}
      <Drones center={[0, 22, CZ]} count={36} radius={20} yJitter={6} color="#FFEFDF" speed={0.55} seed={31} />
      <Drones center={[-4, 28, CZ + 12]} count={18} radius={14} yJitter={4} color="#FFD0A0" speed={0.4} seed={32} />

      <HolographicLabel
        position={[8, 22, CZ + 6]}
        kicker="DISTRICT 03 / 06 — HEALTHCARE"
        heading="Choice. Transparency."
        pillar="Competition over a top-down rewrite."
        body="Expand HSAs and tax-advantaged tools. Allow interstate insurance sales to widen risk pools and lower premiums. Increase price transparency so patients shop on value. Reform Medicare Advantage. Protect coverage for pre-existing conditions."
        progressRef={progressRef}
        visibleRange={[0.42, 0.56]}
      />
    </group>
  );
}
