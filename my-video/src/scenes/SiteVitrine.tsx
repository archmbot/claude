// SCÈNE 2 (8-21 s) — LE SITE VITRINE : un ordinateur affiche un site d'artisan fictif qui défile,
// le curseur clique sur « Demander un devis » et une notification de demande arrive.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedWebsite } from "../components/AnimatedWebsite";
import { Chip, Cursor, LaptopFrame, P, Stamp, Toast, clamp } from "../components/theme";
import { FPS, SCENES, cueSeconds, localEv } from "../timeline";

// Arrêts du défilement (fraction de la page) : présentation, prestations, réalisations, coordonnées, formulaire
const STOPS = [0, 0.267, 0.402, 0.568, 0.804, 1];
const MOVES = [30, 70, 110, 150, 190]; // début de chaque mouvement (images locales), 20 images chacun

const scrollAt = (frame: number) => {
  let v = STOPS[0];
  MOVES.forEach((m, i) => {
    v += (STOPS[i + 1] - STOPS[i]) * interpolate(frame, [m, m + 20], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  });
  return v;
};

export const LAPTOP = { left: 70, top: 330, width: 940, screen: 560 };
// Centre du bouton « Demander un devis » une fois la page en bas (mesuré sur le rendu)
const BUTTON = { x: LAPTOP.left + 240, y: LAPTOP.top + 418 }; // pointe du curseur : +12, +6 px

export const SiteVitrine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word = localEv(1, "vitrineWord");
  const click = localEv(1, "vitrineClick");
  const notif = localEv(1, "vitrineNotif");
  const local = (w: string) => Math.round(cueSeconds(1, w) * FPS) - SCENES[1].from;
  const enter = spring({ frame: frame - 2, fps, config: { damping: 15, stiffness: 110 } });
  const cur = interpolate(frame, [click - 50, click - 4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const press = frame >= click && frame < click + 6 ? 1 : 0;
  const after = interpolate(frame, [click, click + 10], [0, 1], clamp);
  const chips = [
    { label: "Présenter", at: local("présente") },
    { label: "Rassurer", at: local("réalisations") },
    { label: "Être contacté", at: click },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 205, display: "flex", justifyContent: "center" }}>
        <Stamp delay={word - 2} size={50} rotate={-2}>
          SITE VITRINE
        </Stamp>
      </div>
      <div
        style={{
          position: "absolute",
          left: LAPTOP.left,
          top: LAPTOP.top,
          perspective: 1800,
          opacity: interpolate(enter, [0, 0.15], [0, 1], clamp),
          transform: `translateY(${(1 - enter) * 500}px)`,
        }}
      >
        <div style={{ transform: `rotateX(${(1 - enter) * 40 + 3}deg)`, transformOrigin: "50% 100%" }}>
          <LaptopFrame width={LAPTOP.width} screenHeight={LAPTOP.screen}>
            <AnimatedWebsite bare variant="vitrine" width={LAPTOP.width - 32} height={LAPTOP.screen} url="atelier-demo.fr" scroll={scrollAt(frame)} ctaPress={press} ctaGlow={after * 0.6} />
          </LaptopFrame>
        </div>
      </div>
      {frame >= click - 50 && frame < click + 40 && (
        <Cursor x={interpolate(cur, [0, 1], [980, BUTTON.x])} y={interpolate(cur, [0, 1], [1050, BUTTON.y])} press={press === 1} opacity={interpolate(frame, [click + 25, click + 40], [1, 0], clamp)} />
      )}
      {frame >= notif && (
        <div style={{ position: "absolute", left: 470, top: 300 }}>
          <Toast title="Nouvelle demande reçue !" subtitle="Demande de devis · démonstration" progress={spring({ frame: frame - notif, fps, config: { damping: 13, stiffness: 180 } })} width={560} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", gap: 22 }}>
        {chips.map((c, i) => (
          <Chip key={c.label} label={c.label} color={i === 2 ? P.green : P.violet} progress={spring({ frame: frame - c.at, fps, config: { damping: 12, stiffness: 200 } })} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
