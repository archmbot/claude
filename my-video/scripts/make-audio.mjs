// Génère la bande-son originale de la publicité QYLINE (musique + effets).
// Tout est synthétisé ici, sans aucun échantillon externe : aucun droit tiers.
// Usage : npm run audio  (écrit public/qyline-audio.wav)
import { createSynth } from "./lib/synth.mjs";

const DURATION = 20; // s, doit correspondre à DURATION dans src/qyline/data.ts
const BEAT = 0.5; // 120 BPM
const BAR = BEAT * 4;
const T0 = 0.5; // premier temps fort : le logo se pose (image 15)

// Repères synchronisés avec SCENES / CUES dans src/qyline/data.ts (secondes)
const CUTS = [2.5, 6.5, 10.5, 16.5];
const PRICE_POPS = [11.0, 11.25, 11.5, 11.75];
const BADGE_STAMP = 12.5;
const ROLL_START = 15.5;
const OUTRO_HIT = 16.5;
const FINAL_HIT = 18.5;

const { kick, clap, snare, hat, crash, bass, pad, pluck, whoosh, riser, impact, pop, stamp, render } = createSynth({
  duration: DURATION,
});

// ------------------------------------------------------------- partition
// Accords (une mesure de 2 s chacun) : F, C, G, Am ... résolution finale sur C.
const CH = {
  F: { pad: [53, 57, 60, 65], root: 41, arp: [65, 69, 72, 77] },
  C: { pad: [52, 55, 60, 64], root: 36, arp: [64, 67, 72, 76] },
  G: { pad: [50, 55, 59, 62], root: 43, arp: [62, 67, 71, 74] },
  Am: { pad: [52, 57, 60, 64], root: 45, arp: [64, 69, 72, 76] },
};
const PROG = ["F", "C", "G", "Am", "F", "C", "G", "Am", "F", "C"];

riser(T0, 0.5, 0.7);
impact(T0, 0.85);
crash(T0, 0.35);

PROG.forEach((name, bar) => {
  const t = T0 + bar * BAR;
  const ch = CH[name];
  const last = bar === PROG.length - 1;

  if (last) {
    // Accord final tenu jusqu'à la fin
    pad(t, ch.pad, 0.9, 1.1, 0.7);
    bass(t, ch.root, 1.1, 0.5);
    [0, 1, 2, 3].forEach((i) => pluck(t + i * 0.09, ch.arp[i] + 12, 0.1, i % 2 ? 0.4 : -0.4));
    return;
  }

  pad(t, ch.pad, BAR - 0.05, bar === 0 ? 0.8 : 1);

  for (let b = 0; b < 4; b++) {
    const bt = t + b * BEAT;
    const inRoll = bt >= ROLL_START && bt < OUTRO_HIT;
    if (!(inRoll && b === 3)) kick(bt, 0.9);
    // Basse sur les contretemps
    if (bar >= 1) bass(bt + BEAT / 2, ch.root + (b === 3 ? 12 : 0), 0.2, 0.42);
    else if (b === 0) bass(bt, ch.root, 1.8, 0.3);
    if (bar >= 1) {
      hat(bt + BEAT / 2, true, 0.1, 0.15);
      if ((b === 1 || b === 3) && !inRoll) clap(bt, 0.5);
    }
    if (bar >= 3) {
      for (const s of [0, 0.25, 0.75]) hat(bt + s * BEAT, false, 0.045, s === 0.25 ? -0.35 : 0.35);
    }
  }

  // Arpège en croches à partir de la 2e mesure
  if (bar >= 1) {
    const pattern = [0, 1, 2, 3, 2, 1, 2, 3];
    pattern.forEach((idx, i) => {
      pluck(t + i * (BEAT / 2), ch.arp[idx], bar === 1 ? 0.07 : 0.1, i % 2 ? 0.35 : -0.35);
    });
  }
});

// Transitions
whoosh(CUTS[0], 0.45, 0.6);
whoosh(CUTS[1], 0.45, 0.6, 0.8, -0.8);
whoosh(CUTS[2], 0.45, 0.6);
riser(CUTS[3], 1.0, 0.6);

// Roulement de caisse claire avant la conclusion
for (let i = 0; i < 8; i++) snare(ROLL_START + i * (BEAT / 4), 0.18 + i * 0.06);

// Prix qui apparaissent : notes montantes
PRICE_POPS.forEach((t, i) => pop(t, [84, 86, 88, 91][i], 0.32));
stamp(BADGE_STAMP, 0.55);

impact(OUTRO_HIT, 0.8);
crash(OUTRO_HIT, 0.4);
impact(FINAL_HIT, 0.9);
crash(FINAL_HIT, 0.45);

const out = process.argv[2] ?? "public/qyline-audio.wav";
const peak = render(out);
console.log(`Écrit ${out} (${DURATION}s, crête avant normalisation ${peak.toFixed(2)})`);
