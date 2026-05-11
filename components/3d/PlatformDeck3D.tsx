"use client";
/**
 * PlatformDeck3D
 * --------------
 * Scroll-driven 3D card deck of the twelve platform positions.
 *
 * Choreography:
 *   - The section is pinned for ~1.5 viewport heights × number of cards
 *     via GSAP ScrollTrigger (scrub).
 *   - As scroll progresses the deck's "head" index advances. The current
 *     card sits centered, rotated to face the camera. The next ~3 cards
 *     are queued to the right at increasing depth + Y rotation, fading.
 *     Already-seen cards exit to the left with negative rotation.
 *   - The active card animates its full summary text in; off-axis cards
 *     show only the title + number so the eye knows where it's headed.
 *
 * All transforms are CSS 3D on real DOM nodes — preserves Geist /
 * Noto Serif italic / Kode Mono fidelity. No WebGL.
 *
 * Mobile / reduced-motion: falls back to the existing flat
 * IssueCard accordion list (which is already excellent on touch).
 */
import { useEffect, useRef, useState } from "react";
import IssueCard from "@/components/IssueCard";
import type { Issue } from "@/lib/data/platform";
import { useMotion3DMode } from "./useReducedMotion3D";

const CARD_W = 520;
const CARD_H = 600;

function StaticPlatformList({ issues }: { issues: Issue[] }) {
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

/**
 * Maps a card's offset from the active head to a 3D transform.
 *   offset = -1: previous card, exiting left
 *   offset =  0: active card, centered
 *   offset = +1, +2, +3: queued, receding to the right
 */
function cardTransform(offset: number): { transform: string; opacity: number; z: number } {
  if (offset === 0) {
    return {
      transform: `translate3d(-50%, -50%, 0px) rotateY(0deg) rotateX(0deg) scale(1)`,
      opacity: 1,
      z: 10,
    };
  }
  if (offset < 0) {
    // Exit left, rotate away from viewer.
    const o = Math.max(offset, -2);
    const x = -50 + o * 60; // percent
    const tz = -120 + o * 80;
    const ry = -42 + o * 6;
    const op = Math.max(0, 1 + o * 0.7);
    return {
      transform: `translate3d(${x}%, -50%, ${tz}px) rotateY(${ry}deg) scale(${1 + o * 0.04})`,
      opacity: op,
      z: 5 + offset,
    };
  }
  // Queued to the right.
  const o = Math.min(offset, 3);
  const x = -50 + o * 38;
  const tz = -80 - o * 120;
  const ry = -28 - (o - 1) * 4;
  const op = Math.max(0.16, 1 - o * 0.28);
  return {
    transform: `translate3d(${x}%, -50%, ${tz}px) rotateY(${ry}deg) scale(${1 - o * 0.04})`,
    opacity: op,
    z: 10 - offset,
  };
}

export default function PlatformDeck3D({ issues }: { issues: Issue[] }) {
  const mode = useMotion3DMode();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

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

      // Forward Lenis smooth-scroll ticks to ScrollTrigger so the scrub
      // interpolation stays in lockstep with smoothed scroll position.
      const lenis = (window as unknown as {
        __lenis?: { on?: (e: string, cb: () => void) => void };
      }).__lenis;
      if (lenis?.on) {
        lenis.on("scroll", () => ScrollTrigger.update());
      }
      const section = sectionRef.current;
      if (!section) return;

      const N = issues.length;
      const state = { p: 0 };

      const apply = () => {
        // Continuous head index in [0, N-1]. The integer floor is the
        // currently-active card; the fractional part smoothly interpolates
        // the deck's transforms between two head positions.
        const head = state.p * (N - 1);
        const headIdx = Math.round(head);
        for (let i = 0; i < N; i++) {
          const card = cardRefs.current[i];
          if (!card) continue;
          const offset = i - head;
          const offsetInt = i - headIdx;
          const t = cardTransform(offset);
          card.style.transform = t.transform;
          card.style.opacity = String(t.opacity);
          card.style.zIndex = String(50 + Math.round(t.z));
          // active class toggled via attribute to drive CSS rule changes
          // for the title color + corner brackets.
          if (offsetInt === 0) {
            card.dataset.active = "true";
          } else {
            card.dataset.active = "false";
          }
        }
        setActiveIndex((prev) => (prev === headIdx ? prev : headIdx));
      };
      apply();

      const ctx = gsap.context(() => {
        gsap.to(state, {
          p: 1,
          ease: "none",
          onUpdate: apply,
          scrollTrigger: {
            // Same pattern as the cabinet carousel: a tall outer section
            // + a sticky inner stage. Avoids ScrollTrigger.pin (which
            // doesn't compose cleanly with Lenis smooth scroll on this
            // site).
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
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
  }, [mode, issues.length]);

  if (mode === "off" || mode === "mobile") {
    return <StaticPlatformList issues={issues} />;
  }

  return (
    <>
      {/* SR / SEO fallback — full list is always discoverable. */}
      <ol className="sr-only">
        {issues.map((issue, i) => (
          <li key={issue.id} id={issue.id}>
            {String(i + 1).padStart(2, "0")} — {issue.title}. {issue.summary}{" "}
            {issue.body}
          </li>
        ))}
      </ol>

      <div
        ref={sectionRef}
        className="relative -mx-6 lg:-mx-8"
        // Tall outer for scrub range.
        style={{ height: `${Math.max(2400, issues.length * 260)}px` }}
        aria-hidden
      >
       <div
         className="sticky top-0 w-full overflow-hidden"
         style={{ height: "100svh" }}
       >
        {/* HUD readout */}
        <div className="absolute top-6 left-0 right-0 z-30 px-6 lg:px-8 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-40)] pointer-events-none">
          <span>
            Position ·{" "}
            <span className="text-[var(--accent-red)]">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>{" "}
            / {String(issues.length).padStart(2, "0")}
          </span>
          <span className="hidden sm:inline">Scroll to advance</span>
          <span className="tabular-nums">DECK 01 / 01</span>
        </div>

        <span aria-hidden className="absolute top-6 left-6 lg:left-8 h-3 w-3 border-l border-t border-[var(--accent-red)] z-30 pointer-events-none" />
        <span aria-hidden className="absolute bottom-6 right-6 lg:right-8 h-3 w-3 border-r border-b border-[var(--accent-red)] z-30 pointer-events-none" />

        {/* The current issue title rendered behind the deck — Linear /
            Vercel-marketing trick: huge ghosted display word that
            anchors the eye while the deck shuffles. */}
        <div className="absolute inset-0 flex items-center justify-start pl-6 lg:pl-12 pointer-events-none select-none z-0">
          <div className="font-display text-[14vw] leading-[0.85] tracking-[-0.055em] text-[var(--fg)] opacity-[0.045] whitespace-nowrap">
            {issues[activeIndex]?.title}
          </div>
        </div>

        <div
          className="absolute inset-0"
          style={{
            perspective: "1600px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{ transformStyle: "preserve-3d", width: 0, height: 0 }}
          >
            {issues.map((issue, i) => (
              <div
                key={issue.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute group/card"
                data-active="false"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  left: 0,
                  top: 0,
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                  transition:
                    "opacity 320ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <div
                  className="relative h-full w-full flex flex-col"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--hairline)",
                    boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
                  }}
                >
                  {/* Red left rail — visible only on the active card via
                      a CSS attribute selector. */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 bottom-0 w-px"
                    style={{
                      background: "var(--accent-red)",
                      opacity: 0,
                      transition: "opacity 320ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                    data-rail
                  />
                  {/* Red corner brackets on active card. */}
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 h-3 w-3 border-l border-t border-transparent"
                    data-corner-tl
                    style={{
                      transition: "border-color 320ms",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-0 right-0 h-3 w-3 border-r border-b border-transparent"
                    data-corner-br
                    style={{
                      transition: "border-color 320ms",
                    }}
                  />

                  <div className="px-8 py-6 flex items-center justify-between border-b border-[var(--hairline)]">
                    <span className="font-mono text-[10px] tabular-nums tracking-[0.06em] text-[var(--fg-40)]">
                      [ {String(i + 1).padStart(2, "0")} ] / {String(issues.length).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-40)]">
                      Position
                    </span>
                  </div>

                  <div className="p-8 md:p-10 flex-1 flex flex-col">
                    <div className="eyebrow !text-[var(--fg-40)]">
                      Sackett / Kavuru 2028
                    </div>
                    <div className="font-display mt-6 text-[40px] md:text-[56px] leading-[0.96] tracking-[-0.04em]">
                      {issue.title}
                    </div>
                    <div className="mt-5 h-px w-12 bg-[var(--hairline-strong)]" data-divider />
                    <p className="mt-6 text-[14px] md:text-[15px] leading-[1.7] text-[var(--fg-60)]">
                      {issue.summary}
                    </p>
                    <p className="mt-5 text-[13px] md:text-[14px] leading-[1.75] text-[var(--fg-60)] flex-1">
                      {issue.body}
                    </p>
                    <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-40)]">
                      <span className="inline-block h-px w-6 bg-[var(--accent-red)]" />
                      Position — Platform
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom progress dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-[6px] pointer-events-none">
          {issues.map((_, i) => (
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

      {/* Style block to drive [data-active=true] highlights without
          per-render React work. Plain <style> (not styled-jsx) so we
          don't take a runtime dependency. The selectors are scoped to
          our [data-rail]/[data-corner-*]/[data-divider] attributes,
          which exist only on this component's cards. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-active="true"] [data-rail] { opacity: 1; }
            [data-active="true"] [data-corner-tl] { border-color: var(--accent-red); }
            [data-active="true"] [data-corner-br] { border-color: var(--accent-red); }
            [data-active="true"] [data-divider] { background: var(--accent-red); }
          `,
        }}
      />
    </>
  );
}
