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
import {
  BEAT,
  BRAND,
  COLORS,
  EXTRA_PLANS,
  FIRST_BEAT,
  HITS,
  LAST_BEAT,
  LEGAL,
  PLANS,
  SCENES,
  SERVICES,
} from "./data";

const HEAD = '"Bricolage Grotesque", "Plus Jakarta Sans", Arial, sans-serif';
const BODY = '"Plus Jakarta Sans", Arial, sans-serif';
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const hard = (n: number, c: string = COLORS.navy) => `${n}px ${n}px 0 ${c}`;

// ---------------------------------------------------------------- helpers
const FONTS: [string, number, string][] = [
  ["Bricolage Grotesque", 600, "bricolage-grotesque-latin-600-normal.woff2"],
  ["Bricolage Grotesque", 800, "bricolage-grotesque-latin-800-normal.woff2"],
  ["Plus Jakarta Sans", 400, "plus-jakarta-sans-latin-400-normal.woff2"],
  ["Plus Jakarta Sans", 600, "plus-jakarta-sans-latin-600-normal.woff2"],
  ["Plus Jakarta Sans", 700, "plus-jakarta-sans-latin-700-normal.woff2"],
  ["Plus Jakarta Sans", 800, "plus-jakarta-sans-latin-800-normal.woff2"],
];

const useFonts = () => {
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

const useSpring = (delay: number, damping = 14, stiffness = 160) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

// Ligne de texte qui surgit derrière un masque
const Rise: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
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
const Tag: React.FC<{
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
const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  if (frame < at - 10 || frame > at + 10) return null;
  const p = interpolate(frame, [at - 9, at + 9], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const w = width * 1.6;
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
const SceneIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

const LogoCard: React.FC<{ size: number }> = ({ size }) => (
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

// ---------------------------------------------------------------- scène 1
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  // Le logo chute vers l'écran et se pose pile sur le premier temps (image 15)
  const fall = interpolate(frame, [2, 15], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const settle = frame >= 15 ? Math.exp(-(frame - 15) / 4) * Math.sin((frame - 15) * 1.3) : 0;
  const letters = BRAND.name.split("");
  const chips = ["Sites web", "Logiciels métier", "Assistance informatique"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
        <div
          style={{
            opacity: interpolate(frame, [2, 6], [0, 1], clamp),
            transform: `scale(${interpolate(fall, [0, 1], [3.4, 1]) + settle * 0.08}) rotate(${interpolate(fall, [0, 1], [-28, -4])}deg)`,
          }}
        >
          <LogoCard size={220} />
        </div>
        <div style={{ display: "flex", overflow: "hidden", paddingBottom: 10 }}>
          {letters.map((l, i) => {
            const p = spring({ frame: frame - 16 - i * 2, fps: 30, config: { damping: 14, stiffness: 200 } });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontFamily: BODY,
                  fontWeight: 800,
                  fontSize: 200,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: COLORS.white,
                  transform: `translateY(${(1 - p) * 110}%)`,
                }}
              >
                {l}
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 56 }}>
        <Tag delay={30} size={58} rotate={-2} shadow={9}>
          {BRAND.tagline}
        </Tag>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 52 }}>
        {chips.map((c, i) => {
          const p = spring({ frame: frame - 44 - i * 3, fps: 30, config: { damping: 16, stiffness: 200 } });
          return (
            <React.Fragment key={c}>
              {i > 0 && <div style={{ width: 12, height: 12, borderRadius: 6, background: COLORS.yellow, opacity: p }} />}
              <span
                style={{
                  fontFamily: BODY,
                  fontWeight: 700,
                  fontSize: 34,
                  color: COLORS.white,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30}px)`,
                }}
              >
                {c}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

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

const Laptop: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ width: 760 }}>
    <div style={{ padding: 14, borderRadius: 18, background: COLORS.navy, boxShadow: hard(16, COLORS.yellow) }}>
      <div style={{ width: 720, height: 430, overflow: "hidden", borderRadius: 6, background: COLORS.paper }}>
        <DesktopSite scroll={scroll} />
      </div>
    </div>
    <div style={{ width: 860, height: 20, marginLeft: -50, marginTop: 4, borderRadius: "2px 2px 18px 18px", background: COLORS.navy }} />
  </div>
);

const Phone: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ width: 246, padding: 12, borderRadius: 40, background: COLORS.navy, boxShadow: hard(12, COLORS.yellow) }}>
    <div style={{ width: 222, height: 470, overflow: "hidden", borderRadius: 30, background: COLORS.paper, position: "relative" }}>
      <PhoneSite scroll={scroll} />
      <div style={{ position: "absolute", top: 8, left: 76, width: 70, height: 18, borderRadius: 10, background: COLORS.navy }} />
    </div>
  </div>
);

// ---------------------------------------------------------------- scène 2
const Highlight: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
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

const WebScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [30, 112], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const laptop = useSpring(6, 15, 120);
  const phone = useSpring(16, 13, 140);
  const h = { fontFamily: HEAD, fontWeight: 800, fontSize: 86, lineHeight: 1.02, color: COLORS.white, whiteSpace: "nowrap" } as const;
  const points = ["Design moderne et soigné", "Affichage adapté aux mobiles", "Parcours de contact simple"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 190, width: 820 }}>
        <Tag delay={2} size={26}>
          Planche A — Création de sites web
        </Tag>
        <div style={{ marginTop: 34 }}>
          <Rise delay={5}>
            <div style={h}>Un site</div>
          </Rise>
          <Rise delay={9}>
            <div style={h}>
              <Highlight delay={24}>professionnel,</Highlight>
            </div>
          </Rise>
          <Rise delay={13}>
            <div style={h}>moderne et adapté</div>
          </Rise>
          <Rise delay={17}>
            <div style={h}>aux mobiles.</div>
          </Rise>
        </div>
        <div style={{ marginTop: 40 }}>
          {points.map((t, i) => {
            const p = spring({ frame: frame - 36 - i * 6, fps: 30, config: { damping: 15, stiffness: 200 } });
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
                <div style={{ width: 40, height: 40, background: COLORS.yellow, boxShadow: hard(4), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.navy} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </div>
                <span style={{ fontFamily: BODY, fontSize: 34, fontWeight: 700, color: COLORS.white }}>{t}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 250,
          opacity: interpolate(laptop, [0, 0.15], [0, 1], clamp),
          transform: `translate(${(1 - laptop) * 700}px, ${Math.sin(frame / 20) * 6}px) rotate(${(1 - laptop) * 8}deg)`,
        }}
      >
        <Laptop scroll={scroll} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1650,
          top: 430,
          opacity: interpolate(phone, [0, 0.15], [0, 1], clamp),
          transform: `translate(${(1 - phone) * 120}px, ${(1 - phone) * 600 + Math.cos(frame / 18) * 8}px) rotate(${(1 - phone) * -10 + 3}deg)`,
        }}
      >
        <Phone scroll={scroll} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scène 3
const Icon: React.FC<{ kind: "site" | "code" | "support"; progress: number }> = ({ kind, progress }) => {
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

const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const tilt = [-1.5, 1, -1];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ marginTop: 74, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Tag delay={2} size={26}>
          Nos prestations
        </Tag>
        <Rise delay={5} style={{ marginTop: 20 }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 88, lineHeight: 1.02, color: COLORS.white }}>Une solution pour chaque projet</div>
        </Rise>
      </div>
      <div style={{ display: "flex", gap: 44, marginTop: 56 }}>
        {SERVICES.map((s, i) => {
          const p = spring({ frame: frame - 10 - i * 5, fps: 30, config: { damping: 14, stiffness: 150 } });
          const draw = interpolate(frame, [20 + i * 5, 45 + i * 5], [0, 1], clamp);
          // Chaque carte s'illumine sur un temps de la musique
          const hl = 60 + i * 15;
          const on = interpolate(frame, [hl, hl + 4, hl + 15, hl + 19], [0, 1, 1, i === 2 ? 1 : 0], clamp);
          return (
            <div
              key={s.title}
              style={{
                position: "relative",
                width: 540,
                height: 600,
                boxSizing: "border-box",
                padding: "36px 40px",
                background: on > 0.5 ? COLORS.yellow : COLORS.white,
                border: `3px solid ${COLORS.navy}`,
                borderRadius: 6,
                boxShadow: hard(12 + on * 8),
                transform: `translateY(${(1 - p) * 700 - on * 18}px) rotate(${tilt[i] * (1 - on) + (1 - p) * 12}deg)`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 92, height: 92, background: on > 0.5 ? COLORS.white : COLORS.yellow, border: `3px solid ${COLORS.navy}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon kind={s.icon} progress={draw} />
                </div>
                <div style={{ fontFamily: BODY, fontSize: 20, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.blue }}>{s.plate}</div>
              </div>
              <div style={{ marginTop: 28, fontFamily: HEAD, fontSize: 46, fontWeight: 800, lineHeight: 1.05, color: COLORS.navy, minHeight: 98 }}>{s.title}</div>
              <div style={{ marginTop: 10, fontFamily: BODY, fontSize: 26, lineHeight: 1.35, color: "#3A4466", minHeight: 72 }}>{s.text}</div>
              <div style={{ marginTop: 22 }}>
                {s.bullets.map((b, j) => (
                  <div
                    key={b}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 12,
                      opacity: interpolate(frame, [28 + i * 5 + j * 4, 34 + i * 5 + j * 4], [0, 1], clamp),
                    }}
                  >
                    <div style={{ width: 13, height: 13, background: on > 0.5 ? COLORS.navy : COLORS.yellow, border: `2px solid ${COLORS.navy}` }} />
                    <span style={{ fontFamily: BODY, fontSize: 26, fontWeight: 700, color: COLORS.navy }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scène 4
const PricingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [40, 180], [1, 1.035], clamp);
  // Les cartes tombent sur les croches de la musique (11,0 / 11,25 / 11,5 / 11,75 s)
  const drops = [15, 22.5, 30, 37.5];
  const badge = spring({ frame: frame - 57, fps: 30, config: { damping: 10, stiffness: 260 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", transform: `scale(${zoom})` }}>
      <div style={{ marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Tag delay={2} size={26}>
          Offres &amp; tarifs
        </Tag>
        <Rise delay={5} style={{ marginTop: 18 }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 84, lineHeight: 1.02, color: COLORS.white }}>Des tarifs clairs, sans surprise</div>
        </Rise>
      </div>
      <div style={{ display: "flex", gap: 34, marginTop: 66 }}>
        {PLANS.map((pl, i) => {
          const p = spring({ frame: frame - (drops[i] - 4), fps: 30, config: { damping: 12, stiffness: 230 } });
          const count = interpolate(frame, [drops[i], drops[i] + 14], [0, pl.from], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <div
              key={pl.name}
              style={{
                position: "relative",
                width: 408,
                height: 410,
                boxSizing: "border-box",
                padding: "40px 34px 30px",
                background: pl.featured ? COLORS.yellow : COLORS.white,
                border: `3px solid ${COLORS.navy}`,
                borderRadius: 6,
                boxShadow: hard(pl.featured ? 16 : 12),
                opacity: interpolate(p, [0, 0.1], [0, 1], clamp),
                transform: `translateY(${(1 - p) * -500}px) rotate(${(1 - p) * (i % 2 ? 10 : -10)}deg) scale(${pl.featured ? 1.05 : 1})`,
              }}
            >
              {pl.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -28,
                    right: -18,
                    padding: "10px 20px",
                    background: COLORS.navy,
                    color: COLORS.yellow,
                    fontFamily: HEAD,
                    fontWeight: 800,
                    fontSize: 26,
                    whiteSpace: "nowrap",
                    boxShadow: hard(6, COLORS.white),
                    opacity: interpolate(badge, [0, 0.15], [0, 1], clamp),
                    transform: `rotate(${4 + (1 - badge) * 14}deg) scale(${interpolate(badge, [0, 1], [2.2, 1])})`,
                  }}
                >
                  {pl.badge}
                </div>
              )}
              <div style={{ fontFamily: BODY, fontSize: 20, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: pl.featured ? COLORS.navy : COLORS.blue }}>{pl.ref}</div>
              <div style={{ marginTop: 14, fontFamily: HEAD, fontSize: 42, fontWeight: 800, lineHeight: 1.05, whiteSpace: "pre-line", color: COLORS.navy }}>{pl.name}</div>
              <div style={{ position: "absolute", left: 34, right: 34, bottom: 30, display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontFamily: BODY, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>dès</span>
                <span style={{ fontFamily: HEAD, fontSize: 124, fontWeight: 800, lineHeight: 1, color: COLORS.navy, fontVariantNumeric: "tabular-nums" }}>{Math.round(count)}</span>
                <span style={{ fontFamily: HEAD, fontSize: 64, fontWeight: 800, color: COLORS.navy }}>€</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 34, marginTop: 52 }}>
        {[
          { label: EXTRA_PLANS.software.label, value: `dès ${EXTRA_PLANS.software.from} €`, d: 75 },
          { label: EXTRA_PLANS.custom.label, value: EXTRA_PLANS.custom.note, d: 79 },
        ].map((row) => {
          const p = spring({ frame: frame - row.d, fps: 30, config: { damping: 14, stiffness: 200 } });
          return (
            <div
              key={row.label}
              style={{
                width: 850,
                boxSizing: "border-box",
                padding: "22px 34px",
                background: COLORS.navy,
                boxShadow: hard(8, COLORS.yellow),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                opacity: p,
                transform: `translateY(${(1 - p) * 80}px)`,
              }}
            >
              <span style={{ fontFamily: BODY, fontSize: 32, fontWeight: 700, color: COLORS.white }}>{row.label}</span>
              <span style={{ fontFamily: HEAD, fontSize: 42, fontWeight: 800, color: COLORS.yellow }}>{row.value}</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 44,
          fontFamily: BODY,
          fontSize: 24,
          fontWeight: 600,
          color: COLORS.muted,
          opacity: interpolate(frame, [88, 96], [0, 1], clamp),
        }}
      >
        {LEGAL}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scène 5
const MAIL_ICON = "M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 7l9 6 9-6";
const PHONE_ICON = "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z";

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useSpring(0, 12, 260);
  const words = ["Donnez", "vie", "à", "votre", "projet"];
  // Le bouton pulse sur les temps puis s'illumine sur l'accord final (image 555)
  const beatPulse = [30, 45].reduce((acc, b) => acc + (frame >= b ? Math.exp(-(frame - b) / 3) : 0), 0);
  const final = frame >= 60 ? Math.exp(-(frame - 60) / 6) : 0;
  const btn = useSpring(22, 11, 220);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${interpolate(logo, [0, 1], [2.6, 1])}) rotate(${-4 + (1 - logo) * -20}deg)`, opacity: interpolate(logo, [0, 0.1], [0, 1], clamp) }}>
        <LogoCard size={130} />
      </div>
      <div style={{ display: "flex", gap: 26, marginTop: 40 }}>
        {words.map((w, i) => {
          const p = spring({ frame: frame - 2 - i * 2, fps: 30, config: { damping: 13, stiffness: 240 } });
          return (
            <span
              key={w}
              style={{
                fontFamily: HEAD,
                fontWeight: 800,
                fontSize: 116,
                lineHeight: 1,
                color: COLORS.white,
                display: "inline-block",
                opacity: interpolate(p, [0, 0.1], [0, 1], clamp),
                transform: `scale(${interpolate(p, [0, 1], [1.8, 1])})`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ marginTop: 34 }}>
        <Tag delay={12} size={104} rotate={-2.5} shadow={12} font={BODY}>
          avec QYLINE
        </Tag>
      </div>
      <div
        style={{
          marginTop: 56,
          padding: "20px 64px",
          background: final > 0.3 ? COLORS.yellow : COLORS.navy,
          color: final > 0.3 ? COLORS.navy : COLORS.white,
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: 66,
          boxShadow: hard(10, final > 0.3 ? COLORS.navy : COLORS.yellow),
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: interpolate(btn, [0, 0.1], [0, 1], clamp),
          transform: `translateY(${(1 - btn) * 120}px) scale(${1 + beatPulse * 0.035 + final * 0.06})`,
        }}
      >
        {BRAND.site}
        <span style={{ fontSize: 60 }}>→</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 70, marginTop: 50 }}>
        {[
          { d: MAIL_ICON, text: BRAND.email, delay: 30 },
          { d: PHONE_ICON, text: BRAND.phone, delay: 34 },
        ].map((c) => {
          const p = spring({ frame: frame - c.delay, fps: 30, config: { damping: 15, stiffness: 200 } });
          return (
            <div key={c.text} style={{ display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
              <div style={{ width: 52, height: 52, background: COLORS.yellow, boxShadow: hard(4), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={COLORS.navy} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d={c.d} />
                </svg>
              </div>
              <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 38, color: COLORS.white }}>{c.text}</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 38,
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 28,
          color: COLORS.muted,
          opacity: interpolate(frame, [40, 48], [0, 1], clamp),
        }}
      >
        Devis gratuit et sans engagement · {BRAND.baseline}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- racine
const SCENE_COMPONENTS: [keyof typeof SCENES, React.FC][] = [
  ["intro", Intro],
  ["web", WebScene],
  ["services", ServicesScene],
  ["pricing", PricingScene],
  ["outro", Outro],
];

export const QylineAd: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const shake = useShake();
  return (
    <AbsoluteFill style={{ background: COLORS.blue }}>
      <Html5Audio src={staticFile("qyline-audio.wav")} />
      <Background />
      <AbsoluteFill style={{ transform: shake }}>
        {SCENE_COMPONENTS.map(([key, Scene]) => (
          <Sequence key={key} from={SCENES[key].from} durationInFrames={SCENES[key].duration} premountFor={30}>
            <SceneIn>
              <Scene />
            </SceneIn>
          </Sequence>
        ))}
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
