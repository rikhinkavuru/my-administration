"use client";
import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

type Props = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  splitBy?: "char" | "word";
};

export default function SplitText({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.025,
  once = true,
  splitBy = "char",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });

  const tokens =
    splitBy === "word" ? children.split(" ") : Array.from(children);

  const variants = {
    hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        delay: delay + i * stagger,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  } as const;

  return (
    <Tag ref={ref as unknown as React.Ref<HTMLHeadingElement>} className={className} aria-label={children}>
      <span className="inline-block" aria-hidden>
        {tokens.map((tok, i) => (
          <motion.span
            key={`${tok}-${i}`}
            custom={i}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={variants}
            className="inline-block whitespace-pre"
            style={{ willChange: "transform, opacity, filter" }}
          >
            {tok === " " ? " " : tok}
            {splitBy === "word" ? " " : ""}
          </motion.span>
        ))}
      </span>
    </Tag>
  );
}

export function SplitWords({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
