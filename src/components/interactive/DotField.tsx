"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "@/lib/noise";

interface Dot {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
}

// --- Attention event: a "query" dot attending to several distant dots ---
interface AttentionEvent {
  sourceIdx: number;
  targetIndices: number[];
  weights: number[];        // 0..1 per target
  life: number;             // 0..1 lifecycle progress
  duration: number;         // total frames
  age: number;              // current frame
}

// --- Propagation ripple: expanding ring of activation ---
interface Ripple {
  cx: number;
  cy: number;
  radius: number;
  maxRadius: number;
  speed: number;
  life: number;             // 0..1
}

// --- Token trace: sequential highlighting through dots ---
interface TokenTrace {
  path: number[];           // dot indices
  current: number;          // how far along the path
  speed: number;            // dots per frame
  progress: number;         // fractional position
  tailLength: number;       // how many dots glow behind the head
}

const TAU = Math.PI * 2;
const DOT_SPACING = 28;
const DOT_SPACING_MOBILE = 36;
const DOT_RADIUS = 1.5;
const DOT_RADIUS_MAX = 2.5;
const MOUSE_RADIUS = 150;
const MOUSE_FORCE = 8;
const MOUSE_DAMPING = 0.85;          // extra damping near mouse (sand-like drag)
const NOISE_SCALE = 0.004;
const NOISE_SPEED = 0.0004;
const SPRING = 0.012;
const DAMPING = 0.96;
const MAX_DPR = 2;
const MOBILE_BREAKPOINT = 768;

const CONNECTION_RADIUS = 55;
const CONNECTION_OPACITY = 0.12;
const CONNECTION_LINE_WIDTH = 0.5;
const DEPTH_LAYER_TOLERANCE = 0.35;
const BREATH_SPEED = 0.0008;
const BREATH_AMOUNT = 0.15;
const GLOW_RADIUS = 180;
const GLOW_OPACITY = 0.04;

const DEPTH_BUCKETS = 5;
const LINE_OPACITY_BUCKETS = 4;

// LLM visualization constants
const ATTENTION_INTERVAL = 180;       // frames between new attention events
const ATTENTION_DURATION = 120;       // frames an attention event lives
const ATTENTION_TARGETS = 5;          // dots per attention head
const ATTENTION_REACH = 300;          // max pixel distance for attention
const ATTENTION_LINE_OPACITY = 0.18;
const ATTENTION_LINE_WIDTH = 0.8;

const RIPPLE_INTERVAL = 300;          // frames between ripples
const RIPPLE_MAX_RADIUS = 250;
const RIPPLE_SPEED = 1.5;
const RIPPLE_WIDTH = 40;              // thickness of the wavefront ring
const RIPPLE_DOT_BOOST = 1.8;        // radius multiplier at wavefront

const TOKEN_INTERVAL = 400;           // frames between token traces
const TOKEN_SPEED = 0.4;             // dots per frame
const TOKEN_PATH_LENGTH = 25;         // dots in a trace path
const TOKEN_TAIL = 8;                 // glowing tail length

export function DotField({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise = createNoise2D(42);
    const depthNoise = createNoise2D(137);
    let dots: Dot[] = [];
    let cols = 0;
    let rows = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let mouseActive = false;
    let rafId = 0;
    let time = 0;
    let paused = false;

    // LLM visualization state
    let attentionEvents: AttentionEvent[] = [];
    let ripples: Ripple[] = [];
    let tokenTraces: TokenTrace[] = [];
    // Per-dot boost from ripples/tokens (reset each frame)
    let dotBoost: Float32Array = new Float32Array(0);

    function getSpacing() {
      return container!.clientWidth < MOBILE_BREAKPOINT
        ? DOT_SPACING_MOBILE
        : DOT_SPACING;
    }

    function initDots() {
      const dpr = Math.min(window.devicePixelRatio, MAX_DPR);
      const w = container!.clientWidth;
      const h = container!.clientHeight;

      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const spacing = getSpacing();
      cols = Math.ceil(w / spacing) + 1;
      rows = Math.ceil(h / spacing) + 1;
      const offsetX = (w - (cols - 1) * spacing) / 2;
      const offsetY = (h - (rows - 1) * spacing) / 2;

      dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const bx = offsetX + col * spacing;
          const by = offsetY + row * spacing;
          const depth = (depthNoise(col * 0.3, row * 0.3) + 1) * 0.5;
          dots.push({ baseX: bx, baseY: by, x: bx, y: by, vx: 0, vy: 0, depth });
        }
      }

      dotBoost = new Float32Array(dots.length);
      attentionEvents = [];
      ripples = [];
      tokenTraces = [];
    }

    // --- LLM event spawners ---

    function spawnAttention() {
      if (dots.length === 0) return;
      const sourceIdx = Math.floor(Math.random() * dots.length);
      const source = dots[sourceIdx];

      // Find dots within reach, sorted by distance, pick semi-random subset
      const candidates: { idx: number; dist: number }[] = [];
      for (let i = 0; i < dots.length; i++) {
        if (i === sourceIdx) continue;
        const dx = dots[i].x - source.x;
        const dy = dots[i].y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 60 && dist < ATTENTION_REACH) {
          candidates.push({ idx: i, dist });
        }
      }

      // Weighted random selection — prefer medium distance
      candidates.sort(() => Math.random() - 0.5);
      const targets = candidates.slice(0, ATTENTION_TARGETS);
      if (targets.length === 0) return;

      const maxDist = Math.max(...targets.map(t => t.dist));
      attentionEvents.push({
        sourceIdx,
        targetIndices: targets.map(t => t.idx),
        weights: targets.map(t => (1 - t.dist / maxDist) * 0.6 + Math.random() * 0.4),
        life: 0,
        duration: ATTENTION_DURATION,
        age: 0,
      });
    }

    function spawnRipple() {
      if (dots.length === 0) return;
      // Pick a random dot as origin
      const idx = Math.floor(Math.random() * dots.length);
      ripples.push({
        cx: dots[idx].x,
        cy: dots[idx].y,
        radius: 0,
        maxRadius: RIPPLE_MAX_RADIUS,
        speed: RIPPLE_SPEED,
        life: 0,
      });
    }

    function spawnTokenTrace() {
      if (dots.length === 0) return;
      // Build a path by walking through neighboring dots
      const startIdx = Math.floor(Math.random() * dots.length);
      const path: number[] = [startIdx];
      const visited = new Set<number>([startIdx]);
      const spacing = getSpacing();

      for (let step = 0; step < TOKEN_PATH_LENGTH - 1; step++) {
        const current = dots[path[path.length - 1]];
        let bestIdx = -1;
        let bestScore = -Infinity;

        // Look at dots within ~2 spacings, pick one that continues roughly forward
        for (let i = 0; i < dots.length; i++) {
          if (visited.has(i)) continue;
          const dx = dots[i].baseX - current.baseX;
          const dy = dots[i].baseY - current.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < spacing * 0.5 || dist > spacing * 2.5) continue;

          // Prefer rightward/downward flow + randomness
          const score = dx * 0.3 + dy * 0.1 + Math.random() * spacing;
          if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
          }
        }

        if (bestIdx === -1) break;
        path.push(bestIdx);
        visited.add(bestIdx);
      }

      if (path.length < 5) return; // too short

      tokenTraces.push({
        path,
        current: 0,
        speed: TOKEN_SPEED,
        progress: 0,
        tailLength: TOKEN_TAIL,
      });
    }

    function updateLLMEvents() {
      // Spawn new events at intervals
      if (time % ATTENTION_INTERVAL === 0) spawnAttention();
      if (time % RIPPLE_INTERVAL === 0) spawnRipple();
      if (time % TOKEN_INTERVAL === 0) spawnTokenTrace();

      // Reset per-dot boost
      dotBoost.fill(0);

      // Update attention events
      for (let i = attentionEvents.length - 1; i >= 0; i--) {
        const evt = attentionEvents[i];
        evt.age++;
        evt.life = evt.age / evt.duration;
        if (evt.life >= 1) {
          attentionEvents.splice(i, 1);
        }
      }

      // Update ripples + apply dot boosts
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.life = r.radius / r.maxRadius;
        if (r.life >= 1) {
          ripples.splice(i, 1);
          continue;
        }

        // Boost dots at the wavefront
        for (let j = 0; j < dots.length; j++) {
          const dx = dots[j].x - r.cx;
          const dy = dots[j].y - r.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const waveDist = Math.abs(dist - r.radius);
          if (waveDist < RIPPLE_WIDTH) {
            const intensity = (1 - waveDist / RIPPLE_WIDTH) * (1 - r.life);
            dotBoost[j] = Math.max(dotBoost[j], intensity);
          }
        }
      }

      // Update token traces + apply dot boosts
      for (let i = tokenTraces.length - 1; i >= 0; i--) {
        const t = tokenTraces[i];
        t.progress += t.speed;
        t.current = Math.floor(t.progress);
        if (t.current >= t.path.length) {
          tokenTraces.splice(i, 1);
          continue;
        }

        // Boost dots in the tail
        for (let j = 0; j < t.tailLength; j++) {
          const idx = t.current - j;
          if (idx < 0 || idx >= t.path.length) continue;
          const dotIdx = t.path[idx];
          const fade = 1 - j / t.tailLength;
          // Head dot is fully bright on arrival and fades as progress moves past it
          const headFade = j === 0 ? (1 - (t.progress - t.current)) : 1;
          dotBoost[dotIdx] = Math.max(dotBoost[dotIdx], fade * headFade * 0.8);
        }
      }
    }

    function update() {
      time += 1;
      const t = time * NOISE_SPEED;
      const breathScale = 1 + Math.sin(time * BREATH_SPEED) * BREATH_AMOUNT;

      updateLLMEvents();

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const depthMul = 0.4 + d.depth * 0.6;

        // Noise-driven velocity field
        const angle =
          noise(d.baseX * NOISE_SCALE, d.baseY * NOISE_SCALE + t) * TAU;
        const mag =
          (noise(
            d.baseX * NOISE_SCALE + 100,
            d.baseY * NOISE_SCALE + t + 100
          ) + 1) * 0.5;
        d.vx += Math.cos(angle) * mag * 0.3 * depthMul * breathScale;
        d.vy += Math.sin(angle) * mag * 0.3 * depthMul * breathScale;

        // Mouse repulsion (sand-like: gentle push, heavy drag)
        let mouseDrag = 1;
        if (mouseActive) {
          const dx = d.x - mouseX;
          const dy = d.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0.1) {
            const proximity = 1 - dist / MOUSE_RADIUS;
            const factor = (proximity ** 2 * MOUSE_FORCE) / dist;
            d.vx += dx * factor * depthMul;
            d.vy += dy * factor * depthMul;
            // Extra drag near mouse — dots settle immediately like sand
            mouseDrag = MOUSE_DAMPING + (1 - MOUSE_DAMPING) * (1 - proximity);
          }
        }

        // Spring return to base
        d.vx += (d.baseX - d.x) * SPRING;
        d.vy += (d.baseY - d.y) * SPRING;

        // Damping (extra drag near mouse)
        d.vx *= DAMPING * mouseDrag;
        d.vy *= DAMPING * mouseDrag;

        // Integrate
        d.x += d.vx;
        d.y += d.vy;
      }
    }

    function draw() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      ctx!.clearRect(0, 0, w, h);

      // Pass 0: Mouse glow
      if (mouseActive) {
        const gradient = ctx!.createRadialGradient(
          mouseX, mouseY, 0,
          mouseX, mouseY, GLOW_RADIUS
        );
        gradient.addColorStop(0, `rgba(28, 25, 23, ${GLOW_OPACITY})`);
        gradient.addColorStop(1, "rgba(28, 25, 23, 0)");
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(mouseX, mouseY, GLOW_RADIUS, 0, TAU);
        ctx!.fill();
      }

      // Pass 1: Attention beams (long-range curved lines)
      for (const evt of attentionEvents) {
        // Envelope: fade in first 20%, hold, fade out last 20%
        let envelope: number;
        if (evt.life < 0.2) envelope = evt.life / 0.2;
        else if (evt.life > 0.8) envelope = (1 - evt.life) / 0.2;
        else envelope = 1;

        const source = dots[evt.sourceIdx];
        ctx!.lineWidth = ATTENTION_LINE_WIDTH;

        for (let t = 0; t < evt.targetIndices.length; t++) {
          const target = dots[evt.targetIndices[t]];
          const weight = evt.weights[t];
          const alpha = envelope * weight * ATTENTION_LINE_OPACITY;
          if (alpha < 0.005) continue;

          ctx!.strokeStyle = `rgba(28, 25, 23, ${alpha})`;

          // Draw a quadratic curve — control point offset perpendicular to the line
          const mx = (source.x + target.x) / 2;
          const my = (source.y + target.y) / 2;
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          // Perpendicular offset scaled by weight for variety
          const perpX = -dy * 0.15 * (weight - 0.5);
          const perpY = dx * 0.15 * (weight - 0.5);

          ctx!.beginPath();
          ctx!.moveTo(source.x, source.y);
          ctx!.quadraticCurveTo(mx + perpX, my + perpY, target.x, target.y);
          ctx!.stroke();

          // Small dot at the target to show "attended" dot
          const targetDotAlpha = alpha * 2;
          ctx!.fillStyle = `rgba(28, 25, 23, ${Math.min(targetDotAlpha, 0.4)})`;
          ctx!.beginPath();
          ctx!.arc(target.x, target.y, DOT_RADIUS * 2.5, 0, TAU);
          ctx!.fill();
        }

        // Slightly larger source dot
        const sourceAlpha = envelope * 0.35;
        ctx!.fillStyle = `rgba(28, 25, 23, ${sourceAlpha})`;
        ctx!.beginPath();
        ctx!.arc(source.x, source.y, DOT_RADIUS * 3, 0, TAU);
        ctx!.fill();
      }

      // Pass 2: Connection lines via spatial grid
      const cellSize = CONNECTION_RADIUS;
      const grid = new Map<string, number[]>();

      for (let i = 0; i < dots.length; i++) {
        const cx = Math.floor(dots[i].x / cellSize);
        const cy = Math.floor(dots[i].y / cellSize);
        const key = `${cx},${cy}`;
        let cell = grid.get(key);
        if (!cell) {
          cell = [];
          grid.set(key, cell);
        }
        cell.push(i);
      }

      const lineBuckets: { ax: number; ay: number; bx: number; by: number }[][] =
        Array.from({ length: LINE_OPACITY_BUCKETS }, () => []);

      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        const cx = Math.floor(a.x / cellSize);
        const cy = Math.floor(a.y / cellSize);

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const neighbors = grid.get(`${cx + dx},${cy + dy}`);
            if (!neighbors) continue;
            for (const j of neighbors) {
              if (j <= i) continue;
              const b = dots[j];

              if (Math.abs(a.depth - b.depth) > DEPTH_LAYER_TOLERANCE) continue;

              const ddx = a.x - b.x;
              const ddy = a.y - b.y;
              const dist = Math.sqrt(ddx * ddx + ddy * ddy);
              if (dist > CONNECTION_RADIUS) continue;

              const distFactor = 1 - dist / CONNECTION_RADIUS;
              const avgDepth = (a.depth + b.depth) / 2;
              const depthOpacity = 0.3 + avgDepth * 0.7;
              // Boost connection opacity near active ripples/tokens
              const boostA = dotBoost[i];
              const boostB = dotBoost[j];
              const boost = 1 + Math.max(boostA, boostB) * 2;
              const alpha = distFactor * depthOpacity * boost;

              const bucketIdx = Math.min(
                Math.floor(alpha * LINE_OPACITY_BUCKETS),
                LINE_OPACITY_BUCKETS - 1
              );
              lineBuckets[bucketIdx].push({ ax: a.x, ay: a.y, bx: b.x, by: b.y });
            }
          }
        }
      }

      ctx!.lineWidth = CONNECTION_LINE_WIDTH;
      for (let b = 0; b < LINE_OPACITY_BUCKETS; b++) {
        if (lineBuckets[b].length === 0) continue;
        const bucketAlpha =
          ((b + 0.5) / LINE_OPACITY_BUCKETS) * CONNECTION_OPACITY;
        ctx!.strokeStyle = `rgba(28, 25, 23, ${bucketAlpha})`;
        ctx!.beginPath();
        for (const line of lineBuckets[b]) {
          ctx!.moveTo(line.ax, line.ay);
          ctx!.lineTo(line.bx, line.by);
        }
        ctx!.stroke();
      }

      // Pass 3: Dots — depth-bucketed, back-to-front, with ripple/token boost
      const dotBuckets: number[][] = Array.from({ length: DEPTH_BUCKETS }, () => []);
      for (let i = 0; i < dots.length; i++) {
        const bucket = Math.min(
          Math.floor(dots[i].depth * DEPTH_BUCKETS),
          DEPTH_BUCKETS - 1
        );
        dotBuckets[bucket].push(i);
      }

      for (let b = 0; b < DEPTH_BUCKETS; b++) {
        if (dotBuckets[b].length === 0) continue;
        const t = (b + 0.5) / DEPTH_BUCKETS;
        const baseAlpha = 0.25 + t * 0.75;
        const depthRadiusScale = 0.7 + t * 0.6;

        // Separate boosted dots from normal dots to minimize fillStyle changes
        const normalIndices: number[] = [];
        const boostedIndices: number[] = [];

        for (const i of dotBuckets[b]) {
          if (dotBoost[i] > 0.05) {
            boostedIndices.push(i);
          } else {
            normalIndices.push(i);
          }
        }

        // Draw normal dots (batched)
        if (normalIndices.length > 0) {
          ctx!.fillStyle = `rgba(28, 25, 23, ${baseAlpha})`;
          ctx!.beginPath();
          for (const i of normalIndices) {
            const d = dots[i];
            const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
            const r = Math.min(
              DOT_RADIUS * depthRadiusScale + speed * 0.3,
              DOT_RADIUS_MAX * depthRadiusScale
            );
            ctx!.moveTo(d.x + r, d.y);
            ctx!.arc(d.x, d.y, r, 0, TAU);
          }
          ctx!.fill();
        }

        // Draw boosted dots individually (they need different sizes/alphas)
        for (const i of boostedIndices) {
          const d = dots[i];
          const boost = dotBoost[i];
          const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
          const r = Math.min(
            DOT_RADIUS * depthRadiusScale * (1 + boost * (RIPPLE_DOT_BOOST - 1)) + speed * 0.3,
            DOT_RADIUS_MAX * depthRadiusScale * (1 + boost)
          );
          const alpha = Math.min(baseAlpha + boost * 0.4, 1);
          ctx!.fillStyle = `rgba(28, 25, 23, ${alpha})`;
          ctx!.beginPath();
          ctx!.arc(d.x, d.y, r, 0, TAU);
          ctx!.fill();
        }
      }
    }

    function loop() {
      if (!paused) {
        update();
        draw();
      }
      rafId = requestAnimationFrame(loop);
    }

    // Event handlers
    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
    }

    function onPointerLeave() {
      mouseActive = false;
    }

    function onVisibilityChange() {
      paused = document.hidden;
    }

    // Resize observer with debounce
    let resizeTimer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initDots, 50);
    });

    // Initialize
    initDots();
    rafId = requestAnimationFrame(loop);

    // Listeners
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        maskImage:
          "linear-gradient(to bottom, black 60%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 60%, transparent 100%)",
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
