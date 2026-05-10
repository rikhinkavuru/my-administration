"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDeviceTier } from "./useDeviceTier";
import type { ProgressRef } from "./constants";

const JetCanvas = dynamic(() => import("./JetCanvas"), {
  ssr: false,
  loading: () => null,
});

/**
 * Wraps a section of the page that becomes the scroll trigger. Drives a
 * scroll-linked progress ref via GSAP ScrollTrigger with `scrub`, so the
 * jet's transforms are tied to scroll position (not autoplay time).
 *
 * Two ScrollTriggers run side by side:
 *   1. Mount-toggle trigger — fires onEnter/onLeave with a 200px buffer
 *      to mount/unmount the WebGL canvas (saves GPU when far from view).
 *   2. Scrub tween     — tweens progressRef.current.progress 0->1 across
 *      the trigger's natural scroll range with 0.6s smoothing.
 *
 * Honors prefers-reduced-motion (skipped entirely when tier === "none").
 * GSAP is dynamically imported so it's not in the initial bundle.
 */
export default function JetSequence({ children }: { children: ReactNode }) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<{ progress: number }>({ progress: 0 });
  const [active, setActive] = useState(false);
  const tier = useDeviceTier();

  useEffect(() => {
    if (tier === "none") return;
    const el = triggerRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all(
        [import("gsap"), import("gsap/ScrollTrigger")]
      );
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // Mount the WebGL canvas WELL before the trigger section enters
      // the viewport so shader compilation + first-frame upload happens
      // before the user gets there. Without this buffer the canvas mount
      // costs a frame at the edge of the trigger zone, which reads as a
      // scroll hitch right when the jet is supposed to start moving.
      const mountTrigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom+=1800",
        end: "bottom top-=1800",
        onEnter: () => setActive(true),
        onEnterBack: () => setActive(true),
        onLeave: () => setActive(false),
        onLeaveBack: () => setActive(false),
      });

      const ctx = gsap.context(() => {
        gsap.fromTo(
          progressRef.current,
          { progress: 0 },
          {
            progress: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              // Trigger range now matches when the section is actually
              // VISIBLE. start: section's top crosses 90% of viewport
              // height (section is ~10% revealed). end: section's bottom
              // crosses 10% from the top (section is ~10% from leaving).
              // Previously the range extended far above and below visible
              // bounds, so by the time the user's eyes reached the
              // section the jet was already mid-flight.
              start: "top 90%",
              end: "bottom 10%",
              scrub: 2.5,
            },
          }
        );
      });

      cleanup = () => {
        mountTrigger.kill();
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [tier]);

  return (
    <>
      <div ref={triggerRef} className="relative">
        {children}
      </div>
      {active && tier !== "none" && (
        <div
          aria-hidden
          className="fixed inset-0 z-[60] pointer-events-none"
          style={{ contain: "strict" }}
        >
          <JetCanvas progressRef={progressRef as ProgressRef} tier={tier} />
        </div>
      )}
    </>
  );
}
