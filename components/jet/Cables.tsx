"use client";
import { useMemo } from "react";
import * as THREE from "three";

/**
 * Two thin tow cables suspending the campaign banner beneath the jet.
 * Cylinder geometries oriented from each plane attach point down to the
 * top corners of the banner. Splayed slightly outward to match the
 * banner being wider than the plane fuselage.
 *
 * Built with cylinderGeometry along Y, then aligned via setFromUnitVectors
 * quaternion so the cable axis matches each from->to vector exactly.
 */
function Cable({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const props = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const dir = end.clone().sub(start);
    const length = dir.length();
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      up,
      dir.clone().normalize()
    );
    const euler = new THREE.Euler().setFromQuaternion(quat);
    return {
      position: [mid.x, mid.y, mid.z] as [number, number, number],
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      length,
    };
  }, [from, to]);

  return (
    <mesh position={props.position} rotation={props.rotation}>
      <cylinderGeometry args={[0.012, 0.012, props.length, 6]} />
      <meshStandardMaterial color="#141519" metalness={0.35} roughness={0.7} />
    </mesh>
  );
}

export default function Cables() {
  // Anchor on the jet underside (just below the wing root), splaying out to
  // the banner's top corners which sit ~3.5 units forward/back of center.
  return (
    <group>
      <Cable from={[1.8, -0.28, 0]} to={[3.0, -1.5, 0]} />
      <Cable from={[-1.8, -0.28, 0]} to={[-3.0, -1.5, 0]} />
    </group>
  );
}
