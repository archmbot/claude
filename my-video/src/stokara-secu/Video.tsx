// Publicité « Sécurité et contrôle » — 30 s, format vertical 1080 × 1920 (Reels, TikTok, Shorts),
// voix off française et sous-titres. Écrans réels de Stokara (copie de démonstration, données fictives) :
// droits par dossier (voir, modifier, supprimer, partager), lecture seule, dossier confidentiel et mot de
// passe, connexion verrouillée, appareil déconnecté, journal ; illustration du chiffrement (AES-256, une clé
// par espace) et de l'hébergement en France (o2switch). Stokara est développé par QYLINE.
import React from "react";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import { useStkFonts } from "../stokara/ui";
import { AdConf, AdProvider, Background, BrandPill, Captions, Headline, Shaker, Swipes, Title } from "../stokara-pub/kit";
import { ActAccess, ActCrypto, ActEnd, ActHook, ActLog, ActPeople, ActRights } from "./scenes";
import { E, FPS, SCENE } from "./timing";
import { VOICE } from "./voice";

// Tempo de scripts/stokara-secu/make-audio.mjs : grosse caisse sur chaque temps, de « Avec Stokara » au plan de fin
const BPM = 124;
const CONF: AdConf = {
  words: VOICE.words.map((w) => ({ text: w.text, start: w.start, end: w.end, scene: w.seq, sentence: w.para })),
  bpm: BPM,
  beatFrom: E.s2,
  beatTo: SCENE.end - (FPS * 60) / BPM,
  hits: [E.s2, E.lock, E.chiffre, SCENE.end + 2],
  brandFrom: E.logo + 20,
  brandTo: SCENE.end,
};

const TITLES: Title[] = [
  { at: 0, until: SCENE.rights, parts: ["Qui peut voir", "\n", ["vos fichiers ?"]], size: 84, top: 250 },
  { at: SCENE.rights + 2, until: SCENE.people, kicker: "Droits par dossier", parts: ["C'est vous", ["qui décidez"]], size: 72 },
  { at: SCENE.people + 2, until: SCENE.access, kicker: "Accès sur mesure", parts: ["Lecture seule ou", "\n", ["dossier confidentiel"]], size: 64 },
  { at: SCENE.access + 2, until: SCENE.log, kicker: "Comptes protégés", parts: ["Verrouillage et", "\n", ["appareils déconnectés"]], size: 62 },
  { at: SCENE.log + 2, until: SCENE.crypto, kicker: "Journal", parts: ["Chaque action", "\n", ["est tracée"]], size: 74 },
  { at: SCENE.crypto + 2, until: SCENE.end, kicker: "Sur le site", parts: [["Chiffré"], "et hébergé", "\n", "en France"], size: 74 },
];

export const StokaraSecurite: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  useStkFonts();
  return (
    <AdProvider conf={CONF}>
      <AbsoluteFill style={{ background: "#eef0fb" }}>
        <Html5Audio src={staticFile("stokara-secu/audio.wav")} />
        <Background />
        <Shaker>
          <ActHook />
          <ActRights />
          <ActPeople />
          <ActAccess />
          <ActLog />
          <ActCrypto />
          <ActEnd />
        </Shaker>
        <BrandPill />
        <Headline titles={TITLES} />
        {subtitles && <Captions hideFrom={SCENE.end} />}
        <Swipes at={[SCENE.rights, SCENE.people, SCENE.access, SCENE.log, SCENE.crypto, SCENE.end]} />
      </AbsoluteFill>
    </AdProvider>
  );
};
