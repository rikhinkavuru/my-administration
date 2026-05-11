"use client";
/**
 * CityScene
 * ---------
 * Composes lights, fog, camera rail, the doors set piece, every
 * district, and the finale. Per-frame work delegates to each component;
 * this file is mostly composition + scene-level dynamics (fog color
 * blends between districts).
 */
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import CameraRail, { DISTRICT_Z } from "./CameraRail";
import Doors from "./Doors";
import EconomyDistrict from "./districts/EconomyDistrict";
import EnergyDistrict from "./districts/EnergyDistrict";
import HealthcareDistrict from "./districts/HealthcareDistrict";
import EducationDistrict from "./districts/EducationDistrict";
import DefenseDistrict from "./districts/DefenseDistrict";
import ImmigrationDistrict from "./districts/ImmigrationDistrict";
import Finale from "./Finale";
import type { CityProgressRef } from "./useCityProgress";

// District color palette (fog color per district). Restrained:
// warm-grey for civil scenes, cool-blue for defense, slight green hint
// after the clean-energy transition. Lightened from near-black so the
// horizon doesn't crush silhouettes against the void.
const FOG_PALETTE = [
  { z: 60, color: new THREE.Color("#0a0a0d") }, // doors
  { z: DISTRICT_Z.ECONOMY, color: new THREE.Color("#15161c") },
  { z: DISTRICT_Z.ENERGY - 20, color: new THREE.Color("#1c1810") }, // warm-grey, soot
  { z: DISTRICT_Z.ENERGY + 20, color: new THREE.Color("#101a14") }, // green-tint clean
  { z: DISTRICT_Z.HEALTHCARE, color: new THREE.Color("#1a1416") },
  { z: DISTRICT_Z.EDUCATION, color: new THREE.Color("#10121c") }, // cool, indigo
  { z: DISTRICT_Z.DEFENSE, color: new THREE.Color("#0e131e") }, // cool blue
  { z: DISTRICT_Z.IMMIGRATION, color: new THREE.Color("#14141c") },
  { z: -1100, color: new THREE.Color("#06080f") }, // finale night
];

function sampleFog(z: number, out: THREE.Color) {
  // Find bracketing entries by z (FOG_PALETTE is in decreasing z order).
  for (let i = 0; i < FOG_PALETTE.length - 1; i++) {
    const a = FOG_PALETTE[i];
    const b = FOG_PALETTE[i + 1];
    if (z <= a.z && z >= b.z) {
      const t = (a.z - z) / (a.z - b.z);
      out.copy(a.color).lerp(b.color, t);
      return;
    }
  }
  // Out of range: clamp to ends
  if (z > FOG_PALETTE[0].z) out.copy(FOG_PALETTE[0].color);
  else out.copy(FOG_PALETTE[FOG_PALETTE.length - 1].color);
}

export default function CityScene({ progressRef }: { progressRef: CityProgressRef }) {
  const fogRef = useRef<THREE.FogExp2>(null!);
  const tmpColor = useRef(new THREE.Color());

  // Ground plane — a single dark plane at y=0, suggests asphalt + horizon.
  const groundGeom = useMemo(() => new THREE.PlaneGeometry(800, 2400), []);

  useFrame(({ camera, scene }) => {
    if (fogRef.current) {
      sampleFog(camera.position.z, tmpColor.current);
      fogRef.current.color.copy(tmpColor.current);
      // Also tint scene background so the horizon matches the fog.
      if (scene.background instanceof THREE.Color) {
        scene.background.copy(tmpColor.current);
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#0a0a0d"]} />
      {/* FogExp2 density dropped 0.012 -> 0.0035 so distant towers stay
          legible. Color is sampled per-frame from FOG_PALETTE so each
          district keeps its tint without crushing silhouettes. */}
      <fogExp2 ref={fogRef} attach="fog" args={["#0a0a0d", 0.0035]} />

      {/* Lighting: one warm key, one cool fill, soft ambient. No realtime
          shadows — emissive caps carry the night look. Intensities
          bumped so the city reads at night instead of merging with fog. */}
      <ambientLight intensity={0.45} color="#ffe5c2" />
      <directionalLight position={[20, 40, -200]} intensity={1.1} color="#FFE5C2" />
      <directionalLight position={[-30, 30, -600]} intensity={0.5} color="#7B98D6" />
      {/* Subtle red rim from above, hints the campaign accent on metal */}
      <directionalLight position={[0, 60, -900]} intensity={0.32} color="#D63D44" />

      {/* Ground */}
      <mesh geometry={groundGeom} position={[0, -0.05, -540]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#040406" metalness={0.1} roughness={0.95} />
      </mesh>

      <CameraRail progressRef={progressRef} />
      <Doors progressRef={progressRef} />
      <EconomyDistrict progressRef={progressRef} />
      <EnergyDistrict progressRef={progressRef} />
      <HealthcareDistrict progressRef={progressRef} />
      <EducationDistrict progressRef={progressRef} />
      <DefenseDistrict progressRef={progressRef} />
      <ImmigrationDistrict progressRef={progressRef} />
      <Finale progressRef={progressRef} />
    </>
  );
}
