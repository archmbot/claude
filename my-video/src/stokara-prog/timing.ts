// Minutage de la publicité « Installer le programme Stokara » (35 s, 1080 × 1920, 30 i/s), calé sur la voix off.
import { createTiming } from "../components/voiceTiming";
import EV from "./events.json";
import { VOICE } from "./voice";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 35 * FPS;
export const { SEQS, timing } = createTiming(VOICE, FPS);

type Ev = { seq: number; p: string; n?: number; add?: number };
const RAW = EV as unknown as Record<string, Ev | string>;
export type EvName = Exclude<keyof typeof EV, "_">;

// Image absolue de chaque repère (même calcul que scripts/stokara-prog/make-audio.mjs)
export const E = {} as Record<EvName, number>;
Object.keys(RAW).forEach((k) => {
  if (k === "_") return;
  const e = RAW[k] as Ev;
  E[k as EvName] = SEQS[e.seq].from + timing(e.seq).T(e.p, e.n ?? 0, e.add ?? 0);
});

// Scènes (images absolues) : chacune commence un peu avant sa voix
export const SCENE = {
  hook: 0,
  download: E.s2,
  install: E.s3, // installation, jusqu'au « programme en ligne »
  network: E.net, // aucun port à ouvrir : le programme appelle le site
  modes: E.s5, // serveur seul, ou serveur + copie sur le site
  panne: E.panne, // le serveur tombe : rien n'est coupé
  end: E.s7,
};
