"use client";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,214,160,0.20),transparent_70%)] animate-pulse" />
    </div>
  ),
});

export default function Hero3DWrapper(props: { className?: string }) {
  return (
    <div className={`relative w-full h-full ${props.className ?? ""}`}>
      <Hero3D />
      {/* Soft feather so the canvas blends rather than clips into the layout */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, var(--bg) 0%, color-mix(in oklab, var(--bg) 70%, transparent) 14%, transparent 38%, transparent 76%, color-mix(in oklab, var(--bg) 60%, transparent) 96%, var(--bg) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, transparent, var(--bg))" }}
      />
    </div>
  );
}
