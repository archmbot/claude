// SCÈNE 3 (21-34 s) — LA BOUTIQUE EN LIGNE : l'ordinateur se transforme en smartphone,
// ajout au panier, paiement simulé, commande validée, puis commandes qui arrivent de partout.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedPhone } from "../components/AnimatedPhone";
import { SHOP_PRODUCTS, VitrinePage } from "../components/AnimatedWebsite";
import { BODY, Check, Chip, HEAD, P, Stamp, Toast, clamp } from "../components/theme";
import { localEv } from "../timeline";
import { LAPTOP } from "./SiteVitrine";

const clay = ["#C9826B", "#E0B48F", "#8E5A4A", "#D9C2A7", "#A86B52", "#EAD6C0"];
const PHONE = { left: 110, top: 300, width: 460, height: 900 };
const SCREEN_W = PHONE.width - 28;

const Header: React.FC<{ count: number; title: string }> = ({ count, title }) => (
  <div style={{ height: 120, padding: "52px 22px 0", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center", background: P.white, borderBottom: "2px solid #EFE6DC" }}>
    <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 26, color: "#6B3F30" }}>{title}</span>
    <div style={{ position: "relative", width: 46, height: 40, borderRadius: 10, background: "#6B3F30" }}>
      <svg width="46" height="40" viewBox="0 0 24 24" fill="none" stroke={P.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h13l-1.5 8h-10z M6 7L5 4H3 M9 19.5h.01 M16 19.5h.01" />
      </svg>
      {count > 0 && (
        <div style={{ position: "absolute", right: -10, top: -10, width: 28, height: 28, borderRadius: 14, background: P.violet, color: P.white, fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>{count}</div>
      )}
    </div>
  </div>
);

const Catalogue: React.FC<{ scroll: number; added: number[] }> = ({ scroll, added }) => (
  <div style={{ position: "absolute", inset: 0, background: "#FFFDF9", fontFamily: BODY }}>
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, transform: `translateY(${-scroll * 140}px)` }}>
      <div style={{ padding: "18px 22px 6px", fontFamily: HEAD, fontWeight: 800, fontSize: 34, color: "#6B3F30" }}>Nouveautés</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "8px 22px" }}>
        {SHOP_PRODUCTS.map((p, i) => {
          const a = added[i] ?? 0;
          return (
            <div key={p.name} style={{ background: P.white, borderRadius: 14, border: "2px solid #EFE6DC", overflow: "hidden" }}>
              <div style={{ height: 130, background: `radial-gradient(circle at 40% 35%, ${clay[(i + 1) % 6]}, ${clay[i]} 70%)` }} />
              <div style={{ padding: "10px 12px 12px" }}>
                <div style={{ fontWeight: 800, fontSize: 19, color: "#4A2C22" }}>{p.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: 20, color: P.violet }}>{p.price}</span>
                  <div
                    style={{
                      height: 36,
                      minWidth: 36,
                      padding: "0 10px",
                      boxSizing: "border-box",
                      borderRadius: 18,
                      background: a > 0.5 ? P.green : "#6B3F30",
                      color: P.white,
                      fontWeight: 800,
                      fontSize: a > 0.5 ? 15 : 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${1 + 0.25 * Math.sin(Math.min(1, a) * Math.PI)})`,
                    }}
                  >
                    {a > 0.5 ? "Ajouté" : "+"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
      <Header count={added.filter((a) => a > 0.5).length} title="Céramique Démo" />
    </div>
  </div>
);

const Panel: React.FC<{ children: React.ReactNode; x: number }> = ({ children, x }) => (
  <div style={{ position: "absolute", inset: 0, background: "#FFFDF9", fontFamily: BODY, transform: `translateX(${x * 100}%)` }}>{children}</div>
);

const Cart: React.FC = () => (
  <>
    <Header count={2} title="Mon panier" />
    <div style={{ padding: 22 }}>
      {SHOP_PRODUCTS.slice(0, 2).map((p, i) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "2px solid #EFE6DC" }}>
          <div style={{ width: 70, height: 70, borderRadius: 12, background: clay[i] }} />
          <div style={{ flex: 1, fontWeight: 800, fontSize: 21, color: "#4A2C22" }}>{p.name}</div>
          <div style={{ fontWeight: 800, fontSize: 21, color: P.violet }}>{p.price}</div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, fontSize: 24, fontWeight: 800, color: "#4A2C22" }}>
        <span>Total</span>
        <span>42,00 €</span>
      </div>
      <div style={{ marginTop: 26, padding: "18px 0", textAlign: "center", borderRadius: 14, background: "#6B3F30", color: P.white, fontWeight: 800, fontSize: 24 }}>Commander</div>
    </div>
  </>
);

const Payment: React.FC<{ press: number; loading: number }> = ({ press, loading }) => (
  <>
    <Header count={2} title="Paiement" />
    <div style={{ padding: 22 }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#7A6A5E" }}>Paiement sécurisé · démonstration</div>
      <div style={{ marginTop: 18, height: 160, borderRadius: 18, padding: 20, boxSizing: "border-box", background: `linear-gradient(135deg, ${P.violet}, ${P.blue})`, color: P.white }}>
        <div style={{ fontSize: 18, fontWeight: 700, opacity: 0.85 }}>Carte de démonstration</div>
        <div style={{ marginTop: 50, fontSize: 22, fontWeight: 800, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>•••• •••• •••• 4242</div>
      </div>
      {["Nom sur la carte", "Expiration · CVC"].map((f) => (
        <div key={f} style={{ marginTop: 16, height: 56, borderRadius: 12, border: "2px solid #E3D7CB", padding: "14px 16px", boxSizing: "border-box", fontSize: 20, color: "#9B8B78" }}>
          {f}
        </div>
      ))}
      <div style={{ marginTop: 24, height: 66, borderRadius: 14, background: P.green, color: P.white, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.06 * press})` }}>
        {loading > 0 ? (
          <div style={{ width: 30, height: 30, borderRadius: 15, border: "4px solid rgba(255,255,255,0.4)", borderTopColor: P.white, transform: `rotate(${loading * 720}deg)` }} />
        ) : (
          "Payer 42,00 €"
        )}
      </div>
    </div>
  </>
);

const Success: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ position: "absolute", inset: 0, background: P.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: BODY, padding: 30 }}>
    <div style={{ transform: `scale(${p})` }}>
      <Check size={150} progress={p} />
    </div>
    <div style={{ marginTop: 30, fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: P.navy, textAlign: "center" }}>Commande validée !</div>
    <div style={{ marginTop: 12, fontSize: 22, fontWeight: 600, color: "#59627F" }}>N° 1042 · 42,00 € · démonstration</div>
  </div>
);

export const BoutiqueEnLigne: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shop = localEv(2, "shopWord");
  const add1 = localEv(2, "addCart1");
  const add2 = localEv(2, "addCart2");
  const checkout = localEv(2, "checkout");
  const pay = localEv(2, "payClick");
  const ok = localEv(2, "orderOk");
  const orders = localEv(2, "orders");
  // morphing ordinateur -> smartphone
  const m = interpolate(frame, [0, 26], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const box = {
    left: interpolate(m, [0, 1], [LAPTOP.left, PHONE.left]),
    top: interpolate(m, [0, 1], [LAPTOP.top, PHONE.top]),
    width: interpolate(m, [0, 1], [LAPTOP.width, PHONE.width]),
    height: interpolate(m, [0, 1], [LAPTOP.screen + 32, PHONE.height]),
    radius: interpolate(m, [0, 1], [20, 56]),
  };
  const tap = (at: number) => interpolate(frame, [at, at + 10], [0, 1], clamp);
  const added = [tap(add1), tap(add2)];
  const toCart = interpolate(frame, [checkout, checkout + 12], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const toPay = interpolate(frame, [checkout + 16, checkout + 28], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const loading = frame >= pay && frame < ok ? (frame - pay) / (ok - pay) : 0;
  const success = spring({ frame: frame - ok, fps, config: { damping: 11, stiffness: 160 } });
  const rings = frame - orders;
  const chips = [
    { label: "Catalogue", at: add1 },
    { label: "Panier", at: checkout },
    { label: "Paiement", at: pay },
  ];
  const cities = ["Lyon", "Lille", "Bordeaux", "Marseille"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 205, display: "flex", justifyContent: "center" }}>
        <Stamp delay={shop - 2} size={50} rotate={-2}>
          BOUTIQUE EN LIGNE
        </Stamp>
      </div>
      {rings > 0 &&
        [0, 1, 2].map((k) => {
          const r = ((rings + k * 20) % 60) / 60;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: PHONE.left + PHONE.width / 2 - 300,
                top: PHONE.top + PHONE.height / 2 - 300,
                width: 600,
                height: 600,
                borderRadius: "50%",
                border: `4px solid ${P.violet}`,
                opacity: (1 - r) * 0.6,
                transform: `scale(${0.6 + r * 1.4})`,
              }}
            />
          );
        })}
      {/* socle de l'ordinateur qui disparaît pendant le morphing */}
      <div style={{ position: "absolute", left: LAPTOP.left - 50, top: LAPTOP.top + LAPTOP.screen + 36, width: LAPTOP.width + 100, height: 22, borderRadius: "2px 2px 18px 18px", background: P.navy, opacity: 1 - m }} />
      <div style={{ position: "absolute", left: box.left, top: box.top }}>
        <AnimatedPhone width={box.width} height={box.height} radius={box.radius} notch={m} rotateY={m >= 1 ? Math.sin(frame / 40) * 6 : 0} glow={frame >= ok ? `rgba(34,197,94,${0.6 * success})` : undefined}>
          {m < 1 && (
            <div style={{ position: "absolute", inset: 0, opacity: 1 - m, transform: `scale(${(LAPTOP.width - 32) / 900})`, transformOrigin: "0 0" }}>
              <div style={{ transform: "translateY(-1908px)" }}>
                <VitrinePage />
              </div>
            </div>
          )}
          <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN_W, height: PHONE.height - 28, opacity: m }}>
            <Catalogue scroll={interpolate(frame, [36, 70], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })} added={added} />
            {frame >= checkout && (
              <Panel x={toCart}>
                <Cart />
              </Panel>
            )}
            {frame >= checkout + 16 && (
              <Panel x={toPay}>
                <Payment press={frame >= pay && frame < pay + 6 ? 1 : 0} loading={loading} />
              </Panel>
            )}
            {frame >= ok && <Success p={success} />}
          </div>
        </AnimatedPhone>
      </div>
      {/* toucher de l'écran */}
      {[
        { at: add1, x: PHONE.left + 14 + 175, y: PHONE.top + 14 + 120 + 52 + 130 + 58 - 140 + 36 },
        { at: add2, x: PHONE.left + 14 + 394, y: PHONE.top + 14 + 120 + 52 + 130 + 58 - 140 + 36 },
        { at: pay, x: PHONE.left + 14 + SCREEN_W / 2, y: PHONE.top + 14 + 120 + 22 + 24 + 18 + 160 + 2 * 72 + 24 + 33 },
      ].map((t) => {
        const d = frame - t.at;
        if (d < -2 || d > 14) return null;
        const k = Math.max(0, d) / 14;
        return <div key={t.at} style={{ position: "absolute", left: t.x - 40, top: t.y - 40, width: 80, height: 80, borderRadius: 40, border: `5px solid ${P.violet}`, background: "rgba(117,75,255,0.25)", opacity: 1 - k, transform: `scale(${0.5 + k})` }} />;
      })}
      <div style={{ position: "absolute", left: 610, top: 330, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22 }}>
        {chips.map((c) => (
          <Chip key={c.label} label={c.label} progress={spring({ frame: frame - c.at, fps, config: { damping: 12, stiffness: 200 } })} />
        ))}
      </div>
      {cities.map((city, i) => {
        const at = orders + i * 16;
        if (frame < at) return null;
        return (
          <div key={city} style={{ position: "absolute", left: 590, top: 640 + i * 132, transform: "scale(0.86)", transformOrigin: "0 0" }}>
            <Toast title="Nouvelle commande !" subtitle={`${city} · démonstration`} width={470} progress={spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 180 } })} color={i % 2 ? P.blue : P.green} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
