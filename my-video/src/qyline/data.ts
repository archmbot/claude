// Contenu éditable de la publicité QYLINE.
// Tarifs vérifiés d'après qyline.org (captures fournies par le client).

export const BRAND = {
  name: "QYLINE",
  tagline: "Votre présence en ligne commence ici",
  site: "qyline.org",
  email: "qyline40@gmail.com",
  phone: "06 10 24 26 78",
  baseline: "Indépendant dans les Landes",
  cta: "Donnez vie à votre projet avec QYLINE",
};

export const COLORS = {
  bg: "#070b1f",
  bg2: "#0d1433",
  violet: "#7c3aed",
  violetDeep: "#6a1bea",
  blue: "#0066ff",
  cyan: "#38bdf8",
  text: "#ffffff",
  muted: "#b4bdea",
};

export type Plan = {
  name: string;
  kind: string;
  from: number;
  featured?: boolean;
  badge?: string;
};

export const PLANS: Plan[] = [
  { name: "Portfolio\nJeune Créateur", kind: "Réf. 01", from: 35 },
  { name: "Portfolio\nPro", kind: "Réf. 02", from: 130 },
  {
    name: "Site Vitrine\nEntreprise",
    kind: "Réf. 03",
    from: 625,
    featured: true,
    badge: "Le plus demandé",
  },
  { name: "Boutique\nen ligne", kind: "Réf. 04", from: 950 },
];

export const EXTRA_PLANS = {
  software: { label: "Logiciel web sur mesure", from: 750 },
  custom: { label: "Projet spécifique", note: "Sur devis" },
};

export const RUNNING_COSTS = [
  { label: "Hébergement (France, HTTPS inclus)", value: "20 €", unit: "/ an" },
  { label: "Nom de domaine", value: "dès 45,75 €", unit: "/ an" },
  { label: "Maintenance (facultative)", value: "50 €", unit: "/ an" },
  { label: "Gestion de contenu (option)", value: "100 €", unit: "une fois" },
];

export const LEGAL = "TVA non applicable, art. 293 B du CGI";

export const SERVICES = [
  {
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
    title: "Développement sur mesure",
    text: "Applications et outils métier accessibles depuis un navigateur.",
    bullets: [
      "Espace client, tableau de bord",
      "Gestion et automatisation",
      "Périmètre défini ensemble",
    ],
    icon: "code" as const,
  },
  {
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
export const DURATION = 900;

// Début de chaque scène (en images)
export const SCENES = {
  intro: { from: 0, duration: 150 },
  web: { from: 150, duration: 150 },
  services: { from: 300, duration: 210 },
  pricing: { from: 510, duration: 210 },
  outro: { from: 720, duration: 180 },
};
