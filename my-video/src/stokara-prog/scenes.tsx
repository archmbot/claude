// Scènes de la publicité « Installer le programme Stokara » (1080 × 1920). Images absolues (repères E).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { IconName } from "../stokara/icons";
import { QylineBadge } from "../stokara/ui";
import { CK, FONT, Icon, K, Logo, Phone, Pointer, Pop, SceneWrap, clamp, lin, sp, useF } from "../stokara-pub/kit";
import { SH, SW, Taskbar, Wallpaper } from "../stokara-pub/win";
import { E, SCENE } from "./timing";
import {
  AdminHeader,
  CLine,
  CODE,
  CONSOLE_COLORS as C,
  CON_ROWS,
  Console,
  DOSSIER,
  ENTREPRISE,
  FW,
  FolderWindow,
  MODE_TOP,
  PW,
  ServerPage,
  ServerTower,
  StoragePage,
  UAC_YES,
  Uac,
  consoleRowY,
  pkgRowY,
  wrapCon,
} from "./ui";

const card: React.CSSProperties = { background: "rgba(255,255,255,.95)", borderRadius: 28, boxShadow: "0 24px 50px rgba(26,35,126,.16), 0 4px 12px rgba(26,35,126,.08)", boxSizing: "border-box", fontFamily: FONT };

// Caméra sur une surface W × H (coordonnées de la surface)
type Cam = { t: number; cx: number; cy: number; z: number; d?: number };
const camAt = (keys: Cam[], f: number, W: number, H: number) => {
  let c = { cx: keys[0].cx, cy: keys[0].cy, z: keys[0].z };
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.t) break;
    const e = lin(f, k.t, k.t + (k.d ?? 14));
    c = { cx: c.cx + (k.cx - c.cx) * e, cy: c.cy + (k.cy - c.cy) * e, z: c.z * Math.pow(k.z / c.z, e) };
  }
  const hw = W / 2 / c.z;
  const hh = H / 2 / c.z;
  return { cx: Math.min(Math.max(c.cx, hw), W - hw), cy: Math.min(Math.max(c.cy, hh), H - hh), z: c.z };
};
const camStyle = (c: { cx: number; cy: number; z: number }, W: number, H: number): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: W,
  height: H,
  transformOrigin: "0 0",
  transform: `translate(${W / 2}px, ${H / 2}px) scale(${c.z}) translate(${-c.cx}px, ${-c.cy}px)`,
});

const FolderChip: React.FC<{ label: string; style?: React.CSSProperties }> = ({ label, style }) => (
  <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 22, padding: "12px 22px 12px 14px", boxShadow: "0 14px 30px rgba(26,35,126,.16)", fontFamily: FONT, fontSize: 30, fontWeight: 600, color: K.ink, ...style }}>
    <Icon name="folder-fill" size={40} color={K.folder} />
    {label}
  </div>
);

// ====================================================================== 1. Accroche : le serveur du bureau
const CHIPS: { label: string; x: number; y: number }[] = [
  { label: "Clients", x: 70, y: 600 },
  { label: "Devis 2026", x: 690, y: 650 },
  { label: "Photos chantier", x: 40, y: 930 },
  { label: "Comptabilité", x: 700, y: 1000 },
];
export const ActHook: React.FC = () => {
  const f = useF();
  const pulse = f >= E.hookServer ? Math.exp(-(f - E.hookServer) / 8) : 0;
  return (
    <SceneWrap from={SCENE.hook} to={SCENE.download}>
      <div style={{ position: "absolute", left: 540 - 260, top: 1150, width: 520, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(21,28,60,.28), transparent 70%)" }} />
      <ServerTower w={300} f={f} style={{ left: 390, top: 680, transform: `scale(${1 + 0.05 * pulse})` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {CHIPS.map((c, i) => {
          const cx = c.x + (c.x < 400 ? 300 : 20);
          const cy = c.y + 40;
          return <line key={i} x1={cx} y1={cy} x2={540} y2={900} stroke={K.blue} strokeWidth={4} strokeDasharray="8 12" strokeDashoffset={-f * 1.4} opacity={0.35 + 0.4 * pulse} />;
        })}
      </svg>
      {CHIPS.map((c, i) => (
        <FolderChip key={c.label} label={c.label} style={{ left: c.x, top: c.y + Math.sin(f / 14 + i * 1.7) * 10 }} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1210, display: "flex", justifyContent: "center" }}>
        <div style={{ ...card, borderRadius: 40, padding: "14px 30px", display: "flex", alignItems: "center", gap: 14, fontSize: 32, fontWeight: 600, color: K.ink }}>
          <Icon name="building" size={34} color={K.blue} />
          Serveur du bureau
          <span style={{ fontSize: 26, color: K.ink3, fontWeight: 500 }}>· {DOSSIER}</span>
        </div>
      </div>
    </SceneWrap>
  );
};

// ====================================================================== 2. Télécharger le programme (Administration → Serveur de fichiers)
const BRW = { x: 30, y: 478, w: 1020, bar: 48, h: 862 };
const KB = BRW.w / PW;
const PH = (BRW.h - BRW.bar) / KB; // hauteur de la page (px CSS)
const pageToCanvas = (x: number, y: number): [number, number] => [BRW.x + x * KB, BRW.y + BRW.bar + y * KB];
const Browser: React.FC<{ url: string; p: number; children: React.ReactNode }> = ({ url, p, children }) => (
  <div style={{ position: "absolute", left: BRW.x, top: BRW.y, width: BRW.w, height: BRW.h, borderRadius: 22, background: "#f4f6fb", overflow: "hidden", boxShadow: "0 40px 90px rgba(26,35,126,.3), 0 6px 18px rgba(26,35,126,.12)", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * -120}px) scale(${0.9 + 0.1 * p})` }}>
    <div style={{ height: BRW.bar, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", background: "#fff", borderBottom: `1px solid ${K.line}`, fontFamily: FONT }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#eceff6", borderRadius: 18, padding: "7px 16px", fontSize: 20, color: K.ink }}>
        <Icon name="lock-fill" size={16} color={K.green} />
        stokara.entrelyo.fr<span style={{ color: K.ink3 }}>{url}</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, top: BRW.bar, width: PW, height: PH, transform: `scale(${KB})`, transformOrigin: "0 0", background: "linear-gradient(160deg, #eef1fb, #fbf3ea)" }}>{children}</div>
  </div>
);

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

export const BTN_DL = pageToCanvas(141, 414);
export const ActDownload: React.FC = () => {
  const f = useF();
  const p = sp(f, SCENE.download + 4, 16, 150);
  const press = f >= E.dl - 3 && f < E.dl + 6 ? interpolate(f, [E.dl - 3, E.dl, E.dl + 6], [0, 1, 0], clamp) : 0;
  const prog = lin(f, E.dl + 6, E.dl + 26);
  const keys: CK[] = [
    { t: E.dl - 18, p: [900, 1290] },
    { t: E.dl, p: BTN_DL, click: "l", d: 16 },
  ];
  return (
    <SceneWrap from={SCENE.download} to={SCENE.install}>
      <Browser url="/admin.html#programme" p={p}>
        <AdminHeader />
        <ServerPage press={press} />
      </Browser>
      <Pointer keys={keys} from={E.dl - 18} to={E.dl + 24} size={1.3} />
      {f >= E.dl + 4 && (
        <Pop at={E.dl + 4} style={{ position: "absolute", left: 440, top: 540, width: 590 }} dy={-30}>
          <div style={{ ...card, borderRadius: 20, padding: "18px 22px", display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 70, height: 70, borderRadius: 16, background: "#fff3e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="file-earmark-zip-fill" size={42} color={K.orange2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 600, color: K.ink }}>Stokara-{CODE}.zip</div>
              <div style={{ height: 8, borderRadius: 4, background: K.line, margin: "8px 0 6px" }}>
                <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 4, background: prog >= 1 ? K.green : `linear-gradient(90deg, ${K.blue}, ${K.orange})` }} />
              </div>
              <div style={{ fontSize: 20, color: prog >= 1 ? K.green : K.ink3, fontWeight: prog >= 1 ? 600 : 400 }}>{prog >= 1 ? "412 Ko · Terminé" : `${Math.round(prog * 412)} Ko sur 412 Ko`}</div>
            </div>
            {prog >= 1 && <Icon name="check-circle-fill" size={40} color={K.green} />}
          </div>
        </Pop>
      )}
      <Pop at={E.linked} style={{ position: "absolute", left: 440, top: 700, width: 590 }} dy={-20}>
        <div style={{ ...card, borderRadius: 20, padding: "16px 22px", background: `linear-gradient(135deg, ${K.navy}, ${K.blue})`, color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
          <Icon name="link-45deg" size={44} color="#fff" />
          <div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>Déjà relié à « {ENTREPRISE} »</div>
            <div style={{ fontSize: 20, opacity: 0.85 }}>adresse du site et jeton de l'espace inclus</div>
          </div>
        </div>
      </Pop>
      <LogoBurst f={f} />
    </SceneWrap>
  );
};

// ====================================================================== 3. Installer et choisir le dossier (Windows du serveur)
const SCR = { x: 40, y: 486, w: 1000 };
const KW = SCR.w / SW;
const RULE = "  " + "═".repeat(60);
const E_YES = () => E.dbl + 15; // clic sur « Oui » (contrôle de compte)
export const consoleLines = (): CLine[] => {
  const c0 = E_YES() + 6;
  const ty = { at: E.type, to: E.type + 14, text: DOSSIER };
  return [
    { at: c0, t: RULE, c: C.dk },
    { at: c0 + 1, t: "   STOKARA — programme du serveur de fichiers", c: C.white },
    { at: c0 + 1, t: "   version 3.1.11" },
    { at: c0 + 2, t: RULE, c: C.dk },
    { at: c0 + 3, t: "" },
    { at: c0 + 3, t: "  1. Copie du programme dans C:\\STOKARA", c: C.cyan },
    { at: c0 + 5, t: "  [ok] programme copié dans C:\\STOKARA", c: C.green },
    { at: c0 + 6, t: "" },
    { at: c0 + 6, t: "  2. Connexion au site Stokara", c: C.cyan },
    { at: c0 + 9, t: `  [ok] site joint : https://stokara.entrelyo.fr — entreprise « ${ENTREPRISE} » (code ${CODE})`, c: C.green },
    { at: E.choose - 5, t: "" },
    { at: E.choose - 5, t: "  3. Dossier des fichiers et corbeille", c: C.cyan },
    { at: E.choose - 3, t: "       C'est LE dossier que le site montre aux comptes de l'entreprise (et le lecteur réseau)." },
    { at: E.choose - 2, t: "       Un dossier qui contient déjà vos fichiers convient très bien (ex. D:\\Partage)." },
    { at: E.choose + 2, t: "  Dossier des fichiers [Entrée = D:\\STOKARA\\Fichiers]: ", c: C.white, type: ty, id: "prompt" },
    { at: E.enter + 3, t: "  Corbeille (à côté, jamais dedans) [Entrée = D:\\STOKARA\\corbeille]: ", c: C.white },
    { at: E.enter + 8, t: `  [ok] fichiers : ${DOSSIER}`, c: C.green, id: "okFiles" },
    { at: E.enter + 9, t: "  [ok] corbeille : D:\\STOKARA\\corbeille", c: C.green },
    { at: E.enter + 13, t: "" },
    { at: E.enter + 13, t: "  4. Windows Server (SRV-BUREAU)", c: C.cyan },
    { at: E.enter + 15, t: "  [ok] rien à régler", c: C.green },
    { at: E.starts - 6, t: "" },
    { at: E.starts - 6, t: "  6. Démarrage du programme", c: C.cyan },
    { at: E.starts, t: "  [ok] tâche « Stokara - Programme » en place (démarre avec Windows, compte SYSTEM)", c: C.green, id: "task" },
    { at: E.starts + 4, t: "       Connexion au site…" },
    { at: E.online, t: `  [ok] programme en ligne — entreprise « ${ENTREPRISE} »`, c: C.green, id: "online" },
    { at: E.online + 2, t: "" },
    { at: E.online + 2, t: RULE, c: C.green },
    { at: E.online + 3, t: "   Installation terminée.", c: C.white },
    { at: E.online + 3, t: `   Site : https://stokara.entrelyo.fr/e/${CODE}   (code entreprise : ${CODE})` },
    { at: E.online + 4, t: "   Lecteur réseau : https://stokara.entrelyo.fr/api/dav/" },
    { at: E.online + 4, t: `   Fichiers : ${DOSSIER}` },
    { at: E.online + 5, t: "   Panneau du programme : PANNEAU.bat (dans C:\\STOKARA)" },
    { at: E.online + 5, t: RULE, c: C.green },
  ].flatMap(wrapCon);
};
// rangée affichée d'une ligne à l'image f (la console défile quand elle est pleine)
const rowOf = (lines: CLine[], idx: number, f: number) => {
  const shown = lines.filter((l) => f >= l.at).length;
  return idx - Math.max(0, shown - CON_ROWS);
};

export const ActInstall: React.FC = () => {
  const f = useF();
  const p = sp(f, SCENE.install + 2, 16, 160);
  const yes = E_YES();
  const raw = consoleLines();
  // ligne surlignée selon ce que dit la voix
  const on = (id: string, a: number, b: number) => (f >= a && f < b ? id : "");
  const hl = [on("prompt", E.type - 2, E.enter + 8), on("okFiles", E.enter + 8, E.starts - 6), on("task", E.starts, E.online), on("online", E.online, SCENE.network + 9)];
  const lines = raw.map((l) => ({ ...l, hl: !!l.id && hl.includes(l.id) }));
  const iPrompt = raw.findIndex((l) => l.id === "prompt");
  const iTask = raw.findIndex((l) => l.id === "task");
  const rowY = (idx: number, at: number) => consoleRowY(rowOf(raw, idx, at));
  const cam = camAt(
    [
      { t: 0, cx: SW / 2, cy: SH / 2, z: 1 },
      { t: E.choose - 4, cx: SW / 2, cy: rowY(iPrompt, E.enter + 9), z: 1.06, d: 12 },
      { t: E.starts - 8, cx: SW / 2, cy: rowY(iTask, E.online + 5), z: 1.06, d: 12 },
    ],
    f,
    SW,
    SH,
  );
  const uacP = f >= E.dbl + 4 ? lin(f, E.dbl + 4, E.dbl + 8) * (1 - lin(f, yes + 2, yes + 6)) : 0;
  const conP = f >= yes + 5 ? lin(f, yes + 5, yes + 10) : 0;
  const keys: CK[] = [
    { t: SCENE.install + 10, p: [470, 430] },
    { t: E.dbl, p: [FW.x + 70, pkgRowY(0)], click: "d", d: 16 },
    { t: yes, p: UAC_YES, click: "l", d: 8 },
  ];
  const callout = f >= E.enter + 8 && f < E.starts - 4;
  return (
    <SceneWrap from={SCENE.install} to={SCENE.network}>
      <div style={{ position: "absolute", left: SCR.x - 10, top: SCR.y - 10, width: SCR.w, height: SH * KW, borderRadius: 26, border: "10px solid #1d2333", overflow: "hidden", boxShadow: "0 40px 90px rgba(21,28,60,.4)", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * 160}px) scale(${0.9 + 0.1 * p})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transformOrigin: "0 0", transform: `scale(${KW})` }}>
          <div style={camStyle(cam, SW, SH)}>
            <Wallpaper />
            <FolderWindow sel={f >= E.dbl - 2 ? 0 : -1} />
            {uacP > 0 && <Uac p={uacP} yesHl={f >= yes - 3} />}
            {conP > 0 && <Console f={f} lines={lines} p={conP} />}
            <Taskbar />
            <Pointer keys={keys} from={SCENE.install + 8} to={yes + 10} size={0.85} />
          </div>
        </div>
      </div>
      {f >= E.enter + 8 && (
        <div style={{ position: "absolute", left: 470, top: 1120, width: 560, opacity: callout ? 1 : 1 - lin(f, E.starts - 4, E.starts + 2) }}>
          <Pop at={E.enter + 8} dy={40}>
            <div style={{ ...card, borderRadius: 24, padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Icon name="folder-check" size={46} color={K.orange2} />
                <div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: K.ink }}>{DOSSIER}</div>
                  <div style={{ fontSize: 22, color: K.green, fontWeight: 600 }}>synchronisé avec le site</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {["Clients", "Devis 2026", "Photos chantier"].map((n) => (
                  <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 20, color: K.ink2, background: "#f1f3fa", borderRadius: 14, padding: "4px 12px" }}>
                    <Icon name="folder-fill" size={18} color={K.folder} />
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </Pop>
        </div>
      )}
    </SceneWrap>
  );
};

// ====================================================================== 4. Serveur local : aucun port à ouvrir, c'est le programme qui appelle
const Check: React.FC<{ at: number; label: string; style: React.CSSProperties }> = ({ at, label, style }) => (
  <Pop at={at} style={{ position: "absolute", ...style }} scale>
    <div style={{ ...card, borderRadius: 40, padding: "14px 26px 14px 14px", display: "flex", alignItems: "center", gap: 14, fontSize: 32, fontWeight: 700, color: K.ink }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: K.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="check-lg" size={30} color="#fff" />
      </div>
      {label}
    </div>
  </Pop>
);
export const ActNetwork: React.FC = () => {
  const f = useF();
  const draw = lin(f, E.calls - 4, E.calls + 14);
  const up = f >= E.calls + 6;
  const both = f >= E.site;
  const yTop = 640;
  const yBot = 1060;
  const dots: React.ReactNode[] = [];
  if (up) {
    for (let k = 0; k < 6; k++) {
      const t = (((f - E.calls) / 26 + k / 6) % 1 + 1) % 1;
      dots.push(<circle key={`u${k}`} cx={556} cy={yBot - (yBot - yTop) * t} r={9} fill={K.orange} />);
      if (both) {
        const t2 = (((f - E.site) / 26 + k / 6 + 0.08) % 1 + 1) % 1;
        dots.push(<circle key={`d${k}`} cx={524} cy={yTop + (yBot - yTop) * t2} r={7} fill={K.blue} opacity={0.8} />);
      }
    }
  }
  return (
    <SceneWrap from={SCENE.network} to={SCENE.modes}>
      {/* le site */}
      <Pop at={SCENE.network + 2} style={{ position: "absolute", left: 260, top: 486, width: 560 }} scale>
        <div style={{ ...card, height: 150, display: "flex", alignItems: "center", gap: 20, padding: "0 28px" }}>
          <div style={{ width: 96, height: 96, borderRadius: 26, background: `linear-gradient(135deg, ${K.blue}, ${K.navy})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="cloud-fill" size={54} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 700, color: K.ink }}>Site Stokara</div>
            <div style={{ fontSize: 24, color: K.ink2 }}>stokara.entrelyo.fr</div>
            {both && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 6, fontSize: 21, fontWeight: 600, color: K.green, background: "#e6f4ea", borderRadius: 14, padding: "2px 12px", transform: `scale(${sp(f, E.site, 12, 220)})`, transformOrigin: "0 50%" }}>
                <span style={{ width: 11, height: 11, borderRadius: 6, background: "#22c55e" }} />
                {ENTREPRISE} en ligne
              </div>
            )}
          </div>
        </div>
      </Pop>
      {/* la connexion sortante */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={0} x2={1080} y1={870} y2={870} stroke={K.ink3} strokeWidth={3} strokeDasharray="14 12" opacity={0.35} />
        <path d={`M 540 ${yBot} L 540 ${yTop}`} stroke={K.orange} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} opacity={0.9} />
        {draw >= 1 && <path d={`M 518 ${yTop + 34} L 540 ${yTop + 6} L 562 ${yTop + 34}`} stroke={K.orange} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        {dots}
      </svg>
      <div style={{ position: "absolute", left: 40, top: 838, fontFamily: FONT, fontSize: 22, fontWeight: 600, color: K.ink3, letterSpacing: 2 }}>INTERNET ↑</div>
      <div style={{ position: "absolute", left: 40, top: 880, fontFamily: FONT, fontSize: 22, fontWeight: 600, color: K.ink3, letterSpacing: 2 }}>BUREAU ↓</div>
      {draw > 0.4 && (
        <div style={{ ...card, position: "absolute", left: 576, top: 958, borderRadius: 20, padding: "10px 18px", fontSize: 26, fontWeight: 700, color: K.orange2, opacity: lin(f, E.calls + 4, E.calls + 10) }}>
          Le programme appelle le site
          <div style={{ fontSize: 21, fontWeight: 500, color: K.ink2 }}>connexion sortante, en HTTPS</div>
        </div>
      )}
      {/* la box */}
      <Pop at={SCENE.network + 6} style={{ position: "absolute", left: 360, top: 806, width: 360 }} scale>
        <div style={{ ...card, borderRadius: 24, height: 128, display: "flex", alignItems: "center", gap: 16, padding: "0 22px" }}>
          <div style={{ position: "relative" }}>
            <Icon name="router-fill" size={60} color={K.ink2} />
            <div style={{ position: "absolute", right: -10, bottom: -6, width: 34, height: 34, borderRadius: 17, background: K.navy, display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #fff" }}>
              <Icon name="lock-fill" size={16} color="#fff" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: K.ink }}>Box internet</div>
            <div style={{ fontSize: 21, color: K.ink2 }}>aucun réglage</div>
          </div>
        </div>
      </Pop>
      <Check at={E.port} label="Aucun port à ouvrir" style={{ left: 40, top: 660 }} />
      <Check at={E.box} label="Aucune box à régler" style={{ left: 40, top: 958 }} />
      {/* le bureau */}
      <Pop at={SCENE.network + 4} style={{ position: "absolute", left: 140, top: yBot, width: 800 }} dy={60}>
        <div style={{ ...card, height: 270, display: "flex", alignItems: "center", gap: 28, padding: "0 34px" }}>
          <div style={{ position: "relative", width: 150, height: 232 }}>
            <ServerTower w={150} f={f} />
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 700, color: K.ink }}>Serveur du bureau</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, color: K.ink2, marginTop: 6 }}>
              <Icon name="folder-fill" size={28} color={K.folder} />
              {DOSSIER}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 24, color: K.green, fontWeight: 600, marginTop: 10 }}>
              <span style={{ width: 13, height: 13, borderRadius: 7, background: "#22c55e", boxShadow: "0 0 0 5px rgba(34,197,94,.2)" }} />
              Programme Stokara en ligne
            </div>
          </div>
        </div>
      </Pop>
    </SceneWrap>
  );
};

// ====================================================================== 5. Choisir : serveur seul ou copie sur le site (Administration → Stockage des fichiers)
const MODE_PT = (i: number): [number, number] => pageToCanvas(420, MODE_TOP[i] + 40);
const Callout: React.FC<{ at: number; until: number; icon: IconName; title: string; sub: string; top: number; tone: string }> = ({ at, until, icon, title, sub, top, tone }) => {
  const f = useF();
  if (f < at - 1 || f > until + 8) return null;
  const q = sp(f, at, 12, 210);
  const out = lin(f, until, until + 8);
  return (
    <div style={{ position: "absolute", right: 30, top, width: 560, opacity: interpolate(q, [0, 0.3], [0, 1], clamp) * (1 - out), transform: `translateX(${(1 - q) * 120}px) scale(${0.85 + 0.15 * q})` }}>
      <div style={{ ...card, borderRadius: 24, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, background: tone, color: "#fff" }}>
        <Icon name={icon} size={48} color="#fff" />
        <div>
          <div style={{ fontSize: 29, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
          <div style={{ fontSize: 21, opacity: 0.9 }}>{sub}</div>
        </div>
      </div>
    </div>
  );
};
export const ActModes: React.FC = () => {
  const f = useF();
  const p = sp(f, SCENE.modes + 4, 16, 150);
  const pick2 = E.copy + 10;
  const sel = [f >= E.local + 2 && f < pick2 ? sp(f, E.local + 2, 14, 200) : 0, f >= pick2 ? sp(f, pick2, 14, 200) : 0, 0];
  const keys: CK[] = [
    { t: E.local - 16, p: [900, 1300] },
    { t: E.local, p: MODE_PT(0), click: "l", d: 16 },
    { t: pick2 - 2, p: MODE_PT(1), click: "l", d: 14 },
  ];
  return (
    <SceneWrap from={SCENE.modes} to={SCENE.panne}>
      <Browser url="/admin.html#stockage" p={p}>
        <AdminHeader />
        <StoragePage cur={-1} sel={sel} />
      </Browser>
      <Pointer keys={keys} from={E.local - 16} to={SCENE.panne + 9} size={1.3} />
      <Callout at={E.nothing} until={E.copy + 6} icon="cloud-slash-fill" title="Rien n'est stocké sur le site" sub="vos fichiers ne quittent pas vos locaux" top={1180} tone={`linear-gradient(135deg, ${K.navy}, ${K.blue})`} />
      <Callout at={E.secours} until={SCENE.panne} icon="arrow-left-right" title="Deux copies identiques" sub="serveur + copie de secours sur le site" top={1180} tone={`linear-gradient(135deg, ${K.orange}, ${K.orange2})`} />
    </SceneWrap>
  );
};

// ====================================================================== 6. Le serveur tombe en panne : rien n'est coupé
export const ActPanne: React.FC = () => {
  const f = useF();
  const off = lin(f, E.fail, E.fail + 8);
  const okP = sp(f, E.ok, 11, 220);
  const ph = sp(f, SCENE.panne + 6, 16, 140);
  const flow = (x1: number, y1: number, x2: number, y2: number, n: number, col: string, speed: number) =>
    Array.from({ length: n }).map((_, k) => {
      const t = ((f / speed + k / n) % 1 + 1) % 1;
      return <circle key={k} cx={x1 + (x2 - x1) * t} cy={y1 + (y2 - y1) * t} r={8} fill={col} />;
    });
  return (
    <SceneWrap from={SCENE.panne} to={SCENE.end}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={220} y1={800} x2={420} y2={640} stroke={off > 0.5 ? K.red : K.blue} strokeWidth={6} strokeDasharray="12 12" opacity={0.6} />
        {off < 0.5 && flow(220, 800, 420, 640, 4, K.blue, 22)}
        <line x1={660} y1={640} x2={830} y2={760} stroke={K.green} strokeWidth={6} strokeDasharray="12 12" opacity={0.6} />
        {flow(660, 640, 830, 760, 4, K.green, 20)}
      </svg>
      {off > 0.5 && (
        <div style={{ position: "absolute", left: 286, top: 690, width: 56, height: 56, borderRadius: 28, background: K.red, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(f, E.fail + 4, 10, 220)})`, boxShadow: "0 8px 18px rgba(198,40,40,.4)" }}>
          <Icon name="x-lg" size={30} color="#fff" />
        </div>
      )}
      {/* copie du site */}
      <Pop at={SCENE.panne + 2} style={{ position: "absolute", left: 300, top: 488, width: 480 }} scale>
        <div style={{ ...card, height: 150, display: "flex", alignItems: "center", gap: 18, padding: "0 24px" }}>
          <div style={{ width: 92, height: 92, borderRadius: 26, background: `linear-gradient(135deg, #ffad5a, ${K.orange2})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="cloud-check-fill" size={52} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: K.ink }}>Copie du site</div>
            <div style={{ display: "inline-block", fontSize: 21, fontWeight: 600, color: K.green, background: "#e6f4ea", borderRadius: 14, padding: "2px 12px", marginTop: 6 }}>complète</div>
          </div>
        </div>
      </Pop>
      {/* le serveur */}
      <div style={{ position: "absolute", left: 70, top: 780, transform: f >= E.fail && f < E.fail + 12 ? `translateX(${Math.sin((f - E.fail) * 2.4) * 8 * (1 - (f - E.fail) / 12)}px)` : undefined }}>
        <div style={{ position: "relative", width: 230, height: 356 }}>
          <ServerTower w={230} f={f} off={off} />
        </div>
        <div style={{ marginTop: 22, width: 300, marginLeft: -35, textAlign: "center", fontFamily: FONT }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: K.ink }}>Serveur du bureau</div>
          {off > 0.5 ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 25, fontWeight: 700, color: "#fff", background: K.red, borderRadius: 18, padding: "4px 16px", marginTop: 8, transform: `scale(${sp(f, E.fail + 4, 11, 220)})` }}>
              <Icon name="power" size={24} color="#fff" />
              En panne
            </div>
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 24, fontWeight: 600, color: K.green, marginTop: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: "#22c55e" }} />
              en ligne
            </div>
          )}
        </div>
      </div>
      {/* le téléphone : Stokara fonctionne toujours */}
      <div style={{ position: "absolute", left: 672, top: 690, transform: `translateX(${(1 - ph) * 420}px) rotate(${(1 - ph) * 8}deg)`, opacity: interpolate(ph, [0, 0.3], [0, 1], clamp) }}>
        <Phone w={300} src="stokara/caps/mob-home.jpg" scroll={interpolate(f, [E.ok - 10, E.ok + 20], [0, 150], clamp)} style={{ position: "relative" }}>
          {f >= E.ok && (
            <div style={{ position: "absolute", left: 14, right: 14, top: 260, borderRadius: 18, background: K.green, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 22, padding: "14px 10px", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", boxShadow: "0 12px 26px rgba(21,128,61,.45)", transform: `scale(${okP})`, opacity: okP }}>
              <Icon name="check-circle-fill" size={30} color="#fff" />
              Rien n'est coupé
            </div>
          )}
        </Phone>
      </div>
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
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 420, top: 690 - 420, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,255,255,.5) 40%, transparent 70%)", opacity: p }} />
      <div style={{ position: "absolute", left: 540 - 500, top: 690 - 500, width: 1000, height: 1000, opacity: 0.18 * p, transform: `rotate(${rays}deg)`, background: `repeating-conic-gradient(from 0deg, ${K.orange} 0deg 6deg, transparent 6deg 30deg)`, WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 65%)", maskImage: "radial-gradient(circle, #000 0%, transparent 65%)" }} />
      <div style={{ position: "absolute", left: 540 - 150, top: 400, transform: `scale(${p}) rotate(${(1 - p) * -25}deg)` }}>
        <Logo size={300} style={{ filter: "drop-shadow(0 26px 40px rgba(26,35,126,.35))" }} />
      </div>
      <Pop at={SCENE.end + 8} style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 128, fontWeight: 700, color: K.navy, letterSpacing: -2, lineHeight: 1 }}>Stokara</div>
      </Pop>
      <Pop at={SCENE.end + 18} style={{ position: "absolute", left: 40, right: 40, top: 880, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 56, fontWeight: 600, color: K.ink, lineHeight: 1.15 }}>
          Votre serveur,{" "}
          <span style={{ background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontWeight: 700 }}>accessible partout.</span>
        </div>
      </Pop>
      <Pop at={E.pro} style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center" }} scale>
        <div style={{ ...card, borderRadius: 40, padding: "14px 32px", display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 600, color: K.ink }}>
          <Icon name="building" size={36} color={K.blue} />
          <span>
            Entreprises dès <b style={{ color: K.navy, fontSize: 44 }}>15 €</b>/mois
          </span>
        </div>
      </Pop>
      <Pop at={SCENE.end + 26} style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center" }} scale>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 50px", borderRadius: 60, background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, color: "#fff", fontFamily: FONT, fontSize: 44, fontWeight: 700, boxShadow: "0 18px 40px rgba(249,135,26,.45)", transform: `scale(${cta})` }}>
          Créer mon compte
          <Icon name="arrow-right" size={38} color="#fff" />
        </div>
      </Pop>
      <Pop at={SCENE.end + 32} style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: FONT }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: 42, fontWeight: 600, color: K.blue }}>
          <Icon name="globe2" size={36} color={K.blue} />
          stokara.entrelyo.fr
        </div>
      </Pop>
      <Pop at={SCENE.end + 40} style={{ position: "absolute", left: 0, right: 0, top: 1410, display: "flex", justifyContent: "center" }}>
        <QylineBadge />
      </Pop>
    </AbsoluteFill>
  );
};
