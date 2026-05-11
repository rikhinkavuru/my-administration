"use client";
/**
 * CabinetCarousel3D
 * -----------------
 * Scroll-driven 3D cylinder of the fifteen cabinet nominees.
 *
 * Choreography:
 *   - The page section is pinned for ~2x viewport heights via GSAP
 *     ScrollTrigger (scrub). During the pinned range the cylinder rotates
 *     once around its Y axis so all 15 cards pass the camera.
 *   - The card whose face normal is most aligned with the camera (i.e.
 *     facing front) is the "active" card. Its red corner brackets and
 *     left rail light up; off-axis cards fade their hairlines.
 *   - Everything is CSS 3D transforms on real DOM elements, so the
 *     typography (Geist / Noto Serif / Kode Mono) stays pixel-perfect and
 *     the hairline aesthetic matches the rest of the site exactly.
 *
 * Performance: transforms only (translate3d / rotateY), no layout. GSAP
 * is loaded dynamically; the component lives inside a dynamic({ssr:false})
 * wrapper so none of this code ships in the page's critical path.
 *
 * Accessibility: a fully-static <ol> mirroring the cards is rendered with
 * the standard CabinetCard styling for screen readers and for the
 * reduced-motion / mobile fallback paths.
 */
import { useEffect, useRef, useState } from "react";
import type { CabinetPick } from "@/lib/data/cabinet";
import CabinetCard from "@/components/CabinetCard";
import { useMotion3DMode } from "./useReducedMotion3D";

const CYL_RADIUS = 520; // px — cylinder radius in CSS-3D space.
const CARD_W = 340;
const CARD_H = 420;

function StaticCabinetGrid({ picks }: { picks: CabinetPick[] }) {
  return (
    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
      {picks.map((c, i) => (
        <CabinetCard key={c.department} pick={c} index={i} />
      ))}
    </div>
  );
}

export default function CabinetCarousel3D({ picks }: { picks: CabinetPick[] }) {
  const mode = useMotion3DMode();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Reduced-motion / mobile: render the existing static grid. No GSAP,
  // no transforms — identical to the prior /executive layout.
  useEffect(() => {
    if (mode !== "full") return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const init = async () => {
      const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // If LenisProvider is mounted (which it is for every page on this
      // site), forward its scroll events to ScrollTrigger so scrub
      // updates land on every smoothed frame rather than only on raw
      // wheel events. Defensive: works whether or not Lenis is present.
      const lenis = (window as unknown as {
        __lenis?: { on?: (e: string, cb: () => void) => void };
      }).__lenis;
      if (lenis?.on) {
        lenis.on("scroll", () => ScrollTrigger.update());
      }

      const section = sectionRef.current;
      const cylinder = cylinderRef.current;
      if (!section || !cylinder) return;

      const N = picks.length;
      const ANGLE = 360 / N;
      // Total rotation: one full revolution, minus one slot so we end on
      // the last card facing forward.
      const TOTAL_ROT = -360 + ANGLE;

      const state = { rot: 0 };
      const apply = () => {
        cylinder.style.transform = `translateZ(${-CYL_RADIUS}px) rotateY(${state.rot}deg)`;
        // Find the card whose effective Y rotation is closest to 0 (i.e.
        // facing the camera). Each card's mounted angle is i * ANGLE; the
        // cylinder rotates by state.rot, so screen-facing angle is
        // i * ANGLE + state.rot (normalized to [-180, 180]).
        let best = 0;
        let bestAbs = Infinity;
        for (let i = 0; i < N; i++) {
          let a = (i * ANGLE + state.rot) % 360;
          if (a > 180) a -= 360;
          if (a < -180) a += 360;
          const abs = Math.abs(a);
          if (abs < bestAbs) {
            bestAbs = abs;
            best = i;
          }
          // Fade by angular distance from front. Cards within ~55° of
          // camera stay fully visible; cards on the back of the cylinder
          // fall to ~0.18 so the silhouette of the cylinder is implied
          // without painting unreadable backside text.
          const card = cardRefs.current[i];
          if (card) {
            const fade = Math.max(0.18, 1 - Math.min(180, abs) / 110);
            card.style.opacity = String(fade);
          }
        }
        setActiveIndex((prev) => (prev === best ? prev : best));
      };

      apply();

      const ctx = gsap.context(() => {
        gsap.to(state, {
          rot: TOTAL_ROT,
          ease: "none",
          onUpdate: apply,
          scrollTrigger: {
            // Drive the rotation as the tall outer section scrolls past;
            // the inner sticky stage stays glued to the viewport center.
            // We deliberately do NOT use ScrollTrigger.pin here — pin +
            // Lenis smooth scroll has bitten this codebase before, and
            // CSS position:sticky is a cheap, Lenis-friendly alternative.
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
      });

      cleanup = () => ctx.revert();
    };

    void init();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [mode, picks.length]);

  if (mode === "off" || mode === "mobile") {
    return <StaticCabinetGrid picks={picks} />;
  }

  return (
    <>
      {/* Sentinel: keep the existing static grid in the DOM but visually
          hidden so screen readers + crawlers always see the full list. */}
      <ol className="sr-only">
        {picks.map((c, i) => (
          <li key={c.department}>
            {String(i + 1).padStart(2, "0")} / 15 — {c.department}: {c.nominee}.{" "}
            {c.justification}
          </li>
        ))}
      </ol>

      <div
        ref={sectionRef}
        className="relative mt-12 -mx-6 lg:-mx-8"
        // Tall outer section gives ScrollTrigger its scrub range. The
        // inner stage uses position:sticky to stay viewport-locked
        // (cheaper + Lenis-friendlier than ScrollTrigger.pin).
        style={{ height: `${Math.max(1800, picks.length * 160)}px` }}
        aria-hidden
      >
       <div
         className="sticky top-0 w-full overflow-hidden"
         style={{ height: "100svh" }}
       >
        {/* HUD top — frame readout while the carousel is pinned. */}
        <div className="absolute top-6 left-0 right-0 z-20 px-6 lg:px-8 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-40)] pointer-events-none">
          <span>
            Cabinet ·{" "}
            <span className="text-[var(--accent-red)]">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>{" "}
            / {String(picks.length).padStart(2, "0")}
          </span>
          <span className="hidden sm:inline">Scroll to rotate</span>
          <span className="tabular-nums">REV 01 / 01</span>
        </div>

        {/* Corner accents while pinned. */}
        <span aria-hidden className="absolute top-6 left-6 lg:left-8 h-3 w-3 border-l border-t border-[var(--accent-red)] z-20 pointer-events-none" />
        <span aria-hidden className="absolute bottom-6 right-6 lg:right-8 h-3 w-3 border-r border-b border-[var(--accent-red)] z-20 pointer-events-none" />

        {/* Stage establishes the perspective. */}
        <div
          ref={stageRef}
          className="absolute inset-0"
          style={{
            perspective: "1400px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transformStyle: "preserve-3d",
              width: 0,
              height: 0,
            }}
          >
            <div
              ref={cylinderRef}
              className="relative"
              style={{
                transformStyle: "preserve-3d",
                transform: `translateZ(${-CYL_RADIUS}px)`,
                willChange: "transform",
              }}
            >
              {picks.map((pick, i) => {
                const angle = (360 / picks.length) * i;
                const isActive = i === activeIndex;
                return (
                  <div
                    key={pick.department}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className="absolute"
                    style={{
                      width: CARD_W,
                      height: CARD_H,
                      left: -CARD_W / 2,
                      top: -CARD_H / 2,
                      transform: `rotateY(${angle}deg) translateZ(${CYL_RADIUS}px)`,
                      backfaceVisibility: "hidden",
                      willChange: "opacity, transform",
                      transition: "opacity 280ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <div
                      className="relative h-full w-full flex flex-col"
                      style={{
                        background: "var(--bg)",
                        border: `1px solid ${
                          isActive
                            ? "var(--hairline-strong)"
                            : "var(--hairline)"
                        }`,
                        boxShadow: isActive
                          ? "0 0 0 1px var(--accent-red-soft), 0 30px 80px rgba(0,0,0,0.55)"
                          : "0 12px 40px rgba(0,0,0,0.35)",
                        transition:
                          "border-color 280ms cubic-bezier(0.16,1,0.3,1), box-shadow 280ms cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      {/* Corner brackets — red on the active card only. */}
                      <span
                        aria-hidden
                        className="absolute top-0 left-0 h-3 w-3 border-l border-t"
                        style={{
                          borderColor: isActive
                            ? "var(--accent-red)"
                            : "transparent",
                          transition: "border-color 280ms",
                        }}
                      />
                      <span
                        aria-hidden
                        className="absolute bottom-0 right-0 h-3 w-3 border-r border-b"
                        style={{
                          borderColor: isActive
                            ? "var(--accent-red)"
                            : "transparent",
                          transition: "border-color 280ms",
                        }}
                      />

                      <div className="px-7 py-5 flex items-center justify-between border-b border-[var(--hairline)]">
                        <span className="font-mono text-[10px] text-[var(--fg-40)] tabular-nums tracking-[0.06em]">
                          {String(i + 1).padStart(2, "0")} / 15
                        </span>
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.1em] flex items-center gap-2"
                          style={{
                            color: isActive
                              ? "var(--accent-red)"
                              : "var(--fg-40)",
                            transition: "color 280ms",
                          }}
                        >
                          <span
                            className="inline-block h-1 w-1 rounded-full"
                            style={{
                              background: isActive
                                ? "var(--accent-red)"
                                : "var(--fg-40)",
                            }}
                          />
                          {isActive ? "Nominee" : "Pick"}
                        </span>
                      </div>

                      <div className="p-7 md:p-8 flex-1 flex flex-col">
                        <div className="eyebrow !text-[var(--fg-40)]">
                          {pick.department}
                        </div>
                        <div className="font-display mt-5 text-[28px] md:text-[32px] leading-[0.98] tracking-[-0.035em]">
                          {pick.nominee}
                        </div>
                        <div
                          className="mt-5 h-px w-10"
                          style={{
                            background: isActive
                              ? "var(--accent-red)"
                              : "var(--hairline-strong)",
                            transition: "background 280ms",
                          }}
                        />
                        <p className="mt-5 text-[13px] leading-[1.65] text-[var(--fg-60)] flex-1 overflow-hidden">
                          {pick.justification}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom progress rail — discrete ticks for each card. */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-[6px] pointer-events-none">
          {picks.map((_, i) => (
            <span
              key={i}
              className="block h-px transition-all duration-300"
              style={{
                width: i === activeIndex ? 28 : 14,
                background:
                  i === activeIndex
                    ? "var(--accent-red)"
                    : "var(--hairline-strong)",
              }}
            />
          ))}
        </div>
       </div>
      </div>
    </>
  );
}
