"use client";
import { useEffect, useRef } from "react";

/**
 * Cursor-reactive dot field. Pure canvas2D, RAF-driven.
 * Dots within INFLUENCE pixels of the cursor scale up and brighten.
 */
export default function DotGrid({ density = 26 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let t = 0;

    const fit = () => {
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    fit();
    const onResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      fit();
    };

    const INFLUENCE = 140;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / density);
      const rows = Math.ceil(h / density);
      const offX = (w - (cols - 1) * density) / 2;
      const offY = (h - (rows - 1) * density) / 2;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = offX + x * density;
          const py = offY + y * density;
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const d = Math.hypot(dx, dy);
          const within = d < INFLUENCE;
          const f = within ? 1 - d / INFLUENCE : 0;
          const wave = Math.sin(t * 1.3 + (x + y) * 0.4) * 0.15 + 0.85;
          const baseAlpha = 0.06 * wave;
          const alpha = within ? baseAlpha + f * 0.55 : baseAlpha;
          const r = within ? 0.7 + f * 1.6 : 0.7;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = within
            ? `rgba(196, 85, 97, ${alpha.toFixed(3)})`
            : `rgba(242, 239, 230, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", onResize);
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
