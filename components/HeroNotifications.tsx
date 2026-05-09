"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const items = [
  { kind: "Endorsement", text: "WSJ Editorial Board", color: "#C9A227" },
  { kind: "Polling", text: "PA suburbs +3.2", color: "#5BC287" },
  { kind: "Coalition", text: "Chamber of Commerce", color: "#C45561" },
  { kind: "Schedule", text: "Detroit · Tomorrow", color: "#A6B4FF" },
];

export default function HeroNotifications() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      {/* Top-left floating card */}
      <div className="absolute top-[6%] -left-[6%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -16, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -8, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="glass px-4 py-3 min-w-[220px]"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: items[index].color, boxShadow: `0 0 8px ${items[index].color}` }}
              />
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                {items[index].kind}
              </span>
            </div>
            <div className="mt-1 text-sm">{items[index].text}</div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
