"""Moteur de voix off française (synthèse Kokoro, voix ff_siwis) avec minutage des mots.

Utilisé par les scripts make-voice.py de chaque vidéo. Dépendances : pip install kokoro-onnx soundfile
Modèles kokoro-v1.0.onnx et voices-v1.0.bin :
https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

Chaque phrase est synthétisée d'un bloc (intonation naturelle). Le minutage des mots est
estimé : les pauses détectées dans l'audio calent les virgules, puis le temps de chaque
morceau est réparti selon la longueur des mots prononcés.
Syntaxe des phrases : {affiché|prononcé} ; /…/ = phonèmes imposés.
"""
import json
import re
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

SR = 24000
VOICE = "ff_siwis"

# Prononciations imposées, en phonèmes
QYLINE = "/kˈaɪlaɪn/"  # « QYLINE » lu à l'anglaise : « kaï-laïne »
ORG = "/ˈɔʁɡ/"  # « .org » dit « orgue »

def parse(sentence):
    """-> (texte prononcé, mots affichés avec leur poids de durée)."""
    spoken, words = [], []
    for part in re.split(r"(\{[^}]*\})", sentence):
        if not part:
            continue
        if part.startswith("{"):
            shown, said = part[1:-1].split("|")
            spoken.append(said)
            ws = [w for w in shown.split(" ") if w]  # l'espace insécable (« 625 € ») ne coupe pas
            weight = len(re.sub(r"[^\w]", "", said)) / len(ws)
            words += [(w, weight) for w in ws]
        else:
            spoken.append(part)
            words += [(w, max(1, len(re.sub(r"[^\w]", "", w)))) for w in part.split(" ") if w]
    # ponctuation française (« ? », « : ») rattachée au mot précédent par une espace insécable
    merged = []
    for w, weight in words:
        if merged and re.fullmatch(r"[?!:;]+", w):
            merged[-1] = (merged[-1][0] + " " + w, merged[-1][1])
        elif merged and re.fullmatch(r"[,.]+", w):
            merged[-1] = (merged[-1][0] + w, merged[-1][1])
        else:
            merged.append((w, weight))
    return "".join(spoken), merged


def trim(a, thr=0.004):
    """Retire le silence au début et à la fin, en gardant 40 ms après la dernière consonne."""
    idx = np.where(np.abs(a) > thr)[0]
    return a[idx[0]: idx[-1] + int(0.04 * SR)] if len(idx) else a


def pauses(a):
    """Silences internes (début, fin) en secondes."""
    hop = int(SR * 0.01)
    rms = np.array([np.sqrt(np.mean(a[i: i + hop] ** 2)) for i in range(0, len(a) - hop, hop)])
    quiet = rms < 0.06 * rms.max()
    out, start = [], None
    for i, q in enumerate(quiet):
        if q and start is None:
            start = i
        if not q and start is not None:
            if i - start >= 9:
                out.append((start * 0.01, i * 0.01))
            start = None
    return out


def word_times(a, words):
    """Minutage des mots d'une phrase : virgules calées sur les pauses, puis répartition."""
    dur = len(a) / SR
    total = sum(w for _, w in words)
    ends_clause = [bool(re.search(r"[,:;]$", t)) for t, _ in words[:-1]] + [False]
    # instant « attendu » de chaque fin de proposition, puis pause la plus proche
    cut_points, acc = [], 0.0
    for (t, w), end in zip(words, ends_clause):
        acc += w
        if end:
            cut_points.append(acc / total)
    found = pauses(a)
    bounds = [(0.0, None)]
    for f in cut_points:
        expect = f * dur
        near = min(found, key=lambda p: abs((p[0] + p[1]) / 2 - expect), default=None)
        if near and abs((near[0] + near[1]) / 2 - expect) < 0.6:
            bounds[-1] = (bounds[-1][0], near[0])
            bounds.append((near[1], None))
        else:
            bounds[-1] = (bounds[-1][0], expect)
            bounds.append((expect, None))
    bounds[-1] = (bounds[-1][0], dur)
    # groupes de mots par proposition
    groups, cur = [], []
    for (t, w), end in zip(words, ends_clause):
        cur.append((t, w))
        if end:
            groups.append(cur)
            cur = []
    groups.append(cur)
    out = []
    for (g0, g1), group in zip(bounds, groups):
        gw = sum(w for _, w in group)
        t = g0
        for word, w in group:
            d = (g1 - g0) * w / gw
            out.append({"text": word, "start": round(t, 3), "end": round(t + d, 3)})
            t += d
    return out


def build(models, scenes, duration, out_dir, ts_path, generator, gap=0.22, min_speed=1.05, max_speed=1.3):
    """Synthétise toutes les scènes et écrit voice.wav, voice-cues.json (out_dir) et le module TS."""
    models = Path(models)
    kokoro = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))
    track = np.zeros(int(SR * duration), dtype=np.float32)
    words_out, scenes_out = [], []

    def to_phonemes(text):
        """Texte français -> phonèmes, en gardant tels quels les passages /…/ imposés."""
        out = []
        for i, part in enumerate(re.split(r"/([^/]+)/", text)):
            if i % 2:
                out.append(part)
            elif part.strip():
                out.append(kokoro.tokenizer.phonemize(part, "fr-fr"))
        ph = " ".join(o for o in out if o)
        # espeak encadre les mots anglais (« web ») de balises « (en) … (fr) » que Kokoro prononcerait
        ph = re.sub(r"\([a-z]{2}(?:-[a-z]{2})?\)", "", ph)
        ph = re.sub(r"\s+([,.;:?!])", r"\1", ph)
        return re.sub(r"\s{2,}", " ", ph).strip()

    def synth(text, speed):
        samples, sr = kokoro.create(to_phonemes(text), voice=VOICE, speed=speed, lang="fr-fr", is_phonemes=True)
        assert sr == SR
        return trim(np.asarray(samples, dtype=np.float32))

    for si, scene in enumerate(scenes):
        w0, w1 = scene["window"]
        parsed = [parse(s) for s in scene["sentences"]]
        # débit : naturel et dynamique, accéléré seulement si la scène l'exige
        natural = sum(len(synth(sp, 1.0)) / SR for sp, _ in parsed) + gap * (len(parsed) - 1)
        speed = min(max_speed, max(min_speed, natural / (w1 - w0)))
        audios = [synth(sp, speed) for sp, _ in parsed]
        # la vitesse n'est pas parfaitement proportionnelle : on corrige jusqu'à tenir dans le créneau
        for _ in range(4):
            total = sum(len(a) / SR for a in audios) + gap * (len(audios) - 1)
            if total <= w1 - w0 or speed >= max_speed:
                break
            speed = min(max_speed, speed * total / (w1 - w0) * 1.01)
            audios = [synth(sp, speed) for sp, _ in parsed]
        t = w0
        for spoken, _ in parsed:
            print("   ", to_phonemes(spoken))
        for sent_i, ((spoken, words), a) in enumerate(zip(parsed, audios)):
            i0 = int(t * SR)
            track[i0: i0 + len(a)] += a[: len(track) - i0]
            for w in word_times(a, words):
                words_out.append({**w, "start": round(t + w["start"], 3), "end": round(t + w["end"], 3), "scene": si, "sentence": sent_i})
            t += len(a) / SR + gap
        end = t - gap
        scenes_out.append({"start": w0, "end": round(end, 3), "speed": round(speed, 3)})
        print(f"scène {si + 1}: {w0:.2f}-{end:.2f}s (créneau jusqu'à {w1:.2f}s), débit x{speed:.2f}")
        if end > w1 + 0.05:
            print(f"  ATTENTION : la voix dépasse le créneau de {end - w1:.2f}s")

    peak = np.abs(track).max()
    track = track / peak * 0.89
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    sf.write(out_dir / "voice.wav", track, SR, subtype="PCM_16")
    data = {"words": words_out, "scenes": scenes_out}
    (out_dir / "voice-cues.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
    Path(ts_path).write_text(
        f"// Généré par {generator} — ne pas modifier à la main.\n"
        "export type VoiceWord = { text: string; start: number; end: number; scene: number; sentence: number };\n"
        f"export const VOICE: {{ words: VoiceWord[]; scenes: {{ start: number; end: number; speed: number }}[] }} = {json.dumps(data, ensure_ascii=False)};\n"
    )
    print(f"{len(words_out)} mots minutés")
