import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Img,
  continueRender,
  delayRender,
  random,
  staticFile,
} from "remotion";
import { HEIGHT, WIDTH } from "./timeline";
import {
  V3,
  View,
  circle,
  circuitTraces,
  courtLines,
  partial,
  seeded,
} from "./camera";

export const COLORS = {
  black: "#020308",
  blue: "#2F7BFF",
  electric: "#4FB2FF",
  ice: "#BFE3FF",
  violet: "#7B4DFF",
  metal: "#E8EEF5",
};
export const DISPLAY = '"Anton", Impact, sans-serif';
export const HUD = '"Orbitron", "Arial Black", sans-serif';

export type Player = {
  number: number;
  file: string;
  width: number;
  height: number;
  face: { x: number; y: number; w: number; h: number } | null;
};

const FONTS: [string, number, string][] = [
  ["Anton", 400, "anton-latin-400-normal.woff2"],
  ["Orbitron", 500, "orbitron-latin-500-normal.woff2"],
  ["Orbitron", 700, "orbitron-latin-700-normal.woff2"],
  ["Orbitron", 900, "orbitron-latin-900-normal.woff2"],
];

export const useFonts = () => {
  const [handle] = useState(() => delayRender("Polices BLACK U15"));
  useEffect(() => {
    Promise.all(
      FONTS.map(([family, weight, file]) =>
        new FontFace(family, `url(${staticFile(`black-u15/fonts/${file}`)})`, {
          weight: String(weight),
        })
          .load()
          .then((f) => document.fonts.add(f)),
      ),
    )
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

// Trait lumineux : halo large + cœur fin, sans filtre de flou (rapide en 4K)
export const GlowPath: React.FC<{
  d: string;
  color?: string;
  width?: number;
  opacity?: number;
  core?: string;
}> = ({
  d,
  color = COLORS.electric,
  width = 2,
  opacity = 1,
  core = COLORS.ice,
}) =>
  d ? (
    <g
      opacity={opacity}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} stroke={color} strokeWidth={width * 7} strokeOpacity={0.08} />
      <path d={d} stroke={color} strokeWidth={width * 3} strokeOpacity={0.25} />
      <path d={d} stroke={core} strokeWidth={width} />
    </g>
  ) : null;

// ---------------------------------------------------------------- ballon holographique
const rotate = (p: V3, ay: number, ax: number): V3 => {
  const [x, y, z] = p;
  const x1 = x * Math.cos(ay) + z * Math.sin(ay);
  const z1 = -x * Math.sin(ay) + z * Math.cos(ay);
  const y2 = y * Math.cos(ax) - z1 * Math.sin(ax);
  const z2 = y * Math.sin(ax) + z1 * Math.cos(ax);
  return [x1, y2, z2];
};
const sphereCurves = (): V3[][] => {
  const ring = (f: (a: number) => V3) =>
    Array.from({ length: 73 }, (_, i) => f((i / 72) * Math.PI * 2));
  const c = Math.cos(0.87);
  const s = Math.sin(0.87);
  return [
    ring((a) => [Math.cos(a), Math.sin(a), 0]),
    ring((a) => [Math.cos(a), 0, Math.sin(a)]),
    ring((a) => [s * Math.cos(a), s * Math.sin(a), c]),
    ring((a) => [s * Math.cos(a), s * Math.sin(a), -c]),
  ];
};
const SEAMS = sphereCurves();
const GRID: V3[][] = [
  ...Array.from({ length: 8 }, (_, k) => {
    const lon = (k / 8) * Math.PI;
    return Array.from({ length: 49 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2;
      return [
        Math.cos(a) * Math.cos(lon),
        Math.sin(a),
        Math.cos(a) * Math.sin(lon),
      ] as V3;
    });
  }),
  ...[-0.66, -0.33, 0.33, 0.66].map((y) =>
    Array.from({ length: 49 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2;
      const r = Math.sqrt(1 - y * y);
      return [r * Math.cos(a), y, r * Math.sin(a)] as V3;
    }),
  ),
];

// Sépare une courbe en parties avant / arrière (z > 0 = face à nous)
const curvePaths = (
  curve: V3[],
  cx: number,
  cy: number,
  r: number,
  ay: number,
  ax: number,
) => {
  let front = "";
  let back = "";
  let prevFront: boolean | null = null;
  for (const p of curve) {
    const q = rotate(p, ay, ax);
    const isFront = q[2] < 0;
    const pt = `${(cx + q[0] * r).toFixed(1)} ${(cy - q[1] * r).toFixed(1)}`;
    if (isFront) {
      front += (prevFront === true ? "L" : "M") + pt;
      if (prevFront === false) back += "L" + pt;
    } else {
      back += (prevFront === false ? "L" : "M") + pt;
      if (prevFront === true) front += "L" + pt;
    }
    prevFront = isFront;
  }
  return { front, back };
};

export const HoloBall: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rot: number;
  draw: number;
  opacity?: number;
}> = ({ cx, cy, r, rot, draw, opacity = 1 }) => {
  if (r <= 0.5) return null;
  const ax = 0.42;
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      <defs>
        <radialGradient id="hb-core">
          <stop offset="0%" stopColor="#7cc4ff" stopOpacity={0.35} />
          <stop offset="70%" stopColor="#1d5bd8" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#1d5bd8" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="hb-halo">
          <stop offset="0%" stopColor="#2f7bff" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#2f7bff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r * 2.6} fill="url(#hb-halo)" />
      <circle cx={cx} cy={cy} r={r} fill="url(#hb-core)" />
      <g strokeDasharray="1" strokeDashoffset={1 - draw}>
        {GRID.map((c, i) => {
          const { front, back } = curvePaths(c, cx, cy, r, rot, ax);
          return (
            <g key={`g${i}`} fill="none" stroke="#6fb8ff">
              <path
                d={back}
                strokeOpacity={0.08}
                strokeWidth={1}
                pathLength={1}
              />
              <path
                d={front}
                strokeOpacity={0.28}
                strokeWidth={1.2}
                pathLength={1}
              />
            </g>
          );
        })}
      </g>
      {SEAMS.map((c, i) => {
        const { front, back } = curvePaths(c, cx, cy, r, rot, ax);
        return (
          <g key={`s${i}`} strokeDasharray="1" strokeDashoffset={1 - draw}>
            <path
              d={back}
              fill="none"
              stroke="#3d8bff"
              strokeOpacity={0.3}
              strokeWidth={2}
              pathLength={1}
            />
            <path
              d={front}
              fill="none"
              stroke="#2f7bff"
              strokeOpacity={0.35}
              strokeWidth={10}
              pathLength={1}
            />
            <path
              d={front}
              fill="none"
              stroke="#d6efff"
              strokeWidth={2.6}
              pathLength={1}
            />
          </g>
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#9fd4ff"
        strokeOpacity={0.7 * draw}
        strokeWidth={2}
      />
    </svg>
  );
};

// ---------------------------------------------------------------- vrai ballon (scène 5)
export const Basketball: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rot: number;
}> = ({ cx, cy, r, rot }) => {
  if (r < 1) return null;
  const ax = 0.5;
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <radialGradient id="bb-skin" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#f39a4a" />
          <stop offset="45%" stopColor="#d0611f" />
          <stop offset="85%" stopColor="#7a2f0b" />
          <stop offset="100%" stopColor="#3a1505" />
        </radialGradient>
        <radialGradient id="bb-rim" cx="80%" cy="15%" r="90%">
          <stop offset="60%" stopColor="#4fb2ff" stopOpacity={0} />
          <stop offset="100%" stopColor="#4fb2ff" stopOpacity={0.75} />
        </radialGradient>
        <pattern
          id="bb-pebble"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform={`scale(${Math.max(1, r / 260)})`}
        >
          <circle cx="3" cy="3" r="1.3" fill="#000" fillOpacity={0.18} />
        </pattern>
        <clipPath id="bb-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="url(#bb-skin)" />
      <g clipPath="url(#bb-clip)">
        <rect
          x={cx - r}
          y={cy - r}
          width={r * 2}
          height={r * 2}
          fill="url(#bb-pebble)"
        />
        {SEAMS.map((c, i) => {
          const { front } = curvePaths(c, cx, cy, r, rot, ax);
          return (
            <path
              key={i}
              d={front}
              fill="none"
              stroke="#1a0b04"
              strokeWidth={Math.max(2, r * 0.035)}
              strokeLinecap="round"
            />
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="url(#bb-rim)" />
      <ellipse
        cx={cx - r * 0.32}
        cy={cy - r * 0.38}
        rx={r * 0.28}
        ry={r * 0.16}
        fill="#fff"
        fillOpacity={0.18}
        transform={`rotate(-30 ${cx - r * 0.32} ${cy - r * 0.38})`}
      />
    </svg>
  );
};

// ---------------------------------------------------------------- sol : terrain et circuits
const COURT = courtLines();
export const TRACES = circuitTraces();

export const Floor: React.FC<{
  view: View;
  court: number; // intensité des lignes du terrain 0..1
  circuits: number; // progression des circuits 0..1 (puis reste allumé)
  pulse?: number; // impulsion lumineuse 0..1
  extra?: React.ReactNode;
}> = ({ view, court, circuits, pulse = 0, extra }) => (
  <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
    {court > 0 &&
      COURT.map((l, i) => (
        <GlowPath
          key={i}
          d={view.path(l)}
          width={1.6}
          opacity={court}
          color={COLORS.blue}
          core="#9fcfff"
        />
      ))}
    {circuits > 0 &&
      TRACES.map((t, i) => {
        const p = Math.max(
          0,
          Math.min(1, (circuits - t.delay) / (1 - t.delay)),
        );
        if (p <= 0) return null;
        const pts = partial(t.pts, p);
        const tip = pts[pts.length - 1];
        const s = view.project(tip);
        return (
          <g key={`t${i}`}>
            <GlowPath
              d={view.path(pts)}
              width={1.3}
              opacity={0.75 + pulse * 0.25}
              color={i % 5 === 0 ? COLORS.violet : COLORS.electric}
            />
            {s && (
              <circle
                cx={s.x}
                cy={s.y}
                r={Math.max(1.5, s.scale * 0.06)}
                fill="#dff3ff"
                opacity={0.9}
              />
            )}
          </g>
        );
      })}
    {extra}
  </svg>
);

// Anneau holographique au sol sous un joueur
export const Ring: React.FC<{
  view: View;
  at: V3;
  t: number;
  power: number;
}> = ({ view, at, t, power }) => {
  if (power <= 0) return null;
  const grow = Math.min(1, power * 1.4);
  const r1 = 0.55 * (0.3 + 0.7 * grow);
  const dashes = Array.from({ length: 12 }, (_, i) => {
    const a = t * 1.6 + (i / 12) * Math.PI * 2;
    return view.path(
      circle(at[0], at[2], 0.78 * (0.4 + 0.6 * grow), 6, 0.005, a, a + 0.32),
    );
  });
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{ position: "absolute", inset: 0 }}
    >
      <GlowPath
        d={view.path(circle(at[0], at[2], r1, 64, 0.005))}
        width={2.4}
        opacity={power}
      />
      <GlowPath
        d={view.path(circle(at[0], at[2], r1 * 0.72, 48, 0.005))}
        width={1}
        opacity={power * 0.6}
        color={COLORS.violet}
      />
      {dashes.map((d, i) => (
        <GlowPath key={i} d={d} width={1.6} opacity={power * 0.85} />
      ))}
    </svg>
  );
};

// Particules lumineuses qui montent autour d'un point
export const Particles: React.FC<{
  view: View;
  at: V3;
  t: number;
  count?: number;
  radius?: number;
  opacity?: number;
  seed?: number;
}> = ({ view, at, t, count = 40, radius = 1.2, opacity = 1, seed = 1 }) => {
  if (opacity <= 0) return null;
  const r = seeded(seed * 97 + 13);
  const dots = Array.from({ length: count }, () => {
    const a = r() * Math.PI * 2;
    const d = 0.35 + r() * radius;
    const speed = 0.15 + r() * 0.35;
    const y = (r() * 2.4 + t * speed) % 2.4;
    const p = view.project([
      at[0] + Math.cos(a) * d,
      y,
      at[2] + Math.sin(a) * d,
    ]);
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (2 + r() * 3) + a));
    // pas de particule collée à l'objectif (elle deviendrait une grosse tache)
    return p && p.depth > 1.4
      ? {
          ...p,
          tw,
          size: 0.012 + r() * 0.02,
          fade: Math.sin((y / 2.4) * Math.PI),
        }
      : null;
  });
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {dots.map((d, i) =>
        d ? (
          <g key={i} opacity={d.tw * d.fade}>
            <circle
              cx={d.x}
              cy={d.y}
              r={Math.min(12, Math.max(2, d.size * d.scale * 3))}
              fill={COLORS.blue}
              opacity={0.25}
            />
            <circle
              cx={d.x}
              cy={d.y}
              r={Math.min(4, Math.max(0.8, d.size * d.scale))}
              fill="#e6f5ff"
            />
          </g>
        ) : null,
      )}
    </svg>
  );
};

// ---------------------------------------------------------------- joueur
// Les effets sont des copies de la photo détourée (même alpha) avec filtres et masques en
// dégradé : pas de masque CSS par URL, dont Remotion n'attendrait pas le chargement.
export const PlayerSprite: React.FC<{
  p: Player;
  x: number; // centre des pieds (écran)
  y: number;
  h: number; // hauteur affichée en px
  light?: number; // 0 = silhouette en contre-jour, 1 = éclairé
  rim?: number; // liseré bleu
  sweep?: number; // position du balayage lumineux 0..1 (hors plage = aucun)
  reveal?: number; // apparition holographique de bas en haut 0..1
  opacity?: number;
  reflect?: number; // reflet sur le parquet brillant 0..1
}> = ({
  p,
  x,
  y,
  h,
  light = 1,
  rim = 1,
  sweep = -1,
  reveal = 1,
  opacity = 1,
  reflect = 0.22,
}) => {
  if (h < 2 || opacity <= 0) return null;
  const w = (h * p.width) / p.height;
  const src = staticFile(`black-u15/players/${p.file}`);
  const k = Math.max(0.4, h / 700);
  const cut = (1 - reveal) * 100;
  const layer = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  } as const;
  const sweepPos = sweep * 160 - 30;
  const grade = `brightness(${0.08 + 0.8 * light}) contrast(${1.14 - 0.04 * light}) saturate(${0.35 + 0.5 * light})`;
  return (
    <>
      {/* ombre de contact et reflet sur le parquet */}
      <div
        style={{
          position: "absolute",
          left: x - w * 0.75,
          top: y - h * 0.03,
          width: w * 1.5,
          height: h * 0.06,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 70%)",
          opacity: opacity * reveal,
        }}
      />
      {reflect > 0 && (
        <div
          style={{
            position: "absolute",
            left: x - w / 2,
            top: y - h * 0.015,
            width: w,
            height: h * 0.45,
            opacity: opacity * reflect * reveal,
            overflow: "hidden",
            WebkitMaskImage:
              "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
          }}
        >
          <Img
            src={src}
            style={{
              width: w,
              height: h,
              transform: "scaleY(-1)",
              transformOrigin: "50% 0",
              filter: `${grade} blur(${1.5 * k}px)`,
            }}
          />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: x - w / 2,
          top: y - h,
          width: w,
          height: h,
          opacity,
          isolation: "isolate",
          clipPath: reveal < 1 ? `inset(${cut}% -50% -10% -50%)` : undefined,
        }}
      >
        <Img
          src={src}
          style={{
            ...layer,
            filter: `${grade} drop-shadow(0 0 ${2.5 * k}px rgba(140,205,255,${rim})) drop-shadow(0 0 ${12 * k}px rgba(47,123,255,${rim * 0.75}))`,
          }}
        />
        {/* lumière d'appoint bleue à gauche, violette à droite */}
        <Img
          src={src}
          style={{
            ...layer,
            filter:
              "sepia(1) hue-rotate(178deg) saturate(3.2) brightness(0.95)",
            mixBlendMode: "overlay",
            opacity: (0.35 + 0.35 * light) * (light > 0.02 ? 1 : 0),
            WebkitMaskImage:
              "linear-gradient(100deg, #000 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 62%)",
            maskImage:
              "linear-gradient(100deg, #000 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 62%)",
          }}
        />
        <Img
          src={src}
          style={{
            ...layer,
            filter: "sepia(1) hue-rotate(218deg) saturate(2.6) brightness(0.9)",
            mixBlendMode: "overlay",
            opacity: 0.25 + 0.2 * light,
            WebkitMaskImage:
              "linear-gradient(100deg, rgba(0,0,0,0) 48%, #000 100%)",
            maskImage: "linear-gradient(100deg, rgba(0,0,0,0) 48%, #000 100%)",
          }}
        />
        {sweep >= 0 && sweep <= 1 && (
          <Img
            src={src}
            style={{
              ...layer,
              filter: "brightness(2.4) saturate(0.25)",
              mixBlendMode: "screen",
              opacity: 0.8,
              WebkitMaskImage: `linear-gradient(105deg, rgba(0,0,0,0) ${sweepPos - 14}%, #000 ${sweepPos}%, rgba(0,0,0,0) ${sweepPos + 14}%)`,
              maskImage: `linear-gradient(105deg, rgba(0,0,0,0) ${sweepPos - 14}%, #000 ${sweepPos}%, rgba(0,0,0,0) ${sweepPos + 14}%)`,
            }}
          />
        )}
        {reveal < 1 && (
          <div
            style={{
              position: "absolute",
              left: "-20%",
              right: "-20%",
              top: `${cut}%`,
              height: Math.max(2, 3 * k),
              background:
                "linear-gradient(90deg, rgba(79,178,255,0), #dff3ff, rgba(79,178,255,0))",
              boxShadow: `0 0 ${18 * k}px ${4 * k}px rgba(79,178,255,0.8)`,
            }}
          />
        )}
      </div>
    </>
  );
};

// Faisceau de lumière volumétrique vertical
export const Beam: React.FC<{
  x: number;
  topW: number;
  bottomW: number;
  bottomY: number;
  opacity: number;
  color?: string;
}> = ({ x, topW, bottomW, bottomY, opacity, color = "79,150,255" }) =>
  opacity > 0 ? (
    <div
      style={{
        position: "absolute",
        left: x - bottomW / 2,
        top: -40,
        width: bottomW,
        height: bottomY + 40,
        opacity,
        clipPath: `polygon(${50 - (topW / bottomW) * 50}% 0, ${50 + (topW / bottomW) * 50}% 0, 100% 100%, 0 100%)`,
        background: `linear-gradient(180deg, rgba(${color},0.55) 0%, rgba(${color},0.18) 55%, rgba(${color},0.04) 100%)`,
        mixBlendMode: "screen",
      }}
    />
  ) : null;

// Nappes de fumée au sol, ancrées dans le monde
export const Fog: React.FC<{
  view: View;
  spots: { at: V3; w: number; img: number; drift: number }[];
  t: number;
  opacity: number;
}> = ({ view, spots, t, opacity }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "screen" }}>
    {spots
      .map((s) => ({
        s,
        p: view.project([
          s.at[0] + Math.sin(t * 0.25 + s.drift) * 0.6 + t * 0.08 * s.drift,
          0.35,
          s.at[2],
        ]),
      }))
      .filter((o) => o.p && o.p.depth > 2.5 && o.p.depth < 60)
      .sort((a, b) => (b.p?.depth ?? 0) - (a.p?.depth ?? 0))
      .map(({ s, p }, i) => {
        if (!p) return null;
        const w = s.w * p.scale;
        if (w < 20 || w > WIDTH * 2.5) return null;
        return (
          <Img
            key={i}
            src={staticFile(`black-u15/fog${s.img}.png`)}
            style={{
              position: "absolute",
              left: p.x - w / 2,
              top: p.y - w * 0.2,
              width: w,
              height: w * 0.4,
              opacity: 0.55,
            }}
          />
        );
      })}
  </AbsoluteFill>
);

// ---------------------------------------------------------------- titres
export const MetalText: React.FC<{
  text: string;
  size: number;
  font?: string;
  spacing?: string;
  glow?: number;
  depth?: number;
  sweep?: number;
}> = ({
  text,
  size,
  font = DISPLAY,
  spacing = "0.03em",
  glow = 1,
  depth = 10,
  sweep = -1,
}) => {
  const ext = Array.from(
    { length: depth },
    (_, i) => `0 ${i + 1}px 0 hsl(220, 45%, ${22 - i * 1.4}%)`,
  ).join(", ");
  const base = {
    fontFamily: font,
    fontSize: size,
    letterSpacing: spacing,
    lineHeight: 1,
    whiteSpace: "nowrap",
  } as const;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          ...base,
          color: "#1a2748",
          textShadow: `${ext}, 0 0 ${size * 0.18}px rgba(47,123,255,${0.85 * glow}), 0 0 ${size * 0.45}px rgba(47,123,255,${0.5 * glow})`,
        }}
      >
        {text}
      </div>
      <div
        style={{
          ...base,
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #ffffff 0%, #dfe7f2 30%, #8090a8 50%, #f4f8fd 58%, #aab6c8 80%, #6f7c92 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {text}
      </div>
      {sweep >= 0 && sweep <= 1 && (
        <div
          style={{
            ...base,
            position: "absolute",
            inset: 0,
            background: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep * 140 - 35}%, rgba(255,255,255,0.95) ${sweep * 140 - 20}%, rgba(170,220,255,0) ${sweep * 140 - 5}%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        />
      )}
    </div>
  );
};

// Arcs électriques autour d'un rectangle (changent toutes les 2 images)
export const Arcs: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  frame: number;
  opacity: number;
}> = ({ x, y, w, h, frame, opacity }) => {
  if (opacity <= 0) return null;
  const seed = Math.floor(frame / 2);
  const arcs = Array.from({ length: 5 }, (_, i) => {
    const side = Math.floor(random(`side-${seed}-${i}`) * 4);
    const start = random(`s-${seed}-${i}`);
    const len = 0.08 + random(`l-${seed}-${i}`) * 0.18;
    const pts: string[] = [];
    for (let k = 0; k <= 10; k++) {
      const u = start + (len * k) / 10;
      const j = (random(`j-${seed}-${i}-${k}`) - 0.5) * 26;
      const [px, py] =
        side === 0
          ? [x + u * w, y + j]
          : side === 1
            ? [x + u * w, y + h + j]
            : side === 2
              ? [x + j, y + u * h]
              : [x + w + j, y + u * h];
      pts.push(`${k ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    return pts.join("");
  });
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {arcs.map((d, i) => (
        <GlowPath
          key={i}
          d={d}
          width={1.6}
          color={i % 2 ? COLORS.violet : COLORS.electric}
        />
      ))}
    </svg>
  );
};

// ---------------------------------------------------------------- finitions
export const Grain: React.FC<{ frame: number; opacity?: number }> = ({
  frame,
  opacity = 0.07,
}) => (
  <AbsoluteFill
    style={{ overflow: "hidden", mixBlendMode: "overlay", opacity }}
  >
    <Img
      src={staticFile("black-u15/grain.jpg")}
      style={{
        position: "absolute",
        left: -Math.floor(random(`gx${frame}`) * 128),
        top: -Math.floor(random(`gy${frame}`) * 128),
        width: WIDTH + 128,
        height: HEIGHT + 128,
      }}
    />
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.75,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

export const Letterbox: React.FC<{ amount: number }> = ({ amount }) => {
  const bar = 138 * amount;
  return bar > 0.5 ? (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: bar,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: bar,
          background: "#000",
        }}
      />
    </>
  ) : null;
};

export const Flash: React.FC<{ amount: number; color?: string }> = ({
  amount,
  color = "220,238,255",
}) =>
  amount > 0.001 ? (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,${amount}) 0%, rgba(${color},${amount}) 45%, rgba(47,123,255,${amount * 0.85}) 100%)`,
      }}
    />
  ) : null;
