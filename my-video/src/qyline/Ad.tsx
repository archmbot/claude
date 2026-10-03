// Version horizontale 16:9 (1920 × 1080) de la publicité QYLINE.
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

export const QylineAd: React.FC = () => (
  <AdFrame scenes={{ intro: Intro, web: WebScene, services: ServicesScene, pricing: PricingScene, outro: Outro }} />
);
