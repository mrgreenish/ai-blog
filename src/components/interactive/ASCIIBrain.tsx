"use client";

import { useEffect, useRef } from "react";

interface ASCIIBrainProps {
  className?: string;
}

interface Dot {
  x: number;
  y: number;
  z: number;
  phase: number;
}

const MAX_DPR = 2;
const INK = "91, 33, 182";

function randomUnitPoint() {
  const y = Math.random() * 2 - 1;
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(1 - y * y);
  return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
}

function createBrainDots(count: number): Dot[] {
  const dots: Dot[] = [];

  for (let index = 0; index < count; index++) {
    const point = randomUnitPoint();
    const hemisphere = index % 2 === 0 ? -1 : 1;
    const fold = 0.92 + Math.sin(point.y * 9 + point.z * 7) * 0.06;

    dots.push({
      // Two folded, offset ellipsoids create the cerebral hemispheres.
      x: hemisphere * 0.29 + point.x * 0.72 * fold,
      y: point.y * 0.62 * fold + Math.sin(point.x * 7) * 0.025,
      z: point.z * 0.56 * fold,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // A small lower-back lobe makes the silhouette clearly read as a brain.
  for (let index = 0; index < Math.round(count * 0.18); index++) {
    const point = randomUnitPoint();
    dots.push({
      x: 0.3 + point.x * 0.36,
      y: -0.43 + point.y * 0.24,
      z: -0.28 + point.z * 0.29,
      phase: Math.random() * Math.PI * 2,
    });
  }

  return dots;
}

export function ASCIIBrain({ className = "" }: ASCIIBrainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = createBrainDots(width < 640 ? 700 : 1150);
    };

    const draw = (time: number) => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);

      const yaw = reducedMotion ? -0.36 : Math.sin(time * 0.00018) * 0.42 - 0.25;
      const pitch = reducedMotion ? -0.12 : Math.sin(time * 0.00011) * 0.1 - 0.08;
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);
      const scale = Math.min(width * 0.8, height * 1.15);

      const projected = dots.map((dot) => {
        const rotatedX = dot.x * cosYaw - dot.z * sinYaw;
        const rotatedZ = dot.x * sinYaw + dot.z * cosYaw;
        const rotatedY = dot.y * cosPitch - rotatedZ * sinPitch;
        const depth = dot.y * sinPitch + rotatedZ * cosPitch;
        return { ...dot, x: rotatedX, y: rotatedY, depth };
      }).sort((a, b) => a.depth - b.depth);

      for (const dot of projected) {
        const perspective = 1 / (1.7 - dot.depth * 0.4);
        const x = width / 2 + dot.x * scale * perspective;
        const y = height / 2 - dot.y * scale * perspective;
        const light = Math.max(0.16, Math.min(1, 0.54 + dot.depth * 0.42));
        const pulse = reducedMotion ? 0 : Math.max(0, Math.sin(time * 0.0015 + dot.phase) - 0.93) * 2.5;
        const radius = (0.9 + light * 1.5 + pulse) * perspective * 1.8;

        context.beginPath();
        context.fillStyle = `rgba(${INK}, ${0.28 + light * 0.68})`;
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const animate = (time: number) => {
      draw(time);
      if (!reducedMotion) frame = requestAnimationFrame(animate);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      reducedMotion = motionQuery.matches;
      cancelAnimationFrame(frame);
      if (reducedMotion) draw(0);
      else frame = requestAnimationFrame(animate);
    };
    const observer = new ResizeObserver(resize);

    resize();
    observer.observe(container);
    motionQuery.addEventListener("change", updateMotion);
    if (reducedMotion) draw(0);
    else frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motionQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className={`ascii-brain-stage ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
