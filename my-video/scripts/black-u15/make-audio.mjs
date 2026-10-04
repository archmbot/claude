// Bande-son originale de l'intro BLACK U15 BASKET (25 s, sans paroles).
// Entièrement synthétisée : aucun échantillon externe, aucun droit tiers.
// Usage : node scripts/black-u15/make-audio.mjs  ->  public/black-u15/audio.wav
import { SR, createSynth, mtof, svf } from "../lib/synth.mjs";

const DURATION = 25;
// Repères synchronisés avec src/black-u15/timeline.ts (secondes)
const REVEALS = [4.0, 5.5, 7.0, 8.0, 9.0, 10.0, 11.0, 11.5, 12.0, 12.5];
const GATHER = 13.0; // recul de caméra, rassemblement
const FREEZE = 19.0; // les joueurs s'immobilisent
const FLASH = 19.5; // révélation BLACK U15 BASKET
const BALL_LAUNCH = 23.0;
const BALL_HIT = 24.5; // le ballon remplit l'écran : flash vers le match
const BEAT = 0.5; // 120 BPM

const s = createSynth({ duration: DURATION, seed: 1515 });
const { place, noise, rand, drums, music, fx, kick, clap, snare, hat, crash, bass, pluck, pad, whoosh, riser, impact } = s;

// ------------------------------------------------------------ instruments
const heartbeat = (time, gain = 1) => {
  for (const [o, g] of [
    [0, 1],
    [0.2, 0.7],
  ]) {
    let ph = 0;
    place(
      fx,
      time + o,
      0.35,
      (t) => {
        ph += (2 * Math.PI * (38 + 30 * Math.exp(-t * 25))) / SR;
        return Math.tanh(Math.sin(ph) * Math.exp(-t * 11) * 2.2) * g;
      },
      { gain },
    );
  }
};

// Vibration électronique : bourdon FM avec trémolo
const vibration = (start, dur, gain = 1) => {
  const f = svf(600, 1.2);
  let pc = 0;
  let pm = 0;
  place(
    fx,
    start,
    dur,
    (t) => {
      const x = t / dur;
      pm += (2 * Math.PI * 110) / SR;
      pc += (2 * Math.PI * 55 + Math.sin(pm) * (2 + x * 9) * 2 * Math.PI * 55) / SR;
      f.set(300 + x * 1600);
      f.run(Math.sin(pc));
      const env = Math.sin(Math.PI * x) ** 1.5 * (0.75 + 0.25 * Math.sin(2 * Math.PI * 13 * t));
      return f.lp * env * 1.4;
    },
    { gain, rev: 0.25 },
  );
};

const shimmer = (time, gain = 1) => {
  [88, 95, 100].forEach((m, i) => {
    const f0 = mtof(m);
    place(
      fx,
      time + i * 0.06,
      1.6,
      (t) => Math.sin(2 * Math.PI * f0 * t) * Math.exp(-t * 2.2) * Math.min(1, t * 200) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 7 * t)),
      { gain: gain * 0.25, pan: (i - 1) * 0.5, rev: 0.8 },
    );
  });
};

const tick = (time, gain = 1, pan = 0) => {
  const f = svf(3000 + rand() * 4000, 3);
  place(
    fx,
    time,
    0.03,
    (t) => {
      f.run(noise());
      return f.bp * Math.exp(-t * 260) * 3;
    },
    { gain, pan, rev: 0.15 },
  );
};

// Tambour épique type taiko
const taiko = (time, gain = 1, pitch = 1, pan = 0) => {
  let ph = 0;
  const f = svf(500, 0.8);
  place(
    drums,
    time,
    1.1,
    (t) => {
      ph += (2 * Math.PI * pitch * (52 + 70 * Math.exp(-t * 28))) / SR;
      f.run(noise());
      const body = Math.sin(ph) * Math.exp(-t * 4.5);
      const skin = f.lp * Math.exp(-t * 30) * 1.4;
      return Math.tanh((body + skin) * 1.8) * Math.min(1, t * 3000);
    },
    { gain, pan, rev: 0.45 },
  );
};

// « Braam » de bande-annonce : cuivres synthétiques graves qui s'ouvrent puis se ferment
const braam = (time, dur, notes, gain = 1) => {
  notes.forEach((m) => {
    [-1, 0, 1].forEach((d) => {
      const f0 = mtof(m) * Math.pow(2, (d * 6) / 1200);
      const H = Math.min(40, Math.floor(2400 / f0));
      let ph = rand();
      place(
        fx,
        time,
        dur + 0.6,
        (t) => {
          ph += f0 / SR;
          const p = 2 * Math.PI * ph;
          const open = Math.min(1, t / 0.18) * Math.exp(-t * 0.9);
          const cutoff = 1 + open * H;
          let s2 = 0;
          for (let n = 1; n <= H; n++) s2 += (Math.sin(p * n) / n) * Math.exp(-n / cutoff);
          const env = Math.min(1, t / 0.05) * (t < dur ? 1 : Math.exp(-(t - dur) * 6));
          return Math.tanh(s2 * 1.4) * env;
        },
        { gain: gain * 0.16, pan: d * 0.4, rev: 0.5 },
      );
    });
  });
};

const subDrop = (time, gain = 1) => {
  let ph = 0;
  place(
    fx,
    time,
    1.6,
    (t) => {
      ph += (2 * Math.PI * (24 + 40 * Math.exp(-t * 2.5))) / SR;
      return Math.sin(ph) * Math.exp(-t * 1.6) * Math.min(1, t * 400);
    },
    { gain },
  );
};

// Cymbale inversée : souffle qui enfle jusqu'au temps fort
const reverseCymbal = (end, dur, gain = 1) => {
  const f = svf(4000, 0.7);
  place(
    fx,
    end - dur,
    dur,
    (t) => {
      f.run(noise());
      return f.hp * Math.pow(t / dur, 3) * 1.2;
    },
    { gain, rev: 0.3 },
  );
};

const zap = (time, gain = 1) => {
  let ph = 0;
  place(
    fx,
    time,
    0.14,
    (t) => {
      ph += (2 * Math.PI * (2400 * Math.exp(-t * 30) + 120)) / SR;
      return Math.sin(ph) * Math.exp(-t * 22);
    },
    { gain, rev: 0.3, pan: rand() * 0.6 - 0.3 },
  );
};

// Crissement de chaussure sur parquet
const squeak = (time, gain = 1, pan = 0) => {
  let ph = 0;
  const f = svf(2600, 6);
  const f0 = 1700 + rand() * 900;
  place(
    fx,
    time,
    0.13,
    (t) => {
      ph += (2 * Math.PI * (f0 + 1300 * (t / 0.13))) / SR;
      f.run(noise() * 0.3 + Math.sin(ph));
      const flutter = 0.6 + 0.4 * Math.sin(2 * Math.PI * 95 * t);
      return f.bp * Math.sin((Math.PI * t) / 0.13) * flutter * 1.6;
    },
    { gain, pan, rev: 0.35 },
  );
};

const footstep = (time, gain = 1, pan = 0) => {
  let ph = 0;
  const f = svf(450, 0.8);
  place(
    fx,
    time,
    0.16,
    (t) => {
      ph += (2 * Math.PI * (95 + 40 * Math.exp(-t * 60))) / SR;
      f.run(noise());
      return (Math.sin(ph) * 0.8 + f.lp * 1.2) * Math.exp(-t * 32);
    },
    { gain, pan, rev: 0.4 },
  );
};

// Rebond de ballon de basket sur parquet
const bounce = (time, gain = 1, pan = 0) => {
  let ph = 0;
  let pr = 0;
  const f = svf(900, 1);
  place(
    fx,
    time,
    0.4,
    (t) => {
      ph += (2 * Math.PI * (88 + 70 * Math.exp(-t * 45))) / SR;
      pr += (2 * Math.PI * 310) / SR;
      f.run(noise());
      const body = Math.sin(ph) * Math.exp(-t * 16);
      const ring = Math.sin(pr) * Math.exp(-t * 26) * 0.35;
      const slap = f.bp * Math.exp(-t * 120) * 0.9;
      return Math.tanh((body + ring + slap) * 1.6);
    },
    { gain, pan, rev: 0.55 },
  );
};

const noiseFlash = (time, gain = 1) => {
  const f = svf(6000, 0.6);
  place(
    fx,
    time,
    1.0,
    (t) => {
      f.run(noise());
      return (f.hp * 0.8 + noise() * 0.2) * Math.exp(-t * 5);
    },
    { gain, rev: 0.4 },
  );
};

// --------------------------------------------------------------- harmonie
// Ré mineur : Dm, Bb, Gm, A
const CH = {
  Dm: { root: 38, pad: [50, 53, 57, 62], arp: [62, 65, 69, 74], braam: [26, 38, 45] },
  Bb: { root: 34, pad: [50, 53, 58, 62], arp: [62, 65, 70, 74], braam: [22, 34, 41] },
  Gm: { root: 31, pad: [50, 55, 58, 62], arp: [62, 67, 70, 74], braam: [31, 38, 43] },
  A: { root: 33, pad: [49, 52, 57, 61], arp: [61, 64, 69, 73], braam: [33, 40, 45] },
};

// =============================================== SCÈNE 1 — L'activation (0-4 s)
heartbeat(0.25, 0.9);
vibration(0.7, 1.9, 0.5);
shimmer(0.9, 1);
whoosh(1.6, 0.6, 0.35);
impact(1.6, 0.3);
pad(1.6, [38, 45, 50], 2.3, 0.7, 0.4);
for (let i = 0; i < 26; i++) tick(2.0 + i * 0.07 + rand() * 0.03, 0.12 + i * 0.006, rand() * 1.6 - 0.8);
taiko(2.2, 0.45, 0.9); // « DIX JOUEURS. »
taiko(2.9, 0.5, 1.1); // « UNE ÉQUIPE. »
riser(4.0, 1.4, 0.45);
reverseCymbal(4.0, 0.9, 0.35);

// =============================================== SCÈNE 2 — Les 10 joueurs (4-13 s)
const bars2 = [
  [4, "Dm"],
  [6, "Bb"],
  [8, "Gm"],
  [10, "A"],
  [12, "Dm"],
];
bars2.forEach(([t0, name], b) => {
  const ch = CH[name];
  const len = b === bars2.length - 1 ? 1 : 2;
  pad(t0, ch.pad, len - 0.05, 0.55);
  if (b % 2 === 0) braam(t0, 1.8, ch.braam, b === 0 ? 1 : 0.75);
  for (let k = 0; k < len / (BEAT / 2); k++) {
    const t = t0 + k * (BEAT / 2);
    bass(t, ch.root + (k % 4 === 2 ? 12 : 0), 0.2, 0.33);
    if (t >= 6) pluck(t, ch.arp[k % 4] + 12, t >= 10 ? 0.09 : 0.06, k % 2 ? 0.4 : -0.4);
  }
  for (let k = 0; k < len / BEAT; k++) {
    const t = t0 + k * BEAT;
    const half = t < 8;
    if (!half || k % 2 === 0) kick(t, 0.85);
    if (half ? k % 4 === 2 : k % 2 === 1) clap(t, 0.45);
    if (t >= 7) for (const o of [0, 0.25, 0.5, 0.75]) hat(t + o * BEAT, false, 0.03 + (t - 7) * 0.006, o === 0.25 ? -0.3 : 0.3);
  }
});
crash(4.0, 0.4);
impact(4.0, 0.7);
REVEALS.forEach((t, i) => {
  const fast = i >= 6;
  whoosh(t, fast ? 0.22 : 0.4, fast ? 0.35 : 0.45, i % 2 ? 0.7 : -0.7, i % 2 ? -0.7 : 0.7);
  taiko(t, 0.85, 0.9 + (i % 3) * 0.12, i % 2 ? 0.25 : -0.25);
  zap(t + 0.01, 0.18);
});
// Roulement de taikos qui accélère vers le rassemblement
for (let i = 0; i < 8; i++) taiko(12.5 + i * (BEAT / 8), 0.25 + i * 0.05, 1.3, i % 2 ? 0.4 : -0.4);

// =============================================== SCÈNE 3 — Le rassemblement (13-19 s)
impact(GATHER, 1);
subDrop(GATHER, 0.8);
braam(GATHER, 2.8, CH.Dm.braam, 1);
crash(GATHER, 0.45);
taiko(GATHER, 1, 0.8);
pad(GATHER + 0.5, [38, 45, 50, 53], 4.2, 0.6, 1.2);
[13.9, 14.9, 15.9, 16.9, 17.9].forEach((t) => heartbeat(t, 0.55));
// Pas de plusieurs joueurs qui convergent
for (let t = 14.0; t < 18.2; t += 0.5) {
  footstep(t + rand() * 0.04, 0.35, -0.5);
  footstep(t + 0.24 + rand() * 0.04, 0.3, 0.5);
  footstep(t + 0.12 + rand() * 0.05, 0.22, 0);
}
[14.3, 15.4, 16.1, 17.2].forEach((t, i) => squeak(t, 0.22, i % 2 ? 0.6 : -0.6));
[14.2, 14.75, 15.3, 15.85, 16.4].forEach((t) => bounce(t, 0.3, 0.35));
riser(FLASH, 1.9, 0.5);
for (let i = 0; i < 16; i++) snare(18.0 + i * (1 / 16), 0.08 + i * 0.03);

// =============================================== SCÈNE 4 — La révélation (19-23 s)
heartbeat(FREEZE + 0.05, 0.7);
reverseCymbal(FLASH, 0.5, 0.6);
impact(FLASH, 1);
subDrop(FLASH, 0.9);
braam(FLASH, 2.0, CH.Dm.braam, 1.1);
crash(FLASH, 0.55);
noiseFlash(FLASH, 0.35);
taiko(FLASH, 1, 0.85);
const bars4 = [
  [FLASH, "Dm"],
  [FLASH + 2, "Bb"],
];
bars4.forEach(([t0, name], b) => {
  const ch = CH[name];
  const len = b === 0 ? 2 : 1.5;
  pad(t0, ch.pad, len - 0.05, 0.7);
  if (b === 1) braam(t0, 1.4, ch.braam, 0.8);
  for (let k = 0; k < len / (BEAT / 2); k++) {
    const t = t0 + k * (BEAT / 2);
    bass(t, ch.root + (k % 4 === 2 ? 12 : 0), 0.2, 0.38);
    pluck(t, ch.arp[k % 4] + 12, 0.1, k % 2 ? 0.4 : -0.4);
  }
  for (let k = 0; k < len / BEAT; k++) {
    const t = t0 + k * BEAT;
    kick(t, 0.9);
    if (k % 2 === 1) clap(t, 0.5);
    taiko(t + BEAT / 2, 0.4, 1.2, k % 2 ? 0.3 : -0.3);
    for (const o of [0, 0.25, 0.5, 0.75]) hat(t + o * BEAT, false, 0.05, o === 0.25 ? -0.3 : 0.3);
  }
});

// =============================================== SCÈNE 5 — Vers le match (23-25 s)
bounce(BALL_LAUNCH, 0.7, 0);
pad(BALL_LAUNCH, CH.A.pad, 1.45, 0.75, 0.2);
braam(BALL_LAUNCH, 1.4, CH.A.braam, 0.7);
whoosh(BALL_HIT, 1.4, 0.75, 0, 0);
riser(BALL_HIT, 1.4, 0.5);
for (let i = 0; i < 12; i++) taiko(23.3 + i * 0.1, 0.3 + i * 0.05, 1 + i * 0.03, i % 2 ? 0.3 : -0.3);
for (let i = 0; i < 6; i++) kick(23.0 + i * BEAT * 0.5, 0.6 + i * 0.05);
impact(BALL_HIT, 1);
subDrop(BALL_HIT, 0.8);
braam(BALL_HIT, 0.5, CH.Dm.braam, 1);
crash(BALL_HIT, 0.6);
noiseFlash(BALL_HIT, 0.6);
kick(BALL_HIT, 1);

const out = process.argv[2] ?? "public/black-u15/audio.wav";
const peak = s.render(out, { fadeOut: 0.2, duckDepth: 0.4, roomSize: 0.84 });
console.log(`Écrit ${out} (${DURATION}s, crête avant normalisation ${peak.toFixed(2)})`);
