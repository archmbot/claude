// QYLINE — « Votre site internet peut vous coûter 75 000 € d'amende ! »
// Vidéo verticale 1080 × 1920, 60 s à 30 i/s, voix off française et sous-titres synchronisés.
import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { SceneIn, Wipe, useFonts } from "../qyline/shared";
import { S1Alert } from "./scenes/S1Alert";
import { S2Risk } from "./scenes/S2Risk";
import { S3Rules } from "./scenes/S3Rules";
import { S4Fix } from "./scenes/S4Fix";
import { S5Qyline } from "./scenes/S5Qyline";
import { S6Outro } from "./scenes/S6Outro";
import { DURATION, SCENES } from "./timeline";
import { Backdrop, C, Captions, Header } from "./ui";

const COMPONENTS = [S1Alert, S2Risk, S3Rules, S4Fix, S5Qyline, S6Outro];
// fonds : bleu quadrillé du site, bleu nuit pour le risque et la conclusion
const DARK = [false, true, false, false, false, true];
const VIOLET = [0, 0.55, 0, 0, 0, 1];

export const QylineLegal: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.blue }}>
      <Html5Audio src={staticFile("qyline-legal/audio.wav")} />
      {SCENES.map((s, i) => {
        const Scene = COMPONENTS[i];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.duration} premountFor={30}>
            <Backdrop dark={DARK[i]} violet={VIOLET[i]} />
            <SceneIn>
              <Scene />
            </SceneIn>
          </Sequence>
        );
      })}
      {SCENES.slice(1).map((s) => (
        <Wipe key={s.id} at={s.from} />
      ))}
      <Header />
      <Captions />
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 10, width: `${(frame / (DURATION - 1)) * 100}%`, background: C.yellow }} />
    </AbsoluteFill>
  );
};
