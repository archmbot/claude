// Minutage de l'intro BLACK U15 BASKET (60 i/s, 25 s).
// Synchronisé avec scripts/black-u15/make-audio.mjs (repères en secondes ×60).
export const FPS = 60;
export const WIDTH = 1920; // rendu 4K avec --scale=2
export const HEIGHT = 1080;
export const DURATION = 25 * FPS;

const s = (sec: number) => Math.round(sec * FPS);

export const T = {
  lightOn: s(0.9), // point lumineux
  ballForm: s(1.4), // il devient un ballon holographique
  circuits: s(2.0), // circuits sur le terrain
  line1: s(2.2), // « DIX JOUEURS. »
  line2: s(2.9), // « UNE ÉQUIPE. »
  dive: s(3.6), // la caméra plonge vers le terrain
  players: s(4.0), // scène 2
  gather: s(13.0), // scène 3 : recul et rassemblement
  freeze: s(19.0), // scène 4 : face caméra
  flash: s(19.5), // révélation BLACK U15 BASKET
  ballLaunch: s(23.0), // scène 5 : rebond puis ballon vers l'objectif
  ballHit: s(24.5), // le ballon remplit l'écran : flash vers le match
};

// Début de chaque présentation de joueur ; elles accélèrent avec les percussions.
export const REVEALS = [4.0, 5.5, 7.0, 8.0, 9.0, 10.0, 11.0, 11.5, 12.0, 12.5].map(s);
export const REVEALS_END = s(13.0);

// Impacts : secousse de caméra
export const HITS = [T.players, T.gather, T.flash, T.ballHit];
