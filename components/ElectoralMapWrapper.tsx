"use client";
import dynamic from "next/dynamic";

const ElectoralMap = dynamic(() => import("./ElectoralMap"), {
  ssr: false,
  loading: () => (
    <div className="card h-[640px] flex items-center justify-center text-[var(--fg-60)] text-[12px] font-mono uppercase tracking-[0.08em]">
      <div className="flex items-center gap-3">
        <span className="inline-block h-1 w-1 rounded-full bg-[var(--fg)] animate-pulse" />
        Loading map
      </div>
    </div>
  ),
});

export default function ElectoralMapWrapper() {
  return <ElectoralMap />;
}
