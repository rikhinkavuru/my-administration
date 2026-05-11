"use client";
import { motion } from "framer-motion";
import Counter from "./Counter";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Monumental stat band. Massive numeric on the left, a hairline column rule,
 * then context copy on the right.
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
    <section className="relative border-y border-[var(--hairline)] bg-[var(--bg)] overflow-hidden">
      {/* faint grid */}
      <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
      <div className="container-page relative py-24 md:py-36">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-7 relative">
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
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
              className="font-display mt-6 text-[120px] sm:text-[180px] md:text-[240px] lg:text-[300px] xl:text-[340px] leading-[0.82] tracking-[-0.06em] tabular-nums"
            >
              {typeof metric === "number" ? (
                <Counter to={metric} duration={2.0} delay={0.2} />
              ) : (
                metric
              )}
            </motion.div>

            {/* corner ticks */}
            <span
              aria-hidden
              className="absolute -top-2 -left-2 h-3 w-3 border-l border-t border-[var(--accent-red)]"
            />
          </div>

          <div className="md:col-span-5 md:col-start-8 md:pb-8 relative">
            <span
              aria-hidden
              className="hidden md:block absolute -left-8 top-0 bottom-0 w-px bg-[var(--hairline)]"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-40)] mb-4"
            >
              ↳ Context
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.4, ease: EASE }}
              className="text-[var(--fg-60)] text-[16px] md:text-[19px] leading-[1.5] max-w-md"
            >
              {context}{" "}
              {italicAccent && (
                <span className="font-serif-italic text-[var(--accent-red)]">{italicAccent}</span>
              )}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
