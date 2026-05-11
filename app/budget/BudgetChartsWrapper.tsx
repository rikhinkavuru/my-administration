"use client";
import dynamic from "next/dynamic";

const BudgetCharts = dynamic(() => import("@/components/BudgetCharts"), {
  ssr: false,
  loading: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="card p-7 md:p-9 h-[560px] flex items-center justify-center text-[var(--fg-60)] text-[12px] font-mono uppercase tracking-[0.08em]"
        >
          <div className="flex items-center gap-3">
            <span className="inline-block h-1 w-1 rounded-full bg-[var(--fg)] animate-pulse" />
            Loading chart
          </div>
        </div>
      ))}
    </div>
  ),
});

export default function BudgetChartsWrapper() {
  return <BudgetCharts />;
}
