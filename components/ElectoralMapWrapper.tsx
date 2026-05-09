"use client";
import dynamic from "next/dynamic";

const ElectoralMap = dynamic(() => import("./ElectoralMap"), {
  ssr: false,
  loading: () => (
    <div className="glass h-[640px] flex items-center justify-center text-[var(--ink-muted)] text-sm">
      <div className="flex items-center gap-3">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
        Loading map
      </div>
    </div>
  ),
});

export default function ElectoralMapWrapper() {
  return <ElectoralMap />;
}
