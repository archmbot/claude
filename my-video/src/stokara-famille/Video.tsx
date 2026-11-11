// Publicité « Particuliers et familles » — 30 s, format vertical 1080 × 1920 (Reels, TikTok, Shorts),
// voix off française et sous-titres. Interface mobile de Stokara reconstituée d'après la vraie (espace
// familial fictif « Famille Martin ») : photos et papiers rassemblés, en ligne et chiffrés ; jusqu'à
// 5 membres ; papiers importants ; un album envoyé par un lien ; 3 € par mois pour 20 Go.
// Stokara est développé par QYLINE.
import React from "react";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import { useStkFonts } from "../stokara/ui";
import { AdConf, AdProvider, Background, BrandPill, Captions, Headline, Shaker, Swipes, Title } from "../stokara-pub/kit";
import { ActEnd, ActFamily, ActGather, ActLink, ActPapers, ActPrice } from "./scenes";
import { E, FPS, SCENE } from "./timing";
import { VOICE } from "./voice";

// Tempo de scripts/stokara-famille/make-audio.mjs : grosse caisse sur chaque temps, de « Avec Stokara » au plan de fin
const BPM = 124;
const CONF: AdConf = {
  words: VOICE.words.map((w) => ({ text: w.text, start: w.start, end: w.end, scene: w.seq, sentence: w.para })),
  bpm: BPM,
  beatFrom: E.s2,
  beatTo: SCENE.end - (FPS * 60) / BPM,
  hits: [E.s2, E.five, E.price, SCENE.end + 2],
  brandFrom: E.logo + 20,
  brandTo: SCENE.end,
};

const TITLES: Title[] = [
  { at: 0, until: SCENE.gather, parts: ["Vos photos et vos papiers", "\n", ["éparpillés partout ?"]], size: 62, top: 250 },
  { at: SCENE.gather + 2, until: SCENE.family, kicker: "Photos · papiers · souvenirs", parts: ["Tout", ["au même endroit"]], size: 70 },
  { at: SCENE.family + 2, until: SCENE.papers, kicker: "En famille", parts: ["Partagé avec", ["vos proches"]], size: 62 },
  { at: SCENE.papers + 2, until: SCENE.link, kicker: "Les papiers", parts: ["Toujours", ["sous la main"]], size: 74 },
  { at: SCENE.link + 2, until: SCENE.price, kicker: "Partage", parts: ["Un album entier,", "\n", ["un simple lien"]], size: 66 },
  { at: SCENE.price + 2, until: SCENE.end, kicker: "Particuliers", parts: ["Petit prix,", "\n", ["grande tranquillité"]], size: 66 },
];

export const StokaraFamille: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  useStkFonts();
  return (
    <AdProvider conf={CONF}>
      <AbsoluteFill style={{ background: "#eef0fb" }}>
        <Html5Audio src={staticFile("stokara-famille/audio.wav")} />
        <Background />
        <Shaker>
          <ActGather />
          <ActFamily />
          <ActPapers />
          <ActLink />
          <ActPrice />
          <ActEnd />
        </Shaker>
        <BrandPill />
        <Headline titles={TITLES} />
        {subtitles && <Captions hideFrom={SCENE.end} />}
        <Swipes at={[SCENE.family, SCENE.papers, SCENE.link, SCENE.price, SCENE.end]} />
      </AbsoluteFill>
    </AdProvider>
  );
};
