"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "@/lib/noise";

interface ASCIIBrainProps {
  className?: string;
  charSize?: number;
}

// Expanding ring that temporarily boosts cell intensity.
interface Pulse {
  col: number;
  row: number;
  radius: number;
  maxRadius: number;
  life: number; // 0..1
}

const BRAIN_CHARS = [
  "1", "2", "3", "4", "5", "6", "7", "9",
  "@", "+", "=", "^", "/",
];

const MAX_DPR = 2;
const PULSE_INTERVAL = 220;   // frames between pulses
const PULSE_SPEED = 0.35;     // cells per frame
const PULSE_RING_WIDTH = 3;   // cells
const FLICKER_RATE = 0.02;
const CHAR_CYCLE_FRAMES = 10; // how often glyphs tick over

export function ASCIIBrain({ className = "", charSize = 12 }: ASCIIBrainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Three independent noise fields: silhouette edge, folds, per-frame flicker.
    const shapeNoise = createNoise2D(71);
    const foldNoise = createNoise2D(113);
    const flickerNoise = createNoise2D(199);

    // Read the accent color from the theme so it tracks globals.css.
    const rootStyle = getComputedStyle(document.documentElement);
    const rawAccent =
      rootStyle.getPropertyValue("--color-accent-brain").trim() || "#5B21B6";
    const [accentR, accentG, accentB] = hexToRgb(rawAccent);

    // Grid / layout state (rebuilt on every resize).
    let cols = 0;
    let rows = 0;
    let cellW = 0;
    let cellH = 0;
    let offsetX = 0;
    let offsetY = 0;
    let viewW = 0;
    let viewH = 0;

    // Static per-cell data.
    let baseIntensity = new Float32Array(0);
    let isInside = new Uint8Array(0);

    // Animation state.
    let time = 0;
    let rafId = 0;
    let paused = false;
    let pulseTimer = 60; // fire the first pulse shortly after mount
    let pulses: Pulse[] = [];

    // --- Procedural brain silhouette (time-independent) ---
    function sampleShape(nx: number, ny: number): {
      inside: boolean;
      intensity: number;
    } {
      // Main hemispheres as a perturbed ellipse.
      const ex = nx / 0.95;
      const ey = ny / 0.72;
      const ellipseDist = Math.sqrt(ex * ex + ey * ey);
      const edgeN = shapeNoise(nx * 2.4, ny * 2.4); // [-1, 1]
      const mainDist = ellipseDist + edgeN * 0.09;

      // Cerebellum bump offset to lower-right.
      const cbX = (nx - 0.58) / 0.28;
      const cbY = (ny - 0.55) / 0.22;
      const cbDist = Math.sqrt(cbX * cbX + cbY * cbY);

      const sdf = Math.min(mainDist, cbDist);
      if (sdf >= 1) return { inside: false, intensity: 0 };

      // Brighter toward the interior, dimmer near the edge.
      const coreness = 1 - sdf;

      // Longitudinal fissure — a dark groove along the vertical axis.
      const fissure = Math.exp(-(nx * nx) / 0.006) * 0.55;

      // Low-frequency folds make the fill non-uniform.
      const folds = (foldNoise(nx * 3.2 + 9, ny * 3.2 - 5) + 1) * 0.5;

      const intensity = Math.max(
        0,
        Math.min(1, coreness * (1 - fissure) * (0.45 + folds * 0.55) * 1.25)
      );
      return { inside: true, intensity };
    }

    function init() {
      viewW = container!.clientWidth;
      viewH = container!.clientHeight;
      if (viewW === 0 || viewH === 0) {
        cols = 0;
        rows = 0;
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas!.width = viewW * dpr;
      canvas!.height = viewH * dpr;
      canvas!.style.width = `${viewW}px`;
      canvas!.style.height = `${viewH}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cellW = Math.max(6, Math.floor(charSize * 0.62));
      cellH = Math.max(8, Math.floor(charSize * 1.05));
      cols = Math.floor(viewW / cellW);
      rows = Math.floor(viewH / cellH);
      offsetX = Math.floor((viewW - cols * cellW) / 2);
      offsetY = Math.floor((viewH - rows * cellH) / 2);

      // Fit the brain silhouette into the cell grid. The normalized shape
      // spans roughly [-1.15, 1.15] horizontally and [-0.95, 1.0] vertically
      // (with the cerebellum extension), so scale so the smaller axis fits.
      const shapeScale = Math.min(cols / 2.3, rows / 1.9);
      const shapeCx = cols / 2;
      const shapeCy = rows / 2;

      baseIntensity = new Float32Array(cols * rows);
      isInside = new Uint8Array(cols * rows);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const nx = (col - shapeCx) / shapeScale;
          const ny = (row - shapeCy) / shapeScale;
          const s = sampleShape(nx, ny);
          const i = row * cols + col;
          isInside[i] = s.inside ? 1 : 0;
          baseIntensity[i] = s.intensity;
        }
      }

      pulses = [];
      pulseTimer = 60;
    }

    function spawnPulse() {
      if (cols === 0 || rows === 0) return;
      for (let attempt = 0; attempt < 30; attempt++) {
        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);
        if (isInside[row * cols + col]) {
          pulses.push({
            col,
            row,
            radius: 0,
            maxRadius: Math.max(cols, rows) * 0.7,
            life: 1,
          });
          return;
        }
      }
    }

    function updatePulses() {
      for (const p of pulses) {
        p.radius += PULSE_SPEED;
        p.life = Math.max(0, 1 - p.radius / p.maxRadius);
      }
      pulses = pulses.filter((p) => p.life > 0);

      pulseTimer--;
      if (pulseTimer <= 0) {
        spawnPulse();
        pulseTimer = PULSE_INTERVAL;
      }
    }

    function draw() {
      if (cols === 0 || rows === 0) return;
      ctx!.clearRect(0, 0, viewW, viewH);
      ctx!.font = `${charSize}px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace`;
      ctx!.textBaseline = "top";

      const cycleTick = Math.floor(time / CHAR_CYCLE_FRAMES);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          if (!isInside[idx]) continue;
          const base = baseIntensity[idx];
          if (base < 0.05) continue;

          // Animated per-cell flicker.
          const n = flickerNoise(col * 0.09, row * 0.09 + time * FLICKER_RATE);
          const flick = (n + 1) * 0.5; // 0..1
          let alpha = base * (0.35 + flick * 0.65);

          // Pulse ring contribution.
          for (const p of pulses) {
            const dx = col - p.col;
            const dy = row - p.row;
            const d = Math.sqrt(dx * dx + dy * dy);
            const ringDist = Math.abs(d - p.radius);
            if (ringDist < PULSE_RING_WIDTH) {
              alpha += (1 - ringDist / PULSE_RING_WIDTH) * p.life * 0.6;
            }
          }

          if (alpha < 0.06) continue;
          if (alpha > 1) alpha = 1;

          // Character hash: stable per cell, cycles over time.
          const hash = Math.abs(
            (col * 1973 + row * 3079 + cycleTick * 541 + (col ^ row) * 13) | 0
          );
          const char = BRAIN_CHARS[hash % BRAIN_CHARS.length];

          ctx!.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${alpha.toFixed(3)})`;
          ctx!.fillText(char, offsetX + col * cellW, offsetY + row * cellH);
        }
      }
    }

    function loop() {
      if (!paused) {
        time += 1;
        updatePulses();
        draw();
      }
      rafId = requestAnimationFrame(loop);
    }

    function onVisibilityChange() {
      paused = document.hidden;
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 50);
    });

    init();
    rafId = requestAnimationFrame(loop);

    document.addEventListener("visibilitychange", onVisibilityChange);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
    };
  }, [charSize]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  if (clean.length >= 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return [r, g, b];
  }
  return [91, 33, 182];
}
