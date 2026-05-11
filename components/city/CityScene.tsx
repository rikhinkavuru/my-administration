"use client";
/**
 * CityScene
 * ---------
 * Composes lights, sky, fog, camera rail, the doors set piece, every
 * district, and the finale. The whole scene is tuned for "golden-hour
 * metropolis": a strong warm sun, cool blue-sky fill from the opposite
 * side, a faint red rim, and a linear haze that COLORS the distance
 * instead of crushing it to black. Per-district lighting tone is blended
 * smoothly off the camera Z so each district reads with its own mood
 * without hard cuts.
 */
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Sky } from "@react-three/drei";
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

// Per-district atmospheric palette. Each entry: fog/haze color + key light
// tint + key light intensity + fill tint + ground tone. Sampled per-frame
// by camera Z and lerped between neighbouring entries.
type Atm = {
  z: number;
  fog: THREE.Color;
  keyColor: THREE.Color;
  keyIntensity: number;
  fillColor: THREE.Color;
  fillIntensity: number;
  ground: THREE.Color;
};

function mk(
  z: number,
  fog: string,
  keyColor: string,
  keyIntensity: number,
  fillColor: string,
  fillIntensity: number,
  ground: string,
): Atm {
  return {
    z,
    fog: new THREE.Color(fog),
    keyColor: new THREE.Color(keyColor),
    keyIntensity,
    fillColor: new THREE.Color(fillColor),
    fillIntensity,
    ground: new THREE.Color(ground),
  };
}

// FOG_PALETTE is in decreasing z order (camera moves from +Z to -Z).
const ATM_PALETTE: Atm[] = [
  mk(60, "#EBC7A0", "#FFCB8C", 2.4, "#7FA8D6", 0.7, "#22201d"), // doors approach — warm dusk
  mk(DISTRICT_Z.ECONOMY, "#C8B4A0", "#FFC890", 2.5, "#7FA8D6", 0.75, "#2c2722"), // economy — warm steel
  mk(DISTRICT_Z.ENERGY - 20, "#D8B090", "#FFB070", 2.2, "#7CA0CC", 0.6, "#2a221b"), // soot
  mk(DISTRICT_Z.ENERGY + 20, "#B8C8B4", "#FFD8A0", 2.3, "#7FBFB0", 0.8, "#1f2a24"), // clean green
  mk(DISTRICT_Z.HEALTHCARE, "#D8C4B8", "#FFDAB0", 2.6, "#9CBFD8", 0.85, "#2a2625"), // clean white
  mk(DISTRICT_Z.EDUCATION, "#B0BFD0", "#FFE0B8", 2.2, "#8FB0E0", 0.9, "#23272f"), // cool blue
  mk(DISTRICT_Z.DEFENSE, "#9CB2C8", "#E8D4B0", 1.9, "#8AA8C8", 0.95, "#1e2330"), // desaturated grey-blue
  mk(DISTRICT_Z.IMMIGRATION, "#E8B890", "#FFB070", 2.5, "#A088B8", 0.7, "#2e2418"), // warm sunset
  mk(-1100, "#9CADC8", "#FFE0B0", 1.6, "#8FA8D0", 1.0, "#1a1f2e"), // finale dusk
];

function sampleAtm(z: number, out: {
  fog: THREE.Color;
  keyColor: THREE.Color;
  keyIntensity: number;
  fillColor: THREE.Color;
  fillIntensity: number;
  ground: THREE.Color;
}) {
  for (let i = 0; i < ATM_PALETTE.length - 1; i++) {
    const a = ATM_PALETTE[i];
    const b = ATM_PALETTE[i + 1];
    if (z <= a.z && z >= b.z) {
      const t = (a.z - z) / (a.z - b.z);
      out.fog.copy(a.fog).lerp(b.fog, t);
      out.keyColor.copy(a.keyColor).lerp(b.keyColor, t);
      out.keyIntensity = a.keyIntensity + (b.keyIntensity - a.keyIntensity) * t;
      out.fillColor.copy(a.fillColor).lerp(b.fillColor, t);
      out.fillIntensity = a.fillIntensity + (b.fillIntensity - a.fillIntensity) * t;
      out.ground.copy(a.ground).lerp(b.ground, t);
      return;
    }
  }
  const end =
    z > ATM_PALETTE[0].z ? ATM_PALETTE[0] : ATM_PALETTE[ATM_PALETTE.length - 1];
  out.fog.copy(end.fog);
  out.keyColor.copy(end.keyColor);
  out.keyIntensity = end.keyIntensity;
  out.fillColor.copy(end.fillColor);
  out.fillIntensity = end.fillIntensity;
  out.ground.copy(end.ground);
}

export default function CityScene({ progressRef }: { progressRef: CityProgressRef }) {
  void progressRef;
  const fogRef = useRef<THREE.Fog>(null!);
  const keyRef = useRef<THREE.DirectionalLight>(null!);
  const fillRef = useRef<THREE.DirectionalLight>(null!);
  const rimRef = useRef<THREE.DirectionalLight>(null!);
  const groundRef = useRef<THREE.Mesh>(null!);
  const tmp = useRef({
    fog: new THREE.Color(),
    keyColor: new THREE.Color(),
    keyIntensity: 2.4,
    fillColor: new THREE.Color(),
    fillIntensity: 0.7,
    ground: new THREE.Color(),
  });

  const groundGeom = useMemo(() => new THREE.PlaneGeometry(1400, 2800, 1, 1), []);
  // Lane markings: a procedural texture, repeated along the corridor.
  const groundMat = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    // base tarmac
    ctx.fillStyle = "#26221d";
    ctx.fillRect(0, 0, 256, 256);
    // slight noise
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
    }
    // center dashed line (white)
    ctx.fillStyle = "rgba(220,210,180,0.65)";
    for (let y = 0; y < 256; y += 32) {
      ctx.fillRect(126, y, 4, 18);
    }
    // edge solid lines
    ctx.fillStyle = "rgba(220,210,180,0.45)";
    ctx.fillRect(36, 0, 2, 256);
    ctx.fillRect(218, 0, 2, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(40, 80);
    tex.anisotropy = 4;
    return new THREE.MeshStandardMaterial({
      map: tex,
      color: "#2a2520",
      metalness: 0.05,
      roughness: 0.92,
    });
  }, []);

  useFrame(({ camera }) => {
    sampleAtm(camera.position.z, tmp.current);
    if (fogRef.current) fogRef.current.color.copy(tmp.current.fog);
    if (keyRef.current) {
      keyRef.current.color.copy(tmp.current.keyColor);
      keyRef.current.intensity = tmp.current.keyIntensity;
    }
    if (fillRef.current) {
      fillRef.current.color.copy(tmp.current.fillColor);
      fillRef.current.intensity = tmp.current.fillIntensity;
    }
    if (rimRef.current) {
      // Rim follows fog slightly to keep cohesion
      rimRef.current.intensity = 0.35 + Math.max(0, -camera.position.z / 2400) * 0.3;
    }
    if (groundMat) {
      groundMat.color.copy(tmp.current.ground);
    }
  });

  return (
    <>
      {/* Sky — drei <Sky>, tuned to golden-hour dusk. Sun position
          mirrors the directional key light direction so the on-screen
          sun and the visible cast match. */}
      <Sky
        distance={4500}
        sunPosition={[80, 28, 30]}
        inclination={0.49}
        azimuth={0.25}
        mieCoefficient={0.012}
        mieDirectionalG={0.86}
        rayleigh={2.4}
        turbidity={9}
      />

      {/* Linear fog — colors the distance with atmosphere instead of
          crushing it to black. Near/far tuned so silhouettes near the
          camera stay sharp while far towers melt into haze. */}
      <fog ref={fogRef} attach="fog" args={["#C8B4A0", 30, 320]} />

      {/* Lights — warm sun key + cool sky fill + faint red rim.
          Intensities track the per-district atmospheric palette so each
          district feels distinct without hard cuts. */}
      <ambientLight intensity={0.55} color="#FFE2C0" />
      <hemisphereLight intensity={0.55} color="#FFD0A0" groundColor="#1a1410" />
      <directionalLight
        ref={keyRef}
        position={[50, 30, 20]}
        intensity={2.4}
        color="#FFCB8C"
      />
      <directionalLight
        ref={fillRef}
        position={[-40, 24, -80]}
        intensity={0.7}
        color="#7FA8D6"
      />
      <directionalLight
        ref={rimRef}
        position={[0, 18, -120]}
        intensity={0.4}
        color="#D63D44"
      />

      {/* Ground */}
      <mesh
        ref={groundRef}
        geometry={groundGeom}
        material={groundMat}
        position={[0, -0.05, -540]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={false}
      />

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
