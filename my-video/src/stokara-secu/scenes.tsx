// Scènes de la publicité « Sécurité et contrôle » (1080 × 1920). Images absolues (repères E).
// Écrans réels de Stokara (copie de démonstration, données fictives) vus dans le hublot de ../stokara-pub/shots ;
// la scène « chiffré et hébergé en France » est une illustration (doc : AES-256-GCM, une clé par espace, o2switch).
import React from "react";
import { AbsoluteFill } from "remotion";
import { IconName } from "../stokara/icons";
import { QylineBadge } from "../stokara/ui";
import { CK, FONT, FileTile, Icon, K, Logo, Pointer, Pop, SceneWrap, lin, sp, useF } from "../stokara-pub/kit";
import { Callout, LogoBurst, R4, Spot, Viewport, card, ctr } from "../stokara-pub/shots";
import { E, SCENE } from "./timing";

// ====================================================================== 1. Accroche : qui peut voir vos fichiers ?
const PEOPLE: { ini: string; c: string; x: number; y: number; bad?: boolean }[] = [
  { ini: "MD", c: K.navy, x: 160, y: 640 },
  { ini: "SL", c: K.pink, x: 920, y: 640 },
  { ini: "KB", c: K.orange, x: 130, y: 1080 },
  { ini: "JP", c: K.teal, x: 950, y: 1080 },
  { ini: "?", c: "#9aa3b8", x: 540, y: 1250, bad: true },
];
export const ActHook: React.FC = () => {
  const f = useF();
  const q = f >= E.who ? sp(f, E.who, 12, 200) : 0;
  return (
    <SceneWrap from={SCENE.hook} to={SCENE.rights}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {PEOPLE.map((p) => (
          <line key={p.ini} x1={p.x} y1={p.y} x2={540} y2={860} stroke={p.bad ? K.red : K.blue} strokeWidth={5} strokeDasharray="10 12" strokeDashoffset={-f * 1.5} opacity={0.45} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 540 - 170, top: 700, width: 340, textAlign: "center", fontFamily: FONT }}>
        <div style={{ position: "relative", display: "inline-block", transform: `scale(${1 + 0.05 * Math.sin(f / 8)})` }}>
          <Icon name="folder-fill" size={260} color={K.folder} />
          <div style={{ position: "absolute", right: -10, bottom: 30, width: 100, height: 100, borderRadius: 50, background: `linear-gradient(135deg, ${K.blue}, ${K.navy})`, display: "flex", alignItems: "center", justifyContent: "center", border: "6px solid #fff", boxShadow: "0 12px 26px rgba(26,35,126,.35)" }}>
            <Icon name="lock-fill" size={50} color="#fff" />
          </div>
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: K.ink, marginTop: -10 }}>Comptabilité</div>
      </div>
      {PEOPLE.map((p, i) => (
        <div key={p.ini} style={{ position: "absolute", left: p.x - 65, top: p.y - 65, width: 130, height: 130, transform: `translateY(${Math.sin(f / 13 + i * 1.4) * 8}px)` }}>
          <div style={{ width: 130, height: 130, borderRadius: 65, background: p.c, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: p.bad ? 64 : 46, display: "flex", alignItems: "center", justifyContent: "center", border: "6px solid #fff", boxShadow: "0 16px 32px rgba(21,28,60,.22)" }}>{p.ini}</div>
          {q > 0 && (
            <div style={{ position: "absolute", right: -14, top: -14, width: 56, height: 56, borderRadius: 28, background: p.bad ? K.red : "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(21,28,60,.25)", transform: `scale(${sp(f, E.who + i * 3, 11, 220)})` }}>
              <Icon name={p.bad ? "x-lg" : "eye"} size={30} color={p.bad ? "#fff" : K.blue} />
            </div>
          )}
        </div>
      ))}
    </SceneWrap>
  );
};

// ====================================================================== 2. Droits par dossier (Droits d'accès — Clients)
const COLS = [930, 991, 1052.5, 1113.5]; // Voir, Modifier, Supprimer, Partager (en-tête et case)
const col = (i: number): R4 => [COLS[i] - 27, 404, 54, 70];
const DROITS_BTN: R4 = [1287.3, 103.2, 85.0, 37.0];
export const ActRights: React.FC = () => {
  const f = useF();
  const cues = [E.voir, E.modifier, E.supprimer, E.partager];
  const keys: CK[] = [
    { t: E.droits - 18, p: [1100, 500] },
    { t: E.droits, p: ctr(DROITS_BTN), click: "l", d: 16 },
  ];
  return (
    <SceneWrap from={SCENE.rights} to={SCENE.people}>
      <Viewport
        f={f}
        from={SCENE.rights}
        url="/e/garage-dupont"
        shots={[
          [0, "acl-btn"],
          [E.droits + 3, "acl-dlg"],
        ]}
        cams={[
          { t: 0, cx: 900, cy: 330, z: 1.6 },
          { t: E.droits - 14, cx: 1150, cy: 260, z: 1.9, d: 14 },
          { t: E.droits + 3, cx: 800, cy: 420, z: 1.85, d: 12 },
          { t: E.voir - 6, cx: 900, cy: 430, z: 2.3, d: 14 },
        ]}
      >
        <Spot r={[DROITS_BTN[0], DROITS_BTN[1], DROITS_BTN[2], DROITS_BTN[3]]} from={E.droits - 10} to={E.droits + 2} round={10} />
        {cues.map((c, i) => (
          <Spot key={i} r={col(i)} from={c} to={i < 3 ? cues[i + 1] + 4 : SCENE.people} round={14} />
        ))}
        <Pointer keys={keys} from={E.droits - 18} to={E.droits + 10} size={1.45} />
      </Viewport>
      <Callout at={E.s2 + 26} until={E.droits - 2} icon="shield-lock-fill" title="Par défaut, seuls les administrateurs voient les dossiers" top={1180} />
      <LogoBurst f={f} at={E.logo} />
    </SceneWrap>
  );
};

// ====================================================================== 3. Lecture seule, dossier confidentiel, mot de passe
const ADD: R4 = [417, 496.2, 596.1, 44];
const SUGG: [number, number] = [520, 559];
const JULIE: R4 = [417, 458, 766, 45];
const INH: R4 = [410, 312, 300, 34];
const NPW: R4 = [417, 447.6, 379, 38];
const SET: R4 = [417, 501.6, 112.6, 36];
export const ActPeople: React.FC = () => {
  const f = useF();
  const keys: CK[] = [
    { t: SCENE.people + 4, p: [ADD[0] + 300, ADD[1] + 22] },
    { t: E.lecture - 6, p: SUGG, click: "l", d: 12 },
    { t: E.confid + 14, p: [INH[0] + 15, INH[1] + 17], d: 12 },
    { t: E.mdp + 26, p: ctr(SET), click: "l", d: 16 },
  ];
  return (
    <SceneWrap from={SCENE.people} to={SCENE.access}>
      <Viewport
        f={f}
        from={SCENE.people}
        url="/e/garage-dupont"
        shots={[
          [0, "acl-pick"],
          [E.lecture - 3, "acl-added"],
          [E.confid, "acl-compta"],
          [E.mdp - 4, "acl-pw"],
        ]}
        cams={[
          { t: 0, cx: 760, cy: 470, z: 2.0 },
          { t: E.lecture - 3, cx: 800, cy: 450, z: 1.9, d: 12 },
          { t: E.confid, cx: 700, cy: 360, z: 2.2, d: 12 },
          { t: E.mdp - 4, cx: 760, cy: 450, z: 2.1, d: 12 },
        ]}
      >
        <Spot r={ADD} from={SCENE.people + 6} to={E.lecture - 6} round={12} />
        <Spot r={JULIE} from={E.lecture} to={E.confid} round={12} />
        <Spot r={INH} from={E.confid + 6} to={E.mdp - 4} round={12} />
        <Spot r={NPW} from={E.mdp} to={SCENE.access} round={12} />
        <Pointer keys={keys} from={SCENE.people + 2} to={SCENE.access + 9} size={1.3} />
      </Viewport>
      <Callout at={E.lecture + 4} until={E.confid - 2} icon="eye" title="Julie : lecture seule" sub="elle voit, sans rien modifier" top={1180} />
      <Callout at={E.confid + 8} until={E.mdp - 4} icon="lock-fill" title="Dossier confidentiel" sub="seul le groupe Comptabilité y a accès" top={1180} tone={`linear-gradient(135deg, ${K.orange}, ${K.orange2})`} />
      <Callout at={E.mdp + 4} until={SCENE.access} icon="key-fill" title="Mot de passe en plus" sub="demandé à l'ouverture du dossier" top={1180} />
    </SceneWrap>
  );
};

// ====================================================================== 4. Connexion verrouillée, appareil déconnecté
const ERR: R4 = [616.2, 575.8, 367.6, 46.5];
const ANDROID: R4 = [829.8, 250, 572.4, 50];
const DISC: [number, number] = [1347, 275];
export const ActAccess: React.FC = () => {
  const f = useF();
  const keys: CK[] = [
    { t: E.device + 10, p: [1100, 520] },
    { t: E.disc, p: DISC, click: "l", d: 16 },
  ];
  const gone = f >= E.disc + 4;
  return (
    <SceneWrap from={SCENE.access} to={SCENE.log}>
      <Viewport
        f={f}
        from={SCENE.access}
        url={f >= E.device ? "/compte.html" : "/login.html"}
        shots={[
          [0, "login-error"],
          [E.device, "ac-top"],
        ]}
        cams={[
          { t: 0, cx: 800, cy: 430, z: 1.8 },
          { t: E.device, cx: 1110, cy: 300, z: 2.0, d: 14 },
        ]}
      >
        <Spot r={ERR} from={SCENE.access + 8} to={E.device - 2} round={14} />
        <Spot r={ANDROID} from={E.device + 6} to={E.disc + 2} round={12} />
        {gone && (
          // l'appareil déconnecté disparaît de la liste
          <div style={{ position: "absolute", left: ANDROID[0], top: ANDROID[1] - 6, width: ANDROID[2], height: ANDROID[3] + 10, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", fontFamily: FONT, fontSize: 14, fontWeight: 600, color: K.green, opacity: lin(f, E.disc + 4, E.disc + 9) }}>
            <Icon name="check-circle-fill" size={16} color={K.green} />
            Android · Chrome déconnecté
          </div>
        )}
        <Pointer keys={keys} from={E.device + 10} to={SCENE.log + 9} size={1.3} />
      </Viewport>
      <Callout at={E.lock} until={E.device - 2} icon="lock-fill" title="Compte verrouillé" sub="après 5 essais ratés, pendant quelques minutes" top={1180} tone={`linear-gradient(135deg, #e5484d, ${K.red})`} />
      <Callout at={E.disc + 6} until={SCENE.log} icon="phone" title="Téléphone perdu ? Déconnecté." sub="depuis Mon compte, en un clic" top={1180} />
    </SceneWrap>
  );
};

// ====================================================================== 5. Le journal
export const ActLog: React.FC = () => {
  const f = useF();
  return (
    <SceneWrap from={SCENE.log} to={SCENE.crypto}>
      <Viewport
        f={f}
        from={SCENE.log}
        url="/admin.html#journal"
        shots={[[0, "ad-log"]]}
        cams={[
          { t: 0, cx: 880, cy: 330, z: 1.75 },
          { t: E.trace - 8, cx: 880, cy: 640, z: 1.75, d: 26 },
        ]}
      >
        <Spot r={[345, 802, 1170, 40]} from={E.trace + 8} to={SCENE.crypto} round={10} />
      </Viewport>
      <Callout at={E.trace} until={SCENE.crypto} icon="journal-text" title="Connexions, fichiers, partages, droits" sub="tout est noté : qui, quoi, quand" top={560} />
    </SceneWrap>
  );
};

// ====================================================================== 6. Chiffré et hébergé en France (illustration)
const HEX = "0123456789abcdef";
const cipher = (f: number, n: number) => {
  let s = "";
  for (let i = 0; i < n; i++) s += HEX[Math.floor(Math.abs(Math.sin((i + 1) * 12.9898 + Math.floor(f / 2) * 78.233) * 43758.5453)) % 16] + (i % 4 === 3 ? " " : "");
  return s;
};
export const ActCrypto: React.FC = () => {
  const f = useF();
  const enc = f >= E.chiffre ? lin(f, E.chiffre, E.chiffre + 10) : 0;
  const ring = (f - SCENE.crypto) * 1.4;
  return (
    <SceneWrap from={SCENE.crypto} to={SCENE.end}>
      {/* le fichier, puis sa version chiffrée */}
      <Pop at={SCENE.crypto + 4} style={{ position: "absolute", left: 40, top: 500, width: 1000 }} dy={50}>
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 22, padding: "22px 26px" }}>
          <FileTile kind="xlsx" size={100} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: K.ink }}>Bilan 2026.xlsx</div>
            <div style={{ fontFamily: "'DejaVu Sans Mono', 'Liberation Mono', monospace", fontSize: 24, color: enc > 0.5 ? K.orange2 : K.ink3, marginTop: 6, whiteSpace: "nowrap", overflow: "hidden" }}>{enc > 0.5 ? cipher(f, 32) : "Chiffre d'affaires · 412 680 €"}</div>
          </div>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: enc > 0.5 ? K.green : "#e9ecf5", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${enc > 0 ? 1 + 0.25 * Math.sin(Math.PI * enc) : 1})` }}>
            <Icon name={enc > 0.5 ? "lock-fill" : "unlock-fill"} size={36} color={enc > 0.5 ? "#fff" : K.ink3} />
          </div>
        </div>
      </Pop>
      {/* le bouclier */}
      <div style={{ position: "absolute", left: 540 - 190, top: 660, width: 380, height: 380 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `6px dashed rgba(57,73,171,.35)`, transform: `rotate(${ring}deg)` }} />
        <Pop at={SCENE.crypto + 8} scale style={{ position: "absolute", inset: 40 }}>
          <div style={{ width: 300, height: 300, borderRadius: 150, background: `linear-gradient(135deg, ${K.blue}, ${K.navy})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 60px rgba(26,35,126,.35)" }}>
            <Icon name="shield-lock-fill" size={120} color="#fff" />
            <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: "#fff", marginTop: 6 }}>AES-256</div>
          </div>
        </Pop>
      </div>
      <Pop at={E.chiffre + 6} style={{ position: "absolute", left: 0, right: 0, top: 1052, display: "flex", justifyContent: "center", gap: 14 }} scale>
        {(["une clé par espace", "HTTPS partout"] as string[]).map((t) => (
          <div key={t} style={{ ...card, borderRadius: 30, padding: "10px 22px", display: "flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 600, color: K.ink }}>
            <Icon name="check-lg" size={26} color={K.green} />
            {t}
          </div>
        ))}
      </Pop>
      {/* hébergé en France */}
      <Pop at={E.france - 6} style={{ position: "absolute", left: 120, top: 1150, width: 840 }} dy={60}>
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 22, padding: "20px 28px" }}>
          <div style={{ display: "flex", width: 72, height: 50, borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,.15)" }}>
            <div style={{ flex: 1, background: "#0055a4" }} />
            <div style={{ flex: 1, background: "#fff" }} />
            <div style={{ flex: 1, background: "#ef4135" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: K.ink }}>Hébergé en France</div>
            <div style={{ fontSize: 24, color: K.ink2 }}>o2switch · Clermont-Ferrand</div>
          </div>
          <Icon name="geo-alt-fill" size={54} color={K.orange} />
        </div>
      </Pop>
    </SceneWrap>
  );
};

// ====================================================================== 7. Plan de fin
export const ActEnd: React.FC = () => {
  const f = useF();
  if (f < SCENE.end) return null;
  const p = sp(f, SCENE.end + 2, 10, 150);
  const rays = (f - SCENE.end) * 0.6;
  const cta = 1 + 0.035 * Math.sin((f - SCENE.end) / 4);
  const pills: [IconName, string][] = [
    ["shield-lock-fill", "Droits par dossier"],
    ["lock-fill", "Verrouillage"],
    ["journal-text", "Journal"],
    ["geo-alt-fill", "Chiffré, en France"],
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 420, top: 690 - 420, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,255,255,.5) 40%, transparent 70%)", opacity: p }} />
      <div style={{ position: "absolute", left: 540 - 500, top: 690 - 500, width: 1000, height: 1000, opacity: 0.18 * p, transform: `rotate(${rays}deg)`, background: `repeating-conic-gradient(from 0deg, ${K.orange} 0deg 6deg, transparent 6deg 30deg)`, WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 65%)", maskImage: "radial-gradient(circle, #000 0%, transparent 65%)" }} />
      <div style={{ position: "absolute", left: 540 - 140, top: 380, transform: `scale(${p}) rotate(${(1 - p) * -25}deg)` }}>
        <Logo size={280} style={{ filter: "drop-shadow(0 26px 40px rgba(26,35,126,.35))" }} />
      </div>
      <Pop at={SCENE.end + 8} style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 124, fontWeight: 700, color: K.navy, letterSpacing: -2, lineHeight: 1 }}>Stokara</div>
      </Pop>
      <Pop at={SCENE.end + 16} style={{ position: "absolute", left: 40, right: 40, top: 840, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 58, fontWeight: 600, color: K.ink, lineHeight: 1.15 }}>
          Vos fichiers,{" "}
          <span style={{ background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontWeight: 700 }}>sous votre contrôle.</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1000, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        {pills.map(([ic, l], i) => (
          <Pop key={l} at={SCENE.end + 22 + i * 3} scale>
            <div style={{ ...card, borderRadius: 30, padding: "10px 20px", display: "flex", alignItems: "center", gap: 10, fontSize: 27, fontWeight: 600, color: K.ink }}>
              <Icon name={ic} size={27} color={K.blue} />
              {l}
            </div>
          </Pop>
        ))}
      </div>
      <Pop at={SCENE.end + 34} style={{ position: "absolute", left: 0, right: 0, top: 1170, display: "flex", justifyContent: "center" }} scale>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 50px", borderRadius: 60, background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, color: "#fff", fontFamily: FONT, fontSize: 44, fontWeight: 700, boxShadow: "0 18px 40px rgba(249,135,26,.45)", transform: `scale(${cta})` }}>
          Créer mon compte
          <Icon name="arrow-right" size={38} color="#fff" />
        </div>
      </Pop>
      <Pop at={SCENE.end + 40} style={{ position: "absolute", left: 0, right: 0, top: 1310, textAlign: "center", fontFamily: FONT }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: 42, fontWeight: 600, color: K.blue }}>
          <Icon name="globe2" size={36} color={K.blue} />
          stokara.entrelyo.fr
        </div>
      </Pop>
      <Pop at={SCENE.end + 46} style={{ position: "absolute", left: 40, right: 40, top: 1400, textAlign: "center", fontFamily: FONT }}>
        <div style={{ display: "inline-block", fontSize: 30, fontWeight: 500, color: K.ink2, background: "rgba(255,255,255,.85)", borderRadius: 30, padding: "10px 26px" }}>
          Particuliers <b style={{ color: K.navy }}>3 €/mois</b> · Entreprises dès <b style={{ color: K.navy }}>15 €/mois</b>
        </div>
      </Pop>
      <Pop at={SCENE.end + 52} style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center" }}>
        <QylineBadge />
      </Pop>
    </AbsoluteFill>
  );
};
