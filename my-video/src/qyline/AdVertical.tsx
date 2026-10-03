// Version verticale 9:16 (1080 × 1920) de la publicité QYLINE, pour Reels, TikTok,
// Shorts et stories. Même minutage et même bande-son que la version horizontale.
// Les éléments importants restent entre y = 190 et y = 1560 environ, hors des zones
// couvertes par l'interface des applications.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { BRAND, COLORS, EXTRA_PLANS, LEGAL, PLANS, SERVICES } from "./data";
import {
  AdFrame,
  BODY,
  HEAD,
  Highlight,
  Icon,
  Laptop,
  LogoCard,
  MAIL_ICON,
  PHONE_ICON,
  Phone,
  Rise,
  Tag,
  clamp,
  hard,
  useSpring,
} from "./shared";

// ---------------------------------------------------------------- scène 1
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  // Le logo chute vers l'écran et se pose pile sur le premier temps (image 15)
  const fall = interpolate(frame, [2, 15], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const settle = frame >= 15 ? Math.exp(-(frame - 15) / 4) * Math.sin((frame - 15) * 1.3) : 0;
  const chips = ["Sites web", "Logiciels métier", "Assistance informatique"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          opacity: interpolate(frame, [2, 6], [0, 1], clamp),
          transform: `scale(${interpolate(fall, [0, 1], [3.2, 1]) + settle * 0.08}) rotate(${interpolate(fall, [0, 1], [-28, -4])}deg)`,
        }}
      >
        <LogoCard size={280} />
      </div>
      <div style={{ display: "flex", overflow: "hidden", paddingBottom: 10, marginTop: 50 }}>
        {BRAND.name.split("").map((l, i) => {
          const p = spring({ frame: frame - 16 - i * 2, fps: 30, config: { damping: 14, stiffness: 200 } });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: BODY,
                fontWeight: 800,
                fontSize: 196,
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
      <div style={{ marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {BRAND.taglineLines.map((line, i) => (
          <Tag key={line} delay={30 + i * 4} size={66} rotate={i % 2 ? 2 : -2.5} shadow={9}>
            {line}
          </Tag>
        ))}
      </div>
      <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {chips.map((c, i) => {
          const p = spring({ frame: frame - 44 - i * 3, fps: 30, config: { damping: 16, stiffness: 200 } });
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 16, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: COLORS.yellow }} />
              <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 40, color: COLORS.white }}>{c}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scène 2
const WebScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [30, 112], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const laptop = useSpring(6, 15, 120);
  const phone = useSpring(16, 13, 140);
  const h = { fontFamily: HEAD, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: COLORS.white, whiteSpace: "nowrap" } as const;
  const points = ["Design moderne et soigné", "Affichage adapté aux mobiles", "Parcours de contact simple"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 200, width: 900 }}>
        <Tag delay={2} size={30}>
          Planche A — Création de sites web
        </Tag>
        <div style={{ marginTop: 30 }}>
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
        <div style={{ marginTop: 34 }}>
          {points.map((t, i) => {
            const p = spring({ frame: frame - 36 - i * 6, fps: 30, config: { damping: 15, stiffness: 200 } });
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
                <div style={{ width: 44, height: 44, background: COLORS.yellow, boxShadow: hard(4), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={COLORS.navy} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </div>
                <span style={{ fontFamily: BODY, fontSize: 38, fontWeight: 700, color: COLORS.white }}>{t}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Ordinateur + téléphone, réduits pour tenir dans la largeur */}
      <div style={{ position: "absolute", left: 140, top: 950, width: 950, transform: "scale(0.84)", transformOrigin: "top left" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            opacity: interpolate(laptop, [0, 0.15], [0, 1], clamp),
            transform: `translate(${(1 - laptop) * 1000}px, ${Math.sin(frame / 20) * 6}px) rotate(${(1 - laptop) * 8}deg)`,
          }}
        >
          <Laptop scroll={scroll} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 690,
            top: 180,
            opacity: interpolate(phone, [0, 0.15], [0, 1], clamp),
            transform: `translate(${(1 - phone) * 120}px, ${(1 - phone) * 900 + Math.cos(frame / 18) * 8}px) rotate(${(1 - phone) * -10 + 3}deg)`,
          }}
        >
          <Phone scroll={scroll} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scène 3
const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const tilt = [-1.2, 1, -0.8];
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ marginTop: 190, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Tag delay={2} size={30}>
          Nos prestations
        </Tag>
        <Rise delay={5} style={{ marginTop: 22 }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: COLORS.white }}>Une solution</div>
        </Rise>
        <Rise delay={8}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: COLORS.white }}>pour chaque projet</div>
        </Rise>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 50 }}>
        {SERVICES.map((s, i) => {
          const p = spring({ frame: frame - 10 - i * 5, fps: 30, config: { damping: 14, stiffness: 150 } });
          const draw = interpolate(frame, [20 + i * 5, 45 + i * 5], [0, 1], clamp);
          // Chaque carte s'illumine sur un temps de la musique
          const hl = 60 + i * 15;
          const on = interpolate(frame, [hl, hl + 4, hl + 15, hl + 19], [0, 1, 1, i === 2 ? 1 : 0], clamp);
          const side = i % 2 ? 1 : -1;
          return (
            <div
              key={s.title}
              style={{
                width: 900,
                height: 300,
                boxSizing: "border-box",
                padding: "30px 34px",
                background: on > 0.5 ? COLORS.yellow : COLORS.white,
                border: `3px solid ${COLORS.navy}`,
                borderRadius: 6,
                boxShadow: hard(12 + on * 8),
                transform: `translate(${(1 - p) * side * 1100 - on * 10}px, ${-on * 10}px) rotate(${tilt[i] * (1 - on) + (1 - p) * side * 8}deg)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <div style={{ width: 100, height: 100, flexShrink: 0, background: on > 0.5 ? COLORS.white : COLORS.yellow, border: `3px solid ${COLORS.navy}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon kind={s.icon} progress={draw} />
                </div>
                <div>
                  <div style={{ fontFamily: BODY, fontSize: 20, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.blue }}>{s.plate}</div>
                  <div style={{ marginTop: 6, fontFamily: HEAD, fontSize: 46, fontWeight: 800, lineHeight: 1.05, color: COLORS.navy, whiteSpace: "nowrap" }}>{s.title}</div>
                </div>
              </div>
              <div style={{ marginTop: 22 }}>
                {s.bullets.map((b, j) => (
                  <div
                    key={b}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 8,
                      opacity: interpolate(frame, [28 + i * 5 + j * 4, 34 + i * 5 + j * 4], [0, 1], clamp),
                    }}
                  >
                    <div style={{ width: 13, height: 13, background: on > 0.5 ? COLORS.navy : COLORS.yellow, border: `2px solid ${COLORS.navy}` }} />
                    <span style={{ fontFamily: BODY, fontSize: 28, fontWeight: 700, color: COLORS.navy }}>{b}</span>
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
  const zoom = interpolate(frame, [40, 180], [1, 1.03], clamp);
  // Les cartes tombent sur les croches de la musique (11,0 / 11,25 / 11,5 / 11,75 s)
  const drops = [15, 22.5, 30, 37.5];
  const badge = spring({ frame: frame - 57, fps: 30, config: { damping: 10, stiffness: 260 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", transform: `scale(${zoom})` }}>
      <div style={{ marginTop: 180, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Tag delay={2} size={30}>
          Offres &amp; tarifs
        </Tag>
        <Rise delay={5} style={{ marginTop: 22 }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: COLORS.white }}>Des tarifs clairs,</div>
        </Rise>
        <Rise delay={8}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: COLORS.white }}>sans surprise</div>
        </Rise>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "430px 430px", columnGap: 30, rowGap: 50, marginTop: 48 }}>
        {PLANS.map((pl, i) => {
          const p = spring({ frame: frame - (drops[i] - 4), fps: 30, config: { damping: 12, stiffness: 230 } });
          const count = interpolate(frame, [drops[i], drops[i] + 14], [0, pl.from], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <div
              key={pl.name}
              style={{
                position: "relative",
                height: 344,
                boxSizing: "border-box",
                padding: "34px 30px 26px",
                background: pl.featured ? COLORS.yellow : COLORS.white,
                border: `3px solid ${COLORS.navy}`,
                borderRadius: 6,
                boxShadow: hard(pl.featured ? 14 : 10),
                opacity: interpolate(p, [0, 0.1], [0, 1], clamp),
                transform: `translateY(${(1 - p) * -900}px) rotate(${(1 - p) * (i % 2 ? 10 : -10)}deg) scale(${pl.featured ? 1.04 : 1})`,
                zIndex: pl.featured ? 1 : 0,
              }}
            >
              {pl.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -26,
                    right: -14,
                    padding: "9px 18px",
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
              <div style={{ marginTop: 12, fontFamily: HEAD, fontSize: 40, fontWeight: 800, lineHeight: 1.05, whiteSpace: "pre-line", color: COLORS.navy }}>{pl.name}</div>
              <div style={{ position: "absolute", left: 30, right: 30, bottom: 26, display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontFamily: BODY, fontSize: 26, fontWeight: 700, color: COLORS.navy }}>dès</span>
                <span style={{ fontFamily: HEAD, fontSize: 112, fontWeight: 800, lineHeight: 1, color: COLORS.navy, fontVariantNumeric: "tabular-nums" }}>{Math.round(count)}</span>
                <span style={{ fontFamily: HEAD, fontSize: 58, fontWeight: 800, color: COLORS.navy }}>€</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 46 }}>
        {[
          { label: EXTRA_PLANS.software.label, value: `dès ${EXTRA_PLANS.software.from} €`, d: 75 },
          { label: EXTRA_PLANS.custom.label, value: EXTRA_PLANS.custom.note, d: 79 },
        ].map((row) => {
          const p = spring({ frame: frame - row.d, fps: 30, config: { damping: 14, stiffness: 200 } });
          return (
            <div
              key={row.label}
              style={{
                width: 890,
                boxSizing: "border-box",
                padding: "20px 30px",
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
      <div style={{ marginTop: 34, fontFamily: BODY, fontSize: 26, fontWeight: 600, color: COLORS.muted, opacity: interpolate(frame, [88, 96], [0, 1], clamp) }}>{LEGAL}</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scène 5
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useSpring(0, 12, 260);
  const lines = [
    ["Donnez", "vie"],
    ["à", "votre", "projet"],
  ];
  // Le bouton pulse sur les temps puis s'illumine sur l'accord final (image 555)
  const beatPulse = [30, 45].reduce((acc, b) => acc + (frame >= b ? Math.exp(-(frame - b) / 3) : 0), 0);
  const final = frame >= 60 ? Math.exp(-(frame - 60) / 6) : 0;
  const btn = useSpring(22, 11, 220);
  let wordIndex = 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${interpolate(logo, [0, 1], [2.6, 1])}) rotate(${-4 + (1 - logo) * -20}deg)`, opacity: interpolate(logo, [0, 0.1], [0, 1], clamp) }}>
        <LogoCard size={170} />
      </div>
      <div style={{ marginTop: 44, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {lines.map((line) => (
          <div key={line.join(" ")} style={{ display: "flex", gap: 28 }}>
            {line.map((w) => {
              const p = spring({ frame: frame - 2 - wordIndex++ * 2, fps: 30, config: { damping: 13, stiffness: 240 } });
              return (
                <span
                  key={w}
                  style={{
                    fontFamily: HEAD,
                    fontWeight: 800,
                    fontSize: 120,
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
        ))}
      </div>
      <div style={{ marginTop: 34 }}>
        <Tag delay={12} size={108} rotate={-2.5} shadow={12} font={BODY}>
          avec QYLINE
        </Tag>
      </div>
      <div
        style={{
          marginTop: 52,
          padding: "22px 60px",
          background: final > 0.3 ? COLORS.yellow : COLORS.navy,
          color: final > 0.3 ? COLORS.navy : COLORS.white,
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: 72,
          boxShadow: hard(10, final > 0.3 ? COLORS.navy : COLORS.yellow),
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: interpolate(btn, [0, 0.1], [0, 1], clamp),
          transform: `translateY(${(1 - btn) * 160}px) scale(${1 + beatPulse * 0.035 + final * 0.06})`,
        }}
      >
        {BRAND.site}
        <span style={{ fontSize: 64 }}>→</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, marginTop: 52 }}>
        {[
          { d: MAIL_ICON, text: BRAND.email, delay: 30 },
          { d: PHONE_ICON, text: BRAND.phone, delay: 34 },
        ].map((c) => {
          const p = spring({ frame: frame - c.delay, fps: 30, config: { damping: 15, stiffness: 200 } });
          return (
            <div key={c.text} style={{ display: "flex", alignItems: "center", gap: 20, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
              <div style={{ width: 58, height: 58, background: COLORS.yellow, boxShadow: hard(4), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.navy} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d={c.d} />
                </svg>
              </div>
              <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 42, color: COLORS.white }}>{c.text}</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 40,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 30,
          lineHeight: 1.4,
          color: COLORS.muted,
          opacity: interpolate(frame, [40, 48], [0, 1], clamp),
        }}
      >
        Devis gratuit et sans engagement
        <br />
        {BRAND.baseline}
      </div>
    </AbsoluteFill>
  );
};

export const QylineAdVertical: React.FC = () => (
  <AdFrame scenes={{ intro: Intro, web: WebScene, services: ServicesScene, pricing: PricingScene, outro: Outro }} />
);
