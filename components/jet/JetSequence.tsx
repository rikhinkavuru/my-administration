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

    // Defer GSAP + ScrollTrigger setup until after the hero has settled.
    // Mounting the WebGL canvas and registering ScrollTriggers during the
    // first paint was contributing to hero load lag.
    const startDelay = (cb: () => void) => {
      const w = window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      };
      if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 1500 });
      else setTimeout(cb, 700);
    };

    let init = async () => {
      const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all(
        [import("gsap"), import("gsap/ScrollTrigger")]
      );
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // Mount canvas only when the trigger section is actually in view
      // (was "top bottom+=400" which mounted the canvas 400px BEFORE the
      // section entered, putting a z-[60] fixed overlay on top of the
      // hero and blocking nav clicks on the home page).
      const mountTrigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom-=80",
        end: "bottom top+=80",
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
              // Non-pinned. Trigger range stretched to the full natural
              // visible window plus a small extension below it so the jet
              // has more scroll distance to traverse the X arc, and
              // higher scrub for buttery interpolation between scroll
              // samples. Combined effect is a noticeably slower, cleaner
              // flight without resorting to pin (which crashed previously
              // alongside Lenis smooth scroll).
              start: "top bottom",
              end: "bottom top-=40%",
              scrub: 3.5,
            },
          }
        );
      });

      cleanup = () => {
        mountTrigger.kill();
        ctx.revert();
      };
    };
    startDelay(() => {
      void init();
    });

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
