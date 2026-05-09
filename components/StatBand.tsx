"use client";
import { motion } from "framer-motion";
import Counter from "./Counter";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Monumental stat band, mirroring the venture-studio "$1Million ARR" treatment.
 * Big number sits left, copy sits right with a rule between.
 */
export default function StatBand({
  metric,
  label,
  context,
  italicAccent,
}: {
  metric: number | string;
  label: string;
  context: string;
  italicAccent?: string;
}) {
  return (
    <section className="border-y border-[var(--hairline)]">
      <div className="container-page py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="eyebrow"
            >
              {label}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.1, ease: EASE }}
              className="font-display mt-6 text-[88px] sm:text-[140px] md:text-[200px] lg:text-[240px] leading-[0.86]"
            >
              {typeof metric === "number" ? <Counter to={metric} duration={1.8} delay={0.2} /> : metric}
            </motion.div>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pb-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.4, ease: EASE }}
              className="text-[var(--fg-60)] text-[15px] md:text-[17px] leading-[1.55]"
            >
              {context}{" "}
              {italicAccent && (
                <span className="font-serif-italic text-[var(--fg)]">{italicAccent}</span>
              )}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
