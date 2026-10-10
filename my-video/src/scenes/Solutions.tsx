// SCÈNE 5 (47-57 s) — LES SOLUTIONS INTERMÉDIAIRES : le site vitrine évolue (catalogue, acompte).
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedWebsite } from "../components/AnimatedWebsite";
import { BODY, Cursor, HEAD, P, Stamp, Toast, clamp, hard } from "../components/theme";
import { localEv } from "../timeline";

const SITE = { left: 90, top: 430, width: 900, height: 620 };
const STEPS = [
  { label: "SITE VITRINE", color: P.violet, ev: "step1" as const },
  { label: "CATALOGUE", color: P.blue, ev: "step2" as const },
  { label: "PAIEMENT EN LIGNE", color: P.green, ev: "step3" as const },
];

export const Solutions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s2 = localEv(4, "step2");
  const s3 = localEv(4, "step3");
  const motto = localEv(4, "motto");
  const click = localEv(4, "depositClick");
  const paid = localEv(4, "depositOk");
  const enter = spring({ frame: frame - 2, fps, config: { damping: 15, stiffness: 120 } });
  const catalog = interpolate(frame, [s2, s2 + 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  // descend vers le nouveau catalogue, puis remonte : le bouton d'acompte apparaît dans l'en-tête
  const scroll = interpolate(frame, [s2, s2 + 20, s3 + 14, s3 + 30], [0, 0.5, 0.5, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const deposit = spring({ frame: frame - (s3 + 22), fps, config: { damping: 11, stiffness: 170 } });
  const mottoP = spring({ frame: frame - motto, fps, config: { damping: 13, stiffness: 160 } });
  const cur = interpolate(frame, [click - 26, click - 2], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const press = frame >= click && frame < click + 6;
  const scale = SITE.width / 900;
  // bouton « Payer un acompte » : en bas à droite de l'en-tête du site
  const btn = { x: SITE.left + (900 - 40 - 140) * scale, y: SITE.top + 64 + (84 + 430 - 56 - 34) * scale };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 205, display: "flex", justifyContent: "center", opacity: 1 - mottoP }}>
        <Stamp delay={2} size={44} rotate={-2}>
          ET POURQUOI PAS LES DEUX&nbsp;?
        </Stamp>
      </div>
      {frame >= motto - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(mottoP, [0, 0.15], [0, 1], clamp), transform: `scale(${interpolate(mottoP, [0, 1], [1.6, 1])})` }}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: P.white }}>COMMENCEZ PETIT.</div>
          <div style={{ marginTop: 10, padding: "4px 24px", background: P.violet, boxShadow: hard(10), transform: "rotate(-2deg)", fontFamily: HEAD, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: P.white }}>
            ÉVOLUEZ ENSUITE.
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: SITE.left, top: SITE.top, opacity: interpolate(enter, [0, 0.15], [0, 1], clamp), transform: `translateY(${(1 - enter) * 500}px)` }}>
        <AnimatedWebsite
          variant="vitrine"
          width={SITE.width}
          height={SITE.height}
          url="atelier-demo.fr"
          scroll={scroll}
          catalog={catalog}
          deposit={deposit}
          rotateY={Math.sin(frame / 45) * 5}
          rotateX={4}
          glow={catalog > 0 && catalog < 1 ? "rgba(117,75,255,0.6)" : undefined}
        />
      </div>
      {frame >= click - 26 && frame < click + 30 && (
        <Cursor x={interpolate(cur, [0, 1], [1000, btn.x])} y={interpolate(cur, [0, 1], [1150, btn.y])} press={press} opacity={interpolate(frame, [click + 18, click + 30], [1, 0], clamp)} />
      )}
      {frame >= paid && (
        <div style={{ position: "absolute", left: 150, top: 470 }}>
          <Toast title="Acompte reçu !" subtitle="Paiement en ligne · démonstration" progress={spring({ frame: frame - paid, fps, config: { damping: 13, stiffness: 180 } })} width={520} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
        {STEPS.map((s, i) => {
          const on = spring({ frame: frame - localEv(4, s.ev), fps, config: { damping: 12, stiffness: 200 } });
          return (
            <React.Fragment key={s.label}>
              {i > 0 && (
                <svg width="46" height="30" viewBox="0 0 46 30" style={{ opacity: 0.3 + 0.7 * on }}>
                  <path d="M2 15h36M28 5l12 10-12 10" fill="none" stroke={P.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div
                style={{
                  padding: "14px 20px",
                  borderRadius: 999,
                  background: on > 0.5 ? s.color : "rgba(255,255,255,0.12)",
                  border: `3px solid ${on > 0.5 ? P.navy : "rgba(255,255,255,0.4)"}`,
                  boxShadow: on > 0.5 ? hard(6) : undefined,
                  fontFamily: BODY,
                  fontWeight: 800,
                  fontSize: 25,
                  color: P.white,
                  whiteSpace: "nowrap",
                  transform: `scale(${1 + 0.15 * Math.sin(Math.min(1, on) * Math.PI)})`,
                }}
              >
                {s.label}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
