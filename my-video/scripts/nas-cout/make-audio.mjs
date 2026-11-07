// Musique électronique douce + petits bruitages, mixés sous la voix off
// (« Pourquoi l'informatique coûte-t-elle si cher ? », 1 min). Entièrement synthétisé.
// Nécessite d'avoir lancé make-voice.py. Usage : node scripts/nas-cout/make-audio.mjs
import { readFileSync } from "node:fs";
import { mixWithVoice } from "../lib/mix.mjs";
import { createSynth } from "../lib/synth.mjs";

const cues = JSON.parse(readFileSync("public/nas-cout/voice.json", "utf8"));
const DURATION = Math.ceil(cues.duration * 10) / 10;
const BEAT = 0.6; // 100 BPM, posé
const MUSIC_GAIN = 0.32; // musique discrète sous une voix pédagogique
const DUCK = 0.55;

// même recherche de repères que src/components/voiceTiming.ts
const norm = (s) => s.toLowerCase().replace(/[’]/g, "'").replace(/[«»"“”()?!.,;:… ]/g, " ").trim();
const cue = (seq, phrase) => {
  const ws = cues.words.filter((w) => w.seq === seq);
  const parts = norm(phrase).split(/\s+/);
  for (let i = 0; i + parts.length <= ws.length; i++) {
    if (parts.every((p, k) => (k === parts.length - 1 ? norm(ws[i + k].text).startsWith(p) : norm(ws[i + k].text) === p))) return ws[i].start;
  }
  throw new Error(`Repère introuvable : ${phrase} (séquence ${seq + 1})`);
};

const s = createSynth({ duration: DURATION, seed: 2026 });
const { kick, hat, bass, pad, pluck, pop, whoosh } = s;

// Accords : Fmaj7, G, Em7, Am (mesures de 4 temps)
const CH = [
  { pad: [53, 57, 60, 64], root: 41, arp: [65, 69, 72, 76] },
  { pad: [55, 59, 62, 67], root: 43, arp: [67, 71, 74, 79] },
  { pad: [52, 55, 59, 62], root: 40, arp: [64, 67, 71, 74] },
  { pad: [57, 60, 64, 67], root: 45, arp: [69, 72, 76, 79] },
];
const bar = BEAT * 4;
const end = cues.seqs[cues.seqs.length - 1].end;
for (let t0 = 0, b = 0; t0 < end + 2; t0 += bar, b++) {
  const ch = CH[b % 4];
  pad(t0, ch.pad, bar - 0.05, 0.7);
  bass(t0, ch.root, bar * 0.9, 0.22);
  for (let k = 0; k < 4; k++) {
    const t = t0 + k * BEAT;
    if (t0 > 2 && k % 2 === 0) kick(t, 0.35);
    if (t0 > 2) hat(t + BEAT / 2, false, 0.05, k % 2 ? 0.3 : -0.3);
    pluck(t, ch.arp[k], 0.045, k % 2 ? 0.4 : -0.4);
  }
}
// fin : accord tenu sous la dernière phrase
pad(end, CH[0].pad, 3, 0.6, 1.2);

// bruitages
for (const sq of cues.seqs.slice(1)) whoosh(sq.start + 0.15, 0.5, 0.18);
const lines = [
  [2, "le NAS"],
  [2, "deux disques"],
  [2, "un onduleur"],
  [3, "la mise en place"],
  [4, "la sauvegarde"],
  [5, "l'entretien"],
];
lines.forEach(([sq, p], i) => pop(cue(sq, p), 79 + (i % 3) * 2, 0.22));
const total = cue(6, "Vous ne payez");
[72, 76, 79, 84].forEach((m, i) => pluck(total + i * 0.07, m, 0.12, i % 2 ? 0.3 : -0.3));

const music = s.mixdown({ duckDepth: 0.2, roomSize: 0.85 });
mixWithVoice({ music, N: s.N, voicePath: "public/nas-cout/voice.wav", out: "public/nas-cout/audio.wav", musicGain: MUSIC_GAIN, duck: DUCK, levelIn: 1.17, limit: 0.84, fadeOut: 1.0 });
console.log(`Écrit public/nas-cout/audio.wav (${DURATION}s)`);
