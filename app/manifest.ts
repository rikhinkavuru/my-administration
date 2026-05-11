import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sackett / Kavuru 2028 — Renew the Republic",
    short_name: "Sackett / Kavuru",
    description:
      "A serious agenda for a serious moment. Limited government, free markets, strong national defense, and constitutional restoration.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
