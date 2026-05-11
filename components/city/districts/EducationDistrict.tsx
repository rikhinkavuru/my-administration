"use client";
/**
 * Education & Civil Order — backdrop only.
 * Capitol-style hero is placed by Landmarks.tsx.
 */
import CityBlock from "../primitives/CityBlock";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.EDUCATION;

export default function EducationDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  void progressRef;
  return (
    <group>
      {/* Lower research-campus silhouette flanking the Capitol */}
      <CityBlock
        center={[-30, 0, CZ]}
        extent={[14, 40]}
        count={14}
        seed={401}
        heightRange={[14, 32]}
        baseColor="#8A95A6"
        capColor="#2A2F38"
        capEmissive="#000000"
        palette={["#A8AEB8", "#8A95A6", "#5C6878", "#3E4652"]}
        windowStyle="grid"
        silhouetteMix={[0.7, 0.15, 0.15]}
        minSpacing={10}
      />
      <CityBlock
        center={[30, 0, CZ]}
        extent={[14, 40]}
        count={14}
        seed={402}
        heightRange={[14, 32]}
        baseColor="#8A95A6"
        capColor="#2A2F38"
        capEmissive="#000000"
        palette={["#A8AEB8", "#8A95A6", "#5C6878", "#3E4652"]}
        windowStyle="grid"
        silhouetteMix={[0.7, 0.15, 0.15]}
        minSpacing={10}
      />
    </group>
  );
}
