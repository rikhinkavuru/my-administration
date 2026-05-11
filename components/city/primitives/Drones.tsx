"use client";
/**
 * Drones
 * ------
 * A small GPU-driven Points cloud representing drones / aircraft running
 * fixed circular orbits around a center. Per-particle phase is baked into
 * the attribute buffer; the vertex shader (here: a simple onBeforeRender
 * uniform `uTime`) advances them. Zero JS per-frame work beyond setting
 * one uniform.
 */
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Drones({
  center,
  count = 40,
  radius = 18,
  yJitter = 4,
  color = "#FFE7BD",
  size = 0.22,
  speed = 0.6,
  seed = 1,
}: {
  center: [number, number, number];
  count?: number;
  radius?: number;
  yJitter?: number;
  color?: string;
  size?: number;
  speed?: number;
  seed?: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const phases = new Float32Array(count);
    const radii = new Float32Array(count);
    const ys = new Float32Array(count);
    const speeds = new Float32Array(count);
    // dummy positions; vertex shader computes real position from phase+time
    const positions = new Float32Array(count * 3);
    let s = seed >>> 0;
    const rand = () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let r = s;
      r = Math.imul(r ^ (r >>> 15), r | 1);
      r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      phases[i] = rand() * Math.PI * 2;
      radii[i] = radius * (0.6 + rand() * 0.6);
      ys[i] = (rand() - 0.5) * yJitter * 2;
      speeds[i] = speed * (0.7 + rand() * 0.6);
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("orbR", new THREE.BufferAttribute(radii, 1));
    g.setAttribute("orbY", new THREE.BufferAttribute(ys, 1));
    g.setAttribute("orbS", new THREE.BufferAttribute(speeds, 1));
    return g;
  }, [count, radius, yJitter, speed, seed]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCenter: { value: new THREE.Vector3(...center) },
        uColor: { value: new THREE.Color(color) },
        uSize: { value: size },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float phase;
        attribute float orbR;
        attribute float orbY;
        attribute float orbS;
        uniform float uTime;
        uniform vec3 uCenter;
        uniform float uSize;
        varying float vAlpha;
        void main() {
          float a = phase + uTime * orbS;
          vec3 p = uCenter + vec3(cos(a) * orbR, orbY + sin(a * 0.6) * 0.5, sin(a) * orbR);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * (300.0 / -mv.z);
          vAlpha = clamp(1.0 - (-mv.z) / 800.0, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          vec2 q = gl_PointCoord - 0.5;
          float d = dot(q, q);
          if (d > 0.25) discard;
          float f = smoothstep(0.25, 0.0, d);
          gl_FragColor = vec4(uColor, f * vAlpha);
        }
      `,
    });
  }, [center, color, size]);

  useFrame((_, dt) => {
    const m = matRef.current ?? material;
    m.uniforms.uTime.value += dt;
  });

  return <points geometry={geom} material={material} ref={(p) => {
    if (p) matRef.current = (p.material as THREE.ShaderMaterial);
  }} />;
}
