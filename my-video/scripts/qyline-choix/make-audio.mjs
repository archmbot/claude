// Musique électronique discrète + bruitages d'interface, mixés sous la voix off
// (vidéo QYLINE « Site vitrine ou boutique en ligne ? », 80 s). Entièrement synthétisé.
// Les bruitages suivent les repères de src/events.json, comme l'animation.
// Usage : node scripts/qyline-choix/make-audio.mjs  ->  public/qyline-choix/audio.wav
import { readFileSync } from "node:fs";
import { mixWithVoice } from "../lib/mix.mjs";
import { SR, createSynth, mtof, svf } from "../lib/synth.mjs";

const DURATION = 80;
const FPS = 30;
const BEAT = 0.5; // 120 BPM : chaque changement de scène tombe sur un temps
const SCENES = [0, 8, 21, 34, 47, 57, 69];
const MUSIC_GAIN = 0.45; // musique discrète, environ 15 dB sous la voix
const DUCK = 0.6; // atténuation de la musique pendant que la voix parle

// ------------------------------------------------------------- repères
const VOICE = JSON.parse(readFileSync("public/qyline-choix/voice-cues.json", "utf8"));
const EVENTS = JSON.parse(readFileSync("src/events.json", "utf8"));
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\d.']/gu, "");
// même logique que src/timeline.ts (repère arrondi à l'image, pour tomber pile avec l'animation)
const cue = (scene, word, n = 0) => {
  const hits = VOICE.words.filter((w) => w.scene === scene && norm(w.text).startsWith(norm(word)));
  if (!hits[n]) throw new Error(`Repère vocal introuvable : ${word} (scène ${scene + 1})`);
  return hits[n].start;
};
const ev = (name) => {
  const e = EVENTS[name];
  if (!e) throw new Error(`Repère inconnu : ${name}`);
  const sec = e.at ?? cue(e.scene ?? 0, e.word ?? "", e.n ?? 0) + (e.add ?? 0);
  return Math.round(sec * FPS) / FPS;
};
const local = (scene, frames) => SCENES[scene] + frames / FPS;

// ------------------------------------------------------------- synthé
const s = createSynth({ duration: DURATION, seed: 8080 });
const { place, noise, fx, kick, hat, crash, bass, pad, pluck, whoosh, riser, impact, pop, clap, stamp } = s;

// clic de souris / toucher d'écran : bruit filtré très court + petit « tic » aigu
const click = (time, gain = 1) => {
  const f = svf(3800, 1.2);
  place(fx, time, 0.05, (t) => (f.run(noise()), f.bp * 1.6 + Math.sin(2 * Math.PI * 2100 * t) * 0.5) * Math.exp(-t * 140), { gain: gain * 0.5, rev: 0.05 });
};
// notification : deux notes douces
const notify = (time, gain = 1, high = 88) => {
  [0, 0.09].forEach((d, i) => {
    const f0 = mtof(high + (i ? 7 : 0));
    place(fx, time + d, 0.5, (t) => (Math.sin(2 * Math.PI * f0 * t) + 0.25 * Math.sin(4 * Math.PI * f0 * t)) * Math.exp(-t * 9) * Math.min(1, t * 400), { gain: gain * 0.28, rev: 0.25 });
  });
};
// validation : arpège ascendant
const success = (time, gain = 1) => [76, 79, 84, 88].forEach((m, i) => pluck(time + i * 0.06, m, gain * 0.16, i % 2 ? 0.3 : -0.3));
// défilement de page : petit souffle
const scrollSwish = (time, gain = 1) => whoosh(time + 0.6, 0.6, gain * 0.12, -0.3, 0.3);
// compteur de prix : rafale de tics
const counter = (from, frames, gain = 1) => {
  for (let k = 0; k < frames; k += 2) pop(from + k / FPS, 84 + Math.floor(k / 3), gain * 0.08);
};

// Accords (mesures de 2 s)
const CH = {
  Am: { pad: [57, 60, 64], root: 45, arp: [69, 72, 76, 81] },
  F: { pad: [57, 60, 65], root: 41, arp: [65, 69, 72, 77] },
  C: { pad: [55, 60, 64], root: 48, arp: [67, 72, 76, 79] },
  G: { pad: [55, 59, 62], root: 43, arp: [67, 71, 74, 79] },
  Em: { pad: [55, 59, 64], root: 40, arp: [64, 67, 71, 76] },
};
const section = (from, to, prog, { kicks = true, half = false, arp = false, hats = true, bassOn = true, level = 1 } = {}) => {
  for (let t0 = from, bar = 0; t0 < to - 0.01; t0 += 2, bar++) {
    const ch = CH[prog[bar % prog.length]];
    const len = Math.min(2, to - t0);
    pad(t0, ch.pad, len - 0.05, 0.8 * level);
    for (let k = 0; k < len / BEAT - 0.01; k++) {
      const t = t0 + k * BEAT;
      if (kicks && (!half || k % 2 === 0)) kick(t, 0.75 * level);
      if (bassOn) bass(t + BEAT / 2, ch.root, 0.2, 0.35 * level);
      if (hats) hat(t + BEAT / 2, true, 0.06 * level, 0.2);
      if (kicks && !half && k % 2 === 1) clap(t, 0.25 * level);
      if (arp) [0, 1].forEach((h) => pluck(t + h * (BEAT / 2), ch.arp[(k * 2 + h) % 4], 0.06 * level, h ? 0.35 : -0.35));
    }
  }
};

// Scène 1 — accroche (0-8 s)
impact(0.05, 0.5);
section(0, 8, ["Am", "F", "C", "G"], { half: true, hats: true });
[8, 14, 19].forEach((f, i) => pop(local(0, f), 79 + i * 5, 0.22));
stamp(ev("goodChoice"), 0.5);
whoosh(8, 0.45, 0.4);

// Scène 2 — site vitrine (8-21 s)
section(8, 21, ["C", "G", "Am", "F"], { arp: false });
[30, 70, 110, 150, 190].forEach((f) => scrollSwish(local(1, f)));
stamp(ev("vitrineWord") - 2 / FPS, 0.35);
pop(cue(1, "présente"), 86, 0.2);
pop(cue(1, "réalisations"), 88, 0.2);
click(ev("vitrineClick"), 1);
notify(ev("vitrineNotif"), 1);
pop(ev("vitrineClick"), 91, 0.2);
whoosh(21, 0.45, 0.4);

// Scène 3 — boutique en ligne (21-34 s) : le portable devient smartphone
whoosh(21 + 26 / FPS, 0.8, 0.3, 0.6, -0.6);
section(21, 34, ["Am", "F", "C", "G"], { arp: true });
stamp(ev("shopWord") - 2 / FPS, 0.35);
click(ev("addCart1"));
pop(ev("addCart1") + 0.08, 84, 0.2);
click(ev("addCart2"));
pop(ev("addCart2") + 0.08, 88, 0.2);
scrollSwish(ev("checkout") - 0.1);
click(ev("payClick"));
success(ev("orderOk"));
[0, 16, 32, 48].forEach((f, i) => notify(ev("orders") + f / FPS, 0.75, 84 + i * 2));
whoosh(34, 0.45, 0.4);

// Scène 4 — comparaison (34-47 s)
section(34, 47, ["F", "C", "G", "Am"], { half: true, arp: false });
[0, 7, 14].forEach((f, i) => pop(ev("leftItems") + f / FPS, 81 + i * 3, 0.18));
pop(ev("leftItems") + 26 / FPS, 93, 0.22);
[0, 7, 14].forEach((f, i) => pop(ev("rightItems") + f / FPS, 81 + i * 3, 0.18));
pop(ev("rightItems") + 26 / FPS, 93, 0.22);
impact(ev("warn"), 0.35);
["stocks", "commandes", "livraisons"].forEach((n, i) => click(ev(n), 0.6 + i * 0.1));
riser(ev("objective"), 0.9, 0.3);
impact(ev("objective"), 0.6);
whoosh(47, 0.45, 0.4);

// Scène 5 — solutions intermédiaires (47-57 s)
section(47, 57, ["C", "G", "Am", "F", "C"], { arp: true });
["step1", "step2", "step3"].forEach((n, i) => pop(ev(n), 84 + i * 4, 0.24));
scrollSwish(ev("step2"));
scrollSwish(ev("step3") + 14 / FPS); // retour en haut de page
pop(ev("step3") + 22 / FPS, 91, 0.2); // le bouton « Payer un acompte » apparaît
click(ev("depositClick"));
success(ev("depositOk"));
stamp(ev("motto"), 0.5);
whoosh(57, 0.5, 0.45);

// Scène 6 — tarifs (57-69 s) : la musique remonte
impact(57, 0.5);
crash(57, 0.2);
section(57, 69, ["F", "G", "Am", "C", "F", "G"], { arp: true, level: 1.1 });
for (const n of ["price1", "price2"]) {
  const t = ev(n);
  counter(t, 20);
  impact(t + 20 / FPS, 0.45);
  success(t + 20 / FPS, 0.8);
}
whoosh(69, 0.5, 0.45);

// Scène 7 — conclusion (69-80 s)
whoosh(69 + 24 / FPS, 0.7, 0.35);
impact(69 + 24 / FPS, 0.6);
crash(69 + 24 / FPS, 0.25);
section(69, 78, ["Am", "F", "C", "G", "C"], { arp: true, level: 1.15 });
stamp(ev("tagline"), 0.35);
pop(ev("brand"), 91, 0.25);
stamp(ev("free") - 2 / FPS, 0.35);
const site = ev("site");
riser(site, 1.0, 0.35);
impact(site, 0.7);
// dernière note, calée sur l'animation finale du logo
const fin = ev("finale");
impact(fin, 0.8);
crash(fin, 0.35);
pad(fin, CH.C.pad, 1.6, 1.1, 0.4);
bass(fin, 36, 1.6, 0.45);
[72, 76, 79, 84].forEach((m, i) => pluck(fin + i * 0.05, m, 0.12, i % 2 ? 0.4 : -0.4));

// ------------------------------------------------------------- mixage
const music = s.mixdown({ duckDepth: 0.3, roomSize: 0.8 });
// la musique remonte sur les prix et à la conclusion (en plus de s'effacer sous la voix)
const lift = (t) => {
  const ramp = (a, b, x) => Math.min(1, Math.max(0, (x - a) / (b - a)));
  const prices = ramp(ev("price1") - 0.3, ev("price1"), t) * (1 - ramp(ev("price2") + 1.4, ev("price2") + 2.2, t));
  const outro = ramp(77.4, 78, t);
  return 1 + 0.35 * prices + 0.6 * outro;
};
for (let i = 0; i < s.N; i++) {
  const g = lift(i / SR);
  music.L[i] *= g;
  music.R[i] *= g;
}
const out = process.argv[2] ?? "public/qyline-choix/audio.wav";
mixWithVoice({ music, N: s.N, voicePath: "public/qyline-choix/voice.wav", out, musicGain: MUSIC_GAIN, duck: DUCK, levelIn: 1.65, limit: 0.84, fadeOut: 0.6 });
console.log(`Écrit ${out} (${DURATION}s)`);
