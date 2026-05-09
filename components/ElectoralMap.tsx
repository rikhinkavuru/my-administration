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
    <div className="card p-5 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
        <div>
          <div className="eyebrow">Path to 270</div>
          <div className="font-display mt-3 text-[28px] md:text-[36px] tracking-[-0.025em] leading-[1]">
            Electoral College Map
          </div>
        </div>
        <div className="flex items-baseline gap-3">
          <div className="font-display text-[72px] md:text-[88px] tabular-nums leading-none">
            {projectedEV}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--fg-60)] max-w-[14ch]">
            EV w/ all targets won (270 to win)
          </div>
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
                          stroke: "#000",
                          strokeWidth: 0.8,
                          outline: "none",
                          transition: "fill 220ms ease, opacity 220ms ease",
                        },
                        hover: {
                          fill: "#FFFCF2",
                          stroke: "#000",
                          strokeWidth: 1,
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
          <div className="absolute top-3 right-3 max-w-xs border border-[var(--hairline-strong)] bg-[var(--bg-elev-2)] p-4 pointer-events-none">
            <div className="eyebrow !text-[var(--fg-60)]">
              {classificationMeta[stateById[hover].classification].label}
            </div>
            <div className="font-display text-[20px] mt-2">
              {stateById[hover].name}{" "}
              <span className="text-[var(--fg-60)] font-normal tabular-nums font-mono text-[13px]">
                ({stateById[hover].ev} EV)
              </span>
            </div>
            {stateById[hover].reasoning && (
              <div className="text-[12px] text-[var(--fg-60)] mt-3 leading-[1.6]">
                {stateById[hover].reasoning}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--hairline)] grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px]">
        {(Object.keys(classificationMeta) as Classification[]).map((k) => (
          <div key={k} className="flex items-center gap-3">
            <span
              className="inline-block w-3 h-3"
              style={{ background: classificationMeta[k].color, border: classificationMeta[k].color === "#262626" ? "1px solid var(--hairline-strong)" : "none" }}
            />
            <span className="text-[var(--fg-60)] flex-1">{classificationMeta[k].label}</span>
            <span className="font-mono text-[var(--fg)] tabular-nums">{evByClass[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
