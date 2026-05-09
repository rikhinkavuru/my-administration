"use client";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { stateById, classificationMeta, evByClass, type Classification } from "@/lib/data/states";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// FIPS to USPS abbreviation
const FIPS_TO_USPS: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO",
  "09": "CT", "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI",
  "16": "ID", "17": "IL", "18": "IN", "19": "IA", "20": "KS", "21": "KY",
  "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
  "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD",
  "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY",
};

export default function ElectoralMap() {
  const [hover, setHover] = useState<string | null>(null);

  const projectedEV = useMemo(
    () => evByClass["safe-r"] + evByClass["lean-r"] + evByClass.battleground,
    []
  );

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--accent)]">Path to 270</div>
          <div className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">Electoral College Map</div>
        </div>
        <div className="flex items-baseline gap-3">
          <div className="font-mono text-5xl md:text-6xl text-[var(--accent)] tabular-nums">{projectedEV}</div>
          <div className="text-sm text-[var(--fg-muted)]">EV with all targets won (270 to win)</div>
        </div>
      </div>

      <div className="relative">
        <ComposableMap projection="geoAlbersUsa" width={980} height={560} style={{ width: "100%", height: "auto" }}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: Array<{ rsmKey: string; id: string; properties: { name: string } }> }) =>
              geographies.map((geo, i) => {
                const fips = String(geo.id).padStart(2, "0");
                const usps = FIPS_TO_USPS[fips];
                const info = usps ? stateById[usps] : undefined;
                const cls: Classification = info?.classification ?? "safe-d";
                const fill = classificationMeta[cls].color;
                return (
                  <motion.g
                    key={geo.rsmKey}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.015, 1.5) }}
                  >
                    <Geography
                      geography={geo}
                      onMouseEnter={() => setHover(usps ?? null)}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        default: {
                          fill,
                          stroke: "rgba(255,255,255,0.15)",
                          strokeWidth: 0.6,
                          outline: "none",
                          transition: "fill 200ms",
                        },
                        hover: {
                          fill: "#D4AF37",
                          stroke: "rgba(255,255,255,0.35)",
                          strokeWidth: 0.8,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: { fill, outline: "none" },
                      }}
                    />
                  </motion.g>
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {hover && stateById[hover] && (
          <div className="absolute top-3 right-3 max-w-xs rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elev-2)] p-4 shadow-xl pointer-events-none">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
              {classificationMeta[stateById[hover].classification].label}
            </div>
            <div className="text-lg font-semibold mt-1">
              {stateById[hover].name} <span className="text-[var(--fg-muted)] font-normal">({stateById[hover].ev} EV)</span>
            </div>
            {stateById[hover].reasoning && (
              <div className="text-sm text-[var(--fg-muted)] mt-2 leading-relaxed">{stateById[hover].reasoning}</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {(Object.keys(classificationMeta) as Classification[]).map((k) => (
          <div key={k} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: classificationMeta[k].color }} />
            <span className="text-[var(--fg-muted)]">
              {classificationMeta[k].label}
            </span>
            <span className="font-mono text-[var(--fg)] tabular-nums ml-auto">{evByClass[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
