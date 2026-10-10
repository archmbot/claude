// SCÈNE 7 (69-80 s) — CONCLUSION : les cartes se rejoignent et disparaissent, logo premium,
// sites qui défilent en arrière-plan, puis QYLINE.ORG avec un léger effet lumineux.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedPhone } from "../components/AnimatedPhone";
import { AnimatedWebsite, ShopPage } from "../components/AnimatedWebsite";
import { BigLogo } from "../components/Logo";
import { PriceCard } from "../components/PriceCard";
import { BODY, HEAD, P, Stamp, clamp } from "../components/theme";
import { localEv } from "../timeline";
import { CARDS, CARD_TOP } from "./Tarifs";

export const Conclusion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tagline = localEv(6, "tagline");
  const brand = localEv(6, "brand");
  const free = localEv(6, "free");
  const site = localEv(6, "site");
  const finale = localEv(6, "finale");
  const merge = interpolate(frame, [0, 26], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const flash = interpolate(frame, [22, 26, 40], [0, 0.9, 0], clamp);
  const bg = interpolate(frame, [20, 50], [0, 1], clamp);
  const siteP = spring({ frame: frame - site, fps, config: { damping: 12, stiffness: 150 } });
  const glow = 0.6 + 0.4 * Math.sin((frame - site) / 8);
  const sweep = interpolate(frame, [site + 10, site + 40], [-30, 130], clamp);
  const finalPulse = frame >= finale ? Math.exp(-(frame - finale) / 8) : 0;
  return (
    <AbsoluteFill>
      {/* sites de démonstration qui défilent en arrière-plan */}
      <AbsoluteFill style={{ opacity: 0.32 * bg }}>
        <div style={{ position: "absolute", left: -120, top: 300, transform: `translateY(${-frame * 0.4}px)` }}>
          <AnimatedWebsite variant="vitrine" width={520} height={380} url="atelier-demo.fr" rotateY={28} scroll={(frame % 300) / 300} />
        </div>
        <div style={{ position: "absolute", left: 720, top: 240, transform: `translateY(${frame * 0.3}px)` }}>
          <AnimatedPhone width={300} height={600} rotateY={-24}>
            <div style={{ transform: `scale(${272 / 900}) translateY(${-((frame * 3) % 400)}px)`, transformOrigin: "0 0" }}>
              <ShopPage added={2} />
            </div>
          </AnimatedPhone>
        </div>
        <div style={{ position: "absolute", left: 640, top: 1000, transform: `translateY(${-frame * 0.25}px)` }}>
          <AnimatedWebsite variant="shop" width={520} height={360} url="ceramique-demo.fr" rotateY={-28} scroll={((frame + 120) % 300) / 300} />
        </div>
        <div style={{ position: "absolute", left: -60, top: 980, transform: `translateY(${frame * 0.2}px)` }}>
          <AnimatedPhone width={280} height={560} rotateY={24}>
            <div style={{ transform: `scale(${252 / 900})`, transformOrigin: "0 0" }}>
              <AnimatedWebsite bare variant="vitrine" width={900} height={1900} url="atelier-demo.fr" scroll={((frame + 60) % 300) / 300} />
            </div>
          </AnimatedPhone>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(60% 45% at 50% 48%, rgba(8,13,31,0.92) 30%, rgba(8,13,31,0.25) 100%)", opacity: bg }} />
      {/* les deux cartes se rejoignent puis disparaissent */}
      {merge < 1 &&
        CARDS.map((c) => (
          <div
            key={c.title}
            style={{
              position: "absolute",
              left: c.left,
              top: CARD_TOP,
              transform: `translateX(${(305 - c.left) * merge}px) scale(${1 - 0.8 * merge})`,
              opacity: 1 - merge,
            }}
          >
            <PriceCard title={c.title} price={c.price} features={c.features} accent={c.accent} countAt={0} counted />
          </div>
        ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {["VOTRE PROJET", "MÉRITE LE BON SITE."].map((line, i) => {
          const p = spring({ frame: frame - tagline - i * 5, fps, config: { damping: 15, stiffness: 180 } });
          return (
            <div key={line} style={{ overflow: "hidden", paddingBottom: 6 }}>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 86, lineHeight: 1.02, color: i ? P.violet : P.white, whiteSpace: "nowrap", transform: `translateY(${(1 - p) * 110}%)` }}>{line}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center", transform: `scale(${1 + 0.08 * finalPulse})` }}>
        <BigLogo delay={34} size={210} pulseAt={finale} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", overflow: "hidden", paddingBottom: 6 }}>
          {"QYLINE".split("").map((l, i) => {
            const p = spring({ frame: frame - brand - i * 2, fps, config: { damping: 14, stiffness: 200 } });
            return (
              <span key={i} style={{ display: "inline-block", fontFamily: BODY, fontWeight: 800, fontSize: 132, lineHeight: 1, letterSpacing: "-0.03em", color: P.white, transform: `translateY(${(1 - p) * 110}%)` }}>
                {l}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontFamily: BODY, fontWeight: 800, fontSize: 34, letterSpacing: "0.16em", color: P.blue, opacity: interpolate(frame, [brand + 10, brand + 20], [0, 1], clamp) }}>CRÉATION DE SITES INTERNET</div>
      </div>
      {frame >= free - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 935, display: "flex", justifyContent: "center" }}>
          <Stamp delay={free - 2} size={42} rotate={-2}>
            Premier échange gratuit
          </Stamp>
        </div>
      )}
      {frame >= site - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", opacity: interpolate(siteP, [0, 0.15], [0, 1], clamp), transform: `scale(${interpolate(siteP, [0, 1], [1.5, 1]) + 0.05 * finalPulse})` }}>
          <div style={{ position: "relative", overflow: "hidden", padding: "0 20px" }}>
            <div
              style={{
                fontFamily: BODY,
                fontWeight: 800,
                fontSize: 128,
                lineHeight: 1.05,
                color: P.white,
                textShadow: `0 0 ${24 * glow}px rgba(117,75,255,0.9), 0 0 ${60 * glow}px rgba(57,135,255,0.6)`,
              }}
            >
              QYLINE.ORG
            </div>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: "18%", background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))", transform: "skewX(-15deg)" }} />
          </div>
        </div>
      )}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, rgba(255,255,255,${flash}), rgba(117,75,255,${flash * 0.6}) 60%, rgba(117,75,255,0) 100%)`, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
