// Écrans réels de Stokara (captures 1600 × 860 px CSS) vus dans un « hublot » vertical avec une caméra,
// encadrés, bulles d'explication et logo d'ouverture : briques partagées par les publicités Stokara.
import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { IconName } from "../stokara/icons";
import { FONT, Icon, K, Logo, clamp, lin, sp, useF } from "./kit";

export const card: React.CSSProperties = { background: "rgba(255,255,255,.95)", borderRadius: 28, boxShadow: "0 24px 50px rgba(26,35,126,.16), 0 4px 12px rgba(26,35,126,.08)", boxSizing: "border-box", fontFamily: FONT };
export type R4 = [number, number, number, number];
export const ctr = (r: R4): [number, number] => [r[0] + r[2] / 2, r[1] + r[3] / 2];

// ------------------------------------------------------------------ hublot sur les captures (1600 × 860 px CSS)
const VP = { x: 30, y: 478, w: 1020, h: 862, bar: 48 };
const VW = VP.w;
const VH = VP.h - VP.bar;
const S0 = VW / 1600;
const ZMIN = VH / (860 * S0); // en dessous, la capture ne remplirait pas la hauteur
export type Cam = { t: number; cx: number; cy: number; z: number; d?: number };
export const camAt = (keys: Cam[], f: number) => {
  let c = { cx: keys[0].cx, cy: keys[0].cy, z: keys[0].z };
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.t) break;
    const e = lin(f, k.t, k.t + (k.d ?? 14));
    c = { cx: c.cx + (k.cx - c.cx) * e, cy: c.cy + (k.cy - c.cy) * e, z: c.z * Math.pow(k.z / c.z, e) };
  }
  const z = Math.max(ZMIN, c.z);
  const hw = VW / 2 / (S0 * z);
  const hh = VH / 2 / (S0 * z);
  return { cx: Math.min(Math.max(c.cx, hw), 1600 - hw), cy: Math.min(Math.max(c.cy, hh), 860 - hh), z };
};
export const Viewport: React.FC<{ f: number; from: number; shots: [number, string][]; cams: Cam[]; url: string; children?: React.ReactNode }> = ({ f, from, shots, cams, url, children }) => {
  const p = sp(f, from + 3, 16, 150);
  let i = 0;
  shots.forEach(([t], j) => {
    if (f >= t) i = j;
  });
  const fade = i > 0 ? lin(f, shots[i][0], shots[i][0] + 4) : 1;
  const c = camAt(cams, f);
  const img = (s: string, o: number) => <Img key={s} src={staticFile(`stokara/caps/${s}.jpg`)} style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 860, opacity: o }} />;
  return (
    <div style={{ position: "absolute", left: VP.x, top: VP.y, width: VP.w, height: VP.h, borderRadius: 24, background: "#fff", overflow: "hidden", boxShadow: "0 40px 90px rgba(26,35,126,.3), 0 6px 18px rgba(26,35,126,.12)", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * 140}px) scale(${0.9 + 0.1 * p})` }}>
      <div style={{ height: VP.bar, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", background: "#f6f7fb", borderBottom: `1px solid ${K.line}`, fontFamily: FONT }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((col) => (
            <div key={col} style={{ width: 13, height: 13, borderRadius: 7, background: col }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#eceff6", borderRadius: 18, padding: "7px 16px", fontSize: 20, color: K.ink, whiteSpace: "nowrap", overflow: "hidden" }}>
          <Icon name="lock-fill" size={16} color={K.green} />
          stokara.entrelyo.fr<span style={{ color: K.ink3 }}>{url}</span>
        </div>
      </div>
      <div style={{ position: "relative", width: VW, height: VH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 860, transformOrigin: "0 0", transform: `translate(${VW / 2}px, ${VH / 2}px) scale(${S0 * c.z}) translate(${-c.cx}px, ${-c.cy}px)` }}>
          {i > 0 && fade < 1 && img(shots[i - 1][1], 1)}
          {img(shots[i][1], fade)}
          {children}
        </div>
      </div>
    </div>
  );
};

// Encadré orange sur une zone de la capture
export const Spot: React.FC<{ r: R4; from: number; to: number; round?: number }> = ({ r, from, to, round = 10 }) => {
  const f = useF();
  if (f < from - 1 || f > to + 6) return null;
  const q = sp(f, from, 12, 220);
  const o = interpolate(f, [from, from + 4, to, to + 6], [0, 1, 1, 0], clamp);
  const pad = 6 + (1 - q) * 14;
  return <div style={{ position: "absolute", left: r[0] - pad, top: r[1] - pad, width: r[2] + 2 * pad, height: r[3] + 2 * pad, borderRadius: round, border: `4px solid ${K.orange}`, boxShadow: "0 0 0 6px rgba(249,135,26,.22), 0 0 30px rgba(249,135,26,.45)", opacity: o }} />;
};

// Bulle d'explication posée sur l'image (coordonnées de la vidéo)
export const Callout: React.FC<{ at: number; until: number; icon: IconName; title: string; sub?: string; top: number; tone?: string; left?: number }> = ({ at, until, icon, title, sub, top, tone, left = 60 }) => {
  const f = useF();
  if (f < at - 1 || f > until + 8) return null;
  const q = sp(f, at, 12, 210);
  const out = lin(f, until, until + 8);
  return (
    <div style={{ position: "absolute", left, right: 60, top, display: "flex", justifyContent: "center", opacity: interpolate(q, [0, 0.3], [0, 1], clamp) * (1 - out), transform: `translateY(${(1 - q) * 50}px) scale(${0.85 + 0.15 * q})` }}>
      <div style={{ ...card, borderRadius: 26, padding: "16px 26px", display: "flex", alignItems: "center", gap: 16, background: tone ?? `linear-gradient(135deg, ${K.navy}, ${K.blue})`, color: "#fff" }}>
        <Icon name={icon} size={46} color="#fff" />
        <div>
          <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
          {sub && <div style={{ fontSize: 22, opacity: 0.9 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
};

// Logo qui jaillit à l'image `at`, puis rejoint la marque en haut de l'image
export const LogoBurst: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  if (f < at - 2 || f > at + 28) return null;
  const p = sp(f, at, 10, 200);
  const fly = lin(f, at + 13, at + 26);
  const x = 540 + (452 - 540) * fly;
  const y = 860 + (128 - 860) * fly;
  const size = 240 * (1 - 0.81 * fly);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${p})`, opacity: 1 - lin(f, at + 21, at + 27) }}>
      <div style={{ position: "absolute", inset: -size * 0.35, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,255,255,.6) 45%, transparent 70%)", opacity: 1 - fly }} />
      <Logo size={size} style={{ position: "relative", filter: "drop-shadow(0 18px 30px rgba(26,35,126,.35))" }} />
    </div>
  );
};

