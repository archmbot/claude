// Génère la bande-son originale de la publicité QYLINE (musique + effets).
// Tout est synthétisé ici, sans aucun échantillon externe : aucun droit tiers.
// Usage : npm run audio  (écrit public/qyline-audio.wav)
import { writeFileSync } from "node:fs";

const SR = 48000;
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

const N = Math.ceil(SR * DURATION);
const bus = () => ({ L: new Float32Array(N), R: new Float32Array(N) });
const drums = bus();
const music = bus(); // compressée par la grosse caisse (sidechain)
const fx = bus();
const send = bus(); // envoi réverbération

let seed = 1234567;
const rand = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Filtre d'état variable (TPT), stable même avec une fréquence modulée.
const svf = (cutoff, q) => {
  let ic1 = 0;
  let ic2 = 0;
  let g = 0;
  const k = 1 / q;
  const f = {
    lp: 0,
    bp: 0,
    hp: 0,
    set(c) {
      g = Math.tan((Math.PI * Math.min(c, SR * 0.45)) / SR);
    },
    run(x) {
      const a1 = 1 / (1 + g * (g + k));
      const a2 = g * a1;
      const a3 = g * a2;
      const v3 = x - ic2;
      const v1 = a1 * ic1 + a2 * v3;
      const v2 = ic2 + a2 * ic1 + a3 * v3;
      ic1 = 2 * v1 - ic1;
      ic2 = 2 * v2 - ic2;
      f.lp = v2;
      f.bp = v1;
      f.hp = x - k * v1 - v2;
    },
  };
  f.set(cutoff);
  return f;
};

// Écrit une voix dans un bus. fn(t) renvoie l'échantillon ; pan peut être une fonction de t.
const place = (target, time, dur, fn, { pan = 0, gain = 1, rev = 0 } = {}) => {
  const s0 = Math.round(time * SR);
  const n = Math.round(dur * SR);
  for (let i = 0; i < n; i++) {
    const k = s0 + i;
    if (k >= N) break;
    const t = i / SR;
    const v = fn(t);
    if (k < 0) continue;
    const p = typeof pan === "function" ? pan(t) : pan;
    const gl = gain * Math.cos(((p + 1) * Math.PI) / 4);
    const gr = gain * Math.sin(((p + 1) * Math.PI) / 4);
    target.L[k] += v * gl;
    target.R[k] += v * gr;
    if (rev) {
      send.L[k] += v * gl * rev;
      send.R[k] += v * gr * rev;
    }
  }
};

// ------------------------------------------------------------ instruments
const kicks = [];
const kick = (time, gain = 1) => {
  kicks.push(time);
  let ph = 0;
  place(
    drums,
    time,
    0.45,
    (t) => {
      const f = 47 + 115 * Math.exp(-t * 32);
      ph += (2 * Math.PI * f) / SR;
      const env = Math.exp(-t * 6.5) * Math.min(1, t * 3000);
      const click = t < 0.003 ? noise() * (1 - t / 0.003) * 0.35 : 0;
      return Math.tanh(1.8 * Math.sin(ph) * env) * 0.95 + click;
    },
    { gain },
  );
};

const clap = (time, gain = 1, pan = 0) => {
  const f = svf(1500, 1.4);
  place(
    drums,
    time,
    0.4,
    (t) => {
      let env = 0;
      for (const o of [0, 0.01, 0.021]) {
        if (t >= o) env = Math.max(env, Math.exp(-(t - o) * 110));
      }
      if (t >= 0.021) env = Math.max(env, 0.6 * Math.exp(-(t - 0.021) * 13));
      f.run(noise());
      return f.bp * env * 2.4;
    },
    { gain, pan, rev: 0.35 },
  );
};

const snare = (time, gain = 1) => {
  const f = svf(2200, 0.9);
  let ph = 0;
  place(
    drums,
    time,
    0.2,
    (t) => {
      ph += (2 * Math.PI * (185 + 60 * Math.exp(-t * 40))) / SR;
      f.run(noise());
      return (f.bp * 1.6 + Math.sin(ph) * 0.5) * Math.exp(-t * 22);
    },
    { gain, rev: 0.25 },
  );
};

const hat = (time, open, gain = 1, pan = 0) => {
  const f = svf(9000, 0.8);
  const dec = open ? 18 : 75;
  place(
    drums,
    time,
    open ? 0.28 : 0.08,
    (t) => {
      f.run(noise());
      return f.hp * Math.exp(-t * dec);
    },
    { gain, pan },
  );
};

const crash = (time, gain = 1) => {
  const f = svf(5200, 0.7);
  place(
    fx,
    time,
    2.2,
    (t) => {
      f.run(noise());
      return f.hp * Math.exp(-t * 2.2) * Math.min(1, t * 800);
    },
    { gain, rev: 0.4 },
  );
};

const bass = (time, midi, dur, gain = 1) => {
  const f0 = mtof(midi);
  let ph = 0;
  place(
    music,
    time,
    dur + 0.06,
    (t) => {
      ph += f0 / SR;
      const p = 2 * Math.PI * ph;
      const bright = Math.exp(-t * 16);
      let s = 0;
      for (let n = 1; n <= 10; n++) {
        s += (Math.sin(p * n) / n) * Math.exp(-n * (0.6 - 0.42 * bright));
      }
      s += Math.sin(p) * 0.6; // sous-basse
      const rel = t < dur ? 1 : Math.max(0, 1 - (t - dur) / 0.06);
      return Math.tanh(s * 1.1) * Math.min(1, t * 500) * rel;
    },
    { gain },
  );
};

const padHarm = Array.from({ length: 13 }, (_, n) => (n === 0 ? 0 : Math.exp(-n / 4.5) / n));
const pad = (time, notes, dur, gain = 1, release = 0.5) => {
  notes.forEach((m, ni) => {
    [-1, 0, 1].forEach((d) => {
      const f0 = mtof(m) * Math.pow(2, (d * 9) / 1200);
      let ph = rand();
      place(
        music,
        time,
        dur + release + 0.3,
        (t) => {
          ph += f0 / SR;
          const p = 2 * Math.PI * ph;
          let s = 0;
          for (let n = 1; n < padHarm.length; n++) s += Math.sin(p * n) * padHarm[n];
          const a = Math.min(1, t / 0.12) * (t < dur ? 1 : Math.exp(-((t - dur) / release) * 4));
          return s * a;
        },
        { gain: gain * 0.11, pan: d * 0.55 + (ni - 1) * 0.1, rev: 0.45 },
      );
    });
  });
};

const pluck = (time, midi, gain = 1, pan = 0) => {
  const f0 = mtof(midi);
  place(
    music,
    time,
    0.55,
    (t) => {
      let s = 0;
      for (let n = 1; n <= 6; n++) {
        s += (Math.sin(2 * Math.PI * f0 * n * t) / n) * Math.exp(-t * (6 + 7 * n));
      }
      return s * Math.min(1, t * 1500);
    },
    { gain, pan, rev: 0.35 },
  );
};

const whoosh = (end, dur, gain = 1, from = -0.8, to = 0.8) => {
  const f = svf(300, 2.2);
  place(
    fx,
    end - dur,
    dur + 0.12,
    (t) => {
      const x = Math.min(1, t / dur);
      f.set(250 * Math.pow(36, x));
      f.run(noise());
      const env = t < dur ? Math.pow(x, 2.4) : Math.exp(-(t - dur) * 45);
      return f.bp * env * 2.6;
    },
    { gain, rev: 0.25, pan: (t) => from + (to - from) * Math.min(1, t / dur) },
  );
};

const riser = (end, dur, gain = 1) => {
  let ph = 0;
  place(
    fx,
    end - dur,
    dur,
    (t) => {
      const x = t / dur;
      ph += (2 * Math.PI * (180 * Math.pow(5, x))) / SR;
      return Math.sin(ph) * Math.pow(x, 2) * 0.5;
    },
    { gain, rev: 0.3 },
  );
  whoosh(end, dur, gain);
};

const impact = (time, gain = 1) => {
  let ph = 0;
  const f = svf(700, 0.7);
  place(
    fx,
    time,
    2.2,
    (t) => {
      ph += (2 * Math.PI * (36 + 55 * Math.exp(-t * 14))) / SR;
      f.run(noise());
      const body = Math.sin(ph) * Math.exp(-t * 2.4);
      const dust = f.lp * Math.exp(-t * 10) * 1.8;
      return Math.tanh((body + dust) * 1.5) * Math.min(1, t * 3000);
    },
    { gain, rev: 0.5 },
  );
};

const pop = (time, midi, gain = 1) => {
  let ph = 0;
  const target = mtof(midi);
  place(
    fx,
    time,
    0.16,
    (t) => {
      const f = target * Math.pow(2, (-5 * Math.exp(-t * 90)) / 12);
      ph += (2 * Math.PI * f) / SR;
      return (Math.sin(ph) + 0.25 * Math.sin(2 * ph)) * Math.exp(-t * 28) * Math.min(1, t * 4000);
    },
    { gain, rev: 0.3 },
  );
};

const stamp = (time, gain = 1) => {
  const f = svf(1800, 0.8);
  let ph = 0;
  place(
    fx,
    time,
    0.3,
    (t) => {
      ph += (2 * Math.PI * (120 + 80 * Math.exp(-t * 50))) / SR;
      f.run(noise());
      return (Math.sin(ph) * 0.9 + f.lp * 0.8) * Math.exp(-t * 18);
    },
    { gain, rev: 0.3 },
  );
};

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

// ---------------------------------------------------------------- mixage
// Sidechain : la musique s'efface brièvement sous chaque grosse caisse.
kicks.sort((a, b) => a - b);
const duck = new Float32Array(N).fill(1);
let ki = -1;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  while (ki + 1 < kicks.length && kicks[ki + 1] <= t) ki++;
  if (ki >= 0) duck[i] = 1 - 0.6 * Math.exp(-(t - kicks[ki]) * 9);
}

// Réverbération de type Freeverb (4 filtres en peigne + 2 passe-tout par canal)
const reverb = (input, spread) => {
  const out = new Float32Array(N);
  const combs = [1695, 1760, 1623, 1548].map((d) => ({
    buf: new Float32Array(d + spread),
    i: 0,
    store: 0,
  }));
  const aps = [605, 480].map((d) => ({ buf: new Float32Array(d + spread), i: 0 }));
  for (let n = 0; n < N; n++) {
    const x = input[n] * 0.3;
    let y = 0;
    for (const c of combs) {
      const o = c.buf[c.i];
      c.store = o * 0.7 + c.store * 0.3;
      c.buf[c.i] = x + c.store * 0.8;
      c.i = (c.i + 1) % c.buf.length;
      y += o;
    }
    for (const a of aps) {
      const b = a.buf[a.i];
      a.buf[a.i] = y + b * 0.5;
      a.i = (a.i + 1) % a.buf.length;
      y = b - y;
    }
    out[n] = y;
  }
  return out;
};
const wetL = reverb(send.L, 0);
const wetR = reverb(send.R, 23);

const hpL = svf(28, 0.7);
const hpR = svf(28, 0.7);
const outL = new Float32Array(N);
const outR = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) {
  hpL.run(drums.L[i] + music.L[i] * duck[i] + fx.L[i] + wetL[i] * 0.55);
  hpR.run(drums.R[i] + music.R[i] * duck[i] + fx.R[i] + wetR[i] * 0.55);
  outL[i] = hpL.hp;
  outR[i] = hpR.hp;
  peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
}

// Normalisation et légère saturation
const drive = 1.3;
for (let i = 0; i < N; i++) {
  outL[i] = (Math.tanh((outL[i] / peak) * drive) / Math.tanh(drive)) * 0.89;
  outR[i] = (Math.tanh((outR[i] / peak) * drive) / Math.tanh(drive)) * 0.89;
}

// Limiteur à anticipation : environ -14 LUFS, crête vraie sous -1 dBTP
const LEVEL_IN = 1.22;
const LIMIT = 0.76;
const LOOK = Math.round(SR * 0.004);
const need = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const a = Math.max(Math.abs(outL[i]), Math.abs(outR[i])) * LEVEL_IN;
  need[i] = a > LIMIT ? LIMIT / a : 1;
}
// minimum glissant sur la fenêtre d'anticipation, puis lissage de même longueur
const minAhead = new Float32Array(N);
const dq = [];
for (let i = N - 1; i >= 0; i--) {
  while (dq.length && need[dq[dq.length - 1]] >= need[i]) dq.pop();
  dq.push(i);
  while (dq[0] > i + LOOK) dq.shift();
  minAhead[i] = need[dq[0]];
}
const release = 1 - Math.exp(-1 / (SR * 0.06));
let g = 1;
let acc = LOOK; // fenêtre initialement remplie de 1
const fadeStart = DURATION - 0.6;
for (let i = 0; i < N; i++) {
  acc += minAhead[i] - (i >= LOOK ? minAhead[i - LOOK] : 1);
  const smooth = Math.min(minAhead[i], acc / LOOK);
  g = smooth < g ? smooth : g + (smooth - g) * release;
  const t = i / SR;
  const fade = t > fadeStart ? Math.max(0, 1 - (t - fadeStart) / 0.6) : 1;
  outL[i] = outL[i] * LEVEL_IN * g * fade;
  outR[i] = outR[i] * LEVEL_IN * g * fade;
}

// WAV PCM 16 bits stéréo
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, outL[i])) * 32767), i * 4);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, outR[i])) * 32767), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
const out = process.argv[2] ?? "public/qyline-audio.wav";
writeFileSync(out, Buffer.concat([header, data]));
console.log(`Écrit ${out} (${DURATION}s, crête avant normalisation ${peak.toFixed(2)})`);
