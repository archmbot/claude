// Interfaces reconstituées pour la publicité « Installer le programme Stokara » :
// tour de serveur, pages d'administration de Stokara (textes repris de frontend/assets/admin.js),
// fenêtre de dossier Windows, contrôle de compte d'utilisateur et console d'installation
// (lignes reprises de agent/installer.ps1, version 3.1.11).
import React from "react";
import { interpolate } from "remotion";
import { IconName } from "../stokara/icons";
import { WIN } from "../stokara/ui";
import { FONT, Icon, K, Logo, clamp } from "../stokara-pub/kit";

export const ENTREPRISE = "Garage Dupont";
export const CODE = "garage-dupont";
export const DOSSIER = "D:\\Partage";

// ------------------------------------------------------------------ tour de serveur (illustration)
export const ServerTower: React.FC<{ w: number; f: number; off?: number; style?: React.CSSProperties }> = ({ w, f, off = 0, style }) => {
  const h = w * 1.55;
  const led = (i: number, col: string) => {
    const on = (Math.sin(f * 0.9 + i * 2.1) + Math.sin(f * 0.37 + i)) > -0.6;
    const c = off > 0.5 ? "#3a4058" : on ? col : "#2a3d33";
    return <div style={{ width: w * 0.035, height: w * 0.035, borderRadius: "50%", background: c, boxShadow: off > 0.5 || !on ? "none" : `0 0 ${w * 0.03}px ${col}` }} />;
  };
  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: w * 0.07, background: "linear-gradient(160deg, #3a4360 0%, #232a3f 45%, #151a2a 100%)", boxShadow: "0 40px 80px rgba(21,28,60,.4), inset 0 0 0 2px #444d6b", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: w * 0.08, right: w * 0.08, top: w * 0.08, height: w * 0.16, borderRadius: w * 0.03, background: "#1b2133", display: "flex", alignItems: "center", gap: w * 0.04, padding: `0 ${w * 0.06}px` }}>
          <div style={{ width: w * 0.09, height: w * 0.09, borderRadius: "50%", border: `${w * 0.012}px solid ${off > 0.5 ? "#555c75" : "#5ad1ff"}`, boxShadow: off > 0.5 ? "none" : "0 0 10px #5ad1ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="power" size={w * 0.05} color={off > 0.5 ? "#555c75" : "#5ad1ff"} />
          </div>
          <div style={{ flex: 1 }} />
          {led(0, "#4ade80")}
          {led(1, "#60a5fa")}
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: w * 0.08, right: w * 0.08, top: w * (0.32 + i * 0.2), height: w * 0.15, borderRadius: w * 0.025, background: "linear-gradient(#2c3450, #222842)", border: "1px solid #3c4566", display: "flex", alignItems: "center", gap: w * 0.03, padding: `0 ${w * 0.05}px` }}>
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <div key={k} style={{ width: w * 0.06, height: w * 0.012, borderRadius: 2, background: "#4a5478" }} />
            ))}
            <div style={{ flex: 1 }} />
            {led(i + 2, "#4ade80")}
          </div>
        ))}
        <div style={{ position: "absolute", left: w * 0.12, right: w * 0.12, bottom: w * 0.1, display: "flex", flexDirection: "column", gap: w * 0.025 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: w * 0.014, borderRadius: 4, background: "#2c3450" }} />
          ))}
        </div>
        {off > 0 && <div style={{ position: "absolute", inset: 0, background: "rgba(10,12,22,.55)", opacity: off }} />}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ navigateur et pages d'administration (largeur CSS 680)
export const PW = 680;
export const AdminHeader: React.FC = () => (
  <div style={{ height: 54, background: `linear-gradient(90deg, ${K.navy}, ${K.blue})`, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", fontFamily: FONT }}>
    <Logo size={32} />
    <div style={{ lineHeight: 1.05 }}>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>Stokara</div>
      <div style={{ color: "rgba(255,255,255,.75)", fontSize: 11 }}>Administration</div>
    </div>
    <div style={{ flex: 1 }} />
    {(["folder2-open", "chat-dots", "bell", "shield-lock"] as IconName[]).map((n, i) => (
      <div key={n} style={{ width: 32, height: 30, borderRadius: 8, background: i === 3 ? "#fff" : "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={n} size={14} color={i === 3 ? K.navy : "#fff"} />
      </div>
    ))}
    <div style={{ width: 30, height: 30, borderRadius: 15, background: K.orange, color: "#fff", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 4 }}>MD</div>
  </div>
);
export const PageTitle: React.FC<{ icon: IconName; title: string; sub: string }> = ({ icon, title, sub }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "16px 18px 12px", fontFamily: FONT }}>
    <div style={{ width: 44, height: 44, flex: "none", borderRadius: 12, background: `linear-gradient(135deg, ${K.blue}, ${K.navy})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={22} color="#fff" />
    </div>
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, color: K.ink }}>{title}</div>
      <div style={{ fontSize: 11.5, color: K.ink2, lineHeight: 1.35 }}>{sub}</div>
    </div>
  </div>
);
const panel: React.CSSProperties = { margin: "0 18px 12px", background: "#fff", borderRadius: 16, boxShadow: "0 6px 20px rgba(26,35,126,.08)", border: `1px solid ${K.line}`, padding: "14px 16px", fontFamily: FONT };
const H2: React.FC<{ icon: IconName; children: React.ReactNode }> = ({ icon, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15.5, fontWeight: 700, color: K.ink, marginBottom: 10 }}>
    <Icon name={icon} size={16} color={K.blue} />
    {children}
  </div>
);
const Light: React.FC<{ on: boolean; size?: number }> = ({ on, size = 12 }) => (
  <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: on ? "#22c55e" : "#b6bccb", boxShadow: on ? "0 0 0 4px rgba(34,197,94,.2)" : "none" }} />
);
const Btn: React.FC<{ icon: IconName; label: string; main?: boolean; dim?: boolean; hl?: number }> = ({ icon, label, main, dim, hl = 0 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 13px", borderRadius: 10, fontSize: 12.5, fontWeight: 600, background: main ? `linear-gradient(90deg, ${K.orange}, ${K.orange2})` : "#f1f3fa", color: main ? "#fff" : K.ink2, opacity: dim ? 0.5 : 1, boxShadow: main ? `0 6px 14px rgba(249,135,26,.35), 0 0 0 ${hl * 5}px rgba(249,135,26,${0.35 * hl})` : "none", transform: `scale(${1 - 0.06 * hl})` }}>
    <Icon name={icon} size={13} color={main ? "#fff" : K.ink2} />
    {label}
  </div>
);
const KV: React.FC<{ k: string; children: React.ReactNode }> = ({ k, children }) => (
  <div style={{ display: "flex", fontSize: 12.5, padding: "5px 0", borderBottom: `1px solid ${K.line}` }}>
    <span style={{ width: 120, color: K.ink3 }}>{k}</span>
    <span style={{ flex: 1, color: K.ink }}>{children}</span>
  </div>
);

// Administration → Serveur de fichiers (programme pas encore installé)
export const ServerPage: React.FC<{ press: number }> = ({ press }) => (
  <>
    <PageTitle icon="hdd-network" title="Serveur de fichiers" sub="Le programme Stokara installé sur votre serveur, qui garde les fichiers : état, dossiers, copie RAID, journaux." />
    <div style={panel}>
      <H2 icon="hdd-network">Programme Stokara chez {ENTREPRISE}</H2>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
        <Light on={false} size={14} />
        <b style={{ fontSize: 15, color: K.ink }}>Pas encore installé</b>
        <span style={{ fontSize: 11.5, color: K.ink3 }}>ne s'est encore jamais connecté</span>
      </div>
      <div style={{ borderRadius: 10, border: "1px solid rgba(57,73,171,.25)", background: "rgba(57,73,171,.05)", padding: "8px 12px", fontSize: 12, color: K.ink2, lineHeight: 1.45, marginBottom: 10 }}>
        Programme jamais installé : <b>téléchargez-le</b> (bouton ci-dessous), copiez le ZIP sur le serveur, clic droit → <i>Extraire tout</i>, puis double-clic sur <b>INSTALLER.bat</b>.
      </div>
      <KV k="Serveur">—</KV>
      <KV k="Version">—</KV>
      <KV k="Lecteur réseau">
        <code style={{ fontSize: 11.5, color: K.pink }}>https://stokara.entrelyo.fr/api/dav/</code>
      </KV>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <Btn icon="download" label="Télécharger le programme" main hl={press} />
        <Btn icon="wifi" label="Tester" dim />
        <Btn icon="arrow-repeat" label="Redémarrer" dim />
        <Btn icon="cloud-arrow-down-fill" label="Mettre à jour" dim />
      </div>
      <div style={{ fontSize: 11, color: K.ink3, marginTop: 8 }}>Le programme se met à jour tout seul quand le site propose une nouvelle version.</div>
    </div>
  </>
);

// Administration → Stockage des fichiers (textes de MODES, frontend/assets/admin.js)
export const MODES: { k: string; ic: IconName; t: string; d: string }[] = [
  { k: "serveur", ic: "hdd-network", t: "Sur votre serveur", d: "Les fichiers restent sur votre serveur (ou un PC toujours allumé), servis au site par le programme Stokara. Serveur éteint : fichiers inaccessibles." },
  { k: "miroir", ic: "hdd-stack", t: "Sur le serveur et sur le site", d: "Deux copies tenues identiques. Le site et le lecteur réseau travaillent sur la copie du site (instantané) ; le serveur reçoit chaque changement aussitôt. Serveur éteint : rien n'est coupé." },
  { k: "site", ic: "cloud-fill", t: "Sur le site seulement", d: "Aucun serveur ni programme : les fichiers sont gardés par le site Stokara, accessibles de partout." },
];
export const MODE_TOP = [104, 236, 380]; // haut de chaque carte (px CSS dans la page)
export const StoragePage: React.FC<{ cur: number; sel: number[] }> = ({ cur, sel }) => (
  <>
    <PageTitle icon="database-fill" title="Stockage des fichiers" sub="Où sont gardés les fichiers : sur votre serveur, sur votre serveur et sur le site (deux copies identiques), ou sur le site seulement." />
    <div style={{ ...panel, paddingBottom: 6 }}>
      <H2 icon="database-fill">Où sont gardés les fichiers</H2>
      {MODES.map((m, i) => {
        const on = sel[i] ?? 0;
        return (
          <div key={m.k} style={{ position: "relative", display: "flex", gap: 12, alignItems: "flex-start", borderRadius: 14, padding: "12px 14px", marginBottom: 10, border: `2px solid ${on > 0.5 ? K.orange : K.line}`, background: on > 0.5 ? "rgba(249,135,26,.07)" : "#fff", boxShadow: on > 0.5 ? `0 8px 20px rgba(249,135,26,.18)` : "none", transform: `scale(${1 + 0.02 * on})` }}>
            <div style={{ width: 40, height: 40, flex: "none", borderRadius: 12, background: on > 0.5 ? `linear-gradient(135deg, ${K.orange}, ${K.orange2})` : "rgba(57,73,171,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={m.ic} size={20} color={on > 0.5 ? "#fff" : K.blue} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: K.ink }}>{m.t}</div>
              <div style={{ fontSize: 12, color: K.ink2, lineHeight: 1.4, marginTop: 2 }}>{m.d}</div>
            </div>
            {cur === i && <span style={{ position: "absolute", right: 10, top: 10, fontSize: 10.5, fontWeight: 600, color: K.green, background: "#e6f4ea", borderRadius: 10, padding: "2px 8px" }}>actuel</span>}
          </div>
        );
      })}
      <div style={{ fontSize: 11, color: K.ink3, margin: "2px 2px 6px", lineHeight: 1.4 }}>Les droits des dossiers, les liens de partage, la messagerie et le lecteur réseau ne changent pas d'un stockage à l'autre.</div>
    </div>
  </>
);

// ------------------------------------------------------------------ Windows : dossier extrait, contrôle de compte, console
const W = { accent: "#005fb8", text: "#1b1b1b", sub: "#5d5d5d", line: "#e5e5e5", sel: "#cce4f7" };
export const PKG: { n: string; ic: IconName; c: string; type: string }[] = [
  { n: "INSTALLER.bat", ic: "gear-fill", c: "#6b7a90", type: "Fichier de commandes Windows" },
  { n: "PANNEAU.bat", ic: "gear-fill", c: "#6b7a90", type: "Fichier de commandes Windows" },
  { n: "DESINSTALLER.bat", ic: "gear-fill", c: "#6b7a90", type: "Fichier de commandes Windows" },
  { n: "LISEZMOI.txt", ic: "file-earmark-text-fill", c: "#6b7a90", type: "Document texte" },
  { n: "config.json", ic: "file-earmark-code-fill", c: "#c7802b", type: "Fichier JSON" },
  { n: "installer.ps1", ic: "file-earmark-code-fill", c: "#2f6fd6", type: "Script Windows PowerShell" },
  { n: "noyau.cs", ic: "file-earmark-code-fill", c: "#7c3aed", type: "Fichier C#" },
  { n: "stokara.ico", ic: "file-earmark-image-fill", c: "#2b8a3e", type: "Icône" },
];
export const FW = { x: 16, y: 16, w: 648, h: 470, row: 30, top: 32 + 34 + 30 };
export const pkgRowY = (i: number) => FW.y + FW.top + i * FW.row + FW.row / 2;
export const FolderWindow: React.FC<{ sel: number }> = ({ sel }) => (
  <div style={{ position: "absolute", left: FW.x, top: FW.y, width: FW.w, height: FW.h, background: "#fff", borderRadius: 8, boxShadow: "0 20px 50px rgba(0,0,0,.45)", overflow: "hidden", fontFamily: WIN }}>
    <div style={{ height: 32, background: "#e8ecf3", display: "flex", alignItems: "flex-end", paddingLeft: 8 }}>
      <div style={{ height: 26, padding: "0 10px", background: "#f9f9f9", borderRadius: "6px 6px 0 0", display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, color: W.text, minWidth: 190 }}>
        <Icon name="folder-fill" size={12} color={K.folder} />
        Stokara-{CODE}
        <span style={{ marginLeft: "auto", color: W.sub, fontSize: 10 }}>✕</span>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 24, padding: "0 14px 9px", color: W.text, fontSize: 12 }}>
        <span>─</span>
        <span>☐</span>
        <span>✕</span>
      </div>
    </div>
    <div style={{ height: 34, background: "#f9f9f9", borderBottom: `1px solid ${W.line}`, display: "flex", alignItems: "center", gap: 9, padding: "0 10px" }}>
      <span style={{ color: W.sub, fontSize: 13, letterSpacing: 6 }}>← → ↑</span>
      <div style={{ flex: 1, height: 24, background: "#fff", border: `1px solid ${W.line}`, borderRadius: 4, display: "flex", alignItems: "center", gap: 5, padding: "0 8px", fontSize: 11.5, color: W.text }}>
        <Icon name="folder-fill" size={11} color={K.folder} />
        <span style={{ color: W.sub }}>›</span> Téléchargements <span style={{ color: W.sub }}>›</span> Stokara-{CODE}
      </div>
    </div>
    <div style={{ display: "flex", fontSize: 10.5, color: W.sub, padding: "8px 16px 6px", borderBottom: `1px solid ${W.line}` }}>
      <span style={{ width: 300 }}>Nom</span>
      <span>Type</span>
    </div>
    {PKG.map((p, i) => (
      <div key={p.n} style={{ display: "flex", alignItems: "center", height: FW.row, margin: "0 6px", padding: "0 10px", borderRadius: 4, fontSize: 12, color: W.text, background: sel === i ? W.sel : "transparent" }}>
        <span style={{ width: 300, display: "flex", alignItems: "center", gap: 9, fontWeight: i === 0 ? 600 : 400 }}>
          <Icon name={p.ic} size={14} color={p.c} />
          {p.n}
        </span>
        <span style={{ color: W.sub, fontSize: 11 }}>{p.type}</span>
      </div>
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, borderTop: `1px solid ${W.line}`, fontSize: 10, color: W.sub, display: "flex", alignItems: "center", padding: "0 12px" }}>
      {PKG.length} élément(s){sel >= 0 ? " · 1 élément sélectionné" : ""}
    </div>
  </div>
);

export const UAC_YES: [number, number] = [340 - 70, 400];
export const Uac: React.FC<{ p: number; yesHl: boolean }> = ({ p, yesHl }) => (
  <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.45 * p})` }}>
    <div style={{ position: "absolute", left: 140, top: 150, width: 400, height: 280, background: "#fff", borderRadius: 8, boxShadow: "0 24px 60px rgba(0,0,0,.6)", fontFamily: WIN, overflow: "hidden", opacity: p, transform: `scale(${0.92 + 0.08 * p})` }}>
      <div style={{ background: "#f3f3f3", padding: "12px 18px", fontSize: 11.5, color: W.text }}>Contrôle de compte d'utilisateur</div>
      <div style={{ padding: "12px 18px" }}>
        <div style={{ fontSize: 15.5, color: W.text, lineHeight: 1.3 }}>Voulez-vous autoriser cette application à apporter des modifications à votre appareil ?</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <Icon name="terminal-fill" size={26} color="#2f5fa8" />
          <b style={{ fontSize: 13 }}>Windows PowerShell</b>
        </div>
        <div style={{ fontSize: 11, color: W.sub, marginTop: 8, lineHeight: 1.5 }}>
          Éditeur vérifié : Microsoft Windows
          <br />
          Origine du fichier : Disque dur sur cet ordinateur
        </div>
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, display: "flex", gap: 10 }}>
        <div style={{ flex: 1, height: 30, borderRadius: 4, background: W.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, boxShadow: yesHl ? "0 0 0 3px rgba(249,135,26,.8)" : "none" }}>Oui</div>
        <div style={{ flex: 1, height: 30, borderRadius: 4, background: "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, color: W.text }}>Non</div>
      </div>
    </div>
  </div>
);

// Console de INSTALLER.bat : chaque ligne apparaît à son image (at) ; « type » = saisie au clavier
export type CLine = { at: number; t: string; c?: string; type?: { at: number; to: number; text: string }; hl?: boolean; id?: string };
const C = { cyan: "#61d6d6", green: "#16c60c", gray: "#cccccc", white: "#f2f2f2", dk: "#3a96dd", yellow: "#f9f1a5" };
export const CONSOLE_COLORS = C;
export const MONO = "'Cascadia Mono', Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace";
export const CON = { x: 22, y: 22, w: 636, h: 488, line: 16, cols: 80 };
export const CON_ROWS = Math.floor((CON.h - 30 - 12) / CON.line);
// Coupe une ligne trop longue pour la console (80 colonnes), au dernier espace ; la suite est décalée
export const wrapCon = (l: CLine): CLine[] => {
  if (l.type || l.t.length <= CON.cols) return [l];
  const out: CLine[] = [];
  let rest = l.t;
  let first = true;
  while (rest.length > 0) {
    const max = first ? CON.cols : CON.cols - 7;
    let cut = rest.length <= max ? rest.length : rest.lastIndexOf(" ", max);
    if (cut <= 0) cut = max;
    out.push({ ...l, t: (first ? "" : "       ") + rest.slice(0, cut) });
    rest = rest.slice(cut).replace(/^ /, "");
    first = false;
  }
  return out;
};
export const Console: React.FC<{ f: number; lines: CLine[]; p: number }> = ({ f, lines, p }) => {
  const shown = lines.filter((l) => f >= l.at);
  const start = Math.max(0, shown.length - CON_ROWS);
  return (
    <div style={{ position: "absolute", left: CON.x, top: CON.y, width: CON.w, height: CON.h, background: "#0c0c0c", borderRadius: 8, boxShadow: "0 24px 60px rgba(0,0,0,.55)", overflow: "hidden", opacity: p, transform: `translateY(${(1 - p) * 20}px) scale(${0.96 + 0.04 * p})` }}>
      <div style={{ height: 30, background: "#1f1f1f", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontFamily: WIN, fontSize: 11, color: "#e6e6e6" }}>
        <Icon name="terminal-fill" size={12} color="#5aa0ff" />
        Administrateur : Stokara — installation du programme
        <span style={{ marginLeft: "auto", letterSpacing: 20 }}>─ ☐ ✕</span>
      </div>
      <div style={{ padding: "6px 8px", fontFamily: MONO, fontSize: 12.4, lineHeight: `${CON.line}px`, whiteSpace: "pre" }}>
        {shown.slice(start).map((l, i) => {
          let txt = l.t;
          let caret = false;
          if (l.type) {
            const n = Math.round(interpolate(f, [l.type.at, l.type.to], [0, l.type.text.length], clamp));
            txt += l.type.text.slice(0, n);
            caret = f < l.type.to + 6;
          }
          return (
            <div key={i} style={{ color: l.c ?? C.gray, background: l.hl ? "rgba(249,135,26,.22)" : "transparent", borderRadius: 3 }}>
              {txt || " "}
              {caret && <span style={{ display: "inline-block", width: 7.4, height: 14, background: C.white, verticalAlign: "-2px", opacity: Math.floor(f / 7) % 2 ? 1 : 0.2 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const consoleRowY = (row: number) => CON.y + 30 + 6 + row * CON.line + CON.line / 2;
