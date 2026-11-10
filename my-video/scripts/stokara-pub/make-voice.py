"""Voix off de la publicité Stokara (30 s, 9:16), voix Piper « tom » (française, masculine), rythme publicitaire.

Usage : python3 scripts/stokara-pub/make-voice.py <dossier contenant fr_FR-tom-medium.onnx et .onnx.json>
Modèle : https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-tom-medium.tar.bz2
Dépendances : pip install piper-tts kokoro-onnx scipy soundfile
Sorties : public/stokara-pub/voice.wav, public/stokara-pub/voice.json, src/stokara-pub/voice.ts
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
from narrate import build, piper_synth  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
MODELS = Path(sys.argv[1] if len(sys.argv) > 1 else ".piper")
LENGTH = float(sys.argv[2]) if len(sys.argv) > 2 else 0.88
build(
    models=MODELS,
    narration=Path(__file__).parent / "narration.txt",
    out_dir=ROOT / "public" / "stokara-pub",
    ts_path=ROOT / "src" / "stokara-pub" / "voice.ts",
    generator="scripts/stokara-pub/make-voice.py",
    speed=1.0,
    card={},  # pas de carton : les séquences s'enchaînent
    lead_in=0.35,
    sentence_gap=0.22,
    paragraph_gap=0.3,
    # débit un peu plus vif que le tutoriel (length_scale < 1 = plus rapide)
    synth=piper_synth(str(MODELS / "fr_FR-tom-medium.onnx"), str(MODELS / "fr_FR-tom-medium.onnx.json"), length_scale=LENGTH),
)
