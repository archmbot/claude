// Tutoriel « Stokara : le guide complet » — 1920 × 1080, ≈ 13 min, voix off française, sous-titres.
// Stokara est développé par QYLINE (micro-entreprise de Mathias Javierre).
// Écrans réels de Stokara (copie de démonstration, données fictives) et reconstitution de Windows 11
// pour l'ajout de Stokara comme emplacement réseau (WebDAV).
import React, { useMemo } from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { buildChunks } from "../components/Subtitles";
import { IconName } from "./icons";
import { Opening, S1, S10, S2, S3, S4, S5, S6, S7, S8, S9 } from "./scenes1";
import { S11, S12, S13, S14, S15, S16, S17, S18, S19 } from "./scenes2";
import { DURATION, SEQS } from "./timing";
import { ChapterCard, FONT, K, Stage, clamp, useStkFonts } from "./ui";
import { VOICE } from "./voice";

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19];
const CHAPTERS: Record<string, { n: number; title: string; sub: string; icon: IconName }> = {
  S2: { n: 1, title: "Se connecter", sub: "Connexion, mot de passe oublié, première connexion", icon: "box-arrow-in-right" },
  S3: { n: 2, title: "L'explorateur de fichiers", sub: "Naviguer, importer, organiser, retrouver", icon: "folder2-open" },
  S8: { n: 3, title: "Partager", sub: "Liens sécurisés et envoi par e-mail", icon: "link-45deg" },
  S9: { n: 4, title: "La messagerie", sub: "Messages, pièces jointes, notifications", icon: "chat-dots-fill" },
  S10: { n: 5, title: "Mon compte", sub: "Profil, mot de passe, appareils connectés", icon: "person-circle" },
  S11: { n: 6, title: "Stokara dans Windows", sub: "Ce PC → Ajouter un emplacement réseau", icon: "pc-display" },
  S14: { n: 7, title: "Administration", sub: "Comptes, droits, stockage, serveur", icon: "shield-lock-fill" },
  S17: { n: 8, title: "Côté serveur", sub: "Installation et Panneau du serveur", icon: "hdd-stack" },
};
const XF = 8; // fondu entre deux séquences sans carton

const WORDS = VOICE.words.map((w) => ({ text: w.text, start: w.start, end: w.end, scene: w.seq, sentence: w.para }));

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => buildChunks(WORDS, 12, 62), []);
  const t = f / fps;
  const c = chunks.find((x) => t >= x.start - 0.05 && t < x.end);
  if (!c) return null;
  const pop = spring({ frame: f - Math.round(c.start * fps), fps, config: { damping: 16, stiffness: 240 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 946, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 1500,
          background: "rgba(21,28,60,.88)",
          borderRadius: 18,
          padding: "10px 28px 12px",
          boxShadow: "0 12px 30px rgba(21,28,60,.3)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "4px 12px",
          opacity: interpolate(pop, [0, 0.4], [0, 1], clamp),
          transform: `translateY(${(1 - pop) * 14}px)`,
        }}
      >
        {c.words.map((w) => (
          <span key={w.i} style={{ fontFamily: FONT, fontWeight: 500, fontSize: 34, lineHeight: 1.25, color: t >= w.start ? "#fff" : "rgba(255,255,255,.55)" }}>
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 0, top: 0, height: 5, width: `${(f / (DURATION - 1)) * 100}%`, background: `linear-gradient(90deg, ${K.blue}, ${K.orange})` }} />;
};

const FadeIn: React.FC<{ on: boolean; children: React.ReactNode }> = ({ on, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: on ? interpolate(f, [0, XF], [0, 1], clamp) : 1 }}>{children}</AbsoluteFill>;
};

export const StokaraTuto: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  useStkFonts();
  const s1 = SEQS[0].from;
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Html5Audio src={staticFile("stokara/audio.wav")} />
      {SEQS.map((s, i) => {
        const Scene = SCENES[i];
        const chap = CHAPTERS[s.id];
        const last = i === SEQS.length - 1;
        return (
          <Sequence key={s.id} name={`${s.id}${chap ? ` · ${chap.title}` : ""}`} from={s.from} durationInFrames={s.duration + (last ? DURATION - s.from - s.duration : XF)} premountFor={30}>
            <FadeIn on={i > 0 && !chap}>
              <Stage>
                <Scene />
              </Stage>
            </FadeIn>
            {chap && s.card > 0 && (
              <Sequence durationInFrames={s.card + 4} layout="none">
                <ChapterCard n={chap.n} title={chap.title} sub={chap.sub} icon={chap.icon} duration={s.card} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      <Sequence name="Ouverture" durationInFrames={s1 + 14}>
        <OpeningFade end={s1 + 14} />
      </Sequence>
      {subtitles && <Captions />}
      <Progress />
    </AbsoluteFill>
  );
};

const OpeningFade: React.FC<{ end: number }> = ({ end }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [end - 14, end], [1, 0], clamp) }}>
      <Opening />
    </AbsoluteFill>
  );
};
