"use client";

export default function Marquee({
  items,
  speed = "normal",
}: {
  items: string[];
  speed?: "normal" | "fast";
}) {
  // duplicate so the keyframe loop is seamless
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[var(--hairline)] py-7 select-none bg-[var(--bg)]">
      {/* Edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 md:w-40"
        style={{
          background:
            "linear-gradient(to right, var(--bg) 0%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 md:w-40"
        style={{
          background:
            "linear-gradient(to left, var(--bg) 0%, transparent 100%)",
        }}
      />

      <div className={`marquee ${speed === "fast" ? "marquee-fast" : ""}`}>
        {doubled.map((it, i) => {
          const isAccent = i % 2 === 0;
          return (
            <span
              key={i}
              className="font-display text-[44px] md:text-[64px] lg:text-[80px] tracking-[-0.04em] flex items-center gap-10 shrink-0 leading-none"
            >
              <span className={isAccent ? "text-[var(--fg)]" : "text-[var(--fg-40)]"}>
                {it}
              </span>
              <span
                aria-hidden
                className="inline-block h-2 w-2 rotate-45 bg-[var(--accent-red)]"
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
