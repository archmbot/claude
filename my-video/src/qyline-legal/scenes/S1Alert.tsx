// Scène 1 (0-7 s) — ALERTE : un site d'artisan fictif, pas de mentions légales en pied de page.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Rise } from "../../qyline/shared";
import { localCue } from "../timeline";
import { BODY, BrowserFrame, C, HEAD, Lines, Stamp, WarningIcon, clamp, hard, usePop } from "../ui";

const VIEW_H = 830 - 64 - 8; // hauteur visible de la page dans le navigateur
const PAGE_H = 1640;

// Site vitrine de démonstration (aucune entreprise réelle)
const DemoSite: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: -(PAGE_H - VIEW_H) * scroll, height: PAGE_H, fontFamily: BODY, background: "#FBF7F2" }}>
    <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px", background: "#FFFFFF", borderBottom: "2px solid #E9E1D6" }}>
      <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 30, color: "#5B3A1E" }}>Atelier Démo</span>
      <div style={{ display: "flex", gap: 22 }}>
        {[70, 90, 70].map((w, i) => (
          <div key={i} style={{ width: w, height: 10, borderRadius: 5, background: "#CDBFAE" }} />
        ))}
      </div>
    </div>
    <div style={{ height: 420, padding: "60px 40px", background: "linear-gradient(135deg, #8A5A34, #C08A55 55%, #E2B985)", position: "relative" }}>
      <div style={{ position: "absolute", right: 24, top: 22, padding: "6px 14px", background: C.navy, color: C.white, fontSize: 18, fontWeight: 700, borderRadius: 4 }}>
        SITE DE DÉMONSTRATION
      </div>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 60, lineHeight: 1.02, color: C.white }}>
        Menuiserie
        <br />
        sur mesure
      </div>
      <div style={{ marginTop: 22, width: 420 }}>
        <Lines widths={[90, 70]} color="rgba(255,255,255,0.7)" h={14} />
      </div>
      <div style={{ marginTop: 16, display: "inline-block", padding: "14px 26px", background: C.white, color: "#5B3A1E", fontWeight: 800, fontSize: 22, borderRadius: 6 }}>Demander un devis</div>
    </div>
    <div style={{ display: "flex", gap: 20, padding: "40px 34px" }}>
      {["#8A5A34", "#C08A55", "#5B3A1E"].map((c, i) => (
        <div key={i} style={{ flex: 1, height: 250, background: C.white, borderRadius: 12, border: "2px solid #E9E1D6", padding: 22 }}>
          <div style={{ width: 54, height: 54, borderRadius: 12, background: c, marginBottom: 20 }} />
          <Lines widths={[80, 95, 60]} />
        </div>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, padding: "0 34px 40px" }}>
      {["#B07A48", "#7A4B26", "#D6A574", "#9C6B40"].map((c) => (
        <div key={c} style={{ height: 210, borderRadius: 12, background: c }} />
      ))}
    </div>
    <div style={{ margin: "0 34px 40px", padding: 30, borderRadius: 12, background: C.white, border: "2px solid #E9E1D6" }}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 34, color: "#5B3A1E", marginBottom: 16 }}>Contact</div>
      <Lines widths={[70, 50]} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: "#2B1D12", padding: "34px 34px", color: "#E9E1D6", fontSize: 24, fontWeight: 600 }}>
      <div>© 2026 Atelier Démo</div>
      <div style={{ marginTop: 14, color: "#BFAE99" }}>Accueil · Réalisations · Contact</div>
    </div>
  </div>
);

export const S1Alert: React.FC = () => {
  const frame = useCurrentFrame();
  const att = localCue(0, "attention");
  const fine = localCue(0, "oubliée");
  const scroll = interpolate(frame, [26, att - 8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const browser = usePop(10, 15, 120);
  const alert = usePop(att, 12, 200);
  const blink = alert > 0.5 ? 0.55 + 0.45 * Math.abs(Math.sin((frame - att) / 4)) : 0;
  const dim = interpolate(frame, [fine - 4, fine + 6], [0, 1], clamp);
  const d = frame - fine;
  const shake = d >= 8 && d < 22 ? Math.sin(d * 2.7) * 14 * Math.exp(-(d - 8) / 4) : 0;
  const h = { fontFamily: HEAD, fontWeight: 800, fontSize: 88, lineHeight: 1.0, color: C.white, whiteSpace: "nowrap" } as const;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 215 }}>
        <Rise delay={3}>
          <div style={h}>VOTRE SITE WEB</div>
        </Rise>
        <Rise delay={8}>
          <div style={h}>
            EST-IL <span style={{ color: C.yellow }}>CONFORME&nbsp;?</span>
          </div>
        </Rise>
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 470,
          opacity: interpolate(browser, [0, 0.15], [0, 1], clamp),
          transform: `translateY(${(1 - browser) * 600}px)`,
        }}
      >
        <BrowserFrame
          width={940}
          height={830}
          url="www.atelier-demo.fr"
          style={{ boxShadow: alert > 0 ? `${hard(14)}, 0 0 ${60 * blink}px rgba(229,72,77,${0.8 * blink})` : hard(14) }}
        >
          <DemoSite scroll={scroll} />
          {alert > 0 && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 10,
                  right: 10,
                  bottom: 8,
                  height: 140,
                  border: `5px solid ${C.red}`,
                  borderRadius: 8,
                  opacity: blink,
                }}
              />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 170, display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 26px",
                    background: C.red,
                    color: C.white,
                    fontFamily: BODY,
                    fontWeight: 800,
                    fontSize: 34,
                    borderRadius: 6,
                    boxShadow: hard(7),
                    transform: `scale(${interpolate(alert, [0, 1], [1.7, 1])}) rotate(-2deg)`,
                    opacity: interpolate(alert, [0, 0.2], [0, 1], clamp),
                  }}
                >
                  <WarningIcon size={44} />
                  Mentions légales introuvables
                </div>
              </div>
            </>
          )}
        </BrowserFrame>
      </div>
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(11,18,48,${0.82 * dim})` }} />}
      {dim > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 560,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateX(${shake}px)`,
          }}
        >
          <Stamp delay={fine} size={64} rotate={-3}>
            JUSQU&apos;À
          </Stamp>
          <div style={{ marginTop: 34 }}>
            <Stamp delay={fine + 6} size={160} bg={C.red} color={C.white} rotate={-2} shadow={12}>
              75&nbsp;000&nbsp;€
            </Stamp>
          </div>
          <div style={{ marginTop: 40, fontFamily: HEAD, fontWeight: 800, fontSize: 112, color: C.white, opacity: interpolate(frame, [fine + 10, fine + 16], [0, 1], clamp) }}>
            D&apos;AMENDE
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
