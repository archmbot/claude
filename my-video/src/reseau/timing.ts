// Minutage du chapitre 1.1 : tout est calé sur la voix off (src/reseau/voice.ts, généré).
import { VOICE } from "./voice";

export const FPS = 25;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = Math.ceil(VOICE.duration * FPS);

const f = (sec: number) => Math.round(sec * FPS);

// Séquences en images absolues ; `card` = fin du carton de titre
export const SEQS = VOICE.seqs.map((s) => ({ id: s.id, from: f(s.start), card: f(s.cardEnd) - f(s.start), duration: f(s.end) - f(s.start) }));

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[«»"“”()?!.,;:…\u00a0]/g, " ")
    .trim();

const cache = new Map<string, number>();

// Instant (s) où la voix commence une expression dans une séquence ; n = n-ième occurrence
export const cueSec = (seq: number, phrase: string, n = 0) => {
  const key = `${seq}|${phrase}|${n}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const words = VOICE.words.filter((w) => w.seq === seq);
  const parts = norm(phrase).split(/\s+/);
  let count = 0;
  for (let i = 0; i + parts.length <= words.length; i++) {
    const ok = parts.every((p, k) => {
      const w = norm(words[i + k].text);
      return k === parts.length - 1 ? w.startsWith(p) : w === p;
    });
    if (ok && count++ === n) {
      cache.set(key, words[i].start);
      return words[i].start;
    }
  }
  throw new Error(`Repère vocal introuvable : « ${phrase} » (séquence ${seq + 1})`);
};

// Outils de minutage d'une séquence, en images relatives à son début
export const timing = (seq: number) => {
  const s0 = VOICE.seqs[seq].start;
  const paras = VOICE.paras.filter((p) => p.seq === seq);
  return {
    T: (phrase: string, n = 0, offsetSec = 0) => f(cueSec(seq, phrase, n) + offsetSec - s0),
    PS: (k: number) => f(paras[k].start - s0),
    PE: (k: number) => f(paras[k].end - s0),
    END: f(VOICE.seqs[seq].end) - f(s0),
    sec: (x: number) => f(x),
  };
};
