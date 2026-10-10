"""Voix off française de la vidéo QYLINE « mentions légales » (voir scripts/lib/voice.py).

Usage : python3 scripts/qyline-legal/make-voice.py <dossier_modeles_kokoro>

Écrit :
  public/qyline-legal/voice.wav        voix seule, 24 kHz mono, 60 s
  public/qyline-legal/voice-cues.json  minutage des mots (pour le mixage audio)
  src/qyline-legal/voice.ts            minutage des mots (sous-titres et animations)
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))
from voice import ORG, QYLINE, build  # noqa: E402

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


build(
    sys.argv[1],
    SCENES,
    duration=60.0,
    out_dir="public/qyline-legal",
    ts_path="src/qyline-legal/voice.ts",
    generator="scripts/qyline-legal/make-voice.py",
    gap=GAP,
    min_speed=MIN_SPEED,
    max_speed=MAX_SPEED,
)
