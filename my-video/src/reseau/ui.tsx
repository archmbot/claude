// Charte et éléments graphiques du chapitre 1.1 (voir la partie D du scénario).
// Image de 1920 × 1080 ; (x, y) désigne toujours le centre d'un objet.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BODY, clamp } from "../qyline/shared";

export { clamp };
export const FONT = BODY;

export const C = {
  bg: "#0F172A",
  dot: "#1E293B",
  text: "#F8FAFC",
  muted: "#94A3B8",
  device: "#3B82F6",
  server: "#8B5CF6",
  net: "#14B8A6",
  copper: "#CBD5E1",
  fiber: "#22D3EE",
  wifi: "#F59E0B",
  data: "#F97316",
  internet: "#64748B",
  red: "#EF4444",
  green: "#22C55E",
  panel: "rgba(30,41,59,0.85)",
  line: "#334155",
};

export type Pt = [number, number];

// ------------------------------------------------------------------ animation
const easeOut = Easing.out(Easing.cubic);
export const prog = (f: number, at: number, dur = 10) => interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: easeOut });
export const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
// opacité d'un élément visible de `at` à `until` (fondu de 10 images)
export const vis = (f: number, at: number, until = Infinity) => prog(f, at) * (until === Infinity ? 1 : 1 - prog(f, until - 10));

// Groupe d'éléments d'un plan : apparaît et disparaît en fondu
export const Plan: React.FC<{ from: number; to?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ from, to = Infinity, children, style }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f > to + 1) return null;
  const o = interpolate(f, [from, from + 8], [0, 1], clamp) * (to === Infinity ? 1 : interpolate(f, [to - 8, to], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o, ...style }}>{children}</AbsoluteFill>;
};

// Élément centré en (x, y), qui apparaît avec une montée de 12 px
export const Pos: React.FC<{ x: number; y: number; at?: number; until?: number; children: React.ReactNode; style?: React.CSSProperties; dim?: number }> = ({
  x,
  y,
  at = 0,
  until = Infinity,
  children,
  style,
  dim = 1,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at);
  const o = vis(f, at, until);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) translateY(${(1 - p) * 12}px)`, opacity: o * dim, ...style }}>
      {children}
    </div>
  );
};

export const Txt: React.FC<{
  x: number;
  y: number;
  at?: number;
  until?: number;
  size?: number;
  weight?: number;
  color?: string;
  w?: number;
  align?: "center" | "left" | "right";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, at, until, size = 32, weight = 700, color = C.text, w, align = "center", children, style }) => (
  <Pos x={x} y={y} at={at} until={until}>
    <div style={{ width: w, fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: 1.2, textAlign: align, whiteSpace: w ? "normal" : "nowrap", ...style }}>{children}</div>
  </Pos>
);

export const Chip: React.FC<{ x: number; y: number; at?: number; until?: number; color?: string; size?: number; children: React.ReactNode; filled?: boolean }> = ({
  x,
  y,
  at,
  until,
  color = C.device,
  size = 28,
  children,
  filled = true,
}) => (
  <Pos x={x} y={y} at={at} until={until}>
    <div
      style={{
        padding: `${size * 0.3}px ${size * 0.7}px`,
        borderRadius: 999,
        background: filled ? color : "transparent",
        border: `3px solid ${color}`,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        color: filled ? "#0B1220" : color,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  </Pos>
);

export const Panel: React.FC<{ x: number; y: number; w: number; h: number; at?: number; until?: number; border?: string; children?: React.ReactNode; fill?: string }> = ({
  x,
  y,
  w,
  h,
  at,
  until,
  border = C.line,
  children,
  fill = C.panel,
}) => (
  <Pos x={x} y={y} at={at} until={until}>
    <div style={{ width: w, height: h, boxSizing: "border-box", borderRadius: 20, background: fill, border: `3px solid ${border}`, position: "relative" }}>{children}</div>
  </Pos>
);

// ------------------------------------------------------------------ icônes (repère 100 × 100)
export type IconKind =
  | "computer"
  | "laptop"
  | "phone"
  | "tablet"
  | "printer"
  | "server"
  | "switch"
  | "router"
  | "ap"
  | "box"
  | "cloud"
  | "console"
  | "tv"
  | "nas"
  | "board"
  | "rack"
  | "house"
  | "school"
  | "building"
  | "hospital"
  | "shop"
  | "car"
  | "usb"
  | "file"
  | "folder"
  | "mail"
  | "globe"
  | "shield"
  | "gear"
  | "wrench"
  | "lock"
  | "moon"
  | "photo"
  | "text"
  | "video"
  | "mouse"
  | "person"
  | "plug"
  | "socket"
  | "ont"
  | "bolt"
  | "disk"
  | "ups"
  | "key"
  | "refresh"
  | "pulse"
  | "headset";

export const Icon: React.FC<{ kind: IconKind; size?: number; color?: string; fill?: string }> = ({ kind, size = 140, color = C.device, fill = "none" }) => {
  const s = { fill: "none", stroke: color, strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const soft = { fill: color, fillOpacity: 0.16, stroke: color, strokeWidth: 5, strokeLinejoin: "round" as const };
  const solid = { fill: color, stroke: "none" };
  let body: React.ReactNode = null;
  switch (kind) {
    case "computer":
      body = (
        <>
          <rect x={8} y={12} width={84} height={56} rx={6} {...soft} />
          <path d="M50 68V82M32 86H68" {...s} />
        </>
      );
      break;
    case "laptop":
      body = (
        <>
          <rect x={18} y={20} width={64} height={44} rx={4} {...soft} />
          <path d="M6 72H94L86 82H14Z" {...s} />
        </>
      );
      break;
    case "phone":
      body = (
        <>
          <rect x={30} y={8} width={40} height={84} rx={9} {...soft} />
          <path d="M44 80H56" {...s} />
        </>
      );
      break;
    case "tablet":
      body = (
        <>
          <rect x={18} y={10} width={64} height={80} rx={8} {...soft} />
          <path d="M44 80H56" {...s} />
        </>
      );
      break;
    case "printer":
      body = (
        <>
          <rect x={28} y={10} width={44} height={26} rx={2} {...s} />
          <rect x={10} y={34} width={80} height={36} rx={7} {...soft} />
          <rect x={28} y={60} width={44} height={30} rx={2} fill={C.bg} stroke={color} strokeWidth={5} />
          <path d="M36 72H64M36 81H56" {...s} strokeWidth={3} />
        </>
      );
      break;
    case "server":
      body = (
        <>
          <rect x={26} y={6} width={48} height={88} rx={7} {...soft} />
          <path d="M37 24H63M37 38H63M37 52H63" {...s} />
          <circle cx={50} cy={76} r={5} {...solid} />
        </>
      );
      break;
    case "switch":
      body = (
        <>
          <rect x={4} y={30} width={92} height={40} rx={7} {...soft} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={13 + i * 13} y={46} width={8} height={9} rx={1.5} {...solid} />
          ))}
        </>
      );
      break;
    case "router":
      body = (
        <>
          <circle cx={50} cy={50} r={40} {...soft} />
          <path d="M22 50H40M34 44L40 50L34 56M78 50H60M66 44L60 50L66 56M50 22V38M44 28L50 22L56 28M50 78V62M44 72L50 78L56 72" {...s} strokeWidth={4.5} />
        </>
      );
      break;
    case "ap":
      body = (
        <>
          <ellipse cx={50} cy={74} rx={34} ry={11} {...soft} />
          <path d="M30 46Q50 28 70 46M20 34Q50 8 80 34" {...s} />
          <circle cx={50} cy={56} r={4} {...solid} />
        </>
      );
      break;
    case "box":
      body = (
        <>
          <rect x={10} y={40} width={80} height={40} rx={10} {...soft} />
          <path d="M28 40L22 16M72 40L78 16" {...s} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={28 + i * 12} cy={60} r={4} {...solid} />
          ))}
        </>
      );
      break;
    case "cloud":
      body = <path d="M26 78H76A18 18 0 0 0 78 42A24 24 0 0 0 32 36A21 21 0 0 0 26 78Z" {...soft} />;
      break;
    case "console":
      body = (
        <>
          <path d="M22 34H78A16 16 0 0 1 92 54L88 70A10 10 0 0 1 72 74L64 64H36L28 74A10 10 0 0 1 12 70L8 54A16 16 0 0 1 22 34Z" {...soft} />
          <path d="M28 46V58M22 52H34" {...s} />
          <circle cx={68} cy={48} r={4} {...solid} />
          <circle cx={76} cy={56} r={4} {...solid} />
        </>
      );
      break;
    case "tv":
      body = (
        <>
          <rect x={6} y={14} width={88} height={58} rx={5} {...soft} />
          <path d="M36 86H64M50 72V86" {...s} />
        </>
      );
      break;
    case "nas":
      body = (
        <>
          <rect x={24} y={12} width={52} height={76} rx={7} {...soft} />
          <rect x={33} y={24} width={34} height={14} rx={3} {...s} />
          <rect x={33} y={44} width={34} height={14} rx={3} {...s} />
          <circle cx={50} cy={74} r={4} {...solid} />
        </>
      );
      break;
    case "board":
      body = (
        <>
          <rect x={10} y={26} width={80} height={50} rx={5} {...soft} />
          <rect x={38} y={40} width={22} height={22} rx={2} {...s} />
          <path d="M18 34H30M18 44H30M70 34H82M70 44H82M70 54H82" {...s} strokeWidth={3} />
        </>
      );
      break;
    case "rack":
      body = (
        <>
          <rect x={18} y={6} width={64} height={88} rx={5} {...soft} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={26} y={14 + i * 19} width={48} height={13} rx={2} {...s} strokeWidth={3.5} />
              <circle cx={66} cy={20.5 + i * 19} r={2.5} {...solid} />
            </g>
          ))}
        </>
      );
      break;
    case "house":
      body = (
        <>
          <path d="M12 48L50 16L88 48V88H12Z" {...soft} />
          <path d="M42 88V64H58V88" {...s} />
        </>
      );
      break;
    case "school":
      body = (
        <>
          <path d="M10 88V44L50 22L90 44V88Z" {...soft} />
          <path d="M50 22V6L64 11L50 16M22 56H34M44 56H56M66 56H78M42 88V72H58V88" {...s} />
        </>
      );
      break;
    case "building":
      body = (
        <>
          <rect x={22} y={8} width={56} height={84} rx={3} {...soft} />
          {[0, 1, 2, 3].map((r) => (
            <path key={r} d={`M33 ${22 + r * 16}H43M57 ${22 + r * 16}H67`} {...s} />
          ))}
        </>
      );
      break;
    case "hospital":
      body = (
        <>
          <rect x={14} y={18} width={72} height={72} rx={5} {...soft} />
          <path d="M50 36V68M34 52H66" {...s} strokeWidth={8} />
        </>
      );
      break;
    case "shop":
      body = (
        <>
          <path d="M10 36L18 14H82L90 36Z" {...soft} />
          <path d="M16 36V88H84V36M40 88V62H60V88" {...s} />
        </>
      );
      break;
    case "car":
      body = (
        <>
          <path d="M8 66V52L20 48L32 28H66L80 48L92 52V66Z" {...soft} />
          <circle cx={28} cy={68} r={9} fill={C.bg} stroke={color} strokeWidth={5} />
          <circle cx={72} cy={68} r={9} fill={C.bg} stroke={color} strokeWidth={5} />
        </>
      );
      break;
    case "usb":
      body = (
        <>
          <rect x={30} y={30} width={40} height={62} rx={8} {...soft} />
          <rect x={38} y={8} width={24} height={22} rx={2} {...s} />
        </>
      );
      break;
    case "file":
      body = (
        <>
          <path d="M22 6H60L80 26V94H22Z" {...soft} />
          <path d="M60 6V26H80M34 46H68M34 60H68M34 74H56" {...s} />
        </>
      );
      break;
    case "folder":
      body = <path d="M8 24H40L48 34H92V84H8Z" {...soft} />;
      break;
    case "mail":
      body = (
        <>
          <rect x={8} y={22} width={84} height={56} rx={6} {...soft} />
          <path d="M10 26L50 56L90 26" {...s} />
        </>
      );
      break;
    case "globe":
      body = (
        <>
          <circle cx={50} cy={50} r={42} {...soft} />
          <ellipse cx={50} cy={50} rx={18} ry={42} {...s} />
          <path d="M10 50H90M16 30H84M16 70H84" {...s} strokeWidth={3.5} />
        </>
      );
      break;
    case "shield":
      body = <path d="M50 8L86 22V48C86 70 70 84 50 92C30 84 14 70 14 48V22Z" {...soft} />;
      break;
    case "gear":
      body = (
        <>
          <path d="M50 10V22M50 78V90M10 50H22M78 50H90M22 22L30 30M70 70L78 78M78 22L70 30M30 70L22 78" {...s} strokeWidth={9} />
          <circle cx={50} cy={50} r={26} {...soft} />
          <circle cx={50} cy={50} r={10} {...s} />
        </>
      );
      break;
    case "wrench":
      body = <path d="M62 10A22 22 0 0 0 52 46L14 84L22 92L60 54A22 22 0 0 0 92 40L78 50L64 42L62 26L72 14A22 22 0 0 0 62 10Z" {...soft} />;
      break;
    case "lock":
      body = (
        <>
          <rect x={20} y={44} width={60} height={46} rx={7} {...soft} />
          <path d="M32 44V30A18 18 0 0 1 68 30V44" {...s} />
        </>
      );
      break;
    case "moon":
      body = <path d="M62 10A40 40 0 1 0 90 66A32 32 0 1 1 62 10Z" {...soft} />;
      break;
    case "photo":
      body = (
        <>
          <rect x={8} y={18} width={84} height={64} rx={6} {...soft} />
          <path d="M14 76L40 48L58 66L70 54L88 72" {...s} />
          <circle cx={70} cy={36} r={7} {...solid} />
        </>
      );
      break;
    case "text":
      body = (
        <>
          <rect x={14} y={8} width={72} height={84} rx={6} {...soft} />
          <path d="M28 28H72M28 42H72M28 56H72M28 70H56" {...s} />
        </>
      );
      break;
    case "video":
      body = (
        <>
          <rect x={8} y={18} width={84} height={64} rx={8} {...soft} />
          <path d="M42 36L64 50L42 64Z" {...solid} />
        </>
      );
      break;
    case "mouse":
      body = (
        <>
          <rect x={28} y={8} width={44} height={84} rx={22} {...soft} />
          <path d="M50 8V36M28 36H72" {...s} />
        </>
      );
      break;
    case "person":
      body = (
        <>
          <circle cx={50} cy={30} r={18} {...soft} />
          <path d="M16 92A34 34 0 0 1 84 92Z" {...soft} />
        </>
      );
      break;
    case "plug":
      body = (
        <>
          <rect x={22} y={34} width={56} height={44} rx={5} {...soft} />
          <path d="M32 34V24H68V34M34 64V78M42 64V78M50 64V78M58 64V78M66 64V78M50 78V98" {...s} strokeWidth={3.5} />
        </>
      );
      break;
    case "socket":
      body = (
        <>
          <rect x={14} y={14} width={72} height={72} rx={10} {...soft} />
          <path d="M34 40H66V64H58V70H42V64H34Z" {...s} />
        </>
      );
      break;
    case "ont":
      body = (
        <>
          <rect x={18} y={30} width={64} height={44} rx={8} {...soft} />
          <circle cx={36} cy={52} r={6} {...solid} />
          <path d="M52 46H70M52 58H64" {...s} />
        </>
      );
      break;
    case "disk":
      body = (
        <>
          <rect x={16} y={10} width={68} height={80} rx={8} {...soft} />
          <circle cx={50} cy={44} r={20} {...s} />
          <circle cx={50} cy={44} r={4} {...solid} />
          <path d="M62 74L72 64" {...s} />
        </>
      );
      break;
    case "ups":
      body = (
        <>
          <rect x={20} y={12} width={60} height={78} rx={8} {...soft} />
          <path d="M54 24L40 50H52L46 74L62 44H50Z" fill={color} />
        </>
      );
      break;
    case "key":
      body = (
        <>
          <circle cx={32} cy={50} r={18} {...soft} />
          <path d="M50 50H90M78 50V64M88 50V60" {...s} />
        </>
      );
      break;
    case "refresh":
      body = <path d="M80 44A31 31 0 0 0 22 36M20 56A31 31 0 0 0 78 64M22 20V36H38M78 80V64H62" {...s} strokeWidth={7} />;
      break;
    case "pulse":
      body = (
        <>
          <rect x={8} y={18} width={84} height={64} rx={8} {...soft} />
          <path d="M16 52H34L42 34L52 68L60 46L66 52H84" {...s} />
        </>
      );
      break;
    case "headset":
      body = (
        <>
          <path d="M18 60V48A32 32 0 0 1 82 48V60" {...s} />
          <rect x={10} y={54} width={18} height={28} rx={6} {...soft} />
          <rect x={72} y={54} width={18} height={28} rx={6} {...soft} />
          <path d="M80 82Q80 92 62 92H54" {...s} />
        </>
      );
      break;
    case "bolt":
      body = <path d="M56 6L22 56H46L40 94L78 40H54Z" fill={color} stroke={color} strokeWidth={3} strokeLinejoin="round" />;
      break;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", display: "block" }} fill={fill}>
      {body}
    </svg>
  );
};

// Appareil avec son libellé (et éventuellement une seconde ligne)
export const Device: React.FC<{
  kind: IconKind;
  x: number;
  y: number;
  size?: number;
  color?: string;
  label?: React.ReactNode;
  sub?: React.ReactNode;
  at?: number;
  until?: number;
  dim?: number;
  glow?: number; // 0..1, halo autour de l'icône
  glowColor?: string;
  labelSize?: number;
}> = ({ kind, x, y, size = 140, color = C.device, label, sub, at, until, dim = 1, glow = 0, glowColor, labelSize = 28 }) => (
  <Pos x={x} y={y} at={at} until={until} dim={dim}>
    <div style={{ position: "relative", width: size, height: size }}>
      {glow > 0 && (
        <div
          style={{
            position: "absolute",
            inset: -size * 0.18,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${glowColor ?? color}55 0%, ${glowColor ?? color}00 70%)`,
            opacity: glow,
          }}
        />
      )}
      <Icon kind={kind} size={size} color={color} />
      {label && (
        <div style={{ position: "absolute", top: size + 6, left: "50%", transform: "translateX(-50%)", textAlign: "center", fontFamily: FONT, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: labelSize, fontWeight: 700, color: C.text }}>{label}</div>
          {sub && <div style={{ fontSize: labelSize * 0.8, fontWeight: 600, color: C.muted, marginTop: 2 }}>{sub}</div>}
        </div>
      )}
    </div>
  </Pos>
);

// ------------------------------------------------------------------ liaisons et données
const segLen = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

// Point situé à la fraction t (0..1) de la longueur d'une ligne brisée
export const along = (pts: Pt[], t: number): Pt => {
  const lens = pts.slice(1).map((p, i) => segLen(pts[i], p));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const k = lens[i] ? d / lens[i] : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
};

// Ligne brisée tronquée à la fraction t
const partial = (pts: Pt[], t: number): Pt[] => {
  if (t >= 1) return pts;
  const lens = pts.slice(1).map((p, i) => segLen(pts[i], p));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = t * total;
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < lens.length; i++) {
    if (d >= lens[i]) {
      out.push(pts[i + 1]);
      d -= lens[i];
    } else {
      const k = lens[i] ? d / lens[i] : 0;
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]);
      break;
    }
  }
  return out;
};

export type WireStyle = "copper" | "fiber" | "wifi" | "dashed" | "data";
const WIRE: Record<WireStyle, { color: string; dash?: string; width: number }> = {
  copper: { color: C.copper, width: 4 },
  fiber: { color: C.fiber, width: 4 },
  wifi: { color: C.wifi, dash: "10 10", width: 4 },
  dashed: { color: C.muted, dash: "8 10", width: 3 },
  data: { color: C.data, width: 4 },
};

// Liaison qui se trace progressivement (dur en images)
export const Wire: React.FC<{ pts: Pt[]; at?: number; dur?: number; until?: number; kind?: WireStyle; color?: string; width?: number; dim?: number; glow?: number }> = ({
  pts,
  at = 0,
  dur = 15,
  until = Infinity,
  kind = "copper",
  color,
  width,
  dim = 1,
  glow = 0,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const o = until === Infinity ? 1 : 1 - prog(f, until - 10);
  if (p <= 0 || o <= 0) return null;
  const st = WIRE[kind];
  const d = partial(pts, p)
    .map((q, i) => `${i ? "L" : "M"}${q[0]} ${q[1]}`)
    .join(" ");
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: o * dim }}>
      {glow > 0 && <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={(width ?? st.width) + 8} strokeLinecap="round" strokeLinejoin="round" opacity={0.35 * glow} />}
      <path d={d} fill="none" stroke={color ?? st.color} strokeWidth={width ?? st.width} strokeDasharray={st.dash} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Données qui circulent le long d'une ligne brisée, de `t0` à `t1` (images)
export const Packet: React.FC<{ pts: Pt[]; t0: number; t1: number; color?: string; size?: number; label?: React.ReactNode; hold?: number; children?: React.ReactNode; lost?: number }> = ({
  pts,
  t0,
  t1,
  color = C.data,
  size = 28,
  label,
  hold = 0,
  children,
  lost,
}) => {
  const f = useCurrentFrame();
  if (f < t0 || f > t1 + hold + 6) return null;
  const k = interpolate(f, [t0, t1], [0, 1], clamp);
  if (lost !== undefined && k >= lost) {
    // donnée perdue : petit éclair rouge puis disparition
    const fl = interpolate(f, [t0 + (t1 - t0) * lost, t0 + (t1 - t0) * lost + 8], [1, 0], clamp);
    if (fl <= 0) return null;
    const [lx, ly] = along(pts, lost);
    return (
      <div style={{ position: "absolute", left: lx, top: ly, transform: `translate(-50%, -50%) scale(${1 + (1 - fl)})`, opacity: fl }}>
        <Icon kind="bolt" size={size * 1.4} color={C.red} />
      </div>
    );
  }
  const [x, y] = along(pts, k);
  const o = interpolate(f, [t0, t0 + 4, t1 + hold, t1 + hold + 6], [0, 1, 1, hold ? 0 : 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity: o, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {children ?? (
        <div style={{ width: size, height: size, borderRadius: 6, background: color, boxShadow: `0 0 18px ${color}`, fontFamily: FONT, fontWeight: 800, fontSize: size * 0.55, color: "#0B1220", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {label}
        </div>
      )}
    </div>
  );
};

// Arcs Wi-Fi qui pulsent autour d'un point
export const WifiArcs: React.FC<{ x: number; y: number; at?: number; until?: number; r?: number; color?: string }> = ({ x, y, at = 0, until = Infinity, r = 160, color = C.wifi }) => {
  const f = useCurrentFrame();
  const o = vis(f, at, until);
  if (o <= 0) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      {[0, 1, 2].map((i) => {
        const k = ((f - at) / 45 + i / 3) % 1;
        return <circle key={i} cx={x} cy={y} r={r * (0.25 + 0.75 * k)} fill="none" stroke={color} strokeWidth={3} opacity={(1 - k) * 0.8} />;
      })}
    </svg>
  );
};

// Coche verte ou croix rouge qui se dessine
export const Mark: React.FC<{ x: number; y: number; at?: number; until?: number; size?: number; ok?: boolean }> = ({ x, y, at = 0, until, size = 60, ok = true }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 12);
  return (
    <Pos x={x} y={y} at={at} until={until}>
      <svg width={size} height={size} viewBox="0 0 60 60">
        <circle cx={30} cy={30} r={27} fill={ok ? C.green : C.red} />
        <path
          d={ok ? "M17 31L26 40L44 21" : "M20 20L40 40M40 20L20 40"}
          fill="none"
          stroke="#0B1220"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      </svg>
    </Pos>
  );
};

// Bulle de texte (message, demande)
export const Bubble: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = C.data, size = 26 }) => (
  <div style={{ padding: "8px 18px", borderRadius: 16, background: color, color: "#0B1220", fontFamily: FONT, fontWeight: 800, fontSize: size, whiteSpace: "nowrap", boxShadow: `0 0 20px ${color}66` }}>
    {children}
  </div>
);

// Cadre arrondi en pointillé (zone, réseau local)
export const Zone: React.FC<{ x: number; y: number; w: number; h: number; at?: number; until?: number; color?: string; label?: React.ReactNode; dash?: boolean; fill?: string }> = ({
  x,
  y,
  w,
  h,
  at,
  until,
  color = C.muted,
  label,
  dash = true,
  fill = "transparent",
}) => (
  <Pos x={x + w / 2} y={y + h / 2} at={at} until={until}>
    <div style={{ width: w, height: h, boxSizing: "border-box", borderRadius: 24, border: `3px ${dash ? "dashed" : "solid"} ${color}`, background: fill, position: "relative" }}>
      {label && <div style={{ position: "absolute", left: 22, top: 12, fontFamily: FONT, fontWeight: 700, fontSize: 24, color }}>{label}</div>}
    </div>
  </Pos>
);

// Fond bleu nuit avec une grille de points discrète
export const Background: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${C.dot} 2px, transparent 2.5px)`, backgroundSize: "40px 40px" }} />
  </AbsoluteFill>
);
