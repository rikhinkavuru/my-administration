import { ImageResponse } from "next/og";

export const alt = "Sackett / Kavuru 2028 — Renew the Republic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 18,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <span style={{ color: "#D63D44" }}>///</span>
          <span>Sackett / Kavuru — 2028</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 140,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              color: "#fff",
            }}
          >
            Renew the
          </div>
          <div
            style={{
              fontSize: 140,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              color: "#D63D44",
              fontStyle: "italic",
              fontFamily: "Georgia, serif",
            }}
          >
            Republic.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 18,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.06em",
          }}
        >
          <div style={{ textTransform: "uppercase" }}>
            A serious agenda for a serious moment.
          </div>
          <div style={{ fontFamily: "ui-monospace, monospace" }}>2028</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
