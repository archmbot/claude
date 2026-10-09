// Scène 6 (52-60 s) — CONCLUSION : bleu nuit, logo au centre, appel à l'action qyline.org.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Rise } from "../../qyline/shared";
import { localCue } from "../timeline";
import { BODY, C, Footnote, HEAD, LogoMark, Stamp, clamp, usePop } from "../ui";

export const S6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const brand = localCue(5, "qyline", 1);
  const site = localCue(5, "qyline.org");
  const logo = usePop(2, 12, 200);
  const ring = (frame % 45) / 45;
  const pulse = frame >= site ? 1 + 0.08 * Math.exp(-(frame - site) / 6) : 1;
  const h = { fontFamily: HEAD, fontWeight: 800, fontSize: 104, lineHeight: 1.02, color: C.white, whiteSpace: "nowrap" } as const;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 200,
              height: 200,
              marginLeft: -100,
              marginTop: -100,
              borderRadius: "50%",
              border: `4px solid ${C.violet}`,
              opacity: (1 - ring) * 0.8,
              transform: `scale(${1 + ring * 1.4})`,
            }}
          />
          <div style={{ transform: `scale(${logo})`, opacity: logo }}>
            <LogoMark size={190} shadow={10} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Rise delay={6}>
          <div style={h}>VÉRIFIEZ</div>
        </Rise>
        <Rise delay={11}>
          <div style={h}>VOTRE SITE</div>
        </Rise>
        <Rise delay={16}>
          <div style={{ ...h, color: C.yellow }}>DÈS AUJOURD&apos;HUI</div>
        </Rise>
      </div>
      {frame >= brand - 4 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", transform: `scale(${pulse})` }}>
          <Stamp delay={brand - 4} size={116} rotate={-2.5} shadow={12}>
            QYLINE.ORG
          </Stamp>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1120,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 36,
          color: C.white,
          opacity: interpolate(frame, [brand + 10, brand + 20], [0, 1], clamp),
        }}
      >
        Création de sites web <span style={{ color: C.yellow }}>•</span> Assistance informatique
      </div>
      <Footnote delay={brand + 20} top={1300}>
        Contenu d&apos;information générale, qui ne remplace pas un conseil juridique personnalisé.
      </Footnote>
    </AbsoluteFill>
  );
};
