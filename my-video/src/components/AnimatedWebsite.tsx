// Fenêtre de navigateur en 3D avec un site de démonstration qui défile.
// Variantes : site vitrine d'artisan, boutique en ligne, site vitrine qui évolue (catalogue, acompte).
// Tous les contenus sont fictifs et signalés comme démonstration.
import React from "react";
import { interpolate } from "remotion";
import { BODY, HEAD, Lines, P, clamp, hard } from "./theme";

const W = 900; // largeur de conception des pages (mise à l'échelle dans la fenêtre)
const BAR = 64;

const wood = ["#8A5A34", "#C08A55", "#5B3A1E", "#B07A48", "#7A4B26", "#D6A574"];
const clay = ["#C9826B", "#E0B48F", "#8E5A4A", "#D9C2A7", "#A86B52", "#EAD6C0"];

export const SHOP_PRODUCTS = [
  { name: "Bol en grès", price: "24,00 €" },
  { name: "Tasse émaillée", price: "18,00 €" },
  { name: "Vase sable", price: "39,00 €" },
  { name: "Assiette plate", price: "22,00 €" },
  { name: "Pichet", price: "34,00 €" },
  { name: "Coupelle", price: "12,00 €" },
];

const DemoBadge: React.FC = () => (
  <div style={{ position: "absolute", right: 24, top: 22, padding: "6px 14px", background: P.navy, color: P.white, fontSize: 18, fontWeight: 700, borderRadius: 4, fontFamily: BODY }}>
    SITE DE DÉMONSTRATION
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ padding: "34px 40px 10px" }}>
    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 38, color: "#5B3A1E", marginBottom: 18 }}>{title}</div>
    {children}
  </div>
);

export const Button: React.FC<{ label: string; color?: string; press?: number; glow?: number; size?: number }> = ({ label, color = "#5B3A1E", press = 0, glow = 0, size = 24 }) => (
  <div
    style={{
      display: "inline-block",
      padding: `${size * 0.6}px ${size * 1.2}px`,
      background: color,
      color: P.white,
      fontFamily: BODY,
      fontWeight: 800,
      fontSize: size,
      borderRadius: 10,
      transform: `scale(${1 - 0.08 * press})`,
      boxShadow: glow > 0 ? `0 0 ${40 * glow}px ${10 * glow}px rgba(117,75,255,${0.7 * glow})` : undefined,
    }}
  >
    {label}
  </div>
);

// ------------------------------------------------------------------ site vitrine
export const VITRINE_H = 2400;
export const VitrinePage: React.FC<{ ctaPress?: number; ctaGlow?: number; catalog?: number; deposit?: number }> = ({ ctaPress = 0, ctaGlow = 0, catalog = 0, deposit = 0 }) => (
  <div style={{ width: W, background: "#FBF7F2", fontFamily: BODY }}>
    <div style={{ height: 84, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", background: P.white, borderBottom: "2px solid #E9E1D6" }}>
      <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 32, color: "#5B3A1E" }}>Atelier Démo</span>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {[80, 96, 80].map((w, i) => (
          <div key={i} style={{ width: w, height: 10, borderRadius: 5, background: "#CDBFAE" }} />
        ))}
        <Button label="Devis" size={18} />
      </div>
    </div>
    <div style={{ position: "relative", height: 430, padding: "70px 40px", boxSizing: "border-box", background: "linear-gradient(135deg, #8A5A34, #C08A55 55%, #E2B985)" }}>
      <DemoBadge />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70, lineHeight: 1, color: P.white }}>
        Menuiserie
        <br />
        sur mesure
      </div>
      <div style={{ marginTop: 22, width: 460 }}>
        <Lines widths={[92, 70]} color="rgba(255,255,255,0.75)" h={14} />
      </div>
      <div style={{ marginTop: 16 }}>
        <Button label="Demander un devis" color={P.white} />
      </div>
      {deposit > 0 && (
        <div style={{ position: "absolute", right: 40, bottom: 56, opacity: interpolate(deposit, [0, 0.2], [0, 1], clamp), transform: `scale(${interpolate(deposit, [0, 1], [0.4, 1])})` }}>
          <Button label="Payer un acompte" color={P.violet} glow={Math.max(0, 1 - Math.abs(deposit - 1) * 3) || 0.5} size={26} />
        </div>
      )}
    </div>
    <Section title="Qui sommes-nous ?">
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 200, height: 160, borderRadius: 14, background: "linear-gradient(135deg,#B07A48,#7A4B26)" }} />
        <div style={{ flex: 1, paddingTop: 6 }}>
          <Lines widths={[95, 90, 85, 60]} />
        </div>
      </div>
    </Section>
    <Section title="Nos prestations">
      <div style={{ display: "flex", gap: 18 }}>
        {["Agencement", "Escaliers", "Rénovation"].map((t, i) => (
          <div key={t} style={{ flex: 1, height: 220, background: P.white, borderRadius: 14, border: "2px solid #E9E1D6", padding: 20, boxSizing: "border-box" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: wood[i], marginBottom: 16 }} />
            <div style={{ fontWeight: 800, fontSize: 26, color: "#5B3A1E", marginBottom: 12 }}>{t}</div>
            <Lines widths={[90, 70]} />
          </div>
        ))}
      </div>
    </Section>
    {catalog > 0 && (
      <div style={{ height: 330 * catalog, overflow: "hidden" }}>
        <Section title="Notre catalogue">
          <div style={{ display: "flex", gap: 16 }}>
            {["Étagère chêne", "Table basse", "Banc d'entrée"].map((t, i) => (
              <div
                key={t}
                style={{
                  flex: 1,
                  background: P.white,
                  borderRadius: 14,
                  border: `3px solid ${P.violet}`,
                  overflow: "hidden",
                  transform: `translateY(${(1 - interpolate(catalog, [0.2 + i * 0.2, 0.6 + i * 0.2], [0, 1], clamp)) * 120}px)`,
                }}
              >
                <div style={{ height: 120, background: `linear-gradient(135deg, ${wood[i + 2]}, ${wood[i]})` }} />
                <div style={{ padding: "12px 14px", fontSize: 22, fontWeight: 800, color: "#5B3A1E" }}>{t}</div>
                <div style={{ padding: "0 14px 14px", fontSize: 20, fontWeight: 700, color: P.violet }}>Voir le produit</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    )}
    <Section title="Nos réalisations">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {wood.map((c) => (
          <div key={c} style={{ position: "relative", height: 170, borderRadius: 12, background: c }}>
            <div style={{ position: "absolute", left: 10, bottom: 8, fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Exemple</div>
          </div>
        ))}
      </div>
    </Section>
    <Section title="Coordonnées">
      <div style={{ fontSize: 26, fontWeight: 600, color: "#4A3424", lineHeight: 1.6 }}>
        1 rue de l&apos;Exemple, 40000 Démo
        <br />
        contact@exemple.fr
      </div>
    </Section>
    <Section title="Demande de devis">
      <div style={{ padding: 26, background: P.white, borderRadius: 14, border: "2px solid #E9E1D6" }}>
        {["Votre nom", "Votre e-mail", "Votre projet"].map((f, i) => (
          <div key={f} style={{ height: i === 2 ? 110 : 58, borderRadius: 10, border: "2px solid #D9CEC0", marginBottom: 14, padding: "14px 18px", boxSizing: "border-box", fontSize: 22, color: "#9B8B78" }}>
            {f}
          </div>
        ))}
        <Button label="Demander un devis" press={ctaPress} glow={ctaGlow} size={28} />
      </div>
    </Section>
    <div style={{ height: 140, marginTop: 30, background: "#2B1D12", padding: "34px 40px", color: "#BFAE99", fontSize: 22, fontWeight: 600 }}>© 2026 Atelier Démo — site de démonstration</div>
  </div>
);

// ------------------------------------------------------------------ boutique (version ordinateur)
export const ShopPage: React.FC<{ added?: number }> = ({ added = 0 }) => (
  <div style={{ width: W, background: "#FFFDF9", fontFamily: BODY }}>
    <div style={{ height: 84, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", background: P.white, borderBottom: "2px solid #EFE6DC" }}>
      <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 32, color: "#6B3F30" }}>Céramique Démo</span>
      <div style={{ position: "relative", padding: "10px 18px", borderRadius: 10, background: "#6B3F30", color: P.white, fontWeight: 800, fontSize: 20 }}>
        Panier
        <div style={{ position: "absolute", right: -12, top: -12, width: 32, height: 32, borderRadius: 16, background: P.violet, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{added}</div>
      </div>
    </div>
    <div style={{ position: "relative", padding: "34px 40px 10px" }}>
      <DemoBadge />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: "#6B3F30" }}>Nouveautés</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, padding: "16px 40px 40px" }}>
      {SHOP_PRODUCTS.map((p, i) => (
        <div key={p.name} style={{ background: P.white, borderRadius: 16, border: "2px solid #EFE6DC", overflow: "hidden" }}>
          <div style={{ height: 210, background: `radial-gradient(circle at 40% 35%, ${clay[(i + 1) % 6]}, ${clay[i]} 70%)` }} />
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontWeight: 800, fontSize: 24, color: "#4A2C22" }}>{p.name}</div>
            <div style={{ fontWeight: 800, fontSize: 26, color: P.violet, marginTop: 6 }}>{p.price}</div>
            <div style={{ marginTop: 12, padding: "10px 0", textAlign: "center", borderRadius: 10, background: "#6B3F30", color: P.white, fontWeight: 800, fontSize: 18 }}>Ajouter au panier</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export const SHOP_H = 1120;

// ------------------------------------------------------------------ fenêtre 3D
export const AnimatedWebsite: React.FC<{
  variant: "vitrine" | "shop";
  width: number;
  height: number;
  scroll?: number; // 0 = haut de page, 1 = bas de page
  url: string;
  rotateX?: number;
  rotateY?: number;
  glow?: string; // halo coloré autour de la fenêtre
  ctaPress?: number;
  ctaGlow?: number;
  catalog?: number;
  deposit?: number;
  added?: number;
  bare?: boolean; // sans bordure ni ombre (affiché dans l'écran d'un ordinateur)
  style?: React.CSSProperties;
}> = ({ variant, width, height, scroll = 0, url, rotateX = 0, rotateY = 0, glow, ctaPress, ctaGlow, catalog = 0, deposit, added, bare = false, style }) => {
  const scale = width / W;
  const viewH = (height - BAR) / scale;
  const pageH = variant === "vitrine" ? VITRINE_H + 330 * catalog : SHOP_H;
  const top = -Math.max(0, pageH - viewH) * scroll;
  return (
    <div style={{ perspective: 1600, ...style }}>
      <div
        style={{
          width,
          height,
          background: P.white,
          border: bare ? undefined : `4px solid ${P.navy}`,
          borderRadius: bare ? 4 : 16,
          overflow: "hidden",
          boxShadow: bare ? undefined : glow ? `${hard(12)}, 0 0 60px 6px ${glow}` : hard(12),
          boxSizing: "border-box",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: BAR, flexShrink: 0, background: "#E8ECF6", borderBottom: `3px solid ${P.navy}`, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", boxSizing: "border-box" }}>
          {[P.red, P.yellow, P.green].map((c) => (
            <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c, border: `2px solid ${P.navy}` }} />
          ))}
          <div style={{ marginLeft: 12, flex: 1, height: 36, borderRadius: 18, background: P.white, border: `2px solid ${P.navy}`, display: "flex", alignItems: "center", padding: "0 16px", fontFamily: BODY, fontSize: 20, fontWeight: 600, color: "#3A4466", overflow: "hidden", whiteSpace: "nowrap" }}>
            {url}
          </div>
        </div>
        <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: top * scale, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
            {variant === "vitrine" ? <VitrinePage ctaPress={ctaPress} ctaGlow={ctaGlow} catalog={catalog} deposit={deposit} /> : <ShopPage added={added} />}
          </div>
        </div>
      </div>
    </div>
  );
};
