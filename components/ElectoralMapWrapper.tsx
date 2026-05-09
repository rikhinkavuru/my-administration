"use client";
import dynamic from "next/dynamic";

const ElectoralMap = dynamic(() => import("./ElectoralMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] h-[560px] flex items-center justify-center text-[var(--fg-muted)]">
      Loading map…
    </div>
  ),
});

export default function ElectoralMapWrapper() {
  return <ElectoralMap />;
}
