// Smartphone en 3D (cadre bleu nuit, encoche) ; dimensions et arrondi animables pour le morphing.
import React from "react";
import { P, hard } from "./theme";

export const AnimatedPhone: React.FC<{
  width: number;
  height: number;
  radius?: number; // arrondi extérieur
  bezel?: number;
  rotateX?: number;
  rotateY?: number;
  notch?: number; // opacité de l'encoche (0 pendant le morphing depuis l'ordinateur)
  glow?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, radius = 56, bezel = 14, rotateX = 0, rotateY = 0, notch = 1, glow, children, style }) => (
  <div style={{ perspective: 1600, ...style }}>
    <div
      style={{
        width,
        height,
        padding: bezel,
        boxSizing: "border-box",
        borderRadius: radius,
        background: P.navy,
        boxShadow: glow ? `${hard(12, P.yellow)}, 0 0 70px 8px ${glow}` : hard(12, P.yellow),
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: Math.max(6, radius - bezel), overflow: "hidden", background: P.paper }}>
        {children}
        <div style={{ position: "absolute", top: 12, left: "50%", marginLeft: -55, width: 110, height: 28, borderRadius: 15, background: P.navy, opacity: notch }} />
      </div>
    </div>
  </div>
);
