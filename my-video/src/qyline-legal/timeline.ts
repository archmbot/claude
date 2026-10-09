// Vidéo QYLINE « mentions légales » : 60 s, 30 i/s, vertical 1080 × 1920.
import { VOICE } from "./voice";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 60 * FPS; // 1 800 images

// Scènes (en images). Les coupes tombent sur les temps de la musique (120 BPM).
export const SCENES = [
  { id: "alert", from: 0, duration: 7 * FPS },
  { id: "risk", from: 7 * FPS, duration: 10 * FPS },
  { id: "rules", from: 17 * FPS, duration: 13 * FPS },
  { id: "fix", from: 30 * FPS, duration: 12 * FPS },
  { id: "qyline", from: 42 * FPS, duration: 10 * FPS },
  { id: "outro", from: 52 * FPS, duration: 8 * FPS },
] as const;

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\d.']/gu, "");

// Image (absolue) où la voix commence à prononcer un mot ; n = n-ième occurrence.
export const cue = (word: string, n = 0) => {
  const hits = VOICE.words.filter((w) => norm(w.text).startsWith(norm(word)));
  const hit = hits[n];
  if (!hit) throw new Error(`Repère vocal introuvable : ${word}`);
  return Math.round(hit.start * FPS);
};

// Même repère, relatif au début de la scène (pour les composants dans une <Sequence>)
export const localCue = (scene: number, word: string, n = 0) => cue(word, n) - SCENES[scene].from;
