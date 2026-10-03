import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
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
  BRAND,
  COLORS,
  EXTRA_PLANS,
  LEGAL,
  PLANS,
  RUNNING_COSTS,
  SCENES,
  SERVICES,
} from "./data";

const FONT = '"Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif';
const GRADIENT = `linear-gradient(135deg, ${COLORS.violet}, ${COLORS.blue})`;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------- helpers
const useFonts = () => {
  const [handle] = useState(() => delayRender("Chargement des polices"));
  useEffect(() => {
    const weights = [400, 600, 700, 800];
    Promise.all(
      weights.map((w) =>
        new FontFace(
          "Plus Jakarta Sans",
          `url(${staticFile(`fonts/plus-jakarta-sans-latin-${w}-normal.woff2`)})`,
          { weight: String(w) },
        )
          .load()
          .then((f) => document.fonts.add(f)),
      ),
    )
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

const useIn = (delay = 0, config: { damping?: number; stiffness?: number; mass?: number } = { damping: 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

const Pop: React.FC<{
  delay?: number;
  y?: number;
  x?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, y = 40, x = 0, style, children }) => {
  const p = useIn(delay, { damping: 18, stiffness: 110 });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 1], [0, 1], clamp),
        transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ------------------------------------------------------------- background
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const orbs = [
    { x: 260, y: 220, r: 760, c: COLORS.violetDeep, s: 0.8, o: 0.42 },
    { x: 1640, y: 880, r: 860, c: COLORS.blue, s: 0.6, o: 0.38 },
    { x: 1500, y: 140, r: 480, c: COLORS.violet, s: 1.1, o: 0.22 },
  ];
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 120% at 20% 0%, ${COLORS.bg2} 0%, ${COLORS.bg} 60%)`,
        overflow: "hidden",
      }}
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: o.x + Math.sin((frame / 70) * o.s + i * 2) * 90 - o.r / 2,
            top: o.y + Math.cos((frame / 85) * o.s + i) * 70 - o.r / 2,
            width: o.r,
            height: o.r,
            borderRadius: "50%",
            background: o.c,
            filter: "blur(150px)",
            opacity: o.o,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          backgroundPosition: `${-(frame * 0.4) % 96}px ${-(frame * 0.2) % 96}px`,
          maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
        }}
      />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ transitions
const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  if (frame < at - 16 || frame > at + 16) return null;
  const p = interpolate(frame, [at - 15, at + 15], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const w = width * 1.5;
  const left = interpolate(p, [0, 1], [-w, width]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -40,
          bottom: -40,
          left,
          width: w,
          transform: "skewX(-14deg)",
          background: `linear-gradient(100deg, ${COLORS.violetDeep}, ${COLORS.blue} 70%, ${COLORS.cyan})`,
          boxShadow: "0 0 120px rgba(0,102,255,0.6)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scène 1
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 80 } });
  const reveal = interpolate(frame, [6, 40], [0, 100], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const pulse = 1 + Math.sin(frame / 14) * 0.04;
  const letters = BRAND.name.split("");
  const words = BRAND.tagline.split(" ");
  const chips = ["Sites web", "Logiciels sur mesure", "Assistance informatique"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{ position: "relative", width: 300, height: 278, marginBottom: 22 }}>
        <div
          style={{
            position: "absolute",
            inset: -70,
            borderRadius: "50%",
            background: GRADIENT,
            filter: "blur(70px)",
            opacity: 0.45 * logo,
            transform: `scale(${pulse})`,
          }}
        />
        <Img
          src={staticFile("logo-q.png")}
          style={{
            position: "relative",
            width: 300,
            height: 278,
            opacity: logo,
            transform: `scale(${interpolate(logo, [0, 1], [0.55, 1])}) rotate(${interpolate(logo, [0, 1], [-14, 0])}deg)`,
            clipPath: `circle(${reveal}% at 50% 50%)`,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {letters.map((l, i) => {
          const p = spring({ frame: frame - 30 - i * 3, fps, config: { damping: 16, stiffness: 140 } });
          return (
            <span
              key={i}
              style={{
                fontSize: 128,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: COLORS.text,
                opacity: p,
                transform: `translateY(${(1 - p) * 50}px)`,
                display: "inline-block",
              }}
            >
              {l}
            </span>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 26 }}>
        {words.map((w, i) => {
          const p = spring({ frame: frame - 62 - i * 5, fps, config: { damping: 20, stiffness: 120 } });
          return (
            <span
              key={i}
              style={{
                fontSize: 58,
                fontWeight: 600,
                color: i >= words.length - 2 ? "#9ec5ff" : COLORS.text,
                opacity: p,
                transform: `translateY(${(1 - p) * 30}px)`,
                filter: `blur(${(1 - p) * 8}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 52 }}>
        {chips.map((c, i) => (
          <Pop key={c} delay={100 + i * 6} y={20}>
            <div
              style={{
                padding: "12px 26px",
                borderRadius: 999,
                border: "1.5px solid rgba(158,197,255,0.35)",
                background: "rgba(255,255,255,0.06)",
                color: COLORS.muted,
                fontSize: 28,
                fontWeight: 600,
              }}
            >
              {c}
            </div>
          </Pop>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------- maquettes de site
const DesktopSite: React.FC<{ scroll: number }> = ({ scroll }) => {
  const bar = (w: number, o = 0.22, h = 8, bg = "#fff") => (
    <div style={{ width: w, height: h, borderRadius: h, background: bg, opacity: o, marginBottom: 8 }} />
  );
  return (
    <div style={{ width: 720, background: "#f6f8ff", transform: `translateY(${-scroll * 330}px)`, fontFamily: FONT }}>
      <div style={{ height: 46, display: "flex", alignItems: "center", padding: "0 28px", background: "#fff", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: GRADIENT }} />
          <span style={{ fontSize: 15, fontWeight: 800, color: "#141a40" }}>Atelier Nova</span>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {[40, 48, 36].map((w, i) => (
            <div key={i} style={{ width: w, height: 7, borderRadius: 4, background: "#c4cbe8" }} />
          ))}
          <div style={{ padding: "6px 14px", borderRadius: 8, background: GRADIENT, color: "#fff", fontSize: 11, fontWeight: 700 }}>Contact</div>
        </div>
      </div>
      <div style={{ height: 270, background: `linear-gradient(120deg, ${COLORS.violetDeep}, ${COLORS.blue})`, padding: "52px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, top: -50, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.14)" }} />
        <div style={{ position: "absolute", right: 90, top: 120, width: 150, height: 150, borderRadius: 32, background: "rgba(255,255,255,0.2)", transform: "rotate(18deg)" }} />
        <div style={{ fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1.1, whiteSpace: "pre-line" }}>{"Votre activité,\nmise en valeur."}</div>
        <div style={{ marginTop: 18 }}>{bar(300, 0.5)}{bar(240, 0.5)}</div>
        <div style={{ marginTop: 14, display: "inline-block", padding: "10px 22px", borderRadius: 999, background: "#fff", color: COLORS.violetDeep, fontSize: 13, fontWeight: 800 }}>Demander un devis</div>
      </div>
      <div style={{ display: "flex", gap: 16, padding: "30px 40px" }}>
        {[COLORS.violet, COLORS.blue, COLORS.cyan].map((c, i) => (
          <div key={i} style={{ flex: 1, height: 170, borderRadius: 14, background: "#fff", boxShadow: "0 6px 20px rgba(60,70,160,0.12)", padding: 18 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: c, marginBottom: 16, opacity: 0.9 }} />
            {bar(110, 1, 10, "#1a2150")}
            {bar(140, 1, 7, "#d3d8ee")}
            {bar(100, 1, 7, "#d3d8ee")}
          </div>
        ))}
      </div>
      <div style={{ margin: "0 40px 30px", height: 120, borderRadius: 18, background: "#141a40", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Parlons de votre projet</div>
        <div style={{ padding: "10px 20px", borderRadius: 999, background: GRADIENT, color: "#fff", fontSize: 12, fontWeight: 800 }}>Nous contacter</div>
      </div>
    </div>
  );
};

const PhoneSite: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ width: 222, background: "#f6f8ff", transform: `translateY(${-scroll * 250}px)`, fontFamily: FONT }}>
    <div style={{ height: 40, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 16, height: 16, borderRadius: 5, background: GRADIENT }} />
        <span style={{ fontSize: 12, fontWeight: 800, color: "#141a40" }}>Atelier Nova</span>
      </div>
      <div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 16, height: 2, background: "#141a40", marginBottom: 3, borderRadius: 2 }} />
        ))}
      </div>
    </div>
    <div style={{ background: `linear-gradient(150deg, ${COLORS.violetDeep}, ${COLORS.blue})`, padding: "32px 18px 28px" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.1, whiteSpace: "pre-line" }}>{"Votre activité,\nmise en valeur."}</div>
      <div style={{ marginTop: 16, display: "inline-block", padding: "8px 16px", borderRadius: 999, background: "#fff", color: COLORS.violetDeep, fontSize: 11, fontWeight: 800 }}>Demander un devis</div>
    </div>
    <div style={{ padding: 14 }}>
      {[COLORS.violet, COLORS.blue, COLORS.cyan].map((c, i) => (
        <div key={i} style={{ height: 96, borderRadius: 12, background: "#fff", boxShadow: "0 4px 14px rgba(60,70,160,0.12)", padding: 14, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 9, background: c, marginBottom: 12 }} />
          <div style={{ width: 90, height: 8, borderRadius: 4, background: "#1a2150", marginBottom: 7 }} />
          <div style={{ width: 130, height: 6, borderRadius: 4, background: "#d3d8ee" }} />
        </div>
      ))}
    </div>
  </div>
);

const Laptop: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ width: 760 }}>
    <div style={{ padding: 14, borderRadius: 24, background: "#1a2150", border: "2px solid rgba(255,255,255,0.18)", boxShadow: "0 50px 120px rgba(0,60,255,0.35)" }}>
      <div style={{ width: 720, height: 430, overflow: "hidden", borderRadius: 10, background: "#f6f8ff" }}>
        <DesktopSite scroll={scroll} />
      </div>
    </div>
    <div style={{ width: 860, height: 18, marginLeft: -50, borderRadius: "0 0 24px 24px", background: "linear-gradient(#2a3270, #141a40)" }} />
  </div>
);

const Phone: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ width: 246, padding: 12, borderRadius: 44, background: "#1a2150", border: "2px solid rgba(255,255,255,0.22)", boxShadow: "0 40px 100px rgba(106,27,234,0.5)" }}>
    <div style={{ width: 222, height: 470, overflow: "hidden", borderRadius: 32, background: "#f6f8ff", position: "relative" }}>
      <PhoneSite scroll={scroll} />
      <div style={{ position: "absolute", top: 8, left: 74, width: 74, height: 18, borderRadius: 10, background: "#0a0e26" }} />
    </div>
  </div>
);

// ---------------------------------------------------------------- scène 2
const WebScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [30, 130], [0, 0.85], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const laptop = useIn(8, { damping: 16, stiffness: 70 });
  const phone = useIn(22, { damping: 14, stiffness: 80 });
  const points = ["Design moderne et soigné", "Affichage adapté aux mobiles", "Parcours de contact simple"];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 110, top: 250, width: 800 }}>
        <Pop delay={0} y={20}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.2em", color: "#9ec5ff", textTransform: "uppercase" }}>Création de sites web</div>
        </Pop>
        <Pop delay={8} y={40}>
          <div style={{ marginTop: 22, fontSize: 82, fontWeight: 800, lineHeight: 1.06, color: COLORS.text }}>
            Un site{" "}
            <span style={{ background: "linear-gradient(90deg,#a78bfa,#38bdf8)", WebkitBackgroundClip: "text", color: "transparent" }}>professionnel</span>
            , moderne et adapté aux mobiles
          </div>
        </Pop>
        <div style={{ marginTop: 44 }}>
          {points.map((t, i) => (
            <Pop key={t} delay={40 + i * 10} x={-40} y={0}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </div>
                <span style={{ fontSize: 36, fontWeight: 600, color: "#e6ebff" }}>{t}</span>
              </div>
            </Pop>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 940,
          top: 250,
          opacity: laptop,
          transform: `translate(${(1 - laptop) * 160}px, ${Math.sin(frame / 26) * 6}px) rotate(${(1 - laptop) * 3}deg)`,
        }}
      >
        <Laptop scroll={scroll} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1640,
          top: 440,
          opacity: phone,
          transform: `translate(${(1 - phone) * 120}px, ${(1 - phone) * 80 + Math.cos(frame / 22) * 7}px)`,
        }}
      >
        <Phone scroll={scroll} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scène 3
const Icon: React.FC<{ kind: "site" | "code" | "support"; progress: number }> = ({ kind, progress }) => {
  const dash = { strokeDasharray: 200, strokeDashoffset: 200 * (1 - progress) };
  const common = { fill: "none", stroke: "#fff", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round", ...dash } as const;
  return (
    <svg width="64" height="64" viewBox="0 0 48 48">
      {kind === "site" && (
        <>
          <rect x="5" y="9" width="38" height="30" rx="5" {...common} />
          <path d="M5 18h38" {...common} />
          <path d="M12 26h12M12 32h8" {...common} />
        </>
      )}
      {kind === "code" && (
        <>
          <path d="M17 14L7 24l10 10" {...common} />
          <path d="M31 14l10 10-10 10" {...common} />
          <path d="M27 10l-6 28" {...common} />
        </>
      )}
      {kind === "support" && (
        <>
          <rect x="6" y="9" width="36" height="24" rx="4" {...common} />
          <path d="M17 41h14M24 33v8" {...common} />
          <path d="M20 16l8 7-4 1 2 5" {...common} />
        </>
      )}
    </svg>
  );
};

const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(2, Math.floor(Math.max(0, frame - 100) / 36));
  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center" }}>
      <Pop delay={0} y={30} style={{ marginTop: 80, textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.2em", color: "#9ec5ff", textTransform: "uppercase" }}>Nos prestations</div>
        <div style={{ marginTop: 16, fontSize: 80, fontWeight: 800, color: COLORS.text }}>Une solution pour chaque projet</div>
      </Pop>
      <div style={{ display: "flex", gap: 40, marginTop: 50 }}>
        {SERVICES.map((s, i) => {
          const p = spring({ frame: frame - 18 - i * 12, fps: 30, config: { damping: 15, stiffness: 100 } });
          const draw = interpolate(frame, [30 + i * 12, 70 + i * 12], [0, 1], clamp);
          const on = frame > 100 && active === i;
          return (
            <div
              key={s.title}
              style={{
                width: 540,
                height: 610,
                padding: "44px 44px",
                borderRadius: 36,
                background: on ? "linear-gradient(160deg, rgba(124,58,237,0.38), rgba(0,102,255,0.28))" : "rgba(255,255,255,0.06)",
                border: `2px solid ${on ? "rgba(158,197,255,0.7)" : "rgba(255,255,255,0.14)"}`,
                boxShadow: on ? "0 30px 90px rgba(0,102,255,0.35)" : "0 20px 60px rgba(0,0,0,0.25)",
                opacity: p,
                transform: `translateY(${(1 - p) * 120}px) scale(${on ? 1.03 : 1})`,
                boxSizing: "border-box",
              }}
            >
              <div style={{ width: 96, height: 96, borderRadius: 28, background: GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon kind={s.icon} progress={draw} />
              </div>
              <div style={{ marginTop: 28, fontSize: 44, fontWeight: 800, lineHeight: 1.15, color: COLORS.text, minHeight: 102 }}>{s.title}</div>
              <div style={{ marginTop: 12, fontSize: 28, lineHeight: 1.35, color: COLORS.muted, minHeight: 76 }}>{s.text}</div>
              <div style={{ marginTop: 22 }}>
                {s.bullets.map((b, j) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, opacity: interpolate(frame, [50 + i * 12 + j * 8, 64 + i * 12 + j * 8], [0, 1], clamp) }}>
                    <div style={{ width: 12, height: 12, borderRadius: 4, background: COLORS.cyan }} />
                    <span style={{ fontSize: 26, fontWeight: 600, color: "#e6ebff" }}>{b}</span>
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
  const fmt = (n: number) => String(n);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center" }}>
      <Pop delay={0} y={30} style={{ marginTop: 66, textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.2em", color: "#9ec5ff", textTransform: "uppercase" }}>Offres &amp; tarifs</div>
        <div style={{ marginTop: 12, fontSize: 76, fontWeight: 800, color: COLORS.text }}>Des prix clairs, sans surprise</div>
      </Pop>
      <div style={{ display: "flex", gap: 28, marginTop: 52, alignItems: "stretch" }}>
        {PLANS.map((pl, i) => {
          const p = spring({ frame: frame - 16 - i * 10, fps: 30, config: { damping: 15, stiffness: 110 } });
          const count = interpolate(frame, [26 + i * 10, 62 + i * 10], [0, pl.from], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <div
              key={pl.name}
              style={{
                position: "relative",
                width: 412,
                height: 400,
                boxSizing: "border-box",
                padding: "44px 36px 30px",
                borderRadius: 32,
                background: pl.featured ? GRADIENT : "rgba(255,255,255,0.07)",
                border: pl.featured ? "2px solid rgba(255,255,255,0.5)" : "2px solid rgba(255,255,255,0.14)",
                boxShadow: pl.featured ? "0 30px 100px rgba(0,102,255,0.55)" : "0 20px 60px rgba(0,0,0,0.25)",
                opacity: p,
                transform: `translateY(${(1 - p) * 110}px) scale(${pl.featured ? 1.05 : 1})`,
              }}
            >
              {pl.badge && (
                <div style={{ position: "absolute", top: -22, left: 36, padding: "8px 20px", borderRadius: 999, background: "#fff", color: COLORS.violetDeep, fontSize: 22, fontWeight: 800, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                  {pl.badge}
                </div>
              )}
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: pl.featured ? "#e6ebff" : "#9ec5ff" }}>{pl.kind}</div>
              <div style={{ marginTop: 14, fontSize: 40, fontWeight: 800, lineHeight: 1.12, whiteSpace: "pre-line", color: COLORS.text, minHeight: 90 }}>{pl.name}</div>
              <div style={{ position: "absolute", left: 36, right: 36, bottom: 34, display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 30, fontWeight: 600, color: pl.featured ? "#e6ebff" : COLORS.muted }}>dès</span>
                <span style={{ fontSize: 112, fontWeight: 800, lineHeight: 1, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{fmt(Math.round(count))}</span>
                <span style={{ fontSize: 58, fontWeight: 800, color: COLORS.text }}>€</span>
              </div>
            </div>
          );
        })}
      </div>
      <Pop delay={92} y={30} style={{ marginTop: 44 }}>
        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ width: 836, boxSizing: "border-box", padding: "22px 36px", borderRadius: 24, background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.14)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: COLORS.text }}>{EXTRA_PLANS.software.label}</span>
            <span style={{ fontSize: 40, fontWeight: 800, color: COLORS.text }}>dès {EXTRA_PLANS.software.from} €</span>
          </div>
          <div style={{ width: 836, boxSizing: "border-box", padding: "22px 36px", borderRadius: 24, background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.14)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: COLORS.text }}>{EXTRA_PLANS.custom.label}</span>
            <span style={{ fontSize: 40, fontWeight: 800, color: "#9ec5ff" }}>{EXTRA_PLANS.custom.note}</span>
          </div>
        </div>
      </Pop>
      <Pop delay={120} y={24} style={{ marginTop: 28 }}>
        <div style={{ display: "flex", gap: 40 }}>
          {RUNNING_COSTS.map((c) => (
            <div key={c.label} style={{ width: 400, textAlign: "left" }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.muted }}>{c.label}</div>
              <div style={{ marginTop: 4, fontSize: 36, fontWeight: 800, color: COLORS.text }}>
                {c.value} <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.muted }}>{c.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </Pop>
      <Pop delay={140} y={0} style={{ position: "absolute", bottom: 36 }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#8791c9" }}>{LEGAL}</div>
      </Pop>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scène 5
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.5 + Math.sin(frame / 10) * 0.15;
  const mail = (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9ec5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3 8l9 6 9-6" />
    </svg>
  );
  const phone = (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9ec5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
    </svg>
  );
  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center", justifyContent: "center" }}>
      <Pop delay={0} y={30}>
        <Img src={staticFile("logo-q.png")} style={{ width: 150, height: 139 }} />
      </Pop>
      <Pop delay={10} y={50} style={{ marginTop: 26, textAlign: "center" }}>
        <div style={{ fontSize: 108, fontWeight: 800, lineHeight: 1.08, color: COLORS.text }}>Donnez vie à votre projet</div>
        <div style={{ fontSize: 108, fontWeight: 800, lineHeight: 1.08, background: "linear-gradient(90deg,#a78bfa,#38bdf8)", WebkitBackgroundClip: "text", color: "transparent", display: "inline-block" }}>avec QYLINE</div>
      </Pop>
      <Pop delay={40} y={40} style={{ marginTop: 46 }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -14, borderRadius: 999, background: GRADIENT, filter: "blur(36px)", opacity: glow }} />
          <div style={{ position: "relative", padding: "22px 74px", borderRadius: 999, background: GRADIENT, fontSize: 68, fontWeight: 800, color: "#fff", border: "2px solid rgba(255,255,255,0.4)" }}>{BRAND.site}</div>
        </div>
      </Pop>
      <Pop delay={62} y={30} style={{ marginTop: 44 }}>
        <div style={{ display: "flex", gap: 56, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 34, fontWeight: 600, color: COLORS.text }}>{mail}{BRAND.email}</div>
          <div style={{ width: 2, height: 36, background: "rgba(255,255,255,0.25)" }} />
          <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 34, fontWeight: 600, color: COLORS.text }}>{phone}{BRAND.phone}</div>
        </div>
      </Pop>
      <Pop delay={80} y={0} style={{ marginTop: 30 }}>
        <div style={{ fontSize: 28, fontWeight: 600, color: COLORS.muted }}>Devis gratuit et sans engagement · {BRAND.baseline}</div>
      </Pop>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- racine
export const QylineAd: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const progress = frame / 899;
  const endFade = interpolate(frame, [886, 899], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Background />
      <Sequence from={SCENES.intro.from} durationInFrames={SCENES.intro.duration} premountFor={30}>
        <Intro />
      </Sequence>
      <Sequence from={SCENES.web.from} durationInFrames={SCENES.web.duration} premountFor={30}>
        <WebScene />
      </Sequence>
      <Sequence from={SCENES.services.from} durationInFrames={SCENES.services.duration} premountFor={30}>
        <ServicesScene />
      </Sequence>
      <Sequence from={SCENES.pricing.from} durationInFrames={SCENES.pricing.duration} premountFor={30}>
        <PricingScene />
      </Sequence>
      <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.duration} premountFor={30}>
        <Outro />
      </Sequence>
      {[SCENES.web.from, SCENES.services.from, SCENES.pricing.from, SCENES.outro.from].map((b) => (
        <Wipe key={b} at={b} />
      ))}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: `${progress * 100}%`, background: GRADIENT }} />
      <AbsoluteFill style={{ background: COLORS.bg, opacity: endFade * 0.85, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
