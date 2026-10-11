// Formation réseaux — Module 1, chapitre 1.1 « Qu'est-ce qu'un réseau informatique ? »
// Vidéo pédagogique 1920 × 1080, environ 25 min, voix off française, schémas animés, sous-titres.
import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Subtitles } from "../components/Subtitles";
import { useFonts } from "../qyline/shared";
import { S1, S2, S3, S4, S5 } from "./scenes1";
import { S10, S6, S7, S8, S9 } from "./scenes2";
import { DURATION, SEQS } from "./timing";
import { Background, C, FONT, clamp } from "./ui";
import { VOICE } from "./voice";

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
const TITLES = [
  "Introduction",
  "Définition d'un réseau informatique",
  "Pourquoi utiliser un réseau ?",
  "Comment deux appareils communiquent-ils ?",
  "Les supports de communication",
  "Les équipements d'un réseau",
  "Réseau local et Internet",
  "Exemple complet d'un réseau d'entreprise",
  "Questions et exercices",
  "Conclusion et transition",
];

const CAPTIONS = VOICE.words.map((w) => ({ text: w.text, start: w.start, end: w.end, scene: w.seq, sentence: w.para }));

// Carton de début de séquence (3 s, sans voix)
const SeqCard: React.FC<{ n: number; title: string; duration: number }> = ({ n, title, duration }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, duration - 8, duration], [0, 1, 1, 0], clamp);
  const s = interpolate(f, [0, 12], [0.9, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: o, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: C.device, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.text, transform: `scale(${s})` }}>{n}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.text }}>{title}</div>
    </AbsoluteFill>
  );
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: `${(f / (DURATION - 1)) * 100}%`, background: C.device, opacity: 0.8 }} />;
};

export const Reseau11: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />
      <Html5Audio src={staticFile("reseau-1-1/audio.wav")} />
      {SEQS.map((s, i) => {
        const Scene = SCENES[i];
        return (
          <Sequence key={s.id} name={`${i + 1}. ${TITLES[i]}`} from={s.from} durationInFrames={s.duration} premountFor={25}>
            <Scene />
            {i > 0 && (
              <Sequence durationInFrames={s.card} layout="none">
                <SeqCard n={i + 1} title={TITLES[i]} duration={s.card} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      {subtitles && <Subtitles words={CAPTIONS} keyPhrases={[]} top={968} left={180} right={180} fontSize={36} keyBg={C.data} keyColor={C.bg} shadow="#020617" maxWords={9} maxChars={56} />}
      <Progress />
    </AbsoluteFill>
  );
};
