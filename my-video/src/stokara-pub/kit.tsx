// Briques de la publicité Stokara (format vertical) : fond, logo, titres, sous-titres,
// curseur, transitions. Charte et polices de l'application (voir ../stokara/ui.tsx).
import React, { useMemo } from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { buildChunks } from "../components/Subtitles";
import { IconName } from "../stokara/icons";
import { FONT, Icon, K, Logo, clamp, ease, sphereBg } from "../stokara/ui";
import { E, FPS, SCENE, XF } from "./timing";
import { VOICE } from "./voice";

export { FONT, Icon, K, Logo, clamp, ease };
export type Pt = [number, number];

// Zones de l'image 1080 × 1920 (zone sûre des réseaux sociaux : ni tout en haut, ni tout en bas)
export const Z = { brandY: 128, kickerY: 206, titleY: 250, visTop: 490, visBottom: 1340, capTop: 1392 };

// ------------------------------------------------------------------ outils d'animation
export const useF = () => useCurrentFrame();
export const sp = (f: number, at: number, damping = 14, stiffness = 170) => spring({ frame: f - at, fps: FPS, config: { damping, stiffness } });
export const lin = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], { ...clamp, easing: ease });

// Tempo de la musique (scripts/stokara-pub/make-audio.mjs) : la grosse caisse tombe sur chaque temps à partir de E.s2
export const BPM = 124;
const BEAT_F = (FPS * 60) / BPM;
export const beat = (f: number) => {
  if (f < E.s2 || f >= SCENE.end - BEAT_F) return 0;
  return Math.exp((-((f - E.s2) % BEAT_F) / FPS) * 10);
};
// Petites secousses sur les temps forts (impacts de la musique)
const HITS = () => [E.s2, E.drive, E.p1, E.p2, SCENE.end + 2];
export const shake = (f: number): [number, number] => {
  let x = 0;
  let y = 0;
  HITS().forEach((h, i) => {
    const t = f - h;
    if (t < 0 || t > 12) return;
    const a = 9 * Math.exp(-t / 4);
    x += Math.sin(t * 2.6 + i) * a;
    y += Math.cos(t * 3.1 + i) * a * 0.7;
  });
  return [x, y];
};

// Élément qui apparaît (ressort) à l'image `at`
export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number; scale?: boolean }> = ({ at, children, style, dy = 40, scale }) => {
  const f = useF();
  if (f < at - 1) return null;
  const p = sp(f, at, 11, 210);
  return <div style={{ opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * dy}px) scale(${scale ? 0.5 + 0.5 * p : 1})`, ...style }}>{children}</div>;
};

// Scène visible entre `from` et `to` : entrée en zoom (sauf la première, visible dès l'image 0),
// sortie en glissant vers le haut pendant les XF images qui suivent `to`
export const SceneWrap: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useF();
  if (f < from || f >= to + XF) return null;
  const out = interpolate(f, [to, to + XF], [0, 1], { ...clamp, easing: ease });
  const pin = from > 0 ? sp(f, from, 13, 200) : 1;
  const o = from > 0 ? lin(f, from, from + 4) : 1;
  return <AbsoluteFill style={{ opacity: o * (1 - out), transform: `translateY(${-110 * out}px) scale(${(1.12 - 0.12 * pin) * (1 - 0.06 * out)})` }}>{children}</AbsoluteFill>;
};

// Transition « balayage » aux couleurs de Stokara entre deux scènes
export const Swipes: React.FC<{ at: number[] }> = ({ at }) => {
  const f = useF();
  return (
    <>
      {at.map((b) => {
        if (f < b - 7 || f > b + 8) return null;
        const x = interpolate(f, [b - 7, b + 8], [-1500, 1700], { ...clamp, easing: ease });
        return (
          <AbsoluteFill key={b} style={{ pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: x - 140, top: -200, width: 160, height: 2400, background: K.navy, transform: "skewX(-16deg)", opacity: 0.95 }} />
            <div style={{ position: "absolute", left: x, top: -200, width: 620, height: 2400, background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, transform: "skewX(-16deg)", boxShadow: "0 0 60px rgba(249,135,26,.5)" }} />
            <div style={{ position: "absolute", left: x + 640, top: -200, width: 70, height: 2400, background: K.blue, transform: "skewX(-16deg)", opacity: 0.9 }} />
          </AbsoluteFill>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ fond (sphères de la page de connexion)
const SPHERES: { x: number; y: number; r: number; c: "b" | "o"; s: number }[] = [
  { x: 70, y: 360, r: 120, c: "b", s: 0.7 },
  { x: 1010, y: 250, r: 64, c: "o", s: 1.2 },
  { x: 1040, y: 1520, r: 210, c: "o", s: 0.5 },
  { x: 40, y: 1180, r: 86, c: "b", s: 0.9 },
  { x: 930, y: 960, r: 38, c: "o", s: 1.5 },
  { x: 180, y: 1830, r: 150, c: "b", s: 0.8 },
  { x: 640, y: 1930, r: 110, c: "o", s: 1.1 },
  { x: 560, y: -40, r: 90, c: "b", s: 1.0 },
];
export const Background: React.FC = () => {
  const f = useF();
  const b = beat(f);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #e3e8fb 0%, #f1f2fb 45%, #fdeedd 100%)", overflow: "hidden" }}>
      {SPHERES.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x - s.r,
            top: s.y - s.r + Math.sin((f / FPS) * 0.6 * s.s + i) * 16,
            width: s.r * 2,
            height: s.r * 2,
            borderRadius: "50%",
            background: sphereBg(s.c),
            boxShadow: "0 30px 60px rgba(26,35,126,.18)",
            opacity: 0.9,
            transform: `scale(${1 + 0.08 * b * (i % 2 ? 1 : 0.6)})`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ marque (en haut, après l'apparition du logo)
export const BrandPill: React.FC = () => {
  const f = useF();
  const from = E.logo + 20;
  if (f < from - 2 || f >= SCENE.end + 6) return null;
  const p = sp(f, from, 16, 200);
  const out = lin(f, SCENE.end - 4, SCENE.end + 6);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: Z.brandY - 30, display: "flex", justifyContent: "center", opacity: interpolate(p, [0, 0.4], [0, 1], clamp) * (1 - out) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.88)", borderRadius: 40, padding: "6px 24px 6px 8px", boxShadow: "0 10px 24px rgba(26,35,126,.14)", transform: `scale(${(0.7 + 0.3 * p) * (1 + 0.05 * beat(f))})` }}>
        <Logo size={46} />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: K.navy, letterSpacing: 0.5 }}>Stokara</span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ titres (un par scène)
export type Title = { at: number; until: number; kicker?: string; parts: (string | [string])[]; size?: number; top?: number };
// parts : texte normal, [texte] mis en valeur (orange), ou "\n" pour un retour à la ligne
export const Headline: React.FC<{ titles: Title[] }> = ({ titles }) => {
  const f = useF();
  return (
    <>
      {titles.map((t, i) => {
        if (f < t.at - 1 || f >= t.until + 3) return null;
        const pin = t.at <= 0 ? 1 : sp(f, t.at, 12, 220);
        const out = lin(f, t.until - 3, t.until + 3);
        const size = t.size ?? 68;
        let word = 0;
        return (
          <div key={i} style={{ position: "absolute", left: 50, right: 50, top: t.top ?? Z.kickerY, textAlign: "center", fontFamily: FONT, opacity: interpolate(pin, [0, 0.4], [0, 1], clamp) * (1 - out), transform: `translateY(${(1 - pin) * 40 - out * 40}px)` }}>
            {t.kicker && (
              <div style={{ display: "inline-block", fontSize: 28, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: K.orange2, marginBottom: 10, background: "rgba(255,255,255,.75)", padding: "4px 18px", borderRadius: 30 }}>{t.kicker}</div>
            )}
            <div style={{ fontSize: size, fontWeight: 700, lineHeight: 1.1, color: K.ink, letterSpacing: -0.5, transform: `scale(${1 + 0.018 * beat(f)})` }}>
              {t.parts.map((p, k) => {
                if (p === "\n") return <br key={k} />;
                const hl = Array.isArray(p);
                const txt = hl ? p[0] : p;
                // les mots arrivent un à un (léger décalage)
                return txt.split(" ").map((w, j) => {
                  const d = word++ * 2;
                  const q = t.at <= 0 ? 1 : sp(f, t.at + d, 11, 240);
                  return (
                    <span key={`${k}-${j}`} style={{ display: "inline-block", whiteSpace: "pre", transform: `translateY(${(1 - q) * 46}px) rotate(${(1 - q) * 8}deg) scale(${0.7 + 0.3 * q})`, opacity: interpolate(q, [0, 0.4], [0, 1], clamp) }}>
                      <span
                        style={
                          hl
                            ? { background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                            : undefined
                        }
                      >
                        {w}
                      </span>
                      {j < txt.split(" ").length - 1 || k < t.parts.length - 1 ? " " : ""}
                    </span>
                  );
                });
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ sous-titres (vidéo souvent regardée sans le son)
const WORDS = VOICE.words.map((w) => ({ text: w.text, start: w.start, end: w.end, scene: w.seq, sentence: w.para }));
export const Captions: React.FC<{ hideFrom: number }> = ({ hideFrom }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => buildChunks(WORDS, 4, 20), []); // une seule ligne
  if (f >= hideFrom) return null;
  const t = f / fps;
  const c = chunks.find((x) => t >= x.start - 0.05 && t < x.end);
  if (!c) return null;
  const pop = spring({ frame: f - Math.round(c.start * fps), fps, config: { damping: 15, stiffness: 260 } });
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: Z.capTop, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          background: "rgba(21,28,60,.9)",
          borderRadius: 26,
          padding: "14px 30px 16px",
          boxShadow: "0 14px 34px rgba(21,28,60,.32)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2px 18px",
          opacity: interpolate(pop, [0, 0.4], [0, 1], clamp),
          transform: `scale(${0.9 + 0.1 * pop})`,
        }}
      >
        {c.words.map((w) => {
          const on = t >= w.start - 0.03;
          const cur = on && t < w.end + 0.05;
          // mot prononcé : il « claque » (grossit puis se pose) ; mot à venir : discret, à sa place
          const q = on ? spring({ frame: f - Math.round((w.start - 0.03) * fps), fps, config: { damping: 12, stiffness: 320 } }) : 1;
          return (
            <span key={w.i} style={{ display: "inline-block", fontFamily: FONT, fontWeight: 700, fontSize: 54, lineHeight: 1.2, color: cur ? K.orange : "#fff", opacity: on ? 1 : 0.28, transform: `translateY(${-(1 - q) * 12}px) scale(${1 + (1 - q) * Math.min(0.3, 0.5 / w.text.length)})` }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ curseur (chemin + clics, en images absolues)
export type CK = { t: number; p: Pt; click?: "l" | "r" | "d"; d?: number };
export const cursorAt = (keys: CK[], f: number): Pt => {
  let pos = keys[0].p;
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    const d = k.d ?? 14;
    if (f < k.t - d) break;
    const e = interpolate(f, [k.t - d, k.t], [0, 1], { ...clamp, easing: ease });
    pos = [pos[0] + (k.p[0] - pos[0]) * e, pos[1] + (k.p[1] - pos[1]) * e];
  }
  return pos;
};
export const Pointer: React.FC<{ keys: CK[]; from: number; to: number; size?: number; hand?: boolean }> = ({ keys, from, to, size = 1 }) => {
  const f = useF();
  if (f < from || f > to) return null;
  const [x, y] = cursorAt(keys, f);
  let press = 0;
  const rings: React.ReactNode[] = [];
  keys.forEach((k, i) => {
    if (!k.click) return;
    (k.click === "d" ? [0, 6] : [0]).forEach((off, j) => {
      const t = f - (k.t + off);
      if (t >= -3 && t < 6) press = Math.max(press, interpolate(t, [-3, 0, 6], [0, 1, 0], clamp));
      if (t >= 0 && t < 16) {
        const r = interpolate(t, [0, 16], [6, 40], clamp) * size;
        rings.push(<div key={`${i}-${j}`} style={{ position: "absolute", left: k.p[0] - r, top: k.p[1] - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${4 * size}px solid ${k.click === "r" ? K.blue : K.orange}`, opacity: interpolate(t, [0, 16], [0.95, 0], clamp) }} />);
      }
    });
  });
  const o = interpolate(f, [from, from + 5, to - 5, to], [0, 1, 1, 0], clamp);
  return (
    <>
      {rings}
      <div style={{ position: "absolute", left: x - 2 * size, top: y - 2 * size, opacity: o }}>
        <svg width={30 * size} height={42 * size} viewBox="0 0 30 42" style={{ transform: `scale(${1 - 0.15 * press})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 3px 4px rgba(0,0,0,.35))", overflow: "visible" }}>
          <path d="M2 2 L2 33 L10 25.5 L15.5 38.5 L21 36 L15.6 23.3 L26.5 23.3 Z" fill="#fff" stroke="#111" strokeWidth={2.2} strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
};

// ------------------------------------------------------------------ fichiers (comme les vignettes de Stokara)
export type FileKind = "pdf" | "jpg" | "mp4" | "xlsx" | "docx";
const KIND: Record<FileKind, { icon: IconName; color: string; tag: string }> = {
  pdf: { icon: "file-earmark-pdf-fill", color: "#e03131", tag: "PDF" },
  jpg: { icon: "file-earmark-image-fill", color: "#2b8a3e", tag: "JPG" },
  mp4: { icon: "file-earmark-play-fill", color: K.violet, tag: "MP4" },
  xlsx: { icon: "file-earmark-excel-fill", color: "#1d7a45", tag: "XLSX" },
  docx: { icon: "file-earmark-word-fill", color: "#2f6fd6", tag: "DOCX" },
};
export const FileTile: React.FC<{ kind: FileKind; size?: number; style?: React.CSSProperties }> = ({ kind, size = 100, style }) => {
  const k = KIND[kind];
  return (
    <div style={{ width: size, height: size * 1.18, borderRadius: size * 0.14, background: "#fff", boxShadow: "0 8px 20px rgba(21,28,60,.16)", border: `1px solid ${K.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: size * 0.06, ...style }}>
      <Icon name={k.icon} size={size * 0.52} color={k.color} />
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: size * 0.15, color: "#fff", background: k.color, borderRadius: size * 0.06, padding: `${size * 0.01}px ${size * 0.07}px` }}>{k.tag}</span>
    </div>
  );
};

// ------------------------------------------------------------------ téléphone (capture réelle de Stokara sur mobile)
export const Phone: React.FC<{ w: number; src: string; scroll?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, src, scroll = 0, style, children }) => {
  const h = w * (2532 / 1170);
  const b = w * 0.04;
  return (
    <div style={{ position: "absolute", width: w + 2 * b, height: h + 2 * b, borderRadius: w * 0.15, background: "#161b2e", boxShadow: "0 40px 80px rgba(21,28,60,.38), inset 0 0 0 2px #3a4160", padding: b, boxSizing: "border-box", ...style }}>
      <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.12, overflow: "hidden", background: "#fff" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: -scroll, width: w, height: h }} />
        <div style={{ position: "absolute", left: w / 2 - w * 0.15, top: w * 0.025, width: w * 0.3, height: w * 0.075, borderRadius: w * 0.04, background: "#0b0e18" }} />
        {children}
      </div>
    </div>
  );
};
