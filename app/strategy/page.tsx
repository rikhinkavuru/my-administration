import type { Metadata } from "next";
import StrategyClient from "./StrategyClient";

export const metadata: Metadata = {
  title: "Strategy — The Path to 270",
  description:
    "Coalition math, the four must-win states, and an honest electoral map. How a Sackett / Kavuru ticket reaches 270 without populist theater.",
  alternates: { canonical: "/strategy" },
  openGraph: {
    title: "Strategy — Sackett / Kavuru 2028",
    description:
      "The path to 270. Four battlegrounds, three lean-Republican states, one disciplined coalition.",
    url: "/strategy",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategy — Sackett / Kavuru 2028",
    description: "The path to 270. Four battlegrounds. One disciplined coalition.",
  },
};

export default function StrategyPage() {
  return <StrategyClient />;
}
