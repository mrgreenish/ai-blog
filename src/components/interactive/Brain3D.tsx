"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createNoise3D } from "@/lib/noise";
import { ASCIIBrain } from "./ASCIIBrain";

interface Brain3DProps {
  className?: string;
  /** Foreground content (the chapter list) that scrolls over the viz. */
  children?: ReactNode;
}

const COUNT_DESKTOP = 16000;
const COUNT_MOBILE = 8000;
const LINKS_DESKTOP = 320;
const LINKS_MOBILE = 190;
const LINK_SEGMENTS = 8;
const MOBILE_BREAKPOINT = 768;
const MAX_DPR = 2;

// Ink on paper — matches the site's stone palette (#1C1917)
const INK = [0.11, 0.098, 0.09] as const;

const CAMERA_Z_MIN = 2.8;
const CAMERA_Y = 0.05;
const CAMERA_FOV = (34 * Math.PI) / 180;
// Horizontal half-extent the camera must fit (forms span ~±0.95)
const FIT_HALF_WIDTH = 1.05;

// --- Scroll timeline ---------------------------------------------------
// Compressed into the window where the section is on screen:
// 0.00–0.24  particles assemble into the brain
// 0.24–0.40  brain thinking: synapses firing, scan sweep
// 0.40–0.58  brain morphs into the LLM forward-pass plate
// 0.58–1.00  forward pass runs: a compute wavefront climbs the layers
const ASSEMBLE_END = 0.24;
const SCAN_START = 0.26;
const SCAN_END = 0.4;
const MORPH_START = 0.4;
const MORPH_END = 0.58;
const SCROLL_SMOOTHING = 0.09;

// The hero viz sits at the very top of the page. Scroll progress is
// measured from the page top: HERO_BASE is the story position at scroll 0
// (an assembled, thinking brain), rising to 1 over HERO_STORY_VH viewport
// heights of scroll as it morphs into the forward-pass diagram.
const HERO_BASE = 0.3;
const HERO_STORY_VH = 0.75;

// The chapter list now has its own clean background, so the viz no longer
// dims for text underneath. A global transparency ceiling keeps it a quiet
// hero rather than a heavy graphic; the scroll-fade is disabled.
const BG_FADE_START = 0.35;
const BG_FADE_END = 0.7;
const BG_FADE_MIN = 1.0;
const GLOBAL_ALPHA = 0.5;
// Small lift so the model sits nicely below the title in the hero.
const MODEL_LIFT = 0.06;

// Rotation: the brain sweeps left→right; the plate settles nearly
// front-on (a figure you read) with a slight downward tilt.
const ROT_Y_FROM = -1.5;
const ROT_Y_TO = 0.8;
const ROT_X_FROM = 0.14;
const ROT_X_TO = 0.02;
const PLATE_ROT_X = 0.1;

// --- Forward-pass plate geometry (near-flat z, shares the ±0.95 box) ---
const FP_TOKENS = 12; // token columns
const FP_LAYERS = 8; // transformer layers
const FP_X0 = -0.8;
const FP_XSPAN = 1.6; // columns span x ∈ [-0.8, 0.8]
const FP_INPUT_Y = -0.6; // input embedding row
const FP_LAYER_Y0 = -0.42; // layer 1 row
const FP_LAYER_DY = 0.84 / (FP_LAYERS - 1); // → layer 8 at +0.42
// Softmax (next-token distribution) parked in the top-right corner,
// out of the centred reading column.
const SOFTMAX_X0 = 0.34;
const SOFTMAX_XSPAN = 0.54;
const SOFTMAX_Y0 = 0.42;
// One full forward-pass wavefront every ~9s.
const SWEEP_SPEED = 0.11;

const fpColX = (t: number) => FP_X0 + t * (FP_XSPAN / (FP_TOKENS - 1));
// level 0 = input row; levels 1..FP_LAYERS = layer rows
const fpRowY = (level: number) =>
  level === 0 ? FP_INPUT_Y : FP_LAYER_Y0 + (level - 1) * FP_LAYER_DY;

const POINT_VS = `
  attribute vec3 aPos;
  attribute vec3 aScatter;
  attribute vec3 aNrm;
  attribute float aFold;
  attribute vec3 aTarget;
  attribute vec3 aTargetNrm;
  attribute float aTargetFold;
  attribute float aMorphDelay;
  attribute float aRand;
  attribute float aFire;

  uniform mat4 uProj;
  uniform mat4 uMV;
  uniform mat3 uNrmMat;
  uniform float uCamZ;
  uniform float uTime;
  uniform float uProgress;
  uniform float uMorph;
  uniform float uScan;
  uniform float uWave;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uMotion;
  uniform float uOpacity;

  varying float vAlpha;
  varying float vBoost;

  void main() {
    // Staggered assembly: each particle starts at its own offset
    float t = clamp(uProgress * 1.3 - aRand * 0.3, 0.0, 1.0);
    float ease = t * t * (3.0 - 2.0 * t);

    // Staggered morph keyed to target height, so the plate "prints"
    // bottom-up (input row first, softmax spike last) — a forward pass.
    float mt = clamp(uMorph * 1.55 - aMorphDelay * 0.55, 0.0, 1.0);
    float mEase = mt * mt * (3.0 - 2.0 * mt);

    vec3 formPos = mix(aPos, aTarget, mEase);
    vec3 formNrm = normalize(mix(aNrm, aTargetNrm, mEase));
    float formFold = mix(aFold, aTargetFold, mEase);

    vec3 pos = mix(aScatter, formPos, ease);

    // Curved transit paths: arcs during assembly and during the morph
    float arcA = sin(ease * 3.14159) * (aRand - 0.5) * 0.3;
    pos += vec3(formNrm.y, formNrm.z, formNrm.x) * arcA;
    float arcM = sin(mEase * 3.14159) * (aRand - 0.5) * 0.28;
    pos += vec3(formNrm.z, formNrm.x, formNrm.y) * arcM;

    // Idle shimmer along the surface normal — damped on the plate, which
    // should feel typeset rather than organic
    pos += formNrm * sin(uTime * 1.3 + aRand * 6.2831) * 0.008 * uMotion * (1.0 - mEase * 0.75);

    vec4 mv = uMV * vec4(pos, 1.0);

    // Directional shading — rotates with the model, sells the volume
    vec3 n = normalize(uNrmMat * formNrm);
    float light = clamp(dot(n, normalize(vec3(0.45, 0.8, 0.55))), 0.0, 1.0);
    // The flat plate reads better evenly lit than strongly shaded
    light = mix(light, 0.72, mEase);

    // Brain scan plane (MRI slice) — only meaningful before the morph
    float scanD = abs(formPos.z - uScan);
    float scan = smoothstep(0.22, 0.0, scanD) * ease * (1.0 - mEase);

    // Activation: neurons firing in the brain; on the plate, cells light
    // up as the compute wavefront climbs the layer stack.
    float fireBrain = 0.0;
    if (aFire > 0.001) {
      fireBrain = pow(0.5 + 0.5 * sin(uTime * 1.4 + aFire * 6.2831), 24.0);
    }
    float waveY = clamp((formPos.y + 0.66) / 1.4, 0.0, 1.0);
    float waveHit = smoothstep(0.1, 0.0, abs(waveY - uWave));
    float activation =
      max(fireBrain * (1.0 - mEase), waveHit * mEase) * uMotion * ease;

    float foldTint = 0.45 + 0.55 * formFold;
    // Depth cues relative to the camera distance so they hold at any
    // aspect-driven camera position
    float dist = -mv.z;
    float dRel = dist - uCamZ;
    float depthFade = 1.0 - smoothstep(-0.7, 1.6, dRel);
    depthFade *= smoothstep(0.5, 1.2, dist);

    vAlpha = (0.25 + 0.75 * light) * foldTint * depthFade;
    vAlpha *= mix(0.25, 1.0, ease);
    vAlpha *= uOpacity;
    vBoost = clamp(scan * 0.5 + activation * 0.78, 0.0, 0.78) * uOpacity;

    float size = uSize * (0.72 + 0.5 * formFold) * (0.85 + 0.3 * light);
    size *= 1.0 + scan * 1.1 + activation * 2.0;
    size *= mix(0.6, 1.0, ease);
    gl_PointSize = clamp(size * uPixelRatio * ((uCamZ + 0.2) / max(dist, 0.4)), 0.0, 14.0 * uPixelRatio);
    gl_Position = uProj * mv;
  }
`;

const POINT_FS = `
  precision mediump float;

  uniform vec3 uInk;

  varying float vAlpha;
  varying float vBoost;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float disc = smoothstep(0.5, 0.32, length(c));
    float a = (vAlpha + vBoost) * disc;
    if (a < 0.004) discard;
    gl_FragColor = vec4(uInk, a);
  }
`;

// Synapse fibers → causal attention arcs, each carrying a traveling
// pulse. In the brain the pulse free-runs along each fiber; on the plate
// the pulse fires band by band as the forward-pass wavefront crosses it.
const LINE_VS = `
  attribute vec3 aBrainPos;
  attribute vec3 aTargetPos;
  attribute float aT;
  attribute float aPhase;
  attribute float aBand;

  uniform mat4 uProj;
  uniform mat4 uMV;
  uniform float uCamZ;
  uniform float uTime;
  uniform float uProgress;
  uniform float uMorph;
  uniform float uWave;
  uniform float uMotion;
  uniform float uOpacity;

  varying float vAlpha;

  void main() {
    float mt = clamp(uMorph * 1.4 - aPhase * 0.4, 0.0, 1.0);
    float mEase = mt * mt * (3.0 - 2.0 * mt);
    vec3 pos = mix(aBrainPos, aTargetPos, mEase);

    vec4 mv = uMV * vec4(pos, 1.0);

    // Fibers appear once the brain has finished assembling
    float appear = smoothstep(0.75, 1.0, uProgress);

    // Brain phase: pulse free-runs along the fiber.
    float ppB = fract(uTime * 0.16 + aPhase * 7.0);
    float pulseBrain = smoothstep(0.15, 0.0, abs(aT - ppB));

    // Plate phase: as the wavefront crosses this band, one pulse sweeps
    // source→query (aT 0→1). Bands fire bottom→top = a forward pass.
    float prog = (uWave - aBand) / 0.16 + aPhase * 0.04;
    float pulseLLM = (prog >= 0.0 && prog <= 1.0)
      ? smoothstep(0.22, 0.0, abs(aT - prog))
      : 0.0;

    float pulse = mix(pulseBrain, pulseLLM, mEase) * uMotion;
    float base = mix(0.075, 0.05, mEase);

    float dist = -mv.z;
    float depthFade = 1.0 - smoothstep(-0.7, 1.6, dist - uCamZ);

    vAlpha = (base + pulse * 0.6) * appear * depthFade * uOpacity;
    gl_Position = uProj * mv;
  }
`;

const LINE_FS = `
  precision mediump float;

  uniform vec3 uInk;

  varying float vAlpha;

  void main() {
    if (vAlpha < 0.004) discard;
    gl_FragColor = vec4(uInk, vAlpha);
  }
`;

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

function clamp01(x: number): number {
  return Math.min(Math.max(x, 0), 1);
}

function perspectiveMatrix(
  fovY: number,
  aspect: number,
  near: number,
  far: number
): Float32Array {
  const f = 1 / Math.tan(fovY / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) / (near - far);
  m[11] = -1;
  m[14] = (2 * far * near) / (near - far);
  return m;
}

/**
 * Model-view for a fixed camera at (0, CAMERA_Y, camZ) and a model
 * rotated Rx(rx)·Ry(ry) then lifted by ty. Pure rotation, so the same
 * 3x3 doubles as the normal matrix.
 */
function modelViewMatrix(
  rx: number,
  ry: number,
  ty: number,
  camZ: number,
  outMV: Float32Array,
  outNrm: Float32Array
) {
  const ca = Math.cos(rx);
  const sa = Math.sin(rx);
  const cb = Math.cos(ry);
  const sb = Math.sin(ry);

  // Column-major Rx·Ry
  outMV[0] = cb;
  outMV[1] = sa * sb;
  outMV[2] = -ca * sb;
  outMV[3] = 0;
  outMV[4] = 0;
  outMV[5] = ca;
  outMV[6] = sa;
  outMV[7] = 0;
  outMV[8] = sb;
  outMV[9] = -sa * cb;
  outMV[10] = ca * cb;
  outMV[11] = 0;
  outMV[12] = 0;
  outMV[13] = ty - CAMERA_Y;
  outMV[14] = -camZ;
  outMV[15] = 1;

  outNrm[0] = cb;
  outNrm[1] = sa * sb;
  outNrm[2] = -ca * sb;
  outNrm[3] = 0;
  outNrm[4] = ca;
  outNrm[5] = sa;
  outNrm[6] = sb;
  outNrm[7] = -sa * cb;
  outNrm[8] = ca * cb;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface BrainAttributes {
  positions: Float32Array;
  scatters: Float32Array;
  normals: Float32Array;
  folds: Float32Array;
  rands: Float32Array;
  fires: Float32Array;
  count: number;
}

/**
 * Procedurally samples a stylized brain as a point cloud: two cerebral
 * hemispheres with dual-direction domain-warped cortical folds, temporal
 * lobe bulges, a longitudinal fissure, a finely-ridged cerebellum, and
 * a brainstem.
 */
function buildBrain(count: number): BrainAttributes {
  const noise = createNoise3D(1913);
  const fbm = (x: number, y: number, z: number) =>
    noise(x, y, z) + 0.5 * noise(x * 2.1, y * 2.1, z * 2.1);

  const positions = new Float32Array(count * 3);
  const scatters = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const folds = new Float32Array(count);
  const rands = new Float32Array(count);
  const fires = new Float32Array(count);

  const p = { x: 0, y: 0, z: 0 };
  const n = { x: 0, y: 0, z: 0 };
  let fold = 0;

  const randomDir = () => {
    const theta = Math.random() * Math.PI * 2;
    const u = Math.random() * 2 - 1;
    const s = Math.sqrt(1 - u * u);
    return { x: Math.cos(theta) * s, y: u, z: Math.sin(theta) * s };
  };

  // Cerebrum hemisphere ellipsoid: radii and midline offset
  const RX = 0.56;
  const RY = 0.5;
  const RZ = 0.84;
  const HEMI_OFFSET = 0.29;

  const sampleCerebrum = (): boolean => {
    const s = Math.random() < 0.5 ? -1 : 1;
    const d = randomDir();

    // Surface point with a thin inward shell for volume
    const shell = 1 - Math.random() * Math.random() * 0.1;
    p.x = d.x * RX * shell;
    p.y = d.y * RY * shell;
    p.z = d.z * RZ * shell;

    // Ellipsoid normal
    n.x = d.x / RX;
    n.y = d.y / RY;
    n.z = d.z / RZ;
    const nl = Math.hypot(n.x, n.y, n.z);
    n.x /= nl;
    n.y /= nl;
    n.z /= nl;

    // Cortical folds: two warped ridged stripe systems layered for a
    // denser, more anatomical gyri/sulci network
    const warp = fbm(p.x * 1.35 + s * 3.7, p.y * 1.35, p.z * 1.35);
    const s1 = Math.sin(p.y * 7.5 + p.z * 5.0 + warp * 3.4);
    const s2 = Math.sin(p.x * 6.5 - p.y * 4.2 + p.z * 2.6 + warp * 2.6);
    fold =
      Math.pow(Math.abs(s1), 0.6) * 0.62 + Math.pow(Math.abs(s2), 0.6) * 0.38;
    const lump = fbm(p.x * 2.2 + 9.1, p.y * 2.2, p.z * 2.2) * 0.035;
    const disp = (fold - 0.5) * 0.085 + lump;
    p.x += n.x * disp;
    p.y += n.y * disp;
    p.z += n.z * disp;

    // Temporal lobe bulge: widen the lower sides
    const temporal =
      Math.exp(-((p.y + 0.18) * (p.y + 0.18) * 14 + (p.z - 0.12) * (p.z - 0.12) * 2.2));
    p.x += s * 0.07 * temporal;

    // Flatten the underside
    if (p.y < -0.18) {
      p.y = -0.18 + (p.y + 0.18) * 0.5;
    }
    // Frontal taper
    if (p.z > 0.5) {
      p.y *= 1 - (p.z - 0.5) * 0.18;
    }

    p.x += s * HEMI_OFFSET;

    // Longitudinal fissure: flat medial walls with a visible gap on top
    const gap = 0.05 * smoothstep(-0.2, 0.1, p.y);
    if (s * p.x < gap) {
      if (s * p.x < -0.12) return false; // too deep past midline
      p.x = s * (gap + Math.random() * 0.015);
    }
    return true;
  };

  // Cerebellum: small ellipsoid at the lower back with fine parallel folia
  const CB = { x: 0, y: -0.46, z: -0.62 };
  const CB_R = { x: 0.4, y: 0.24, z: 0.3 };

  const sampleCerebellum = (): boolean => {
    const d = randomDir();
    const shell = 1 - Math.random() * Math.random() * 0.12;
    p.x = d.x * CB_R.x * shell;
    p.y = d.y * CB_R.y * shell;
    p.z = d.z * CB_R.z * shell;

    n.x = d.x / CB_R.x;
    n.y = d.y / CB_R.y;
    n.z = d.z / CB_R.z;
    const nl = Math.hypot(n.x, n.y, n.z);
    n.x /= nl;
    n.y /= nl;
    n.z /= nl;

    const warp = fbm(p.x * 3.0, p.y * 3.0 + 5.5, p.z * 3.0);
    fold = Math.pow(Math.abs(Math.sin(p.y * 42 + warp * 2.4)), 0.55);
    const disp = (fold - 0.5) * 0.022;
    p.x += n.x * disp;
    p.y += n.y * disp;
    p.z += n.z * disp;

    p.x += CB.x;
    p.y += CB.y;
    p.z += CB.z;

    // Reject points tucked inside the cerebrum
    const hx = (Math.abs(p.x) - HEMI_OFFSET) / RX;
    const hy = (p.y - 0.02) / RY;
    const hz = p.z / RZ;
    return hx * hx + hy * hy + hz * hz > 0.86;
  };

  // Brainstem: tapered tube angling down and back
  const sampleStem = () => {
    const u = Math.random();
    const ay = -0.3 - u * 0.5;
    const az = -0.16 - u * 0.3;
    const r = 0.13 - u * 0.045;
    const theta = Math.random() * Math.PI * 2;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    p.x = cos * r;
    p.y = ay + sin * r * 0.45;
    p.z = az + sin * r * 0.9;
    n.x = cos;
    n.y = sin * 0.45;
    n.z = sin * 0.9;
    fold = 0.4 + 0.3 * Math.abs(Math.sin(u * 20));
  };

  let i = 0;
  let guard = 0;
  while (i < count && guard < count * 30) {
    guard++;
    const pick = Math.random();
    let ok = true;
    if (pick < 0.8) ok = sampleCerebrum();
    else if (pick < 0.94) ok = sampleCerebellum();
    else sampleStem();
    if (!ok) continue;

    const i3 = i * 3;
    positions[i3] = p.x;
    positions[i3 + 1] = p.y + 0.1;
    positions[i3 + 2] = p.z;

    normals[i3] = n.x;
    normals[i3 + 1] = n.y;
    normals[i3 + 2] = n.z;

    // Scattered start position: a loose shell around the brain,
    // compressed in z so nothing drifts near the camera plane
    const sd = randomDir();
    const sr = 1.3 + Math.random() * 0.9;
    scatters[i3] = sd.x * sr;
    scatters[i3 + 1] = sd.y * sr * 0.7;
    scatters[i3 + 2] = sd.z * sr * 0.5;

    folds[i] = fold;
    rands[i] = Math.random();
    // ~12% of particles are firing sites
    fires[i] = Math.random() < 0.12 ? 0.02 + Math.random() * 0.98 : 0;
    i++;
  }

  return { positions, scatters, normals, folds, rands, fires, count: i };
}

function sampleQuadratic(a: Vec3, c: Vec3, b: Vec3, segs: number): Vec3[] {
  const pts: Vec3[] = [];
  for (let s = 0; s <= segs; s++) {
    const t = s / segs;
    const u = 1 - t;
    pts.push({
      x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
      z: u * u * a.z + 2 * u * t * c.z + t * t * b.z,
    });
  }
  return pts;
}

interface AttentionArcs {
  arcs: Vec3[][];
  bands: number[]; // normalized layer band (0..1) each arc fires at
}

/**
 * Causal attention arcs for the forward-pass plate. Each arc steps up
 * exactly one layer, from a source token (col i) to a query token
 * (col j) with i ≤ j — so every arc runs leftward/up, the visual
 * fingerprint of a decoder-only LM. The top band adds an unembedding
 * fan from the last column into the softmax bars.
 */
function buildAttentionArcs(m: number): AttentionArcs {
  const arcs: Vec3[][] = [];
  const bands: number[] = [];

  const unembed = Math.min(22, Math.max(8, Math.floor(m * 0.06)));
  const attn = m - unembed;

  for (let j = 0; j < attn; j++) {
    const band = 1 + (j % FP_LAYERS); // 1..FP_LAYERS
    const q = 1 + Math.floor(Math.random() * (FP_TOKENS - 1)); // query col
    let src: number;
    const r = Math.random();
    if (r < 0.55) src = Math.max(0, q - Math.floor(Math.random() * 3)); // local
    else if (r < 0.75) src = 0; // attention sink (first token)
    else if (r < 0.9) src = Math.max(0, q - (2 + Math.floor(Math.random() * 4))); // induction
    else src = Math.floor(Math.random() * (q + 1)); // long range

    const sx = fpColX(src);
    const qx = fpColX(q);
    const sy = fpRowY(band - 1);
    const qy = fpRowY(band);
    const apex = 0.035 + 0.07 * (Math.sqrt(Math.abs(q - src)) / Math.sqrt(FP_TOKENS));
    const ctrl: Vec3 = {
      x: (sx + qx) / 2,
      y: (sy + qy) / 2 + apex + 0.015,
      z: 0.02 * (Math.random() - 0.5),
    };
    arcs.push(
      sampleQuadratic({ x: sx, y: sy, z: 0 }, ctrl, { x: qx, y: qy, z: 0 }, LINK_SEGMENTS)
    );
    bands.push((band - 0.5) / FP_LAYERS);
  }

  // Unembedding fan: only the last column's top feeds the output head.
  const topX = fpColX(FP_TOKENS - 1);
  const topY = fpRowY(FP_LAYERS);
  for (let k = 0; k < unembed; k++) {
    const barX = SOFTMAX_X0 + Math.random() * SOFTMAX_XSPAN;
    const barY = SOFTMAX_Y0 + Math.random() * 0.16;
    const ctrl: Vec3 = {
      x: (topX + barX) / 2 + 0.05,
      y: (topY + barY) / 2 + 0.06,
      z: 0,
    };
    arcs.push(
      sampleQuadratic({ x: topX, y: topY, z: 0 }, ctrl, { x: barX, y: barY, z: 0 }, LINK_SEGMENTS)
    );
    bands.push(0.985); // fires at the very end of the sweep = the "resolve"
  }

  return { arcs, bands };
}

interface LLMAttributes {
  positions: Float32Array;
  normals: Float32Array;
  folds: Float32Array;
  morphDelays: Float32Array;
}

/**
 * The forward-pass plate as a point cloud, sharing the brain's particle
 * count: a row of input embedding vectors, a 12×8 lattice of residual-
 * stream node cells (token hidden states per layer), sparse vertical
 * risers between layers, a next-token softmax bar chart in the top-right
 * corner, and a left-margin layer axis / rules / predicted-token glyph.
 */
function buildForwardPass(count: number): LLMAttributes {
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const folds = new Float32Array(count);
  const morphDelays = new Float32Array(count);

  const jit = () => Math.random() - 0.5;
  let i = 0;
  const put = (
    x: number,
    y: number,
    z: number,
    nx: number,
    ny: number,
    nz: number,
    fold: number
  ) => {
    const i3 = i * 3;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    const nl = Math.hypot(nx, ny, nz) || 1;
    normals[i3] = nx / nl;
    normals[i3 + 1] = ny / nl;
    normals[i3 + 2] = nz / nl;
    folds[i] = fold;
    i++;
  };

  const nA = Math.floor(count * 0.11); // input embedding vectors
  const nB = Math.floor(count * 0.62); // layer node cells
  const nC = Math.floor(count * 0.12); // residual risers
  const nD = Math.floor(count * 0.1); // softmax bars

  // (A) Input embedding vectors: a tall micro-grid per token column.
  for (let a = 0; a < nA; a++) {
    const col = a % FP_TOKENS;
    const k = Math.floor(a / FP_TOKENS);
    const gx = k % 8;
    const gy = Math.floor(k / 8);
    put(
      fpColX(col) + (gx - 3.5) * 0.006 + jit() * 0.004,
      FP_INPUT_Y - 0.07 + gy * 0.008 + jit() * 0.004,
      jit() * 0.02,
      0.1 * jit(),
      0.1 * jit(),
      1,
      0.52
    );
  }

  // (B) Layer node cells: an 8×13 micro-lattice per (token, layer).
  const CELLS = FP_TOKENS * FP_LAYERS;
  for (let b = 0; b < nB; b++) {
    const cell = b % CELLS;
    const k = Math.floor(b / CELLS);
    const col = cell % FP_TOKENS;
    const layer = Math.floor(cell / FP_TOKENS); // 0..FP_LAYERS-1
    const gx = k % 8;
    const gy = Math.floor(k / 8);
    const edge = gy === 0 || gy >= 12; // layer-boundary junctions read darker
    put(
      fpColX(col) + (gx - 3.5) * 0.006 + jit() * 0.003,
      fpRowY(layer + 1) + (gy - 6) * 0.0055 + jit() * 0.003,
      jit() * 0.015,
      0.12 * jit(),
      0.12 * jit(),
      1,
      edge ? 0.76 : 0.36
    );
  }

  // (C) Residual risers: sparse vertical dotted streams between rows.
  const GAPS = FP_LAYERS; // input→L1, L1→L2, … L7→L8
  for (let c = 0; c < nC; c++) {
    const seg = c % (FP_TOKENS * GAPS);
    const col = seg % FP_TOKENS;
    const gap = Math.floor(seg / FP_TOKENS); // 0..GAPS-1
    const y0 = fpRowY(gap);
    const y1 = fpRowY(gap + 1);
    put(
      fpColX(col) + jit() * 0.006,
      y0 + (y1 - y0) * Math.random(),
      jit() * 0.01,
      0.1 * jit(),
      0.1 * jit(),
      1,
      0.28
    );
  }

  // (D) Output softmax: a peaky next-token distribution, top-right.
  const BARS = 24;
  const argmax = 4;
  const heights: number[] = [];
  for (let b = 0; b < BARS; b++) {
    const dist = Math.abs(b - argmax);
    heights.push(0.02 + (b === argmax ? 0.9 : Math.pow(0.55, dist) * 0.85));
  }
  const hsum = heights.reduce((s, v) => s + v, 0);
  for (let d = 0; d < nD; d++) {
    let rr = Math.random() * hsum;
    let bar = 0;
    while (bar < BARS - 1 && rr > heights[bar]) {
      rr -= heights[bar];
      bar++;
    }
    const h = heights[bar];
    put(
      SOFTMAX_X0 + bar * (SOFTMAX_XSPAN / (BARS - 1)) + jit() * 0.004,
      SOFTMAX_Y0 + Math.random() * (0.03 + h * 0.17),
      jit() * 0.01,
      0,
      0,
      1,
      bar === argmax ? 0.95 : 0.6
    );
  }

  // (E) Remainder: left-margin layer axis, dotted layer rules, and the
  // predicted-token glyph beside the softmax.
  const AX_X = FP_X0 - 0.08;
  while (i < count) {
    const r = Math.random();
    if (r < 0.4) {
      const level = 1 + Math.floor(Math.random() * FP_LAYERS);
      put(AX_X + jit() * 0.012, fpRowY(level) + jit() * 0.012, 0, 0, 0, 1, 0.7);
    } else if (r < 0.72) {
      const level = Math.floor(Math.random() * (FP_LAYERS + 1)); // 0..FP_LAYERS
      put(
        FP_X0 + Math.random() * (0.15 - FP_X0),
        fpRowY(level) + jit() * 0.004,
        0,
        0,
        0,
        1,
        0.48
      );
    } else {
      put(0.2 + jit() * 0.05, 0.63 + jit() * 0.05, jit() * 0.01, 0, 0, 1, 0.85);
    }
  }

  // Morph delay keyed to final height → the plate prints bottom-up.
  for (let p = 0; p < count; p++) {
    morphDelays[p] = clamp01((positions[p * 3 + 1] + 0.7) / 1.55);
  }

  return { positions, normals, folds, morphDelays };
}

interface LinkAttributes {
  brainPos: Float32Array;
  targetPos: Float32Array;
  ts: Float32Array;
  phases: Float32Array;
  bands: Float32Array;
  count: number;
}

/**
 * Synapse fibers: curved connections between cortical crest points, each
 * paired 1:1 with an attention arc it morphs into. Emitted as gl.LINES
 * vertex pairs.
 */
function buildLinks(brain: BrainAttributes, attn: AttentionArcs): LinkAttributes {
  const m = attn.arcs.length;
  const vertsPerLink = LINK_SEGMENTS * 2;
  const total = m * vertsPerLink;
  const brainPos = new Float32Array(total * 3);
  const targetPos = new Float32Array(total * 3);
  const ts = new Float32Array(total);
  const phases = new Float32Array(total);
  const bands = new Float32Array(total);

  const get = (idx: number): Vec3 => ({
    x: brain.positions[idx * 3],
    y: brain.positions[idx * 3 + 1],
    z: brain.positions[idx * 3 + 2],
  });
  const getN = (idx: number): Vec3 => ({
    x: brain.normals[idx * 3],
    y: brain.normals[idx * 3 + 1],
    z: brain.normals[idx * 3 + 2],
  });

  let v = 0;
  for (let j = 0; j < m; j++) {
    // Endpoints: prefer gyri crest particles a medium distance apart
    let ia = -1;
    let ib = -1;
    for (let tries = 0; tries < 60; tries++) {
      const c1 = Math.floor(Math.random() * brain.count);
      const c2 = Math.floor(Math.random() * brain.count);
      if (brain.folds[c1] < 0.45 || brain.folds[c2] < 0.45) continue;
      const a = get(c1);
      const b = get(c2);
      const d = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
      if (d > 0.35 && d < 0.95) {
        ia = c1;
        ib = c2;
        break;
      }
    }
    if (ia < 0) {
      ia = Math.floor(Math.random() * brain.count);
      ib = Math.floor(Math.random() * brain.count);
    }

    const A = get(ia);
    const B = get(ib);
    const nA = getN(ia);
    const nB = getN(ib);
    // Quadratic bezier bowed outward along the average surface normal
    const C = {
      x: (A.x + B.x) / 2 + (nA.x + nB.x) * 0.12 + (Math.random() - 0.5) * 0.06,
      y: (A.y + B.y) / 2 + (nA.y + nB.y) * 0.12 + (Math.random() - 0.5) * 0.06,
      z: (A.z + B.z) / 2 + (nA.z + nB.z) * 0.12 + (Math.random() - 0.5) * 0.06,
    };
    const bez = (t: number): Vec3 => {
      const u = 1 - t;
      return {
        x: u * u * A.x + 2 * u * t * C.x + t * t * B.x,
        y: u * u * A.y + 2 * u * t * C.y + t * t * B.y,
        z: u * u * A.z + 2 * u * t * C.z + t * t * B.z,
      };
    };

    const phase = Math.random();
    const band = attn.bands[j];
    const arc = attn.arcs[j];
    for (let k = 0; k < LINK_SEGMENTS; k++) {
      for (let e = 0; e < 2; e++) {
        const s = k + e;
        const t = s / LINK_SEGMENTS;
        const bp = bez(t);
        const cp = arc[s];
        const v3 = v * 3;
        brainPos[v3] = bp.x;
        brainPos[v3 + 1] = bp.y;
        brainPos[v3 + 2] = bp.z;
        targetPos[v3] = cp.x;
        targetPos[v3 + 1] = cp.y;
        targetPos[v3 + 2] = cp.z;
        ts[v] = t;
        phases[v] = phase;
        bands[v] = band;
        v++;
      }
    }
  }

  return { brainPos, targetPos, ts, phases, bands, count: total };
}

function compileProgram(
  gl: WebGLRenderingContext,
  vertexSrc: string,
  fragmentSrc: string
): WebGLProgram | null {
  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, vertexSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

interface ProgramInfo {
  program: WebGLProgram;
  vao: WebGLVertexArrayObject | object;
  drawMode: number;
  drawCount: number;
  locs: Record<string, WebGLUniformLocation | null>;
}

interface GLState {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  points: ProgramInfo;
  lines: ProgramInfo;
  buffers: (WebGLBuffer | null)[];
  bindVAO: (vao: WebGLVertexArrayObject | object | null) => void;
  deleteVAO: (vao: WebGLVertexArrayObject | object) => void;
}

/**
 * Real-time 3D particle animation rendered with raw WebGL, monochrome
 * ink-on-paper to match the site's dot language. A scroll story in four
 * acts: particles assemble into a brain; synapses fire along curved
 * fibers while a scan plane sweeps; the brain morphs particle-by-particle
 * into a transformer forward-pass plate (token columns, causal attention
 * arcs, a next-token softmax); then a compute wavefront climbs the layer
 * stack — the same pulses, now running the mechanism.
 *
 * It doubles as a pinned background: the canvas is created lazily on the
 * section's first viewport intersection (creating a WebGL canvas below
 * the fold and scrolling it in wedges some embedded-browser compositors),
 * stays centred while the chapter list scrolls over it, and dims once
 * text overlaps so the body copy stays legible.
 *
 * Falls back to the static ASCII brain image when WebGL is unavailable.
 */
export function Brain3D({ className = "", children }: Brain3DProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    let disposed = false;
    let failed = false;
    let inView = false;
    let pageHidden = document.hidden;
    let running = false;
    let contextLost = false;
    let rafId = 0;
    let time = 0;
    let lastNow = 0;
    let smoothed = 0;
    let fadeIn = 0;
    let loadT = 0; // load-time assemble ramp (0→1), independent of scroll

    let state: GLState | null = null;
    let camZ = CAMERA_Z_MIN;
    const mvMat = new Float32Array(16);
    const nrmMat = new Float32Array(9);

    // --- Story progress, measured from the page top. At scroll 0 the
    // brain is assembled and thinking (HERO_BASE); it morphs into the
    // forward pass over the next HERO_STORY_VH viewport heights of scroll.
    // The canvas is pinned (sticky) in the hero, so the model stays
    // centred while the title and intro scroll over it.
    const sectionProgress = () => {
      const vh = window.innerHeight || 1;
      const s = Math.max(window.scrollY, 0);
      return Math.min(HERO_BASE + (1 - HERO_BASE) * (s / (HERO_STORY_VH * vh)), 1);
    };

    const resize = () => {
      if (!state) return;
      const { canvas, gl } = state;
      const width = pin.clientWidth;
      const height = pin.clientHeight;
      if (width === 0 || height === 0) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const aspect = width / height;
      // Fit by width on narrow aspects: back the camera off until the
      // forms' horizontal extent fits the frustum
      camZ = Math.max(
        CAMERA_Z_MIN,
        FIT_HALF_WIDTH / (Math.tan(CAMERA_FOV / 2) * aspect)
      );
      const proj = perspectiveMatrix(CAMERA_FOV, aspect, 0.1, 20);
      for (const info of [state.points, state.lines]) {
        gl.useProgram(info.program);
        gl.uniform1f(info.locs.uCamZ, camZ);
        gl.uniformMatrix4fv(info.locs.uProj, false, proj);
      }
    };

    /** Set pose + timeline uniforms and issue both draw calls. */
    const drawScene = (
      sp: number,
      wobble: number,
      opacity: number,
      load: number
    ) => {
      if (!state) return;
      const { gl } = state;

      const morph = clamp01((sp - MORPH_START) / (MORPH_END - MORPH_START));
      const mPose = morph * morph * (3 - 2 * morph);
      // Assemble is driven by the load ramp, not scroll, so the brain
      // flies together on page load rather than needing a scroll.
      const progress = load;

      // Dim once the chapters begin to overlap so dark body text stays
      // readable on top of the viz.
      const op =
        opacity *
        GLOBAL_ALPHA *
        (1 - smoothstep(BG_FADE_START, BG_FADE_END, sp) * (1 - BG_FADE_MIN));

      // Compute wavefront (only meaningful on the plate): cycles up the
      // layer stack, driving the forward-pass animation.
      const wave = (time * SWEEP_SPEED) % 1;

      // Pose: the brain's sweep eases into the plate's near-front view.
      const bry = ROT_Y_FROM + (ROT_Y_TO - ROT_Y_FROM) * sp + wobble;
      const brx = ROT_X_FROM + (ROT_X_TO - ROT_X_FROM) * sp;
      const plateRy = wobble * 0.5; // gentle sway, faces the viewer
      const rx = brx + (PLATE_ROT_X - brx) * mPose;
      const ry = bry + (plateRy - bry) * mPose;
      // Lift the model up the viewport, plus gentle parallax (it drifts
      // slower than the page).
      const ty = MODEL_LIFT + (sp - 0.5) * 0.22;
      modelViewMatrix(rx, ry, ty, camZ, mvMat, nrmMat);

      let scan = 3; // parked off-model
      if (sp > SCAN_START && sp < SCAN_END) {
        const st = (sp - SCAN_START) / (SCAN_END - SCAN_START);
        scan = 1.1 - st * 2.3;
      }

      gl.clear(gl.COLOR_BUFFER_BIT);

      const lines = state.lines;
      gl.useProgram(lines.program);
      gl.uniformMatrix4fv(lines.locs.uMV, false, mvMat);
      gl.uniform1f(lines.locs.uTime, time);
      gl.uniform1f(lines.locs.uProgress, progress);
      gl.uniform1f(lines.locs.uMorph, morph);
      gl.uniform1f(lines.locs.uWave, wave);
      gl.uniform1f(lines.locs.uOpacity, op);
      state.bindVAO(lines.vao);
      gl.drawArrays(lines.drawMode, 0, lines.drawCount);

      const points = state.points;
      gl.useProgram(points.program);
      gl.uniformMatrix4fv(points.locs.uMV, false, mvMat);
      gl.uniformMatrix3fv(points.locs.uNrmMat, false, nrmMat);
      gl.uniform1f(points.locs.uTime, time);
      gl.uniform1f(points.locs.uProgress, progress);
      gl.uniform1f(points.locs.uMorph, morph);
      gl.uniform1f(points.locs.uScan, scan);
      gl.uniform1f(points.locs.uWave, wave);
      gl.uniform1f(points.locs.uOpacity, op);
      state.bindVAO(points.vao);
      gl.drawArrays(points.drawMode, 0, points.drawCount);

      state.bindVAO(null);
    };

    const renderStatic = () => {
      if (!state) return;
      // Assembled brain thinking, 3/4 view, frozen pulses
      drawScene(HERO_BASE, 0, 1, 1);
    };

    const frame = (now: number) => {
      rafId = 0;
      if (disposed || !running || !state) return;

      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      time += dt;

      fadeIn = Math.min(fadeIn + dt * 1.4, 1);
      loadT = Math.min(loadT + dt / 1.6, 1);

      const target = sectionProgress();
      smoothed += (target - smoothed) * SCROLL_SMOOTHING;

      // Idle drift keeps it alive between scrolls
      drawScene(smoothed, Math.sin(time * 0.25) * 0.045, fadeIn, loadT);

      rafId = requestAnimationFrame(frame);
    };

    const syncRunning = () => {
      const shouldRun =
        inView && !pageHidden && !reducedMotion && !contextLost && !!state;
      if (shouldRun && !running) {
        running = true;
        lastNow = performance.now();
        rafId = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      syncRunning();
      setFallback(true);
    };

    /**
     * Create the canvas, context, and GPU resources, attach the canvas,
     * and synchronously present a first frame. Must be called while the
     * section is in the viewport.
     */
    const init = (): boolean => {
      const canvas = document.createElement("canvas");
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      const contextAttrs: WebGLContextAttributes = {
        alpha: true,
        antialias: true,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      };
      const gl = (canvas.getContext("webgl2", contextAttrs) ||
        canvas.getContext(
          "webgl",
          contextAttrs
        )) as WebGLRenderingContext | null;
      if (!gl) return false;

      // VAOs isolate the two draw calls' attribute state
      const gl2 = gl as WebGL2RenderingContext;
      const isGL2 = typeof gl2.createVertexArray === "function";
      const vaoExt = isGL2 ? null : gl.getExtension("OES_vertex_array_object");
      if (!isGL2 && !vaoExt) return false;
      const createVAO = () =>
        isGL2 ? gl2.createVertexArray() : vaoExt!.createVertexArrayOES();
      const bindVAO = (v: WebGLVertexArrayObject | object | null) => {
        if (isGL2) gl2.bindVertexArray(v as WebGLVertexArrayObject | null);
        else vaoExt!.bindVertexArrayOES(v as WebGLVertexArrayObject | null);
      };
      const deleteVAO = (v: WebGLVertexArrayObject | object) => {
        if (isGL2) gl2.deleteVertexArray(v as WebGLVertexArrayObject);
        else vaoExt!.deleteVertexArrayOES(v as WebGLVertexArrayObject);
      };

      const pointProgram = compileProgram(gl, POINT_VS, POINT_FS);
      const lineProgram = compileProgram(gl, LINE_VS, LINE_FS);
      if (!pointProgram || !lineProgram) return false;

      // --- Geometry
      const brain = buildBrain(isMobile ? COUNT_MOBILE : COUNT_DESKTOP);
      const attn = buildAttentionArcs(isMobile ? LINKS_MOBILE : LINKS_DESKTOP);
      const llm = buildForwardPass(brain.count);
      const links = buildLinks(brain, attn);

      const buffers: (WebGLBuffer | null)[] = [];
      const uploadAttribute = (
        program: WebGLProgram,
        name: string,
        data: Float32Array,
        size: number
      ) => {
        const loc = gl.getAttribLocation(program, name);
        if (loc < 0) return;
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        buffers.push(buf);
      };

      const uLocs = (
        program: WebGLProgram,
        names: string[]
      ): Record<string, WebGLUniformLocation | null> => {
        const out: Record<string, WebGLUniformLocation | null> = {};
        for (const name of names) out[name] = gl.getUniformLocation(program, name);
        return out;
      };

      // Points program + VAO
      const pointVAO = createVAO();
      if (!pointVAO) return false;
      bindVAO(pointVAO);
      uploadAttribute(pointProgram, "aPos", brain.positions, 3);
      uploadAttribute(pointProgram, "aScatter", brain.scatters, 3);
      uploadAttribute(pointProgram, "aNrm", brain.normals, 3);
      uploadAttribute(pointProgram, "aFold", brain.folds, 1);
      uploadAttribute(pointProgram, "aTarget", llm.positions, 3);
      uploadAttribute(pointProgram, "aTargetNrm", llm.normals, 3);
      uploadAttribute(pointProgram, "aTargetFold", llm.folds, 1);
      uploadAttribute(pointProgram, "aMorphDelay", llm.morphDelays, 1);
      uploadAttribute(pointProgram, "aRand", brain.rands, 1);
      uploadAttribute(pointProgram, "aFire", brain.fires, 1);
      bindVAO(null);

      // Lines program + VAO
      const lineVAO = createVAO();
      if (!lineVAO) return false;
      bindVAO(lineVAO);
      uploadAttribute(lineProgram, "aBrainPos", links.brainPos, 3);
      uploadAttribute(lineProgram, "aTargetPos", links.targetPos, 3);
      uploadAttribute(lineProgram, "aT", links.ts, 1);
      uploadAttribute(lineProgram, "aPhase", links.phases, 1);
      uploadAttribute(lineProgram, "aBand", links.bands, 1);
      bindVAO(null);

      const points: ProgramInfo = {
        program: pointProgram,
        vao: pointVAO,
        drawMode: gl.POINTS,
        drawCount: brain.count,
        locs: uLocs(pointProgram, [
          "uProj",
          "uMV",
          "uNrmMat",
          "uCamZ",
          "uTime",
          "uProgress",
          "uMorph",
          "uScan",
          "uWave",
          "uPixelRatio",
          "uSize",
          "uMotion",
          "uOpacity",
          "uInk",
        ]),
      };
      const lines: ProgramInfo = {
        program: lineProgram,
        vao: lineVAO,
        drawMode: gl.LINES,
        drawCount: links.count,
        locs: uLocs(lineProgram, [
          "uProj",
          "uMV",
          "uCamZ",
          "uTime",
          "uProgress",
          "uMorph",
          "uWave",
          "uMotion",
          "uOpacity",
          "uInk",
        ]),
      };

      // Static uniforms
      gl.useProgram(pointProgram);
      gl.uniform1f(points.locs.uPixelRatio, dpr);
      gl.uniform1f(points.locs.uSize, isMobile ? 3.0 : 3.4);
      gl.uniform1f(points.locs.uMotion, reducedMotion ? 0 : 1);
      gl.uniform3f(points.locs.uInk, INK[0], INK[1], INK[2]);
      gl.useProgram(lineProgram);
      gl.uniform1f(lines.locs.uMotion, reducedMotion ? 0 : 1);
      gl.uniform3f(lines.locs.uInk, INK[0], INK[1], INK[2]);

      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      state = {
        canvas,
        gl,
        points,
        lines,
        buffers,
        bindVAO,
        deleteVAO,
      };

      canvas.addEventListener("webglcontextlost", onContextLost);
      resize();
      pin.appendChild(canvas);

      // Present a frame immediately so the compositor never holds an
      // empty accelerated layer.
      smoothed = sectionProgress();
      drawScene(smoothed, 0, 0, 0);
      return true;
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !state && !failed && !disposed) {
        if (init()) {
          if (reducedMotion) renderStatic();
        } else {
          failed = true;
          setFallback(true);
          return;
        }
      }
      syncRunning();
    });
    io.observe(track);

    const onVisibility = () => {
      pageHidden = document.hidden;
      syncRunning();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reducedMotion && !contextLost) renderStatic();
      }, 60);
    });
    ro.observe(pin);

    return () => {
      disposed = true;
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (state) {
        const { canvas, gl, points, lines, buffers, deleteVAO } = state;
        canvas.removeEventListener("webglcontextlost", onContextLost);
        for (const buf of buffers) {
          if (buf) gl.deleteBuffer(buf);
        }
        deleteVAO(points.vao);
        deleteVAO(lines.vao);
        gl.deleteProgram(points.program);
        gl.deleteProgram(lines.program);
        const loseCtx = gl.getExtension("WEBGL_lose_context");
        if (loseCtx) loseCtx.loseContext();
        canvas.remove();
        state = null;
      }
    };
  }, []);

  if (fallback) {
    return (
      <div className={`brain3d-track ${className}`}>
        <div className="brain3d-fallback" aria-hidden="true">
          <ASCIIBrain />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div ref={trackRef} className={`brain3d-track ${className}`}>
      {/* Pinned canvas host — the model stays centred while content scrolls over it */}
      <div ref={pinRef} className="brain3d-stage" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
