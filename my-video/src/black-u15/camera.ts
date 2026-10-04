// Caméra 3D minimale : le terrain, les anneaux, les particules et les joueurs
// (en panneaux face caméra) sont projetés avec la même caméra, donc tout reste cohérent.
// Repère : x à droite, y vers le haut, z vers le fond ; terrain centré en 0 sur le plan y = 0.
import { HEIGHT, WIDTH } from "./timeline";

export type V3 = [number, number, number];
export type Cam = {
  pos: V3;
  target: V3;
  focal: number; // en pixels
  roll?: number; // radians
};

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

export const NEAR = 0.12;

// Focale pour un champ vertical donné (degrés)
export const focalFor = (fovDeg: number) => HEIGHT / 2 / Math.tan((fovDeg * Math.PI) / 360);

export const makeView = (cam: Cam) => {
  const f = norm(sub(cam.target, cam.pos));
  let r = norm(cross([0, 1, 0], f));
  let u = cross(f, r);
  if (cam.roll) {
    const c = Math.cos(cam.roll);
    const s = Math.sin(cam.roll);
    const r2: V3 = [r[0] * c + u[0] * s, r[1] * c + u[1] * s, r[2] * c + u[2] * s];
    u = [u[0] * c - r[0] * s, u[1] * c - r[1] * s, u[2] * c - r[2] * s];
    r = r2;
  }
  const toCam = (p: V3): V3 => {
    const d = sub(p, cam.pos);
    return [dot(d, r), dot(d, u), dot(d, f)];
  };
  const toScreen = (c: V3) => ({
    x: WIDTH / 2 + (cam.focal * c[0]) / c[2],
    y: HEIGHT / 2 - (cam.focal * c[1]) / c[2],
    depth: c[2],
    scale: cam.focal / c[2], // pixels par mètre à cette profondeur
  });
  const project = (p: V3) => {
    const c = toCam(p);
    return c[2] > NEAR ? toScreen(c) : null;
  };
  // Polyligne 3D -> chemin SVG, découpée au plan proche
  const path = (pts: V3[], closed = false) => {
    const list = closed ? [...pts, pts[0]] : pts;
    let d = "";
    let pen = false;
    let prev: V3 | null = null;
    for (const p of list) {
      const c = toCam(p);
      if (prev) {
        const inPrev = prev[2] > NEAR;
        const inCur = c[2] > NEAR;
        if (inPrev !== inCur) {
          const k = (NEAR - prev[2]) / (c[2] - prev[2]);
          const m: V3 = [prev[0] + (c[0] - prev[0]) * k, prev[1] + (c[1] - prev[1]) * k, NEAR + 1e-4];
          const s = toScreen(m);
          d += `${pen ? "L" : "M"}${s.x.toFixed(1)} ${s.y.toFixed(1)}`;
          pen = inCur;
        }
      }
      if (c[2] > NEAR) {
        const s = toScreen(c);
        d += `${pen ? "L" : "M"}${s.x.toFixed(1)} ${s.y.toFixed(1)}`;
        pen = true;
      } else {
        pen = false;
      }
      prev = c;
    }
    return d;
  };
  return { project, path, toCam };
};

export type View = ReturnType<typeof makeView>;

// Caméra en orbite autour d'un point au sol
export const orbit = (center: V3, dist: number, yawDeg: number, camY: number, targetY: number, focal: number, roll = 0): Cam => {
  const a = (yawDeg * Math.PI) / 180;
  return {
    pos: [center[0] + dist * Math.sin(a), camY, center[2] - dist * Math.cos(a)],
    target: [center[0], targetY, center[2]],
    focal,
    roll,
  };
};

// ------------------------------------------------------------- géométrie
export const circle = (cx: number, cz: number, r: number, n = 64, y = 0, a0 = 0, a1 = Math.PI * 2): V3[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + r * Math.cos(a), y, cz + r * Math.sin(a)] as V3;
  });

// Terrain FIBA 28 × 15 m, grand axe selon z
export const courtLines = (): V3[][] => {
  const L = 14;
  const W = 7.5;
  const lines: V3[][] = [
    [
      [-W, 0, -L],
      [W, 0, -L],
      [W, 0, L],
      [-W, 0, L],
      [-W, 0, -L],
    ],
    [
      [-W, 0, 0],
      [W, 0, 0],
    ],
    circle(0, 0, 1.8, 64),
    circle(0, 0, 0.6, 32),
  ];
  for (const side of [-1, 1]) {
    const base = side * L;
    const ft = side * (L - 5.8);
    const hoop = side * (L - 1.575);
    lines.push([
      [-2.45, 0, base],
      [-2.45, 0, ft],
      [2.45, 0, ft],
      [2.45, 0, base],
    ]);
    lines.push(circle(0, ft, 1.8, 48));
    // ligne à 3 points : segments droits puis arc de 6,75 m
    const zc = hoop - side * Math.sqrt(6.75 ** 2 - 6.6 ** 2);
    const ang = Math.asin(6.6 / 6.75);
    const arc = Array.from({ length: 49 }, (_, i) => {
      const a = -ang + (2 * ang * i) / 48;
      return [6.75 * Math.sin(a), 0, hoop - side * 6.75 * Math.cos(a)] as V3;
    });
    lines.push([[-6.6, 0, base], [-6.6, 0, zc], ...arc, [6.6, 0, zc], [6.6, 0, base]]);
  }
  return lines;
};

// Pistes de circuit imprimé qui partent du rond central (déterministes)
const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
export type Trace = { pts: V3[]; delay: number };
export const circuitTraces = (): Trace[] => {
  const r = rng(1515);
  const traces: Trace[] = [];
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * Math.PI * 2 + r() * 0.15;
    let x = Math.cos(a) * 1.9;
    let z = Math.sin(a) * 1.9;
    const pts: V3[] = [[x, 0, z]];
    let horiz = Math.abs(Math.cos(a)) > Math.abs(Math.sin(a));
    const steps = 3 + Math.floor(r() * 3);
    for (let k = 0; k < steps; k++) {
      const len = 1 + r() * 3.2;
      if (horiz) x = Math.max(-7.3, Math.min(7.3, x + Math.sign(Math.cos(a)) * len));
      else z = Math.max(-13.8, Math.min(13.8, z + Math.sign(Math.sin(a)) * len));
      pts.push([x, 0, z]);
      horiz = !horiz;
    }
    traces.push({ pts, delay: r() * 0.35 });
  }
  return traces;
};

// Longueur cumulée -> tronque une polyligne à une fraction p de sa longueur
export const partial = (pts: V3[], p: number): V3[] => {
  if (p <= 0) return [];
  if (p >= 1) return pts;
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[2] - pts[i][2]));
  const total = seg.reduce((a, b) => a + b, 0);
  let left = total * p;
  const out: V3[] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (left >= seg[i]) {
      out.push(pts[i + 1]);
      left -= seg[i];
    } else {
      const k = left / seg[i];
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, 0, pts[i][2] + (pts[i + 1][2] - pts[i][2]) * k]);
      break;
    }
  }
  return out;
};

export const seeded = rng;
