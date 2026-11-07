// Musique douce + transitions, mixées sous la voix off du tutoriel Stokara (≈ 12 min). Entièrement synthétisé.
// Nécessite d'avoir lancé make-voice.py. Usage : node scripts/stokara/make-audio.mjs
import { readFileSync } from "node:fs";
import { mixWithVoice } from "../lib/mix.mjs";
import { createSynth } from "../lib/synth.mjs";

const cues = JSON.parse(readFileSync("public/stokara/voice.json", "utf8"));
const DURATION = Math.ceil(cues.duration * 10) / 10;
const BEAT = 0.66; // ≈ 91 BPM, calme
const s = createSynth({ duration: DURATION, seed: 1107 });
const { hat, bass, pad, pluck, whoosh, pop } = s;

// Accords : Dmaj7, Bm7, Gmaj7, A (mesures de 4 temps), nappe discrète
const CH = [
  { pad: [50, 54, 57, 61], root: 38, arp: [62, 66, 69, 73] },
  { pad: [47, 50, 54, 57], root: 35, arp: [59, 62, 66, 69] },
  { pad: [43, 47, 50, 54], root: 31, arp: [62, 66, 67, 71] },
  { pad: [45, 49, 52, 57], root: 33, arp: [61, 64, 69, 73] },
];
const bar = BEAT * 4;
const end = cues.seqs[cues.seqs.length - 1].end;
for (let t0 = 0, b = 0; t0 < end + 3; t0 += bar, b++) {
  const ch = CH[b % 4];
  pad(t0, ch.pad, bar - 0.05, 0.55);
  bass(t0, ch.root, bar * 0.9, 0.16);
  for (let k = 0; k < 4; k++) {
    const t = t0 + k * BEAT;
    if (t0 > 4) hat(t + BEAT / 2, false, 0.03, k % 2 ? 0.3 : -0.3);
    if (k % 2 === 0) pluck(t, ch.arp[(k + b) % 4], 0.03, k % 4 ? 0.4 : -0.4);
  }
}
pad(end, CH[0].pad, 4, 0.5, 1.6);

// ouverture : petit motif à l'apparition du logo
[62, 66, 69, 74].forEach((m, i) => pluck(0.25 + i * 0.09, m, 0.12, i % 2 ? 0.3 : -0.3));
// cartons de chapitre : souffle + note claire
for (const sq of cues.seqs.slice(1)) {
  if (sq.cardEnd - sq.start > 1.5) {
    whoosh(sq.start + 0.45, 0.6, 0.22);
    pop(sq.start + 0.5, 81, 0.18);
  }
}

const music = s.mixdown({ duckDepth: 0.15, roomSize: 0.85 });
mixWithVoice({ music, N: s.N, voicePath: "public/stokara/voice.wav", out: "public/stokara/audio.wav", musicGain: 0.26, duck: 0.6, levelIn: 1.55, limit: 0.84, fadeOut: 2.0 });
console.log(`Écrit public/stokara/audio.wav (${DURATION}s)`);
