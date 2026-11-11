// Scènes de la publicité « Partager et travailler ensemble » (1080 × 1920). Images absolues (repères E).
// Écrans réels de Stokara (copie de démonstration, données fictives), vus dans un « hublot » vertical
// avec une caméra ; Excel est reconstitué (../stokara/windows.tsx).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { IconName } from "../stokara/icons";
import { Keys, QylineBadge } from "../stokara/ui";
import { Sheet } from "../stokara/windows";
import { CK, FONT, FileTile, Icon, K, Logo, Pointer, Pop, SceneWrap, clamp, lin, sp, useF } from "../stokara-pub/kit";
import { E, SCENE } from "./timing";

const card: React.CSSProperties = { background: "rgba(255,255,255,.95)", borderRadius: 28, boxShadow: "0 24px 50px rgba(26,35,126,.16), 0 4px 12px rgba(26,35,126,.08)", boxSizing: "border-box", fontFamily: FONT };
type R4 = [number, number, number, number];
const ctr = (r: R4): [number, number] => [r[0] + r[2] / 2, r[1] + r[3] / 2];

// ------------------------------------------------------------------ hublot sur les captures (1600 × 860 px CSS)
const VP = { x: 30, y: 478, w: 1020, h: 862, bar: 48 };
const VW = VP.w;
const VH = VP.h - VP.bar;
const S0 = VW / 1600;
const ZMIN = VH / (860 * S0); // en dessous, la capture ne remplirait pas la hauteur
type Cam = { t: number; cx: number; cy: number; z: number; d?: number };
const camAt = (keys: Cam[], f: number) => {
  let c = { cx: keys[0].cx, cy: keys[0].cy, z: keys[0].z };
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.t) break;
    const e = lin(f, k.t, k.t + (k.d ?? 14));
    c = { cx: c.cx + (k.cx - c.cx) * e, cy: c.cy + (k.cy - c.cy) * e, z: c.z * Math.pow(k.z / c.z, e) };
  }
  const z = Math.max(ZMIN, c.z);
  const hw = VW / 2 / (S0 * z);
  const hh = VH / 2 / (S0 * z);
  return { cx: Math.min(Math.max(c.cx, hw), 1600 - hw), cy: Math.min(Math.max(c.cy, hh), 860 - hh), z };
};
const Viewport: React.FC<{ f: number; from: number; shots: [number, string][]; cams: Cam[]; url: string; children?: React.ReactNode }> = ({ f, from, shots, cams, url, children }) => {
  const p = sp(f, from + 3, 16, 150);
  let i = 0;
  shots.forEach(([t], j) => {
    if (f >= t) i = j;
  });
  const fade = i > 0 ? lin(f, shots[i][0], shots[i][0] + 4) : 1;
  const c = camAt(cams, f);
  const img = (s: string, o: number) => <Img key={s} src={staticFile(`stokara/caps/${s}.jpg`)} style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 860, opacity: o }} />;
  return (
    <div style={{ position: "absolute", left: VP.x, top: VP.y, width: VP.w, height: VP.h, borderRadius: 24, background: "#fff", overflow: "hidden", boxShadow: "0 40px 90px rgba(26,35,126,.3), 0 6px 18px rgba(26,35,126,.12)", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * 140}px) scale(${0.9 + 0.1 * p})` }}>
      <div style={{ height: VP.bar, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", background: "#f6f7fb", borderBottom: `1px solid ${K.line}`, fontFamily: FONT }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((col) => (
            <div key={col} style={{ width: 13, height: 13, borderRadius: 7, background: col }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#eceff6", borderRadius: 18, padding: "7px 16px", fontSize: 20, color: K.ink, whiteSpace: "nowrap", overflow: "hidden" }}>
          <Icon name="lock-fill" size={16} color={K.green} />
          stokara.entrelyo.fr<span style={{ color: K.ink3 }}>{url}</span>
        </div>
      </div>
      <div style={{ position: "relative", width: VW, height: VH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 860, transformOrigin: "0 0", transform: `translate(${VW / 2}px, ${VH / 2}px) scale(${S0 * c.z}) translate(${-c.cx}px, ${-c.cy}px)` }}>
          {i > 0 && fade < 1 && img(shots[i - 1][1], 1)}
          {img(shots[i][1], fade)}
          {children}
        </div>
      </div>
    </div>
  );
};

// Encadré orange sur une zone de la capture
const Spot: React.FC<{ r: R4; from: number; to: number; round?: number }> = ({ r, from, to, round = 10 }) => {
  const f = useF();
  if (f < from - 1 || f > to + 6) return null;
  const q = sp(f, from, 12, 220);
  const o = interpolate(f, [from, from + 4, to, to + 6], [0, 1, 1, 0], clamp);
  const pad = 6 + (1 - q) * 14;
  return <div style={{ position: "absolute", left: r[0] - pad, top: r[1] - pad, width: r[2] + 2 * pad, height: r[3] + 2 * pad, borderRadius: round, border: `4px solid ${K.orange}`, boxShadow: "0 0 0 6px rgba(249,135,26,.22), 0 0 30px rgba(249,135,26,.45)", opacity: o }} />;
};

// Bulle d'explication posée sur l'image (coordonnées de la vidéo)
const Callout: React.FC<{ at: number; until: number; icon: IconName; title: string; sub?: string; top: number; tone?: string; left?: number }> = ({ at, until, icon, title, sub, top, tone, left = 60 }) => {
  const f = useF();
  if (f < at - 1 || f > until + 8) return null;
  const q = sp(f, at, 12, 210);
  const out = lin(f, until, until + 8);
  return (
    <div style={{ position: "absolute", left, right: 60, top, display: "flex", justifyContent: "center", opacity: interpolate(q, [0, 0.3], [0, 1], clamp) * (1 - out), transform: `translateY(${(1 - q) * 50}px) scale(${0.85 + 0.15 * q})` }}>
      <div style={{ ...card, borderRadius: 26, padding: "16px 26px", display: "flex", alignItems: "center", gap: 16, background: tone ?? `linear-gradient(135deg, ${K.navy}, ${K.blue})`, color: "#fff" }}>
        <Icon name={icon} size={46} color="#fff" />
        <div>
          <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
          {sub && <div style={{ fontSize: 22, opacity: 0.9 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
};

const LogoBurst: React.FC<{ f: number }> = ({ f }) => {
  if (f < E.logo - 2 || f > E.logo + 28) return null;
  const p = sp(f, E.logo, 10, 200);
  const fly = lin(f, E.logo + 13, E.logo + 26);
  const x = 540 + (452 - 540) * fly;
  const y = 860 + (128 - 860) * fly;
  const size = 240 * (1 - 0.81 * fly);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${p})`, opacity: 1 - lin(f, E.logo + 21, E.logo + 27) }}>
      <div style={{ position: "absolute", inset: -size * 0.35, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,255,255,.6) 45%, transparent 70%)", opacity: 1 - fly }} />
      <Logo size={size} style={{ position: "relative", filter: "drop-shadow(0 18px 30px rgba(26,35,126,.35))" }} />
    </div>
  );
};

// ====================================================================== 1. Accroche : un devis à envoyer
export const ActHook: React.FC = () => {
  const f = useF();
  const q = f >= E.client ? sp(f, E.client, 12, 200) : 0;
  const t = ((f / 40) % 1 + 1) % 1;
  const px = 380 + 320 * t;
  const py = 900 - Math.sin(Math.PI * t) * 120;
  return (
    <SceneWrap from={SCENE.hook} to={SCENE.share}>
      <div style={{ position: "absolute", left: 40, top: 660, width: 340, textAlign: "center", fontFamily: FONT }}>
        <FileTile kind="pdf" size={250} style={{ margin: "0 auto", transform: `rotate(-6deg) translateY(${Math.sin(f / 12) * 8}px)` }} />
        <div style={{ fontSize: 34, fontWeight: 600, color: K.ink, marginTop: 28 }}>Devis D-2026-041.pdf</div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d="M 380 900 Q 540 640 700 900" stroke={K.blue} strokeWidth={5} fill="none" strokeDasharray="10 14" strokeDashoffset={-f * 1.5} opacity={0.5} />
      </svg>
      <div style={{ position: "absolute", left: px - 34, top: py - 34, transform: `rotate(${-20 + 40 * t}deg)` }}>
        <Icon name="envelope-fill" size={68} color={K.orange} />
      </div>
      <div style={{ position: "absolute", left: 700, top: 680, width: 340, textAlign: "center", fontFamily: FONT, transform: `scale(${1 + 0.06 * q})` }}>
        <div style={{ width: 260, height: 260, margin: "0 auto", borderRadius: 130, background: `linear-gradient(135deg, ${K.blue}, ${K.navy})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(26,35,126,.3)" }}>
          <Icon name="building" size={124} color="#fff" />
        </div>
        <div style={{ fontSize: 34, fontWeight: 600, color: K.ink, marginTop: 28 }}>Dupont SARL</div>
        <div style={{ fontSize: 28, color: K.ink3 }}>votre client</div>
      </div>
      <div style={{ position: "absolute", left: 540 - 56, top: 560, width: 112, height: 112, borderRadius: 56, background: K.orange, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(249,135,26,.45)", transform: `scale(${0.8 + 0.2 * Math.abs(Math.sin(f / 9))})` }}>?</div>
    </SceneWrap>
  );
};

// ====================================================================== 2. Lien de partage : clic droit, réglages, lien créé
const R = {
  tDevis: [629.3, 214.7, 151.6, 170.3] as R4,
  menu: [705, 299, 238.7, 510.8] as R4,
  share: [711.6, 421.2, 225.5, 35.0] as R4,
  dlg: [400, 240.6, 800, 378.7] as R4,
  days: [417, 380.5, 250.0, 38] as R4,
  pw: [675.0, 380.5, 250.0, 38] as R4,
  max: [933.0, 380.5, 250.0, 38] as R4,
  createBtn: [417, 434.5, 139.5, 36] as R4,
  code: [417, 437.7, 766, 37.7] as R4,
};
export const ActShare: React.FC = () => {
  const f = useF();
  const keys: CK[] = [
    { t: E.rclick - 16, p: [1100, 600] },
    { t: E.rclick, p: ctr(R.tDevis), click: "r", d: 14 },
    { t: E.create, p: ctr(R.share), click: "l", d: 14 },
    { t: E.max + 6, p: [ctr(R.max)[0] + 60, ctr(R.max)[1] + 50], d: 14 },
    { t: E.created - 2, p: ctr(R.createBtn), click: "l", d: 14 },
  ];
  return (
    <SceneWrap from={SCENE.share} to={SCENE.client}>
      <Viewport
        f={f}
        from={SCENE.share}
        url="/e/garage-dupont"
        shots={[
          [0, "ex-dupont"],
          [E.rclick + 2, "sh-ctx"],
          [E.create + 3, "sh-dlg"],
          [E.created + 2, "sh-created"],
        ]}
        cams={[
          { t: 0, cx: 760, cy: 380, z: 1.6 },
          { t: E.rclick - 10, cx: 790, cy: 470, z: 1.75, d: 16 },
          { t: E.create + 3, cx: 800, cy: 420, z: 1.8, d: 12 },
          { t: E.created + 2, cx: 800, cy: 470, z: 1.8, d: 12 },
        ]}
      >
        <Spot r={R.share} from={E.create - 8} to={E.create + 3} round={8} />
        <Spot r={R.days} from={E.dur} to={E.created} />
        <Spot r={R.pw} from={E.pw} to={E.created} />
        <Spot r={R.max} from={E.max} to={E.created} />
        {f >= E.created + 2 && (
          // adresse de la copie de démonstration remplacée par celle du site
          <div style={{ position: "absolute", left: 425, top: 445, width: 520, height: 22, background: "#f5f6fb", fontFamily: "'DejaVu Sans Mono', 'Liberation Mono', monospace", fontSize: 13.5, color: "#1f2433", lineHeight: "22px", whiteSpace: "nowrap" }}>
            https://stokara.entrelyo.fr/s/e6c78566ff58114547b823f3cc2b9972
          </div>
        )}
        <Pointer keys={keys} from={E.rclick - 16} to={SCENE.client + 9} size={1.45} />
      </Viewport>
      <Callout at={E.created + 6} until={SCENE.client} icon="check-circle-fill" title="Lien créé et copié" sub="30 jours · mot de passe · 5 téléchargements" top={1180} tone={`linear-gradient(135deg, ${K.green}, #2f9e44)`} />
      <LogoBurst f={f} />
    </SceneWrap>
  );
};

// ====================================================================== 3. Le client ouvre le lien, sans compte
const PWF = { x: 618, y: 322, w: 312, h: 27 }; // texte du champ « Mot de passe » (sh-public-lock)
const UNLOCK: [number, number] = [970, 336];
export const ActClient: React.FC = () => {
  const f = useF();
  const n = Math.round(interpolate(f, [E.type, E.type + 16], [0, 11], clamp));
  const keys: CK[] = [
    { t: E.type - 12, p: [1150, 520] },
    { t: E.type - 2, p: [PWF.x + 200, PWF.y + 14], click: "l", d: 10 },
    { t: E.open - 3, p: UNLOCK, click: "l", d: 10 },
  ];
  return (
    <SceneWrap from={SCENE.client} to={SCENE.team}>
      <Viewport
        f={f}
        from={SCENE.client}
        url="/s/e6c78566ff58…"
        shots={[
          [0, "sh-public-lock"],
          [E.open, "sh-public"],
        ]}
        cams={[
          { t: 0, cx: 800, cy: 300, z: 1.7 },
          { t: E.open, cx: 800, cy: 430, z: 1.49, d: 14 },
        ]}
      >
        {f >= E.type - 2 && f < E.open && (
          <div style={{ position: "absolute", left: PWF.x, top: PWF.y, width: PWF.w, height: PWF.h, background: "#fff", fontFamily: FONT, fontSize: 17, letterSpacing: 2, color: "#2b2f3a", lineHeight: `${PWF.h}px` }}>
            {"●".repeat(n)}
            {n < 11 && <span style={{ display: "inline-block", width: 1.5, height: 17, background: K.ink, verticalAlign: "-3px" }} />}
          </div>
        )}
        <Pointer keys={keys} from={E.type - 12} to={E.open + 4} size={1.45} />
      </Viewport>
      <Callout at={SCENE.client + 8} until={SCENE.team} icon="person-lock" title="Votre client, sans compte" sub="mot de passe, aperçu, téléchargement" top={560} />
    </SceneWrap>
  );
};

// ====================================================================== 4. La messagerie de l'équipe
const MSG = { thread: [468, 91, 1018, 756] as R4, menu: [480.2, 712.8, 213.6, 82] as R4 };
export const ActTeam: React.FC = () => {
  const f = useF();
  return (
    <SceneWrap from={SCENE.team} to={SCENE.office}>
      <Viewport
        f={f}
        from={SCENE.team}
        url="/messages.html"
        shots={[
          [0, "ms-thread"],
          [E.clip, "ms-clip"],
        ]}
        cams={[
          { t: 0, cx: 960, cy: 330, z: 1.6 },
          { t: E.msg - 10, cx: 960, cy: 560, z: 1.6, d: 24 },
          { t: E.clip, cx: 820, cy: 640, z: 1.7, d: 14 },
        ]}
      >
        <Spot r={MSG.menu} from={E.clip + 4} to={SCENE.office} />
        <Pointer keys={[{ t: E.clip - 14, p: [700, 600] }, { t: E.clip - 2, p: [501, 816], click: "l", d: 12 }]} from={E.clip - 14} to={SCENE.office + 9} size={1.45} />
      </Viewport>
      <Callout at={E.msg} until={SCENE.office} icon="chat-dots-fill" title="Messages et pièces jointes" sub="et une notification à chaque nouveauté" top={560} tone={`linear-gradient(135deg, ${K.orange}, ${K.orange2})`} />
    </SceneWrap>
  );
};

// ====================================================================== 5. Modifier dans Excel : Ctrl+S enregistre dans Stokara
export const ActOffice: React.FC = () => {
  const f = useF();
  const opened = f >= E.edit;
  const sheetP = sp(f, E.edit, 14, 170);
  const typed = interpolate(f, [E.edit + 16, E.save - 10], [0, 15], clamp);
  const saved = f >= E.save + 6;
  const btnPress = f >= E.edit - 9 && f < E.edit ? interpolate(f, [E.edit - 9, E.edit - 6, E.edit], [0, 1, 0], clamp) : 0;
  const keys: CK[] = [
    { t: E.edit - 22, p: [900, 1260] },
    { t: E.edit - 6, p: [540, 905], click: "l", d: 14 },
  ];
  return (
    <SceneWrap from={SCENE.office} to={SCENE.trash}>
      {/* le fichier dans Stokara */}
      <Pop at={SCENE.office + 3} style={{ position: "absolute", left: 140, top: 500, width: 800 }} dy={60}>
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 26, padding: "26px 30px", opacity: opened ? 1 - 0.55 * lin(f, E.edit, E.edit + 10) : 1 }}>
          <FileTile kind="xlsx" size={130} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: K.ink }}>Planning chantier.xlsx</div>
            <div style={{ fontSize: 24, color: saved ? K.green : K.ink3, fontWeight: saved ? 600 : 400 }}>{f >= E.saved ? "Modifié à l'instant · Karim" : "Commun · 18 Ko"}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px 22px", borderRadius: 16, background: "linear-gradient(90deg, #1d7a45, #2b9a5a)", color: "#fff", fontSize: 26, fontWeight: 600, boxShadow: `0 10px 22px rgba(29,122,69,.35), 0 0 0 ${btnPress * 8}px rgba(29,122,69,.25)`, transform: `scale(${1 - 0.06 * btnPress})` }}>
              <Icon name="file-earmark-excel-fill" size={26} color="#fff" />
              Modifier dans Excel
            </div>
          </div>
        </div>
      </Pop>
      {/* Excel s'ouvre sur le PC */}
      {opened && (
        <div style={{ position: "absolute", left: 90, top: 730, width: 900, opacity: interpolate(sheetP, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - sheetP) * 120}px) scale(${0.85 + 0.15 * sheetP})` }}>
          <div style={{ position: "relative", width: 900, height: 460 }}>
            <Sheet edit={typed} saved={saved} style={{ left: 0, top: 0 }} />
          </div>
        </div>
      )}
      {f >= E.save - 2 && (
        <Pop at={E.save - 2} style={{ position: "absolute", left: 0, right: 0, top: 1218, display: "flex", justifyContent: "center" }} scale>
          <div style={{ transform: `scale(${1.2 + 0.08 * Math.exp(-Math.max(0, f - E.save) / 4)})` }}>
            <Keys keys={["Ctrl", "S"]} size={46} />
          </div>
        </Pop>
      )}
      <Callout at={E.save + 8} until={SCENE.trash} icon="cloud-check-fill" title="Enregistré dans Stokara" sub="sans rien télécharger ni renvoyer" top={556} tone={`linear-gradient(135deg, ${K.green}, #2f9e44)`} />
      <Pointer keys={keys} from={E.edit - 22} to={E.edit + 8} size={1.3} />
    </SceneWrap>
  );
};

// ====================================================================== 6. Corbeille : 30 jours pour restaurer
const TR = { info: [306, 206, 522, 28] as R4, row: [1533, 335.6, 28, 28] as R4 };
export const ActTrash: React.FC = () => {
  const f = useF();
  return (
    <SceneWrap from={SCENE.trash} to={SCENE.end}>
      <Viewport
        f={f}
        from={SCENE.trash}
        url="/e/garage-dupont"
        shots={[
          [0, "ex-deleted"],
          [E.trash, "ex-trash"],
        ]}
        cams={[
          { t: 0, cx: 800, cy: 640, z: 1.6 },
          { t: E.trash, cx: 600, cy: 300, z: 2.4, d: 14 },
          { t: E.days - 2, cx: 1290, cy: 310, z: 2.4, d: 12 },
        ]}
      >
        <Spot r={[626, 790, 346, 40]} from={SCENE.trash + 6} to={E.trash - 2} round={20} />
        <Spot r={TR.info} from={E.trash + 6} to={E.days + 2} round={16} />
        <Spot r={TR.row} from={E.days + 9} to={SCENE.end} round={8} />
        <Pointer keys={[{ t: E.days, p: [1380, 520] }, { t: E.days + 11, p: ctr(TR.row), d: 11 }]} from={E.days} to={SCENE.end + 9} size={1.45} />
      </Viewport>
      <Callout at={E.days} until={SCENE.end} icon="arrow-repeat" title="30 jours pour restaurer" sub="un clic, et le fichier retrouve sa place" top={1180} />
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
    ["link-45deg", "Partage"],
    ["chat-dots-fill", "Messagerie"],
    ["file-earmark-excel-fill", "Office"],
    ["trash3", "Corbeille"],
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
      <Pop at={SCENE.end + 16} style={{ position: "absolute", left: 40, right: 40, top: 835, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 54, fontWeight: 600, color: K.ink, lineHeight: 1.15 }}>
          Partagez, travaillez ensemble,{" "}
          <span style={{ background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontWeight: 700 }}>l'esprit tranquille.</span>
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1000, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        {pills.map(([ic, l], i) => (
          <Pop key={l} at={SCENE.end + 22 + i * 3} scale>
            <div style={{ ...card, borderRadius: 30, padding: "10px 20px", display: "flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 600, color: K.ink }}>
              <Icon name={ic} size={28} color={K.blue} />
              {l}
            </div>
          </Pop>
        ))}
      </div>
      <Pop at={SCENE.end + 34} style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center" }} scale>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 50px", borderRadius: 60, background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, color: "#fff", fontFamily: FONT, fontSize: 44, fontWeight: 700, boxShadow: "0 18px 40px rgba(249,135,26,.45)", transform: `scale(${cta})` }}>
          Créer mon compte
          <Icon name="arrow-right" size={38} color="#fff" />
        </div>
      </Pop>
      <Pop at={SCENE.end + 40} style={{ position: "absolute", left: 0, right: 0, top: 1250, textAlign: "center", fontFamily: FONT }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: 42, fontWeight: 600, color: K.blue }}>
          <Icon name="globe2" size={36} color={K.blue} />
          stokara.entrelyo.fr
        </div>
      </Pop>
      <Pop at={SCENE.end + 46} style={{ position: "absolute", left: 40, right: 40, top: 1340, textAlign: "center", fontFamily: FONT }}>
        <div style={{ display: "inline-block", fontSize: 30, fontWeight: 500, color: K.ink2, background: "rgba(255,255,255,.85)", borderRadius: 30, padding: "10px 26px" }}>
          Particuliers <b style={{ color: K.navy }}>3 €/mois</b> · Entreprises dès <b style={{ color: K.navy }}>15 €/mois</b>
        </div>
      </Pop>
      <Pop at={SCENE.end + 52} style={{ position: "absolute", left: 0, right: 0, top: 1450, display: "flex", justifyContent: "center" }}>
        <QylineBadge />
      </Pop>
    </AbsoluteFill>
  );
};
