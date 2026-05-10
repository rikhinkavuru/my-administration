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
              // Pin the section while the jet sweeps. With pin enabled,
              // GSAP keeps the section stuck to the top of the viewport
              // for the entire end offset, so the jet's X progresses at a
              // fixed scene-units-per-vh rate regardless of section
              // height. 300vh of pinned scroll gives the user time to
              // read the banner as it passes.
              start: "top top",
              end: "+=300%",
              pin: true,
              pinSpacing: true,
              scrub: 1.5,
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
