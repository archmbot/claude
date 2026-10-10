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

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
