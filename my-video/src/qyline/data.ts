// Contenu éditable de la publicité QYLINE.
// Tarifs vérifiés d'après qyline.org (captures fournies par le client).

export const BRAND = {
  name: "QYLINE",
  tagline: "Votre présence en ligne commence ici",
  site: "qyline.org",
  email: "qyline40@gmail.com",
  phone: "06 10 24 26 78",
  baseline: "Indépendant dans les Landes",
};

// Couleurs relevées sur qyline.org
export const COLORS = {
  blue: "#24459A",
  blueDeep: "#1B347A",
  grid: "#3352A1",
  yellow: "#F5C518",
  navy: "#121A33",
  paper: "#F4F6FA",
  white: "#FFFFFF",
  muted: "#C5CEE4",
};

export type Plan = {
  ref: string;
  name: string;
  from: number;
  featured?: boolean;
  badge?: string;
};

export const PLANS: Plan[] = [
  { ref: "Réf. 01", name: "Portfolio\nJeune Créateur", from: 35 },
  { ref: "Réf. 02", name: "Portfolio\nPro", from: 130 },
  {
    ref: "Réf. 03",
    name: "Site Vitrine\nEntreprise",
    from: 625,
    featured: true,
    badge: "Le plus demandé",
  },
  { ref: "Réf. 04", name: "Boutique\nen ligne", from: 950 },
];

export const EXTRA_PLANS = {
  software: { label: "Logiciel web sur mesure", from: 750 },
  custom: { label: "Projet spécifique", note: "Sur devis" },
};

// Non affichés dans la version 20 s, conservés pour une version longue.
export const RUNNING_COSTS = [
  { label: "Hébergement (France, HTTPS inclus)", value: "20 €", unit: "/ an" },
  { label: "Nom de domaine", value: "dès 45,75 €", unit: "/ an" },
  { label: "Maintenance (facultative)", value: "50 €", unit: "/ an" },
  { label: "Gestion de contenu (option)", value: "100 €", unit: "une fois" },
];

export const LEGAL = "TVA non applicable, art. 293 B du CGI";

export const SERVICES = [
  {
    plate: "Planche A",
    title: "Sites vitrines",
    text: "Sites vitrines et portfolios professionnels.",
    bullets: [
      "Identité visuelle cohérente",
      "Affichage adapté aux mobiles",
      "Parcours de contact simple",
    ],
    icon: "site" as const,
  },
  {
    plate: "Planche B",
    title: "Développement sur mesure",
    text: "Outils métier accessibles depuis un navigateur.",
    bullets: [
      "Espace client, tableau de bord",
      "Gestion et automatisation",
      "Périmètre défini ensemble",
    ],
    icon: "code" as const,
  },
  {
    plate: "Planche C",
    title: "Accompagnement",
    text: "Assistance informatique et dépannage à distance.",
    bullets: [
      "Intervention avec votre accord",
      "Explications à chaque étape",
      "Vous gardez le contrôle",
    ],
    icon: "support" as const,
  },
];

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 600; // 20 s

// Scènes (en images). Les coupes tombent sur les mesures de la musique (120 BPM).
// Toute modification doit être reportée dans scripts/make-audio.mjs.
export const SCENES = {
  intro: { from: 0, duration: 75 },
  web: { from: 75, duration: 120 },
  services: { from: 195, duration: 120 },
  pricing: { from: 315, duration: 180 },
  outro: { from: 495, duration: 105 },
};

export const BEAT = 15; // images par temps
export const FIRST_BEAT = 15; // le logo se pose sur le premier temps
export const LAST_BEAT = 555; // accord final
export const HITS = [15, 495, 555]; // impacts (secousse de caméra)
