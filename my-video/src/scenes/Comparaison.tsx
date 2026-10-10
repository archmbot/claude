// SCÈNE 4 (34-47 s) — LA VRAIE DIFFÉRENCE : écran partagé vitrine / boutique, puis « quel est votre objectif ? ».
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, Check, Chip, HEAD, P, Stamp, clamp, hard } from "../components/theme";
import { localEv } from "../timeline";

const COL_W = 470;
const LEFT = ["Demande de devis", "Prise de contact", "Prestations personnalisées"];
const RIGHT = ["Achat direct", "Paiement en ligne", "Gestion des commandes"];
const TODO = [
  { label: "Gestion des stocks", ev: "stocks" as const },
  { label: "Suivi des commandes", ev: "commandes" as const },
  { label: "Livraisons", ev: "livraisons" as const },
];

const Row: React.FC<{ label: string; p: number; side: 0 | 1 }> = ({ label, p, side }) => (
  <div
    style={{
      height: 92,
      marginBottom: 14,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 20px",
      background: P.white,
      border: `3px solid ${P.navy}`,
      borderRadius: 14,
      boxShadow: hard(7),
      opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
      transform: `translateX(${(1 - p) * (side ? 300 : -300)}px)`,
    }}
  >
    <Check size={42} progress={Math.max(0.001, p)} />
    <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 29, color: P.navy, lineHeight: 1.1 }}>{label}</span>
  </div>
);

export const Comparaison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const left = localEv(3, "leftItems");
  const right = localEv(3, "rightItems");
  const warn = localEv(3, "warn");
  const goal = localEv(3, "objective");
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 190 } });
  const heads = spring({ frame: frame - 6, fps, config: { damping: 15, stiffness: 120 } });
  const divider = interpolate(frame, [8, 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const goalP = spring({ frame: frame - goal, fps, config: { damping: 12, stiffness: 160 } });
  const header = (side: 0 | 1) => (
    <div
      style={{
        height: 110,
        borderRadius: 18,
        background: side ? P.blue : P.violet,
        border: `3px solid ${P.navy}`,
        boxShadow: hard(8),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: HEAD,
        fontWeight: 800,
        fontSize: side ? 40 : 46,
        color: P.white,
        transform: `perspective(1200px) rotateY(${(1 - heads) * (side ? -70 : 70)}deg)`,
        opacity: heads,
      }}
    >
      {side ? "BOUTIQUE EN LIGNE" : "SITE VITRINE"}
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 205, display: "flex", justifyContent: "center", opacity: 1 - goalP }}>
        <Stamp delay={2} size={46} rotate={-2}>
          LA VRAIE DIFFÉRENCE
        </Stamp>
      </div>
      <div style={{ position: "absolute", left: 538, top: 320, width: 4, height: 880 * divider, background: P.violet, boxShadow: "0 0 24px rgba(117,75,255,0.9)" }} />
      <div style={{ opacity: 1 - 0.75 * goalP }}>
        {[0, 1].map((side) => {
          const items = side ? RIGHT : LEFT;
          const at = side ? right : left;
          return (
            <div key={side} style={{ position: "absolute", left: side ? 560 : 50, top: 320, width: COL_W }}>
              {header(side as 0 | 1)}
              <div style={{ marginTop: 26 }}>
                {items.map((label, i) => (
                  <Row key={label} label={label} side={side as 0 | 1} p={pop(at + i * 7)} />
                ))}
              </div>
              <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
                <Chip label={side ? "= DES VENTES" : "= DES CONTACTS"} color={side ? P.blue : P.violet} size={34} progress={pop(at + 26)} />
              </div>
            </div>
          );
        })}
        {/* ce que demande une boutique */}
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 900,
            width: COL_W,
            boxSizing: "border-box",
            padding: "20px 22px",
            background: "#FFF7D6",
            border: `4px solid ${P.yellow}`,
            borderRadius: 18,
            boxShadow: hard(8),
            opacity: interpolate(pop(warn), [0, 0.2], [0, 1], clamp),
            transform: `scale(${interpolate(pop(warn), [0, 1], [0.7, 1])})`,
          }}
        >
          <div style={{ fontFamily: BODY, fontWeight: 800, fontSize: 28, color: P.navy, marginBottom: 12 }}>À prévoir aussi :</div>
          {TODO.map((t) => {
            const on = interpolate(frame, [localEv(3, t.ev), localEv(3, t.ev) + 8], [0, 1], clamp);
            return (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, opacity: 0.35 + 0.65 * on, transform: `translateX(${(1 - on) * 20}px)` }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: on > 0.5 ? P.yellow : "#D9CFA6", border: `3px solid ${P.navy}` }} />
                <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 28, color: P.navy }}>{t.label}</span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 900,
            width: COL_W,
            boxSizing: "border-box",
            padding: "20px 22px",
            background: "rgba(255,255,255,0.12)",
            border: `3px solid rgba(255,255,255,0.5)`,
            borderRadius: 18,
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 27,
            lineHeight: 1.35,
            color: P.white,
            opacity: interpolate(frame, [left + 30, left + 42], [0, 1], clamp),
          }}
        >
          Idéal pour les artisans et les prestataires de services.
        </div>
      </div>
      {frame >= goal - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `scale(${interpolate(goalP, [0, 1], [1.8, 1])})`, opacity: interpolate(goalP, [0, 0.15], [0, 1], clamp) }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 104, color: P.white, lineHeight: 1 }}>QUEL EST</div>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 104, color: P.white, lineHeight: 1 }}>VOTRE</div>
          <div style={{ padding: "6px 26px", background: P.violet, boxShadow: hard(10), transform: "rotate(-2deg)", fontFamily: HEAD, fontWeight: 800, fontSize: 104, color: P.white, lineHeight: 1 }}>
            OBJECTIF&nbsp;?
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
