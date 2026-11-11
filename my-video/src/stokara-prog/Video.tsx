// Publicité « Installer le programme Stokara » — 35 s, format vertical 1080 × 1920 (Reels, TikTok, Shorts),
// voix off française et sous-titres. Téléchargement du programme depuis l'administration, installation sur le
// serveur Windows (console de INSTALLER.bat), choix du dossier à synchroniser, fonctionnement en serveur local
// (aucun port à ouvrir : le programme appelle le site), puis choix du stockage : serveur seul, ou serveur +
// copie de secours sur le site (serveur en panne : rien n'est coupé). Stokara est développé par QYLINE.
import React from "react";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import { useStkFonts } from "../stokara/ui";
import { AdConf, AdProvider, Background, BrandPill, Captions, Headline, Shaker, Swipes, Title } from "../stokara-pub/kit";
import { ActDownload, ActEnd, ActHook, ActInstall, ActModes, ActNetwork, ActPanne } from "./scenes";
import { E, FPS, SCENE } from "./timing";
import { VOICE } from "./voice";

// Tempo de scripts/stokara-prog/make-audio.mjs : grosse caisse sur chaque temps, de « Avec Stokara » au plan de fin
const BPM = 124;
const CONF: AdConf = {
  words: VOICE.words.map((w) => ({ text: w.text, start: w.start, end: w.end, scene: w.seq, sentence: w.para })),
  bpm: BPM,
  beatFrom: E.s2,
  beatTo: SCENE.end - (FPS * 60) / BPM,
  hits: [E.s2, E.online, E.fail, SCENE.end + 2],
  brandFrom: E.logo + 20,
  brandTo: SCENE.end,
};

const TITLES: Title[] = [
  { at: 0, until: SCENE.download, parts: ["Vos fichiers sur le", "\n", ["serveur du bureau\u00a0?"]], size: 76, top: 250 },
  { at: SCENE.download + 2, until: SCENE.install, kicker: "Étape 1", parts: ["Téléchargez", ["le programme"]], size: 64 },
  { at: SCENE.install + 2, until: SCENE.network, kicker: "Étape 2", parts: ["Installez, puis choisissez", "\n", ["le dossier à synchroniser"]], size: 58 },
  { at: SCENE.network + 2, until: SCENE.modes, kicker: "Serveur local", parts: ["Aucun port à ouvrir,", "\n", ["aucune box à régler"]], size: 64 },
  { at: SCENE.modes + 2, until: SCENE.panne, kicker: "Étape 3", parts: ["Serveur seul,", "\n", ["ou copie sur le site"]], size: 66 },
  { at: SCENE.panne + 2, until: SCENE.end, kicker: "Copie de secours", parts: ["Serveur en panne\u00a0?", "\n", ["Rien n'est coupé"]], size: 68 },
];

export const StokaraProgramme: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  useStkFonts();
  return (
    <AdProvider conf={CONF}>
      <AbsoluteFill style={{ background: "#eef0fb" }}>
        <Html5Audio src={staticFile("stokara-prog/audio.wav")} />
        <Background />
        <Shaker>
          <ActHook />
          <ActDownload />
          <ActInstall />
          <ActNetwork />
          <ActModes />
          <ActPanne />
          <ActEnd />
        </Shaker>
        <BrandPill />
        <Headline titles={TITLES} />
        {subtitles && <Captions hideFrom={SCENE.end} />}
        <Swipes at={[SCENE.download, SCENE.install, SCENE.network, SCENE.modes, SCENE.panne, SCENE.end]} />
      </AbsoluteFill>
    </AdProvider>
  );
};
