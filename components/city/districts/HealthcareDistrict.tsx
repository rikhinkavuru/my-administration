"use client";
/**
 * Healthcare — backdrop only.
 * The policy hero (hospital tower with red cross) is placed by
 * Landmarks.tsx at the camera's actual look target.
 */
import CityBlock from "../primitives/CityBlock";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.HEALTHCARE;

export default function HealthcareDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  void progressRef;
  return (
    <group>
      <CityBlock
        center={[-34, 0, CZ]}
        extent={[14, 50]}
        count={16}
        seed={301}
        heightRange={[22, 56]}
        baseColor="#9BA3AC"
        capColor="#2C3038"
        capEmissive="#000000"
        palette={["#C8CCD4", "#A8AEB8", "#8E97A4", "#6A7888"]}
        windowStyle="grid"
        silhouetteMix={[0.65, 0.2, 0.15]}
        minSpacing={11}
      />
      <CityBlock
        center={[34, 0, CZ]}
        extent={[14, 50]}
        count={16}
        seed={302}
        heightRange={[22, 56]}
        baseColor="#9BA3AC"
        capColor="#2C3038"
        capEmissive="#000000"
        palette={["#C8CCD4", "#A8AEB8", "#8E97A4", "#6A7888"]}
        windowStyle="grid"
        silhouetteMix={[0.65, 0.2, 0.15]}
        minSpacing={11}
      />
    </group>
  );
}
