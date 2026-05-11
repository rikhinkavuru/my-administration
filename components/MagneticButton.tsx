"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { ReactNode, useRef, MouseEvent } from "react";

export default function MagneticButton({
  href,
  children,
  className = "",
  variant = "primary",
  strength = 0.22,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
  strength?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cls = `btn ${variant === "primary" ? "btn-primary" : "btn-ghost"} group ${className}`;

  // Wrap children so any inline-end icon receives a translate on hover.
  const content = (
    <span className="flex items-center gap-[0.55rem]">
      {children}
    </span>
  );

  if (href) {
    return (
      <motion.span style={{ x: sx, y: sy }} className="inline-block">
        <Link
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          href={href}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className={cls}
        >
          {content}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      ref={ref as unknown as React.Ref<HTMLButtonElement>}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cls}
    >
      {content}
    </motion.button>
  );
}
