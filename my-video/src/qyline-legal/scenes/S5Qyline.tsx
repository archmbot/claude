// Scène 5 (42-52 s) — QYLINE : logo, promesse, site professionnel sur ordinateur et smartphone.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Laptop, Phone } from "../../qyline/shared";
import { localCue } from "../timeline";
import { BODY, C, LogoMark, Stamp, clamp } from "../ui";

export const S5Qyline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const create = localCue(4, "créons");
  const support = localCue(4, "accompagnons");
  const fall = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const settle = frame >= 12 ? Math.exp(-(frame - 12) / 4) * Math.sin((frame - 12) * 1.3) : 0;
  const devices = spring({ frame: frame - 56, fps, config: { damping: 15, stiffness: 110 } });
  const scroll = interpolate(frame, [80, 280], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 215, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            opacity: interpolate(frame, [0, 4], [0, 1], clamp),
            transform: `scale(${interpolate(fall, [0, 1], [2.8, 1]) + settle * 0.08}) rotate(${interpolate(fall, [0, 1], [-24, -4])}deg)`,
          }}
        >
          <LogoMark size={210} shadow={12} />
        </div>
        <div style={{ display: "flex", overflow: "hidden", marginTop: 30, paddingBottom: 8 }}>
          {"QYLINE".split("").map((l, i) => {
            const p = spring({ frame: frame - 12 - i * 2, fps, config: { damping: 14, stiffness: 200 } });
            return (
              <span
                key={i}
                style={{ display: "inline-block", fontFamily: BODY, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: "-0.03em", color: C.white, transform: `translateY(${(1 - p) * 110}%)` }}
              >
                {l}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 26 }}>
          <Stamp delay={create - 4} size={46} wrap style={{ maxWidth: 820 }}>
            Création de sites internet professionnels
          </Stamp>
        </div>
        <div style={{ marginTop: 28 }}>
          <Stamp delay={support - 4} size={44} bg={C.white} rotate={2}>
            Accompagnement et conformité
          </Stamp>
        </div>
      </div>
      <div style={{ position: "absolute", left: 175, top: 960, width: 950, transform: "scale(0.7)", transformOrigin: "top left" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            opacity: interpolate(devices, [0, 0.15], [0, 1], clamp),
            transform: `translateX(${(1 - devices) * 1200}px)`,
          }}
        >
          <Laptop scroll={scroll} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 690,
            top: 150,
            opacity: interpolate(devices, [0, 0.15], [0, 1], clamp),
            transform: `translateY(${(1 - devices) * 900}px) rotate(3deg)`,
          }}
        >
          <Phone scroll={scroll} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
