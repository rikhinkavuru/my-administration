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
const matConcrete = {
  color: "#5E6168",
  metalness: 0.05,
  roughness: 0.92,
  envMapIntensity: 0.25,
} as const;
const matRed = { color: "#D63D44", toneMapped: false } as const;

// =========================================================================
// Reusable Pediment — a real triangular prism via ExtrudeGeometry.
// Replaces the two-rotated-boxes hack which crossed at center to form
// an X-shape on screen.
// =========================================================================
function Pediment({
  width,
  height,
  depth,
  position,
  color = "#D4D2CC",
}: {
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  color?: string;
}) {
  const geom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(0, height);
    shape.lineTo(-width / 2, 0);
    return new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
    });
  }, [width, height, depth]);
  return (
    <mesh
      geometry={geom}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        metalness={0.05}
        roughness={0.78}
        envMapIntensity={0.4}
      />
    </mesh>
  );
}

// =========================================================================
// ECONOMY — classical Federal-Reserve-style bank
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
      {/* Real triangular pediment */}
      <Pediment
        width={20}
        height={3}
        depth={1.2}
        position={[0, 13.3, 2.8]}
      />
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
  return (
    <group position={position}>
      {/* Mast — tapered cylinder */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.5, height, 14]} />
        <meshStandardMaterial color="#F4F4F1" metalness={0.25} roughness={0.45} />
      </mesh>
      {/* Nacelle (the housing that holds the rotor) — sits on top of mast
          and pokes slightly forward */}
      <mesh position={[0, height, 0.6]} castShadow>
        <boxGeometry args={[1.4, 1.1, 2.8]} />
        <meshStandardMaterial color="#E8E8E4" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Hub (the cone at the front of the rotor) */}
      <mesh position={[0, height, 2.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.4, 0.7, 14]} />
        <meshStandardMaterial color="#F4F4F1" metalness={0.4} roughness={0.35} />
      </mesh>
      {/* Rotor group — sits at the front of the nacelle. Each blade is in
          its own group rotated around the hub axis, then the blade box
          extends along the group's local +Y. Three blades at 120° apart. */}
      <group position={[0, height, 1.95]} rotation={[0, 0, bladeOffset]}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a) => (
          <group key={a} rotation={[0, 0, a]}>
            <mesh position={[0, 3, 0]} castShadow>
              <boxGeometry args={[0.5, 6, 0.16]} />
              <meshStandardMaterial color="#F4F4F1" metalness={0.22} roughness={0.45} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function EnergyLandmark({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Green park ground */}
      <mesh
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[64, 50]} />
        <meshStandardMaterial color="#3F5A38" metalness={0.0} roughness={0.95} />
      </mesh>
      {/* Three turbines spaced wide so they don't visually collide */}
      <WindTurbine position={[-16, 0, -4]} height={28} bladeOffset={0.6} />
      <WindTurbine position={[0, 0, -12]} height={32} bladeOffset={-0.4} />
      <WindTurbine position={[18, 0, -2]} height={26} bladeOffset={1.2} />
      {/* Solar panel array — 6 panels in a clean row */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[-14 + i * 5, 0, 14]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.12, 0.9, 0.12]} />
            <meshStandardMaterial color="#2A2A2C" metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh
            position={[0, 1.3, 0]}
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
      <mesh position={[22, 2.5, 14]} castShadow receiveShadow>
        <boxGeometry args={[6, 5, 5]} />
        <meshStandardMaterial color="#C8CAD0" metalness={0.1} roughness={0.6} />
      </mesh>
    </group>
  );
}

// =========================================================================
// HEALTHCARE — hospital complex with red cross dominant on facade
// =========================================================================
function HospitalLandmark({ position }: { position: [number, number, number] }) {
  // Scaled down ~30% from the previous build — the hospital was too
  // big for the camera dwell distance and clipped out of frame.
  return (
    <group position={position} scale={[0.72, 0.72, 0.72]}>
      {/* Main tower */}
      <mesh position={[0, 22, 0]} castShadow receiveShadow>
        <boxGeometry args={[16, 44, 12]} />
        <meshStandardMaterial
          color="#C8CCD2"
          metalness={0.12}
          roughness={0.48}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Window banding on the main tower */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={i}
          position={[0, 4 + i * 4, 6.06]}
        >
          <boxGeometry args={[15.4, 1.6, 0.05]} />
          <meshStandardMaterial color="#2A3340" metalness={0.4} roughness={0.18} />
        </mesh>
      ))}
      {/* Red cross on the facade */}
      <mesh position={[0, 32, 6.1]}>
        <boxGeometry args={[3.4, 11, 0.14]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      <mesh position={[0, 32, 6.1]}>
        <boxGeometry args={[11, 3.4, 0.14]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      {/* White backing panel behind the cross */}
      <mesh position={[0, 32, 6.07]}>
        <boxGeometry args={[14, 14, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0} roughness={0.85} />
      </mesh>
      {/* Helipad on the roof */}
      <mesh position={[0, 44.3, 0]}>
        <cylinderGeometry args={[5.5, 5.5, 0.3, 28]} />
        <meshStandardMaterial color="#3A3A3D" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* "H" on the helipad */}
      <mesh position={[-0.85, 44.48, 0]}>
        <boxGeometry args={[0.4, 0.06, 2.8]} />
        <meshBasicMaterial color="#F2F2EE" toneMapped={false} />
      </mesh>
      <mesh position={[0.85, 44.48, 0]}>
        <boxGeometry args={[0.4, 0.06, 2.8]} />
        <meshBasicMaterial color="#F2F2EE" toneMapped={false} />
      </mesh>
      <mesh position={[0, 44.48, 0]}>
        <boxGeometry args={[2.2, 0.06, 0.4]} />
        <meshBasicMaterial color="#F2F2EE" toneMapped={false} />
      </mesh>
      {/* LEFT WING */}
      <mesh position={[-13, 5, 2]} castShadow receiveShadow>
        <boxGeometry args={[10, 10, 14]} />
        <meshStandardMaterial color="#DDE0DC" metalness={0.08} roughness={0.55} />
      </mesh>
      <mesh position={[-13, 7, 9.06]}>
        <boxGeometry args={[9.4, 4, 0.04]} />
        <meshStandardMaterial color="#2A3340" metalness={0.4} roughness={0.18} />
      </mesh>
      <mesh position={[-13, 10.4, 9.08]}>
        <boxGeometry args={[7, 0.8, 0.04]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      <mesh position={[-13, 10.8, 11]} castShadow>
        <boxGeometry args={[9, 0.3, 4]} />
        <meshStandardMaterial color="#888A90" metalness={0.7} roughness={0.32} />
      </mesh>
      {/* RIGHT WING */}
      <mesh position={[13, 8, -1]} castShadow receiveShadow>
        <boxGeometry args={[8, 16, 10]} />
        <meshStandardMaterial color="#C8C8C0" metalness={0.1} roughness={0.6} />
      </mesh>
      {[6, 10, 14].map((y) => (
        <mesh key={y} position={[13, y, 4.06]}>
          <boxGeometry args={[7.4, 1.2, 0.04]} />
          <meshStandardMaterial color="#2A3340" metalness={0.4} roughness={0.18} />
        </mesh>
      ))}
      <mesh position={[6.5, 7, 1]} castShadow>
        <boxGeometry args={[5, 3, 4]} />
        <meshStandardMaterial color="#B8B8B0" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Plaza ground in front — greenscape strip */}
      <mesh
        position={[0, 0.05, 13]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[36, 6]} />
        <meshStandardMaterial color="#3F5A38" metalness={0} roughness={0.95} />
      </mesh>
      <mesh
        position={[0, 0.05, 18]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[36, 6]} />
        <meshStandardMaterial color="#9DA0A6" metalness={0.05} roughness={0.85} />
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
      {/* Architrave above columns */}
      <mesh position={[0, 9.4, 4.2]} castShadow>
        <boxGeometry args={[28, 1.2, 1.2]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Real triangular pediment */}
      <Pediment
        width={26}
        height={3.4}
        depth={1.2}
        position={[0, 10, 3.6]}
      />
      {/* Drum (cylindrical base of the dome) */}
      <mesh position={[0, 14, -2]} castShadow>
        <cylinderGeometry args={[5.2, 5.4, 5, 32]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Drum colonnade — small columns around the drum */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 5.5;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 14, -2 + Math.sin(angle) * r]}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.18, 4.6, 8]} />
            <meshStandardMaterial {...matStone} />
          </mesh>
        );
      })}
      {/* Dome */}
      <mesh position={[0, 16.5, -2]} castShadow>
        <sphereGeometry
          args={[5.2, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          color="#E4DDD0"
          metalness={0.15}
          roughness={0.55}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Lantern (small cylinder at dome apex) */}
      <mesh position={[0, 22, -2]} castShadow>
        <cylinderGeometry args={[1.0, 1.2, 1.6, 16]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Spire */}
      <mesh position={[0, 23.6, -2]} castShadow>
        <coneGeometry args={[1.0, 2.4, 14]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
    </group>
  );
}

// =========================================================================
// DEFENSE & FOREIGN POLICY — Pentagon-style HQ
// Iconic 5-sided silhouette reads as "defense" instantly.
// =========================================================================
function DefenseLandmark({ position }: { position: [number, number, number] }) {
  // Build the pentagon shape once.
  const pentagonGeom = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 14;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 10,
      bevelEnabled: false,
    });
  }, []);
  // Inner courtyard hole (negative-space)
  const innerCourtyardGeom = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 5.5;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 10.4,
      bevelEnabled: false,
    });
  }, []);
  return (
    <group position={position}>
      {/* Pentagon-shaped main building — rotated so flat side faces camera */}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <mesh geometry={pentagonGeom} castShadow receiveShadow>
          <meshStandardMaterial {...matConcrete} />
        </mesh>
        {/* The inner courtyard — subtract via a hole-textured center.
            Cheaper than CSG: just render the inner pentagon at the same
            level but with a green grass material to suggest the open
            courtyard at the Pentagon's center. */}
      </group>
      {/* Inner courtyard — green grass disk at ground level */}
      <mesh
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#3F5A38" roughness={0.95} metalness={0} />
      </mesh>
      {/* Roof ringwalk — visible darker concrete on top */}
      <mesh position={[0, 10.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 14, 5, 1]} />
        <meshStandardMaterial color="#3E4248" metalness={0.2} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Front signage panel — solid block reading as a "DOD" plaque */}
      <mesh position={[0, 11.4, 11]} castShadow>
        <boxGeometry args={[8, 1.6, 0.4]} />
        <meshStandardMaterial color="#1A1C20" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Red accent stripe on signage */}
      <mesh position={[0, 10.5, 11.21]}>
        <boxGeometry args={[7.4, 0.16, 0.04]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      {/* Flag mast in front of the Pentagon */}
      <mesh position={[0, 9, 18]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 18, 10]} />
        <meshStandardMaterial color="#E8E8E4" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[2, 16, 18]}>
        <boxGeometry args={[3.6, 2.2, 0.08]} />
        <meshStandardMaterial color="#F5F5F0" metalness={0} roughness={0.85} />
      </mesh>
      <mesh position={[2, 15.3, 18.06]}>
        <boxGeometry args={[3.6, 0.4, 0.02]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      {/* Comms tower nearby */}
      <mesh position={[-14, 14, 6]} castShadow>
        <cylinderGeometry args={[0.2, 0.32, 28, 12]} />
        <meshStandardMaterial {...matSteel} />
      </mesh>
      {[6, 14, 22].map((y) => (
        <mesh key={y} position={[-14, y, 6]}>
          <boxGeometry args={[2.6, 0.14, 0.14]} />
          <meshStandardMaterial {...matSteel} />
        </mesh>
      ))}
      <mesh position={[-14, 28.4, 6]}>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      {/* Radar dish on a secondary outbuilding */}
      <mesh position={[14, 2, 8]} castShadow receiveShadow>
        <boxGeometry args={[6, 4, 6]} />
        <meshStandardMaterial {...matConcrete} />
      </mesh>
      <mesh position={[14, 5.4, 8]}>
        <cylinderGeometry args={[0.32, 0.42, 2.2, 12]} />
        <meshStandardMaterial {...matSteel} />
      </mesh>
      <mesh
        position={[14, 7.6, 8]}
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
      <mesh position={[-9, 8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 16, 5]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      <mesh position={[9, 8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 16, 5]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Lintel beam across the top */}
      <mesh position={[0, 17, 0]} castShadow>
        <boxGeometry args={[23, 2.4, 5]} />
        <meshStandardMaterial {...matStone} />
      </mesh>
      {/* Lintel signage panel */}
      <mesh position={[0, 17, 2.6]}>
        <boxGeometry args={[14, 1.6, 0.06]} />
        <meshStandardMaterial color="#1A1A1C" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Red accent stripe under the lintel */}
      <mesh position={[0, 15.6, 2.6]}>
        <boxGeometry args={[20, 0.18, 0.04]} />
        <meshBasicMaterial {...matRed} />
      </mesh>
      {/* Customs booth pavilions */}
      <mesh position={[-4.5, 1.6, 9]} castShadow receiveShadow>
        <boxGeometry args={[3, 3.2, 4]} />
        <meshStandardMaterial color="#B0B4BA" metalness={0.2} roughness={0.55} />
      </mesh>
      <mesh position={[4.5, 1.6, 9]} castShadow receiveShadow>
        <boxGeometry args={[3, 3.2, 4]} />
        <meshStandardMaterial color="#B0B4BA" metalness={0.2} roughness={0.55} />
      </mesh>
      {/* Canopy over booths */}
      <mesh position={[0, 3.6, 9]} castShadow>
        <boxGeometry args={[14, 0.3, 5.4]} />
        <meshStandardMaterial color="#888A90" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

// =========================================================================
// MASTER GROUP
// =========================================================================
export default function Landmarks() {
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
