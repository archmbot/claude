# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Vidéo QYLINE « mentions légales » (60 s, 1080 × 1920)

Composition `QylineLegal` : `src/qyline-legal/` (une scène par fichier dans `scenes/`).
Fichiers utilisés au rendu, déjà présents dans `public/qyline-legal/` : `audio.wav` (voix + musique),
`voice.wav`, `voice-cues.json`, ainsi que `public/logo-q.png` et les polices de `public/fonts/`.

```console
npm run dev            # prévisualisation (choisir « QylineLegal »)
npm run legal:render   # export -> out/qyline-mentions-legales.mp4
```

Modifier le texte de la voix off : éditer `scripts/qyline-legal/make-voice.py`, puis

```console
pip install kokoro-onnx soundfile
# modèles kokoro-v1.0.onnx et voices-v1.0.bin dans .kokoro/ :
# https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
npm run legal:voice    # voix, minutage des mots, src/qyline-legal/voice.ts
npm run legal:audio    # musique + effets mixés sous la voix -> audio.wav
```

## Vidéo QYLINE « Site vitrine ou boutique en ligne ? » (80 s, 1080 × 1920)

Composition `QylineChoix` (30 i/s, 2 400 images) pour TikTok, Reels et Shorts.

- `src/Composition.tsx` : assemblage (scènes, transitions, logo en haut à gauche, sous-titres, barre de progression).
- `src/scenes/` : une scène par fichier (Intro, SiteVitrine, BoutiqueEnLigne, Comparaison, Solutions, Tarifs, Conclusion).
- `src/components/` : AnimatedWebsite, AnimatedPhone, Subtitles, PriceCard, Logo et le thème (palette, curseur, notifications).
- `src/timeline.ts` : durées des scènes, position des sous-titres et `SUBTITLE_OFFSET`
  (en secondes : une valeur positive affiche les sous-titres plus tard).
- `src/events.json` : repères d'interface (clics, notifications, compteurs de prix) calés sur des mots de la voix off.
  L'animation et les bruitages les lisent tous les deux : changer un repère, puis relancer `npm run choix:audio`.

```console
npm run dev            # prévisualisation (choisir « QylineChoix »)
npm run choix:render   # export MP4 H.264 + AAC -> out/qyline-site-vitrine-ou-boutique.mp4
```

Modifier le texte de la voix off : éditer `scripts/qyline-choix/make-voice.py` (mêmes prérequis que ci-dessus), puis

```console
npm run choix:voice    # voix, minutage des mots, src/voiceover.ts
npm run choix:audio    # musique + bruitages mixés sous la voix -> public/qyline-choix/audio.wav
```

Les sites, la boutique, les paiements et les commandes montrés sont des démonstrations fictives,
signalées comme telles à l'écran.

## Formation réseaux — chapitre 1.1 « Qu'est-ce qu'un réseau informatique ? » (≈ 24 min, 1920 × 1080)

Composition `Reseau11` (25 i/s), tirée du scénario pédagogique (fiche, script, storyboard) :

- `scripts/reseau-1-1/narration.txt` : texte intégral de la voix off (séquences `## Sn`, silences `[PAUSE n]`,
  prononciations imposées `{affiché|/phonèmes/}`).
- `src/reseau/` : `Video.tsx` (assemblage, cartons de séquence, sous-titres), `scenes1.tsx` et `scenes2.tsx`
  (les dix séquences, plan par plan), `ui.tsx` (charte, icônes d'équipements, liaisons, paquets), `timing.ts`.
- Chaque animation est calée sur un mot de la voix off (`T("expression")`), à partir du minutage
  généré dans `src/reseau/voice.ts`.

Les fichiers audio (plus de 100 Mo) ne sont pas versionnés ; pour les recréer puis exporter :

```console
npm run reseau:voice    # voix off Kokoro + minutage (modèles dans .kokoro/, voir plus haut)
npm run reseau:audio    # voix + bruitages discrets, normalisés à -16 LUFS -> public/reseau-1-1/audio.wav
npm run reseau:render   # export MP4 H.264 + AAC -> out/reseau-1-1-quest-ce-quun-reseau.mp4
```

Sans sous-titres incrustés : `npx remotion render Reseau11 out/reseau-1-1.mp4 --props='{"subtitles":false}'`.

## « Pourquoi l'informatique coûte-t-elle si cher ? » d'après un devis de NAS (1 min, 1920 × 1080)

Composition `NasCout` (25 i/s), dans la charte de la formation réseaux (`src/reseau/ui.tsx`) :
un NAS partagé par deux personnes, accessible au bureau et à distance. À droite, le devis réel
(8 lignes, montants HT, total 710,00 € HT, défini dans `LINES` de `src/nas/Video.tsx`) ; chaque
ligne s'allume quand la voix l'explique, et la zone de gauche montre la prestation correspondante.

```console
npm run nas:voice     # voix off (scripts/nas-cout/narration.txt) + minutage -> src/nas/voice.ts
npm run nas:audio     # musique douce + bruitages sous la voix -> public/nas-cout/audio.wav
npm run nas:render    # export MP4 -> out/nas-devis-pourquoi-informatique-si-cher.mp4
```

Les deux vidéos « formation » partagent `scripts/lib/narrate.py` (voix phrase par phrase) et
`src/components/voiceTiming.ts` (repères `T("expression")` calés sur la voix).

## Tutoriel « Stokara : le guide complet » (≈ 13 min 15 s, 1920 × 1080)

Composition `StokaraTuto` (25 i/s), dans la charte de Stokara (Poppins, bleu `#3949ab` / orange `#f9871a`,
fond à sphères de la page de connexion, icônes Bootstrap Icons) :

- 8 chapitres : connexion, explorateur de fichiers, partage, messagerie, mon compte, **Stokara dans Windows**
  (*Ce PC → Ajouter un emplacement réseau*, adresse `…/dav/`), administration, côté serveur.
- `public/stokara/caps/` : écrans réels de Stokara, capturés sur une copie de démonstration isolée
  (données, comptes et adresses fictifs : « Cabinet Horizon », `stokara.exemple.fr`). `src/stokara/shots.json`
  donne la position des éléments pointés (curseur, encadrés, zooms).
- `src/stokara/windows.tsx` : reconstitution simplifiée de l'Explorateur Windows 11 et de l'assistant.
- `scripts/stokara/narration.txt` : texte de la voix off ; chaque animation est calée sur un mot (`T("…")`).
- Voix : Piper « tom » (française, masculine, posée), modèle `fr_FR-tom-medium` dans `.piper/`
  (https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-tom-medium.tar.bz2) ;
  `pip install piper-tts scipy soundfile`.
- Fin : crédit « Développé par la micro-entreprise QYLINE de Mathias Javierre », qyline40@gmail.com,
  https://qyline.org (logo `public/stokara/qyline-logo.png`).

```console
npm run stokara:voice    # voix off Piper (tom) + minutage -> public/stokara/voice.*, src/stokara/voice.ts
npm run stokara:audio    # musique douce + transitions, -16 LUFS -> public/stokara/audio.wav
npm run stokara:render   # export MP4 -> out/stokara-tutoriel-guide-complet.mp4
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
