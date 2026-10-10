// Musique électronique discrète + effets, mixée sous la voix off (vidéo QYLINE « mentions légales »).
// Entièrement synthétisée (aucun échantillon externe). Nécessite d'avoir lancé make-voice.py.
// Usage : node scripts/qyline-legal/make-audio.mjs  ->  public/qyline-legal/audio.wav
import { loadCues, mixWithVoice } from "../lib/mix.mjs";
import { SR, createSynth, mtof, svf } from "../lib/synth.mjs";

const DURATION = 60;
const BEAT = 0.5; // 120 BPM : chaque changement de scène tombe sur un temps
const SCENES = [0, 7, 17, 30, 42, 52];
const MUSIC_GAIN = 0.45; // musique discrète (≈ -22 LUFS seule, ≈ 15 dB sous la voix)
const DUCK = 0.6; // atténuation de la musique pendant que la voix parle

// ------------------------------------------------------------------ voix
const cue = loadCues("public/qyline-legal/voice-cues.json");

// ------------------------------------------------------------- musique
const s = createSynth({ duration: DURATION, seed: 4242 });
const { place, noise, fx, kick, hat, crash, bass, pad, pluck, whoosh, riser, impact, pop, clap } = s;

const beep = (time, midi, gain = 1) => {
  const f0 = mtof(midi);
  place(fx, time, 0.16, (t) => Math.sign(Math.sin(2 * Math.PI * f0 * t)) * 0.3 * Math.exp(-t * 14) * Math.min(1, t * 2000), {
    gain,
    rev: 0.2,
  });
};
const thud = (time, gain = 1) => {
  let ph = 0;
  const f = svf(300, 0.8);
  place(
    fx,
    time,
    0.5,
    (t) => {
      ph += (2 * Math.PI * (55 + 50 * Math.exp(-t * 30))) / SR;
      f.run(noise());
      return Math.tanh((Math.sin(ph) + f.lp * 0.6) * Math.exp(-t * 7) * 1.6);
    },
    { gain, rev: 0.3 },
  );
};
const chime = (time, notes, gain = 1) => notes.forEach((m, i) => pluck(time + i * 0.07, m, gain, i % 2 ? 0.3 : -0.3));

// Accords : Am, F, C, G (mesures de 2 s)
const CH = {
  Am: { pad: [57, 60, 64], root: 45, arp: [69, 72, 76, 81] },
  F: { pad: [57, 60, 65], root: 41, arp: [65, 69, 72, 77] },
  C: { pad: [55, 60, 64], root: 48, arp: [67, 72, 76, 79] },
  G: { pad: [55, 59, 62], root: 43, arp: [67, 71, 74, 79] },
  Dm: { pad: [57, 62, 65], root: 38, arp: [62, 65, 69, 74] },
};
const section = (from, to, prog, { kicks = true, half = false, arp = false, hats = true, bassOn = true }) => {
  for (let t0 = from, bar = 0; t0 < to - 0.01; t0 += 2, bar++) {
    const ch = CH[prog[bar % prog.length]];
    const len = Math.min(2, to - t0);
    pad(t0, ch.pad, len - 0.05, 0.8);
    for (let k = 0; k < len / BEAT - 0.01; k++) {
      const t = t0 + k * BEAT;
      if (kicks && (!half || k % 2 === 0)) kick(t, 0.75);
      if (bassOn) bass(t + BEAT / 2, ch.root, 0.2, 0.35);
      if (hats) hat(t + BEAT / 2, true, 0.06, 0.2);
      if (kicks && !half && k % 2 === 1) clap(t, 0.25);
      if (arp) [0, 1].forEach((h) => pluck(t + h * (BEAT / 2), ch.arp[(k * 2 + h) % 4], 0.06, h ? 0.35 : -0.35));
    }
  }
};

// Scène 1 — alerte
impact(0.05, 0.5);
section(0, 7, ["Am", "Am", "F", "F"], { kicks: false, hats: true, bassOn: true });
const attention = cue("attention");
beep(attention - 0.05, 81, 0.5);
beep(attention + 0.12, 76, 0.5);
const sanctions = cue("sanctions");
riser(sanctions, 1.2, 0.35);
impact(sanctions, 0.7);
whoosh(7, 0.4, 0.4);
// Scène 2 — le risque (plus sombre)
section(7, 17, ["Dm", "Dm", "Am", "Am", "F"], { half: true, hats: false, bassOn: true });
const c75 = cue("75");
const cEuros = cue("euros");
for (let t = c75; t < cEuros + 0.35; t += 0.06) pop(t, 96, 0.12);
impact(cEuros + 0.35, 0.55);
thud(cue("demprisonnement"), 0.8);
whoosh(17, 0.4, 0.4);
// Scène 3 — obligations
section(17, 30, ["C", "G", "Am", "F"], { arp: false });
["identité", "coordonnées", "dimmatriculation", "hébergeur"].forEach((w, i) => chime(cue(w), [84 + i * 2, 91 + i * 2], 0.12));
chime(cue("hébergeur") + 0.7, [86, 93], 0.1);
chime(cue("facilement"), [84, 88, 91, 96], 0.1);
whoosh(30, 0.4, 0.4);
// Scène 4 — la solution
riser(cue("solution"), 0.6, 0.3);
section(30, 42, ["Am", "F", "C", "G"], { arp: true });
thud(cue("vérifiez") - 0.4, 0.5);
chime(cue("mentions", 1), [84, 88, 91], 0.12);
pop(cue("pied"), 91, 0.25);
whoosh(42, 0.5, 0.45);
// Scène 5 — QYLINE (plus lumineux)
impact(42.0, 0.6);
crash(42.0, 0.25);
section(42, 52, ["F", "C", "G", "Am", "F"], { arp: true });
whoosh(52, 0.5, 0.45);
// Scène 6 — conclusion
section(52, 58.5, ["C", "G", "Am"], { arp: true });
const site = cue("qyline.org");
riser(site, 1.0, 0.35);
impact(site, 0.8);
crash(site, 0.35);
pad(site, CH.C.pad, 1.0, 1, 0.6);
bass(site, 36, 1.0, 0.4);

// ------------------------------------------------------------- mixage
const music = s.mixdown({ duckDepth: 0.3, roomSize: 0.8 });
const out = process.argv[2] ?? "public/qyline-legal/audio.wav";
mixWithVoice({ music, N: s.N, voicePath: "public/qyline-legal/voice.wav", out, musicGain: MUSIC_GAIN, duck: DUCK, levelIn: 1.25, limit: 0.84, fadeOut: 0.3 });
console.log(`Écrit ${out} (${DURATION}s)`);
