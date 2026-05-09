"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function SealEmblem() {
  // 50 stars in outer ring (one per state)
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2 - Math.PI / 2;
        const r = 142;
        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r, i };
      }),
    []
  );

  // 13 inner dots (original colonies)
  const colonies = useMemo(
    () =>
      Array.from({ length: 13 }).map((_, i) => {
        const angle = (i / 13) * Math.PI * 2 - Math.PI / 2;
        const r = 96;
        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r, i };
      }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
      className="relative w-full h-full flex items-center justify-center"
      data-cursor-hover
    >
      {/* Glow halo */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(196, 85, 97, 0.30), transparent 65%)",
        }}
      />

      <motion.svg
        viewBox="-200 -200 400 400"
        className="relative w-full h-full max-w-[560px] max-h-[560px] drop-shadow-[0_0_40px_rgba(196,85,97,0.25)]"
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <path
            id="emblem-text-path"
            d="M 0,0 m -168,0 a 168,168 0 1,1 336,0 a 168,168 0 1,1 -336,0"
            fill="none"
          />
          <radialGradient id="emblem-center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 230, 200, 0.10)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="emblem-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center radial fill */}
        <circle cx="0" cy="0" r="120" fill="url(#emblem-center-grad)" />

        {/* Outermost dashed ring */}
        <motion.circle
          cx="0"
          cy="0"
          r="190"
          fill="none"
          stroke="var(--hairline-strong)"
          strokeWidth="1"
          strokeDasharray="2 7"
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 220, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />

        {/* Outer text-on-path — slow rotation */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        >
          <text
            fontSize="10"
            letterSpacing="7"
            fill="var(--ink-muted)"
            style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace", textTransform: "uppercase" }}
          >
            <textPath href="#emblem-text-path" startOffset="0">
              RENEW · THE · REPUBLIC · 2028 · SACKETT / KAVURU · A SERIOUS AGENDA · 
            </textPath>
          </text>
        </motion.g>

        {/* Mid gold ring counter-rotating */}
        <motion.circle
          cx="0"
          cy="0"
          r="152"
          fill="none"
          stroke="var(--accent-2)"
          strokeWidth="0.6"
          strokeOpacity="0.55"
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />

        {/* 50-star ring — each star pulses on its own phase, ring rotates slowly */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        >
          {stars.map((s) => (
            <motion.circle
              key={s.i}
              cx={s.x}
              cy={s.y}
              r="1.6"
              fill="var(--ink)"
              filter="url(#emblem-glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.35, 0.95, 0.35] }}
              transition={{
                duration: 3.5,
                delay: (s.i % 7) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.g>

        {/* Inner accent ring — stroke-draw on mount */}
        <motion.circle
          cx="0"
          cy="0"
          r="120"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.5, ease: EASE }}
          style={{ transformOrigin: "center", filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
        />

        {/* 13 colonial dots */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        >
          {colonies.map((c) => (
            <circle
              key={c.i}
              cx={c.x}
              cy={c.y}
              r="2.2"
              fill="var(--accent-2)"
              opacity="0.85"
              filter="url(#emblem-glow)"
            />
          ))}
        </motion.g>

        {/* Innermost ring — thin */}
        <circle cx="0" cy="0" r="68" fill="none" stroke="var(--hairline-strong)" strokeWidth="0.6" />

        {/* Center: "2028" with serif */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.2, ease: EASE }}
        >
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="var(--ink)"
            style={{ fontFamily: "var(--font-source-serif), serif", fontSize: 56, fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            2028
          </text>
        </motion.g>

        {/* Year engraved below */}
        <motion.text
          x="0"
          y="38"
          textAnchor="middle"
          fontSize="8"
          letterSpacing="6"
          fill="var(--accent)"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          MMXXVIII
        </motion.text>

        {/* Crosshair tick marks at cardinal points */}
        {[0, 90, 180, 270].map((deg) => (
          <motion.line
            key={deg}
            x1="0"
            y1="-180"
            x2="0"
            y2="-170"
            stroke="var(--accent)"
            strokeWidth="1"
            transform={`rotate(${deg})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 + (deg / 360) * 0.4 }}
          />
        ))}
      </motion.svg>
    </motion.div>
  );
}
