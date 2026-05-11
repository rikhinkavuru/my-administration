"use client";
/**
 * Energy & Environment — minimal backdrop only. No smokestacks, no
 * cooling towers, no smoke particles — the previous build had all
 * three and the smokestacks were leaking visually into the Economy
 * district's view (taller than the fog, visible 120m away).
 *
 * The policy hero (wind farm + solar park) is placed by Landmarks.tsx
 * at the camera's actual look target. This file only provides a soft
 * silhouette flanking the corridor so the district doesn't read as
 * empty.
 */
import CityBlock from "../primitives/CityBlock";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.ENERGY;

export default function EnergyDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  void progressRef;
  return (
    <group>
      {/* Low industrial silhouette on the entry side */}
      <CityBlock
        center={[-32, 0, CZ + 18]}
        extent={[14, 26]}
        count={14}
        seed={211}
        heightRange={[5, 14]}
        baseColor="#788494"
        capColor="#2c3038"
        capEmissive="#000000"
        palette={["#788494", "#5C6878", "#8E97A4", "#6A7480"]}
        windowStyle="horizontal"
        silhouetteMix={[0.85, 0.0, 0.15]}
        minSpacing={7}
      />
      {/* Low buildings on the exit side */}
      <CityBlock
        center={[32, 0, CZ - 18]}
        extent={[14, 26]}
        count={14}
        seed={212}
        heightRange={[5, 14]}
        baseColor="#788494"
        capColor="#2c3038"
        capEmissive="#000000"
        palette={["#788494", "#5C6878", "#8E97A4", "#6A7480"]}
        windowStyle="horizontal"
        silhouetteMix={[0.85, 0.0, 0.15]}
        minSpacing={7}
      />
    </group>
  );
}
