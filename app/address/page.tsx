import type { Metadata } from "next";
import AddressClient from "./AddressClient";

export const metadata: Metadata = {
  title: "State of the Union — 2029",
  description:
    "The first State of the Union address of the Sackett administration. Delivered to a Joint Session of the 121st Congress on three themes: fiscal renewal, border and sovereignty, constitutional restoration.",
  alternates: { canonical: "/address" },
  openGraph: {
    title: "State of the Union, 2029 — Sackett / Kavuru",
    description:
      "My fellow Americans. Fiscal renewal. Border and sovereignty. Constitutional restoration.",
    url: "/address",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "State of the Union, 2029 — Sackett / Kavuru",
    description: "My fellow Americans.",
  },
};

export default function AddressPage() {
  return <AddressClient />;
}
