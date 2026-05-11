"use client";
/**
 * Client-only mount for CabinetCarousel3D. We dynamic-import the actual
 * component so its GSAP/ScrollTrigger imports + per-card 3D markup never
 * appear in the executive page's initial bundle. While loading, we render
 * the existing static <CabinetCard/> grid as a graceful fallback — the
 * same markup the reduced-motion and mobile paths show, so there's never
 * a layout pop.
 */
import dynamic from "next/dynamic";
import CabinetCard from "@/components/CabinetCard";
import type { CabinetPick } from "@/lib/data/cabinet";

const Carousel = dynamic(() => import("./CabinetCarousel3D"), {
  ssr: false,
  // No loading placeholder: the dynamic component renders the static
  // grid itself when reduced-motion / mobile is detected, and on full
  // desktop the carousel's first paint is fast enough that a separate
  // skeleton would only cause a flash.
  loading: () => null,
});

export default function CabinetCarousel3DMount({ picks }: { picks: CabinetPick[] }) {
  return <Carousel picks={picks} />;
}

// Re-export the static fallback for SSR / no-JS rendering on the page.
export function StaticCabinetGrid({ picks }: { picks: CabinetPick[] }) {
  return (
    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
      {picks.map((c, i) => (
        <CabinetCard key={c.department} pick={c} index={i} />
      ))}
    </div>
  );
}
