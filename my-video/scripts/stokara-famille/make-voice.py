"""Voix off de la publicité « Particuliers et familles » (9:16) : voix Kokoro « ff_siwis » (française), rythme publicitaire.

Choisie après comparaison de plusieurs voix françaises libres (Piper tom, pierre, miro, siwis ; Kokoro)
retranscrites par Whisper : c'est la plus nette (« euros », « gigas », « glisser-déposer ») et l'une des plus vivantes.
Usage : python3 scripts/stokara-famille/make-voice.py <dossier contenant kokoro-v1.0.onnx et voices-v1.0.bin> [vitesse]
Modèles : https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
Dépendances : pip install kokoro-onnx soundfile scipy
Sorties : public/stokara-famille/voice.wav, public/stokara-famille/voice.json, src/stokara-famille/voice.ts
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
from narrate import build  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
MODELS = Path(sys.argv[1] if len(sys.argv) > 1 else ".tts")
SPEED = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
build(
    models=MODELS,
    narration=Path(__file__).parent / "narration.txt",
    out_dir=ROOT / "public" / "stokara-famille",
    ts_path=ROOT / "src" / "stokara-famille" / "voice.ts",
    generator="scripts/stokara-famille/make-voice.py",
    speed=SPEED,  # Kokoro : > 1 = plus rapide
    card={},  # pas de carton : les séquences s'enchaînent
    lead_in=0.3,
    sentence_gap=0.2,
    paragraph_gap=0.26,
)
