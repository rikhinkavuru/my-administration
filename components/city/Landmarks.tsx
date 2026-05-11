"use client";
/**
 * Landmarks — one distinct, policy-coded hero structure per district,
 * placed precisely where the camera looks during that district's dwell.
 *
 * Camera dwell targets (from CameraRail STOPS / LOOK_VECTORS):
 *   Economy    → look @ [  4, 6,-200]
 *   Energy     → look @ [  4, 8,-390]
 *   Healthcare → look @ [ -2,10,-540]
 *   Education  → look @ [ -2, 9,-700]
 *   Defense    → look @ [  0,11,-860]
 *   Immigration→ look @ [ -4,11,-1020]
 *
 * Each landmark sits a few units past the look target along -Z so the
 * camera sees it head-on at the dwell, framed against the sky.
 *
 * Geometry is procedural and intentionally simple — the goal is
 * RECOGNIZABLE SILHOUETTE at city distance, not photo-real fidelity.
 * Materials are PBR (picks up the HDRI env + sun light), with a
 * single red accent panel on the structures that need a brand call-out
 * (hospital cross, gateway label).
 */
import { useMemo } from "react";
import * as THREE from "three";

// ----- Shared materials --------------------------------------------------
const matStone = {
  color: "#D4D2CC",
  metalness: 0.05,
  roughness: 0.78,
  envMapIntensity: 0.4,
} as const;
const matDarkStone = {
  color: "#3A3A3D",
  metalness: 0.12,
  roughness: 0.68,
  envMapIntensity: 0.5,
} as const;
const matSteel = {
  color: "#A8ACB4",
  metalness: 0.85,
  roughness: 0.32,
  envMapIntensity: 0.9,
} as const;
const matGlass = {
  color: "#5C6A7E",
  metalness: 0.2,
  roughness: 0.12,
  envMapIntensity: 1.4,
} as const;
const matRed = { color: "#D63D44", toneMapped: false } as const;

// =========================================================================
// ECONOMY — Federal-Reserve-style classical bank
// =========================================================================
function BankLandmark({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stepped base */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[28, 1.2, 14]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[26, 1.2, 12]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Main facade body */}
      <mesh position={[0, 8.6, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[22, 12, 9]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* 10 Doric columns across the facade */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={i}
          position={[-9 + i * 2, 7.4, 3.4]}
          castShadow
        >
          <cylinderGeometry args={[0.42, 0.42, 9.6, 14]} />
          <meshStandardMaterial {...matStone} />
        </mesh>
      ))}
      {/* Architrave above the columns */}
      <mesh position={[0, 12.6, 3.4]} castShadow>
        <boxGeometry args={[21, 1.4, 1.2]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Triangular pediment (approximated as a wedge via two boxes) */}
      <mesh position={[0, 14.4, 3.4]} rotation={[0, 0, 0.18]} castShadow>
        <boxGeometry args={[14, 1.4, 1.2]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      <mesh position={[0, 14.4, 3.4]} rotation={[0, 0, -0.18]} castShadow>
        <boxGeometry args={[14, 1.4, 1.2]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Pediment apex */}
      <mesh position={[0, 15.6, 3.4]} castShadow>
        <boxGeometry args={[1.8, 1, 1.2]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Tower BEHIND the classical facade — steel-and-glass bank HQ */}
      <mesh position={[0, 28, -10]} castShadow receiveShadow>
        <boxGeometry args={[16, 52, 12]} />
        <meshStandardMaterial {...matGlass} />
      </mesh>
      {/* Tower crown */}
      <mesh position={[0, 55, -10]} castShadow>
        <boxGeometry args={[10, 4, 8]} />
        <meshStandardMaterial {...matDarkStone} />
      </mesh>
    </group>
  );
}

// =========================================================================
// ENERGY & ENVIRONMENT — wind farm + solar array + green park
// =========================================================================
function WindTurbine({
  position,
  height = 26,
  bladeOffset = 0,
}: {
  position: [number, number, number];
  height?: number;
  bladeOffset?: number;
}) {
  // Static turbines — no rotation animation (rotating blades strobe at
  // distance with low fps fly-throughs).
  return (
    <group position={position}>
      {/* Mast */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.55, height, 12]} />
        <meshStandardMaterial color="#F4F4F1" metalness={0.25} roughness={0.45} />
      </mesh>
      {/* Nacelle */}
      <mesh position={[0, height, 0.4]} castShadow>
        <boxGeometry args={[1.4, 1.1, 2.4]} />
        <meshStandardMaterial color="#E8E8E4" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Hub + 3 blades */}
      <group position={[0, height, 1.7]} rotation={[0, 0, bladeOffset]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.4, 10]} />
          <meshStandardMaterial color="#F4F4F1" metalness={0.4} roughness={0.35} />
        </mesh>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a) => (
          <mesh
            key={a}
            position={[Math.sin(a) * 5, Math.cos(a) * 5, 0]}
            rotation={[0, 0, a + Math.PI / 2]}
            castShadow
          >
            <boxGeometry args={[0.5, 10, 0.16]} />
            <meshStandardMaterial color="#F2F2F0" metalness={0.2} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function EnergyLandmark({ position }: { position: [number, number, number] }) {
  // Green ground patch + 3 turbines + solar array
  return (
    <group position={position}>
      {/* Park ground — green */}
      <mesh
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 50]} />
        <meshStandardMaterial color="#3F5A38" metalness={0.0} roughness={0.95} />
      </mesh>
      {/* Wind turbines — three, staggered */}
      <WindTurbine position={[-12, 0, -6]} height={28} bladeOffset={0.6} />
      <WindTurbine position={[2, 0, -14]} height={32} bladeOffset={-0.4} />
      <WindTurbine position={[16, 0, -2]} height={26} bladeOffset={1.2} />
      {/* Solar panel array — six tilted panels in a row */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[-14 + i * 5, 0, 12]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.12, 0.8, 0.12]} />
            <meshStandardMaterial color="#2A2A2C" metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh
            position={[0, 1.2, 0]}
            rotation={[-0.5, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[4, 0.08, 2.2]} />
            <meshStandardMaterial
              color="#1B2538"
              metalness={0.65}
              roughness={0.18}
              envMapIntensity={1.4}
            />
          </mesh>
        </group>
      ))}
      {/* Small clean-energy control building */}
      <mesh position={[20, 2.5, 14]} castShadow receiveShadow>
        <boxGeometry args={[6, 5, 5]} />
        <meshStandardMaterial color="#C8CAD0" metalness={0.1} roughness={0.6} />
      </mesh>
    </group>
  );
}

// =========================================================================
// HEALTHCARE — hospital tower with prominent red cross
// =========================================================================
function HospitalLandmark({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main hospital slab */}
      <mesh position={[0, 22, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 44, 10]} />
        <meshStandardMaterial
          color="#F2F2EE"
          metalness={0.1}
          roughness={0.45}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Roof helipad — circular slab */}
      <mesh position={[0, 44.3, 0]}>
        <cylinderGeometry args={[5.5, 5.5, 0.3, 24]} />
        <meshStandardMaterial color="#3A3A3D" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* "H" letter on the pad */}
      <mesh position={[0, 44.48, -0.8]}>
        <boxGeometry args={[0.4, 0.05, 2.6]} />
        <meshBasicMaterial color="#F2F2EE" toneMapped={false} />
      </mesh>
      <mesh position={[0, 44.48, 0.8]}>
        <boxGeometry args={[0.4, 0.05, 2.6]} />
        <meshBasicMaterial color="#F2F2EE" toneMapped={false} />
      </mesh>
      <mesh position={[0, 44.48, 0]}>
        <boxGeometry args={[2, 0.05, 0.4]} />
        <meshBasicMaterial color="#F2F2EE" toneMapped={false} />
      </mesh>
      {/* Large red cross on the facade */}
      <mesh position={[0, 24, 5.06]}>
        <boxGeometry args={[2.6, 8, 0.12]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      <mesh position={[0, 24, 5.06]}>
        <boxGeometry args={[8, 2.6, 0.12]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      {/* White panel behind the cross for contrast */}
      <mesh position={[0, 24, 5.0]}>
        <boxGeometry args={[10, 10, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0} roughness={0.85} />
      </mesh>
      {/* Lower clinic wing */}
      <mesh position={[-12, 5, 2]} castShadow receiveShadow>
        <boxGeometry args={[8, 10, 12]} />
        <meshStandardMaterial
          color="#E2E4DE"
          metalness={0.08}
          roughness={0.6}
        />
      </mesh>
      {/* Ambulance bay canopy */}
      <mesh position={[-12, 10.4, 8.5]} castShadow>
        <boxGeometry args={[8, 0.3, 4]} />
        <meshStandardMaterial color="#888A90" metalness={0.7} roughness={0.32} />
      </mesh>
    </group>
  );
}

// =========================================================================
// EDUCATION & CIVIL ORDER — Capitol-style domed building
// =========================================================================
function CapitolLandmark({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Wide stepped base */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[36, 1.6, 18]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Main facade block */}
      <mesh position={[0, 6, -2]} castShadow receiveShadow>
        <boxGeometry args={[30, 8, 12]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* 12 Corinthian columns across the front */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={i}
          position={[-13.2 + i * 2.4, 5, 4.2]}
          castShadow
        >
          <cylinderGeometry args={[0.45, 0.45, 7.5, 14]} />
          <meshStandardMaterial {...matStone} />
        </mesh>
      ))}
      {/* Pediment */}
      <mesh position={[0, 10.2, 4.2]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[18, 1.4, 1.2]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      <mesh position={[0, 10.2, 4.2]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[18, 1.4, 1.2]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Drum and dome */}
      <mesh position={[0, 12.5, -2]} castShadow>
        <cylinderGeometry args={[5.2, 5.4, 5, 28]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      <mesh position={[0, 16.5, -2]} castShadow>
        <sphereGeometry
          args={[5.2, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          color="#E4DDD0"
          metalness={0.15}
          roughness={0.55}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Lantern + spire */}
      <mesh position={[0, 22.4, -2]} castShadow>
        <cylinderGeometry args={[1.2, 1.4, 1.6, 16]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      <mesh position={[0, 24, -2]} castShadow>
        <coneGeometry args={[1.2, 2.2, 14]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
    </group>
  );
}

// =========================================================================
// DEFENSE & FOREIGN POLICY — bunker + radar dish + flag mast
// =========================================================================
function DefenseLandmark({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Low concrete bunker — wide and squat */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[26, 4, 16]} />
        <meshStandardMaterial
          color="#54585E"
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>
      {/* Bunker roof slab */}
      <mesh position={[0, 4.3, 0]} castShadow>
        <boxGeometry args={[27, 0.6, 17]} />
        <meshStandardMaterial color="#3E4248" metalness={0.2} roughness={0.7} />
      </mesh>
      {/* Radar dish on top — pedestal + dish */}
      <mesh position={[6, 5.6, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 2.4, 12]} />
        <meshStandardMaterial {...matSteel} />
      </mesh>
      <mesh
        position={[6, 7.6, 0]}
        rotation={[-0.5, 0, 0]}
        castShadow
      >
        <sphereGeometry
          args={[2.6, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2.4]}
        />
        <meshStandardMaterial
          color="#C4C6CC"
          metalness={0.7}
          roughness={0.32}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Communication mast */}
      <mesh position={[-8, 12, 2]} castShadow>
        <cylinderGeometry args={[0.18, 0.3, 24, 10]} />
        <meshStandardMaterial {...matSteel} />
      </mesh>
      {/* Cross-spars on the mast */}
      {[6, 12, 18].map((y) => (
        <mesh key={y} position={[-8, y, 2]}>
          <boxGeometry args={[2.4, 0.12, 0.12]} />
          <meshStandardMaterial {...matSteel} />
        </mesh>
      ))}
      {/* Red strobe at the top */}
      <mesh position={[-8, 24.2, 2]}>
        <sphereGeometry args={[0.3, 10, 8]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      {/* Flag mast in front of bunker */}
      <mesh position={[0, 7, 9]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 14, 10]} />
        <meshStandardMaterial color="#E8E8E4" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[1.4, 11.5, 9]}>
        <boxGeometry args={[2.8, 1.8, 0.08]} />
        <meshStandardMaterial color="#F5F5F0" metalness={0.0} roughness={0.85} />
      </mesh>
      {/* Red stripe on the flag — single accent */}
      <mesh position={[1.4, 11, 9.06]}>
        <boxGeometry args={[2.8, 0.3, 0.02]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
    </group>
  );
}

// =========================================================================
// IMMIGRATION & RIGHTS — customs gateway arch
// =========================================================================
function GatewayLandmark({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Two stone pylons */}
      <mesh position={[-8, 7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 14, 5]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      <mesh position={[8, 7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 14, 5]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Lintel beam across the top */}
      <mesh position={[0, 14.8, 0]} castShadow>
        <boxGeometry args={[20, 2.2, 5]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* "WELCOME" panel on the lintel */}
      <mesh position={[0, 14.8, 2.55]}>
        <boxGeometry args={[12, 1.4, 0.06]} />
        <meshStandardMaterial color="#1A1A1C" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Red accent stripe under the lintel */}
      <mesh position={[0, 13.6, 2.55]}>
        <boxGeometry args={[18, 0.16, 0.04]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      {/* Two customs booth pavilions ahead of the arch */}
      <mesh position={[-4.5, 1.5, 8]} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 4]} />
        <meshStandardMaterial color="#B0B4BA" metalness={0.2} roughness={0.55} />
      </mesh>
      <mesh position={[4.5, 1.5, 8]} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 4]} />
        <meshStandardMaterial color="#B0B4BA" metalness={0.2} roughness={0.55} />
      </mesh>
      {/* Canopy spanning the booths */}
      <mesh position={[0, 3.4, 8]} castShadow>
        <boxGeometry args={[14, 0.3, 5.4]} />
        <meshStandardMaterial color="#888A90" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

// =========================================================================
// MASTER GROUP — placed at each district's camera-look target
// =========================================================================
export default function Landmarks() {
  // Pre-compute positions as Vec3 tuples to keep the JSX clean.
  const positions = useMemo(
    () => ({
      bank: [3, 0, -210] as [number, number, number],
      energy: [3, 0, -395] as [number, number, number],
      hospital: [-1, 0, -545] as [number, number, number],
      capitol: [-1, 0, -705] as [number, number, number],
      defense: [1, 0, -865] as [number, number, number],
      gateway: [-4, 0, -1025] as [number, number, number],
    }),
    [],
  );
  return (
    <group>
      <BankLandmark position={positions.bank} />
      <EnergyLandmark position={positions.energy} />
      <HospitalLandmark position={positions.hospital} />
      <CapitolLandmark position={positions.capitol} />
      <DefenseLandmark position={positions.defense} />
      <GatewayLandmark position={positions.gateway} />
    </group>
  );
}
