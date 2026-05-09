"use client";
import { ReactNode } from "react";

export default function Marquee({ items }: { items: string[] }) {
  // duplicate so the keyframe loop is seamless
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[var(--hairline)] py-6 select-none">
      <div className="marquee">
        {doubled.map((it, i) => (
          <Span key={i}>{it}</Span>
        ))}
      </div>
    </div>
  );
}

function Span({ children }: { children: ReactNode }) {
  return (
    <span className="font-display text-[44px] md:text-[64px] tracking-[-0.03em] flex items-center gap-12 shrink-0">
      {children}
      <span className="text-[var(--accent-red)]">•</span>
    </span>
  );
}
