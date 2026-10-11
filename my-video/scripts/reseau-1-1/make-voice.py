"""Voix off du chapitre 1.1 « Qu'est-ce qu'un réseau informatique ? » (environ 25 min).

Chaque phrase de narration.txt est synthétisée (Kokoro, voix ff_siwis) puis placée à la suite,
avec les silences du scénario : 3 s de carton au début des séquences 2 à 10, [PAUSE n] entre
les paragraphes, une courte respiration ailleurs. Le minutage obtenu pilote l'animation.

Usage : python3 scripts/reseau-1-1/make-voice.py <dossier des modèles Kokoro>
Sorties : public/reseau-1-1/voice.wav, public/reseau-1-1/voice.json, src/reseau/voice.ts
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
from voice import SR, VOICE, parse, trim, word_times  # noqa: E402

SPEED = 0.92  # débit posé, environ 150 mots par minute pauses comprises
CARD = 3.0  # carton de titre des séquences 2 à 10 (s)
LEAD_IN = 0.6  # silence avant la première phrase (s)
SENTENCE_GAP = 0.45  # entre deux phrases d'un paragraphe (s)
PARAGRAPH_GAP = 0.9  # entre deux paragraphes sans pause écrite (s)

ROOT = Path(__file__).resolve().parents[2]
models = Path(sys.argv[1] if len(sys.argv) > 1 else ".kokoro")
kokoro = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))


def to_phonemes(text):
    out = []
    for i, part in enumerate(re.split(r"/([^/]+)/", text)):
        if i % 2:
            out.append(part)
        elif part.strip():
            out.append(kokoro.tokenizer.phonemize(part, "fr-fr"))
    ph = " ".join(o for o in out if o)
    ph = re.sub(r"\([a-z]{2}(?:-[a-z]{2})?\)", "", ph)  # balises de langue d'espeak
    ph = re.sub(r"\s+([,.;:?!])", r"\1", ph)
    return re.sub(r"\s{2,}", " ", ph).strip()


def synth(text):
    samples, sr = kokoro.create(to_phonemes(text), voice=VOICE, speed=SPEED, lang="fr-fr", is_phonemes=True)
    assert sr == SR
    return trim(np.asarray(samples, dtype=np.float32))


# ------------------------------------------------------------------ lecture du texte
text = (Path(__file__).parent / "narration.txt").read_text(encoding="utf-8")
seqs = []
for block in re.split(r"^## ", text, flags=re.M)[1:]:
    name, body = block.split("\n", 1)
    items = []
    for line in body.strip().split("\n"):
        m = re.match(r"\[PAUSE (\d+)\]", line.strip())
        if m:
            items.append(("pause", int(m.group(1))))
        elif line.strip():
            items.append(("para", line.strip()))
    seqs.append((name.strip(), items))

# ------------------------------------------------------------------ synthèse et placement
chunks, words, paras, seq_out = [], [], [], []
t = 0.0


def silence(sec):
    global t
    chunks.append(np.zeros(int(round(sec * SR)), dtype=np.float32))
    t += len(chunks[-1]) / SR


silence(LEAD_IN)
for si, (name, items) in enumerate(seqs):
    start = t
    if si > 0:
        silence(CARD)
    card_end = t
    for k, (kind, value) in enumerate(items):
        if kind == "pause":
            silence(value)
            continue
        # respiration après un paragraphe, sauf si une pause écrite suit
        sentences = [s for s in re.split(r"(?<=[.?!])\s+(?![^{]*\})", value) if s]
        p_start = t
        for j, sentence in enumerate(sentences):
            spoken, shown = parse(sentence)
            a = synth(spoken)
            for w in word_times(a, shown):
                words.append({"text": w["text"], "start": round(t + w["start"], 3), "end": round(t + w["end"], 3), "seq": si, "para": len(paras)})
            chunks.append(a)
            t += len(a) / SR
            if j < len(sentences) - 1:
                silence(SENTENCE_GAP)
        paras.append({"seq": si, "start": round(p_start, 3), "end": round(t, 3)})
        nxt = items[k + 1][0] if k + 1 < len(items) else None
        if nxt == "para" or (nxt is None and si < len(seqs) - 1):
            silence(PARAGRAPH_GAP)
    seq_out.append({"id": name, "start": round(start, 3), "cardEnd": round(card_end, 3), "end": round(t, 3)})
    print(f"{name}: {start / 60:5.2f} -> {t / 60:5.2f} min", flush=True)

track = np.concatenate(chunks)
track = track / np.abs(track).max() * 0.89
out_dir = ROOT / "public" / "reseau-1-1"
out_dir.mkdir(parents=True, exist_ok=True)
sf.write(out_dir / "voice.wav", track, SR, subtype="PCM_16")
data = {"duration": round(len(track) / SR, 3), "seqs": seq_out, "paras": paras, "words": words}
(out_dir / "voice.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
(ROOT / "src" / "reseau").mkdir(parents=True, exist_ok=True)
(ROOT / "src" / "reseau" / "voice.ts").write_text(
    "// Généré par scripts/reseau-1-1/make-voice.py — ne pas modifier à la main.\n"
    "export type Word = { text: string; start: number; end: number; seq: number; para: number };\n"
    "export type Seq = { id: string; start: number; cardEnd: number; end: number };\n"
    "export const VOICE: { duration: number; seqs: Seq[]; paras: { seq: number; start: number; end: number }[]; words: Word[] } = "
    + json.dumps(data, ensure_ascii=False)
    + ";\n"
)
n = len([w for w in words])
print(f"durée {len(track) / SR / 60:.2f} min, {n} mots, débit moyen {n / (len(track) / SR / 60):.0f} mots/min")
