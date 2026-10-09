// Scène 2 (7-17 s) — LE RISQUE : texte de loi (illustration) puis compteur jusqu'à 75 000 €.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { localCue } from "../timeline";
import { BODY, C, Footnote, HEAD, Lines, Stamp, clamp, hard, usePop } from "../ui";

export const S2Risk: React.FC = () => {
  const frame = useCurrentFrame();
  const law = localCue(1, "sanctionnée");
  const c75 = localCue(1, "75");
  const euros = localCue(1, "euros");
  const prison = localCue(1, "an");
  const doc = usePop(4, 15, 110);
  const mark = interpolate(frame, [law, law + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const count = interpolate(frame, [c75, euros + 8], [0, 75000], { ...clamp, easing: Easing.out(Easing.cubic) });
  const value = Math.round(count / 100) * 100;
  const shown = value.toLocaleString("fr-FR").replace(/\s/g, " ");
  const d = frame - (euros + 8);
  const shake = d >= 0 && d < 14 ? Math.sin(d * 2.9) * 12 * Math.exp(-d / 4) : 0;
  const counter = usePop(c75 - 4, 14, 160);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 205,
          width: 600,
          height: 530,
          background: C.paper,
          border: `4px solid ${C.navy}`,
          boxShadow: hard(14, C.violet),
          padding: "38px 44px",
          boxSizing: "border-box",
          fontFamily: BODY,
          opacity: interpolate(doc, [0, 0.15], [0, 1], clamp),
          transform: `translateY(${(1 - doc) * 700}px) rotate(${-3 + (1 - doc) * 10}deg)`,
        }}
      >
        <div style={{ position: "absolute", right: 16, top: 12, fontSize: 16, fontWeight: 700, color: "#7A86A8", letterSpacing: "0.1em" }}>ILLUSTRATION</div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 60, color: C.navy, lineHeight: 1 }}>LCEN</div>
        <div style={{ marginTop: 10, fontSize: 22, fontWeight: 700, color: "#3A4466", lineHeight: 1.3 }}>
          Loi n° 2004-575 du 21 juin 2004
          <br />
          pour la confiance dans l&apos;économie numérique
        </div>
        <div style={{ marginTop: 26 }}>
          <Lines widths={[95, 88, 92, 70]} h={11} gap={11} />
        </div>
        <div style={{ position: "relative", marginTop: 8, padding: "10px 0" }}>
          <div style={{ position: "absolute", left: -12, top: 0, bottom: 0, width: `${mark * 106}%`, background: "rgba(245,197,24,0.75)" }} />
          <div style={{ position: "relative", fontSize: 22, fontWeight: 800, color: C.navy }}>Art. 1-1 et 1-2 : mentions et sanctions</div>
          <div style={{ position: "relative", marginTop: 10 }}>
            <Lines widths={[92, 80]} h={11} gap={11} color={mark > 0.5 ? "#8A7420" : "#D3DAEB"} />
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <Lines widths={[90, 60]} h={11} gap={11} />
        </div>
      </div>

      {frame >= c75 - 4 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 770,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: interpolate(counter, [0, 0.2], [0, 1], clamp),
            transform: `translateX(${shake}px) scale(${0.85 + 0.15 * counter})`,
          }}
        >
          <Stamp delay={c75 - 4} size={40} rotate={-2}>
            JUSQU&apos;À
          </Stamp>
          <div style={{ marginTop: 14, fontFamily: HEAD, fontWeight: 800, fontSize: 184, lineHeight: 1, color: C.white, fontVariantNumeric: "tabular-nums", textShadow: `0 8px 0 ${C.violetDeep}` }}>
            {shown}&nbsp;€
          </div>
          <div style={{ marginTop: 6, fontFamily: HEAD, fontWeight: 800, fontSize: 70, lineHeight: 1.05, color: C.white, opacity: interpolate(frame, [euros, euros + 8], [0, 1], clamp) }}>
            D&apos;AMENDE
          </div>
        </div>
      )}
      {frame >= prison - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1170, display: "flex", justifyContent: "center" }}>
          <Stamp delay={prison - 2} size={44} rotate={-2}>
            JUSQU&apos;À 1 AN D&apos;EMPRISONNEMENT
          </Stamp>
        </div>
      )}
      <Footnote delay={prison + 6} top={1285}>
        Peines maximales encourues pour une personne physique, selon les conditions légales ; elles ne sont pas automatiques.
        Source : loi n° 2004-575 du 21 juin 2004 (LCEN), art. 1-1 et 1-2.
      </Footnote>
    </AbsoluteFill>
  );
};
