// Scènes de la publicité Stokara (1080 × 1920). Toutes les images sont absolues (repères E de timing.ts).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { IconName } from "../stokara/icons";
import { QylineBadge, WIN } from "../stokara/ui";
import { CK, FONT, FileKind, FileTile, Icon, K, Logo, Phone, Pointer, Pop, SceneWrap, clamp, cursorAt, lin, sp, useF } from "./kit";
import { E, SCENE } from "./timing";
import { ContextMenu, DLG, DLG_FINISH, Explorer, MENU_PICK, MapDialog, SH, SW, Taskbar, Wallpaper, menuItemY, navPt } from "./win";

const card: React.CSSProperties = { background: "rgba(255,255,255,.94)", borderRadius: 30, boxShadow: "0 24px 50px rgba(26,35,126,.16), 0 4px 12px rgba(26,35,126,.08)", boxSizing: "border-box" };

// ====================================================================== 1-2. Accroche et glisser-déposer
// L'ordinateur (seul endroit où sont les documents) puis la fenêtre de Stokara où on les dépose.
const MON = { w: 736, h: 476, bez: 16 };
const DOCS: { name: string; kind: FileKind }[] = [
  { name: "Métré cuisine.pdf", kind: "pdf" },
  { name: "Photo îlot central.jpg", kind: "jpg" },
  { name: "Visite du 5 novembre.mp4", kind: "mp4" },
  { name: "Planning.xlsx", kind: "xlsx" },
  { name: "Contrat.docx", kind: "docx" },
  { name: "Factures 2026.pdf", kind: "pdf" },
  { name: "Photos vacances.jpg", kind: "jpg" },
  { name: "Budget.xlsx", kind: "xlsx" },
  { name: "Courrier.docx", kind: "docx" },
  { name: "Assurance.pdf", kind: "pdf" },
];
const TILE = { x0: 24 + 22, dx: 126, y: 22 + 42, size: 84 };
const monState = (f: number) => {
  const m = lin(f, E.s2, E.s2 + 22);
  return { m, s: 1 - 0.58 * m, top: 560 + (1128 - 560) * m };
};
const tileCenter = (i: number, f: number): [number, number] => {
  const { s, top } = monState(f);
  const lx = MON.bez + TILE.x0 + i * TILE.dx + TILE.size / 2;
  const ly = MON.bez + TILE.y + (TILE.size * 1.18) / 2;
  return [540 + (lx - MON.w / 2) * s, top + ly * s];
};

const Monitor: React.FC<{ f: number }> = ({ f }) => {
  const { s, top } = monState(f);
  const shake = (i: number) => {
    const t = f - E.jiggle;
    if (t < 0 || t > 26) return 0;
    return Math.sin(t * 1.7 + i * 1.3) * 7 * (1 - t / 26);
  };
  const sel = f >= E.grab - 2;
  const dragging = f >= E.grab + 3;
  return (
    <div style={{ position: "absolute", left: 540 - MON.w / 2, top, width: MON.w, transform: `scale(${s})`, transformOrigin: "50% 0" }}>
      <div style={{ position: "relative", width: MON.w, height: MON.h, borderRadius: 26, background: "#1d2333", padding: MON.bez, boxSizing: "border-box", boxShadow: "0 36px 70px rgba(21,28,60,.35)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 12, overflow: "hidden" }}>
          <Wallpaper />
          <div style={{ position: "absolute", left: 24, top: 22, width: 656, height: 360, background: "#fff", borderRadius: 10, boxShadow: "0 16px 40px rgba(0,0,0,.4)", fontFamily: WIN, overflow: "hidden" }}>
            <div style={{ height: 30, background: "#eef1f6", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 14, color: "#1b1b1b" }}>
              <Icon name="folder-fill" size={15} color={K.folder} /> Documents
              <span style={{ marginLeft: "auto", letterSpacing: 18, fontSize: 13 }}>─ ☐ ✕</span>
            </div>
            {DOCS.map((d, i) => (
              <div key={d.name} style={{ position: "absolute", left: TILE.x0 - 24 - 8, top: TILE.y - 22 - 8, transform: `translate(${(i % 5) * TILE.dx + shake(i)}px, ${Math.floor(i / 5) * 146 + Math.abs(shake(i)) * -0.5}px)`, width: TILE.size + 16, padding: 8, borderRadius: 8, background: sel && i < 3 ? "#cce4f7" : "transparent", opacity: dragging && i < 3 ? 0.35 : 1 }}>
                <FileTile kind={d.kind} size={TILE.size} />
                <div style={{ fontSize: 13, color: "#1b1b1b", textAlign: "center", marginTop: 8, lineHeight: 1.2 }}>{d.name}</div>
              </div>
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, borderTop: "1px solid #e5e5e5", fontSize: 12, color: "#5d5d5d", display: "flex", alignItems: "center", padding: "0 12px" }}>10 élément(s){sel ? " · 3 sélectionné(s)" : ""}</div>
          </div>
          <Taskbar />
        </div>
      </div>
      <div style={{ width: 130, height: 56, margin: "0 auto", background: "linear-gradient(#2a3147, #1d2333)", clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }} />
      <div style={{ width: 320, height: 16, margin: "0 auto", borderRadius: 8, background: "#1d2333" }} />
    </div>
  );
};

// Fenêtre du navigateur avec les vraies captures de Stokara (1600 × 860 px CSS) et une caméra
const BR = { x: 30, y: 498, w: 1020, bar: 50 };
const VW = BR.w;
const VH = (BR.w * 860) / 1600;
const S0 = BR.w / 1600;
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

const UPLOADS = [
  { name: "Métré cuisine.pdf", icon: "file-earmark-pdf-fill" as IconName, color: "#e03131" },
  { name: "Photo îlot central.jpg", icon: "file-earmark-image-fill" as IconName, color: "#1c7ed6" },
  { name: "Visite du 5 novembre.mp4", icon: "file-earmark-play-fill" as IconName, color: K.violet },
];
// Panneau d'import animé (même aspect que celui de Stokara, coordonnées des captures 1600 × 860)
const UploadPanel: React.FC<{ f: number }> = ({ f }) => {
  if (f < E.drop) return null;
  const done = f >= E.done;
  const o = lin(f, E.drop, E.drop + 5);
  return (
    <div style={{ position: "absolute", left: 1190, top: 640, width: 398, height: 208, borderRadius: 14, overflow: "hidden", background: "#fff", boxShadow: "0 18px 40px rgba(21,28,60,.25)", fontFamily: FONT, opacity: o, transform: `translateY(${(1 - o) * 20}px)` }}>
      <div style={{ height: 50, background: done ? `linear-gradient(90deg, ${K.green}, #2f9e44)` : `linear-gradient(90deg, ${K.navy}, ${K.blue})`, color: "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 16px", fontSize: 16, fontWeight: 600 }}>
        <Icon name={done ? "check-circle-fill" : "cloud-arrow-up-fill"} size={17} color="#fff" />
        {done ? "Import terminé — 3 fichier(s)" : "Import en cours — 3 fichier(s)"}
      </div>
      {UPLOADS.map((u, i) => {
        const p = lin(f, E.drop + 3 + i * 2, E.done - (2 - i) * 2);
        const fin = p >= 1;
        return (
          <div key={u.name} style={{ height: 52, padding: "0 16px", borderBottom: i < 2 ? `1px solid ${K.line}` : "none", display: "flex", flexDirection: "column", justifyContent: "center", gap: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 15, color: K.ink }}>
              <Icon name={u.icon} size={15} color={u.color} />
              {u.name}
              <span style={{ marginLeft: "auto", fontSize: 13, color: fin ? K.green : K.ink3, fontWeight: fin ? 600 : 400 }}>{fin ? "terminé" : `${Math.round(p * 100)} %`}</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: K.line }}>
              <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 2, background: fin ? K.green : `linear-gradient(90deg, ${K.blue}, ${K.orange})` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Browser: React.FC<{ f: number }> = ({ f }) => {
  const p = sp(f, E.s2 + 6, 16, 150);
  const shots: [number, string][] = [
    [0, "ex-dupont"],
    [E.over, "ex-drop"],
    [E.drop, "ex-upload"],
    [E.done, "ex-upload-done"],
  ];
  let i = 0;
  shots.forEach(([t], j) => {
    if (f >= t) i = j;
  });
  const fade = i > 0 ? lin(f, shots[i][0], shots[i][0] + 4) : 1;
  const cam = camAt(
    [
      { t: 0, cx: 800, cy: 430, z: 1 },
      { t: E.over - 4, cx: 942, cy: 523, z: 1.28, d: 12 },
    ],
    f,
    1600,
    860,
  );
  const img = (s: string, o: number) => <Img key={s} src={staticFile(`stokara/caps/${s}.jpg`)} style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 860, opacity: o }} />;
  return (
    <div style={{ position: "absolute", left: BR.x, top: BR.y, width: BR.w, height: BR.bar + VH, borderRadius: 22, background: "#fff", overflow: "hidden", boxShadow: "0 40px 90px rgba(26,35,126,.3), 0 6px 18px rgba(26,35,126,.12)", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * -120}px) scale(${0.9 + 0.1 * p})` }}>
      <div style={{ height: BR.bar, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", background: "#f6f7fb", borderBottom: `1px solid ${K.line}`, fontFamily: FONT }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#eceff6", borderRadius: 18, padding: "7px 16px", fontSize: 20, color: K.ink }}>
          <Icon name="lock-fill" size={16} color={K.green} />
          stokara.entrelyo.fr
        </div>
      </div>
      <div style={{ position: "relative", width: VW, height: VH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1600, height: 860, transformOrigin: "0 0", transform: `translate(${VW / 2}px, ${VH / 2}px) scale(${S0 * cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)` }}>
          {i > 0 && fade < 1 && img(shots[i - 1][1], 1)}
          {img(shots[i][1], fade)}
        </div>
      </div>
    </div>
  );
};

const DEVICES: { icon: IconName; label: string; x: number }[] = [
  { icon: "laptop-fill", label: "Portable", x: 220 },
  { icon: "house-fill", label: "Maison", x: 540 },
  { icon: "phone-fill", label: "Téléphone", x: 860 },
];
const Lonely: React.FC<{ f: number }> = ({ f }) => {
  const o = 1 - lin(f, E.s2, E.s2 + 8);
  if (o <= 0) return null;
  const bad = sp(f, E.lonely, 12, 200);
  const red = f >= E.lonely;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {DEVICES.map((d) => (
          <line key={d.label} x1={540} y1={1118} x2={d.x} y2={1186} stroke={red ? K.red : K.ink3} strokeWidth={5} strokeDasharray="10 12" strokeDashoffset={-f * 1.5} opacity={red ? 0.85 : 0.5} />
        ))}
      </svg>
      {DEVICES.map((d) => (
        <div key={d.label} style={{ position: "absolute", left: d.x - 64, top: 1186, width: 128, textAlign: "center" }}>
          <div style={{ position: "relative", width: 112, height: 112, margin: "0 auto", borderRadius: 56, background: "#fff", boxShadow: "0 14px 30px rgba(26,35,126,.16)", display: "flex", alignItems: "center", justifyContent: "center", opacity: red ? 0.75 : 1 }}>
            <Icon name={d.icon} size={52} color={K.ink3} />
            {red && (
              <div style={{ position: "absolute", right: -8, top: -8, width: 46, height: 46, borderRadius: 23, background: K.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bad})`, boxShadow: "0 6px 14px rgba(198,40,40,.4)" }}>
                <Icon name="x-lg" size={24} color="#fff" />
              </div>
            )}
          </div>
          <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 500, color: K.ink2, marginTop: 8 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
};

const LockBadge: React.FC<{ f: number }> = ({ f }) => {
  const o = 1 - lin(f, E.s2, E.s2 + 6);
  if (f < E.jiggle || o <= 0) return null;
  const p = sp(f, E.jiggle, 10, 220);
  return (
    <div style={{ position: "absolute", left: 540 + MON.w / 2 - 50, top: 530, width: 84, height: 84, borderRadius: 42, background: `linear-gradient(135deg, #e5484d, ${K.red})`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p}) rotate(${(1 - p) * -40}deg)`, opacity: o, boxShadow: "0 12px 26px rgba(198,40,40,.45)" }}>
      <Icon name="lock-fill" size={40} color="#fff" />
    </div>
  );
};

// Pile de fichiers glissée de l'ordinateur vers Stokara
const DragStack: React.FC<{ f: number; keys: CK[] }> = ({ f, keys }) => {
  if (f < E.grab + 3 || f > E.drop + 10) return null;
  const cur = cursorAt(keys, f);
  const gone = lin(f, E.drop, E.drop + 9);
  return (
    <>
      {[0, 1, 2].map((i) => {
        const q = lin(f, E.grab + 3 + i * 2, E.grab + 14 + i * 2);
        const [sx, sy] = tileCenter(i, f);
        const tx = cur[0] + 40 + i * 16;
        const ty = cur[1] + 30 + i * 12;
        const x = sx + (tx - sx) * q;
        const y = sy + (ty - sy) * q;
        const size = 84 * (0.42 + 0.9 * q) * (1 - 0.7 * gone);
        return (
          <div key={i} style={{ position: "absolute", left: x - size / 2, top: y - (size * 1.18) / 2, transform: `rotate(${(i - 1) * 8 * q}deg)`, opacity: 1 - gone, filter: "drop-shadow(0 14px 18px rgba(21,28,60,.25))" }}>
            <FileTile kind={DOCS[i].kind} size={size} />
          </div>
        );
      })}
      {f >= E.grab + 12 && (
        <div style={{ position: "absolute", left: cur[0] + 118, top: cur[1] + 6, width: 50, height: 50, borderRadius: 25, background: K.orange, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(f, E.grab + 12, 12, 220) * (1 - gone)})`, boxShadow: "0 8px 18px rgba(249,135,26,.45)" }}>3</div>
      )}
    </>
  );
};

// Logo de Stokara qui jaillit puis rejoint la marque en haut
const LogoBurst: React.FC<{ f: number }> = ({ f }) => {
  if (f < E.logo - 2 || f > E.logo + 36) return null;
  const p = sp(f, E.logo, 11, 180);
  const fly = lin(f, E.logo + 20, E.logo + 34);
  const x = 540 + (452 - 540) * fly;
  const y = 790 + (128 - 790) * fly;
  const size = 240 * (1 - 0.81 * fly);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${p})`, opacity: 1 - lin(f, E.logo + 28, E.logo + 34) }}>
      <div style={{ position: "absolute", inset: -size * 0.35, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,255,255,.6) 45%, transparent 70%)", opacity: 1 - fly }} />
      <Logo size={size} style={{ position: "relative", filter: "drop-shadow(0 18px 30px rgba(26,35,126,.35))" }} />
    </div>
  );
};

export const ActUpload: React.FC = () => {
  const f = useF();
  const t1 = tileCenter(1, E.grab);
  const keys: CK[] = [
    { t: E.grab - 14, p: [830, 1330] },
    { t: E.grab, p: t1, click: "l", d: 12 },
    { t: E.drop, p: [500, 760], d: E.drop - E.grab - 6 },
  ];
  return (
    <SceneWrap from={SCENE.hook} to={SCENE.windows}>
      <Lonely f={f} />
      {f >= E.s2 && <Browser f={f} />}
      <Monitor f={f} />
      <LockBadge f={f} />
      <div style={{ position: "absolute", left: 1040 - 398 * 1.42 - 1190 * 1.42, top: 1112 - 208 * 1.42 - 640 * 1.42, transform: "scale(1.42)", transformOrigin: "0 0" }}>
        <UploadPanel f={f} />
      </div>
      <DragStack f={f} keys={keys} />
      <Pointer keys={keys} from={E.grab - 16} to={E.drop + 12} />
      <LogoBurst f={f} />
    </SceneWrap>
  );
};

// ====================================================================== 3. Lecteur réseau dans Windows
const SCR = { x: 40, y: 486, w: 1000 };
const KW = SCR.w / SW;
const URL = "https://stokara.entrelyo.fr/api/dav/";
export const ActWindows: React.FC = () => {
  const f = useF();
  const p = sp(f, E.s3 + 2, 16, 160);
  const ce = navPt("Ce PC");
  const menu = { x: ce[0] + 44, y: ce[1] - 12 };
  const pickPt: [number, number] = [menu.x + 120, menu.y + menuItemY(MENU_PICK)];
  const sPt = navPt("S");
  const keys: CK[] = [
    { t: E.s3 + 8, p: [470, 420] },
    { t: E.rclick, p: ce, click: "r", d: 14 },
    { t: E.hover, p: pickPt, d: 10 },
    { t: E.pick, p: pickPt, click: "l", d: 2 },
    { t: E.finish, p: DLG_FINISH, click: "l", d: 12 },
    { t: E.disk, p: [sPt[0] + 30, sPt[1] + 4], d: 12 },
  ];
  const menuP = f >= E.rclick ? lin(f, E.rclick, E.rclick + 5) * (1 - lin(f, E.pick + 2, E.pick + 6)) : 0;
  const dlgP = f >= E.pick + 3 ? lin(f, E.pick + 3, E.pick + 8) * (1 - lin(f, E.finish + 3, E.finish + 8)) : 0;
  const typeA = E.pick + 7;
  const typeB = E.finish - 7;
  const typed = URL.slice(0, Math.round(interpolate(f, [typeA, typeB], [0, URL.length], clamp)));
  const mapped = f >= E.drive;
  const cam = camAt(
    [
      { t: 0, cx: SW / 2, cy: SH / 2, z: 1 },
      { t: E.rclick - 10, cx: 250, cy: 360, z: 1.32, d: 12 },
      { t: E.pick + 2, cx: DLG.x + DLG.w / 2, cy: DLG.y + DLG.h / 2, z: 1.22, d: 10 },
      { t: E.drive - 2, cx: SW / 2, cy: SH / 2, z: 1, d: 10 },
      { t: E.disk - 4, cx: 230, cy: 300, z: 1.4, d: 12 },
    ],
    f,
    SW,
    SH,
  );
  const navHl = mapped ? 0.55 + 0.45 * Math.sin((f - E.disk) / 3) * (f >= E.disk ? 1 : 0) : 0;
  const toast = sp(f, E.drive + 4, 13, 200);
  return (
    <SceneWrap from={SCENE.windows} to={SCENE.where}>
      <div style={{ position: "absolute", left: SCR.x, top: SCR.y, width: SCR.w, height: SH * KW, borderRadius: 26, border: "10px solid #1d2333", boxSizing: "content-box", marginLeft: -10, marginTop: -10, overflow: "hidden", boxShadow: "0 40px 90px rgba(21,28,60,.4)", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * 160}px) scale(${0.9 + 0.1 * p})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transformOrigin: "0 0", transform: `scale(${KW})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transformOrigin: "0 0", transform: `translate(${SW / 2}px, ${SH / 2}px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)` }}>
            <Wallpaper />
            <Explorer view={mapped ? "s" : "pc"} mapped={mapped} folderIn={(f - E.drive - 2) / 3} navHl={navHl} />
            {menuP > 0 && <ContextMenu x={menu.x} y={menu.y} hl={f >= E.hover ? MENU_PICK : -1} p={menuP} />}
            {dlgP > 0 && <MapDialog typed={typed} caret={f < typeB + 2 && Math.floor(f / 8) % 2 === 0} p={dlgP} finishHl={f >= E.finish - 4} />}
            <Taskbar />
            <Pointer keys={keys} from={E.s3 + 6} to={E.s4 + 10} size={0.85} />
          </div>
        </div>
      </div>
      {f >= E.drive + 3 && (
        <div style={{ position: "absolute", right: 36, top: SCR.y - 30, display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 40, padding: "12px 26px 12px 14px", boxShadow: "0 16px 34px rgba(26,35,126,.25)", fontFamily: FONT, transform: `scale(${toast})`, transformOrigin: "100% 50%" }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: K.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check-lg" size={26} color="#fff" />
          </div>
          <span style={{ fontSize: 30, fontWeight: 600, color: K.ink }}>
            Lecteur <b style={{ color: K.blue }}>S:</b> connecté
          </span>
        </div>
      )}
    </SceneWrap>
  );
};

// ====================================================================== 4. Serveur local ou site, accessible partout
const Option: React.FC<{ at: number; top: number; icon: IconName; grad: string; title: string; sub: string }> = ({ at, top, icon, grad, title, sub }) => (
  <Pop at={at} style={{ position: "absolute", left: 40, top, width: 580 }} dy={50}>
    <div style={{ ...card, height: 232, padding: "30px 30px", display: "flex", gap: 24, alignItems: "center" }}>
      <div style={{ width: 104, height: 104, flex: "none", borderRadius: 28, background: grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 24px rgba(26,35,126,.25)" }}>
        <Icon name={icon} size={54} color="#fff" />
      </div>
      <div style={{ fontFamily: FONT }}>
        <div style={{ fontSize: 42, fontWeight: 700, color: K.ink, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 27, color: K.ink2, marginTop: 8, lineHeight: 1.3 }}>{sub}</div>
      </div>
    </div>
  </Pop>
);
export const ActWhere: React.FC = () => {
  const f = useF();
  const ph = sp(f, E.s4 + 4, 16, 140);
  const ring = f >= E.everywhere ? (f - E.everywhere) % 30 : -1;
  const dev: { icon: IconName; label: string }[] = [
    { icon: "display-fill", label: "Bureau" },
    { icon: "house-fill", label: "Maison" },
    { icon: "phone-fill", label: "Mobile" },
  ];
  const line = (y1: number, at: number) => {
    const o = lin(f, at, at + 8);
    return <path d={`M 620 ${y1} C 660 ${y1}, 640 900, 680 900`} stroke={K.blue} strokeWidth={5} fill="none" strokeDasharray="4 12" strokeLinecap="round" strokeDashoffset={-f * 2} opacity={o * 0.7} />;
  };
  return (
    <SceneWrap from={SCENE.where} to={SCENE.team}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {line(626, E.server)}
        {line(950, E.site)}
      </svg>
      <Option at={E.server - 6} top={510} icon="hdd-stack-fill" grad={`linear-gradient(135deg, ${K.blue}, ${K.navy})`} title="Serveur local" sub="Vos fichiers restent chez vous" />
      <Pop at={E.site - 9} style={{ position: "absolute", left: 290, top: 758, width: 80 }} scale>
        <div style={{ width: 80, height: 50, borderRadius: 25, background: K.orange, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px rgba(249,135,26,.4)" }}>ou</div>
      </Pop>
      <Option at={E.site - 4} top={834} icon="cloud-check-fill" grad={`linear-gradient(135deg, #ffad5a, ${K.orange2})`} title="Sur le site" sub="Chiffré, hébergé en France" />
      <Pop at={E.everywhere - 4} style={{ position: "absolute", left: 40, top: 1100, width: 580 }} dy={50}>
        <div style={{ ...card, height: 200, padding: "22px 20px", display: "flex", justifyContent: "space-around", alignItems: "center", background: `linear-gradient(135deg, ${K.navy}, ${K.blue})` }}>
          {dev.map((d, i) => {
            const q = sp(f, E.everywhere + i * 4, 12, 200);
            return (
              <div key={d.label} style={{ textAlign: "center", fontFamily: FONT, transform: `scale(${0.5 + 0.5 * q})`, opacity: q }}>
                <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto", borderRadius: 48, background: "rgba(255,255,255,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={d.icon} size={46} color="#fff" />
                  <div style={{ position: "absolute", right: -6, bottom: -6, width: 38, height: 38, borderRadius: 19, background: K.green, border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="check-lg" size={20} color="#fff" />
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 600, color: "#fff", marginTop: 10 }}>{d.label}</div>
              </div>
            );
          })}
        </div>
      </Pop>
      <div style={{ position: "absolute", left: 664, top: 506, transform: `translateX(${(1 - ph) * 500}px) rotate(${(1 - ph) * 8}deg)`, opacity: interpolate(ph, [0, 0.3], [0, 1], clamp) }}>
        {ring >= 0 && <div style={{ position: "absolute", left: 190 - ring * 9, top: 395 - ring * 9, width: ring * 18, height: ring * 18, borderRadius: "50%", border: `5px solid ${K.orange}`, opacity: 1 - ring / 30 }} />}
        <Phone w={352} src="stokara/caps/mob-home.jpg" scroll={interpolate(f, [E.everywhere, E.everywhere + 30], [0, 120], { ...clamp })} style={{ position: "relative" }} />
      </div>
    </SceneWrap>
  );
};

// ====================================================================== 5. Entreprises : plusieurs comptes, un serveur
type Acc = { ini: string; name: string; role: string; color: string; ok: string[]; no?: string; admin?: boolean };
const ACCOUNTS: Acc[] = [
  { ini: "MD", name: "Marc Durand", role: "Administrateur", color: K.navy, ok: ["Tous les dossiers"], admin: true },
  { ini: "SL", name: "Sophie Laurent", role: "Commerciale", color: K.pink, ok: ["Clients", "Commercial"], no: "Comptabilité" },
  { ini: "KB", name: "Karim Benali", role: "Chantiers", color: K.orange, ok: ["Clients", "Photos chantier"], no: "Comptabilité" },
  { ini: "JP", name: "Julie Petit", role: "Comptabilité", color: K.teal, ok: ["Comptabilité", "Commun"], no: "Commercial" },
];
const ACC_TOP = 656;
const ACC_H = 150;
const ACC_GAP = 16;
const Chip: React.FC<{ ok: boolean; label: string; at: number }> = ({ ok, label, at }) => {
  const f = useF();
  const q = sp(f, at, 13, 220);
  if (f < at - 1) return null;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 42, padding: "0 16px", borderRadius: 21, fontFamily: FONT, fontSize: 23, fontWeight: 500, background: ok ? "#e6f4ea" : "#eef0f5", color: ok ? K.green : K.ink3, border: `1.5px solid ${ok ? "#b7dfc2" : K.line}`, transform: `scale(${0.6 + 0.4 * q})`, opacity: q, textDecoration: ok ? "none" : "line-through" }}>
      <Icon name={ok ? "check-lg" : "lock-fill"} size={19} color={ok ? K.green : K.ink3} />
      {label}
    </div>
  );
};
export const ActTeam: React.FC = () => {
  const f = useF();
  const trunk = lin(f, E.accounts - 4, E.accounts + 16);
  const pulse = f >= E.same ? (f - E.same) / 18 : -1;
  const lastY = ACC_TOP + 3 * (ACC_H + ACC_GAP) + ACC_H / 2;
  const glow = f >= E.same ? 0.5 + 0.5 * Math.sin((f - E.same) / 3) : 0;
  return (
    <SceneWrap from={SCENE.team} to={SCENE.price}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={`M 190 556 L 66 556 L 66 ${lastY}`} stroke={K.blue} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - trunk} opacity={0.55} />
        {ACCOUNTS.map((_, i) => {
          const y = ACC_TOP + i * (ACC_H + ACC_GAP) + ACC_H / 2;
          const o = lin(f, E.accounts + i * 4, E.accounts + i * 4 + 6);
          return <line key={i} x1={66} y1={y} x2={104} y2={y} stroke={K.blue} strokeWidth={6} strokeLinecap="round" opacity={0.55 * o} />;
        })}
        {pulse >= 0 &&
          pulse <= 1.2 &&
          ACCOUNTS.map((_, i) => {
            const y = ACC_TOP + i * (ACC_H + ACC_GAP) + ACC_H / 2;
            const t = Math.min(1, pulse * (1 + i * 0.25));
            const py = 556 + (y - 556) * t;
            return <circle key={i} cx={t < 0.95 ? 66 : 66 + (t - 0.95) * 760} cy={py} r={11} fill={K.orange} opacity={1 - Math.max(0, pulse - 1) * 5} />;
          })}
      </svg>
      <Pop at={E.s5 + 4} style={{ position: "absolute", left: 190, top: 500, width: 700 }} scale>
        <div style={{ ...card, height: 112, padding: "0 26px", display: "flex", alignItems: "center", gap: 20, boxShadow: `0 24px 50px rgba(26,35,126,.16), 0 0 0 ${glow * 6}px rgba(249,135,26,${glow * 0.6})` }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${K.blue}, ${K.navy})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="hdd-stack-fill" size={38} color="#fff" />
          </div>
          <div style={{ fontFamily: FONT }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: K.ink }}>Serveur de l'entreprise</div>
            <div style={{ fontSize: 23, color: K.ink2 }}>Un seul serveur pour toute l'équipe</div>
          </div>
        </div>
      </Pop>
      {ACCOUNTS.map((a, i) => (
        <Pop key={a.ini} at={E.accounts + i * 4} style={{ position: "absolute", left: 108, top: ACC_TOP + i * (ACC_H + ACC_GAP), width: 934 }} dy={0}>
          <div style={{ ...card, borderRadius: 26, height: ACC_H, padding: "0 24px", display: "flex", alignItems: "center", gap: 22, transform: `translateX(${(1 - sp(f, E.accounts + i * 4, 15, 160)) * 120}px)` }}>
            <div style={{ width: 86, height: 86, flex: "none", borderRadius: 43, background: a.color, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px rgba(21,28,60,.2)" }}>{a.ini}</div>
            <div style={{ fontFamily: FONT, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 600, color: K.ink }}>{a.name}</span>
                <span style={{ fontSize: 22, color: K.ink3 }}>{a.role}</span>
                {a.admin && <span style={{ marginLeft: "auto", fontSize: 19, fontWeight: 600, color: "#fff", background: K.blue, borderRadius: 14, padding: "3px 12px" }}>Admin</span>}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {a.ok.map((c, j) => (
                  <Chip key={c} ok label={c} at={E.access + i * 3 + j * 2} />
                ))}
                {a.no && <Chip ok={false} label={a.no} at={E.access + i * 3 + a.ok.length * 2} />}
              </div>
            </div>
          </div>
        </Pop>
      ))}
    </SceneWrap>
  );
};

// ====================================================================== 6. Tarifs
const Feature: React.FC<{ at: number; label: string; dark?: boolean; hl?: boolean }> = ({ at, label, dark, hl }) => {
  const f = useF();
  const q = sp(f, at, 13, 220);
  if (f < at - 1) return null;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 46, padding: "0 18px", borderRadius: 23, fontFamily: FONT, fontSize: 24, fontWeight: hl ? 700 : 500, background: hl ? K.orange : dark ? "rgba(255,255,255,.14)" : "#f1f3fa", color: hl || dark ? "#fff" : K.ink2, transform: `scale(${0.6 + 0.4 * q})`, opacity: q }}>
      <Icon name={hl ? "cloud-check-fill" : "check-lg"} size={21} color={hl || dark ? "#fff" : K.green} />
      {label}
    </div>
  );
};
const Price: React.FC<{ at: number; from?: boolean; value: string; dark?: boolean }> = ({ at, from, value, dark }) => {
  const f = useF();
  const q = sp(f, at, 9, 210);
  return (
    <div style={{ textAlign: "right", fontFamily: FONT, color: dark ? "#fff" : K.navy, transform: `scale(${f < at ? 0.001 : 0.4 + 0.6 * q})`, transformOrigin: "100% 60%", opacity: f < at ? 0 : 1 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: 10 }}>
        {from && <span style={{ fontSize: 34, fontWeight: 500, opacity: 0.85 }}>dès</span>}
        <span style={{ fontSize: 132, fontWeight: 700, lineHeight: 0.95, letterSpacing: -3 }}>{value}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 500, opacity: 0.8 }}>par mois</div>
    </div>
  );
};
export const ActPrice: React.FC = () => (
  <SceneWrap from={SCENE.price} to={SCENE.end}>
    <Pop at={E.s6 + 3} style={{ position: "absolute", left: 40, top: 500, width: 1000 }} dy={60}>
      <div style={{ ...card, height: 360, padding: "34px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: FONT }}>
            <div style={{ width: 84, height: 84, borderRadius: 24, background: `linear-gradient(135deg, #ffad5a, ${K.orange2})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Icon name="person-fill" size={46} color="#fff" />
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: K.ink }}>Particulier</div>
            <div style={{ fontSize: 26, color: K.ink2 }}>Pour vous et vos proches</div>
          </div>
          <Price at={E.p1} value="3 €" />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          <Feature at={E.go} label="20 Go en ligne" hl />
          <Feature at={E.go + 4} label="Lecteur réseau" />
          <Feature at={E.go + 7} label="Mobile" />
        </div>
      </div>
    </Pop>
    <Pop at={E.pro - 4} style={{ position: "absolute", left: 40, top: 900, width: 1000 }} dy={60}>
      <div style={{ ...card, height: 400, padding: "34px 40px", background: `linear-gradient(135deg, ${K.navy} 0%, ${K.blue} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -80, bottom: -120, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, #ffe0bd 0%, #ffad5a 26%, #f9871a 55%, #c55a06 100%)", opacity: 0.25 }} />
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          <div style={{ fontFamily: FONT }}>
            <div style={{ width: 84, height: 84, borderRadius: 24, background: "rgba(255,255,255,.16)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Icon name="building" size={44} color="#fff" />
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: "#fff" }}>Entreprise</div>
            <div style={{ fontSize: 26, color: "rgba(255,255,255,.82)" }}>De l'artisan à la PME</div>
          </div>
          <Price at={E.p2} from value="15 €" dark />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26, position: "relative" }}>
          <Feature at={E.p2 + 6} label="Plusieurs comptes" dark />
          <Feature at={E.p2 + 9} label="Droits par dossier" dark />
          <Feature at={E.p2 + 12} label="Serveur local" dark />
        </div>
      </div>
    </Pop>
  </SceneWrap>
);

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
      <div style={{ position: "absolute", left: 540 - 150, top: 420, transform: `scale(${p}) rotate(${(1 - p) * -25}deg)` }}>
        <Logo size={300} style={{ filter: "drop-shadow(0 26px 40px rgba(26,35,126,.35))" }} />
      </div>
      <Pop at={SCENE.end + 8} style={{ position: "absolute", left: 0, right: 0, top: 750, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 128, fontWeight: 700, color: K.navy, letterSpacing: -2, lineHeight: 1 }}>Stokara</div>
      </Pop>
      <Pop at={E.s7 + 18} style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 60, fontWeight: 600, color: K.ink }}>
          Vos fichiers, <span style={{ background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontWeight: 700 }}>partout.</span>
        </div>
      </Pop>
      <Pop at={SCENE.end + 22} style={{ position: "absolute", left: 0, right: 0, top: 1040, display: "flex", justifyContent: "center" }} scale>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 52px", borderRadius: 60, background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, color: "#fff", fontFamily: FONT, fontSize: 46, fontWeight: 700, boxShadow: "0 18px 40px rgba(249,135,26,.45)", transform: `scale(${cta})` }}>
          Créer mon compte
          <Icon name="arrow-right" size={40} color="#fff" />
        </div>
      </Pop>
      <Pop at={SCENE.end + 28} style={{ position: "absolute", left: 0, right: 0, top: 1200, textAlign: "center", fontFamily: FONT }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: 44, fontWeight: 600, color: K.blue }}>
          <Icon name="globe2" size={38} color={K.blue} />
          stokara.entrelyo.fr
        </div>
      </Pop>
      <Pop at={SCENE.end + 34} style={{ position: "absolute", left: 40, right: 40, top: 1300, textAlign: "center", fontFamily: FONT }}>
        <div style={{ display: "inline-block", fontSize: 30, fontWeight: 500, color: K.ink2, background: "rgba(255,255,255,.85)", borderRadius: 30, padding: "10px 26px" }}>
          Particuliers <b style={{ color: K.navy }}>3 €/mois</b> · Entreprises dès <b style={{ color: K.navy }}>15 €/mois</b>
        </div>
      </Pop>
      <Pop at={SCENE.end + 40} style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center" }}>
        <QylineBadge />
      </Pop>
    </AbsoluteFill>
  );
};
