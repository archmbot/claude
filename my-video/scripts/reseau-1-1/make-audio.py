"""Bande son du chapitre 1.1 : voix off + quelques bruitages discrets, normalisée à -16 LUFS.

Bruitages (synthétisés) : souffle sur chaque carton de séquence, carillon sur le titre du
chapitre et l'écran de fin, tic-tac pendant les 8 s de réflexion des questions, carillon
à chaque correction. Nécessite d'avoir lancé make-voice.py ; utilise ffmpeg.

Usage : python3 scripts/reseau-1-1/make-audio.py  ->  public/reseau-1-1/audio.wav
"""
import json
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
DIR = ROOT / "public" / "reseau-1-1"
voice, SR = sf.read(DIR / "voice.wav", dtype="float32")
cues = json.loads((DIR / "voice.json").read_text())
fx = np.zeros_like(voice)
rng = np.random.default_rng(11)


def place(t, sig, gain):
    i = int(t * SR)
    n = min(len(sig), len(fx) - i)
    if n > 0:
        fx[i: i + n] += sig[:n] * gain


def env(n, attack, release):
    t = np.arange(n) / SR
    return np.minimum(1, t / attack) * np.exp(-t / release)


def whoosh(dur=0.7):
    n = int(dur * SR)
    noise = rng.standard_normal(n).astype(np.float32)
    # bruit filtré dont la coupure monte puis redescend (passe-bas à un pôle variable)
    out = np.zeros(n, dtype=np.float32)
    y = 0.0
    for k in range(n):
        x = k / n
        a = 0.02 + 0.25 * np.sin(np.pi * x)
        y += a * (noise[k] - y)
        out[k] = y
    return out * np.sin(np.pi * np.arange(n) / n) ** 2


def chime(notes=(72, 76, 79), step=0.09):
    total = int((len(notes) * step + 1.6) * SR)
    out = np.zeros(total, dtype=np.float32)
    for j, m in enumerate(notes):
        f0 = 440 * 2 ** ((m - 69) / 12)
        n = int(1.6 * SR)
        t = np.arange(n) / SR
        tone = (np.sin(2 * np.pi * f0 * t) + 0.3 * np.sin(4 * np.pi * f0 * t)) * env(n, 0.005, 0.45)
        i = int(j * step * SR)
        out[i: i + n] += tone.astype(np.float32)
    return out / np.abs(out).max()


def tick(f0=1800):
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f0 * t) * env(n, 0.001, 0.008)).astype(np.float32)


seqs, paras = cues["seqs"], cues["paras"]
for s in seqs[1:]:
    place(s["start"] + 0.1, whoosh(), 0.10)
# titre du chapitre (après le 4e paragraphe de la séquence 1) et écran de fin
s1 = [p for p in paras if p["seq"] == 0]
place(s1[3]["end"] + 0.3, chime((72, 76, 79, 84)), 0.10)
s10 = [p for p in paras if p["seq"] == 9]
place(s10[-1]["end"] + 0.4, chime((72, 77, 81, 84)), 0.10)
# questions : tic-tac pendant la réflexion, carillon à la correction
s9 = [p for p in paras if p["seq"] == 8]
for i in range(5):
    q_end, ans = s9[2 * i + 1]["end"], s9[2 * i + 2]["start"]
    k = 0
    while q_end + 0.5 + k < ans - 0.3:
        place(q_end + 0.5 + k, tick(1800 if k % 2 == 0 else 1500), 0.12)
        k += 1
    place(ans - 0.15, chime((79, 84)), 0.08)

mix = voice + fx
tmp = DIR / "mix-tmp.wav"
sf.write(tmp, mix, SR, subtype="FLOAT")

# normalisation en deux passes (ffmpeg loudnorm), sortie 48 kHz
probe = subprocess.run(
    ["ffmpeg", "-nostats", "-i", str(tmp), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
    capture_output=True,
    text=True,
).stderr
m = json.loads(probe[probe.rindex("{"): probe.rindex("}") + 1])
flt = (
    f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
    f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-af", flt, "-ar", "48000", "-c:a", "pcm_s16le", str(DIR / "audio.wav")], check=True)
tmp.unlink()
print(f"Écrit {DIR / 'audio.wav'} ({len(mix) / SR / 60:.2f} min)")
