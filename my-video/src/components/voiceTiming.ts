// Minutage d'une vidéo calée sur sa voix off (module généré par scripts/lib/narrate.py).
type VoiceData = {
  duration: number;
  seqs: { id: string; start: number; cardEnd: number; end: number }[];
  paras: { seq: number; start: number; end: number }[];
  words: { text: string; start: number; end: number; seq: number; para: number }[];
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[«»"“”()?!.,;:…\u00a0]/g, " ")
    .trim();

export const createTiming = (voice: VoiceData, fps: number) => {
  const f = (sec: number) => Math.round(sec * fps);
  const cache = new Map<string, number>();

  // Instant (s) où la voix commence une expression dans une séquence ; n = n-ième occurrence
  const cueSec = (seq: number, phrase: string, n = 0) => {
    const key = `${seq}|${phrase}|${n}`;
    const hit = cache.get(key);
    if (hit !== undefined) return hit;
    const words = voice.words.filter((w) => w.seq === seq);
    const parts = norm(phrase).split(/\s+/);
    let count = 0;
    for (let i = 0; i + parts.length <= words.length; i++) {
      const ok = parts.every((p, k) => {
        const w = norm(words[i + k].text);
        return k === parts.length - 1 ? w.startsWith(p) : w === p;
      });
      if (ok && count++ === n) {
        cache.set(key, words[i].start);
        return words[i].start;
      }
    }
    throw new Error(`Repère vocal introuvable : « ${phrase} » (séquence ${seq + 1})`);
  };

  return {
    DURATION: Math.ceil(voice.duration * fps),
    // Séquences en images absolues ; `card` = fin du carton de titre
    SEQS: voice.seqs.map((s) => ({ id: s.id, from: f(s.start), card: f(s.cardEnd) - f(s.start), duration: f(s.end) - f(s.start) })),
    cueSec,
    // Outils de minutage d'une séquence, en images relatives à son début
    timing: (seq: number) => {
      const s0 = voice.seqs[seq].start;
      const paras = voice.paras.filter((p) => p.seq === seq);
      return {
        T: (phrase: string, n = 0, offsetSec = 0) => f(cueSec(seq, phrase, n) + offsetSec - s0),
        PS: (k: number) => f(paras[k].start - s0),
        PE: (k: number) => f(paras[k].end - s0),
        END: f(voice.seqs[seq].end) - f(s0),
        sec: (x: number) => f(x),
      };
    },
  };
};
