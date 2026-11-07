"""Voix off du chapitre 1.1 « Qu'est-ce qu'un réseau informatique ? » (environ 25 min).

Chaque phrase de narration.txt est synthétisée (Kokoro, voix ff_siwis) puis placée à la suite,
avec les silences du scénario : 3 s de carton au début des séquences 2 à 10, [PAUSE n] entre
les paragraphes, une courte respiration ailleurs. Le minutage obtenu pilote l'animation.

Usage : python3 scripts/reseau-1-1/make-voice.py <dossier des modèles Kokoro>
Sorties : public/reseau-1-1/voice.wav, public/reseau-1-1/voice.json, src/reseau/voice.ts
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
from narrate import build  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
build(
    models=sys.argv[1] if len(sys.argv) > 1 else ".kokoro",
    narration=Path(__file__).parent / "narration.txt",
    out_dir=ROOT / "public" / "reseau-1-1",
    ts_path=ROOT / "src" / "reseau" / "voice.ts",
    generator="scripts/reseau-1-1/make-voice.py",
    speed=0.92,  # débit posé, environ 150 mots par minute pauses comprises
    card=3.0,  # carton de titre des séquences 2 à 10 (s)
    lead_in=0.6,  # silence avant la première phrase (s)
    sentence_gap=0.45,  # entre deux phrases d'un paragraphe (s)
    paragraph_gap=0.9,  # entre deux paragraphes sans pause écrite (s)
)
