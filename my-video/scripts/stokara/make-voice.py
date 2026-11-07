"""Voix off du tutoriel « Stokara : le guide complet » (≈ 12 min), voix Piper « tom » (française, masculine).

Usage : python3 scripts/stokara/make-voice.py <dossier contenant fr_FR-tom-medium.onnx et .onnx.json>
Modèle : https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-tom-medium.tar.bz2
(ou rhasspy/piper-voices sur Hugging Face). Dépendances : pip install piper-tts scipy soundfile
Sorties : public/stokara/voice.wav, public/stokara/voice.json, src/stokara/voice.ts
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
from narrate import build, piper_synth  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
MODELS = Path(sys.argv[1] if len(sys.argv) > 1 else ".piper")
CHAPITRES = ["S2", "S3", "S8", "S9", "S10", "S11", "S14", "S17"]  # un carton de chapitre avant ces séquences
build(
    models=MODELS,
    narration=Path(__file__).parent / "narration.txt",
    out_dir=ROOT / "public" / "stokara",
    ts_path=ROOT / "src" / "stokara" / "voice.ts",
    generator="scripts/stokara/make-voice.py",
    speed=1.0,
    card={**{c: 2.4 for c in CHAPITRES}, "S18": 1.0},
    lead_in=4.2,  # générique d'ouverture
    sentence_gap=0.42,
    paragraph_gap=0.8,
    # voix posée et articulée (length_scale > 1 = un peu plus lent)
    synth=piper_synth(str(MODELS / "fr_FR-tom-medium.onnx"), str(MODELS / "fr_FR-tom-medium.onnx.json"), length_scale=1.06),
)
