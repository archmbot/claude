// « Pourquoi l'informatique coûte-t-elle si cher ? » — 1 min, 1920 × 1080, d'après un devis réel
// de mise en service d'un NAS partagé par deux personnes (accès local et à distance).
// Même charte que la formation réseaux (src/reseau/ui.tsx). À gauche, la prestation expliquée ;
// à droite, le devis, dont chaque ligne s'allume quand la voix l'explique.
import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Subtitles } from "../components/Subtitles";
import { useFonts } from "../qyline/shared";
import { Background, C, Chip, Device, FONT, Icon, Mark, Packet, Panel, Pos, Txt, Wire, clamp, prog, type IconKind } from "../reseau/ui";
import { DURATION, SEQS, timing } from "./timing";
import { VOICE } from "./voice";

const CAPTIONS = VOICE.words.map((w) => ({ text: w.text, start: w.start, end: w.end, scene: w.seq, sentence: w.para }));
// image absolue d'un repère vocal
const abs = (seq: number, phrase: string, off = 0) => SEQS[seq].from + timing(seq).T(phrase, 0, off);

// Lignes du devis, telles qu'écrites (quantité 1, montants HT)
const LINES: { l: string; p: string; seq: number; cue: string }[] = [
  { l: "Installation et configuration du serveur", p: "140,00 €", seq: 1, cue: "installer" },
  { l: "Création et organisation des dossiers partagés", p: "70,00 €", seq: 1, cue: "créer et organiser" },
  { l: "Configuration des identifiants et mots de passe", p: "60,00 €", seq: 2, cue: "les identifiants" },
  { l: "Gestion des droits d'accès", p: "90,00 €", seq: 2, cue: "les droits" },
  { l: "Création et configuration du portail intranet web", p: "150,00 €", seq: 3, cue: "un portail" },
  { l: "Accès extérieur sécurisé HTTPS", p: "120,00 €", seq: 3, cue: "un accès extérieur" },
  { l: "Configuration RAID et sauvegardes", p: "80,00 €", seq: 4, cue: "Le RAID" },
  { l: "Notifications e-mail", p: "0,00 €", seq: 4, cue: "Les notifications" },
];

// ------------------------------------------------------------------ le devis (colonne de droite)
const Quote: React.FC = () => {
  const f = useCurrentFrame();
  const open = abs(0, "Voici un vrai devis");
  if (f < open - 1) return null;
  const walk = SEQS[1].from; // à partir d'ici, les lignes s'allument une à une
  const final = SEQS[5].from;
  const starts = LINES.map((r) => abs(r.seq, r.cue));
  const active = starts.filter((s) => f >= s).length - 1;
  return (
    <Pos x={1525} y={520} at={open}>
      <div style={{ width: 710, height: 800, boxSizing: "border-box", borderRadius: 22, background: C.panel, border: `3px solid ${C.line}`, padding: "24px 28px", fontFamily: FONT, color: C.text, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Icon kind="file" size={46} color={C.data} />
          <div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>Devis</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: C.muted }}>Mise en service d'un NAS partagé · quantité 1 par ligne</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, padding: "8px 12px", borderRadius: 8, background: "rgba(59,130,246,0.18)", fontSize: 20, fontWeight: 800, color: C.muted }}>
          <span>Désignation</span>
          <span>Montant HT</span>
        </div>
        {LINES.map((r, i) => {
          const isActive = f >= walk && f < final && i === active;
          const done = f < walk || f >= final || i <= active;
          const p = f >= walk ? prog(f, starts[i], 8) : 1;
          return (
            <div
              key={r.l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 14,
                minHeight: 62,
                padding: "6px 12px",
                borderBottom: `1px solid ${C.line}`,
                borderLeft: `6px solid ${isActive ? C.data : "transparent"}`,
                background: isActive ? "rgba(249,115,22,0.14)" : "transparent",
                opacity: done ? (f >= walk && f < final ? 0.35 + 0.65 * p : 1) : 0.35,
              }}
            >
              <span style={{ fontSize: 23, fontWeight: isActive ? 800 : 600, lineHeight: 1.2 }}>{r.l}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 25, fontWeight: 800, color: isActive ? C.data : C.text, whiteSpace: "nowrap" }}>
                {r.p === "0,00 €" && f >= starts[i] && <span style={{ fontSize: 18, padding: "2px 8px", borderRadius: 8, background: C.green, color: "#0B1220" }}>offert</span>}
                {r.p}
              </span>
            </div>
          );
        })}
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 14px",
            borderRadius: 12,
            background: f >= final ? "rgba(249,115,22,0.18)" : "rgba(30,41,59,0.9)",
            border: `2px solid ${f >= final ? C.data : C.line}`,
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 800 }}>Total HT</span>
          <span style={{ fontSize: 40, fontWeight: 800, color: C.data, transform: `scale(${1 + 0.08 * Math.sin(Math.min(1, prog(f, final, 12)) * Math.PI)})` }}>710,00 €</span>
        </div>
      </div>
    </Pos>
  );
};

// ------------------------------------------------------------------ titre
const Title: React.FC = () => {
  const f = useCurrentFrame();
  const small = prog(f, abs(0, "Voici un vrai devis") - 8, 14);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: FONT, opacity: 1 - small }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: C.text }}>Pourquoi l'informatique coûte-t-elle si cher ?</div>
        <div style={{ marginTop: 14, fontSize: 36, fontWeight: 700, color: C.device }}>Un vrai devis : un NAS partagé par deux personnes</div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 44, fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.muted, opacity: small }}>
        Pourquoi l'informatique coûte-t-elle si cher ? <span style={{ color: C.device }}>· Un vrai devis de NAS</span>
      </div>
    </>
  );
};

// ------------------------------------------------------------------ étapes (zone de gauche, centre x = 600)
const Hook: React.FC = () => {
  const { T } = timing(0);
  const nas = T("un NAS");
  return (
    <>
      <Device kind="nas" x={600} y={470} size={180} color={C.server} label="NAS" at={nas} />
      <Wire pts={[[330, 470], [510, 470]]} at={T("au bureau")} />
      <Device kind="computer" x={250} y={470} size={120} label="Au bureau" labelSize={24} at={T("au bureau")} />
      <Wire pts={[[690, 470], [870, 470]]} kind="dashed" at={T("à distance")} />
      <Device kind="laptop" x={950} y={470} size={120} label="À distance" labelSize={24} at={T("à distance")} />
      <Pos x={780} y={430} at={T("à distance")}>
        <Icon kind="lock" size={40} color={C.green} />
      </Pos>
      <Pos x={600} y={300} at={T("deux personnes")}>
        <div style={{ display: "flex", gap: 30 }}>
          <Icon kind="person" size={70} color={C.copper} />
          <Icon kind="person" size={70} color={C.copper} />
        </div>
      </Pos>
      <Pos x={600} y={790} at={T("Total")}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.data }}>
          710 € <span style={{ fontSize: 44, color: C.muted }}>HT</span>
        </div>
      </Pos>
    </>
  );
};

const Folders: React.FC = () => {
  const f = useCurrentFrame();
  const { T } = timing(1);
  const inst = T("installer");
  const done = T("créer et organiser");
  const progress = interpolate(f, [inst, done], [0, 1], clamp);
  const folders = [
    { l: "Commun", x: 330, cue: "un dossier commun" },
    { l: "Léa", x: 600, cue: "un dossier pour chacun" },
    { l: "Karim", x: 870, cue: "un dossier pour chacun" },
  ];
  return (
    <>
      <Device kind="nas" x={600} y={330} size={170} color={C.server} label="Serveur NAS" labelSize={24} at={inst} />
      <Pos x={760} y={250} at={inst} until={done + 20}>
        <div style={{ transform: `rotate(${f * 4}deg)` }}>
          <Icon kind="gear" size={70} color={C.wifi} />
        </div>
      </Pos>
      <Pos x={600} y={500} at={inst}>
        <div style={{ width: 420, fontFamily: FONT }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: progress >= 1 ? C.green : C.muted, marginBottom: 6 }}>{progress >= 1 ? "Serveur configuré ✓" : "Installation et configuration…"}</div>
          <div style={{ height: 14, borderRadius: 7, background: C.line, overflow: "hidden" }}>
            <div style={{ width: `${progress * 100}%`, height: "100%", background: progress >= 1 ? C.green : C.wifi }} />
          </div>
        </div>
      </Pos>
      {folders.map((d, i) => (
        <React.Fragment key={d.l}>
          <Wire pts={[[600, 560], [600, 610], [d.x, 610], [d.x, 650]]} at={T(d.cue) + i * 4} />
          <Device kind="folder" x={d.x} y={710} size={110} color={i ? C.device : C.server} label={i ? `Dossier ${d.l}` : "Dossier commun"} labelSize={24} at={T(d.cue) + i * 4} />
        </React.Fragment>
      ))}
    </>
  );
};

const Access: React.FC = () => {
  const f = useCurrentFrame();
  const { T } = timing(2);
  const see = T("qui voit quoi");
  const edit = T("qui peut modifier");
  const cell = (v: "M" | "L" | "-") => {
    const lit = (v === "M" && f >= edit) || (v !== "M" && f >= see && f < edit);
    const label = v === "M" ? "Modifier" : v === "L" ? "Lire" : "—";
    const color = v === "M" ? C.green : v === "L" ? C.device : C.red;
    return <span style={{ padding: "2px 10px", borderRadius: 8, fontSize: 20, fontWeight: 800, color: lit ? "#0B1220" : color, background: lit ? color : "transparent", border: `2px solid ${color}`, textAlign: "center" }}>{label}</span>;
  };
  const rows: [string, "M" | "L" | "-", "M" | "L" | "-"][] = [
    ["Commun", "M", "M"],
    ["Léa", "M", "-"],
    ["Karim", "L", "M"],
  ];
  return (
    <>
      <Panel x={320} y={300} w={460} h={210} at={T("les identifiants")}>
        <div style={{ padding: "20px 26px", fontFamily: FONT, color: C.text }}>
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>Identifiants</div>
          {["Léa", "Karim"].map((n) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 700, marginTop: 8 }}>
              <Icon kind="key" size={30} color={C.wifi} />
              <span style={{ width: 90 }}>{n}</span>
              <span style={{ color: C.muted, letterSpacing: 4 }}>••••••••</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel x={830} y={320} w={500} h={250} at={T("les droits")}>
        <div style={{ padding: "18px 24px", fontFamily: FONT, color: C.text }}>
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>Droits d'accès</div>
          <div style={{ display: "grid", gridTemplateColumns: "150px 140px 140px", rowGap: 10, alignItems: "center", fontSize: 23, fontWeight: 700 }}>
            <span style={{ color: C.muted }}>Dossier</span>
            <span style={{ color: C.muted }}>Léa</span>
            <span style={{ color: C.muted }}>Karim</span>
            {rows.map(([d, a, b]) => (
              <React.Fragment key={d}>
                <span>{d}</span>
                {cell(a)}
                {cell(b)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Panel>
      <Panel x={600} y={700} w={520} h={230} at={T("les identifiants", 0, 0.8)}>
        <div style={{ padding: "22px 30px", fontFamily: FONT, color: C.text }}>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Connexion</div>
          {[
            ["Identifiant", "lea"],
            ["Mot de passe", "••••••••"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 600, padding: "8px 14px", marginBottom: 8, borderRadius: 8, border: `2px solid ${C.line}` }}>
              <span style={{ color: C.muted }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 6, textAlign: "center", padding: "6px 0", borderRadius: 8, background: C.device, color: "#0B1220", fontWeight: 800, fontSize: 22 }}>Se connecter</div>
        </div>
      </Panel>
    </>
  );
};

const Portal: React.FC = () => {
  const { T } = timing(3);
  const portal = T("un portail");
  const ext = T("un accès extérieur");
  const enc = T("les échanges");
  return (
    <>
      <Pos x={600} y={350} at={portal}>
        <div style={{ width: 860, height: 380, borderRadius: 18, border: `3px solid ${C.line}`, background: "#1E293B", overflow: "hidden", fontFamily: FONT }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#0F172A" }}>
            {[C.red, C.wifi, C.green].map((c) => (
              <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
            ))}
            <div style={{ marginLeft: 12, flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 16, background: C.bg, fontSize: 22, fontWeight: 600, color: C.text }}>
              <Icon kind="lock" size={22} color={C.green} />
              https://intranet.exemple.fr
            </div>
          </div>
          <div style={{ padding: "22px 30px" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 18 }}>Portail intranet</div>
            <div style={{ display: "flex", gap: 40 }}>
              {["Commun", "Léa", "Karim"].map((d, i) => (
                <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <Icon kind="folder" size={90} color={i ? C.device : C.server} />
                  <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Pos>
      <Txt x={600} y={570} size={24} color={C.muted} at={T("depuis un navigateur")}>
        tout retrouver depuis un navigateur
      </Txt>
      <Device kind="laptop" x={200} y={780} size={110} label="À l'extérieur" labelSize={22} at={ext} />
      <Device kind="cloud" x={600} y={780} size={130} color={C.internet} label="Internet" labelSize={22} at={ext} />
      <Device kind="nas" x={1000} y={780} size={110} color={C.server} label="NAS" labelSize={22} at={ext} />
      <Wire pts={[[270, 780], [530, 780]]} at={ext} color={C.green} width={10} />
      <Wire pts={[[670, 780], [930, 780]]} at={ext} color={C.green} width={10} />
      <Chip x={400} y={720} color={C.green} size={22} at={T("HTTPS")}>
        HTTPS
      </Chip>
      <Chip x={800} y={720} color={C.green} size={22} at={T("HTTPS")}>
        HTTPS
      </Chip>
      {[0, 1, 2].map((k) => (
        <Packet key={k} pts={[[270, 780], [600, 780], [930, 780]]} t0={enc + k * 12} t1={enc + k * 12 + 40}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon kind="lock" size={24} color="#0B1220" />
          </div>
        </Packet>
      ))}
      <Txt x={600} y={665} size={24} weight={800} color={C.green} at={enc}>
        Échanges chiffrés
      </Txt>
    </>
  );
};

const Safety: React.FC = () => {
  const f = useCurrentFrame();
  const { T } = timing(4);
  const raid = T("Le RAID");
  const fail = T("un disque lâche");
  const err = T("en cas d'erreur");
  const mail = T("Les notifications");
  return (
    <>
      <Pos x={600} y={330} at={raid}>
        <div style={{ width: 400, height: 260, borderRadius: 24, border: `4px solid ${C.server}`, background: "rgba(139,92,246,0.10)" }} />
      </Pos>
      <Txt x={600} y={225} size={24} weight={800} color={C.server} at={raid}>
        RAID : disques en miroir
      </Txt>
      <Device kind="disk" x={515} y={340} size={100} color={C.server} label="Disque 1" labelSize={20} at={raid} />
      <Device kind="disk" x={685} y={340} size={100} color={f >= fail ? C.red : C.server} label="Disque 2" labelSize={20} at={raid} />
      <Mark x={685} y={320} size={54} ok={false} at={fail} />
      <Mark x={515} y={320} size={54} ok at={fail + 10} />
      <Device kind="disk" x={220} y={700} size={100} color={C.green} label="Sauvegarde" labelSize={22} at={T("les sauvegardes")} />
      <Wire pts={[[420, 420], [260, 640]]} kind="dashed" at={T("les sauvegardes")} />
      <Pos x={440} y={720} at={err}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.text }}>
          <Icon kind="file" size={40} color={f < err + 20 ? C.red : C.green} />
          {f < err + 20 ? "fichier effacé par erreur" : "restauré depuis la sauvegarde"}
        </div>
      </Pos>
      <Panel x={890} y={700} w={420} h={190} at={mail}>
        <div style={{ padding: "18px 22px", fontFamily: FONT, color: C.text }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, fontWeight: 800 }}>
            <Icon kind="mail" size={40} color={C.wifi} />
            Alerte du NAS
          </div>
          <div style={{ marginTop: 10, fontSize: 21, fontWeight: 600, color: C.muted }}>Disque 2 en panne : à remplacer</div>
        </div>
      </Panel>
      <Chip x={890} y={830} color={C.green} size={22} at={T("sont offertes")}>
        Offert · 0,00 €
      </Chip>
    </>
  );
};

const Close: React.FC = () => {
  const f = useCurrentFrame();
  const { T } = timing(5);
  const no = T("ce n'est pas");
  const badges: { k: IconKind; l: string; cue: string; c: string }[] = [
    { k: "folder", l: "Organisées", cue: "organisées", c: C.device },
    { k: "shield", l: "Protégées", cue: "protégées", c: C.green },
    { k: "globe", l: "Accessibles", cue: "accessibles", c: C.data },
  ];
  return (
    <>
      <Pos x={600} y={240} at={0}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.data }}>
          710 € <span style={{ fontSize: 44, color: C.muted }}>HT</span>
        </div>
      </Pos>
      <Pos x={600} y={390} at={no}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.muted }}>
          <div style={{ position: "relative" }}>
            <Icon kind="nas" size={80} color={C.muted} />
            <svg width={96} height={96} style={{ position: "absolute", left: -8, top: -8 }}>
              <path d="M8 88L88 8" stroke={C.red} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(f, no + 10, 12)} />
            </svg>
          </div>
          pas le prix d'une boîte…
        </div>
      </Pos>
      <Txt x={600} y={500} size={34} weight={800} at={T("d'un travail")}>
        … mais celui d'un travail qui rend vos données :
      </Txt>
      {badges.map((b, i) => (
        <Pos key={b.l} x={240 + i * 360} y={690} at={T(b.cue)}>
          <div style={{ width: 320, height: 240, borderRadius: 22, background: C.panel, border: `3px solid ${b.c}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Icon kind={b.k} size={100} color={b.c} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.text }}>{b.l}</div>
          </div>
        </Pos>
      ))}
      <Txt x={600} y={880} size={20} color={C.muted} weight={600} at={no}>
        Montants hors taxes, d'après le devis présenté.
      </Txt>
    </>
  );
};

const STAGES = [Hook, Folders, Access, Portal, Safety, Close];

export const NasCout: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  useFonts();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />
      <Html5Audio src={staticFile("nas-cout/audio.wav")} />
      <Title />
      {SEQS.map((s, i) => {
        const Stage = STAGES[i];
        const last = i === SEQS.length - 1;
        const next = SEQS[i + 1]?.from ?? DURATION + 10;
        const o = interpolate(f, [next - 6, next], [1, 0], clamp);
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={last ? DURATION - s.from : s.duration} premountFor={10}>
            <AbsoluteFill style={{ opacity: last ? 1 : o }}>
              <Stage />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Quote />
      {subtitles && <Subtitles words={CAPTIONS} keyPhrases={[]} top={968} left={180} right={180} fontSize={36} keyBg={C.data} keyColor={C.bg} shadow="#020617" maxWords={9} maxChars={56} />}
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [DURATION - 15, DURATION - 1], [0, 1], clamp) }} />
    </AbsoluteFill>
  );
};
