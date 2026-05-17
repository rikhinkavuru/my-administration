"use client";
/**
 * ArchiveBackdrop — scroll-driven parallax of archaic line-art visuals
 * behind the home-page content. Federal eagle, 13-star colonial ring,
 * Capitol dome, compass rose, Constitution parchment, Doric column.
 *
 * Each layer:
 *   - sits in a fixed inset-0 container behind all content (z-0)
 *   - translates Y based on window scrollY at its own parallax speed
 *   - renders at very low opacity (4–9%) so it never competes with copy
 *   - is pure stroke-only SVG (engraving feel) in plain white
 *
 * Respects reduced-motion by holding visuals static.
 */
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { type ReactNode } from "react";

function Layer({
  startVh,
  speed,
  opacity,
  scrollY,
  reduced,
  children,
}: {
  startVh: number;
  speed: number;
  opacity: number;
  scrollY: MotionValue<number>;
  reduced: boolean;
  children: ReactNode;
}) {
  const y = useTransform(scrollY, (s) =>
    reduced ? `${startVh}vh` : `calc(${startVh}vh - ${s * speed}px)`,
  );
  return (
    <motion.div
      aria-hidden
      style={{ y, opacity, left: "50%", x: "-50%" }}
      className="absolute"
    >
      {children}
    </motion.div>
  );
}

// ----- Visuals --------------------------------------------------------

function StarRing() {
  const stars = Array.from({ length: 13 }, (_, i) => {
    const angle = (i / 13) * Math.PI * 2 - Math.PI / 2;
    return { x: 110 + Math.cos(angle) * 82, y: 110 + Math.sin(angle) * 82 };
  });
  const starPoints = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const radius = i % 2 === 0 ? r : r * 0.42;
      pts.push(`${cx + Math.cos(a) * radius},${cy + Math.sin(a) * radius}`);
    }
    return pts.join(" ");
  };
  return (
    <svg
      viewBox="0 0 220 220"
      width="340"
      height="340"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinejoin="round"
    >
      <circle cx="110" cy="110" r="105" />
      <circle cx="110" cy="110" r="60" />
      {stars.map((s, i) => (
        <polygon key={i} points={starPoints(s.x, s.y, 10)} />
      ))}
    </svg>
  );
}

function GreatSeal() {
  return (
    <svg
      viewBox="0 0 220 220"
      width="320"
      height="320"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinejoin="round"
    >
      {/* outer rings */}
      <circle cx="110" cy="110" r="105" />
      <circle cx="110" cy="110" r="92" />
      {/* spread wings */}
      <path d="M 30 110 Q 60 70, 88 90 L 88 105 Q 60 115, 30 130 Z" />
      <path d="M 190 110 Q 160 70, 132 90 L 132 105 Q 160 115, 190 130 Z" />
      {/* shield */}
      <path d="M 85 88 L 135 88 L 135 130 Q 135 152, 110 162 Q 85 152, 85 130 Z" />
      {/* canton bar */}
      <line x1="85" y1="100" x2="135" y2="100" />
      {/* 13 stripes */}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1={89 + i * 4}
          y1="102"
          x2={89 + i * 4}
          y2="160"
          strokeWidth="0.3"
        />
      ))}
      {/* head */}
      <circle cx="110" cy="72" r="9" />
      <path d="M 117 70 L 124 72 L 117 75" />
      {/* tail */}
      <path d="M 100 162 L 120 162 L 110 184 Z" />
      {/* olive branch + arrows */}
      <line x1="40" y1="120" x2="68" y2="138" />
      <line x1="46" y1="124" x2="52" y2="118" />
      <line x1="56" y1="132" x2="62" y2="126" />
      <line x1="180" y1="120" x2="152" y2="138" />
      <line x1="174" y1="124" x2="168" y2="118" />
      <line x1="164" y1="132" x2="158" y2="126" />
    </svg>
  );
}

function CompassRose() {
  const rays: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const r = i % 4 === 0 ? 96 : i % 2 === 0 ? 64 : 44;
    rays.push(`M 110,110 L ${110 + Math.cos(a) * r},${110 + Math.sin(a) * r}`);
  }
  return (
    <svg
      viewBox="0 0 220 220"
      width="300"
      height="300"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.4"
    >
      <circle cx="110" cy="110" r="98" />
      <circle cx="110" cy="110" r="64" />
      <circle cx="110" cy="110" r="44" strokeDasharray="2 3" />
      {rays.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <text
        x="110"
        y="14"
        fontSize="11"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="serif"
      >
        N
      </text>
      <text
        x="206"
        y="114"
        fontSize="11"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="serif"
      >
        E
      </text>
      <text
        x="110"
        y="212"
        fontSize="11"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="serif"
      >
        S
      </text>
      <text
        x="14"
        y="114"
        fontSize="11"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="serif"
      >
        W
      </text>
    </svg>
  );
}

function CapitolDome() {
  return (
    <svg
      viewBox="0 0 340 240"
      width="420"
      height="296"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      {/* base / steps */}
      <rect x="20" y="195" width="300" height="20" />
      <rect x="40" y="215" width="260" height="15" />
      {/* columned facade */}
      {Array.from({ length: 14 }, (_, i) => (
        <line
          key={i}
          x1={50 + i * 17}
          y1="105"
          x2={50 + i * 17}
          y2="195"
          strokeWidth="0.4"
        />
      ))}
      {/* entablature */}
      <line x1="40" y1="105" x2="300" y2="105" />
      <line x1="44" y1="98" x2="296" y2="98" />
      {/* pediment */}
      <path d="M 60 98 L 170 60 L 280 98 Z" />
      {/* drum */}
      <rect x="130" y="50" width="80" height="20" />
      {/* dome */}
      <path d="M 130 50 Q 170 -8, 210 50" />
      {/* lantern + spire */}
      <rect x="162" y="2" width="16" height="8" />
      <line x1="170" y1="2" x2="170" y2="-12" />
    </svg>
  );
}

function ConstitutionScroll() {
  return (
    <svg
      viewBox="0 0 240 320"
      width="240"
      height="320"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.4"
    >
      {/* parchment outline + slight droop on bottom */}
      <path d="M 12 10 L 228 10 L 228 290 Q 120 304, 12 290 Z" />
      <line x1="12" y1="30" x2="228" y2="30" />
      <text
        x="120"
        y="54"
        fontSize="16"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="serif"
        fontStyle="italic"
      >
        We the People
      </text>
      {/* faux text lines */}
      {Array.from({ length: 22 }, (_, i) => {
        const w = 200 - ((i * 13) % 60);
        return (
          <line
            key={i}
            x1="24"
            y1={80 + i * 9}
            x2={24 + w}
            y2={80 + i * 9}
            strokeWidth="0.28"
          />
        );
      })}
      {/* signature flourish */}
      <path d="M 140 282 q 12 -10 26 -2 q 12 8 30 -2" strokeWidth="0.4" />
    </svg>
  );
}

function DoricColumn() {
  return (
    <svg
      viewBox="0 0 90 360"
      width="90"
      height="360"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.4"
    >
      {/* base */}
      <rect x="8" y="332" width="74" height="18" />
      <rect x="14" y="324" width="62" height="8" />
      {/* shaft */}
      <rect x="22" y="42" width="46" height="282" />
      {/* fluting */}
      {Array.from({ length: 5 }, (_, i) => (
        <line
          key={i}
          x1={29 + i * 8}
          y1="42"
          x2={29 + i * 8}
          y2="324"
          strokeWidth="0.25"
        />
      ))}
      {/* capital */}
      <rect x="18" y="30" width="54" height="12" />
      <rect x="12" y="18" width="66" height="12" />
      <rect x="6" y="6" width="78" height="12" />
    </svg>
  );
}

// ----- Master ---------------------------------------------------------

export default function ArchiveBackdrop() {
  const { scrollY } = useScroll();
  const reduced = useReducedMotion() ?? false;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none text-[var(--fg)]"
    >
      <Layer
        startVh={40}
        speed={0.18}
        opacity={0.06}
        scrollY={scrollY}
        reduced={reduced}
      >
        <StarRing />
      </Layer>
      <Layer
        startVh={140}
        speed={0.24}
        opacity={0.05}
        scrollY={scrollY}
        reduced={reduced}
      >
        <GreatSeal />
      </Layer>
      <Layer
        startVh={240}
        speed={0.2}
        opacity={0.07}
        scrollY={scrollY}
        reduced={reduced}
      >
        <CompassRose />
      </Layer>
      <Layer
        startVh={340}
        speed={0.28}
        opacity={0.05}
        scrollY={scrollY}
        reduced={reduced}
      >
        <CapitolDome />
      </Layer>
      <Layer
        startVh={440}
        speed={0.22}
        opacity={0.06}
        scrollY={scrollY}
        reduced={reduced}
      >
        <ConstitutionScroll />
      </Layer>
      <Layer
        startVh={540}
        speed={0.26}
        opacity={0.05}
        scrollY={scrollY}
        reduced={reduced}
      >
        <DoricColumn />
      </Layer>
      <Layer
        startVh={640}
        speed={0.2}
        opacity={0.06}
        scrollY={scrollY}
        reduced={reduced}
      >
        <StarRing />
      </Layer>
    </div>
  );
}
