"use client";
/**
 * Immigration & Rights — backdrop only.
 * Customs gateway hero is placed by Landmarks.tsx.
 */
import CityBlock from "../primitives/CityBlock";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.IMMIGRATION;

export default function ImmigrationDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  void progressRef;
  return (
    <group>
      {/* Low port + customs silhouette flanking the gateway */}
      <CityBlock
        center={[-28, 0, CZ + 14]}
        extent={[12, 24]}
        count={12}
        seed={601}
        heightRange={[4, 11]}
        baseColor="#8E97A4"
        capColor="#2C3038"
        capEmissive="#000000"
        palette={["#A8AEB8", "#8E97A4", "#6A7888", "#5C6878"]}
        windowStyle="horizontal"
        silhouetteMix={[0.9, 0.0, 0.1]}
        minSpacing={7}
      />
      <CityBlock
        center={[28, 0, CZ + 14]}
        extent={[12, 24]}
        count={12}
        seed={602}
        heightRange={[4, 11]}
        baseColor="#8E97A4"
        capColor="#2C3038"
        capEmissive="#000000"
        palette={["#A8AEB8", "#8E97A4", "#6A7888", "#5C6878"]}
        windowStyle="horizontal"
        silhouetteMix={[0.9, 0.0, 0.1]}
        minSpacing={7}
      />
    </group>
  );
}
