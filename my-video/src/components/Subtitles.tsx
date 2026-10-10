// Sous-titres synchronisés sur la voix off, mot à mot, avec mots-clés mis en évidence.
// Le minutage vient des scripts make-voice.py ; `offset` (secondes) permet de tout décaler.
import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, clamp, hard } from "../qyline/shared";

export type CaptionWord = { text: string; start: number; end: number; scene: number; sentence: number };
type IndexedWord = CaptionWord & { i: number };
type Chunk = { words: IndexedWord[]; start: number; end: number };

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\d.']/gu, "")
    .replace(/\.$/, "");

// Indices des mots appartenant à une expression clé
const keyIndexes = (words: CaptionWord[], phrases: string[]) => {
  const keys = new Set<number>();
  phrases.forEach((phrase) => {
    const parts = phrase.split(" ").map(norm);
    words.forEach((_, i) => {
      if (parts.every((p, k) => words[i + k] && norm(words[i + k].text) === p)) parts.forEach((_, k) => keys.add(i + k));
    });
  });
  return keys;
};

// Morceaux courts (au plus 4 mots / 22 caractères), coupés à la ponctuation
const buildChunks = (words: CaptionWord[]) => {
  const out: Chunk[] = [];
  let cur: IndexedWord[] = [];
  const flush = () => {
    if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  words.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    if (prev && (prev.sentence !== w.sentence || prev.scene !== w.scene)) flush();
    cur.push({ ...w, i });
    const chars = cur.reduce((a, x) => a + x.text.length + 1, 0);
    if (/[,:;?!.]$/.test(w.text) || cur.length >= 4 || chars > 22) flush();
  });
  flush();
  // chaque morceau reste affiché jusqu'au suivant (au plus 0,6 s de plus)
  out.forEach((c, k) => {
    const next = out[k + 1];
    c.end = Math.min(c.end + 0.6, next ? next.start : c.end + 0.6);
  });
  return out;
};

export const Subtitles: React.FC<{
  words: CaptionWord[];
  keyPhrases: string[];
  top: number;
  left?: number;
  right?: number;
  offset?: number;
  fontSize?: number;
  keyBg: string;
  keyColor: string;
  shadow: string; // couleur de l'ombre du texte et des étiquettes
}> = ({ words, keyPhrases, top, left = 60, right = 60, offset = 0, fontSize = 58, keyBg, keyColor, shadow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => buildChunks(words), [words]);
  const keys = useMemo(() => keyIndexes(words, keyPhrases), [words, keyPhrases]);
  const t = frame / fps - offset;
  const chunk = chunks.find((c) => t >= c.start - 0.05 && t < c.end);
  if (!chunk) return null;
  const local = frame - Math.round((chunk.start + offset) * fps);
  const pop = spring({ frame: local, fps, config: { damping: 14, stiffness: 260 } });
  return (
    <div
      style={{
        position: "absolute",
        left,
        right,
        top,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px 16px",
        transform: `translateY(${(1 - pop) * 24}px) scale(${0.92 + 0.08 * pop})`,
        opacity: interpolate(pop, [0, 0.3], [0, 1], clamp),
      }}
    >
      {chunk.words.map((w) => {
        const key = keys.has(w.i);
        const spoken = t >= w.start;
        return (
          <span
            key={w.i}
            style={{
              fontFamily: BODY,
              fontWeight: 800,
              fontSize,
              lineHeight: 1.15,
              padding: key ? "2px 12px" : "2px 0",
              color: key ? keyColor : "#FFFFFF",
              background: key ? keyBg : "transparent",
              boxShadow: key ? hard(5, shadow) : undefined,
              textShadow: key ? undefined : `0 4px 0 ${shadow}, 0 0 18px rgba(18,26,51,0.8)`,
              opacity: spoken ? 1 : 0.55,
              transform: `rotate(${key ? -1.5 : 0}deg)`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
