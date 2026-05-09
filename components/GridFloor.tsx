"use client";

/**
 * Linear-style faint grid background, masked with a radial fade.
 * Pure CSS, no JS, no animation — sits as the quiet backdrop.
 */
export default function GridFloor() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(242, 239, 230, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(242, 239, 230, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, black 0%, black 30%, transparent 80%)",
        }}
      />
    </div>
  );
}
