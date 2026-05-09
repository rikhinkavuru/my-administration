"use client";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(196,85,97,0.30),transparent_70%)] animate-pulse" />
    </div>
  ),
});

export default function Hero3DWrapper(props: { className?: string }) {
  return (
    <div className={`relative w-full h-full ${props.className ?? ""}`}>
      <Hero3D />
      {/* Feather edges so the canvas blends into the page */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, var(--bg) 0%, color-mix(in oklab, var(--bg) 80%, transparent) 18%, transparent 35%, transparent 70%, color-mix(in oklab, var(--bg) 60%, transparent) 92%, var(--bg) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
      />
    </div>
  );
}
