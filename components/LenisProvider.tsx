"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      // Slower, smoother scroll across the whole site so reading rhythm feels deliberate.
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    // Publish the instance so ScrollToTop (route-change scroll reset) can use it.
    (window as unknown as { __lenis?: unknown }).__lenis = lenis;
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      try {
        delete (window as unknown as { __lenis?: unknown }).__lenis;
      } catch {}
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
