"use client";
/**
 * Defense & Foreign Policy — backdrop only.
 * Bunker + radar + flag mast hero is placed by Landmarks.tsx.
 */
import CityBlock from "../primitives/CityBlock";
import { DISTRICT_Z } from "../CameraRail";
import type { CityProgressRef } from "../useCityProgress";

const CZ = DISTRICT_Z.DEFENSE;

export default function DefenseDistrict({ progressRef }: { progressRef: CityProgressRef }) {
  void progressRef;
  return (
    <group>
      {/* Low secure-perimeter silhouette */}
      <CityBlock
        center={[-30, 0, CZ + 6]}
        extent={[14, 28]}
        count={14}
        seed={501}
        heightRange={[4, 12]}
        baseColor="#5C636E"
        capColor="#1F2329"
        capEmissive="#000000"
        palette={["#6E7889", "#5C6470", "#3D434E", "#7C8694"]}
        windowStyle="sparse"
        silhouetteMix={[0.9, 0.0, 0.1]}
        minSpacing={7}
      />
      <CityBlock
        center={[30, 0, CZ - 6]}
        extent={[14, 28]}
        count={14}
        seed={502}
        heightRange={[4, 12]}
        baseColor="#5C636E"
        capColor="#1F2329"
        capEmissive="#000000"
        palette={["#6E7889", "#5C6470", "#3D434E", "#7C8694"]}
        windowStyle="sparse"
        silhouetteMix={[0.9, 0.0, 0.1]}
        minSpacing={7}
      />
    </group>
  );
}
