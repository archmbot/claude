// Scènes de la publicité « Particuliers et familles » (1080 × 1920). Images absolues (repères E).
// Interface mobile de Stokara reconstituée (mobile.tsx) pour un espace familial fictif « Famille Martin ».
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { IconName } from "../stokara/icons";
import { QylineBadge } from "../stokara/ui";
import { FONT, FileTile, Icon, K, Logo, Pop, SceneWrap, clamp, lin, sp, useF } from "../stokara-pub/kit";
import { LogoBurst, card } from "../stokara-pub/shots";
import { FileRow, Folder, MobileUI, PhoneFrame, PhotoArt, ShareSheet } from "./mobile";
import { E, SCENE } from "./timing";

const SPACE = "Famille Martin";
const FOLDERS: Folder[] = [
  { name: "Photos", date: "il y a 2 j" },
  { name: "Papiers", date: "03/09" },
  { name: "Vacances 2026", date: "il y a 2 j" },
  { name: "Maison", date: "28/10" },
];

// Point de contact du doigt (coordonnées de l'écran du téléphone)
const Touch: React.FC<{ f: number; x: number; y: number; at: number; from: number; to: number }> = ({ f, x, y, at, from, to }) => {
  if (f < from || f > to) return null;
  const t = f - at;
  const press = t >= -3 && t < 6 ? interpolate(t, [-3, 0, 6], [0, 1, 0], clamp) : 0;
  const ring = t >= 0 && t < 16 ? t / 16 : -1;
  const o = interpolate(f, [from, from + 4, to - 4, to], [0, 1, 1, 0], clamp);
  return (
    <>
      {ring >= 0 && <div style={{ position: "absolute", left: x - 10 - 30 * ring, top: y - 10 - 30 * ring, width: 20 + 60 * ring, height: 20 + 60 * ring, borderRadius: "50%", border: `4px solid ${K.orange}`, opacity: 1 - ring }} />}
      <div style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: "rgba(255,255,255,.55)", border: "3px solid rgba(21,28,60,.35)", boxShadow: "0 6px 14px rgba(21,28,60,.25)", opacity: o, transform: `scale(${1 - 0.25 * press})` }} />
    </>
  );
};

// ====================================================================== 1-2. Souvenirs éparpillés, puis rassemblés dans Stokara
type Item = { k: "photo" | "doc" | "icon"; v?: number; name?: string; icon?: IconName; x: number; y: number; r: number };
const ITEMS: Item[] = [
  { k: "photo", v: 0, x: 150, y: 600, r: -12 },
  { k: "photo", v: 3, x: 900, y: 590, r: 10 },
  { k: "doc", name: "Carte grise.pdf", x: 560, y: 760, r: 6 },
  { k: "photo", v: 1, x: 150, y: 960, r: 8 },
  { k: "icon", icon: "usb-drive", x: 400, y: 560, r: -18 },
  { k: "doc", name: "Facture EDF.pdf", x: 330, y: 1220, r: -6 },
  { k: "photo", v: 6, x: 900, y: 1000, r: -8 },
  { k: "icon", icon: "phone", x: 720, y: 1240, r: 12 },
  { k: "photo", v: 4, x: 560, y: 1040, r: 4 },
  { k: "icon", icon: "laptop", x: 760, y: 800, r: -8 },
];
const PH = { w: 360, x: 540, top: 500 }; // téléphone de la scène « tout au même endroit »
const ItemView: React.FC<{ it: Item }> = ({ it }) => {
  if (it.k === "photo")
    return (
      <div style={{ background: "#fff", padding: "10px 10px 26px", borderRadius: 8, boxShadow: "0 16px 32px rgba(21,28,60,.22)" }}>
        <PhotoArt v={it.v ?? 0} size={170} radius={4} />
      </div>
    );
  if (it.k === "doc")
    return (
      <div style={{ textAlign: "center", fontFamily: FONT }}>
        <FileTile kind="pdf" size={120} style={{ margin: "0 auto" }} />
        <div style={{ fontSize: 24, fontWeight: 600, color: K.ink, marginTop: 10, background: "rgba(255,255,255,.85)", borderRadius: 10, padding: "2px 10px", whiteSpace: "nowrap" }}>{it.name}</div>
      </div>
    );
  return (
    <div style={{ width: 130, height: 130, borderRadius: 65, background: "#fff", boxShadow: "0 16px 32px rgba(21,28,60,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={it.icon ?? "usb-drive"} size={64} color={K.ink2} />
    </div>
  );
};
export const ActGather: React.FC = () => {
  const f = useF();
  const burst = f >= E.scatter ? Math.exp(-(f - E.scatter) / 10) : 0;
  const phoneP = sp(f, SCENE.gather + 8, 15, 140);
  const nFolders = Math.max(0, Math.min(4, Math.floor((f - E.gather - 10) / 5)));
  return (
    <SceneWrap from={SCENE.hook} to={SCENE.family}>
      {f >= SCENE.gather && (
        <div style={{ position: "absolute", left: PH.x - PH.w / 2 - 16, top: PH.top, opacity: interpolate(phoneP, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - phoneP) * 300}px)` }}>
          <PhoneFrame w={PH.w}>
            <MobileUI space={SPACE} crumbs={[SPACE]} info={`${nFolders} dossiers`} folders={FOLDERS.slice(0, nFolders)} />
          </PhoneFrame>
        </div>
      )}
      {ITEMS.map((it, i) => {
        const fly = lin(f, E.gather + i * 2, E.gather + 16 + i * 2);
        if (fly >= 1) return null;
        const dx = Math.sin(f / 22 + i * 1.7) * 14 + (it.x - 540) * 0.12 * burst;
        const dy = Math.cos(f / 19 + i) * 12 + (it.y - 900) * 0.12 * burst;
        const x = it.x + dx + (PH.x - it.x - dx) * fly;
        const y = it.y + dy + (900 - it.y - dy) * fly;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${it.r + Math.sin(f / 15 + i) * 4}deg) scale(${(1 + 0.15 * burst) * (1 - 0.8 * fly)})`, opacity: 1 - fly * 0.6 }}>
            <ItemView it={it} />
          </div>
        );
      })}
      {f < SCENE.gather && (
        <div style={{ position: "absolute", left: 540 - 60, top: 860, width: 120, height: 120, borderRadius: 60, background: K.orange, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 76, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(249,135,26,.45)", transform: `scale(${(0.85 + 0.15 * Math.abs(Math.sin(f / 9))) * (1 + 0.3 * burst)})` }}>?</div>
      )}
      <Pop at={E.online} style={{ position: "absolute", left: 30, top: 760 }} scale>
        <div style={{ ...card, borderRadius: 40, padding: "14px 24px 14px 14px", display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 700, color: K.ink }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: `linear-gradient(135deg, ${K.blue}, ${K.navy})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="cloud-check-fill" size={28} color="#fff" />
          </div>
          En ligne
        </div>
      </Pop>
      <Pop at={E.chiffre} style={{ position: "absolute", right: 30, top: 980 }} scale>
        <div style={{ ...card, borderRadius: 40, padding: "14px 24px 14px 14px", display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 700, color: K.ink }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: K.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="lock-fill" size={26} color="#fff" />
          </div>
          Chiffré
        </div>
      </Pop>
      <LogoBurst f={f} at={E.logo} />
    </SceneWrap>
  );
};

// ====================================================================== 3. Jusqu'à 5 membres, l'album sur chaque téléphone
const MEMBERS: { ini: string; name: string; c: string }[] = [
  { ini: "P", name: "Papa", c: K.navy },
  { ini: "M", name: "Maman", c: K.pink },
  { ini: "L", name: "Léa", c: K.orange },
  { ini: "H", name: "Hugo", c: K.teal },
  { ini: "M", name: "Mamie", c: K.violet },
];
const Album: React.FC<{ photoIn: number }> = ({ photoIn }) => <MobileUI space={SPACE} crumbs={[SPACE, "Vacances 2026"]} info="48 photos" photos={12} photoIn={photoIn} />;
export const ActFamily: React.FC = () => {
  const f = useF();
  const photoIn = interpolate(f, [SCENE.family + 34, E.photos + 6], [0, 12], clamp);
  const side = sp(f, E.phone - 12, 14, 140);
  const center = sp(f, SCENE.family + 30, 15, 140);
  return (
    <SceneWrap from={SCENE.family} to={SCENE.papers}>
      {MEMBERS.map((m, i) => (
        <Pop key={m.name} at={SCENE.family + 8 + i * 9} style={{ position: "absolute", left: 540 + (i - 2) * 196 - 70, top: 486, width: 140, textAlign: "center", fontFamily: FONT }} scale>
          <div style={{ width: 112, height: 112, margin: "0 auto", borderRadius: 56, background: m.c, color: "#fff", fontWeight: 700, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", border: "6px solid #fff", boxShadow: "0 14px 30px rgba(21,28,60,.22)" }}>{m.ini}</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: K.ink, marginTop: 8 }}>{m.name}</div>
        </Pop>
      ))}
      <Pop at={E.five} style={{ position: "absolute", left: 0, right: 0, top: 680, display: "flex", justifyContent: "center" }} scale>
        <div style={{ ...card, borderRadius: 40, padding: "10px 26px", display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 700, color: "#fff", background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})` }}>
          <Icon name="people-fill" size={32} color="#fff" />
          Jusqu'à 5 membres
        </div>
      </Pop>
      {/* l'album, sur chaque téléphone */}
      {[-1, 1].map((d) => (
        <div key={d} style={{ position: "absolute", left: 540 + d * 290 - 128, top: 800, opacity: interpolate(side, [0, 0.3], [0, 1], clamp), transform: `translateX(${(1 - side) * d * 300}px) rotate(${d * 9 * side}deg)` }}>
          <PhoneFrame w={230}>
            <Album photoIn={12} />
          </PhoneFrame>
        </div>
      ))}
      <div style={{ position: "absolute", left: 540 - 150, top: 770, opacity: interpolate(center, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - center) * 300}px)` }}>
        <PhoneFrame w={270}>
          <Album photoIn={photoIn} />
        </PhoneFrame>
      </div>
    </SceneWrap>
  );
};

// ====================================================================== 4. Les papiers, toujours sous la main
const PAPERS: { name: string; meta: string }[] = [
  { name: "Carte grise.pdf", meta: "Ajouté par Papa · 214 Ko" },
  { name: "Factures EDF 2026.pdf", meta: "Ajouté par Maman · 88 Ko" },
  { name: "Assurance habitation.pdf", meta: "Ajouté par Papa · 132 Ko" },
  { name: "Impôts 2026.pdf", meta: "Ajouté par Maman · 64 Ko" },
  { name: "Livret de famille.pdf", meta: "Ajouté par Papa · 1,2 Mo" },
  { name: "Bulletin de Léa.pdf", meta: "Ajouté par Maman · 96 Ko" },
];
const PAPER_CUES = () => [E.grise, E.factures, E.assurance];
export const ActPapers: React.FC = () => {
  const f = useF();
  const p = sp(f, SCENE.papers + 4, 15, 140);
  const cues = PAPER_CUES();
  const cur = cues.filter((c) => f >= c).length - 1;
  const rows: FileRow[] = PAPERS.map((d, i) => ({ ...d, hl: i === cur ? sp(f, cues[i], 12, 220) : 0 }));
  const side: { x: number; y: number; right?: boolean }[] = [
    { x: 30, y: 600 },
    { x: 30, y: 860, right: true },
    { x: 30, y: 1120 },
  ];
  return (
    <SceneWrap from={SCENE.papers} to={SCENE.link}>
      <div style={{ position: "absolute", left: PH.x - PH.w / 2 - 16, top: PH.top, opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * 300}px)` }}>
        <PhoneFrame w={PH.w}>
          <MobileUI space={SPACE} crumbs={[SPACE, "Papiers"]} info="6 fichiers" files={rows} />
        </PhoneFrame>
      </div>
      {cues.map((c, i) => {
        const s = side[i];
        const q = sp(f, c + 2, 12, 200);
        if (f < c + 1) return null;
        return (
          <div key={i} style={{ position: "absolute", top: s.y, [s.right ? "right" : "left"]: s.x, width: 250, textAlign: "center", fontFamily: FONT, opacity: interpolate(q, [0, 0.3], [0, 1], clamp), transform: `translateX(${(1 - q) * (s.right ? -120 : 120)}px) rotate(${(s.right ? 6 : -6) * q}deg) scale(${0.6 + 0.4 * q})` }}>
            <FileTile kind="pdf" size={120} style={{ margin: "0 auto" }} />
            <div style={{ fontSize: 26, fontWeight: 700, color: K.ink, marginTop: 10, background: "rgba(255,255,255,.9)", borderRadius: 12, padding: "4px 10px", display: "inline-block" }}>{PAPERS[i].name.replace(".pdf", "").replace(" 2026", "")}</div>
          </div>
        );
      })}
    </SceneWrap>
  );
};

// ====================================================================== 5. Un album entier, un simple lien
const LINK_PH = { w: 360, x: 400, top: 500 };
const DOTS_VACANCES: [number, number] = [169, 501]; // « ⋮ » de la tuile « Vacances 2026 » (écran 390 × 844)
const CREATE_BTN: [number, number] = [100, 632]; // « Créer le lien » dans la fenêtre du bas
export const ActLink: React.FC = () => {
  const f = useF();
  const p = sp(f, SCENE.link + 4, 15, 140);
  const sheet = f >= E.album ? lin(f, E.album, E.album + 9) : 0;
  const created = f >= E.lien;
  const press = f >= E.lien - 6 && f < E.lien ? interpolate(f, [E.lien - 6, E.lien - 3, E.lien], [0, 1, 0], clamp) : 0;
  const bubble = sp(f, E.lien + 6, 13, 200);
  return (
    <SceneWrap from={SCENE.link} to={SCENE.price}>
      <div style={{ position: "absolute", left: LINK_PH.x - LINK_PH.w / 2 - 16, top: LINK_PH.top, opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * 300}px)` }}>
        <PhoneFrame w={LINK_PH.w}>
          <MobileUI space={SPACE} crumbs={[SPACE]} info="4 dossiers" folders={FOLDERS.map((d, i) => ({ ...d, hl: i === 2 && f >= E.album - 4 ? 1 : 0 }))}>
            {sheet > 0 && <ShareSheet p={sheet} title="Vacances 2026" created={created} press={press} />}
            <Touch f={f} x={DOTS_VACANCES[0]} y={DOTS_VACANCES[1]} at={E.album - 4} from={E.album - 16} to={E.album + 2} />
            <Touch f={f} x={CREATE_BTN[0]} y={CREATE_BTN[1]} at={E.lien - 3} from={E.lien - 14} to={E.lien + 6} />
          </MobileUI>
        </PhoneFrame>
      </div>
      {/* le lien part chez Mamie */}
      {f >= E.lien + 5 && (
        <div style={{ position: "absolute", left: 620, top: 860, width: 430, opacity: interpolate(bubble, [0, 0.3], [0, 1], clamp), transform: `translateX(${(1 - bubble) * 160}px) scale(${0.7 + 0.3 * bubble})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, fontFamily: FONT }}>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: K.violet, color: "#fff", fontWeight: 700, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #fff", boxShadow: "0 8px 18px rgba(21,28,60,.2)" }}>M</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: K.ink }}>Mamie</div>
          </div>
          <div style={{ ...card, borderRadius: "26px 26px 26px 6px", padding: "16px 20px", fontSize: 26, color: K.ink, lineHeight: 1.3 }}>
            Les photos des vacances ! <Icon name="heart-fill" size={24} color={K.pink} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 21, color: K.blue, fontWeight: 600, background: "#eef1fb", borderRadius: 12, padding: "8px 12px" }}>
              <Icon name="link-45deg" size={22} color={K.blue} />
              stokara.entrelyo.fr/s/8f2a…
            </div>
            <div style={{ fontSize: 19, color: K.ink3, marginTop: 8 }}>Ouvert sans compte · 48 photos</div>
          </div>
        </div>
      )}
    </SceneWrap>
  );
};

// ====================================================================== 6. 3 € par mois pour 20 Go
const Feature: React.FC<{ at: number; label: string; icon: IconName; hl?: boolean }> = ({ at, label, icon, hl }) => {
  const f = useF();
  const q = sp(f, at, 13, 220);
  if (f < at - 1) return null;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 56, padding: "0 22px", borderRadius: 28, fontFamily: FONT, fontSize: 27, fontWeight: hl ? 700 : 600, background: hl ? K.orange : "#f1f3fa", color: hl ? "#fff" : K.ink2, transform: `scale(${0.6 + 0.4 * q})`, opacity: q }}>
      <Icon name={icon} size={26} color={hl ? "#fff" : K.blue} />
      {label}
    </div>
  );
};
export const ActPrice: React.FC = () => {
  const f = useF();
  const q = sp(f, E.price, 9, 210);
  return (
    <SceneWrap from={SCENE.price} to={SCENE.end}>
      <Pop at={SCENE.price + 3} style={{ position: "absolute", left: 40, top: 500, width: 1000 }} dy={60}>
        <div style={{ ...card, padding: "40px 44px 36px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -60, top: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, #ffe0bd 0%, #ffad5a 26%, #f9871a 55%, #c55a06 100%)", opacity: 0.18 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 96, height: 96, borderRadius: 28, background: `linear-gradient(135deg, #ffad5a, ${K.orange2})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="house-fill" size={52} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 54, fontWeight: 700, color: K.ink }}>Particulier</div>
              <div style={{ fontSize: 28, color: K.ink2 }}>Pas besoin d'être une entreprise</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, margin: "30px 0 26px", color: K.navy, transform: `scale(${f < E.price ? 0.001 : 0.4 + 0.6 * q})`, transformOrigin: "0 70%", opacity: f < E.price ? 0 : 1 }}>
            <span style={{ fontSize: 170, fontWeight: 700, lineHeight: 0.9, letterSpacing: -4 }}>3 €</span>
            <span style={{ fontSize: 40, fontWeight: 500, color: K.ink2 }}>par mois</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Feature at={E.go} label="20 Go en ligne, chiffrés" icon="cloud-check-fill" hl />
            <Feature at={E.go + 4} label="Jusqu'à 5 membres" icon="people-fill" />
            <Feature at={E.go + 7} label="Téléphone et PC" icon="phone-fill" />
            <Feature at={E.go + 10} label="Partage par lien" icon="link-45deg" />
          </div>
        </div>
      </Pop>
    </SceneWrap>
  );
};

// ====================================================================== 7. Plan de fin
const POLAROIDS: { v: number; x: number; y: number; r: number }[] = [
  { v: 0, x: 150, y: 420, r: -14 },
  { v: 1, x: 930, y: 400, r: 12 },
  { v: 3, x: 85, y: 640, r: 8 },
  { v: 6, x: 995, y: 630, r: -10 },
];
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
      {POLAROIDS.map((pp, i) => {
        const q = sp(f, SCENE.end + 6 + i * 4, 12, 160);
        return (
          <div key={i} style={{ position: "absolute", left: pp.x - 75, top: pp.y + Math.sin(f / 16 + i) * 10, background: "#fff", padding: "8px 8px 22px", borderRadius: 6, boxShadow: "0 14px 30px rgba(21,28,60,.22)", transform: `rotate(${pp.r}deg) scale(${q})`, opacity: q }}>
            <PhotoArt v={pp.v} size={134} radius={3} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 540 - 140, top: 400, transform: `scale(${p}) rotate(${(1 - p) * -25}deg)` }}>
        <Logo size={280} style={{ filter: "drop-shadow(0 26px 40px rgba(26,35,126,.35))" }} />
      </div>
      <Pop at={SCENE.end + 8} style={{ position: "absolute", left: 0, right: 0, top: 710, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 124, fontWeight: 700, color: K.navy, letterSpacing: -2, lineHeight: 1 }}>Stokara</div>
      </Pop>
      <Pop at={SCENE.end + 16} style={{ position: "absolute", left: 40, right: 40, top: 860, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontSize: 56, fontWeight: 600, color: K.ink, lineHeight: 1.15 }}>
          Les souvenirs de la famille,
          <br />
          <span style={{ background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontWeight: 700 }}>bien à l'abri.</span>
        </div>
      </Pop>
      <Pop at={SCENE.end + 26} style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center" }} scale>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 50px", borderRadius: 60, background: `linear-gradient(90deg, ${K.orange}, ${K.orange2})`, color: "#fff", fontFamily: FONT, fontSize: 44, fontWeight: 700, boxShadow: "0 18px 40px rgba(249,135,26,.45)", transform: `scale(${cta})` }}>
          Créer mon compte
          <Icon name="arrow-right" size={38} color="#fff" />
        </div>
      </Pop>
      <Pop at={SCENE.end + 32} style={{ position: "absolute", left: 0, right: 0, top: 1200, textAlign: "center", fontFamily: FONT }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: 42, fontWeight: 600, color: K.blue }}>
          <Icon name="globe2" size={36} color={K.blue} />
          stokara.entrelyo.fr
        </div>
      </Pop>
      <Pop at={SCENE.end + 38} style={{ position: "absolute", left: 40, right: 40, top: 1290, textAlign: "center", fontFamily: FONT }}>
        <div style={{ display: "inline-block", fontSize: 32, fontWeight: 500, color: K.ink2, background: "rgba(255,255,255,.85)", borderRadius: 30, padding: "10px 26px" }}>
          Particuliers <b style={{ color: K.navy }}>3 €/mois</b> · 20 Go · 5 membres
        </div>
      </Pop>
      <Pop at={SCENE.end + 44} style={{ position: "absolute", left: 0, right: 0, top: 1400, display: "flex", justifyContent: "center" }}>
        <QylineBadge />
      </Pop>
    </AbsoluteFill>
  );
};
