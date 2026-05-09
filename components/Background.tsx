"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Background() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.85, 0.7]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  return (
    <motion.div
      aria-hidden
      className="mesh-bg"
      style={{ opacity, scale }}
    />
  );
}
