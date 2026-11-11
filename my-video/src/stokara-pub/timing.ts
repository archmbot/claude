// Minutage de la publicité Stokara (30 s, 1080 × 1920, 30 i/s), calé sur la voix off.
import { createTiming } from "../components/voiceTiming";
import EV from "./events.json";
import { VOICE } from "./voice";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 30 * FPS; // format publicitaire : 30 s pile
export const { SEQS, timing } = createTiming(VOICE, FPS);

type Ev = { seq: number; p: string; n?: number; add?: number };
const RAW = EV as unknown as Record<string, Ev | string>;
export type EvName = Exclude<keyof typeof EV, "_">;

// Image absolue de chaque repère (même calcul que scripts/stokara-pub/make-audio.mjs)
export const E = {} as Record<EvName, number>;
Object.keys(RAW).forEach((k) => {
  if (k === "_") return;
  const e = RAW[k] as Ev;
  E[k as EvName] = SEQS[e.seq].from + timing(e.seq).T(e.p, e.n ?? 0, e.add ?? 0);
});

// Bornes des scènes (images absolues) : chaque scène commence un peu avant sa voix
export const SCENE = {
  hook: 0,
  upload: E.s2,
  windows: E.s3,
  where: E.s4,
  team: E.s5,
  price: E.s6,
  end: E.s7,
};
