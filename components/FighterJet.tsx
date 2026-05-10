/**
 * Detailed F-22-style fighter jet, side profile, nose pointing right.
 * SVG viewBox extends 260 units to the LEFT of the jet body so a contrail
 * can be drawn behind the engine and travel with the parent transform.
 *
 * The illustration ships with: gradient-shaded fuselage, twin contrails with
 * horizontal Gaussian blur, exhaust radial glow, swept wing with shadow,
 * canted tail fin with highlight, cockpit canopy with reflection sheen,
 * pitot nose probe, panel lines, dual underwing pylons + missiles, and a
 * USAF-style red roundel with a white star inscribed.
 */
export default function FighterJet() {
  return (
    <svg
      viewBox="-260 0 600 100"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="fjBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B6BCC4" />
          <stop offset="50%" stopColor="#5C636E" />
          <stop offset="100%" stopColor="#1B1F28" />
        </linearGradient>
        <linearGradient id="fjBodyTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C7CCD3" />
          <stop offset="100%" stopColor="#5A6068" />
        </linearGradient>
        <linearGradient id="fjCockpit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A99BD" />
          <stop offset="40%" stopColor="#161E2C" />
          <stop offset="100%" stopColor="#040810" />
        </linearGradient>
        <radialGradient id="fjExhaust" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE7BD" />
          <stop offset="30%" stopColor="#FF8C42" />
          <stop offset="60%" stopColor="#D63D44" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D63D44" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fjContrail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="88%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.92" />
        </linearGradient>
        <filter id="fjBlur" x="-2%" y="-200%" width="104%" height="500%">
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
      </defs>

      {/* CONTRAIL — drawn first so the jet sits over it */}
      <rect x="-260" y="48.5" width="264" height="1.4" fill="url(#fjContrail)" filter="url(#fjBlur)" />
      <rect x="-260" y="55.5" width="264" height="1.4" fill="url(#fjContrail)" filter="url(#fjBlur)" />

      {/* EXHAUST HALO behind the nozzle */}
      <ellipse cx="-10" cy="55" rx="24" ry="7" fill="url(#fjExhaust)" opacity="0.75" />

      {/* TAIL FIN (further-side fin peeking above the fuselage) */}
      <path
        d="M 78 50 L 115 14 L 146 14 L 132 50 Z"
        fill="url(#fjBody)"
        stroke="#0F1421"
        strokeWidth="0.45"
      />
      <path
        d="M 117 18 L 142 18"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="0.35"
        fill="none"
      />

      {/* WING (lower, swept-back trapezoid) */}
      <path
        d="M 200 60 L 165 60 L 88 82 L 142 82 Z"
        fill="url(#fjBody)"
        stroke="#0F1421"
        strokeWidth="0.45"
      />
      <path
        d="M 195 60 L 96 81"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.3"
        fill="none"
      />
      {/* Wing leading-edge highlight */}
      <path
        d="M 198 60.4 L 142 81.4"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.4"
        fill="none"
      />

      {/* AIR INTAKE shadow under the cockpit */}
      <path d="M 135 61 L 230 61 L 222 67 L 135 67 Z" fill="#070B14" />

      {/* MAIN FUSELAGE */}
      <path
        d="M 5 49 L 195 48 L 250 50 L 285 53 L 300 55 L 285 57 L 250 60 L 195 62 L 5 61 Z"
        fill="url(#fjBody)"
        stroke="#0F1421"
        strokeWidth="0.5"
      />
      {/* Top-of-fuselage lighter band */}
      <path
        d="M 18 49.4 L 195 48.4 L 248 50.4 L 285 53.2 L 285 53.6 L 248 50.7 L 195 48.7 L 18 49.7 Z"
        fill="url(#fjBodyTop)"
        opacity="0.55"
      />

      {/* COCKPIT CANOPY */}
      <path
        d="M 175 48 Q 200 29 240 33 L 275 50 Z"
        fill="url(#fjCockpit)"
        stroke="#040810"
        strokeWidth="0.6"
      />
      {/* Canopy reflection */}
      <path
        d="M 192 44 Q 215 35 252 37"
        stroke="rgba(220, 235, 255, 0.55)"
        strokeWidth="0.85"
        fill="none"
        strokeLinecap="round"
      />
      {/* Canopy frame (top edge) */}
      <path
        d="M 175 48 Q 200 29 240 33"
        stroke="#0F1421"
        strokeWidth="0.5"
        fill="none"
      />

      {/* NOSE CONE TIP */}
      <path
        d="M 285 53 L 305 55 L 285 57 Z"
        fill="#3A4250"
        stroke="#0F1421"
        strokeWidth="0.3"
      />
      {/* Pitot probe */}
      <line x1="305" y1="55" x2="315" y2="55" stroke="#262C36" strokeWidth="0.7" />

      {/* PANEL LINES */}
      <line x1="28" y1="54" x2="175" y2="54" stroke="rgba(0,0,0,0.32)" strokeWidth="0.35" />
      <line x1="48" y1="58.5" x2="170" y2="58.5" stroke="rgba(0,0,0,0.20)" strokeWidth="0.3" />
      <line x1="60" y1="51.5" x2="165" y2="51.5" stroke="rgba(255,255,255,0.07)" strokeWidth="0.3" />

      {/* USAF-style INSIGNIA — red roundel with white five-point star */}
      <circle cx="120" cy="55" r="3.7" fill="#D63D44" />
      <path
        d="M 120 51.8 L 121.4 54.4 L 124.2 54.8 L 122.1 56.6 L 122.7 59.2 L 120 57.8 L 117.3 59.2 L 117.9 56.6 L 115.8 54.8 L 118.6 54.4 Z"
        fill="#FFFFFF"
      />

      {/* UNDERWING PYLONS + MISSILES */}
      <rect x="125" y="74" width="2.2" height="5" fill="#262C36" />
      <rect x="155" y="74" width="2.2" height="5" fill="#262C36" />
      <ellipse cx="126" cy="82" rx="9" ry="0.9" fill="#3A4250" />
      <ellipse cx="156" cy="82" rx="9" ry="0.9" fill="#3A4250" />
      <circle cx="118" cy="82" r="0.8" fill="#D63D44" />

      {/* EXHAUST NOZZLE */}
      <ellipse cx="5" cy="55" rx="6" ry="5" fill="#040810" />
      <ellipse cx="5" cy="55" rx="4" ry="3.2" fill="url(#fjExhaust)" />
      <ellipse cx="5" cy="55" rx="1.5" ry="1.2" fill="#FFE7BD" />

      {/* TOP-OF-FUSELAGE specular highlight */}
      <path
        d="M 60 49 L 235 49"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.5"
      />
    </svg>
  );
}
