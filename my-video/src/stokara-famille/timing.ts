// Minutage de la publicité « Particuliers et familles » (30 s, 1080 × 1920, 30 i/s), calé sur la voix off.
import { createTiming } from "../components/voiceTiming";
import EV from "./events.json";
import { VOICE } from "./voice";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 30 * FPS;
export const { SEQS, timing } = createTiming(VOICE, FPS);

type Ev = { seq: number; p: string; n?: number; add?: number };
const RAW = EV as unknown as Record<string, Ev | string>;
export type EvName = Exclude<keyof typeof EV, "_">;

// Image absolue de chaque repère (même calcul que scripts/stokara-famille/make-audio.mjs)
export const E = {} as Record<EvName, number>;
Object.keys(RAW).forEach((k) => {
  if (k === "_") return;
  const e = RAW[k] as Ev;
  E[k as EvName] = SEQS[e.seq].from + timing(e.seq).T(e.p, e.n ?? 0, e.add ?? 0);
});

// Scènes (images absolues) : chacune commence un peu avant sa voix
export const SCENE = {
  hook: 0,
  gather: E.s2, // tout au même endroit, en ligne et chiffré
  family: E.s3, // jusqu'à 5 membres, sur chaque téléphone
  papers: E.s4, // les papiers importants
  link: E.s5, // un album entier par un lien
  price: E.s6, // 3 € par mois pour 20 Go
  end: E.s7,
};
