// Publicité Stokara — 30 s, format vertical 1080 × 1920 (Reels, TikTok, Shorts, stories), voix off
// française et sous-titres. Écrans réels de Stokara (copie de démonstration, données fictives) et
// reconstitution de Windows 11 (« Connecter un lecteur réseau »). Stokara est développé par QYLINE.
import React from "react";
import { AbsoluteFill, Html5Audio, staticFile, useCurrentFrame } from "remotion";
import { useStkFonts } from "../stokara/ui";
import { Background, BrandPill, Captions, Headline, Swipes, Title, shake } from "./kit";
import { ActEnd, ActPrice, ActTeam, ActUpload, ActWhere, ActWindows } from "./scenes";
import { E, SCENE } from "./timing";

const TITLES: Title[] = [
  { at: 0, until: SCENE.upload, parts: ["Vos documents coincés", "\n", "sur", ["un seul PC\u00a0?"]], size: 76, top: 250 },
  { at: SCENE.upload + 2, until: SCENE.windows, kicker: "Simple et rapide", parts: ["Vos dossiers", ["en ligne"], "\n", "en un glisser-déposer"], size: 64 },
  { at: SCENE.windows + 2, until: SCENE.where, kicker: "Lecteur réseau", parts: ["Directement dans", "\n", ["l'Explorateur Windows"]] },
  { at: SCENE.where + 2, until: SCENE.team, kicker: "Où vous voulez", parts: ["Serveur local ou en ligne,", "\n", ["accessible partout"]], size: 64 },
  { at: SCENE.team + 2, until: SCENE.price, kicker: "Entreprises", parts: ["Plusieurs comptes,", "\n", ["chacun ses accès"]] },
  { at: SCENE.price + 2, until: SCENE.end, kicker: "Sans engagement", parts: ["Des tarifs", ["simples"]], size: 76 },
];

// Les scènes tremblent légèrement sur les temps forts de la musique
const Shaker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [x, y] = shake(useCurrentFrame());
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)` }}>{children}</AbsoluteFill>;
};

export const StokaraPub: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  useStkFonts();
  return (
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
      <Swipes at={[SCENE.upload, SCENE.windows, SCENE.where, SCENE.team, SCENE.price, SCENE.end]} />
    </AbsoluteFill>
  );
};

