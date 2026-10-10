// SCÈNE 6 (57-69 s) — LES TARIFS QYLINE : deux cartes en 3D, compteurs calés sur la voix.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PriceCard } from "../components/PriceCard";
import { Footnote, P, Stamp, clamp } from "../components/theme";
import { localEv } from "../timeline";

export const CARDS = [
  {
    title: "SITE\nVITRINE",
    price: 625,
    accent: P.violet,
    features: ["Design personnalisé", "Adaptation mobile", "Formulaire de contact", "Bases du référencement"],
    left: 55,
  },
  {
    title: "BOUTIQUE\nEN LIGNE",
    price: 950,
    accent: P.blue,
    features: ["Catalogue de produits", "Panier et paiement sécurisé", "Gestion des commandes", "Comptes clients"],
    left: 555,
  },
];
export const CARD_TOP = 330;

export const Tarifs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const counts = [localEv(5, "price1"), localEv(5, "price2")];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 205, display: "flex", justifyContent: "center" }}>
        <Stamp delay={2} size={46} rotate={-2}>
          LES TARIFS QYLINE
        </Stamp>
      </div>
      {CARDS.map((c, i) => {
        const p = spring({ frame: frame - (8 + i * 10), fps, config: { damping: 14, stiffness: 90 } });
        const float = Math.sin(frame / 22 + i * 2) * 8;
        const focus = interpolate(frame, [counts[i] - 6, counts[i] + 4, counts[i] + 60, counts[i] + 70], [0, 1, 1, 0], clamp);
        return (
          <div
            key={c.title}
            style={{
              position: "absolute",
              left: c.left,
              top: CARD_TOP,
              perspective: 1400,
              opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
            }}
          >
            <div
              style={{
                transform: `translateY(${(1 - p) * 300 + float - 18 * focus}px) rotateY(${(1 - p) * (i ? -80 : 80) + (i ? -6 : 6) * (1 - focus)}deg) scale(${1 + 0.04 * focus})`,
              }}
            >
              <PriceCard title={c.title} price={c.price} features={c.features} accent={c.accent} countAt={counts[i]} />
            </div>
          </div>
        );
      })}
      <Footnote delay={counts[1] + 50} top={1135} color={P.muted}>
        Tarifs de départ, selon devis. Hébergement et maintenance selon formule.
      </Footnote>
    </AbsoluteFill>
  );
};
