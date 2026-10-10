// Palette et éléments d'interface communs de la vidéo « site vitrine ou boutique ».
// Même style que les autres vidéos QYLINE (étiquettes jaunes, ombres franches, grille du site),
// avec la palette du brief : bleu nuit, violet électrique, bleu lumineux, vert de validation.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, HEAD, clamp, hard } from "../qyline/shared";

export { BODY, HEAD, clamp, hard };
export { Stamp, Footnote, Lines, CheckBox, LaptopFrame } from "../qyline-legal/ui";

export const P = {
  night: "#080D1F",
  violet: "#754BFF",
  blue: "#3987FF",
  white: "#FFFFFF",
  green: "#22C55E",
  site: "#24459A", // bleu de qyline.org
  grid: "#3352A1",
  yellow: "#F5C518",
  navy: "#121A33",
  paper: "#F4F6FA",
  muted: "#C5CEE4",
  red: "#E5484D",
};

export const usePop = (delay: number, damping = 13, stiffness = 180) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

// ---------------------------------------------------------------- fonds
export const Backdrop: React.FC<{ night?: boolean }> = ({ night = false }) => {
  const frame = useCurrentFrame();
  const line = night ? "rgba(117,75,255,0.14)" : "rgba(51,82,161,0.9)";
  const glows = night
    ? [
        { x: 180, y: 380, r: 950, c: "117,75,255", s: 0.7 },
        { x: 950, y: 1450, r: 1100, c: "57,135,255", s: 0.5 },
        { x: 700, y: 820, r: 650, c: "117,75,255", s: 1.1 },
      ]
    : [];
  return (
    <AbsoluteFill style={{ background: night ? P.night : P.site, overflow: "hidden" }}>
      {glows.map((g, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: g.x - g.r / 2 + Math.sin((frame / 50) * g.s + i) * 120,
            top: g.y - g.r / 2 + Math.cos((frame / 60) * g.s + i * 2) * 140,
            width: g.r,
            height: g.r,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${g.c},0.4) 0%, rgba(${g.c},0.1) 45%, rgba(${g.c},0) 70%)`,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${line} 2px, transparent 2px), linear-gradient(90deg, ${line} 2px, transparent 2px)`,
          backgroundSize: "72px 72px",
          backgroundPosition: `${-frame * 0.4}px ${-frame * 0.8}px`,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(80% 60% at 50% 45%, rgba(0,0,0,0) 40%, rgba(8,13,31,${night ? 0.8 : 0.4}) 100%)` }} />
    </AbsoluteFill>
  );
};

// Mouvement de caméra lent : léger zoom avant et rotation sur toute la scène
export const Camera: React.FC<{ length: number; zoom?: [number, number]; rotate?: [number, number]; children: React.ReactNode }> = ({
  length,
  zoom = [1, 1.04],
  rotate = [-0.6, 0.6],
  children,
}) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, length], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * k}) rotate(${rotate[0] + (rotate[1] - rotate[0]) * k}deg)` }}>{children}</AbsoluteFill>
  );
};

// ---------------------------------------------------------------- interface
export const Cursor: React.FC<{ x: number; y: number; press?: boolean; opacity?: number }> = ({ x, y, press = false, opacity = 1 }) => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 24 24"
    style={{ position: "absolute", left: x, top: y, opacity, transform: `scale(${press ? 0.82 : 1})`, transformOrigin: "10% 10%", filter: `drop-shadow(3px 3px 0 ${P.navy})` }}
  >
    <path d="M4 2l15 9-6.5 1.5L16 20l-3 1.5-3.6-7.4L4 18z" fill={P.white} stroke={P.navy} strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

export const Toast: React.FC<{ title: string; subtitle: string; progress: number; color?: string; width?: number }> = ({
  title,
  subtitle,
  progress,
  color = P.green,
  width = 560,
}) => (
  <div
    style={{
      width,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 20,
      padding: "20px 24px",
      background: P.white,
      border: `3px solid ${P.navy}`,
      borderRadius: 18,
      boxShadow: hard(8),
      fontFamily: BODY,
      opacity: interpolate(progress, [0, 0.2], [0, 1], clamp),
      transform: `translateY(${(1 - progress) * -60}px) scale(${0.9 + 0.1 * progress})`,
    }}
  >
    <div style={{ width: 58, height: 58, borderRadius: 16, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={P.white} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 12.5l5 5L19.5 7" />
      </svg>
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontWeight: 800, fontSize: 30, color: P.navy }}>{title}</div>
      <div style={{ fontWeight: 600, fontSize: 22, color: "#59627F", marginTop: 4 }}>{subtitle}</div>
    </div>
  </div>
);

// Étiquette arrondie (pastille) qui s'allume
export const Chip: React.FC<{ label: string; progress: number; color?: string; size?: number }> = ({ label, progress, color = P.violet, size = 34 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: `${size * 0.32}px ${size * 0.62}px`,
      borderRadius: 999,
      background: color,
      color: P.white,
      fontFamily: BODY,
      fontWeight: 800,
      fontSize: size,
      boxShadow: hard(6),
      whiteSpace: "nowrap",
      opacity: interpolate(progress, [0, 0.2], [0, 1], clamp),
      transform: `scale(${interpolate(progress, [0, 1], [0.4, 1])}) translateY(${(1 - progress) * 30}px)`,
    }}
  >
    {label}
  </div>
);

// Coche verte
export const Check: React.FC<{ size?: number; progress?: number; color?: string }> = ({ size = 34, progress = 1, color = P.green }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: `scale(${progress})` }}>
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" stroke={P.white} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.5l5 5L19.5 7" strokeDasharray={24} strokeDashoffset={24 * (1 - Math.min(1, progress))} />
    </svg>
  </div>
);

export const DisplayLine: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 96, color = P.white }) => (
  <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, lineHeight: 1.02, color, whiteSpace: "nowrap", textAlign: "center" }}>{children}</div>
);
