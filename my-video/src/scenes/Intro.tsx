// SCÈNE 1 (0-8 s) — ACCROCHE : deux sites en 3D côte à côte, la question, puis « faites le bon choix ».
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedWebsite } from "../components/AnimatedWebsite";
import { HEAD, P, Stamp, clamp, usePop } from "../components/theme";
import { FPS, cueSeconds, localEv } from "../timeline";

const Word: React.FC<{ delay: number; size: number; color: string; children: React.ReactNode }> = ({ delay, size, color, children }) => {
  const p = usePop(delay, 12, 220);
  return (
    <div
      style={{
        fontFamily: HEAD,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        color,
        whiteSpace: "nowrap",
        opacity: interpolate(p, [0, 0.15], [0, 1], clamp),
        transform: `scale(${interpolate(p, [0, 1], [2.2, 1])})`,
      }}
    >
      {children}
    </div>
  );
};

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const good = localEv(0, "goodChoice");
  const saidVitrine = Math.round(cueSeconds(0, "vitrine") * FPS);
  const saidShop = Math.round(cueSeconds(0, "boutique") * FPS);
  const left = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 110 } });
  const right = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 110 } });
  const focus = spring({ frame: frame - good, fps, config: { damping: 16, stiffness: 140 } });
  const lit = (at: number) => interpolate(frame, [at - 4, at + 4, at + 40, at + 52], [0, 1, 1, 0.35], clamp);
  const site = (side: 0 | 1, p: number) => {
    const l = lit(side ? saidShop : saidVitrine);
    return {
      opacity: interpolate(p, [0, 0.15], [0, 1], clamp),
      transform: `translateX(${(1 - p) * (side ? 700 : -700)}px) translateY(${-24 * l + 40 * focus}px) scale(${1 + 0.04 * l - 0.12 * focus})`,
      l,
    };
  };
  const a = site(0, left);
  const b = site(1, right);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 205, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 1 - 0.5 * focus }}>
        <Word delay={8} size={108} color={P.white}>
          SITE VITRINE
        </Word>
        <Word delay={14} size={72} color={P.violet}>
          OU
        </Word>
        <Word delay={19} size={84} color={P.blue}>
          BOUTIQUE EN LIGNE&nbsp;?
        </Word>
      </div>
      <div style={{ position: "absolute", left: 36, top: 600, ...a }}>
        <AnimatedWebsite
          variant="vitrine"
          width={480}
          height={620}
          url="atelier-demo.fr"
          rotateY={22 - 14 * focus}
          scroll={interpolate(frame, [20, 230], [0, 0.18], clamp)}
          ctaGlow={a.l}
          glow={a.l > 0.05 ? `rgba(117,75,255,${0.8 * a.l})` : undefined}
        />
      </div>
      <div style={{ position: "absolute", left: 564, top: 600, ...b }}>
        <AnimatedWebsite
          variant="shop"
          width={480}
          height={620}
          url="ceramique-demo.fr"
          rotateY={-22 + 14 * focus}
          scroll={interpolate(frame, [26, 230], [0, 0.35], clamp)}
          added={frame > saidShop + 20 ? 1 : 0}
          glow={b.l > 0.05 ? `rgba(57,135,255,${0.8 * b.l})` : undefined}
        />
      </div>
      {frame >= good && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center" }}>
          <Stamp delay={good} size={70} rotate={-3} shadow={10}>
            FAITES LE BON CHOIX&nbsp;!
          </Stamp>
        </div>
      )}
    </AbsoluteFill>
  );
};
