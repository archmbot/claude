// Carte tarifaire avec compteur de prix animé et liste de prestations cochées.
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BODY, Check, HEAD, P, clamp, hard } from "./theme";

export const PriceCard: React.FC<{
  title: string;
  price: number;
  features: string[];
  countAt: number; // image (locale) où le compteur démarre, calée sur la voix
  accent: string;
  width?: number;
  height?: number;
  counted?: boolean; // affiche directement le prix final
}> = ({ title, price, features, countAt, accent, width = 470, height = 760, counted = false }) => {
  const frame = useCurrentFrame();
  const k = counted ? 1 : interpolate(frame, [countAt, countAt + 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const value = Math.round(price * k);
  const done = counted || frame >= countAt + 20;
  const bump = !counted && frame >= countAt + 20 ? 1 + 0.08 * Math.exp(-(frame - countAt - 20) / 5) : 1;
  return (
    <div
      style={{
        width,
        height,
        boxSizing: "border-box",
        background: P.white,
        border: `4px solid ${P.navy}`,
        borderRadius: 26,
        boxShadow: `${hard(14, accent)}, 0 0 80px rgba(117,75,255,0.35)`,
        overflow: "hidden",
        fontFamily: BODY,
      }}
    >
      <div style={{ background: accent, padding: "26px 30px", color: P.white }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, lineHeight: 1.02, whiteSpace: "pre-line" }}>{title}</div>
      </div>
      <div style={{ padding: "26px 30px 0" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#59627F" }}>À partir de</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, transform: `scale(${bump})`, transformOrigin: "0 70%" }}>
          <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 132, lineHeight: 1.05, color: P.navy, fontVariantNumeric: "tabular-nums" }}>{value}</span>
          <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: accent }}>€</span>
        </div>
        <div style={{ height: 4, background: "#E3E7F3", borderRadius: 2, margin: "8px 0 22px" }} />
        {features.map((f, i) => {
          const p = counted ? 1 : interpolate(frame, [countAt + 18 + i * 7, countAt + 28 + i * 7], [0, 1], clamp);
          return (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, opacity: done || counted ? 0.35 + 0.65 * p : 0.35 }}>
              <Check size={38} progress={Math.max(0.001, p)} />
              <span style={{ fontSize: 29, fontWeight: 700, color: P.navy, lineHeight: 1.15 }}>{f}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
