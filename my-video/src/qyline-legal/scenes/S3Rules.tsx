// Scène 3 (17-30 s) — CE QUI EST OBLIGATOIRE : page « Mentions légales » d'exemple + liste cochée.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { localCue } from "../timeline";
import { BODY, C, CheckBox, HEAD, LaptopFrame, Stamp, clamp, hard } from "../ui";

const ITEMS = [
  "Identité de l'entreprise",
  "Adresse et coordonnées",
  "Informations d'immatriculation",
  "Informations sur l'hébergeur",
  "Autres informations selon l'activité",
];

// Contenu d'exemple, clairement fictif
const SECTIONS = [
  { label: "Éditeur du site", value: "Atelier Démo, entreprise individuelle" },
  { label: "Coordonnées", value: "1 rue de l'Exemple · contact@exemple.fr" },
  { label: "Immatriculation", value: "SIREN : 123 456 789 (numéro fictif)" },
  { label: "Hébergeur", value: "Nom, adresse et téléphone de l'hébergeur" },
];

export const S3Rules: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const checks = [
    localCue(2, "identité"),
    localCue(2, "coordonnées"),
    localCue(2, "d'immatriculation"),
    localCue(2, "hébergeur"),
    localCue(2, "hébergeur") + 24,
  ];
  const access = localCue(2, "facilement");
  const laptop = spring({ frame: frame - 4, fps, config: { damping: 15, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 205,
          opacity: interpolate(laptop, [0, 0.15], [0, 1], clamp),
          transform: `translateY(${(1 - laptop) * -500}px)`,
        }}
      >
        <LaptopFrame width={900} screenHeight={470}>
          <div style={{ padding: "26px 38px", fontFamily: BODY }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#7A86A8" }}>atelier-demo.fr / mentions-legales</div>
            <div style={{ marginTop: 6, fontFamily: HEAD, fontWeight: 800, fontSize: 50, color: C.navy }}>Mentions légales</div>
            <div style={{ marginTop: 10 }}>
              {SECTIONS.map((s, i) => {
                const on = interpolate(frame, [checks[i], checks[i] + 8], [0, 1], clamp);
                return (
                  <div key={s.label} style={{ position: "relative", padding: "8px 12px", marginLeft: -12, marginBottom: 4 }}>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(245,197,24,0.8)", transform: `scaleX(${on})`, transformOrigin: "left" }} />
                    <div style={{ position: "relative", fontSize: 21, fontWeight: 800, color: C.navy }}>{s.label}</div>
                    <div style={{ position: "relative", fontSize: 21, fontWeight: 600, color: "#3A4466" }}>{s.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              right: 30,
              top: 64,
              padding: "8px 18px",
              border: `4px solid ${C.red}`,
              color: C.red,
              fontFamily: BODY,
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: "0.08em",
              transform: "rotate(-10deg)",
              opacity: interpolate(frame, [26, 34], [0, 0.9], clamp),
            }}
          >
            EXEMPLE FICTIF
          </div>
        </LaptopFrame>
      </div>
      {frame >= access - 2 && (
        <div style={{ position: "absolute", right: 60, top: 640 }}>
          <Stamp delay={access - 2} size={38} rotate={4}>
            FACILEMENT ACCESSIBLES
          </Stamp>
        </div>
      )}
      <div style={{ position: "absolute", left: 70, top: 800 }}>
        {ITEMS.map((label, i) => {
          const enter = spring({ frame: frame - 16 - i * 6, fps, config: { damping: 16, stiffness: 170 } });
          const done = interpolate(frame, [checks[i], checks[i] + 10], [0, 1], clamp);
          return (
            <div
              key={label}
              style={{
                width: 940,
                height: 92,
                marginBottom: 16,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 26px",
                background: C.white,
                border: `3px solid ${C.navy}`,
                borderLeft: `14px solid ${done > 0.5 ? C.yellow : C.navy}`,
                boxShadow: hard(done > 0.5 ? 10 : 7),
                opacity: interpolate(enter, [0, 0.2], [0, 1], clamp),
                transform: `translateX(${(1 - enter) * 1100}px)`,
              }}
            >
              <CheckBox progress={done} />
              <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 38, color: C.navy, opacity: 0.55 + 0.45 * done }}>{label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
