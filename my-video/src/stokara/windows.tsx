// Reconstitution simplifiée de Windows 11 (Explorateur « Ce PC », assistant « Ajouter un emplacement
// réseau », fenêtre « Sécurité Windows ») pour montrer l'ajout de Stokara comme emplacement réseau.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Icon, K, WIN, clamp } from "./ui";
import { IconName } from "./icons";

const W = { accent: "#005fb8", text: "#1b1b1b", sub: "#5d5d5d", line: "#e5e5e5", sel: "#cce4f7", hover: "#e5f1fb", panel: "#f3f3f3" };

export const Desktop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 110%, #3d7fe0 0%, #1d4fa8 35%, #0d2a66 70%, #071a43 100%)", fontFamily: WIN }}>
    <div style={{ position: "absolute", left: -300, top: 420, width: 1500, height: 900, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(120,180,255,.35), transparent 65%)" }} />
    <div style={{ position: "absolute", right: -200, top: -300, width: 1200, height: 900, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(90,140,255,.28), transparent 65%)" }} />
    {children}
    <Taskbar />
  </AbsoluteFill>
);

const Taskbar: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 56, background: "rgba(238,242,250,.86)", borderTop: "1px solid rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
    {(["grid-3x3-gap-fill", "search", "folder-fill", "globe2", "envelope-fill"] as IconName[]).map((n, i) => (
      <div key={n} style={{ width: 44, height: 44, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: i === 2 ? "rgba(255,255,255,.9)" : "transparent", position: "relative" }}>
        <Icon name={n} size={24} color={i === 2 ? K.folder : i === 0 ? W.accent : "#3c4a66"} />
        {i === 2 && <div style={{ position: "absolute", bottom: 2, width: 16, height: 3, borderRadius: 2, background: W.accent }} />}
      </div>
    ))}
    <div style={{ position: "absolute", right: 24, textAlign: "right", fontSize: 14, color: W.text, lineHeight: 1.3 }}>
      14:32
      <br />
      07/11/2026
    </div>
  </div>
);

// ------------------------------------------------------------------ Explorateur
export const EX = { x: 260, y: 90, w: 1400, h: 820 }; // position de la fenêtre sur l'image
const NAV_W = 260;
const TOP = 44 + 48 + 50; // barre de titre + adresse + commandes

export type ExplorerState = { view: "home" | "pc" | "stokara" | "dupont"; network?: boolean; selected?: string; title?: string; addr?: string[] };

const FolderTile: React.FC<{ name: string; sub?: string; sel?: boolean; icon?: "folder" | "net" }> = ({ name, sub, sel, icon = "folder" }) => (
  <div style={{ width: 150, height: 150, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, background: sel ? W.sel : "transparent", border: sel ? "1px solid #99c9ef" : "1px solid transparent" }}>
    <div style={{ position: "relative" }}>
      <Icon name="folder-fill" size={78} color={K.folder} />
      {icon === "net" && <Icon name="globe2" size={30} color={W.accent} style={{ position: "absolute", right: -4, bottom: 6, background: "#fff", borderRadius: 15 }} />}
    </div>
    <div style={{ fontSize: 16, color: W.text, textAlign: "center" }}>{name}</div>
    {sub && <div style={{ fontSize: 12, color: W.sub }}>{sub}</div>}
  </div>
);

const Drive: React.FC<{ name: string; free: string; pct: number; letterIcon?: IconName }> = ({ name, free, pct }) => (
  <div style={{ width: 330, height: 86, display: "flex", alignItems: "center", gap: 14, padding: "0 12px" }}>
    <Icon name="hdd-fill" size={50} color="#6b7a90" />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 16, color: W.text }}>{name}</div>
      <div style={{ height: 14, background: "#e6e6e6", border: "1px solid #bcbcbc", margin: "6px 0 4px" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#26a0da" }} />
      </div>
      <div style={{ fontSize: 13, color: W.sub }}>{free}</div>
    </div>
  </div>
);

const FILES_DUPONT = [
  ["Compte rendu réunion.txt", "file-earmark-text-fill", "#6b7a90"],
  ["Contrat signé.pdf", "file-earmark-pdf-fill", "#d93025"],
  ["Devis D-2026-041.pdf", "file-earmark-pdf-fill", "#d93025"],
  ["Métré cuisine.pdf", "file-earmark-pdf-fill", "#d93025"],
  ["Photo îlot central.jpg", "file-earmark-image-fill", "#2b8a3e"],
  ["Plan cuisine.png", "file-earmark-image-fill", "#2b8a3e"],
  ["Planning chantier.xlsx", "file-earmark-excel-fill", "#1d7a45"],
] as const;

export const Explorer: React.FC<{ st: ExplorerState; style?: React.CSSProperties }> = ({ st, style }) => {
  const addr = st.addr ?? (st.view === "home" ? ["Accueil"] : st.view === "pc" ? ["Ce PC"] : st.view === "stokara" ? ["Ce PC", "Stokara"] : ["Ce PC", "Stokara", "Clients", "Dupont SARL"]);
  const title = st.title ?? addr[addr.length - 1];
  const navItems: [IconName, string, string][] = [
    ["house-door-fill", "Accueil", "#c7802b"],
    ["file-earmark-image-fill", "Galerie", "#2b8a3e"],
    ["display", "Bureau", "#2f6fd6"],
    ["download", "Téléchargements", "#2f6fd6"],
    ["file-earmark-text-fill", "Documents", "#6b7a90"],
    ["file-earmark-image-fill", "Images", "#2f6fd6"],
    ["play-circle-fill", "Vidéos", "#7c3aed"],
    ["pc-display", "Ce PC", "#2f6fd6"],
    ["wifi", "Réseau", "#2f6fd6"],
  ];
  return (
    <div style={{ position: "absolute", left: EX.x, top: EX.y, width: EX.w, height: EX.h, background: "#fff", borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,.45)", overflow: "hidden", fontFamily: WIN, ...style }}>
      {/* barre de titre avec onglet */}
      <div style={{ height: 44, background: "#e8ecf3", display: "flex", alignItems: "flex-end", paddingLeft: 10 }}>
        <div style={{ height: 36, padding: "0 16px", background: "#f9f9f9", borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: W.text, minWidth: 220 }}>
          <Icon name={st.view === "pc" ? "pc-display" : st.view === "home" ? "house-door-fill" : "folder-fill"} size={16} color={st.view === "pc" ? "#2f6fd6" : st.view === "home" ? "#c7802b" : K.folder} />
          {title}
          <span style={{ marginLeft: "auto", color: W.sub, fontSize: 13 }}>✕</span>
        </div>
        <span style={{ margin: "0 0 10px 14px", fontSize: 20, color: W.sub }}>+</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 36, padding: "0 22px 12px", color: W.text, fontSize: 16 }}>
          <span>─</span>
          <span>☐</span>
          <span>✕</span>
        </div>
      </div>
      {/* adresse et recherche */}
      <div style={{ height: 48, background: "#f9f9f9", display: "flex", alignItems: "center", gap: 14, padding: "0 14px" }}>
        <span style={{ color: W.sub, fontSize: 18, letterSpacing: 10 }}>← → ↑ ⟳</span>
        <div style={{ flex: 1, height: 32, background: "#fff", border: `1px solid ${W.line}`, borderRadius: 4, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 15, color: W.text }}>
          <Icon name={st.view === "pc" ? "pc-display" : "folder-fill"} size={15} color={st.view === "pc" ? "#2f6fd6" : K.folder} />
          {addr.map((a, i) => (
            <span key={i}>
              <span style={{ color: W.sub, margin: "0 6px" }}>›</span>
              {a}
            </span>
          ))}
        </div>
        <div style={{ width: 300, height: 32, background: "#fff", border: `1px solid ${W.line}`, borderRadius: 4, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 14, color: W.sub }}>
          Rechercher dans : {title}
          <Icon name="search" size={14} color={W.sub} style={{ marginLeft: "auto" }} />
        </div>
      </div>
      {/* barre de commandes */}
      <div style={{ height: 50, background: "#f9f9f9", borderBottom: `1px solid ${W.line}`, display: "flex", alignItems: "center", gap: 26, padding: "0 18px", fontSize: 15, color: W.text }}>
        <span>
          <b style={{ color: W.accent }}>＋</b> Nouveau ⌄
        </span>
        <span style={{ color: "#a0a0a0", letterSpacing: 14 }}>✂ ⧉ ⎘ ✎ 🗑</span>
        <span>⇅ Trier ⌄</span>
        <span>☰ Afficher ⌄</span>
        <span>···</span>
      </div>
      {/* navigation */}
      <div style={{ position: "absolute", left: 0, top: TOP, width: NAV_W, bottom: 30, borderRight: `1px solid ${W.line}`, padding: "10px 8px", background: "#fff" }}>
        {navItems.map(([ic, label, col], i) => {
          const on = (label === "Ce PC" && st.view === "pc") || (label === "Accueil" && st.view === "home");
          return (
            <React.Fragment key={label}>
              {(i === 2 || i === 7) && <div style={{ height: 1, background: W.line, margin: "8px 6px" }} />}
              <div style={{ height: 36, display: "flex", alignItems: "center", gap: 12, padding: "0 12px", borderRadius: 4, background: on ? W.sel : "transparent", fontSize: 15, color: W.text }}>
                <Icon name={ic} size={17} color={col} />
                {label}
              </div>
              {label === "Ce PC" && st.network && st.view !== "pc" && (
                <div style={{ height: 36, display: "flex", alignItems: "center", gap: 12, padding: "0 12px 0 36px", borderRadius: 4, background: W.sel, fontSize: 15, color: W.text }}>
                  <Icon name="folder-fill" size={17} color={K.folder} />
                  Stokara
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* contenu */}
      <div style={{ position: "absolute", left: NAV_W + 24, top: TOP + 14, right: 20, bottom: 40 }}>
        {st.view === "home" && (
          <>
            <Group title="Accès rapide" />
            <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
              {["Bureau", "Téléchargements", "Documents", "Images"].map((n) => (
                <FolderTile key={n} name={n} />
              ))}
            </div>
          </>
        )}
        {st.view === "pc" && (
          <>
            <Group title="Périphériques et lecteurs (2)" />
            <div style={{ display: "flex", gap: 30, margin: "6px 0 26px" }}>
              <Drive name="Disque local (C:)" free="118 Go libres sur 237 Go" pct={50} />
              <Drive name="Données (D:)" free="412 Go libres sur 931 Go" pct={56} />
            </div>
            {st.network && (
              <>
                <Group title="Emplacements réseau (1)" />
                <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
                  <FolderTile name="Stokara" sub="stokara.exemple.fr" icon="net" sel={st.selected === "Stokara"} />
                </div>
              </>
            )}
          </>
        )}
        {st.view === "stokara" && (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {["Clients", "Commercial", "Commun", "Photos chantier", "Utilisateurs"].map((n) => (
              <FolderTile key={n} name={n} sel={st.selected === n} />
            ))}
          </div>
        )}
        {st.view === "dupont" && (
          <div>
            <div style={{ display: "flex", fontSize: 13, color: W.sub, padding: "0 12px 8px", borderBottom: `1px solid ${W.line}` }}>
              <span style={{ width: 420 }}>Nom</span>
              <span style={{ width: 220 }}>Modifié le</span>
              <span style={{ width: 200 }}>Type</span>
            </div>
            {FILES_DUPONT.map(([n, ic, col]) => (
              <div key={n} style={{ display: "flex", alignItems: "center", height: 40, padding: "0 12px", fontSize: 15, color: W.text, background: st.selected === n ? W.sel : "transparent" }}>
                <span style={{ width: 420, display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon name={ic as IconName} size={18} color={col} />
                  {n}
                </span>
                <span style={{ width: 220, color: W.sub }}>{n.startsWith("Planning") && st.selected === n ? "07/11/2026 14:33" : "27/10/2026 10:28"}</span>
                <span style={{ width: 200, color: W.sub }}>{n.endsWith("pdf") ? "Document PDF" : n.endsWith("xlsx") ? "Feuille de calcul" : n.endsWith("txt") ? "Document texte" : "Fichier image"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 30, borderTop: `1px solid ${W.line}`, fontSize: 13, color: W.sub, display: "flex", alignItems: "center", padding: "0 16px", background: "#fff" }}>
        {st.view === "home" ? "4 élément(s)" : st.view === "pc" ? (st.network ? "3 élément(s)" : "2 élément(s)") : st.view === "stokara" ? "5 élément(s)" : "7 élément(s)"}
      </div>
    </div>
  );
};
const Group: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#1e3a6e", fontWeight: 600 }}>
    <span style={{ fontSize: 12 }}>⌄</span>
    {title}
    <div style={{ flex: 1, height: 1, background: W.line }} />
  </div>
);
// positions utiles (image 1920 × 1080)
export const EXP = {
  nav: (label: "Ce PC" | "Réseau"): [number, number] => [EX.x + 70, EX.y + TOP + 10 + (label === "Ce PC" ? 7 * 36 + 34 : 8 * 36 + 34) + 18],
  emptyPc: [EX.x + 900, EX.y + 520] as [number, number],
  netTile: [EX.x + NAV_W + 24 + 75, EX.y + TOP + 257] as [number, number],
  folder: (i: number): [number, number] => [EX.x + NAV_W + 24 + 75 + i * 170, EX.y + TOP + 14 + 75],
  file: (i: number): [number, number] => [EX.x + NAV_W + 24 + 160, EX.y + TOP + 14 + 30 + i * 40 + 18],
};

// ------------------------------------------------------------------ menu contextuel
export const ContextMenu: React.FC<{ x: number; y: number; hl?: number; at: number }> = ({ x, y, hl, at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + 6], [0, 1], clamp);
  const items: [string, boolean][] = [
    ["Affichage", true],
    ["Trier par", true],
    ["Regrouper par", true],
    ["—", false],
    ["Ajouter un emplacement réseau", false],
    ["—", false],
    ["Propriétés", false],
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 330, padding: "6px 0", background: "rgba(249,249,249,.98)", border: "1px solid #d6d6d6", borderRadius: 8, boxShadow: "0 12px 34px rgba(0,0,0,.3)", fontFamily: WIN, opacity: p, transform: `translateY(${(1 - p) * -8}px)` }}>
      {items.map(([t, arrow], i) => {
        if (t === "—") {
          return <div key={i} style={{ height: 1, background: "#e0e0e0", margin: "4px 0" }} />;
        }
        return (
          <div key={i} style={{ height: 38, margin: "0 6px", borderRadius: 4, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: W.text, background: hl === i ? W.hover : "transparent" }}>
            {t}
            {arrow && <span style={{ marginLeft: "auto", color: W.sub }}>›</span>}
          </div>
        );
      })}
    </div>
  );
};
export const MENU_ITEM_Y = 6 + 3 * 38 + 9 + 19; // centre de « Ajouter un emplacement réseau » sous le haut du menu

// ------------------------------------------------------------------ assistant « Ajouter un emplacement réseau »
export const WZ = { x: 560, y: 190, w: 800, h: 600 };
export const WZP = {
  next: [WZ.x + WZ.w - 207, WZ.y + WZ.h - 38] as [number, number],
  custom: [WZ.x + 330, WZ.y + 165] as [number, number],
  field: [WZ.x + 254, WZ.y + 201] as [number, number],
};
export const Wizard: React.FC<{ page: 1 | 2 | 3 | 4 | 5; typed?: string; name?: string; customSel?: boolean; style?: React.CSSProperties }> = ({ page, typed = "", name = "", customSel, style }) => {
  const H: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ fontSize: 22, color: "#1e3a8a", marginBottom: 22 }}>{children}</div>;
  const P: React.FC<{ children: React.ReactNode; s?: React.CSSProperties }> = ({ children, s }) => <div style={{ fontSize: 15, color: W.text, lineHeight: 1.5, marginBottom: 16, ...s }}>{children}</div>;
  const field = (v: string, w = 470) => (
    <div style={{ width: w, height: 32, border: `1px solid #8a8a8a`, borderBottom: `2px solid ${W.accent}`, borderRadius: 3, display: "flex", alignItems: "center", padding: "0 8px", fontSize: 15, color: W.text, background: "#fff" }}>
      {v}
      <span style={{ width: 1.5, height: 18, background: W.text, marginLeft: 1 }} />
    </div>
  );
  return (
    <div style={{ position: "absolute", left: WZ.x, top: WZ.y, width: WZ.w, height: WZ.h, background: "#fff", border: "1px solid #c8c8c8", borderRadius: 8, boxShadow: "0 30px 80px rgba(0,0,0,.45)", fontFamily: WIN, overflow: "hidden", ...style }}>
      <div style={{ height: 40, display: "flex", alignItems: "center", padding: "0 14px", gap: 12, fontSize: 14, color: W.text, background: "#fff" }}>
        <span style={{ fontSize: 18, color: page > 1 ? W.text : "#bbb" }}>←</span>
        <Icon name="globe2" size={16} color={W.accent} />
        Ajouter un emplacement réseau
        <span style={{ marginLeft: "auto", fontSize: 16 }}>✕</span>
      </div>
      <div style={{ padding: "26px 54px" }}>
        {page === 1 && (
          <>
            <H>Bienvenue dans l'Assistant Ajout d'un emplacement réseau</H>
            <P>Cet Assistant vous aide à vous inscrire auprès d'un service qui offre un espace de stockage en ligne. Vous pouvez utiliser cet espace pour stocker, organiser et partager des documents et des images à l'aide d'un navigateur web et de toute connexion Internet.</P>
            <P>Vous pouvez également utiliser cet Assistant pour créer un raccourci vers un site web, un site FTP ou un autre emplacement réseau.</P>
          </>
        )}
        {page === 2 && (
          <>
            <H>Où voulez-vous créer cet emplacement réseau ?</H>
            <div style={{ border: `1px solid ${W.line}`, height: 250, padding: 6 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "12px 14px", background: customSel ? W.sel : "transparent", border: customSel ? "1px solid #99c9ef" : "1px solid transparent" }}>
                <Icon name="globe2" size={34} color={W.accent} />
                <div>
                  <div style={{ fontSize: 16, color: W.text }}>Choisissez un emplacement réseau personnalisé</div>
                  <div style={{ fontSize: 13, color: W.sub, marginTop: 3 }}>Spécifiez l'adresse d'un site Web, d'un emplacement réseau ou d'un site FTP.</div>
                </div>
              </div>
            </div>
          </>
        )}
        {page === 3 && (
          <>
            <H>Spécifiez l'emplacement de votre site Web</H>
            <P>Tapez l'adresse du site Web, du site FTP ou de l'emplacement réseau que ce raccourci doit ouvrir.</P>
            <P s={{ marginBottom: 6 }}>Adresse Internet ou réseau :</P>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {field(typed, 520)}
              <div style={{ height: 32, padding: "0 16px", border: "1px solid #c8c8c8", borderRadius: 4, display: "flex", alignItems: "center", fontSize: 14 }}>Parcourir...</div>
            </div>
            <div style={{ fontSize: 14, color: W.accent, marginTop: 14 }}>Afficher des exemples</div>
          </>
        )}
        {page === 4 && (
          <>
            <H>Quel nom voulez-vous attribuer à cet emplacement ?</H>
            <P>Créez un nom pour ce raccourci qui vous aidera à identifier facilement cet emplacement réseau : https://stokara.exemple.fr/dav/.</P>
            <P s={{ marginBottom: 6 }}>Tapez un nom pour cet emplacement réseau :</P>
            {field(name)}
          </>
        )}
        {page === 5 && (
          <>
            <H>Fin de l'Assistant Ajout d'un emplacement réseau</H>
            <P>Vous avez créé avec succès cet emplacement réseau :</P>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, margin: "0 0 20px 20px" }}>
              <Icon name="folder-fill" size={30} color={K.folder} /> Stokara
            </div>
            <P>Un raccourci vers cet emplacement va apparaître dans Ce PC.</P>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, marginTop: 30 }}>
              <div style={{ width: 18, height: 18, borderRadius: 3, background: W.accent, color: "#fff", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
              Ouvrir cet emplacement réseau lorsque je clique sur Terminer.
            </div>
          </>
        )}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 76, background: W.panel, borderTop: `1px solid ${W.line}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, padding: "0 30px" }}>
        <div style={{ width: 110, height: 34, borderRadius: 4, background: W.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{page === 5 ? "Terminer" : "Suivant"}</div>
        <div style={{ width: 110, height: 34, borderRadius: 4, background: "#fff", border: "1px solid #c8c8c8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: W.text }}>Annuler</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ Sécurité Windows
export const CR = { x: 730, y: 230, w: 460, h: 470 };
export const CRP = { user: [CR.x + 230, CR.y + 151] as [number, number], pass: [CR.x + 230, CR.y + 205] as [number, number], remember: [CR.x + 34, CR.y + 255] as [number, number], ok: [CR.x + 125, CR.y + CR.h - 44] as [number, number] };
export const Credentials: React.FC<{ user: string; pass: number; remember: boolean; style?: React.CSSProperties }> = ({ user, pass, remember, style }) => {
  const input = (v: string, ph: string, focus: boolean) => (
    <div style={{ height: 40, border: "1px solid #8a8a8a", borderBottom: focus ? `2px solid ${W.accent}` : "1px solid #8a8a8a", borderRadius: 4, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 16, color: v ? W.text : W.sub, background: "#fff", marginBottom: 14 }}>{v || ph}</div>
  );
  return (
    <div style={{ position: "absolute", left: CR.x, top: CR.y, width: CR.w, height: CR.h, background: "#f3f3f3", border: "1px solid #c8c8c8", borderRadius: 8, boxShadow: "0 30px 80px rgba(0,0,0,.5)", fontFamily: WIN, ...style }}>
      <div style={{ padding: "18px 24px 0", fontSize: 14, color: W.text, display: "flex" }}>
        Sécurité Windows<span style={{ marginLeft: "auto" }}>✕</span>
      </div>
      <div style={{ padding: "18px 24px" }}>
        <div style={{ fontSize: 22, color: W.text, marginBottom: 8 }}>Connexion à stokara.exemple.fr</div>
        <div style={{ fontSize: 14, color: W.sub, marginBottom: 20 }}>Connexion à stokara.exemple.fr</div>
        {input(user, "Nom d'utilisateur", user.length > 0 && pass === 0)}
        {input("●".repeat(pass), "Mot de passe", pass > 0)}
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: W.text, marginTop: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, border: remember ? "none" : "1px solid #6d6d6d", background: remember ? W.accent : "#fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{remember ? "✓" : ""}</div>
          Mémoriser mes informations d'identification
        </div>
      </div>
      <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, display: "flex", gap: 10 }}>
        <div style={{ flex: 1, height: 40, borderRadius: 4, background: W.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>OK</div>
        <div style={{ flex: 1, height: 40, borderRadius: 4, background: "#fff", border: "1px solid #c8c8c8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>Annuler</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ tableur générique (document ouvert depuis le lecteur réseau)
export const Sheet: React.FC<{ edit: number; saved: boolean; style?: React.CSSProperties }> = ({ edit, saved, style }) => {
  const rows = [
    ["Semaine", "Tâche", "Responsable", "État"],
    ["S46", "Dépose de l'ancienne cuisine", "Karim", "Fait"],
    ["S47", "Plomberie et électricité", "Karim", "En cours"],
    ["S48", "Pose des meubles et de l'îlot", "Karim", edit > 0 ? "Avancé au 23/11".slice(0, Math.ceil(edit)) : "Prévu"],
    ["S49", "Plan de travail en chêne", "Karim", "Prévu"],
  ];
  return (
    <div style={{ position: "absolute", width: 900, height: 460, background: "#fff", borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,.45)", overflow: "hidden", fontFamily: WIN, ...style }}>
      <div style={{ height: 44, background: "#1d7a45", color: "#fff", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, fontSize: 15 }}>
        <Icon name="file-earmark-excel-fill" size={18} color="#fff" /> Planning chantier.xlsx
        <span style={{ opacity: 0.8 }}>— {saved ? "Enregistré" : "Modifié"}</span>
        <span style={{ marginLeft: "auto", letterSpacing: 26 }}>─ ☐ ✕</span>
      </div>
      <div style={{ height: 40, background: "#f3f3f3", borderBottom: `1px solid ${W.line}`, display: "flex", alignItems: "center", gap: 22, padding: "0 16px", fontSize: 14, color: W.text }}>
        <span>Fichier</span>
        <span>Accueil</span>
        <span>Insertion</span>
        <span>Données</span>
      </div>
      <div style={{ padding: 18 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", borderBottom: `1px solid ${W.line}`, background: i === 0 ? "#eaf3ee" : "transparent" }}>
            {r.map((c, j) => (
              <div key={j} style={{ width: [110, 380, 160, 200][j], height: 52, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 16, fontWeight: i === 0 ? 600 : 400, color: W.text, borderRight: `1px solid ${W.line}`, outline: i === 3 && j === 3 && edit > 0 ? "2.5px solid #1d7a45" : "none", outlineOffset: -2 }}>
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
