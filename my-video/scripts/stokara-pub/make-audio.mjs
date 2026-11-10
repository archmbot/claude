// Musique entraînante + bruitages d'interface, mixés sous la voix off de la publicité Stokara (30 s).
// Entièrement synthétisé (aucun échantillon externe). Les bruitages suivent les repères de
// src/stokara-pub/events.json, exactement comme l'animation.
// Nécessite d'avoir lancé make-voice.py. Usage : node scripts/stokara-pub/make-audio.mjs
import { readFileSync } from "node:fs";
import { mixWithVoice } from "../lib/mix.mjs";
import { createSynth, mtof, svf } from "../lib/synth.mjs";

const FPS = 30;
const DURATION = 30;
const BEAT = 60 / 116; // 116 BPM

// ------------------------------------------------------------- repères (même calcul que src/components/voiceTiming.ts)
const VOICE = JSON.parse(readFileSync("public/stokara-pub/voice.json", "utf8"));
const EVENTS = JSON.parse(readFileSync("src/stokara-pub/events.json", "utf8"));
const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[«»"“”()?!.,;:… ]/g, " ")
    .trim();
const fr = (sec) => Math.round(sec * FPS);
const cueSec = (seq, phrase, n = 0) => {
  const words = VOICE.words.filter((w) => w.seq === seq);
  const parts = norm(phrase).split(/\s+/);
  let count = 0;
  for (let i = 0; i + parts.length <= words.length; i++) {
    const ok = parts.every((p, k) => {
      const w = norm(words[i + k].text);
      return k === parts.length - 1 ? w.startsWith(p) : w === p;
    });
    if (ok && count++ === n) return words[i].start;
  }
  throw new Error(`Repère vocal introuvable : ${phrase} (séquence ${seq + 1})`);
};
const ev = (name) => {
  const e = EVENTS[name];
  if (!e) throw new Error(`Repère inconnu : ${name}`);
  const s0 = VOICE.seqs[e.seq].start;
  return (fr(s0) + fr(cueSec(e.seq, e.p, e.n ?? 0) + (e.add ?? 0) - s0)) / FPS;
};
const F = (frames) => frames / FPS;

// ------------------------------------------------------------- synthé
const s = createSynth({ duration: DURATION, seed: 3020 });
const { place, noise, fx, kick, hat, clap, crash, bass, pad, pluck, whoosh, riser, impact, pop } = s;

const click = (time, gain = 1) => {
  const f = svf(3800, 1.2);
  place(fx, time, 0.05, (t) => (f.run(noise()), f.bp * 1.6 + Math.sin(2 * Math.PI * 2100 * t) * 0.5) * Math.exp(-t * 140), { gain: gain * 0.5, rev: 0.05 });
};
const success = (time, gain = 1) => [76, 79, 84, 88].forEach((m, i) => pluck(time + i * 0.06, m, gain * 0.16, i % 2 ? 0.3 : -0.3));
const chime = (time, gain = 1, high = 86) =>
  [0, 0.09].forEach((d, i) => {
    const f0 = mtof(high + (i ? 7 : 0));
    place(fx, time + d, 0.5, (t) => (Math.sin(2 * Math.PI * f0 * t) + 0.25 * Math.sin(4 * Math.PI * f0 * t)) * Math.exp(-t * 9) * Math.min(1, t * 400), { gain: gain * 0.26, rev: 0.25 });
  });
const tick = (time, gain = 1) => {
  const f = svf(5200, 2);
  place(fx, time, 0.025, () => (f.run(noise()), f.bp) * 1.0, { gain: gain * 0.18, pan: 0.2 });
};
const thud = (time, gain = 1) => place(fx, time, 0.5, (t) => Math.sin(2 * Math.PI * (70 - 30 * t) * t) * Math.exp(-t * 7), { gain: gain * 0.7 });

// Accords : D, A, Bm, G (pop lumineuse), mesures de 4 temps
const CH = {
  D: { pad: [62, 66, 69], root: 38, arp: [74, 78, 81, 86] },
  A: { pad: [61, 64, 69], root: 45, arp: [73, 76, 81, 85] },
  Bm: { pad: [62, 66, 71], root: 47, arp: [74, 78, 83, 86] },
  G: { pad: [62, 67, 71], root: 43, arp: [74, 79, 83, 86] },
};
const PROG = ["D", "A", "Bm", "G"];
const BAR = BEAT * 4;
const section = (from, to, { kicks = true, claps = true, arp = true, hats = true, bassOn = true, level = 1, padLevel = 1 } = {}) => {
  let bar = Math.round(from / BAR);
  for (let t0 = from; t0 < to - 0.01; t0 += BAR, bar++) {
    const ch = CH[PROG[bar % 4]];
    const len = Math.min(BAR, to - t0);
    pad(t0, ch.pad, len - 0.03, 0.55 * level * padLevel);
    for (let k = 0; k < Math.round(len / BEAT); k++) {
      const t = t0 + k * BEAT;
      if (kicks) kick(t, 0.72 * level);
      if (bassOn) [0, 0.5].forEach((h) => bass(t + h * BEAT, ch.root + (h ? 12 : 0), BEAT * 0.42, 0.3 * level));
      if (hats) hat(t + BEAT / 2, k % 2 === 1, 0.055 * level, 0.25);
      if (claps && k % 2 === 1) clap(t, 0.22 * level);
      if (arp) [0, 1].forEach((h) => pluck(t + h * (BEAT / 2), ch.arp[(k * 2 + h) % 4], 0.05 * level, h ? 0.35 : -0.35));
    }
  }
};

// ------------------------------------------------------------- structure (calée sur les scènes)
const s2 = ev("s2");
const s7 = ev("s7");
// accroche : nappe et arpège, sans batterie, petite montée vers « Avec Stokara »
section(0, s2, { kicks: false, claps: false, hats: false, bassOn: false, level: 0.9, padLevel: 1.2 });
riser(s2, 1.2, 0.3);
// corps : groove complet
section(s2, s7 - BEAT, { level: 1 });
// avant le plan de fin : on retient le souffle
riser(s7, 1.4, 0.38);
// plan de fin : accord final tenu
impact(s7 + F(2), 0.6);
crash(s7 + F(2), 0.22);
pad(s7 + F(2), [62, 66, 69, 74], DURATION - s7 - 0.3, 0.7, 1.2);
bass(s7 + F(2), 38, 1.6, 0.4);
[74, 78, 81, 86, 90].forEach((m, i) => pluck(s7 + F(2) + i * 0.08, m, 0.1, i % 2 ? 0.3 : -0.3));

// ------------------------------------------------------------- bruitages
// 1. accroche
thud(ev("jiggle"), 0.8);
[0, 0.07, 0.14].forEach((d) => tick(ev("jiggle") + d, 1.2));
impact(ev("lonely"), 0.25);
pop(ev("lonely"), 60, 0.12);
// 2. glisser-déposer
impact(s2 + 0.05, 0.45);
chime(ev("logo"), 1.1, 86);
click(ev("grab"));
whoosh(ev("drop") - 0.1, 0.9, 0.18, 0.4, -0.2);
pop(ev("drop"), 88, 0.22);
success(ev("done"));
// 3. Windows
whoosh(ev("s3") + F(6), 0.5, 0.35);
click(ev("rclick"));
pop(ev("rclick") + F(2), 79, 0.12);
click(ev("pick"));
for (let t = ev("pick") + F(7); t < ev("finish") - F(7); t += F(1.5)) tick(t, 0.9);
click(ev("finish"));
success(ev("drive") + F(4));
chime(ev("disk"), 0.9, 90);
// 4. où vous voulez
whoosh(ev("s4") + F(6), 0.5, 0.35);
pop(ev("server") - F(6), 81, 0.2);
pop(ev("site") - F(4), 85, 0.2);
[0, 4, 8].forEach((d, i) => pop(ev("everywhere") + F(d), 84 + i * 3, 0.18));
// 5. entreprises
whoosh(ev("s5") + F(6), 0.5, 0.35);
pop(ev("s5") + F(4), 79, 0.18);
[0, 4, 8, 12].forEach((d, i) => pop(ev("accounts") + F(d), 81 + i * 2, 0.16));
[0, 4, 8, 12].forEach((d, i) => tick(ev("access") + F(d), 1));
chime(ev("same"), 0.8, 83);
// 6. tarifs
whoosh(ev("s6") + F(6), 0.5, 0.35);
pop(ev("p1"), 88, 0.26);
pop(ev("go"), 91, 0.18);
pop(ev("pro") - F(4), 83, 0.2);
pop(ev("p2"), 90, 0.26);

const music = s.mixdown({ duckDepth: 0.35, roomSize: 0.8 });
mixWithVoice({ music, N: s.N, voicePath: "public/stokara-pub/voice.wav", out: "public/stokara-pub/audio.wav", musicGain: 0.42, duck: 0.55, levelIn: 1.5, limit: 0.86, fadeOut: 0.9 });
console.log(`Écrit public/stokara-pub/audio.wav (${DURATION} s)`);
