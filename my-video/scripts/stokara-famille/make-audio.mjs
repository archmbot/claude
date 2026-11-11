// Musique électro-pop énergique (124 BPM) + bruitages, mixés sous la voix off de la publicité
// « Particuliers et familles » (30 s). Entièrement synthétisé (aucun échantillon externe).
// Les bruitages suivent les repères de src/stokara-famille/events.json, exactement comme l'animation ;
// la grosse caisse tombe sur les mêmes temps que les pulsations de l'image (BPM de src/stokara-famille/Video.tsx).
// Nécessite d'avoir lancé make-voice.py. Usage : node scripts/stokara-famille/make-audio.mjs
import { readFileSync } from "node:fs";
import { mixWithVoice } from "../lib/mix.mjs";
import { createSynth, mtof, svf } from "../lib/synth.mjs";

const FPS = 30;
const DURATION = 30;
const BPM = 124;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;

// ------------------------------------------------------------- repères (même calcul que src/components/voiceTiming.ts)
const VOICE = JSON.parse(readFileSync("public/stokara-famille/voice.json", "utf8"));
const EVENTS = JSON.parse(readFileSync("src/stokara-famille/events.json", "utf8"));
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
const { place, noise, fx, music, kick, hat, clap, snare, crash, bass, pad, pluck, whoosh, riser, impact, pop } = s;

const click = (time, gain = 1) => {
  const f = svf(3800, 1.2);
  place(fx, time, 0.05, (t) => (f.run(noise()), f.bp * 1.6 + Math.sin(2 * Math.PI * 2100 * t) * 0.5) * Math.exp(-t * 140), { gain: gain * 0.5, rev: 0.05 });
};
const success = (time, gain = 1) => [76, 79, 84, 88].forEach((m, i) => pluck(time + i * 0.055, m, gain * 0.17, i % 2 ? 0.3 : -0.3));
const chime = (time, gain = 1, high = 86) =>
  [0, 0.08].forEach((d, i) => {
    const f0 = mtof(high + (i ? 7 : 0));
    place(fx, time + d, 0.5, (t) => (Math.sin(2 * Math.PI * f0 * t) + 0.25 * Math.sin(4 * Math.PI * f0 * t)) * Math.exp(-t * 9) * Math.min(1, t * 400), { gain: gain * 0.26, rev: 0.25 });
  });
const tick = (time, gain = 1) => {
  const f = svf(5200, 2);
  place(fx, time, 0.025, () => (f.run(noise()), f.bp) * 1.0, { gain: gain * 0.18, pan: 0.2 });
};
const thud = (time, gain = 1) => place(fx, time, 0.5, (t) => Math.sin(2 * Math.PI * (70 - 30 * t) * t) * Math.exp(-t * 7), { gain: gain * 0.7 });
// lead « supersaw » court (accroches mélodiques)
const lead = (time, midi, dur, gain = 1, pan = 0) => {
  const f0 = mtof(midi);
  const lp = svf(2600, 0.9);
  const ph = [0, 0.13, 0.41, 0.67, 0.89];
  const det = [-0.012, -0.005, 0, 0.006, 0.013];
  place(
    music,
    time,
    dur + 0.15,
    (t) => {
      let x = 0;
      for (let k = 0; k < 5; k++) {
        ph[k] = (ph[k] + (f0 * (1 + det[k])) / 48000) % 1;
        x += 2 * ph[k] - 1;
      }
      lp.set(1400 + 3200 * Math.exp(-t * 6));
      lp.run(x / 5);
      const env = Math.min(1, t * 200) * (t < dur ? 1 : Math.max(0, 1 - (t - dur) / 0.15));
      return lp.lp * env;
    },
    { gain, pan, rev: 0.25 },
  );
};

// Accords : Bm, G, D, A (pop énergique), une mesure chacun
const CH = {
  Bm: { pad: [59, 62, 66], root: 35, arp: [71, 74, 78, 83] },
  G: { pad: [59, 62, 67], root: 31, arp: [71, 74, 79, 83] },
  D: { pad: [57, 62, 66], root: 38, arp: [69, 74, 78, 81] },
  A: { pad: [57, 61, 64], root: 33, arp: [69, 73, 76, 81] },
};
const PROG = ["Bm", "G", "D", "A"];
// Mélodie d'accroche (une note par croche), rejouée toutes les 2 mesures
const HOOK = [83, null, 81, 78, null, 78, 81, null, 83, null, 86, 83, null, 81, 78, null];
const section = (from, to, { kicks = true, claps = true, arp = true, hats = true, bassOn = true, leadOn = false, level = 1, padLevel = 1 } = {}) => {
  let bar = 0;
  for (let t0 = from; t0 < to - 0.01; t0 += BAR, bar++) {
    const ch = CH[PROG[bar % 4]];
    const len = Math.min(BAR, to - t0);
    pad(t0, ch.pad, len - 0.03, 0.42 * level * padLevel);
    const steps = Math.round(len / (BEAT / 4));
    for (let k = 0; k < steps; k++) {
      const t = t0 + (k * BEAT) / 4;
      const beatIdx = Math.floor(k / 4);
      const sub = k % 4;
      if (kicks && sub === 0) kick(t, 0.85 * level);
      if (bassOn && sub === 2) bass(t, ch.root + 12, BEAT * 0.22, 0.34 * level); // basse « off-beat »
      if (bassOn && sub === 0) bass(t, ch.root, BEAT * 0.18, 0.22 * level);
      if (hats) hat(t, sub === 2, (sub === 2 ? 0.07 : 0.03) * level, sub % 2 ? 0.3 : -0.3);
      if (claps && sub === 0 && beatIdx % 2 === 1) clap(t, 0.32 * level);
      if (arp && sub % 2 === 0) pluck(t, ch.arp[(k / 2) % 4], 0.05 * level, (k / 2) % 2 ? 0.35 : -0.35);
      if (leadOn && sub % 2 === 0) {
        const n = HOOK[((bar % 2) * 8 + k / 2) % 16];
        if (n) lead(t, n - 12, BEAT * 0.4, 0.09 * level, 0);
      }
    }
  }
};
// roulement de caisse claire avant un changement de scène
const fill = (end, beats = 1, gain = 0.22) => {
  const n = beats * 4;
  for (let k = 0; k < n; k++) snare(end - ((n - k) * BEAT) / 4, gain * (0.4 + (0.6 * k) / n));
};

// ------------------------------------------------------------- structure (calée sur les scènes)
const s2 = ev("s2");
const s7 = ev("s7");
// accroche : boîte à musique (arpège seul), montée vers « Avec Stokara »
section(0, s2, { kicks: false, claps: false, hats: false, bassOn: false, level: 0.85, padLevel: 1.1 });
riser(s2, 1.4, 0.4);
fill(s2, 1, 0.2);
// corps : groove complet ; la mélodie d'accroche arrive avec le lien de partage
section(s2, ev("s5"), { level: 0.95 });
section(ev("s5"), s7 - BEAT, { level: 1.0, leadOn: true });
["s3", "s4", "s5", "s6"].forEach((k) => {
  crash(ev(k), 0.1);
  impact(ev(k), 0.15);
});
riser(s7, 1.3, 0.38);
fill(s7, 1, 0.2);
impact(s7 + F(2), 0.65);
crash(s7 + F(2), 0.22);
section(s7 + F(2), DURATION - 0.6, { level: 0.85, leadOn: true, claps: true, arp: true });
pad(DURATION - 0.6, CH.Bm.pad, 0.6, 0.4, 0.6);

// ------------------------------------------------------------- bruitages
[0, 4, 8, 12].forEach((d, i) => pop(ev("scatter") + F(d), 74 + i * 3, 0.14));
// tout au même endroit
impact(s2 + 0.02, 0.5);
crash(s2 + 0.02, 0.18);
chime(ev("logo"), 1.1, 86);
for (let i = 0; i < 10; i++) pop(ev("gather") + F(14 + i * 2), 76 + (i % 5) * 3, 0.12); // les souvenirs arrivent
pop(ev("online"), 86, 0.22);
pop(ev("chiffre"), 89, 0.22);
// la famille
whoosh(ev("s3") + F(6), 0.45, 0.32);
[0, 9, 18, 27, 36].forEach((d, i) => pop(ev("s3") + F(14 + d), 79 + i * 2, 0.18));
chime(ev("five"), 1, 88);
for (let i = 0; i < 12; i++) tick(ev("photos") + F(-12 + i * 2.5), 0.9);
whoosh(ev("phone") - 0.2, 0.5, 0.16, -0.4, 0.4);
// les papiers
whoosh(ev("s4") + F(6), 0.45, 0.32);
["grise", "factures", "assurance"].forEach((k, i) => pop(ev(k) + F(2), 82 + i * 3, 0.22));
// le lien
whoosh(ev("s5") + F(6), 0.45, 0.32);
click(ev("album") - F(4), 0.8);
whoosh(ev("album") + 0.05, 0.35, 0.12, 0.2, -0.2);
click(ev("lien") - F(3), 0.8);
success(ev("lien"), 1);
chime(ev("lien") + F(8), 0.9, 91); // message envoyé à Mamie
// le prix
whoosh(ev("s6") + F(6), 0.45, 0.32);
pop(ev("price"), 88, 0.28);
impact(ev("price"), 0.22);
pop(ev("go"), 91, 0.2);

const mix = s.mixdown({ duckDepth: 0.45, roomSize: 0.8 });
mixWithVoice({
  music: mix,
  N: s.N,
  voicePath: "public/stokara-famille/voice.wav",
  out: "public/stokara-famille/audio.wav",
  musicGain: 0.42,
  duck: 0.6,
  levelIn: 1.8,
  limit: 0.88,
  fadeOut: 0.5,
  voiceFx: { presence: 0.4, ratio: 3.5, threshold: 0.16 },
});
console.log(`Écrit public/stokara-famille/audio.wav (${DURATION} s, ${BPM} BPM)`);
