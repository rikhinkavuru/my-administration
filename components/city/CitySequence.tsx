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
 *   - HUD elements: top-left district readout, bottom progress meter.
 *
 * Choreography mirrors the JetSequence pattern: a single GSAP tween
 * scrubs progressRef.current.progress 0->1 across the section's natural
 * scroll height; useFrame inside the canvas reads that ref. We forward
 * Lenis's smooth-scroll ticks to ScrollTrigger so scrub interpolation
 * lands on every frame.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import IssueCard from "@/components/IssueCard";
import type { Issue } from "@/lib/data/platform";
import { useDeviceTier, type Tier } from "@/components/jet/useDeviceTier";
import type { CityProgressRef } from "./useCityProgress";

const CityCanvas = dynamic(() => import("./CityCanvas"), {
  ssr: false,
  loading: () => null,
});

const DISTRICTS: { range: [number, number]; index: string; label: string }[] = [
  { range: [0.0, 0.08], index: "00", label: "Approach" },
  { range: [0.08, 0.25], index: "01", label: "Economy & Fiscal" },
  { range: [0.25, 0.4], index: "02", label: "Energy & Environment" },
  { range: [0.4, 0.55], index: "03", label: "Healthcare" },
  { range: [0.55, 0.7], index: "04", label: "Education & Civil Order" },
  { range: [0.7, 0.84], index: "05", label: "Defense & Foreign Policy" },
  { range: [0.84, 0.92], index: "06", label: "Immigration & Rights" },
  { range: [0.92, 1.0], index: "07", label: "Vision" },
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

      // Forward Lenis smoothed scroll into ScrollTrigger so scrub lands
      // on every smoothed frame.
      const lenis = (window as unknown as {
        __lenis?: { on?: (e: string, cb: () => void) => void };
      }).__lenis;
      if (lenis?.on) lenis.on("scroll", () => ScrollTrigger.update());

      // Mount canvas slightly before the section enters the viewport.
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
            // Update HUD state — coarse setState only when district
            // changes, to avoid per-frame React rendering.
            const idx = DISTRICTS.findIndex(
              (d) => p >= d.range[0] && p < d.range[1],
            );
            const next = idx === -1 ? DISTRICTS.length - 1 : idx;
            setDistrictIdx((prev) => (prev === next ? prev : next));
            // The progress UI bar is updated via DOM directly to avoid
            // a render per frame.
            const bar = document.getElementById("city-progress-bar");
            if (bar) bar.style.width = `${Math.round(p * 100)}%`;
            // throttle progress label update via setState too
            setProgressUi(Math.round(p * 100));
          },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
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

  // Fallback render — keep all content discoverable.
  if (tier === "none" || tier === "low") {
    return <StaticFallback issues={issues} />;
  }

  const current = DISTRICTS[districtIdx];

  return (
    <>
      {/* SR / SEO fallback — the full content is always discoverable */}
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
        // ~7 viewport heights of scroll for the full city journey.
        // Each district gets ~1 viewport of scroll travel. The sticky
        // stage uses 100vw + a negative-half-vw offset so it escapes its
        // parent (`container-page`, max-width 1280px) and spans the full
        // viewport width.
        style={{ height: "640svh" }}
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

          {/* Soft cinematic vignette — corners only, barely there.
              Replaces the global .vignette utility which faded the whole
              scene to black past 50% of the radial extent. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                "radial-gradient(ellipse 110% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* HUD top — district readout + scroll cue. Pushed below the
              site's sticky nav (~64px) so it never collides. The translucent
              chip keeps the type legible regardless of what's behind it. */}
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
