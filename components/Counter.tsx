"use client";
import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Counter({
  to,
  from = 0,
  duration = 1.6,
  delay = 0,
  className = "",
  format = (n: number) => Math.round(n).toString(),
  suffix = "",
}: {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  className?: string;
  format?: (n: number) => string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mv = useMotionValue(from);
  const display = useTransform(mv, (v) => format(v));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, delay, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, to, duration, delay, mv]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
