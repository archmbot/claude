"""Voix off du tutoriel « Stokara : le guide complet » (≈ 12 min).

Usage : python3 scripts/stokara/make-voice.py <dossier des modèles Kokoro>
Sorties : public/stokara/voice.wav, public/stokara/voice.json, src/stokara/voice.ts
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
from narrate import build  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
CHAPITRES = ["S2", "S3", "S8", "S9", "S10", "S11", "S14", "S17"]  # un carton de chapitre avant ces séquences
build(
    models=sys.argv[1] if len(sys.argv) > 1 else ".kokoro",
    narration=Path(__file__).parent / "narration.txt",
    out_dir=ROOT / "public" / "stokara",
    ts_path=ROOT / "src" / "stokara" / "voice.ts",
    generator="scripts/stokara/make-voice.py",
    speed=0.97,
    card={**{c: 2.4 for c in CHAPITRES}, "S18": 1.0},
    lead_in=4.2,  # générique d'ouverture
    sentence_gap=0.38,
    paragraph_gap=0.75,
)
