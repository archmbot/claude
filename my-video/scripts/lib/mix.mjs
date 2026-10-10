// Mixage d'une voix off (WAV mono) avec une musique synthétisée : la musique s'efface sous la voix.
import { readFileSync } from "node:fs";
import { SR, limiter, svf, writeWav } from "./synth.mjs";

// Repères vocaux : instant (s) où un mot commence ; n = n-ième occurrence
export const loadCues = (path) => {
  const cues = JSON.parse(readFileSync(path, "utf8"));
  return (word, n = 0) => {
    const hits = cues.words.filter((w) => w.text.toLowerCase().replace(/[^\p{L}\d.]/gu, "").startsWith(word));
    if (!hits[n]) throw new Error(`Repère introuvable : ${word}`);
    return hits[n].start;
  };
};

export const readWavMono = (path) => {
  const buf = readFileSync(path);
  let off = 12;
  let rate = 0;
  while (off < buf.length) {
    const id = buf.toString("ascii", off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === "fmt ") rate = buf.readUInt32LE(off + 12);
    if (id === "data") {
      const n = size / 2;
      const out = new Float32Array(n);
      for (let i = 0; i < n; i++) out[i] = buf.readInt16LE(off + 8 + i * 2) / 32768;
      return { data: out, rate };
    }
    off += 8 + size + (size % 2);
  }
  throw new Error("WAV invalide");
};

// Rééchantillonnage (interpolation de Catmull-Rom) vers 48 kHz
export const resample = (src, rate, n) => {
  const out = new Float32Array(n);
  const k = rate / SR;
  for (let i = 0; i < n; i++) {
    const x = i * k;
    const j = Math.floor(x);
    const f = x - j;
    const p0 = src[j - 1] ?? 0;
    const p1 = src[j] ?? 0;
    const p2 = src[j + 1] ?? 0;
    const p3 = src[j + 2] ?? 0;
    out[i] = p1 + 0.5 * f * (p2 - p0 + f * (2 * p0 - 5 * p1 + 4 * p2 - p3 + f * (3 * (p1 - p2) + p3 - p0)));
  }
  return out;
};

// music : résultat de synth.mixdown() ; N : nombre d'échantillons à 48 kHz ; duck : part de musique retirée sous la voix
export const mixWithVoice = ({ music, N, voicePath, out, musicGain, duck, levelIn = 1.25, limit = 0.84, fadeOut = 0.3 }) => {
  const { data, rate } = readWavMono(voicePath);
  const voice = resample(data, rate, N);
  // enveloppe de la voix (attaque 10 ms, relâchement 300 ms) -> la musique s'efface quand elle parle
  const att = 1 - Math.exp(-1 / (SR * 0.01));
  const rel = 1 - Math.exp(-1 / (SR * 0.3));
  let env = 0;
  const L = new Float32Array(N);
  const R = new Float32Array(N);
  const hp = svf(80, 0.7); // coupe le grave inutile de la voix
  for (let i = 0; i < N; i++) {
    const a = Math.abs(voice[i]);
    env += (a - env) * (a > env ? att : rel);
    const g = 1 - duck * Math.min(1, env / 0.05);
    hp.run(voice[i]);
    const m = (musicGain / music.peak) * g;
    L[i] = hp.hp + music.L[i] * m;
    R[i] = hp.hp + music.R[i] * m;
  }
  limiter(L, R, { levelIn, limit, fadeOut });
  writeWav(out, L, R);
};
