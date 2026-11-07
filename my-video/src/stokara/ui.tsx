// Charte et outils du tutoriel Stokara : couleurs et polices de l'application, fond à sphères,
// fenêtre de navigateur, caméra (zooms), curseur, encadrés et cartons de chapitre.
import React, { createContext, useContext, useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BI, IconName } from "./icons";
import SHOTS from "./shots.json";

// ------------------------------------------------------------------ charte (frontend/assets/app.css)
export const K = {
  ink: "#151c3c",
  ink2: "#4b5878",
  ink3: "#6d7896",
  bg: "#f4f6fb",
  line: "#e3e7f0",
  navy: "#1a237e",
  blue: "#3949ab",
  orange: "#f9871a",
  orange2: "#e8790f",
  folder: "#f2a33a",
  green: "#15803d",
  red: "#c62828",
  violet: "#7c3aed",
  teal: "#0f766e",
  pink: "#db2777",
};
export const FONT = "Poppins, 'Segoe UI', sans-serif";
export const WIN = "'Segoe UI', 'Noto Sans', Poppins, sans-serif";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.45, 0, 0.2, 1);

const FONTS: [string, number, string][] = [
  ["Poppins", 400, "poppins-latin-400-normal.woff2"],
  ["Poppins", 500, "poppins-latin-500-normal.woff2"],
  ["Poppins", 600, "poppins-latin-600-normal.woff2"],
  ["Poppins", 700, "poppins-latin-700-normal.woff2"],
  ["bootstrap-icons", 400, "bootstrap-icons.woff2"],
];
export const useStkFonts = () => {
  const [handle] = useState(() => delayRender("Polices Stokara"));
  useEffect(() => {
    Promise.all(FONTS.map(([family, weight, file]) => new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { weight: String(weight) }).load().then((f) => document.fonts.add(f))))
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; style?: React.CSSProperties }> = ({ name, size = 32, color = K.ink, style }) => (
  <span style={{ fontFamily: "bootstrap-icons", fontSize: size, lineHeight: 1, color, display: "inline-block", ...style }}>{String.fromCharCode(parseInt(BI[name], 16))}</span>
);

// ------------------------------------------------------------------ fond (page de connexion de Stokara)
const SPHERES: { x: number; y: number; r: number; c: "b" | "o"; sp: number }[] = [
  { x: 120, y: 150, r: 170, c: "b", sp: 0.7 },
  { x: 330, y: 110, r: 70, c: "o", sp: 1.1 },
  { x: 1790, y: 880, r: 230, c: "o", sp: 0.5 },
  { x: 1630, y: 140, r: 54, c: "b", sp: 1.3 },
  { x: 60, y: 900, r: 120, c: "b", sp: 0.9 },
  { x: 1500, y: 470, r: 36, c: "o", sp: 1.6 },
  { x: 430, y: 1010, r: 90, c: "o", sp: 0.8 },
];
export const sphereBg = (c: "b" | "o") =>
  c === "b"
    ? "radial-gradient(circle at 32% 28%, #aab4ff 0%, #5a68d6 28%, #3949ab 55%, #1a237e 100%)"
    : "radial-gradient(circle at 32% 28%, #ffe0bd 0%, #ffad5a 26%, #f9871a 55%, #c55a06 100%)";

export const Stage: React.FC<{ children?: React.ReactNode; spheres?: boolean }> = ({ children, spheres = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #e6eafb 0%, #f2f3fb 45%, #fdf1e4 100%)", overflow: "hidden" }}>
      {spheres &&
        SPHERES.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x - s.r,
              top: s.y - s.r + Math.sin((f / 25) * 0.35 * s.sp + i) * 14,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: "50%",
              background: sphereBg(s.c),
              boxShadow: "0 30px 60px rgba(26,35,126,.18)",
              opacity: 0.92,
            }}
          />
        ))}
      {children}
    </AbsoluteFill>
  );
};

export const Logo: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => <Img src={staticFile("stokara/logo.png")} style={{ width: size, height: size, objectFit: "contain", ...style }} />;

// ------------------------------------------------------------------ captures et géométrie
export type Rect = [number, number, number, number];
export type Pt = [number, number];
type ShotMeta = { w: number; h: number; t: Record<string, number[]> };
const META = SHOTS as unknown as Record<string, ShotMeta>;
export const R = (shot: string, key: string, pad = 0): Rect => {
  const r = META[shot]?.t[key];
  if (!r) throw new Error(`Cible inconnue : ${shot}.${key}`);
  return [r[0] - pad, r[1] - pad, r[2] + 2 * pad, r[3] + 2 * pad];
};
export const U = (...rs: Rect[]): Rect => {
  const x0 = Math.min(...rs.map((r) => r[0]));
  const y0 = Math.min(...rs.map((r) => r[1]));
  const x1 = Math.max(...rs.map((r) => r[0] + r[2]));
  const y1 = Math.max(...rs.map((r) => r[1] + r[3]));
  return [x0, y0, x1 - x0, y1 - y0];
};
export const P = (r: Rect, fx = 0.5, fy = 0.5): Pt => [r[0] + r[2] * fx, r[1] + r[3] * fy];
export const grow = (r: Rect, n: number): Rect => [r[0] - n, r[1] - n, r[2] + 2 * n, r[3] + 2 * n];

// Fenêtre (navigateur) : position du contenu sur l'image 1920 × 1080
export const CW = 1600; // largeur des captures (px CSS)
export const CH = 860;
export const FR = { x: 180, y: 34, w: 1560, bar: 50 };
export const SC = FR.w / CW;
const FB = FR.y + FR.bar + CH * SC; // bas de la fenêtre
const VIEW = { cx: 960, cy: (FR.y + FB) / 2, w: 1820, h: 860 }; // zone visible au-dessus des sous-titres

// ------------------------------------------------------------------ caméra
export type CamKey = { t: number; r?: Rect | null; z?: number; d?: number };
type Cam = { x: number; y: number; z: number };
const camFor = (k: CamKey): Cam => {
  if (!k.r) return { x: 960, y: (FR.y + FB) / 2, z: 1 };
  const [x, y, w, h] = k.r;
  const sx = FR.x + x * SC;
  const sy = FR.y + FR.bar + y * SC;
  let z = Math.min(k.z ?? 2.1, VIEW.w / (w * SC * 1.12), VIEW.h / (h * SC * 1.12));
  z = Math.max(1, z);
  let cx = sx + (w * SC) / 2;
  let cy = sy + (h * SC) / 2;
  const hw = VIEW.cx / z;
  const hh = VIEW.cy / z;
  cx = FR.w > 2 * hw ? Math.min(Math.max(cx, FR.x + hw), FR.x + FR.w - hw) : FR.x + FR.w / 2;
  cy = FB - FR.y > 2 * hh ? Math.min(Math.max(cy, FR.y + hh), FB - hh) : (FR.y + FB) / 2;
  return { x: cx, y: cy, z };
};
export const useCamera = (keys: CamKey[]) => {
  const f = useCurrentFrame();
  let cur = camFor(keys[0] ?? { t: 0 });
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.t) break;
    const d = k.d ?? 22;
    const e = interpolate(f, [k.t, k.t + d], [0, 1], { ...clamp, easing: ease });
    const nxt = camFor(k);
    cur = { x: cur.x + (nxt.x - cur.x) * e, y: cur.y + (nxt.y - cur.y) * e, z: cur.z * Math.pow(nxt.z / cur.z, e) };
  }
  return { transform: `translate(${VIEW.cx}px, ${(FR.y + FB) / 2}px) scale(${cur.z}) translate(${-cur.x}px, ${-cur.y}px)`, z: cur.z };
};

// ------------------------------------------------------------------ fenêtre de navigateur
export const BrowserFrame: React.FC<{ url: string; chapter?: string; children: React.ReactNode }> = ({ url, chapter, children }) => (
  <div
    style={{
      position: "absolute",
      left: FR.x,
      top: FR.y,
      width: FR.w,
      height: FR.bar + CH * SC,
      borderRadius: 18,
      background: "#fff",
      boxShadow: "0 40px 90px rgba(26,35,126,.28), 0 6px 18px rgba(26,35,126,.12)",
      overflow: "hidden",
    }}
  >
    <div style={{ height: FR.bar, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", background: "#f6f7fb", borderBottom: `1px solid ${K.line}`, fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 10, padding: "6px 14px", boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
        <Logo size={20} />
        <span style={{ fontSize: 15, fontWeight: 600, color: K.ink }}>Stokara</span>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#eceff6", borderRadius: 18, padding: "7px 16px", fontSize: 16, color: K.ink2 }}>
        <Icon name="lock-fill" size={14} color={K.green} />
        <span>
          <span style={{ color: K.ink }}>https://stokara.exemple.fr</span>
          {url}
        </span>
      </div>
      {chapter && <span style={{ fontSize: 15, fontWeight: 600, color: K.blue, whiteSpace: "nowrap" }}>{chapter}</span>}
      <div style={{ display: "flex", gap: 22, color: K.ink3, fontSize: 18, marginLeft: 6 }}>
        <span>─</span>
        <span>☐</span>
        <span>✕</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, top: FR.bar, width: CW, height: CH, transform: `scale(${SC})`, transformOrigin: "0 0", overflow: "hidden" }}>{children}</div>
  </div>
);

// ------------------------------------------------------------------ captures enchaînées
export type ShotKey = { t: number; s: string; fade?: number };
export const Shots: React.FC<{ keys: ShotKey[] }> = ({ keys }) => {
  const f = useCurrentFrame();
  let i = 0;
  keys.forEach((k, j) => {
    if (f >= k.t) i = j;
  });
  const cur = keys[i];
  const prev = keys[i - 1];
  const fade = cur.fade ?? 5;
  const o = prev ? interpolate(f, [cur.t, cur.t + fade], [0, 1], clamp) : 1;
  const img = (s: string, op: number) => <Img key={s} src={staticFile(`stokara/caps/${s}.jpg`)} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, opacity: op }} />;
  return (
    <>
      {prev && o < 1 && img(prev.s, 1)}
      {img(cur.s, o)}
    </>
  );
};

// ------------------------------------------------------------------ curseur
export type CurKey = { t: number; p: Pt; c?: "l" | "r" | "d"; d?: number; hide?: boolean };
const Arrow: React.FC<{ press: number }> = ({ press }) => (
  <svg width={30} height={42} viewBox="0 0 30 42" style={{ transform: `scale(${1 - 0.14 * press})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 3px 4px rgba(0,0,0,.35))" }}>
    <path d="M2 2 L2 33 L10 25.5 L15.5 38.5 L21 36 L15.6 23.3 L26.5 23.3 Z" fill="#fff" stroke="#111" strokeWidth={2.2} strokeLinejoin="round" />
  </svg>
);
export const Cursor: React.FC<{ keys: CurKey[] }> = ({ keys }) => {
  const f = useCurrentFrame();
  if (!keys.length || f < keys[0].t - (keys[0].d ?? 18)) return null;
  let pos: Pt = keys[0].p;
  let hidden = false;
  let press = 0;
  const ripples: React.ReactNode[] = [];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const d = k.d ?? 18;
    if (f < k.t - d) break;
    const from = pos;
    const e = interpolate(f, [k.t - d, k.t], [0, 1], { ...clamp, easing: ease });
    const dx = k.p[0] - from[0];
    const dy = k.p[1] - from[1];
    const arc = Math.sin(Math.PI * e) * 0.08;
    pos = [from[0] + dx * e - dy * arc, from[1] + dy * e + dx * arc];
    hidden = !!k.hide && f >= k.t;
    if (k.c) {
      const clicks = k.c === "d" ? [0, 7] : [0];
      clicks.forEach((off, j) => {
        const t = f - (k.t + off);
        if (t >= -3 && t < 6) press = Math.max(press, interpolate(t, [-3, 0, 6], [0, 1, 0], clamp));
        if (t >= 0 && t < 18) {
          const r = interpolate(t, [0, 18], [6, 34], clamp);
          ripples.push(
            <div
              key={`${i}-${j}`}
              style={{
                position: "absolute",
                left: k.p[0] - r,
                top: k.p[1] - r,
                width: 2 * r,
                height: 2 * r,
                borderRadius: "50%",
                border: `4px solid ${k.c === "r" ? K.blue : K.orange}`,
                opacity: interpolate(t, [0, 18], [0.9, 0], clamp),
              }}
            />,
          );
        }
      });
    }
  }
  if (hidden) return null;
  return (
    <>
      {ripples}
      <div style={{ position: "absolute", left: pos[0] - 2, top: pos[1] - 2 }}>
        <Arrow press={press} />
      </div>
    </>
  );
};

// ------------------------------------------------------------------ encadrés
export type SpotDef = { from: number; to: number; r: Rect; label?: string; pos?: "top" | "bottom" | "left" | "right"; dim?: boolean; color?: string; round?: number };
export const Spots: React.FC<{ spots: SpotDef[] }> = ({ spots }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {spots.map((s, i) => {
        const to = Math.max(s.to, s.from + 8); // deux repères vocaux peuvent tomber au même instant
        if (f < s.from - 2 || f > to + 8) return null;
        const o = interpolate(f, [s.from, s.from + 6, to, to + 8], [0, 1, 1, 0], clamp);
        const pop = spring({ frame: f - s.from, fps, config: { damping: 15, stiffness: 180 } });
        const [x, y, w, h] = s.r;
        const col = s.color ?? K.orange;
        const pos = s.pos ?? "top";
        const lab: React.CSSProperties =
          pos === "top"
            ? { left: w / 2, bottom: h + 14, transform: "translateX(-50%)" }
            : pos === "bottom"
              ? { left: w / 2, top: h + 14, transform: "translateX(-50%)" }
              : pos === "left"
                ? { right: w + 16, top: h / 2, transform: "translateY(-50%)" }
                : { left: w + 16, top: h / 2, transform: "translateY(-50%)" };
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o }}>
            {s.dim && <div style={{ position: "absolute", inset: -8, borderRadius: (s.round ?? 12) + 6, boxShadow: "0 0 0 4000px rgba(21,28,60,.34)" }} />}
            <div
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: (s.round ?? 12) + 6,
                border: `3.5px solid ${col}`,
                boxShadow: `0 0 0 5px ${col}33, 0 10px 34px ${col}55`,
                transform: `scale(${1.06 - 0.06 * pop})`,
              }}
            />
            {s.label && (
              <div
                style={{
                  position: "absolute",
                  ...lab,
                  whiteSpace: "nowrap",
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 22,
                  color: "#fff",
                  background: K.ink,
                  padding: "8px 16px",
                  borderRadius: 12,
                  boxShadow: "0 10px 24px rgba(21,28,60,.3)",
                }}
              >
                {s.label}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ écran complet (capture + caméra + curseur + encadrés)
const ZoomCtx = createContext(1);
export const useZoom = () => useContext(ZoomCtx);
export const Screen: React.FC<{
  url: string | [number, string][];
  chapter?: string;
  shots: ShotKey[];
  cam?: CamKey[];
  cur?: CurKey[];
  spots?: SpotDef[];
  overlay?: React.ReactNode; // dessin en coordonnées de capture, au-dessus des encadrés
  show?: [number, number]; // apparition / disparition de la fenêtre
}> = ({ url, chapter, shots, cam = [{ t: 0 }], cur = [], spots = [], overlay, show }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useCamera(cam);
  const u = typeof url === "string" ? url : url.reduce((acc, [t, v]) => (f >= t ? v : acc), url[0][1]);
  const inn = show ? spring({ frame: f - show[0], fps, config: { damping: 18, stiffness: 120 } }) : 1;
  const out = show ? interpolate(f, [show[1] - 10, show[1]], [1, 0], clamp) : 1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, inn * 1.4) * out }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `${c.transform} translateY(${(1 - inn) * 60}px)` }}>
        <ZoomCtx.Provider value={c.z}>
          <BrowserFrame url={u} chapter={chapter}>
            <Shots keys={shots} />
            <Spots spots={spots} />
            {overlay}
            <Cursor keys={cur} />
          </BrowserFrame>
        </ZoomCtx.Provider>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ éléments de mise en scène
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: "rgba(255,255,255,.92)", borderRadius: 22, boxShadow: "0 24px 60px rgba(26,35,126,.16), 0 2px 8px rgba(26,35,126,.08)", border: "1px solid rgba(255,255,255,.8)", ...style }}>{children}</div>
);

// Apparition (ressort) à partir d'une image donnée
export const usePop = (at: number, damping = 14, stiffness = 170) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, stiffness } });
};
export const Pop: React.FC<{ at: number; until?: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number }> = ({ at, until, children, style, dy = 30 }) => {
  const f = useCurrentFrame();
  const p = usePop(at);
  if (f < at - 1) return null;
  const o = until !== undefined ? interpolate(f, [until - 8, until], [1, 0], clamp) : 1;
  if (o <= 0) return null;
  return <div style={{ ...style, opacity: Math.min(1, p * 1.5) * o, transform: `${style?.transform ?? ""} translateY(${(1 - p) * dy}px) scale(${0.94 + 0.06 * p})` }}>{children}</div>;
};

// Carton de chapitre (pendant le silence réservé par la voix off)
export const ChapterCard: React.FC<{ n: number; title: string; sub: string; icon: IconName; duration: number }> = ({ n, title, sub, icon, duration }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inn = spring({ frame: f, fps, config: { damping: 16, stiffness: 140 } });
  const out = interpolate(f, [duration - 9, duration + 3], [0, 1], { ...clamp, easing: ease });
  const wipe = interpolate(f, [0, 10], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 ${out * 100}% 0)` }}>
      <AbsoluteFill style={{ clipPath: `circle(${wipe * 150}% at 50% 50%)` }}>
        <Stage>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 46, transform: `translateY(${(1 - inn) * 40}px)`, opacity: Math.min(1, inn * 1.4) }}>
              <div
                style={{
                  width: 190,
                  height: 190,
                  borderRadius: 48,
                  background: "linear-gradient(135deg, #3949ab, #1a237e)",
                  boxShadow: "0 30px 60px rgba(26,35,126,.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  transform: `rotate(${(1 - inn) * -12}deg)`,
                }}
              >
                <Icon name={icon} size={92} color="#fff" />
                <div
                  style={{
                    position: "absolute",
                    right: -22,
                    top: -22,
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    background: K.orange,
                    color: "#fff",
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 24px rgba(249,135,26,.45)",
                  }}
                >
                  {n}
                </div>
              </div>
              <div style={{ fontFamily: FONT, color: K.ink }}>
                <div style={{ fontSize: 26, fontWeight: 600, color: K.orange2, letterSpacing: 3, textTransform: "uppercase" }}>Chapitre {n}</div>
                <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, marginTop: 6 }}>{title}</div>
                <div style={{ fontSize: 30, color: K.ink2, marginTop: 12 }}>{sub}</div>
              </div>
            </div>
          </AbsoluteFill>
        </Stage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Touches du clavier (raccourcis)
export const Keys: React.FC<{ keys: string[]; size?: number }> = ({ keys, size = 34 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT }}>
    {keys.map((k, i) =>
      k === "+" ? (
        <span key={i} style={{ fontSize: size, color: K.ink2, fontWeight: 600 }}>+</span>
      ) : (
        <span
          key={i}
          style={{
            minWidth: size * 1.6,
            padding: `${size * 0.22}px ${size * 0.45}px`,
            borderRadius: size * 0.3,
            background: "linear-gradient(#ffffff, #eef1f8)",
            border: `2px solid ${K.line}`,
            borderBottomWidth: 6,
            fontSize: size,
            fontWeight: 600,
            color: K.ink,
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(26,35,126,.15)",
          }}
        >
          {k}
        </span>
      ),
    )}
  </div>
);

// Bulle d'information flottante au-dessus de l'écran (coordonnées de l'image 1920 × 1080)
export const Tip: React.FC<{ at: number; until?: number; x: number; y: number; icon?: IconName; children: React.ReactNode; w?: number; tone?: string }> = ({ at, until, x, y, icon = "lightbulb-fill", children, w, tone = K.orange }) => (
  <Pop at={at} until={until} style={{ position: "absolute", left: x, top: y, width: w }}>
    <Card style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 26px", borderLeft: `8px solid ${tone}` }}>
      <Icon name={icon} size={34} color={tone} />
      <div style={{ fontFamily: FONT, fontSize: 27, fontWeight: 500, color: K.ink, lineHeight: 1.3 }}>{children}</div>
    </Card>
  </Pop>
);
