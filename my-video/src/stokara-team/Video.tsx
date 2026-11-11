// Publicité « Partager et travailler ensemble » — 30 s, format vertical 1080 × 1920 (Reels, TikTok, Shorts),
// voix off française et sous-titres. Écrans réels de Stokara (copie de démonstration, données fictives) :
// lien de partage (durée, mot de passe, téléchargements), page du client sans compte, messagerie,
// corbeille ; Excel reconstitué pour « Modifier dans Excel » et Ctrl+S. Stokara est développé par QYLINE.
import React from "react";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import { useStkFonts } from "../stokara/ui";
import { AdConf, AdProvider, Background, BrandPill, Captions, Headline, Shaker, Swipes, Title } from "../stokara-pub/kit";
import { ActClient, ActEnd, ActHook, ActOffice, ActShare, ActTeam, ActTrash } from "./scenes";
import { E, FPS, SCENE } from "./timing";
import { VOICE } from "./voice";

// Tempo de scripts/stokara-team/make-audio.mjs : grosse caisse sur chaque temps, de « Avec Stokara » au plan de fin
const BPM = 124;
const CONF: AdConf = {
  words: VOICE.words.map((w) => ({ text: w.text, start: w.start, end: w.end, scene: w.seq, sentence: w.para })),
  bpm: BPM,
  beatFrom: E.s2,
  beatTo: SCENE.end - (FPS * 60) / BPM,
  hits: [E.s2, E.created, E.save, SCENE.end + 2],
  brandFrom: E.logo + 20,
  brandTo: SCENE.end,
};

const TITLES: Title[] = [
  { at: 0, until: SCENE.share, parts: ["Un devis à envoyer", "\n", ["à un client ?"]], size: 80, top: 250 },
  { at: SCENE.share + 2, until: SCENE.client, kicker: "Lien de partage", parts: ["Un lien", ["sécurisé"], "\n", "en deux clics"], size: 70 },
  { at: SCENE.client + 2, until: SCENE.team, kicker: "Côté client", parts: ["Ouvert", ["sans compte"]], size: 74 },
  { at: SCENE.team + 2, until: SCENE.office, kicker: "En équipe", parts: ["La messagerie", "\n", ["intégrée"]], size: 74 },
  { at: SCENE.office + 2, until: SCENE.trash, kicker: "Excel · Word · PowerPoint", parts: [["Ctrl+S"], "enregistre", "\n", "dans Stokara"], size: 70 },
  { at: SCENE.trash + 2, until: SCENE.end, kicker: "Corbeille", parts: [["30 jours"], "pour", "\n", "tout restaurer"], size: 72 },
];

export const StokaraEquipe: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  useStkFonts();
  return (
    <AdProvider conf={CONF}>
      <AbsoluteFill style={{ background: "#eef0fb" }}>
        <Html5Audio src={staticFile("stokara-team/audio.wav")} />
        <Background />
        <Shaker>
          <ActHook />
          <ActShare />
          <ActClient />
          <ActTeam />
          <ActOffice />
          <ActTrash />
          <ActEnd />
        </Shaker>
        <BrandPill />
        <Headline titles={TITLES} />
        {subtitles && <Captions hideFrom={SCENE.end} />}
        <Swipes at={[SCENE.share, SCENE.client, SCENE.team, SCENE.office, SCENE.trash, SCENE.end]} />
      </AbsoluteFill>
    </AdProvider>
  );
};
