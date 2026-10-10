"""Voix off de la vidéo QYLINE « Site vitrine ou boutique en ligne ? » (voir scripts/lib/voice.py).

Usage : python3 scripts/qyline-choix/make-voice.py <dossier_modeles_kokoro>

Écrit :
  public/qyline-choix/voice.wav        voix seule, 24 kHz mono, 80 s
  public/qyline-choix/voice-cues.json  minutage des mots (pour le mixage audio)
  src/voiceover.ts                     minutage des mots (sous-titres et animations)
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))
from voice import ORG, QYLINE, build  # noqa: E402

# {affiché|prononcé} : ce que l'on lit à l'écran et ce que la voix dit ; /…/ = phonèmes imposés
SCENES = [
    {  # 0-8 s — accroche
        "window": (0.25, 7.8),
        "sentences": [
            "Vous voulez créer un site internet pour votre entreprise, mais vous hésitez entre un site vitrine "
            "et une boutique en ligne ?",
            "Voici comment choisir !",
        ],
    },
    {  # 8-21 s — le site vitrine
        "window": (8.35, 20.8),
        "sentences": [
            "Le site vitrine est idéal pour les artisans et les prestataires de services.",
            "Il présente votre activité, vos réalisations, et permet à vos futurs clients de vous contacter "
            "ou de demander un devis.",
        ],
    },
    {  # 21-34 s — la boutique en ligne
        "window": (21.35, 33.8),
        "sentences": [
            "Avec une boutique en ligne, vos clients peuvent choisir leurs produits, payer directement, "
            "et commander à toute heure.",
            "C'est idéal pour vendre au-delà de votre zone géographique.",
        ],
    },
    {  # 34-47 s — la vraie différence
        "window": (34.35, 46.8),
        "sentences": [
            "La vraie différence ?",
            "Le site vitrine génère des contacts.",
            "La boutique permet de vendre directement.",
            "Mais attention : elle demande aussi de gérer les stocks, les commandes et les livraisons.",
        ],
    },
    {  # 47-57 s — les solutions intermédiaires
        "window": (47.35, 56.8),
        "sentences": [
            "Vous pouvez aussi commencer par un site vitrine, et ajouter un catalogue ou un paiement en ligne.",
            "Pas besoin de tout construire dès le départ !",
        ],
    },
    {  # 57-69 s — les tarifs
        "window": (57.35, 68.8),
        "sentences": [
            f"Chez {{QYLINE|{QYLINE}}}, votre site vitrine démarre à {{625 €|six cent vingt-cinq euros}}, "
            "et votre boutique en ligne à {950 €|neuf cent cinquante euros}.",
            "Des solutions personnalisées, adaptées à votre entreprise et à vos besoins.",
        ],
    },
    {  # 69-80 s — conclusion (la dernière seconde est laissée au logo et à la note finale)
        "window": (69.35, 78.9),
        "sentences": [
            "Vous ne savez pas quelle solution choisir ?",
            f"{{QYLINE|{QYLINE}}} vous accompagne dans votre projet.",
            "Premier échange gratuit.",
            f"Découvrez nos services sur {{qyline.org|{QYLINE} point {ORG}}} !",
        ],
    },
]

build(
    sys.argv[1],
    SCENES,
    duration=80.0,
    out_dir="public/qyline-choix",
    ts_path="src/voiceover.ts",
    generator="scripts/qyline-choix/make-voice.py",
)
