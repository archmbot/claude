// Publicité Stokara — 30 s, format vertical 1080 × 1920 (Reels, TikTok, Shorts, stories), voix off
// française et sous-titres. Écrans réels de Stokara (copie de démonstration, données fictives) et
// reconstitution de Windows 11 (« Connecter un lecteur réseau »). Stokara est développé par QYLINE.
import React from "react";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import { useStkFonts } from "../stokara/ui";
import {
  AdConf,
  AdProvider,
  Background,
  BrandPill,
  Captions,
  Headline,
  Shaker,
  Swipes,
  Title,
} from "./kit";
import {
  ActEnd,
  ActPrice,
  ActTeam,
  ActUpload,
  ActWhere,
  ActWindows,
} from "./scenes";
import { E, FPS, SCENE } from "./timing";
import { VOICE } from "./voice";

const TITLES: Title[] = [
  {
    at: 0,
    until: SCENE.upload,
    parts: ["Vos documents coincés", "\n", "sur", ["un seul PC\u00a0?"]],
    size: 76,
    top: 250,
  },
  {
    at: SCENE.upload + 2,
    until: SCENE.windows,
    kicker: "Simple et rapide",
    parts: ["Vos dossiers", ["en ligne"], "\n", "en un glisser-déposer"],
    size: 64,
  },
  {
    at: SCENE.windows + 2,
    until: SCENE.where,
    kicker: "Lecteur réseau",
    parts: ["Directement dans", "\n", ["l'Explorateur Windows"]],
  },
  {
    at: SCENE.where + 2,
    until: SCENE.team,
    kicker: "Où vous voulez",
    parts: ["Serveur local ou en ligne,", "\n", ["accessible partout"]],
    size: 64,
  },
  {
    at: SCENE.team + 2,
    until: SCENE.price,
    kicker: "Entreprises",
    parts: ["Plusieurs comptes,", "\n", ["chacun ses accès"]],
  },
  {
    at: SCENE.price + 2,
    until: SCENE.end,
    kicker: "Sans engagement",
    parts: ["Des tarifs", ["simples"]],
    size: 76,
  },
];

// Tempo de scripts/stokara-pub/make-audio.mjs : grosse caisse sur chaque temps, de « Avec Stokara » au plan de fin
const BPM = 124;
const CONF: AdConf = {
  words: VOICE.words.map((w) => ({
    text: w.text,
    start: w.start,
    end: w.end,
    scene: w.seq,
    sentence: w.para,
  })),
  bpm: BPM,
  beatFrom: E.s2,
  beatTo: SCENE.end - (FPS * 60) / BPM,
  hits: [E.s2, E.drive, E.p1, E.p2, SCENE.end + 2],
  brandFrom: E.logo + 20,
  brandTo: SCENE.end,
};

export const StokaraPub: React.FC<{ subtitles?: boolean }> = ({
  subtitles = true,
}) => {
  useStkFonts();
  return (
    <AdProvider conf={CONF}>
      <AbsoluteFill style={{ background: "#eef0fb" }}>
        <Html5Audio src={staticFile("stokara-pub/audio.wav")} />
        <Background />
        <Shaker>
          <ActUpload />
          <ActWindows />
          <ActWhere />
          <ActTeam />
          <ActPrice />
          <ActEnd />
        </Shaker>
        <BrandPill />
        <Headline titles={TITLES} />
        {subtitles && <Captions hideFrom={E.s7} />}
        <Swipes
          at={[
            SCENE.upload,
            SCENE.windows,
            SCENE.where,
            SCENE.team,
            SCENE.price,
            SCENE.end,
          ]}
        />
      </AbsoluteFill>
    </AdProvider>
  );
};
