"use client";
/**
 * Economy & Fiscal — backdrop towers only.
 * The policy hero (Federal Reserve / bank) is placed by Landmarks.tsx
 * at the camera's actual look target.
 */
import CityBlock from "../primitives/CityBlock";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.ECONOMY;

export default function EconomyDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  void progressRef;
  return (
    <group>
      {/* Left side — slim financial towers, set back from the corridor */}
      <CityBlock
        center={[-38, 0, CZ]}
        extent={[18, 60]}
        count={18}
        seed={101}
        heightRange={[28, 70]}
        baseColor="#5e6f82"
        capColor="#1d2128"
        capEmissive="#000000"
        palette={["#5C6878", "#6A7888", "#3E4652", "#8E97A4"]}
        windowStyle="mullion"
        silhouetteMix={[0.6, 0.2, 0.2]}
        minSpacing={10}
      />
      {/* Right side — same but mirrored */}
      <CityBlock
        center={[38, 0, CZ]}
        extent={[18, 60]}
        count={18}
        seed={102}
        heightRange={[28, 70]}
        baseColor="#5e6f82"
        capColor="#1d2128"
        capEmissive="#000000"
        palette={["#5C6878", "#6A7888", "#3E4652", "#8E97A4"]}
        windowStyle="mullion"
        silhouetteMix={[0.6, 0.2, 0.2]}
        minSpacing={10}
      />
    </group>
  );
}
