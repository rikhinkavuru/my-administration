"use client";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(196,85,97,0.35),transparent_70%)] animate-pulse" />
    </div>
  ),
});

export default function Hero3DWrapper(props: { className?: string }) {
  return (
    <div className={`relative w-full h-full ${props.className ?? ""}`}>
      <Hero3D />
    </div>
  );
}
