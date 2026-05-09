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

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

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

  const words = children.split(" ");

  // Build a flat index across the whole string so the stagger reads as one wave.
  let charIndex = 0;

  const renderWord = (word: string, wi: number) => {
    if (splitBy === "word") {
      const i = wi;
      return (
        <motion.span
          key={`w-${wi}`}
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={
            inView
              ? {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.85, delay: delay + i * stagger, ease: EASE },
                }
              : { opacity: 0, y: 28, filter: "blur(8px)" }
          }
          className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0"
          style={{ willChange: "transform, opacity, filter" }}
        >
          {word}
        </motion.span>
      );
    }
    // splitBy = char: wrap word in inline-block + nowrap so it never breaks mid-word
    return (
      <span
        key={`w-${wi}`}
        className="inline-block whitespace-nowrap"
        style={{ marginRight: "0.28em" }}
      >
        {Array.from(word).map((ch) => {
          const i = charIndex++;
          return (
            <motion.span
              key={`c-${wi}-${i}`}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.85, delay: delay + i * stagger, ease: EASE },
                    }
                  : { opacity: 0, y: 28, filter: "blur(8px)" }
              }
              className="inline-block"
              style={{ willChange: "transform, opacity, filter" }}
            >
              {ch}
            </motion.span>
          );
        })}
      </span>
    );
  };

  return (
    <Tag
      ref={ref as unknown as React.Ref<HTMLHeadingElement>}
      className={className}
      aria-label={children}
    >
      <span aria-hidden>{words.map((w, i) => renderWord(w, i))}</span>
    </Tag>
  );
}

export function SplitWords({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
