// Logo QYLINE : en-tête permanent en haut à gauche et apparition « premium » au centre.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { LogoMark } from "../qyline-legal/ui";
import { P, clamp, usePop } from "./theme";

export { Header, LogoMark } from "../qyline-legal/ui";

// Logo central : arrivée en rotation, halo violet, anneaux et reflet lumineux
export const BigLogo: React.FC<{ delay: number; size?: number; pulseAt?: number }> = ({ delay, size = 230, pulseAt }) => {
  const frame = useCurrentFrame();
  const p = usePop(delay, 11, 140);
  const local = frame - delay;
  const ring = ((local % 50) + 50) % 50 / 50;
  const pulse = pulseAt !== undefined && frame >= pulseAt ? Math.exp(-(frame - pulseAt) / 7) : 0;
  const sweep = interpolate(local, [10, 34], [-60, 160], clamp);
  return (
    <div style={{ position: "relative", width: size, height: size, opacity: interpolate(p, [0, 0.15], [0, 1], clamp) }}>
      <div
        style={{
          position: "absolute",
          inset: -size * 0.6,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(117,75,255,${0.55 + 0.3 * pulse}) 0%, rgba(57,135,255,0.18) 40%, rgba(57,135,255,0) 70%)`,
          transform: `scale(${0.6 + 0.4 * p + 0.25 * pulse})`,
        }}
      />
      {[0, 0.5].map((o) => {
        const r = (ring + o) % 1;
        return (
          <div
            key={o}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `4px solid ${o ? P.blue : P.violet}`,
              opacity: (1 - r) * 0.7 * p,
              transform: `scale(${1 + r * 1.3})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "relative",
          transform: `scale(${interpolate(p, [0, 1], [0.2, 1]) + 0.1 * pulse}) rotate(${(1 - p) * -200}deg) perspective(800px) rotateY(${(1 - p) * 60}deg)`,
          overflow: "hidden",
          borderRadius: size * 0.18,
        }}
      >
        <LogoMark size={size} shadow={Math.round(size * 0.05)} />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sweep}%`,
            width: "30%",
            background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
            transform: "skewX(-15deg)",
          }}
        />
      </div>
    </div>
  );
};
