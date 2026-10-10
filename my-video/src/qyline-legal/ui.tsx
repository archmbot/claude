// Éléments communs de la vidéo « mentions légales », au style de qyline.org.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, HEAD, clamp, hard } from "../qyline/shared";
import { VOICE } from "./voice";
import { Subtitles } from "../components/Subtitles";

export const C = {
  blue: "#24459A",
  grid: "#3352A1",
  yellow: "#F5C518",
  navy: "#121A33",
  night: "#0B1230",
  paper: "#F4F6FA",
  white: "#FFFFFF",
  muted: "#C5CEE4",
  violet: "#7C3AED",
  violetDeep: "#6A1BEA",
  red: "#E5484D",
  green: "#22A06B",
};
export { BODY, HEAD, clamp, hard };

export const usePop = (delay: number, damping = 13, stiffness = 180) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

// ---------------------------------------------------------------- fonds
export const Backdrop: React.FC<{ dark?: boolean; violet?: number }> = ({ dark = false, violet = 0 }) => {
  const frame = useCurrentFrame();
  const line = dark ? "rgba(124,58,237,0.16)" : "rgba(51,82,161,0.9)";
  const blobs = [
    { x: 200, y: 400, r: 900, s: 0.7 },
    { x: 900, y: 1500, r: 1100, s: 0.5 },
    { x: 700, y: 700, r: 600, s: 1.1 },
  ];
  return (
    <AbsoluteFill style={{ background: dark ? C.night : C.blue, overflow: "hidden" }}>
      {violet > 0 &&
        blobs.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x - b.r / 2 + Math.sin(frame / 50 * b.s + i) * 120,
              top: b.y - b.r / 2 + Math.cos(frame / 60 * b.s + i * 2) * 140,
              width: b.r,
              height: b.r,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(124,58,237,${0.42 * violet}) 0%, rgba(106,27,234,${0.12 * violet}) 45%, rgba(106,27,234,0) 70%)`,
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
      <AbsoluteFill
        style={{ background: `radial-gradient(80% 60% at 50% 45%, rgba(0,0,0,0) 40%, rgba(11,18,48,${dark ? 0.75 : 0.4}) 100%)` }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- logo (en haut à gauche, toute la vidéo)
export const LogoMark: React.FC<{ size: number; shadow?: number }> = ({ size, shadow = 5 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.18,
      background: C.navy,
      boxShadow: hard(shadow, C.yellow),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Img src={staticFile("logo-q.png")} style={{ width: size * 0.74, height: size * 0.684 }} />
  </div>
);

export const Header: React.FC = () => {
  const p = usePop(2, 16, 160);
  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        top: 70,
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
      }}
    >
      <LogoMark size={92} />
      <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 54, color: C.white, letterSpacing: "-0.01em" }}>QYLINE</span>
    </div>
  );
};

// ---------------------------------------------------------------- étiquettes
export const Stamp: React.FC<{
  delay: number;
  size?: number;
  bg?: string;
  color?: string;
  rotate?: number;
  shadow?: number;
  wrap?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, size = 36, bg = C.yellow, color = C.navy, rotate = -2, shadow = 7, wrap = false, children, style }) => {
  const p = usePop(delay, 11, 220);
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${size * 0.3}px ${size * 0.55}px`,
        background: bg,
        color,
        fontFamily: BODY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.12,
        borderRadius: 4,
        boxShadow: hard(shadow),
        whiteSpace: wrap ? "normal" : "nowrap",
        textAlign: "center",
        opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
        transform: `rotate(${rotate + (1 - p) * -8}deg) scale(${interpolate(p, [0, 1], [1.6, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Footnote: React.FC<{ delay: number; children: React.ReactNode; top: number; color?: string }> = ({ delay, children, top, color = C.muted }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top,
        textAlign: "center",
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: 25,
        lineHeight: 1.4,
        color,
        opacity: interpolate(frame, [delay, delay + 12], [0, 1], clamp),
      }}
    >
      {children}
    </div>
  );
};

export const CheckBox: React.FC<{ progress: number; size?: number; color?: string; bg?: string }> = ({ progress, size = 56, color = C.navy, bg = C.yellow }) => (
  <div
    style={{
      width: size,
      height: size,
      background: progress > 0 ? bg : "rgba(255,255,255,0.9)",
      border: `3px solid ${C.navy}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transform: `scale(${1 + 0.18 * Math.sin(Math.min(1, progress) * Math.PI)})`,
    }}
  >
    <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 24 24">
      <path
        d="M4.5 12.5l5 5L19.5 7"
        fill="none"
        stroke={color}
        strokeWidth={3.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={24}
        strokeDashoffset={24 * (1 - Math.min(1, progress))}
      />
    </svg>
  </div>
);

export const Badge: React.FC<{ ok: boolean; progress: number; size?: number }> = ({ ok, progress, size = 110 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: ok ? C.green : C.red,
      border: `5px solid ${C.white}`,
      boxShadow: hard(6),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: interpolate(progress, [0, 0.15], [0, 1], clamp),
      transform: `scale(${interpolate(progress, [0, 1], [0.3, 1])}) rotate(${(1 - progress) * -30}deg)`,
    }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">
      {ok ? <path d="M4.5 12.5l5 5L19.5 7" /> : <path d="M6 6l12 12M18 6L6 18" />}
    </svg>
  </div>
);

export const WarningIcon: React.FC<{ size: number; color?: string }> = ({ size, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round">
    <path d="M12 3L2 20h20L12 3z" />
    <path d="M12 10v4.5M12 17.2v.3" />
  </svg>
);

// ---------------------------------------------------------------- cadres d'appareils
export const BrowserFrame: React.FC<{ width: number; height: number; url: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  width,
  height,
  url,
  children,
  style,
}) => (
  <div style={{ width, height, background: C.white, border: `4px solid ${C.navy}`, borderRadius: 14, boxShadow: hard(14), overflow: "hidden", display: "flex", flexDirection: "column", ...style }}>
    <div style={{ height: 64, background: "#E8ECF6", borderBottom: `3px solid ${C.navy}`, display: "flex", alignItems: "center", gap: 12, padding: "0 20px", flexShrink: 0 }}>
      {["#E5484D", "#F5C518", "#22A06B"].map((c) => (
        <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c, border: `2px solid ${C.navy}` }} />
      ))}
      <div style={{ marginLeft: 14, flex: 1, height: 38, borderRadius: 19, background: C.white, border: `2px solid ${C.navy}`, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: BODY, fontSize: 22, fontWeight: 600, color: "#3A4466" }}>
        {url}
      </div>
    </div>
    <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>{children}</div>
  </div>
);

export const LaptopFrame: React.FC<{ width: number; screenHeight: number; children: React.ReactNode }> = ({ width, screenHeight, children }) => (
  <div style={{ width }}>
    <div style={{ padding: 16, borderRadius: 20, background: C.navy, boxShadow: hard(14, C.yellow) }}>
      <div style={{ height: screenHeight, borderRadius: 6, background: C.paper, overflow: "hidden", position: "relative" }}>{children}</div>
    </div>
    <div style={{ width: width + 100, height: 22, marginLeft: -50, marginTop: 4, borderRadius: "2px 2px 18px 18px", background: C.navy }} />
  </div>
);

export const PhoneFrame: React.FC<{ width: number; height: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ width, height, children, style }) => (
  <div style={{ width, height, padding: 14, borderRadius: 52, background: C.navy, boxShadow: hard(12), boxSizing: "border-box", ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 38, background: C.paper, overflow: "hidden", position: "relative" }}>
      {children}
      <div style={{ position: "absolute", top: 12, left: "50%", marginLeft: -50, width: 100, height: 26, borderRadius: 14, background: C.navy }} />
    </div>
  </div>
);

// Barres de texte abstraites (contenu de démonstration)
export const Lines: React.FC<{ widths: number[]; color?: string; h?: number; gap?: number }> = ({ widths, color = "#D3DAEB", h = 12, gap = 12 }) => (
  <div>
    {widths.map((w, i) => (
      <div key={i} style={{ width: `${w}%`, height: h, borderRadius: h / 2, background: color, marginBottom: gap }} />
    ))}
  </div>
);

// ---------------------------------------------------------------- sous-titres synchronisés
// Mots mis en évidence (en jaune) dans les sous-titres
const KEY_PHRASES = [
  "lourdes sanctions",
  "mentions légales obligatoires",
  "75 000 euros d'amende",
  "un an d'emprisonnement",
  "identité",
  "coordonnées",
  "informations d'immatriculation",
  "hébergeur",
  "facilement accessibles",
  "facilement accessible",
  "mentions légales",
  "pied de page",
  "qyline",
  "sites internet modernes",
  "informations légales",
  "dès aujourd'hui",
  "qyline.org",
];

export const Captions: React.FC = () => (
  <Subtitles words={VOICE.words} keyPhrases={KEY_PHRASES} top={1440} keyBg={C.yellow} keyColor={C.navy} shadow={C.navy} />
);
