"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Trail, Environment } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  PROCEDURAL F-22 RAPTOR                                            */
/* ------------------------------------------------------------------ */

function F22() {
  // Diamond-shaped main wing planform (F-22 is a clipped delta).
  const wingShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);            // root leading edge (at fuselage, near front)
    s.lineTo(-1.4, 2.4);       // tip LE (1.4 back, 2.4 out)
    s.lineTo(-1.75, 2.0);      // tip TE
    s.lineTo(-2.6, 0);         // root TE
    s.closePath();
    return s;
  }, []);

  // Smaller horizontal stabilizer (further aft, also swept)
  const stabShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(-0.5, 0.95);
    s.lineTo(-0.65, 0.8);
    s.lineTo(-0.95, 0);
    s.closePath();
    return s;
  }, []);

  // Twin canted vertical stabilizers, F-22-style swept fin.
  const tailShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(-0.65, 1.25);
    s.lineTo(-0.95, 1.25);
    s.lineTo(-1.2, 0);
    s.closePath();
    return s;
  }, []);

  // Shared body material (matte gunmetal with subtle metallic sheen)
  const bodyMat = (
    <meshStandardMaterial color="#3A4250" metalness={0.55} roughness={0.42} />
  );
  const bodyMatLight = (
    <meshStandardMaterial color="#4B5360" metalness={0.5} roughness={0.45} />
  );

  return (
    <group>
      {/* MAIN FUSELAGE — capsule along X */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.3, 4.4, 8, 16]} />
        {bodyMat}
      </mesh>
      {/* Top spine highlight — thinner, lighter capsule pasted on top */}
      <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.95, 0.5]}>
        <capsuleGeometry args={[0.26, 3.8, 6, 12]} />
        {bodyMatLight}
      </mesh>

      {/* NOSE TIP cone */}
      <mesh position={[2.55, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.28, 0.65, 16]} />
        {bodyMat}
      </mesh>
      {/* Pitot probe */}
      <mesh position={[2.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
        <meshStandardMaterial color="#0F1421" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* COCKPIT canopy — glass dome */}
      <mesh position={[0.95, 0.24, 0]} scale={[0.9, 0.3, 0.34]}>
        <sphereGeometry args={[1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#0E1421"
          metalness={0.45}
          roughness={0.04}
          transmission={0.18}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* WINGS — ExtrudeGeometry diamond planform, mirrored */}
      <mesh
        position={[1.0, -0.08, 0.28]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <extrudeGeometry
          args={[wingShape, { depth: 0.06, bevelEnabled: false }]}
        />
        {bodyMat}
      </mesh>
      <mesh
        position={[1.0, -0.08, -0.28]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, -1, 1]}
      >
        <extrudeGeometry
          args={[wingShape, { depth: 0.06, bevelEnabled: false }]}
        />
        {bodyMat}
      </mesh>

      {/* HORIZONTAL STABILIZERS */}
      <mesh
        position={[-1.55, -0.05, 0.28]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <extrudeGeometry
          args={[stabShape, { depth: 0.05, bevelEnabled: false }]}
        />
        {bodyMat}
      </mesh>
      <mesh
        position={[-1.55, -0.05, -0.28]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, -1, 1]}
      >
        <extrudeGeometry
          args={[stabShape, { depth: 0.05, bevelEnabled: false }]}
        />
        {bodyMat}
      </mesh>

      {/* VERTICAL STABILIZERS — twin, canted ~26° outward */}
      <mesh position={[-1.4, 0.28, 0.28]} rotation={[0.45, 0, 0]}>
        <extrudeGeometry
          args={[tailShape, { depth: 0.04, bevelEnabled: false }]}
        />
        {bodyMat}
      </mesh>
      <mesh position={[-1.4, 0.28, -0.28]} rotation={[-0.45, 0, 0]}>
        <extrudeGeometry
          args={[tailShape, { depth: 0.04, bevelEnabled: false }]}
        />
        {bodyMat}
      </mesh>

      {/* AIR INTAKES — trapezoidal boxes on the underside near the wing root */}
      <mesh position={[0.6, -0.22, 0.28]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.18, 0.14]} />
        <meshStandardMaterial color="#1A1F2A" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0.6, -0.22, -0.28]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.18, 0.14]} />
        <meshStandardMaterial color="#1A1F2A" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* ENGINE NOZZLES — cylinders at the back */}
      <mesh position={[-2.4, -0.05, 0.18]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.18, 0.4, 14]} />
        <meshStandardMaterial color="#0F1421" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[-2.4, -0.05, -0.18]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.18, 0.4, 14]} />
        <meshStandardMaterial color="#0F1421" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* AFTERBURNER GLOW — emissive disks behind nozzles */}
      <mesh position={[-2.62, -0.05, 0.18]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial color="#FFD27D" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-2.62, -0.05, -0.18]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial color="#FFD27D" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Engine point lights for emissive ambience */}
      <pointLight position={[-2.85, -0.05, 0.18]} color="#FF8C42" intensity={3} distance={3} />
      <pointLight position={[-2.85, -0.05, -0.18]} color="#FF8C42" intensity={3} distance={3} />

      {/* USAF-style red roundel + white star insignia, near wing on each side */}
      <mesh position={[0.7, 0, 0.31]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial color="#D63D44" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.7, 0, -0.31]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial color="#D63D44" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  AMERICAN FLAG — procedural canvas texture + custom wave shader    */
/* ------------------------------------------------------------------ */

function makeFlagTexture(): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 13 horizontal stripes (red, white, red, white, … starting and ending on red)
  const stripeH = canvas.height / 13;
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#B22234" : "#FFFFFF";
    ctx.fillRect(0, i * stripeH, canvas.width, stripeH + 1);
  }

  // Canton (blue field, occupies first 7 stripes vertically + 2/5 of width)
  const cantonW = canvas.width * (2 / 5);
  const cantonH = stripeH * 7;
  ctx.fillStyle = "#3C3B6E";
  ctx.fillRect(0, 0, cantonW, cantonH);

  // 50 white stars in a 9-row alternating 6/5/6/5/… pattern (= 50 total)
  ctx.fillStyle = "#FFFFFF";
  const drawStar = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const radius = i % 2 === 0 ? r : r * 0.4;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  const rH = cantonH / 10;
  const cW = cantonW / 12;
  const starR = Math.min(rH, cW) * 0.42;
  for (let row = 0; row < 9; row++) {
    const y = rH * (row + 1);
    const isOddRow = row % 2 === 0; // 6-star rows
    const numStars = isOddRow ? 6 : 5;
    const startCol = isOddRow ? 1 : 2;
    for (let s = 0; s < numStars; s++) {
      drawStar(cW * (startCol + s * 2), y, starR);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function Flag() {
  const texture = useMemo(() => makeFlagTexture(), []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uMap: { value: texture } }),
    [texture]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  if (!texture) return null;

  // GLSL: amplitude grows with distance from leading edge (which is +1.75 in plane local X)
  const vertexShader = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 p = position;
      float t = clamp((1.75 - p.x) / 3.5, 0.0, 1.0);
      float wave1 = sin(p.x * 3.5 + uTime * 7.0) * 0.20 * t;
      float wave2 = sin(p.x * 5.5 - uTime * 5.0 + p.y * 2.5) * 0.10 * t;
      p.y += wave1 + wave2;
      p.z += sin(p.x * 4.0 + uTime * 6.0) * 0.22 * t;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform sampler2D uMap;
    varying vec2 vUv;
    void main() {
      gl_FragColor = texture2D(uMap, vUv);
    }
  `;

  // Position the flag so its leading edge (plane X = +1.75) sits at jet-local X = -2.5
  // (jet's tail). Plane center X = -2.5 - 1.75 = -4.25.
  return (
    <mesh position={[-4.25, -0.18, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[3.5, 2.0, 36, 18]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  BLAZING FIRE TRAIL — three layered drei <Trail>s                  */
/* ------------------------------------------------------------------ */

function FireTrails() {
  // Three concentric trails (outer dark red, mid orange, inner white-hot)
  // each tracking an invisible point at the engine exhausts.
  const trail1 = useRef<THREE.Mesh>(null);
  const trail2 = useRef<THREE.Mesh>(null);
  const trail3 = useRef<THREE.Mesh>(null);
  return (
    <>
      <Trail width={2.4} length={11} color="#7A1B22" decay={1.2} attenuation={(t) => t}>
        <mesh ref={trail1} position={[-2.7, -0.05, 0]} visible={false}>
          <sphereGeometry args={[0.04, 4, 4]} />
        </mesh>
      </Trail>
      <Trail width={1.5} length={8} color="#FF5722" decay={1.0} attenuation={(t) => t * t}>
        <mesh ref={trail2} position={[-2.7, -0.05, 0]} visible={false}>
          <sphereGeometry args={[0.04, 4, 4]} />
        </mesh>
      </Trail>
      <Trail width={0.7} length={5} color="#FFD27D" decay={0.8} attenuation={(t) => t * t}>
        <mesh ref={trail3} position={[-2.7, -0.05, 0]} visible={false}>
          <sphereGeometry args={[0.04, 4, 4]} />
        </mesh>
      </Trail>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  FLIGHT ASSEMBLY — jet + flag + trails grouped together            */
/* ------------------------------------------------------------------ */

function FlightAssembly() {
  return (
    <group>
      <F22 />
      <Flag />
      <FireTrails />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  ANIMATOR — sweeps the assembly across the viewport                */
/* ------------------------------------------------------------------ */

function FlightAnimator() {
  const groupRef = useRef<THREE.Group>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 4.6;

  useFrame((state) => {
    if (!groupRef.current) return;
    if (startRef.current === null) startRef.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - startRef.current;
    const e = Math.min(t / DURATION, 1);

    // Sweep across the visible field (-20 .. +20 in scene units).
    groupRef.current.position.x = -20 + e * 40;
    // Climb gently across the screen.
    groupRef.current.position.y = -1.4 + e * 2.5;
    // Come closer at the midpoint for perspective scale impression.
    groupRef.current.position.z = -2.5 + Math.sin(e * Math.PI) * 2.6;
    // Slight nose-up pitch. (rotation.z = pitch when nose is along +X)
    groupRef.current.rotation.z = 0.04;
    // Subtle bank (roll) wobble. (rotation.x = roll about body axis)
    groupRef.current.rotation.x = Math.sin(t * 1.3) * 0.04;
    // Yaw barely turns away from the viewer over time.
    groupRef.current.rotation.y = -0.06 + e * 0.12;
  });

  return (
    <group ref={groupRef}>
      <FlightAssembly />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  CANVAS SCENE                                                      */
/* ------------------------------------------------------------------ */

export default function FighterJet3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 1.2, 12], fov: 36 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 5]} intensity={1.4} color="#FFE7BD" />
      <directionalLight position={[-5, -3, -2]} intensity={0.45} color="#7B98D6" />
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <FlightAnimator />
      </Suspense>
    </Canvas>
  );
}
