// Éléments communs aux versions horizontale (16:9) et verticale (9:16) de la pub QYLINE.
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Html5Audio,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEAT, COLORS, FIRST_BEAT, HITS, LAST_BEAT, SCENES } from "./data";

export const HEAD = '"Bricolage Grotesque", "Plus Jakarta Sans", Arial, sans-serif';
export const BODY = '"Plus Jakarta Sans", Arial, sans-serif';
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const hard = (n: number, c: string = COLORS.navy) => `${n}px ${n}px 0 ${c}`;

// ---------------------------------------------------------------- helpers
const FONTS: [string, number, string][] = [
  ["Bricolage Grotesque", 600, "bricolage-grotesque-latin-600-normal.woff2"],
  ["Bricolage Grotesque", 800, "bricolage-grotesque-latin-800-normal.woff2"],
  ["Plus Jakarta Sans", 400, "plus-jakarta-sans-latin-400-normal.woff2"],
  ["Plus Jakarta Sans", 600, "plus-jakarta-sans-latin-600-normal.woff2"],
  ["Plus Jakarta Sans", 700, "plus-jakarta-sans-latin-700-normal.woff2"],
  ["Plus Jakarta Sans", 800, "plus-jakarta-sans-latin-800-normal.woff2"],
];

export const useFonts = () => {
  const [handle] = useState(() => delayRender("Chargement des polices"));
  useEffect(() => {
    Promise.all(
      FONTS.map(([family, weight, file]) =>
        new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {
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

export const useSpring = (delay: number, damping = 14, stiffness = 160) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

// Ligne de texte qui surgit derrière un masque
export const Rise: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  children,
  style,
}) => {
  const p = useSpring(delay, 16, 180);
  return (
    <div style={{ overflow: "hidden", paddingBottom: 6, ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)` }}>{children}</div>
    </div>
  );
};

// Étiquette jaune façon qyline.org, qui tombe comme un tampon
export const Tag: React.FC<{
  delay: number;
  size?: number;
  rotate?: number;
  shadow?: number;
  font?: string;
  children: React.ReactNode;
}> = ({ delay, size = 28, rotate = -2, shadow = 6, font = HEAD, children }) => {
  const p = useSpring(delay, 11, 220);
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${size * 0.32}px ${size * 0.6}px`,
        background: COLORS.yellow,
        color: COLORS.navy,
        fontFamily: font,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        borderRadius: 4,
        boxShadow: hard(shadow),
        whiteSpace: "nowrap",
        opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
        transform: `rotate(${rotate + (1 - p) * -8}deg) scale(${interpolate(p, [0, 1], [1.6, 1])})`,
      }}
    >
      {children}
    </div>
  );
};

// ------------------------------------------------------------- background
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const since = (frame - FIRST_BEAT) % BEAT;
  const pulse = frame >= FIRST_BEAT && frame < LAST_BEAT ? Math.exp(-since / 4) : 0;
  const line = `rgba(51, 82, 161, ${0.75 + pulse * 0.25})`;
  return (
    <AbsoluteFill style={{ background: COLORS.blue }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${line} 2px, transparent 2px), linear-gradient(90deg, ${line} 2px, transparent 2px)`,
          backgroundSize: "72px 72px",
          backgroundPosition: `${-frame * 0.6}px ${-frame * 0.3}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(75% 75% at 50% 45%, rgba(36,69,154,0) 45%, rgba(18,26,51,${0.45 - pulse * 0.08}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ transitions
// Volet diagonal : bande jaune + corps marine, qui masque la coupe.
export const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (frame < at - 10 || frame > at + 10) return null;
  const p = interpolate(frame, [at - 9, at + 9], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  // assez large pour couvrir l'écran malgré l'inclinaison, même en 9:16
  const w = Math.max(width * 1.6, width + height * 0.6);
  const left = interpolate(p, [0, 1], [-w, width]);
  const stripe = 70;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, bottom: -60, left, width: w, transform: "skewX(-14deg)", background: COLORS.yellow }} />
      <div
        style={{
          position: "absolute",
          top: -60,
          bottom: -60,
          left: left + stripe,
          width: w - stripe * 2,
          transform: "skewX(-14deg)",
          background: COLORS.navy,
        }}
      />
    </AbsoluteFill>
  );
};

// Petit « coup de zoom » à l'entrée de chaque scène
export const SceneIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const p = useSpring(0, 20, 170);
  return (
    <AbsoluteFill style={{ transform: `scale(${interpolate(p, [0, 1], [1.12, 1])})` }}>{children}</AbsoluteFill>
  );
};

const useShake = () => {
  const frame = useCurrentFrame();
  let x = 0;
  let y = 0;
  for (const h of HITS) {
    const d = frame - h;
    if (d >= 0 && d < 12) {
      const a = 16 * Math.exp(-d / 3);
      x += a * Math.sin(d * 2.9 + h);
      y += a * Math.cos(d * 3.7 + h);
    }
  }
  return `translate(${x}px, ${y}px)`;
};

export const LogoCard: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      background: COLORS.white,
      borderRadius: size * 0.16,
      border: `4px solid ${COLORS.navy}`,
      boxShadow: hard(size * 0.06),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Img src={staticFile("logo-q.png")} style={{ width: size * 0.74, height: size * 0.684 }} />
  </div>
);

// ------------------------------------------------------- maquettes de site
const DesktopSite: React.FC<{ scroll: number }> = ({ scroll }) => {
  const bar = (w: number, bg: string, h = 8) => (
    <div style={{ width: w, height: h, borderRadius: 2, background: bg, marginBottom: 9 }} />
  );
  return (
    <div style={{ width: 720, background: COLORS.paper, transform: `translateY(${-scroll * 300}px)`, fontFamily: BODY }}>
      <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", background: COLORS.blue }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: COLORS.yellow }} />
          <span style={{ fontFamily: HEAD, fontSize: 16, fontWeight: 800, color: COLORS.white }}>Atelier Nova</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {[38, 46, 34].map((w, i) => (
            <div key={i} style={{ width: w, height: 6, borderRadius: 2, background: "rgba(255,255,255,0.6)" }} />
          ))}
          <div style={{ padding: "6px 12px", background: COLORS.yellow, color: COLORS.navy, fontSize: 11, fontWeight: 800, boxShadow: hard(3) }}>Devis</div>
        </div>
      </div>
      <div
        style={{
          height: 262,
          padding: "46px 34px",
          background: COLORS.blue,
          backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "inline-block", padding: "4px 10px", background: COLORS.yellow, fontSize: 11, fontWeight: 800, color: COLORS.navy, boxShadow: hard(3), transform: "rotate(-2deg)" }}>
          Artisan local
        </div>
        <div style={{ marginTop: 14, fontFamily: HEAD, fontSize: 44, fontWeight: 800, lineHeight: 1, color: COLORS.white, whiteSpace: "pre-line" }}>
          {"Votre activité,\nmise en valeur."}
        </div>
        <div style={{ marginTop: 18, display: "inline-block", padding: "9px 18px", background: COLORS.yellow, color: COLORS.navy, fontSize: 13, fontWeight: 800, boxShadow: hard(4) }}>
          Demander un devis
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, padding: "28px 34px" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, height: 160, background: COLORS.white, border: `2px solid ${COLORS.navy}`, boxShadow: hard(5, i === 1 ? COLORS.yellow : COLORS.navy), padding: 16, boxSizing: "border-box" }}>
            <div style={{ width: 34, height: 34, background: i === 1 ? COLORS.yellow : COLORS.blue, marginBottom: 14 }} />
            {bar(110, COLORS.navy, 10)}
            {bar(140, "#D3DAEB")}
            {bar(96, "#D3DAEB")}
          </div>
        ))}
      </div>
      <div style={{ margin: "0 34px 28px", height: 110, background: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
        <div style={{ fontFamily: HEAD, fontSize: 24, fontWeight: 800, color: COLORS.white }}>Parlons de votre projet</div>
        <div style={{ padding: "9px 16px", background: COLORS.yellow, color: COLORS.navy, fontSize: 12, fontWeight: 800 }}>Nous contacter</div>
      </div>
    </div>
  );
};

const PhoneSite: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ width: 222, background: COLORS.paper, transform: `translateY(${-scroll * 230}px)`, fontFamily: BODY }}>
    <div style={{ height: 52, background: COLORS.blue, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 14px 10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 14, height: 14, borderRadius: 3, background: COLORS.yellow }} />
        <span style={{ fontFamily: HEAD, fontSize: 13, fontWeight: 800, color: COLORS.white }}>Atelier Nova</span>
      </div>
      <div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 16, height: 2, background: COLORS.white, marginBottom: 3 }} />
        ))}
      </div>
    </div>
    <div
      style={{
        background: COLORS.blue,
        backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
        padding: "26px 16px 26px",
      }}
    >
      <div style={{ fontFamily: HEAD, fontSize: 28, fontWeight: 800, color: COLORS.white, lineHeight: 1, whiteSpace: "pre-line" }}>{"Votre activité,\nmise en valeur."}</div>
      <div style={{ marginTop: 16, display: "inline-block", padding: "7px 14px", background: COLORS.yellow, color: COLORS.navy, fontSize: 11, fontWeight: 800, boxShadow: hard(3) }}>
        Demander un devis
      </div>
    </div>
    <div style={{ padding: 14 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 92, background: COLORS.white, border: `2px solid ${COLORS.navy}`, boxShadow: hard(4), padding: 12, marginBottom: 14, boxSizing: "border-box" }}>
          <div style={{ width: 26, height: 26, background: i === 1 ? COLORS.yellow : COLORS.blue, marginBottom: 10 }} />
          <div style={{ width: 90, height: 8, background: COLORS.navy, marginBottom: 7 }} />
          <div style={{ width: 130, height: 6, background: "#D3DAEB" }} />
        </div>
      ))}
    </div>
  </div>
);

export const Laptop: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ width: 760 }}>
    <div style={{ padding: 14, borderRadius: 18, background: COLORS.navy, boxShadow: hard(16, COLORS.yellow) }}>
      <div style={{ width: 720, height: 430, overflow: "hidden", borderRadius: 6, background: COLORS.paper }}>
        <DesktopSite scroll={scroll} />
      </div>
    </div>
    <div style={{ width: 860, height: 20, marginLeft: -50, marginTop: 4, borderRadius: "2px 2px 18px 18px", background: COLORS.navy }} />
  </div>
);

export const Phone: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ width: 246, padding: 12, borderRadius: 40, background: COLORS.navy, boxShadow: hard(12, COLORS.yellow) }}>
    <div style={{ width: 222, height: 470, overflow: "hidden", borderRadius: 30, background: COLORS.paper, position: "relative" }}>
      <PhoneSite scroll={scroll} />
      <div style={{ position: "absolute", top: 8, left: 76, width: 70, height: 18, borderRadius: 10, background: COLORS.navy }} />
    </div>
  </div>
);

export const Highlight: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <span style={{ position: "relative", display: "inline-block", color: p > 0.45 ? COLORS.navy : COLORS.white }}>
      <span
        style={{
          position: "absolute",
          left: -12,
          right: -12,
          top: 8,
          bottom: 0,
          background: COLORS.yellow,
          boxShadow: hard(8),
          transform: `scaleX(${p}) rotate(-1.5deg)`,
          transformOrigin: "left center",
        }}
      />
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
};

export const Icon: React.FC<{ kind: "site" | "code" | "support"; progress: number }> = ({ kind, progress }) => {
  const common = {
    fill: "none",
    stroke: COLORS.navy,
    strokeWidth: 3.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeDasharray: 200,
    strokeDashoffset: 200 * (1 - progress),
  } as const;
  return (
    <svg width="58" height="58" viewBox="0 0 48 48">
      {kind === "site" && (
        <>
          <rect x="5" y="9" width="38" height="30" rx="3" {...common} />
          <path d="M5 18h38M12 26h12M12 32h8" {...common} />
        </>
      )}
      {kind === "code" && <path d="M17 14L7 24l10 10M31 14l10 10-10 10M27 10l-6 28" {...common} />}
      {kind === "support" && (
        <>
          <rect x="6" y="9" width="36" height="24" rx="3" {...common} />
          <path d="M17 41h14M24 33v8M20 16l8 7-4 1 2 5" {...common} />
        </>
      )}
    </svg>
  );
};

export const MAIL_ICON = "M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 7l9 6 9-6";
export const PHONE_ICON = "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z";


// ---------------------------------------------------------------- cadre
export type SceneMap = Record<keyof typeof SCENES, React.FC>;
const ORDER = ["intro", "web", "services", "pricing", "outro"] as const;

// Fond, musique, enchaînement des scènes, transitions et barre de progression
export const AdFrame: React.FC<{ scenes: SceneMap }> = ({ scenes }) => {
  useFonts();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const shake = useShake();
  return (
    <AbsoluteFill style={{ background: COLORS.blue }}>
      <Html5Audio src={staticFile("qyline-audio.wav")} />
      <Background />
      <AbsoluteFill style={{ transform: shake }}>
        {ORDER.map((key) => {
          const Scene = scenes[key];
          return (
            <Sequence key={key} from={SCENES[key].from} durationInFrames={SCENES[key].duration} premountFor={30}>
              <SceneIn>
                <Scene />
              </SceneIn>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {[SCENES.web.from, SCENES.services.from, SCENES.pricing.from, SCENES.outro.from].map((b) => (
        <Wipe key={b} at={b} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 10,
          width: `${(frame / (durationInFrames - 1)) * 100}%`,
          background: COLORS.yellow,
        }}
      />
    </AbsoluteFill>
  );
};
