// Vidéo QYLINE « Site vitrine ou boutique en ligne ? » : 80 s, 30 i/s, vertical 1080 × 1920.
import EVENTS from "./events.json";
import { VOICE } from "./voiceover";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 80 * FPS; // 2 400 images

// Scènes (en images). Les coupes tombent sur les temps de la musique (120 BPM).
export const SCENES = [
  { id: "intro", from: 0, duration: 8 * FPS },
  { id: "vitrine", from: 8 * FPS, duration: 13 * FPS },
  { id: "boutique", from: 21 * FPS, duration: 13 * FPS },
  { id: "comparaison", from: 34 * FPS, duration: 13 * FPS },
  { id: "solutions", from: 47 * FPS, duration: 10 * FPS },
  { id: "tarifs", from: 57 * FPS, duration: 12 * FPS },
  { id: "conclusion", from: 69 * FPS, duration: 11 * FPS },
] as const;

// Synchronisation ajustable des sous-titres (secondes, positif = plus tard)
export const SUBTITLE_OFFSET = 0;
// Zone des sous-titres : au-dessus des interfaces TikTok / Instagram (bas d'écran et colonne de droite)
export const SUBTITLE_TOP = 1285;

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\d.']/gu, "");

// Instant (s) où la voix commence un mot dans une scène ; n = n-ième occurrence
export const cueSeconds = (scene: number, word: string, n = 0) => {
  const hits = VOICE.words.filter((w) => w.scene === scene && norm(w.text).startsWith(norm(word)));
  if (!hits[n]) throw new Error(`Repère vocal introuvable : ${word} (scène ${scene + 1})`);
  return hits[n].start;
};

type EventName = Exclude<keyof typeof EVENTS, "_doc">;
type EventDef = { at?: number; scene?: number; word?: string; n?: number; add?: number };

// Image absolue d'un repère d'interface (voir events.json)
export const ev = (name: EventName) => {
  const e = EVENTS[name] as EventDef;
  const sec = e.at ?? cueSeconds(e.scene ?? 0, e.word ?? "", e.n ?? 0) + (e.add ?? 0);
  return Math.round(sec * FPS);
};

// Même repère, relatif au début d'une scène (pour les composants dans une <Sequence>)
export const localEv = (scene: number, name: EventName) => ev(name) - SCENES[scene].from;
