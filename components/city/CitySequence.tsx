"use client";
/**
 * CitySequence
 * ------------
 * Page-integration wrapper for the platform city journey. Renders:
 *   - A tall outer section that owns the ScrollTrigger range.
 *   - A sticky inner stage holding the fixed-position 3D canvas.
 *   - A fully accessible HTML fallback (the existing IssueCard accordion)
 *     for reduced-motion / mobile / no-WebGL users.
 *   - A persistent screen-reader list of every issue so SEO + a11y are
 *     preserved even when the 3D path is active.
 *   - HUD elements:
 *       - top district readout chip
 *       - bottom progress meter
 *       - CENTER-BOTTOM district hero copy (title / italic accent /
 *         monospace lede) — fixed inset DOM, ALWAYS rendered above the
 *         canvas so foreground geometry can never occlude it.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IssueCard from "@/components/IssueCard";
import type { Issue } from "@/lib/data/platform";
import { useDeviceTier, type Tier } from "@/components/jet/useDeviceTier";
import type { CityProgressRef } from "./useCityProgress";

const CityCanvas = dynamic(() => import("./CityCanvas"), {
  ssr: false,
  loading: () => null,
});

type District = {
  range: [number, number];
  index: string;
  label: string;
  /** Hero copy rendered to the DOM HUD. */
  title?: string;
  accent?: string;
  lede?: string;
};

const DISTRICTS: District[] = [
  {
    range: [0.0, 0.08],
    index: "00",
    label: "Approach",
    title: "The Platform",
    accent: "Twelve serious positions.",
    lede: "Scroll. The doors are about to open.",
  },
  {
    range: [0.08, 0.24],
    index: "01",
    label: "Economy & Fiscal",
    title: "Honest math.",
    accent: "Growth, restraint, and a debt we confront.",
    lede: "TCJA permanent. Corporate rate to 18%. PAYGO with teeth. Phase honest reforms for younger workers.",
  },
  {
    range: [0.24, 0.4],
    index: "02",
    label: "Energy & Environment",
    title: "All of the above.",
    accent: "Abundance, stewardship, no mandates.",
    lede: "Oil, gas, nuclear, renewables that stand on their own. Approve pipelines. NEPA reform. Carbon capture.",
  },
  {
    range: [0.4, 0.55],
    index: "03",
    label: "Healthcare",
    title: "Choice. Transparency.",
    accent: "Competition over a top-down rewrite.",
    lede: "Expand HSAs. Interstate insurance. Price transparency. Protect coverage for pre-existing conditions.",
  },
  {
    range: [0.55, 0.7],
    index: "04",
    label: "Education & Civil Order",
    title: "Federalism. Speech.",
    accent: "Equal treatment, robust speech, school choice.",
    lede: "Minimize the federal role. School choice via tax credits. First Amendment defended without apology.",
  },
  {
    range: [0.7, 0.83],
    index: "05",
    label: "Defense & Foreign Policy",
    title: "Peace through strength.",
    accent: "Modernize, recapitalize, reform the Pentagon.",
    lede: "Nuclear triad. 355-ship Navy. Cyber, space, AI. NATO and Indo-Pacific alliances. Firm with China.",
  },
  {
    range: [0.83, 0.92],
    index: "06",
    label: "Immigration & Rights",
    title: "Secure. Modern. Lawful.",
    accent: "A border that works; a Second Amendment that endures.",
    lede: "Physical barriers. Reform asylum. E-Verify. Merit-based legal immigration. Individual right to bear arms.",
  },
  {
    range: [0.92, 1.0],
    index: "07",
    label: "Vision",
    title: "Sackett / Kavuru 2028",
    accent: "Read the full platform.",
    lede: "Twelve positions, six districts, one country worth governing seriously.",
  },
];

function StaticFallback({ issues }: { issues: Issue[] }) {
  return (
    <ol className="grid gap-px bg-[var(--hairline)] border border-[var(--hairline)] list-none">
      {issues.map((issue, i) => (
        <li key={issue.id} id={issue.id}>
          <IssueCard issue={issue} index={i} />
        </li>
      ))}
    </ol>
  );
}

export default function CitySequence({ issues }: { issues: Issue[] }) {
  const tier = useDeviceTier();
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<{ progress: number }>({
    progress: 0,
  }) as CityProgressRef;
  const [active, setActive] = useState(false);
  const [districtIdx, setDistrictIdx] = useState(0);
  const [progressUi, setProgressUi] = useState(0);

  useEffect(() => {
    if (tier === "none") return;
    const el = sectionRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const init = async () => {
      const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = (window as unknown as {
        __lenis?: { on?: (e: string, cb: () => void) => void };
      }).__lenis;
      if (lenis?.on) lenis.on("scroll", () => ScrollTrigger.update());

      const mountTrigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom+=200",
        end: "bottom top-=200",
        onEnter: () => setActive(true),
        onEnterBack: () => setActive(true),
        onLeave: () => setActive(false),
        onLeaveBack: () => setActive(false),
      });

      const ctx = gsap.context(() => {
        gsap.to(progressRef.current, {
          progress: 1,
          ease: "none",
          onUpdate: () => {
            const p = progressRef.current.progress;
            const idx = DISTRICTS.findIndex(
              (d) => p >= d.range[0] && p < d.range[1],
            );
            const next = idx === -1 ? DISTRICTS.length - 1 : idx;
            setDistrictIdx((prev) => (prev === next ? prev : next));
            const bar = document.getElementById("city-progress-bar");
            if (bar) bar.style.width = `${Math.round(p * 100)}%`;
            setProgressUi(Math.round(p * 100));
          },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 2.4,
          },
        });
      });

      cleanup = () => {
        mountTrigger.kill();
        ctx.revert();
      };
    };
    void init();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [tier]);

  if (tier === "none" || tier === "low") {
    return <StaticFallback issues={issues} />;
  }

  const current = DISTRICTS[districtIdx];

  return (
    <>
      <ol className="sr-only">
        {issues.map((issue, i) => (
          <li key={issue.id} id={issue.id}>
            {String(i + 1).padStart(2, "0")} — {issue.title}. {issue.summary} {issue.body}
          </li>
        ))}
      </ol>

      <div
        ref={sectionRef}
        className="relative"
        style={{ height: "1100svh" }}
        aria-hidden
      >
        <div
          className="sticky top-0 overflow-hidden"
          style={{
            height: "100svh",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
          }}
        >
          {/* Full-bleed 3D canvas */}
          <div
            className="absolute inset-0"
            style={{ contain: "strict" }}
            aria-hidden
          >
            {active && tier !== ("none" as Tier) && (
              <CityCanvas progressRef={progressRef} tier={tier} />
            )}
          </div>

          {/* Soft cinematic vignette — corners only, barely there. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                "radial-gradient(ellipse 110% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.35) 100%)",
            }}
          />

          {/* HUD top — district readout + scroll cue. */}
          <div className="absolute top-20 left-6 right-6 lg:left-8 lg:right-8 z-30 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-60)] pointer-events-none">
            <span className="bg-black/45 backdrop-blur-sm px-2.5 py-1 border border-[var(--hairline)]">
              District ·{" "}
              <span className="text-[var(--accent-red)]">{current.index}</span>{" "}
              / 06 — {current.label}
            </span>
            <span className="hidden sm:inline bg-black/40 backdrop-blur-sm px-2.5 py-1 border border-[var(--hairline)]">
              Scroll to fly through
            </span>
            <span className="tabular-nums bg-black/45 backdrop-blur-sm px-2.5 py-1 border border-[var(--hairline)]">
              CITY {String(progressUi).padStart(3, "0")}%
            </span>
          </div>

          {/* Corner accents */}
          <span aria-hidden className="absolute top-16 left-4 lg:left-6 h-3 w-3 border-l border-t border-[var(--accent-red)] z-30 pointer-events-none" />
          <span aria-hidden className="absolute bottom-6 right-6 lg:right-8 h-3 w-3 border-r border-b border-[var(--accent-red)] z-30 pointer-events-none" />

          {/* DISTRICT HERO COPY — DOM layer, always on top of the canvas.
              A substantial chip block anchored bottom-left: kode-mono
              kicker, large display headline with italic red accent word,
              body lede. Crossfade between districts overlaps (0.45s) so
              the user never sees a blank state mid-scroll. */}
          <div
            aria-hidden
            className="absolute bottom-24 left-6 lg:left-12 z-30 max-w-[640px] pointer-events-none"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {current.title && current.index !== "07" && (
                <motion.div
                  key={current.index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                  className="bg-black/55 backdrop-blur-md border border-[var(--hairline)] px-6 py-5 lg:px-7 lg:py-6"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/70 flex items-center gap-3">
                    <span className="text-[var(--accent-red)] tabular-nums">
                      DISTRICT · {current.index} / 06
                    </span>
                    <span className="h-px w-8 bg-[var(--accent-red)]" />
                    <span>{current.label}</span>
                  </div>
                  <h2
                    className="mt-3 font-display text-white leading-[0.95] tracking-[-0.02em] font-bold"
                    style={{
                      fontSize: "clamp(40px, 5vw, 80px)",
                      textShadow: "0 2px 24px rgba(0,0,0,0.6)",
                    }}
                  >
                    {current.title}
                  </h2>
                  {current.accent && (
                    <p
                      className="mt-2 text-white/85"
                      style={{
                        fontFamily:
                          "'Noto Serif', Georgia, ui-serif, serif",
                        fontStyle: "italic",
                        fontSize: "clamp(18px, 1.6vw, 24px)",
                        lineHeight: 1.3,
                        color: "var(--accent-red)",
                        textShadow: "0 2px 14px rgba(0,0,0,0.55)",
                      }}
                    >
                      {current.accent}
                    </p>
                  )}
                  {current.lede && (
                    <p
                      className="mt-3 text-white/85"
                      style={{
                        fontFamily:
                          "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
                        fontSize: "clamp(14px, 1.05vw, 16px)",
                        lineHeight: 1.55,
                        maxWidth: "36ch",
                        textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      {current.lede}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FINALE WORDMARK — DOM HUD layer for the Vision district.
              CSS-clamped so it fits any viewport from tablet to 4K with
              5%+ horizontal margins. Fades in over the last district
              window (p >= 0.92). */}
          <AnimatePresence>
            {current.index === "07" && (
              <motion.div
                key="finale-wordmark"
                aria-hidden
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center px-[5vw] pointer-events-none text-center"
              >
                <div className="font-mono text-[10px] sm:text-[12px] uppercase tracking-[0.3em] text-white/65 mb-4">
                  Vision · End · 2028
                </div>
                <h1
                  className="font-display text-white font-bold leading-[0.92] tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(48px, 11vw, 200px)",
                    textShadow: "0 4px 40px rgba(0,0,0,0.6)",
                  }}
                >
                  SACKETT
                  <span className="text-[var(--accent-red)] mx-2 sm:mx-4">
                    /
                  </span>
                  KAVURU
                </h1>
                <div
                  className="mt-3 text-white/85"
                  style={{
                    fontFamily: "'Noto Serif', Georgia, ui-serif, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(36px, 6vw, 96px)",
                    lineHeight: 1,
                    textShadow: "0 2px 22px rgba(0,0,0,0.55)",
                  }}
                >
                  2028
                </div>
                <div className="mt-6 h-px w-32 bg-[var(--accent-red)]" />
                <p
                  className="mt-5 font-mono uppercase text-white/70"
                  style={{
                    fontSize: "clamp(11px, 0.95vw, 14px)",
                    letterSpacing: "0.22em",
                  }}
                >
                  Read the full platform →
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom progress rail */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-[300px] pointer-events-none bg-black/45 backdrop-blur-sm border border-[var(--hairline)] px-4 py-3">
            <div className="relative h-px bg-[var(--hairline-strong)]">
              <span
                id="city-progress-bar"
                className="absolute inset-y-0 left-0 bg-[var(--accent-red)]"
                style={{ width: "0%" }}
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] tabular-nums tracking-[0.06em] text-[var(--fg-60)]">
              <span>00:00</span>
              <span>{current.label}</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
