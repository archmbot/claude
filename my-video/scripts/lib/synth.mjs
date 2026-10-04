// Petit moteur de synthèse partagé par les bandes-son des vidéos.
// Tout est synthétisé (aucun échantillon externe), de façon déterministe.
import { writeFileSync } from "node:fs";

export const SR = 48000;
export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Filtre d'état variable (TPT), stable même avec une fréquence modulée.
export const svf = (cutoff, q) => {
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

export const createSynth = ({ duration, seed = 1234567 }) => {
  const N = Math.ceil(SR * duration);
  const bus = () => ({ L: new Float32Array(N), R: new Float32Array(N) });
  const drums = bus();
  const music = bus(); // compressée par la grosse caisse (sidechain)
  const fx = bus();
  const send = bus(); // envoi réverbération

  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const noise = () => rand() * 2 - 1;

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

  // ---------------------------------------------------------- instruments
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

  // -------------------------------------------------------------- mixage
  // Réverbération de type Freeverb (4 filtres en peigne + 2 passe-tout par canal)
  const reverb = (input, spread, feedback) => {
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
        c.buf[c.i] = x + c.store * feedback;
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

  // Mixe les bus, normalise, limite (≈ -14 LUFS, crête vraie sous -1 dBTP) et écrit un WAV.
  const render = (path, { levelIn = 1.22, limit = 0.76, fadeOut = 0.6, duckDepth = 0.6, roomSize = 0.8 } = {}) => {
    // Sidechain : la musique s'efface brièvement sous chaque grosse caisse.
    kicks.sort((a, b) => a - b);
    const duck = new Float32Array(N).fill(1);
    let ki = -1;
    for (let i = 0; i < N; i++) {
      const t = i / SR;
      while (ki + 1 < kicks.length && kicks[ki + 1] <= t) ki++;
      if (ki >= 0) duck[i] = 1 - duckDepth * Math.exp(-(t - kicks[ki]) * 9);
    }

    const wetL = reverb(send.L, 0, roomSize);
    const wetR = reverb(send.R, 23, roomSize);

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

    // Limiteur à anticipation
    const LOOK = Math.round(SR * 0.004);
    const need = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const a = Math.max(Math.abs(outL[i]), Math.abs(outR[i])) * levelIn;
      need[i] = a > limit ? limit / a : 1;
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
    const fadeStart = duration - fadeOut;
    for (let i = 0; i < N; i++) {
      acc += minAhead[i] - (i >= LOOK ? minAhead[i - LOOK] : 1);
      const smooth = Math.min(minAhead[i], acc / LOOK);
      g = smooth < g ? smooth : g + (smooth - g) * release;
      const t = i / SR;
      const fade = t > fadeStart ? Math.max(0, 1 - (t - fadeStart) / fadeOut) : 1;
      outL[i] = outL[i] * levelIn * g * fade;
      outR[i] = outR[i] * levelIn * g * fade;
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
    writeFileSync(path, Buffer.concat([header, data]));
    return peak;
  };

  return {
    N,
    rand,
    noise,
    place,
    drums,
    music,
    fx,
    kicks,
    kick,
    clap,
    snare,
    hat,
    crash,
    bass,
    pad,
    pluck,
    whoosh,
    riser,
    impact,
    pop,
    stamp,
    render,
  };
};
