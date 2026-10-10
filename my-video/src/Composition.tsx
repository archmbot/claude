// QYLINE — « Site vitrine ou boutique en ligne : lequel choisir ? »
// Vidéo verticale 1080 × 1920, 80 s à 30 i/s (2 400 images) pour TikTok, Reels et Shorts.
// Voix off française, sous-titres synchronisés, musique et bruitages synthétisés (public/qyline-choix/audio.wav).
import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Header } from "./components/Logo";
import { Subtitles } from "./components/Subtitles";
import { Backdrop, P } from "./components/theme";
import { SceneIn, Wipe, useFonts } from "./qyline/shared";
import { BoutiqueEnLigne } from "./scenes/BoutiqueEnLigne";
import { Comparaison } from "./scenes/Comparaison";
import { Conclusion } from "./scenes/Conclusion";
import { Intro } from "./scenes/Intro";
import { SiteVitrine } from "./scenes/SiteVitrine";
import { Solutions } from "./scenes/Solutions";
import { Tarifs } from "./scenes/Tarifs";
import { DURATION, SCENES, SUBTITLE_OFFSET, SUBTITLE_TOP } from "./timeline";
import { VOICE } from "./voiceover";

const COMPONENTS = [Intro, SiteVitrine, BoutiqueEnLigne, Comparaison, Solutions, Tarifs, Conclusion];
// bleu nuit pour l'accroche, les tarifs et la conclusion ; bleu quadrillé du site pour les démonstrations
const NIGHT = [true, false, false, false, false, true, true];

// Mots surlignés en violet dans les sous-titres
const KEY_PHRASES = [
  "site vitrine",
  "boutique en ligne",
  "625 €",
  "950 €",
  "qyline.org",
  "qyline",
  "devis",
  "contacts",
  "vendre directement",
  "stocks",
  "commandes",
  "livraisons",
  "catalogue",
  "paiement en ligne",
  "premier échange gratuit",
  "toute heure",
  "zone géographique",
];

export const QylineChoix: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: P.night }}>
      <Html5Audio src={staticFile("qyline-choix/audio.wav")} />
      {SCENES.map((s, i) => {
        const Scene = COMPONENTS[i];
        return (
          <Sequence key={s.id} name={s.id} from={s.from} durationInFrames={s.duration} premountFor={30}>
            <Backdrop night={NIGHT[i]} />
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
      <Subtitles
        words={VOICE.words}
        keyPhrases={KEY_PHRASES}
        top={SUBTITLE_TOP}
        left={100}
        right={140}
        offset={SUBTITLE_OFFSET}
        keyBg={P.violet}
        keyColor={P.white}
        shadow={P.navy}
      />
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 10, width: `${(frame / (DURATION - 1)) * 100}%`, background: `linear-gradient(90deg, ${P.violet}, ${P.blue})` }} />
    </AbsoluteFill>
  );
};
