// Interface mobile de Stokara reconstituée d'après la capture réelle (public/stokara/caps/mob-home.jpg) :
// en-tête bleu nuit, carte blanche, barre d'outils, recherche, tuiles de dossiers, liste de fichiers,
// grille de photos et fenêtre « Lien de partage » (mêmes libellés que le site). Écran de 390 × 844 px CSS.
import React from "react";
import { IconName } from "../stokara/icons";
import { FONT, Icon, K, Logo } from "../stokara-pub/kit";

export const MW = 390;
export const MH = 844;

// ------------------------------------------------------------------ « photos » dessinées (paysages simples)
export const PhotoArt: React.FC<{ v: number; size: number; radius?: number }> = ({ v, size, radius = 8 }) => {
  const k = ((v % 9) + 9) % 9;
  const scenes: React.ReactNode[] = [
    // plage
    <>
      <defs>
        <linearGradient id={`s${k}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6ec1ff" />
          <stop offset="1" stopColor="#d8f0ff" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#s${k})`} />
      <circle cx="74" cy="26" r="12" fill="#ffd34d" />
      <rect y="56" width="100" height="22" fill="#2e8bd8" />
      <path d="M0 58 Q 25 54 50 58 T 100 58 V 62 H 0 Z" fill="#7cc6ff" />
      <path d="M0 78 Q 50 70 100 80 V 100 H 0 Z" fill="#f4dca6" />
      <rect x="20" y="66" width="2" height="18" fill="#7a5230" />
      <path d="M8 68 Q 21 56 34 68 Z" fill="#ff7a59" />
    </>,
    // montagne au coucher du soleil
    <>
      <defs>
        <linearGradient id={`s${k}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9a76" />
          <stop offset="1" stopColor="#ffd6a5" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#s${k})`} />
      <circle cx="30" cy="40" r="10" fill="#fff3c4" />
      <path d="M-5 100 L 35 40 L 70 100 Z" fill="#6a4c93" />
      <path d="M30 100 L 68 30 L 110 100 Z" fill="#3a3f8f" />
      <path d="M68 30 L 60 45 L 66 43 L 70 48 L 74 43 L 77 46 Z" fill="#fff" />
      <path d="M35 40 L 29 50 L 34 48 L 38 52 L 41 49 Z" fill="#fff" />
    </>,
    // forêt
    <>
      <rect width="100" height="100" fill="#cfeee0" />
      <rect y="70" width="100" height="30" fill="#7cc576" />
      {[10, 30, 52, 74, 92].map((x, i) => (
        <g key={i}>
          <rect x={x - 2} y={60 - (i % 2) * 8} width="4" height="18" fill="#7a5230" />
          <circle cx={x} cy={52 - (i % 2) * 8} r={13 - (i % 2) * 2} fill={i % 2 ? "#2f9e44" : "#40c057"} />
        </g>
      ))}
    </>,
    // anniversaire
    <>
      <rect width="100" height="100" fill="#ffd6e7" />
      {[12, 30, 70, 88].map((x, i) => (
        <circle key={i} cx={x} cy={18 + (i % 2) * 10} r="5" fill={["#ff6b6b", "#ffd43b", "#4dabf7", "#b197fc"][i]} />
      ))}
      <rect x="22" y="58" width="56" height="30" rx="4" fill="#fff" />
      <rect x="22" y="58" width="56" height="9" rx="3" fill="#ff8fab" />
      {[34, 50, 66].map((x) => (
        <g key={x}>
          <rect x={x - 1.5} y="44" width="3" height="14" fill="#4dabf7" />
          <ellipse cx={x} cy="41" rx="2.5" ry="4" fill="#ffa94d" />
        </g>
      ))}
    </>,
    // ville au crépuscule
    <>
      <defs>
        <linearGradient id={`s${k}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5f3dc4" />
          <stop offset="1" stopColor="#f783ac" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#s${k})`} />
      {[
        [4, 50, 14],
        [20, 38, 12],
        [34, 56, 16],
        [52, 30, 12],
        [66, 48, 14],
        [82, 40, 16],
      ].map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height={100 - y} fill="#2b2252" />
      ))}
      {[24, 56, 70, 86].map((x, i) => (
        <rect key={i} x={x} y={60 + (i % 2) * 10} width="3" height="3" fill="#ffd43b" />
      ))}
    </>,
    // neige
    <>
      <rect width="100" height="100" fill="#a5d8ff" />
      <path d="M0 70 Q 30 55 60 68 T 100 64 V 100 H 0 Z" fill="#fff" />
      <circle cx="70" cy="70" r="9" fill="#fff" stroke="#dbe4ff" />
      <circle cx="70" cy="56" r="6" fill="#fff" stroke="#dbe4ff" />
      <path d="M70 56 L 76 57 L 70 58 Z" fill="#ff922b" />
      {[12, 30, 48, 86, 22, 58].map((x, i) => (
        <circle key={i} cx={x} cy={12 + i * 7} r="1.6" fill="#fff" />
      ))}
    </>,
    // voilier
    <>
      <rect width="100" height="100" fill="#d0ebff" />
      <rect y="60" width="100" height="40" fill="#1971c2" />
      <path d="M50 22 L 50 60 L 26 60 Z" fill="#fff" />
      <path d="M53 30 L 53 60 L 70 60 Z" fill="#ffd8a8" />
      <path d="M30 60 L 72 60 L 66 68 L 36 68 Z" fill="#c92a2a" />
      <circle cx="82" cy="18" r="8" fill="#ffe066" />
    </>,
    // jardin en fleurs
    <>
      <rect width="100" height="100" fill="#d3f9d8" />
      <rect y="64" width="100" height="36" fill="#51cf66" />
      {[14, 34, 56, 78].map((x, i) => (
        <g key={i}>
          <rect x={x - 1} y="56" width="2" height="16" fill="#2b8a3e" />
          <circle cx={x} cy="52" r="7" fill={["#ff6b6b", "#ffd43b", "#f783ac", "#748ffc"][i]} />
          <circle cx={x} cy="52" r="2.5" fill="#fff3bf" />
        </g>
      ))}
    </>,
    // nuit étoilée
    <>
      <rect width="100" height="100" fill="#1b1f4b" />
      <circle cx="72" cy="28" r="12" fill="#fff9db" />
      <circle cx="77" cy="24" r="11" fill="#1b1f4b" />
      {[12, 26, 40, 54, 88, 18, 46].map((x, i) => (
        <circle key={i} cx={x} cy={14 + (i * 11) % 40} r="1.4" fill="#fff" />
      ))}
      <path d="M0 80 Q 40 64 100 78 V 100 H 0 Z" fill="#2b3070" />
    </>,
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", borderRadius: radius }}>
      {scenes[k]}
    </svg>
  );
};

// ------------------------------------------------------------------ écran mobile de Stokara
export type Folder = { name: string; date: string; hl?: number };
export type FileRow = { name: string; meta: string; icon?: IconName; color?: string; hl?: number };
const Btn: React.FC<{ icon: IconName; on?: boolean }> = ({ icon, on }) => (
  <div style={{ width: 44, height: 40, borderRadius: 12, border: `1.5px solid ${on ? "#f6d2b0" : K.line}`, background: on ? "#fde8d5" : "#f6f7fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Icon name={icon} size={18} color={K.ink} />
  </div>
);
export const MobileUI: React.FC<{
  space: string;
  crumbs: string[];
  info: string;
  folders?: Folder[];
  files?: FileRow[];
  photos?: number;
  photoIn?: number; // nombre de photos déjà apparues (animation)
  children?: React.ReactNode;
}> = ({ space, crumbs, info, folders, files, photos, photoIn = 99, children }) => (
  <div style={{ position: "relative", width: MW, height: MH, overflow: "hidden", fontFamily: FONT, background: "linear-gradient(170deg, #e9ecfb 0%, #f5f3fb 50%, #fcefe3 100%)" }}>
    {/* barre d'état */}
    <div style={{ height: 44, background: K.navy, display: "flex", alignItems: "center", padding: "0 26px", color: "#fff", fontSize: 15, fontWeight: 600 }}>
      14:32
      <span style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
        <Icon name="wifi" size={15} color="#fff" />
        <span style={{ width: 24, height: 12, borderRadius: 3, border: "1.5px solid #fff", position: "relative" }}>
          <span style={{ position: "absolute", left: 2, top: 2, width: 15, height: 5, borderRadius: 1, background: "#fff" }} />
        </span>
      </span>
    </div>
    {/* en-tête */}
    <div style={{ height: 76, background: `linear-gradient(90deg, ${K.navy}, #3b3f9a)`, display: "flex", alignItems: "center", gap: 12, padding: "0 14px" }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, border: "1.5px solid rgba(255,255,255,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="layout-sidebar" size={20} color="#fff" />
      </div>
      <Logo size={44} />
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 22 }}>Stokara</div>
        <div style={{ color: "rgba(255,255,255,.85)", fontSize: 14 }}>{space}</div>
      </div>
      <div style={{ marginLeft: "auto", width: 48, height: 48, borderRadius: 14, border: "1.5px solid rgba(255,255,255,.35)", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="list" size={22} color="#fff" />
      </div>
    </div>
    {/* carte */}
    <div style={{ position: "absolute", left: 10, right: 10, top: 132, bottom: 10, background: "rgba(255,255,255,.92)", borderRadius: 22, boxShadow: "0 8px 24px rgba(26,35,126,.08)", padding: "16px 14px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 21, fontWeight: 700, color: K.ink, whiteSpace: "nowrap", overflow: "hidden" }}>
        <Icon name="hdd-stack" size={20} color={K.ink} />
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: K.ink3, fontWeight: 400 }}>›</span>}
            <span style={{ color: i === crumbs.length - 1 ? K.ink : K.ink2, fontWeight: i === crumbs.length - 1 ? 700 : 500 }}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <Btn icon="arrow-90deg-up" />
        <Btn icon="arrow-clockwise" />
        <Btn icon="sort-down" />
        <Btn icon="grid-3x3-gap" on />
        <Btn icon="list-ul" />
      </div>
      <div style={{ height: 44, borderRadius: 22, border: `1.5px solid ${K.line}`, display: "flex", alignItems: "center", gap: 8, padding: "0 6px 0 14px", fontSize: 16, color: K.ink3 }}>
        <Icon name="search" size={17} color={K.ink3} />
        Rechercher…
        <span style={{ marginLeft: "auto", background: "#eef0f8", borderRadius: 16, padding: "6px 12px", fontSize: 13.5, color: K.ink2 }}>Dans ce dossier ⌄</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: K.ink3, margin: "14px 2px 12px", paddingBottom: 12, borderBottom: `1px solid ${K.line}` }}>
        <Icon name="info-circle" size={15} color={K.ink3} />
        {info}
      </div>
      {folders && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 8px" }}>
          {folders.map((d) => (
            <div key={d.name} style={{ position: "relative", textAlign: "center", padding: "8px 4px 6px", borderRadius: 16, background: d.hl ? `rgba(249,135,26,${0.1 * d.hl})` : "transparent", boxShadow: d.hl ? `0 0 0 ${3 * d.hl}px rgba(249,135,26,.6)` : "none" }}>
              <Icon name="folder-fill" size={72} color={K.folder} />
              <div style={{ fontSize: 16.5, fontWeight: 600, color: K.ink, marginTop: 2 }}>{d.name}</div>
              <div style={{ fontSize: 13, color: K.ink3 }}>{d.date}</div>
              <div style={{ position: "absolute", right: 8, top: 6, width: 28, height: 28, borderRadius: 8, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="three-dots-vertical" size={14} color={K.ink2} />
              </div>
            </div>
          ))}
        </div>
      )}
      {files && (
        <div>
          {files.map((r) => (
            <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", borderRadius: 14, marginBottom: 4, background: r.hl ? `rgba(249,135,26,${0.12 * r.hl})` : "transparent", boxShadow: r.hl ? `0 0 0 ${3 * r.hl}px rgba(249,135,26,.7)` : "none" }}>
              <Icon name={r.icon ?? "file-earmark-pdf-fill"} size={30} color={r.color ?? "#e03131"} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16.5, fontWeight: 600, color: K.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                <div style={{ fontSize: 13, color: K.ink3 }}>{r.meta}</div>
              </div>
              <Icon name="three-dots-vertical" size={16} color={K.ink3} />
            </div>
          ))}
        </div>
      )}
      {photos !== undefined && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {Array.from({ length: photos }).map((_, i) => {
            const q = Math.max(0, Math.min(1, photoIn - i));
            return (
              <div key={i} style={{ opacity: q, transform: `scale(${0.6 + 0.4 * q})` }}>
                <PhotoArt v={i} size={110} radius={10} />
              </div>
            );
          })}
        </div>
      )}
    </div>
    {children}
  </div>
);

// Fenêtre « Lien de partage » (libellés du site) en bas de l'écran ; created : lien affiché
export const ShareSheet: React.FC<{ p: number; title: string; created: boolean; press: number }> = ({ p, title, created, press }) => (
  <div style={{ position: "absolute", inset: 0, background: `rgba(21,28,60,${0.4 * p})` }}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 430, background: "#fff", borderRadius: "26px 26px 0 0", padding: "18px 20px", transform: `translateY(${(1 - p) * 440}px)`, fontFamily: FONT, boxShadow: "0 -10px 30px rgba(0,0,0,.15)" }}>
      <div style={{ width: 46, height: 5, borderRadius: 3, background: "#d6d9e4", margin: "0 auto 14px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 19, fontWeight: 700, color: K.ink }}>
        <Icon name="link-45deg" size={22} color={K.orange2} />
        Lien de partage
      </div>
      <div style={{ fontSize: 13.5, color: K.ink2, lineHeight: 1.45, margin: "8px 0 14px" }}>
        Toute personne qui possède le lien pourra ouvrir et télécharger <b>{title}</b>, sans compte Stokara.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          ["Valable", "30 jours ⌄"],
          ["Mot de passe (facultatif)", ""],
        ].map(([l, v]) => (
          <div key={l}>
            <div style={{ fontSize: 12.5, color: K.ink2, marginBottom: 4 }}>{l}</div>
            <div style={{ height: 40, borderRadius: 10, border: `1.5px solid ${K.line}`, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 15, color: K.ink }}>{v}</div>
          </div>
        ))}
      </div>
      {!created ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, height: 44, padding: "0 20px", borderRadius: 12, background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, color: "#fff", fontSize: 16, fontWeight: 600, boxShadow: `0 8px 18px rgba(249,135,26,.35), 0 0 0 ${press * 6}px rgba(249,135,26,.25)`, transform: `scale(${1 - 0.06 * press})` }}>＋ Créer le lien</div>
      ) : (
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <div style={{ flex: 1, height: 44, borderRadius: 10, background: "#f5f6fb", border: `1.5px solid ${K.line}`, display: "flex", alignItems: "center", padding: "0 10px", fontFamily: "'DejaVu Sans Mono', monospace", fontSize: 12.5, color: K.ink, whiteSpace: "nowrap", overflow: "hidden" }}>https://stokara.entrelyo.fr/s/8f2a61c9…</div>
          <div style={{ height: 44, padding: "0 14px", borderRadius: 10, background: K.blue, color: "#fff", display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 600 }}>
            <Icon name="clipboard" size={15} color="#fff" /> Copier
          </div>
        </div>
      )}
      {created && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 14.5, fontWeight: 600, color: K.green, background: "#e6f4ea", borderRadius: 14, padding: "6px 12px" }}>
          <Icon name="check-circle-fill" size={15} color={K.green} /> Lien créé et copié dans le presse-papiers
        </div>
      )}
    </div>
  </div>
);

// Cadre de téléphone autour d'un écran MobileUI (w = largeur de l'écran à l'image)
export const PhoneFrame: React.FC<{ w: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ w, style, children }) => {
  const s = w / MW;
  const b = w * 0.045;
  return (
    <div style={{ position: "absolute", width: w + 2 * b, height: MH * s + 2 * b, borderRadius: w * 0.14, background: "#161b2e", boxShadow: "0 40px 80px rgba(21,28,60,.38), inset 0 0 0 2px #3a4160", padding: b, boxSizing: "border-box", ...style }}>
      <div style={{ position: "relative", width: w, height: MH * s, borderRadius: w * 0.11, overflow: "hidden" }}>
        <div style={{ width: MW, height: MH, transform: `scale(${s})`, transformOrigin: "0 0" }}>{children}</div>
        <div style={{ position: "absolute", left: w / 2 - w * 0.14, top: w * 0.022, width: w * 0.28, height: w * 0.07, borderRadius: w * 0.035, background: "#0b0e18" }} />
      </div>
    </div>
  );
};
