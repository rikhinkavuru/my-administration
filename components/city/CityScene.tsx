"use client";
/**
 * CityScene
 * ---------
 * Composes lights, sky, fog, camera rail, the doors set piece, every
 * district, and the finale.
 *
 * Lighting model — "clean architectural daylight":
 *  - drei <Environment preset="city"> provides image-based lighting for
 *    every PBR material in the scene. Glass, brushed metal, concrete and
 *    polished steel all pick up real reflections from this HDRI — this is
 *    what gives the scene its "modern city" feel instead of the previous
 *    flat ambient look.
 *  - drei <Sky> tuned to a high midday sun: low turbidity, low rayleigh,
 *    crisp blue gradient. NOT golden-hour dusk — the user explicitly asked
 *    for bright, clean, optimistic.
 *  - One directional sun light casts soft PCF shadows over a wide
 *    orthographic frustum that covers the entire corridor.
 *  - A faint warm hemisphere light fills the shadow side so concrete and
 *    asphalt don't pit-black-crush in the under-faces.
 *
 * Fog — atmospheric haze, NOT a curtain. Starts well past the camera and
 * fades very gradually so far towers melt naturally into sky color
 * without crushing the scene to black. One unified palette across every
 * district — district mood comes from the architecture itself, not from
 * radically different lighting.
 */
import { useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Sky, Environment } from "@react-three/drei";
import CameraRail, { DISTRICT_Z } from "./CameraRail";
import Doors from "./Doors";
import Landmarks from "./Landmarks";
import EconomyDistrict from "./districts/EconomyDistrict";
import EnergyDistrict from "./districts/EnergyDistrict";
import HealthcareDistrict from "./districts/HealthcareDistrict";
import EducationDistrict from "./districts/EducationDistrict";
import DefenseDistrict from "./districts/DefenseDistrict";
import ImmigrationDistrict from "./districts/ImmigrationDistrict";
import Finale from "./Finale";
import type { CityProgressRef } from "./useCityProgress";

/**
 * Unified per-district palette. Every district shares the same daylight
 * sky color base — we only vary fog tint and sun intensity slightly so
 * the journey reads as ONE city changing hour-by-hour rather than nine
 * unrelated planets.
 */
type Atm = {
  z: number;
  fog: THREE.Color;
  sun: number;
};

function mk(z: number, fog: string, sun: number): Atm {
  return { z, fog: new THREE.Color(fog), sun };
}

// Deeper, more saturated atmospheric tints. The previous palette
// averaged near-white (#CFD8E4) which combined with the bright sun
// and bloom to wash the horizon to pure white. Pulling these toward a
// real overcast blue gives building silhouettes contrast.
const ATM_PALETTE: Atm[] = [
  mk(60, "#7E8FA6", 1.0),
  mk(DISTRICT_Z.ECONOMY, "#778AA1", 1.05),
  mk(DISTRICT_Z.ENERGY, "#7388A0", 1.0),
  mk(DISTRICT_Z.HEALTHCARE, "#8094AC", 1.05),
  mk(DISTRICT_Z.EDUCATION, "#7488A2", 1.05),
  mk(DISTRICT_Z.DEFENSE, "#677A92", 0.95),
  mk(DISTRICT_Z.IMMIGRATION, "#7E8DA2", 1.0),
  mk(-1100, "#62748B", 0.95),
];

function sampleAtm(z: number, out: { fog: THREE.Color; sun: number }) {
  for (let i = 0; i < ATM_PALETTE.length - 1; i++) {
    const a = ATM_PALETTE[i];
    const b = ATM_PALETTE[i + 1];
    if (z <= a.z && z >= b.z) {
      const t = (a.z - z) / (a.z - b.z);
      out.fog.copy(a.fog).lerp(b.fog, t);
      out.sun = a.sun + (b.sun - a.sun) * t;
      return;
    }
  }
  const end =
    z > ATM_PALETTE[0].z ? ATM_PALETTE[0] : ATM_PALETTE[ATM_PALETTE.length - 1];
  out.fog.copy(end.fog);
  out.sun = end.sun;
}

// Sun positioned lower in the sky (afternoon, not noon) so the sky
// gradient has more visible blue and the horizon doesn't blow out
// near the top of frame. Still BEHIND the camera path so the sun
// itself isn't visible from the corridor.
const SUN_DIR: [number, number, number] = [-90, 90, 40];
const SUN_BASE_INTENSITY = 1.9;

export default function CityScene({ progressRef }: { progressRef: CityProgressRef }) {
  void progressRef;
  const fogRef = useRef<THREE.Fog>(null!);
  const sunRef = useRef<THREE.DirectionalLight>(null!);
  const tmp = useRef({
    fog: new THREE.Color(),
    sun: 1.0,
  });

  const groundGeom = useMemo(() => new THREE.PlaneGeometry(1600, 2800, 1, 1), []);
  const groundMat = useMemo(() => {
    // Clean asphalt with subtle lane markings. Much less noise than before
    // so the surface reads as a real road, not a noise-textured plane.
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#2C2E33";
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.018})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }
    ctx.fillStyle = "rgba(245,245,238,0.78)";
    for (let y = 0; y < 512; y += 64) {
      ctx.fillRect(253, y, 6, 36);
    }
    ctx.fillStyle = "rgba(245,245,238,0.55)";
    ctx.fillRect(72, 0, 3, 512);
    ctx.fillRect(437, 0, 3, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(20, 60);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({
      map: tex,
      color: "#3A3D44",
      metalness: 0.08,
      roughness: 0.88,
      envMapIntensity: 0.5,
    });
  }, []);

  useFrame(({ camera }) => {
    sampleAtm(camera.position.z, tmp.current);
    if (fogRef.current) fogRef.current.color.copy(tmp.current.fog);
    if (sunRef.current) {
      sunRef.current.intensity = SUN_BASE_INTENSITY * tmp.current.sun;
    }
  });

  return (
    <>
      {/* HDRI environment lighting — gives every PBR material in the scene
          believable reflections and image-based fill. `background={false}`
          keeps the actual visible sky owned by <Sky>.
          Wrapped in its OWN Suspense so the HDR CDN fetch can't suspend
          the entire scene if it stalls in production. */}
      <Suspense fallback={null}>
        <Environment preset="city" background={false} environmentIntensity={0.4} />
      </Suspense>

      {/* Procedural daylight sky — tuned for a CLEAR, deeper blue
          afternoon (not the blown-out white we had before). Lower
          turbidity + lower rayleigh keep the gradient saturated; the
          sun is behind the camera so the visible sky isn't hot-spotting
          where the viewer is looking. */}
      <Sky
        distance={6000}
        sunPosition={SUN_DIR}
        mieCoefficient={0.004}
        mieDirectionalG={0.78}
        rayleigh={0.85}
        turbidity={1.8}
      />

      {/* Linear fog — even closer (80/420 was still letting the hospital
          cross peek through from the Energy district 155m away). 60/230
          keeps the current district crisp while fully fading anything
          past the next-district threshold. */}
      <fog ref={fogRef} attach="fog" args={["#7E8FA6", 60, 230]} />

      {/* Lighting — clean architectural daylight.
          ONE sun directional light with shadows + ONE warm hemisphere
          fill. No rim red light (that was polluting the palette).
          Intensities tuned so the scene reads even if HDRI fails to
          load and there's no env-map fill. */}
      <hemisphereLight
        intensity={0.7}
        color={"#A8B8CC"}
        groundColor={"#26221C"}
      />
      <directionalLight
        ref={sunRef}
        position={SUN_DIR}
        intensity={SUN_BASE_INTENSITY}
        color={"#FFF4DC"}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
        shadow-camera-near={1}
        shadow-camera-far={600}
        shadow-camera-left={-220}
        shadow-camera-right={220}
        shadow-camera-top={220}
        shadow-camera-bottom={-220}
      />
      <ambientLight intensity={0.18} color={"#A8B6C8"} />

      {/* Ground */}
      <mesh
        geometry={groundGeom}
        material={groundMat}
        position={[0, -0.05, -540]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      />
      {/* Green grass strips flanking the road — gives the city color
          variation and breaks up the monochrome asphalt the user
          flagged. Two long strips on either side of the corridor. */}
      <mesh
        position={[-40, -0.04, -540]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[36, 1700]} />
        <meshStandardMaterial color="#3F5A38" metalness={0} roughness={0.95} />
      </mesh>
      <mesh
        position={[40, -0.04, -540]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[36, 1700]} />
        <meshStandardMaterial color="#3F5A38" metalness={0} roughness={0.95} />
      </mesh>
      {/* Lighter concrete sidewalk strips immediately adjacent to the
          road — soft cream tone for color variety. */}
      <mesh
        position={[-21, -0.045, -540]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[2, 1700]} />
        <meshStandardMaterial color="#C8C2B6" metalness={0} roughness={0.92} />
      </mesh>
      <mesh
        position={[21, -0.045, -540]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[2, 1700]} />
        <meshStandardMaterial color="#C8C2B6" metalness={0} roughness={0.92} />
      </mesh>

      <CameraRail progressRef={progressRef} />
      <Doors progressRef={progressRef} />
      <Landmarks />
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
