"use client";
/**
 * Immigration + Second Amendment district — border / port-of-entry
 * tableau: customs gateway arch, ships at port, world-map projection
 * on the gateway wall. (Guns / Second Amendment folded in as a
 * subordinate paragraph since it's a single-issue plank.)
 */
import CityBlock from "../primitives/CityBlock";
import HolographicLabel from "../primitives/HolographicLabel";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.IMMIGRATION;

function Gateway() {
  return (
    <group position={[0, 0, CZ - 2]}>
      {/* Left pylon */}
      <mesh position={[-8, 5, 0]}>
        <boxGeometry args={[2, 10, 2]} />
        <meshStandardMaterial color="#15151a" metalness={0.6} roughness={0.45} />
      </mesh>
      {/* Right pylon */}
      <mesh position={[8, 5, 0]}>
        <boxGeometry args={[2, 10, 2]} />
        <meshStandardMaterial color="#15151a" metalness={0.6} roughness={0.45} />
      </mesh>
      {/* Lintel (crossbar) */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[18, 1.6, 2]} />
        <meshStandardMaterial color="#1a1a1f" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Red rule on the lintel face */}
      <mesh position={[0, 10, 1.05]}>
        <boxGeometry args={[16, 0.12, 0.05]} />
        <meshBasicMaterial color="#D63D44" toneMapped={false} />
      </mesh>
      {/* Lintel inner light strip */}
      <mesh position={[0, 9.2, 1.05]}>
        <boxGeometry args={[15, 0.06, 0.05]} />
        <meshBasicMaterial color="#FFE7BD" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Ship({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[10, 1.2, 3]} />
        <meshStandardMaterial color="#13131a" metalness={0.5} roughness={0.55} />
      </mesh>
      {/* Stacked containers */}
      {[-3, -1, 1, 3].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 0]}>
          <boxGeometry args={[1.6, 1.2, 2.4]} />
          <meshStandardMaterial color={i % 2 ? "#2a2a30" : "#1f1f24"} metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      {/* Bridge */}
      <mesh position={[4, 1.2, 0]}>
        <boxGeometry args={[1.6, 1.8, 2.2]} />
        <meshStandardMaterial color="#262630" metalness={0.4} roughness={0.55} />
      </mesh>
    </group>
  );
}

export default function ImmigrationDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  return (
    <group>
      {/* Customs / port low buildings */}
      <CityBlock
        center={[0, 0, CZ + 18]}
        extent={[26, 12]}
        count={32}
        seed={601}
        heightRange={[3, 7]}
        baseColor="#b09078"
        capColor="#3a2a1c"
        capEmissive="#FFB070"
        capEmissiveIntensity={1.3}
        palette={["#C4B5A3", "#A89682", "#8E4F3F", "#6E5A4D", "#B09078"]}
        metalness={0.2}
        roughness={0.7}
        keepOut={{ x: 0, z: CZ + 18, radius: 4 }}
        windowStyle="horizontal"
        windowColor="#FFB070"
        silhouetteMix={[0.9, 0.0, 0.1]}
      />

      <Gateway />

      {/* Port: a darker ground patch + a couple of ships */}
      <mesh position={[0, 0.01, CZ - 22]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 16]} />
        <meshBasicMaterial color="#06060a" toneMapped={false} transparent opacity={0.85} />
      </mesh>
      <Ship position={[-10, 0.6, CZ - 22]} />
      <Ship position={[8, 0.6, CZ - 26]} />

      <HolographicLabel
        position={[-9, 16, CZ + 4]}
        kicker="DISTRICT 06 / 06 — IMMIGRATION & RIGHTS"
        heading="Secure. Modern. Lawful."
        pillar="A border that works; a Second Amendment that endures."
        body="Complete physical barriers, expand Border Patrol, reform asylum. Mandate E-Verify. Modernize legal immigration toward merit, with family reunification. Resolve DACA legislatively. Defend the individual right to keep and bear arms — enforce existing laws and address the mental-health crisis underneath."
        progressRef={progressRef}
        visibleRange={[0.84, 0.94]}
      />
    </group>
  );
}
