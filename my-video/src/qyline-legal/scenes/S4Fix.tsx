// Scène 4 (30-42 s) — COMMENT CORRIGER : avant / après sur un site de démonstration.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { localCue } from "../timeline";
import { BODY, Badge, C, Footnote, HEAD, Lines, PhoneFrame, Stamp, clamp } from "../ui";

const SiteBottom: React.FC<{ legalLink: number }> = ({ legalLink }) => (
  <div style={{ position: "absolute", inset: 0, background: "#FBF7F2", fontFamily: BODY }}>
    <div style={{ padding: "70px 26px 0" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 32, color: "#5B3A1E" }}>Atelier Démo</div>
      <div style={{ marginTop: 18, height: 170, borderRadius: 12, background: "linear-gradient(135deg, #8A5A34, #D6A574)" }} />
      <div style={{ marginTop: 20 }}>
        <Lines widths={[90, 75, 85]} />
      </div>
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {["#B07A48", "#7A4B26", "#D6A574", "#9C6B40"].map((c) => (
          <div key={c} style={{ height: 90, borderRadius: 10, background: c }} />
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 190, background: "#2B1D12", padding: "26px 24px", color: "#E9E1D6", fontSize: 22, fontWeight: 600 }}>
      <div>© 2026 Atelier Démo</div>
      <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: "8px 14px", color: "#BFAE99" }}>
        {legalLink > 0 && (
          <span
            style={{
              padding: "2px 8px",
              color: C.navy,
              fontWeight: 800,
              background: C.yellow,
              opacity: legalLink,
              transform: `scale(${1 + 0.25 * Math.sin(legalLink * Math.PI)})`,
            }}
          >
            Mentions légales
          </span>
        )}
        <span>Accueil</span>
        <span>Contact</span>
      </div>
    </div>
  </div>
);

const LegalPage: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: C.white, padding: "70px 26px", fontFamily: BODY }}>
    <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 36, color: C.navy }}>Mentions légales</div>
    {["Éditeur du site", "Coordonnées", "Immatriculation", "Hébergeur"].map((l) => (
      <div key={l} style={{ marginTop: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 22, fontWeight: 800, color: C.navy }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 12.5l5 5L19.5 7" />
          </svg>
          {l}
        </div>
        <div style={{ marginTop: 10 }}>
          <Lines widths={[92, 70]} h={10} gap={9} />
        </div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 26, bottom: 24, fontSize: 16, fontWeight: 700, color: "#7A86A8" }}>Exemple fictif</div>
  </div>
);

export const S4Fix: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cross = localCue(3, "vérifiez");
  const add = localCue(3, "mentions", 1);
  const foot = localCue(3, "pied");
  const phones = spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 120 } });
  const link = interpolate(frame, [add, add + 12], [0, 1], clamp);
  const click = foot + 30;
  const open = interpolate(frame, [click + 4, click + 18], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const zoom = 1 + 0.06 * interpolate(frame, [foot, foot + 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }) * (1 - open);
  // curseur qui va cliquer sur le lien du pied de page
  const cur = interpolate(frame, [foot, click], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const press = frame >= click && frame < click + 5 ? 0.85 : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 205, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Stamp delay={4} size={40}>
          LA SOLUTION
        </Stamp>
        <div style={{ marginTop: 18, fontFamily: HEAD, fontWeight: 800, fontSize: 80, color: C.white, lineHeight: 1, opacity: interpolate(frame, [10, 18], [0, 1], clamp) }}>
          Avant / Après
        </div>
      </div>
      {[0, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            left: side ? 575 : 55,
            top: 430,
            opacity: interpolate(phones, [0, 0.15], [0, 1], clamp),
            transform: `translateY(${(1 - phones) * (side ? 900 : 1100)}px) scale(${side ? zoom : 1})`,
            transformOrigin: "50% 100%",
          }}
        >
          <PhoneFrame width={450} height={800}>
            <SiteBottom legalLink={side ? link : 0} />
            {side === 1 && open > 0 && (
              <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - open) * 100}%)` }}>
                <LegalPage />
              </div>
            )}
          </PhoneFrame>
          <div style={{ position: "absolute", left: side ? 290 : 30, top: -36 }}>
            <Stamp delay={14 + side * 4} size={32} bg={side ? C.green : C.red} color={C.white} rotate={side ? 3 : -3}>
              {side ? "APRÈS" : "AVANT"}
            </Stamp>
          </div>
          <div style={{ position: "absolute", right: -26, top: 120 }}>
            <Badge ok={side === 1} progress={spring({ frame: frame - (side ? add + 6 : cross), fps, config: { damping: 11, stiffness: 200 } })} />
          </div>
        </div>
      ))}
      {frame >= foot && frame < click + 16 && (
        <svg
          width="70"
          height="70"
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: interpolate(cur, [0, 1], [980, 640]),
            top: interpolate(cur, [0, 1], [1320, 1124]),
            transform: `scale(${press})`,
            filter: "drop-shadow(3px 3px 0 #121A33)",
          }}
        >
          <path d="M4 2l15 9-6.5 1.5L16 20l-3 1.5-3.6-7.4L4 18z" fill={C.white} stroke={C.navy} strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      )}
      <Footnote delay={add + 20} top={1278}>
        Une page de mentions légales ne suffit pas toujours : selon votre activité, d&apos;autres obligations peuvent s&apos;appliquer
        (RGPD, cookies, CGV…).
      </Footnote>
    </AbsoluteFill>
  );
};
