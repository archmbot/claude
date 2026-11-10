// Reconstitution compacte de Windows 11 pour le format vertical : Explorateur (« Ce PC », puis le
// lecteur « Stokara (S:) »), menu contextuel et assistant « Connecter un lecteur réseau ».
// Coordonnées dans un écran de SW × SH px, agrandi ensuite pour remplir la largeur de la vidéo.
import React from "react";
import { interpolate } from "remotion";
import { IconName } from "../stokara/icons";
import { Icon, K, WIN, clamp } from "../stokara/ui";

export const SW = 680;
export const SH = 580;
const W = { accent: "#005fb8", text: "#1b1b1b", sub: "#5d5d5d", line: "#e5e5e5", sel: "#cce4f7", hover: "#e5f1fb", panel: "#f3f3f3" };

export const Wallpaper: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 110%, #3d7fe0 0%, #1d4fa8 35%, #0d2a66 70%, #071a43 100%)", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -160, top: 260, width: 700, height: 460, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(120,180,255,.35), transparent 65%)" }} />
    <div style={{ position: "absolute", right: -120, top: -160, width: 600, height: 460, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(90,140,255,.3), transparent 65%)" }} />
  </div>
);

export const Taskbar: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40, background: "rgba(238,242,250,.9)", borderTop: "1px solid rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: WIN }}>
    {(["windows", "search", "folder-fill", "globe2", "envelope-fill"] as IconName[]).map((n, i) => (
      <div key={n} style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: i === 2 ? "rgba(255,255,255,.95)" : "transparent", position: "relative" }}>
        <Icon name={n} size={17} color={i === 2 ? K.folder : i === 0 ? W.accent : "#3c4a66"} />
        {i === 2 && <div style={{ position: "absolute", bottom: 1, width: 12, height: 2.5, borderRadius: 2, background: W.accent }} />}
      </div>
    ))}
    <div style={{ position: "absolute", right: 14, textAlign: "right", fontSize: 10, color: W.text, lineHeight: 1.3 }}>
      14:32
      <br />
      10/11/2026
    </div>
  </div>
);

// ------------------------------------------------------------------ Explorateur
export const EXW = { x: 14, y: 14, w: SW - 28, h: SH - 40 - 28 };
const NAV_W = 170;
const TOP = 32 + 34 + 34;
const ROW = 25;
const NAV: [IconName, string, string][] = [
  ["house-door-fill", "Accueil", "#c7802b"],
  ["file-earmark-image-fill", "Galerie", "#2b8a3e"],
  ["display", "Bureau", "#2f6fd6"],
  ["download", "Téléchargements", "#2f6fd6"],
  ["file-earmark-text-fill", "Documents", "#6b7a90"],
  ["file-earmark-image-fill", "Images", "#2f6fd6"],
  ["pc-display", "Ce PC", "#2f6fd6"],
  ["wifi", "Réseau", "#2f6fd6"],
];
const SEP_BEFORE = [2, 6];
// centre d'une entrée du volet de navigation (coordonnées de l'écran) ; "S" = Stokara (S:)
export const navPt = (label: "Ce PC" | "S"): [number, number] => {
  const i = label === "S" ? 7 : 6;
  return [EXW.x + 60, EXW.y + TOP + 8 + i * ROW + SEP_BEFORE.filter((s) => s <= Math.min(i, 6)).length * 9 + ROW / 2];
};

const Drive: React.FC<{ name: string; free: string; pct: number; icon?: IconName; hl?: number }> = ({ name, free, pct, icon = "hdd-fill", hl = 0 }) => (
  <div style={{ width: 214, height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 8px", borderRadius: 4, background: hl ? `rgba(204,228,247,${hl})` : "transparent", border: hl ? `1px solid rgba(153,201,239,${hl})` : "1px solid transparent" }}>
    <Icon name={icon} size={32} color={icon === "hdd-network-fill" ? W.accent : "#6b7a90"} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: W.text, fontWeight: icon === "hdd-network-fill" ? 600 : 400 }}>{name}</div>
      <div style={{ height: 9, background: "#e6e6e6", border: "1px solid #bcbcbc", margin: "4px 0 3px" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#26a0da" }} />
      </div>
      <div style={{ fontSize: 10, color: W.sub }}>{free}</div>
    </div>
  </div>
);

const Folder: React.FC<{ name: string; o: number }> = ({ name, o }) => (
  <div style={{ width: 104, height: 96, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, opacity: o, transform: `translateY(${(1 - o) * 14}px) scale(${0.8 + 0.2 * o})` }}>
    <Icon name="folder-fill" size={56} color={K.folder} />
    <div style={{ fontSize: 12, color: W.text, textAlign: "center" }}>{name}</div>
  </div>
);
export const S_FOLDERS = ["Clients", "Commercial", "Commun", "Photos chantier", "Utilisateurs"];

const Group: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#1e3a6e", fontWeight: 600, margin: "2px 0 6px" }}>
    <span style={{ fontSize: 9 }}>⌄</span>
    {title}
    <div style={{ flex: 1, height: 1, background: W.line }} />
  </div>
);

// view : "pc" (Ce PC) ou "s" (contenu du lecteur Stokara) ; mapped : le lecteur existe ; folderIn : apparition des dossiers (0..n)
export const Explorer: React.FC<{ view: "pc" | "s"; mapped: boolean; folderIn?: number; navHl?: number }> = ({ view, mapped, folderIn = 5, navHl = 0 }) => {
  const title = view === "pc" ? "Ce PC" : "Stokara (S:)";
  return (
    <div style={{ position: "absolute", left: EXW.x, top: EXW.y, width: EXW.w, height: EXW.h, background: "#fff", borderRadius: 8, boxShadow: "0 20px 50px rgba(0,0,0,.45)", overflow: "hidden", fontFamily: WIN }}>
      {/* barre de titre et onglet */}
      <div style={{ height: 32, background: "#e8ecf3", display: "flex", alignItems: "flex-end", paddingLeft: 8 }}>
        <div style={{ height: 26, padding: "0 10px", background: "#f9f9f9", borderRadius: "6px 6px 0 0", display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, color: W.text, minWidth: 150 }}>
          <Icon name={view === "pc" ? "pc-display" : "hdd-network-fill"} size={12} color={view === "pc" ? "#2f6fd6" : W.accent} />
          {title}
          <span style={{ marginLeft: "auto", color: W.sub, fontSize: 10 }}>✕</span>
        </div>
        <span style={{ margin: "0 0 7px 10px", fontSize: 15, color: W.sub }}>+</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 24, padding: "0 14px 9px", color: W.text, fontSize: 12 }}>
          <span>─</span>
          <span>☐</span>
          <span>✕</span>
        </div>
      </div>
      {/* adresse et recherche */}
      <div style={{ height: 34, background: "#f9f9f9", display: "flex", alignItems: "center", gap: 9, padding: "0 10px" }}>
        <span style={{ color: W.sub, fontSize: 13, letterSpacing: 6 }}>← → ↑</span>
        <div style={{ flex: 1, height: 24, background: "#fff", border: `1px solid ${W.line}`, borderRadius: 4, display: "flex", alignItems: "center", gap: 5, padding: "0 8px", fontSize: 11.5, color: W.text, whiteSpace: "nowrap" }}>
          <Icon name={view === "pc" ? "pc-display" : "hdd-network-fill"} size={11} color={view === "pc" ? "#2f6fd6" : W.accent} />
          <span style={{ color: W.sub }}>›</span> Ce PC
          {view === "s" && (
            <>
              <span style={{ color: W.sub }}>›</span> Stokara (S:)
            </>
          )}
        </div>
        <div style={{ width: 150, height: 24, background: "#fff", border: `1px solid ${W.line}`, borderRadius: 4, display: "flex", alignItems: "center", padding: "0 8px", fontSize: 10.5, color: W.sub }}>
          Rechercher
          <Icon name="search" size={10} color={W.sub} style={{ marginLeft: "auto" }} />
        </div>
      </div>
      {/* barre de commandes */}
      <div style={{ height: 34, background: "#f9f9f9", borderBottom: `1px solid ${W.line}`, display: "flex", alignItems: "center", gap: 18, padding: "0 12px", fontSize: 11.5, color: W.text }}>
        <span>
          <b style={{ color: W.accent }}>＋</b> Nouveau ⌄
        </span>
        <span style={{ color: "#a0a0a0", letterSpacing: 9 }}>✂ ⧉ ✎ 🗑</span>
        <span>⇅ Trier ⌄</span>
        <span>☰ Afficher ⌄</span>
        <span>···</span>
      </div>
      {/* volet de navigation */}
      <div style={{ position: "absolute", left: 0, top: TOP, width: NAV_W, bottom: 22, borderRight: `1px solid ${W.line}`, padding: "8px 6px", background: "#fff" }}>
        {NAV.map(([ic, label, col], i) => {
          const on = label === "Ce PC" && view === "pc";
          return (
            <React.Fragment key={label}>
              {SEP_BEFORE.includes(i) && <div style={{ height: 1, background: W.line, margin: "4px 4px" }} />}
              <div style={{ height: ROW, display: "flex", alignItems: "center", gap: 8, padding: "0 8px", borderRadius: 4, background: on ? W.sel : "transparent", fontSize: 11.5, color: W.text }}>
                <span style={{ width: 8, fontSize: 8, color: W.sub }}>{label === "Ce PC" ? (mapped ? "⌄" : "›") : ""}</span>
                <Icon name={ic} size={13} color={col} />
                {label}
              </div>
              {label === "Ce PC" && mapped && (
                <div style={{ position: "relative", height: ROW, display: "flex", alignItems: "center", gap: 8, padding: "0 8px 0 30px", borderRadius: 4, background: view === "s" ? W.sel : "transparent", fontSize: 11.5, color: W.text, fontWeight: 600 }}>
                  <Icon name="hdd-network-fill" size={13} color={W.accent} />
                  Stokara (S:)
                  {navHl > 0 && <div style={{ position: "absolute", inset: -3, borderRadius: 6, border: `2.5px solid ${K.orange}`, opacity: navHl, boxShadow: `0 0 ${12 * navHl}px rgba(249,135,26,.7)` }} />}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* contenu */}
      <div style={{ position: "absolute", left: NAV_W + 14, top: TOP + 10, right: 12, bottom: 30 }}>
        {view === "pc" && (
          <>
            <Group title="Périphériques et lecteurs (2)" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <Drive name="Disque local (C:)" free="118 Go libres sur 237 Go" pct={50} />
              <Drive name="Données (D:)" free="412 Go libres sur 931 Go" pct={56} />
            </div>
          </>
        )}
        {view === "s" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {S_FOLDERS.map((n, i) => (
              <Folder key={n} name={n} o={interpolate(folderIn - i, [0, 1], [0, 1], clamp)} />
            ))}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, borderTop: `1px solid ${W.line}`, fontSize: 10, color: W.sub, display: "flex", alignItems: "center", padding: "0 12px", background: "#fff" }}>
        {view === "pc" ? "2 élément(s)" : "5 élément(s)"}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ menu contextuel (clic droit sur « Ce PC »)
const MENU: (string | null)[] = ["Développer", "Ouvrir dans un nouvel onglet", "Épingler à Accès rapide", null, "Connecter un lecteur réseau…", "Déconnecter un lecteur réseau…", "Ajouter un emplacement réseau", null, "Propriétés"];
export const MENU_PICK = 4;
const MROW = 26;
export const menuItemY = (i: number) => 5 + MENU.slice(0, i).reduce((a, m) => a + (m ? MROW : 9), 0) + MROW / 2;
export const ContextMenu: React.FC<{ x: number; y: number; hl: number; p: number }> = ({ x, y, hl, p }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 238, padding: "5px 0", background: "rgba(249,249,249,.98)", border: "1px solid #d6d6d6", borderRadius: 7, boxShadow: "0 10px 28px rgba(0,0,0,.3)", fontFamily: WIN, opacity: p, transform: `translateY(${(1 - p) * -6}px)` }}>
    {MENU.map((t, i) =>
      t === null ? (
        <div key={i} style={{ height: 1, background: "#e0e0e0", margin: "4px 0" }} />
      ) : (
        <div key={i} style={{ height: MROW, margin: "0 5px", borderRadius: 4, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 11.5, color: W.text, background: hl === i ? W.hover : "transparent", fontWeight: hl === i ? 600 : 400 }}>
          <span style={{ width: 13, display: "inline-flex" }}>{i === MENU_PICK && <Icon name="hdd-network-fill" size={12} color={W.accent} />}</span>
          {t}
        </div>
      ),
    )}
  </div>
);

// ------------------------------------------------------------------ assistant « Connecter un lecteur réseau »
export const DLG = { x: 74, y: 70, w: 532, h: 390 };
export const DLG_FINISH: [number, number] = [DLG.x + DLG.w - 156, DLG.y + DLG.h - 26];
export const MapDialog: React.FC<{ typed: string; caret: boolean; p: number; finishHl?: boolean }> = ({ typed, caret, p, finishHl }) => {
  const box = (children: React.ReactNode, w: number, focus = false) => (
    <div style={{ width: w, height: 24, border: "1px solid #8a8a8a", borderBottom: focus ? `2px solid ${W.accent}` : "1px solid #8a8a8a", borderRadius: 3, display: "flex", alignItems: "center", padding: "0 7px", fontSize: 11.5, color: W.text, background: "#fff", boxSizing: "border-box", whiteSpace: "nowrap", overflow: "hidden" }}>
      {children}
      <span style={{ marginLeft: "auto", fontSize: 9, color: W.sub }}>⌄</span>
    </div>
  );
  const check = (on: boolean, label: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, color: W.text, marginTop: 8 }}>
      <div style={{ width: 13, height: 13, borderRadius: 3, background: on ? W.accent : "#fff", border: on ? "none" : "1px solid #6d6d6d", color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</div>
      {label}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: DLG.x, top: DLG.y, width: DLG.w, height: DLG.h, background: "#fff", border: "1px solid #c8c8c8", borderRadius: 8, boxShadow: "0 24px 60px rgba(0,0,0,.5)", fontFamily: WIN, overflow: "hidden", opacity: p, transform: `scale(${0.94 + 0.06 * p})` }}>
      <div style={{ height: 30, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 11, color: W.text }}>
        <span style={{ fontSize: 13, color: "#bbb" }}>←</span>
        <Icon name="hdd-network-fill" size={12} color={W.accent} />
        Connecter un lecteur réseau
        <span style={{ marginLeft: "auto", fontSize: 12 }}>✕</span>
      </div>
      <div style={{ padding: "12px 34px" }}>
        <div style={{ fontSize: 16, color: "#1e3a8a", marginBottom: 10 }}>Quel dossier réseau voulez-vous connecter ?</div>
        <div style={{ fontSize: 11.5, color: W.text, marginBottom: 14 }}>Spécifiez la lettre désignant le lecteur et le dossier auxquels vous souhaitez vous connecter :</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
          <span style={{ width: 62, fontSize: 11.5 }}>Lecteur :</span>
          {box(<b style={{ fontWeight: 600 }}>S:</b>, 74)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 62, fontSize: 11.5 }}>Dossier :</span>
          {box(
            <>
              {typed}
              {caret && <span style={{ width: 1.2, height: 14, background: W.text, marginLeft: 1 }} />}
            </>,
            290,
            true,
          )}
          <div style={{ height: 24, padding: "0 10px", border: "1px solid #c8c8c8", borderRadius: 4, display: "flex", alignItems: "center", fontSize: 11 }}>Parcourir...</div>
        </div>
        <div style={{ fontSize: 10.5, color: W.sub, margin: "5px 0 6px 72px" }}>Exemple : \\serveur\partage</div>
        <div style={{ marginLeft: 72 }}>
          {check(true, "Se reconnecter lors de la connexion")}
          {check(false, "Se connecter à l'aide d'informations d'identification différentes")}
          <div style={{ fontSize: 11, color: W.accent, marginTop: 10, lineHeight: 1.35 }}>Se connecter à un site Web que vous pouvez utiliser pour stocker vos documents et vos images.</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 52, background: W.panel, borderTop: `1px solid ${W.line}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "0 20px" }}>
        <div style={{ width: 92, height: 27, borderRadius: 4, background: W.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, boxShadow: finishHl ? `0 0 0 3px rgba(249,135,26,.8)` : "none" }}>Terminer</div>
        <div style={{ width: 92, height: 27, borderRadius: 4, background: "#fff", border: "1px solid #c8c8c8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, color: W.text }}>Annuler</div>
      </div>
    </div>
  );
};
