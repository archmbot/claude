"""Voix off de « Pourquoi l'informatique coûte-t-elle si cher ? L'exemple d'un NAS » (≈ 1 min).

Usage : python3 scripts/nas-cout/make-voice.py <dossier des modèles Kokoro>
Sorties : public/nas-cout/voice.wav, public/nas-cout/voice.json, src/nas/voice.ts
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
from narrate import build  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
build(
    models=sys.argv[1] if len(sys.argv) > 1 else ".kokoro",
    narration=Path(__file__).parent / "narration.txt",
    out_dir=ROOT / "public" / "nas-cout",
    ts_path=ROOT / "src" / "nas" / "voice.ts",
    generator="scripts/nas-cout/make-voice.py",
    speed=0.95,  # débit vif mais clair : la vidéo tient en une minute
    card=0,  # pas de carton entre les séquences
    lead_in=0.5,
    sentence_gap=0.3,
    paragraph_gap=0.6,
)
