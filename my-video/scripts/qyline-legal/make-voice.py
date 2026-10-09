"""Voix off française de la vidéo QYLINE « mentions légales » (synthèse Kokoro, voix ff_siwis).

Usage : python3 scripts/qyline-legal/make-voice.py <dossier_modeles_kokoro>
  Le dossier doit contenir kokoro-v1.0.onnx et voices-v1.0.bin, téléchargeables sur
  https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
  (pip install kokoro-onnx soundfile)

Écrit :
  public/qyline-legal/voice.wav        voix seule, 24 kHz mono, 60 s
  public/qyline-legal/voice-cues.json  minutage des mots (pour le mixage audio)
  src/qyline-legal/voice.ts            minutage des mots (sous-titres et animations)

Chaque phrase est synthétisée d'un bloc (intonation naturelle). Le minutage des mots est
estimé : les pauses détectées dans l'audio calent les virgules, puis le temps de chaque
morceau est réparti selon la longueur des mots prononcés.
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

SR = 24000
DURATION = 60.0
VOICE = "ff_siwis"

# Prononciations imposées, en phonèmes (entre barres obliques dans le texte prononcé)
QYLINE = "/kˈaɪlaɪn/"  # « QYLINE » lu à l'anglaise : « kaï-laïne »
ORG = "/ˈɔʁɡ/"  # « .org » dit « orgue »

# {affiché|prononcé} : ce que l'on lit à l'écran et ce que la voix dit ; /…/ = phonèmes imposés
SCENES = [
    {  # 0-7 s (la fin de phrase peut déborder un peu sur la scène suivante)
        "window": (0.2, 7.5),
        "sentences": [
            "Vous êtes artisan ou entrepreneur, et vous possédez un site internet ?",
            "Attention : une simple obligation oubliée peut vous exposer à de lourdes sanctions.",
        ],
    },
    {  # 7-17 s
        "window": (7.7, 16.8),
        "sentences": [
            "En France, l'absence des mentions légales obligatoires peut être sanctionnée jusqu'à "
            "{75 000 euros|soixante-quinze mille euros} d'amende, et un an d'emprisonnement, pour une personne physique.",
        ],
    },
    {  # 17-30 s
        "window": (17.25, 29.8),
        "sentences": [
            "Vos visiteurs doivent pouvoir identifier votre entreprise : votre identité, vos coordonnées, "
            "les informations d'immatriculation requises, et votre hébergeur.",
            "Ces informations doivent être facilement accessibles.",
        ],
    },
    {  # 30-42 s
        "window": (30.25, 41.8),
        "sentences": [
            "La solution ?",
            "Vérifiez vos informations, et ajoutez une page de mentions légales facilement accessible, "
            "par exemple depuis le pied de page de votre site.",
        ],
    },
    {  # 42-52 s
        "window": (42.3, 51.8),
        "sentences": [
            f"Chez {{QYLINE|{QYLINE}}}, nous créons des sites internet modernes, et vous accompagnons dans la mise "
            "en place des informations légales adaptées à votre activité.",
        ],
    },
    {  # 52-60 s
        "window": (52.25, 59.35),
        "sentences": [
            "N'attendez pas qu'un problème survienne.",
            "Vérifiez votre site dès aujourd'hui.",
            f"{{QYLINE|{QYLINE}}}, votre partenaire web.",
            f"Rendez-vous sur {{qyline.org|{QYLINE} point {ORG}}}.",
        ],
    },
]
GAP = 0.22  # silence entre deux phrases d'une même scène
MIN_SPEED, MAX_SPEED = 1.05, 1.3


def parse(sentence):
    """-> (texte prononcé, mots affichés avec leur poids de durée)."""
    spoken, words = [], []
    for part in re.split(r"(\{[^}]*\})", sentence):
        if not part:
            continue
        if part.startswith("{"):
            shown, said = part[1:-1].split("|")
            spoken.append(said)
            ws = shown.split()
            weight = len(re.sub(r"[^\w]", "", said)) / len(ws)
            words += [(w, weight) for w in ws]
        else:
            spoken.append(part)
            words += [(w, max(1, len(re.sub(r"[^\w]", "", w)))) for w in part.split()]
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


def main():
    models = Path(sys.argv[1])
    kokoro = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))
    track = np.zeros(int(SR * DURATION), dtype=np.float32)
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

    for si, scene in enumerate(SCENES):
        w0, w1 = scene["window"]
        parsed = [parse(s) for s in scene["sentences"]]
        # débit : naturel et dynamique, accéléré seulement si la scène l'exige
        natural = sum(len(synth(sp, 1.0)) / SR for sp, _ in parsed) + GAP * (len(parsed) - 1)
        speed = min(MAX_SPEED, max(MIN_SPEED, natural / (w1 - w0)))
        audios = [synth(sp, speed) for sp, _ in parsed]
        # la vitesse n'est pas parfaitement proportionnelle : on corrige jusqu'à tenir dans le créneau
        for _ in range(4):
            total = sum(len(a) / SR for a in audios) + GAP * (len(audios) - 1)
            if total <= w1 - w0 or speed >= MAX_SPEED:
                break
            speed = min(MAX_SPEED, speed * total / (w1 - w0) * 1.01)
            audios = [synth(sp, speed) for sp, _ in parsed]
        t = w0
        for spoken, _ in parsed:
            print("   ", to_phonemes(spoken))
        for sent_i, ((spoken, words), a) in enumerate(zip(parsed, audios)):
            i0 = int(t * SR)
            track[i0: i0 + len(a)] += a[: len(track) - i0]
            for w in word_times(a, words):
                words_out.append({**w, "start": round(t + w["start"], 3), "end": round(t + w["end"], 3), "scene": si, "sentence": sent_i})
            t += len(a) / SR + GAP
        end = t - GAP
        scenes_out.append({"start": w0, "end": round(end, 3), "speed": round(speed, 3)})
        print(f"scène {si + 1}: {w0:.2f}-{end:.2f}s (créneau jusqu'à {w1:.2f}s), débit x{speed:.2f}")
        if end > w1 + 0.05:
            print(f"  ATTENTION : la voix dépasse le créneau de {end - w1:.2f}s")

    peak = np.abs(track).max()
    track = track / peak * 0.89
    Path("public/qyline-legal").mkdir(parents=True, exist_ok=True)
    sf.write("public/qyline-legal/voice.wav", track, SR, subtype="PCM_16")
    data = {"words": words_out, "scenes": scenes_out}
    Path("public/qyline-legal/voice-cues.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
    Path("src/qyline-legal/voice.ts").write_text(
        "// Généré par scripts/qyline-legal/make-voice.py — ne pas modifier à la main.\n"
        "export type VoiceWord = { text: string; start: number; end: number; scene: number; sentence: number };\n"
        f"export const VOICE: {{ words: VoiceWord[]; scenes: {{ start: number; end: number; speed: number }}[] }} = {json.dumps(data, ensure_ascii=False)};\n"
    )
    print(f"{len(words_out)} mots minutés")


main()
