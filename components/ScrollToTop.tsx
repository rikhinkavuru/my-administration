"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reset scroll to the top of the page on every route change.
 *
 * Lenis hijacks the native scroll for smoothing, so we reset on multiple
 * channels: native scrollTo, documentElement, and a global lenis instance
 * if one has been published by LenisProvider.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") return;
    type GlobalLenis = { scrollTo: (target: number, opts?: { immediate?: boolean }) => void };
    const w = window as unknown as { __lenis?: GlobalLenis };
    if (w.__lenis) {
      w.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);
  return null;
}
