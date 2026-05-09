"use client";

/**
 * Linear-style faint grid background, masked with a radial fade.
 * Pure CSS, no JS, no animation — it's the quiet backdrop the rest of the
 * hero plays against.
 */
export default function GridFloor() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--hairline) 1px, transparent 1px),
            linear-gradient(to bottom, var(--hairline) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, black 40%, transparent 80%)",
        }}
      />
    </div>
  );
}
