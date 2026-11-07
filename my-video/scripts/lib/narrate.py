"""Voix off longue (formation, explication) synthétisée phrase par phrase, avec minutage des mots.

Le texte (narration.txt) est découpé en séquences « ## Sn » ; une ligne = un paragraphe ;
[PAUSE n] = silence de n secondes ; {affiché|prononcé} et /…/ comme dans voice.py.
Chaque phrase est synthétisée (Kokoro, voix ff_siwis) puis placée à la suite, avec un carton
silencieux optionnel au début des séquences 2 et suivantes et une respiration entre phrases
et paragraphes. Le minutage obtenu pilote l'animation (module TypeScript généré).
"""
import json
import re
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

from voice import SR, VOICE, parse, trim, word_times


def build(models, narration, out_dir, ts_path, generator, speed, card, lead_in, sentence_gap, paragraph_gap):
    """Écrit voice.wav et voice.json (out_dir) et le module TS ; renvoie la durée en secondes."""
    models = Path(models)
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
        samples, sr = kokoro.create(to_phonemes(text), voice=VOICE, speed=speed, lang="fr-fr", is_phonemes=True)
        assert sr == SR
        return trim(np.asarray(samples, dtype=np.float32))

    # ------------------------------------------------------------------ lecture du texte
    text = Path(narration).read_text(encoding="utf-8")
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
        nonlocal t
        chunks.append(np.zeros(int(round(sec * SR)), dtype=np.float32))
        t += len(chunks[-1]) / SR

    silence(lead_in)
    for si, (name, items) in enumerate(seqs):
        start = t
        if si > 0 and card:
            silence(card)
        card_end = t
        for k, (kind, value) in enumerate(items):
            if kind == "pause":
                silence(value)
                continue
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
                    silence(sentence_gap)
            paras.append({"seq": si, "start": round(p_start, 3), "end": round(t, 3)})
            # respiration après un paragraphe, sauf si une pause écrite suit
            nxt = items[k + 1][0] if k + 1 < len(items) else None
            if nxt == "para" or (nxt is None and si < len(seqs) - 1):
                silence(paragraph_gap)
        seq_out.append({"id": name, "start": round(start, 3), "cardEnd": round(card_end, 3), "end": round(t, 3)})
        print(f"{name}: {start / 60:5.2f} -> {t / 60:5.2f} min", flush=True)

    track = np.concatenate(chunks)
    track = track / np.abs(track).max() * 0.89
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    sf.write(out_dir / "voice.wav", track, SR, subtype="PCM_16")
    data = {"duration": round(len(track) / SR, 3), "seqs": seq_out, "paras": paras, "words": words}
    (out_dir / "voice.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
    Path(ts_path).parent.mkdir(parents=True, exist_ok=True)
    Path(ts_path).write_text(
        f"// Généré par {generator} — ne pas modifier à la main.\n"
        "export type Word = { text: string; start: number; end: number; seq: number; para: number };\n"
        "export type Seq = { id: string; start: number; cardEnd: number; end: number };\n"
        "export const VOICE: { duration: number; seqs: Seq[]; paras: { seq: number; start: number; end: number }[]; words: Word[] } = "
        + json.dumps(data, ensure_ascii=False)
        + ";\n"
    )
    dur = len(track) / SR
    print(f"durée {dur / 60:.2f} min ({dur:.1f} s), {len(words)} mots, débit moyen {len(words) / (dur / 60):.0f} mots/min")
    return dur
