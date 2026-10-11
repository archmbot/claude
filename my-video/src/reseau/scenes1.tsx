// Séquences 1 à 5 du chapitre 1.1 (storyboard, partie D).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { timing } from "./timing";
import { Bubble, C, Chip, Device, FONT, Icon, Mark, Packet, Panel, Plan, Pos, Txt, WifiArcs, Wire, clamp, prog, ramp, vis, type IconKind, type Pt } from "./ui";

// ================================================================== Séquence 1 — Introduction
const S1Devices: React.FC<{ T?: (p: string) => number; still?: boolean }> = ({ T, still }) => {
  const at = (p: string) => (still || !T ? -100 : T(p));
  const links: Pt[][] = [
    [[600, 450], [600, 610]],
    [[690, 390], [1230, 670]],
    [[690, 360], [1210, 360]],
    [[690, 670], [1210, 400]],
  ];
  const linkAt = still || !T ? -100 : T("ont échangé");
  return (
    <>
      {links.map((pts, i) => (
        <Wire key={i} pts={pts} kind="dashed" at={linkAt} />
      ))}
      {!still &&
        links.map((pts, i) => (
          <Loop key={i} pts={i % 2 ? [...pts].reverse() : pts} from={linkAt + 10 + i * 9} period={70} />
        ))}
      <Device kind="computer" x={600} y={360} label="Ordinateur" at={at("Votre ordinateur")} />
      <Device kind="phone" x={600} y={700} label="Smartphone" at={at("votre smartphone")} />
      <Device kind="printer" x={1320} y={700} label="Imprimante" at={at("l'imprimante")} />
      <Pos x={1320} y={380} at={at("l'ordinateur lointain")}>
        <div style={{ width: 260, height: 250, border: `3px solid ${C.server}`, borderRadius: 24, background: "rgba(139,92,246,0.08)" }} />
      </Pos>
      <Device kind="server" x={1320} y={350} size={130} color={C.server} label="Serveur" sub="ordinateur lointain" at={at("l'ordinateur lointain")} />
    </>
  );
};

// Petit paquet qui parcourt une liaison en boucle
const Loop: React.FC<{ pts: Pt[]; from: number; period: number }> = ({ pts, from, period }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const k = ((f - from) % period) / period;
  const t0 = f - k * period;
  return <Packet pts={pts} t0={t0} t1={t0 + period * 0.8} size={22} />;
};

export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const { T, PE, END } = timing(0);
  const titleAt = PE(3) + 5;
  const questions = [
    { at: T("Mais comment"), text: "Comment communiquent-ils ?" },
    { at: T("Comment un document"), text: "Comment le document arrive-t-il à l'imprimante ?" },
    { at: T("Et un réseau"), text: "Réseau = Internet ?" },
  ];
  const tiles: { k: IconKind; l: string; cue: string }[] = [
    { k: "house", l: "Maison", cue: "maison" },
    { k: "school", l: "Lycée", cue: "lycée" },
    { k: "building", l: "Entreprise", cue: "entreprises" },
    { k: "hospital", l: "Hôpital", cue: "hôpitaux" },
    { k: "shop", l: "Magasin", cue: "magasins" },
    { k: "car", l: "Voiture", cue: "voitures" },
  ];
  const fade13 = T("la base de toute");
  const goals = [
    { l: "Définir un réseau", cue: "ce qu'est un réseau" },
    { l: "Expliquer à quoi il sert", cue: "à quoi il sert" },
    { l: "Décrire une communication", cue: "comment deux appareils" },
    { l: "Reconnaître les équipements", cue: "quels équipements" },
    { l: "Un réseau sans Internet", cue: "fonctionner sans Internet" },
  ];
  return (
    <>
      {/* 1.1 trois usages du quotidien */}
      <Plan from={0} to={T("Votre ordinateur")}>
        <Device kind="phone" x={480} y={540} size={170} at={T("message")} />
        <Pos x={480} y={380} at={T("message", 0, 0.4)}>
          <Bubble>Message envoyé</Bubble>
        </Pos>
        <Device kind="laptop" x={960} y={540} size={200} at={T("vidéo")} />
        <Pos x={960} y={540} at={T("vidéo")}>
          <svg width={60} height={60} viewBox="0 0 60 60" style={{ marginTop: -28 }}>
            <path d="M20 14L46 30L20 46Z" fill={C.text} />
          </svg>
        </Pos>
        <Pos x={960} y={680} at={T("vidéo")}>
          <div style={{ width: 220, height: 10, borderRadius: 5, background: C.line, overflow: "hidden" }}>
            <div style={{ width: `${interpolate(f, [T("vidéo"), T("vidéo") + 200], [5, 90], clamp)}%`, height: "100%", background: C.red }} />
          </div>
        </Pos>
        <Device kind="printer" x={1440} y={540} size={170} at={T("imprimé")} />
        <Pos x={1440} y={interpolate(f, [T("imprimé") + 8, T("imprimé") + 40], [600, 690], clamp)} at={T("imprimé", 0, 0.3)}>
          <div style={{ width: 70, height: 50, background: C.text, borderRadius: 4 }} />
        </Pos>
        <Wire pts={[[590, 540], [840, 540]]} kind="dashed" at={T("réseau informatique")} />
        <Wire pts={[[1080, 540], [1330, 540]]} kind="dashed" at={T("réseau informatique")} />
        <Txt x={960} y={200} size={64} weight={800} at={T("réseau informatique")}>
          Réseau informatique
        </Txt>
      </Plan>
      {/* 1.2 appareils qui communiquent */}
      <Plan from={T("Votre ordinateur")} to={T("C'est ce que nous")}>
        <S1Devices T={T} />
        {questions.map((q, i) => (
          <Txt key={q.text} x={960} y={900} size={40} at={q.at} until={questions[i + 1]?.at} color={C.wifi}>
            {q.text}
          </Txt>
        ))}
      </Plan>
      {/* 1.3 les réseaux sont partout */}
      <Plan from={T("C'est ce que nous")} to={T("À la fin de cette")}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 - 0.1 * ramp(f, fade13, fade13 + 20)})`, opacity: 1 - 0.7 * ramp(f, fade13, fade13 + 20) }}>
          {tiles.map((t, i) => {
            const x = 960 + ((i % 3) - 1) * 450;
            const y = 400 + Math.floor(i / 3) * 290;
            return (
              <Pos key={t.l} x={x} y={y} at={T(t.cue)}>
                <div style={{ width: 400, height: 240, borderRadius: 24, background: C.panel, border: `3px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, position: "relative" }}>
                  <Icon kind={t.k} size={110} color={C.device} />
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.text }}>{t.l}</div>
                  <svg width={60} height={30} style={{ position: "absolute", right: 18, top: 16 }}>
                    <path d="M8 22L30 8L52 22" stroke={C.net} strokeWidth={3} fill="none" />
                    {[8, 30, 52].map((cx, k) => (
                      <circle key={k} cx={cx} cy={k === 1 ? 8 : 22} r={5} fill={C.net} />
                    ))}
                  </svg>
                </div>
              </Pos>
            );
          })}
        </div>
      </Plan>
      {/* 1.4 objectifs */}
      <Plan from={T("À la fin de cette")} to={titleAt}>
        <Txt x={240} y={240} size={44} align="left" style={{ transform: "translateX(50%)" }} at={T("À la fin de cette")}>
          À la fin de cette vidéo, vous saurez :
        </Txt>
        {goals.map((g, i) => (
          <React.Fragment key={g.l}>
            <Mark x={270} y={370 + i * 100} size={54} at={T(g.cue)} ok />
            <Pos x={320} y={370 + i * 100} at={T(g.cue)} style={{ transform: `translate(0, -50%) translateY(${(1 - prog(f, T(g.cue))) * 12}px)` }}>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 42, color: i === 4 ? C.data : C.text, whiteSpace: "nowrap" }}>{g.l}</div>
            </Pos>
          </React.Fragment>
        ))}
      </Plan>
      {/* 1.5 titre du chapitre */}
      <Plan from={titleAt} to={END + 30}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, transform: `scale(${interpolate(f, [titleAt, END], [1, 1.05], clamp)})` }}>
          <S1Devices still />
        </div>
        <Txt x={960} y={430} size={32} color={C.muted} at={titleAt}>
          Module 1 — Les fondamentaux des réseaux
        </Txt>
        <Txt x={960} y={500} size={48} color={C.device} weight={800} at={titleAt + 5}>
          Chapitre 1.1
        </Txt>
        <Txt x={960} y={590} size={72} weight={800} at={titleAt + 10}>
          Qu'est-ce qu'un réseau informatique ?
        </Txt>
      </Plan>
    </>
  );
};

// ================================================================== Séquence 2 — Définition
const Definition: React.FC<{ T: (p: string) => number; from: number; up: number; until: number }> = ({ T, from, up, until }) => {
  const f = useCurrentFrame();
  const u = ramp(f, up, up + 15);
  const lit = (cue: number) => prog(f, cue, 8);
  const ideas = T("trois idées");
  const w = (txt: string, color: string, k: number, underline = false) => (
    <span style={{ color: interpolate(lit(ideas + k * 12), [0, 1], [0, 1]) > 0.5 ? color : C.text, textDecoration: underline && lit(ideas + k * 12) > 0.5 ? "underline" : "none", textUnderlineOffset: 8 }}>{txt}</span>
  );
  return (
    <Pos x={960} y={interpolate(u, [0, 1], [420, 150])} at={from} until={until}>
      <div style={{ width: 1400, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: interpolate(u, [0, 1], [50, 34]), color: C.text, lineHeight: 1.3 }}>
        Un réseau informatique est un ensemble d'{w("appareils", C.device, 0)} {w("reliés", C.copper, 1, true)} entre eux pour {w("échanger des données", C.data, 2)}.
      </div>
    </Pos>
  );
};

export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const { T, END } = timing(1);
  const A: Pt = [480, 520];
  const B: Pt = [1440, 520];
  const ex = T("Prenons l'exemple");
  const rules = T("les mêmes règles");
  const proto = T("protocoles");
  const exchanges = [
    { at: T("Un message"), label: "Message", from: A, to: B, el: <Bubble>Bonjour</Bubble> },
    { at: T("Un fichier"), label: "Fichier", from: A, to: B, el: <FileTag name="photo.jpg" /> },
    { at: T("Une information"), label: "Information", from: B, to: A, el: <Bubble color={C.fiber}>Heure : 10:42</Bubble> },
    { at: T("demande de service"), label: "Demande de service", from: A, to: B, el: <Bubble color={C.wifi}>Envoie-moi rapport.pdf</Bubble> },
    { at: T("B lui répond"), label: "Demande de service", from: B, to: A, el: <FileTag name="rapport.pdf" /> },
  ];
  const bits = "01001011 01101001 00110001 11010010 01110101";
  const devices: { k: IconKind; l: string; cue: string }[] = [
    { k: "computer", l: "Ordinateur", cue: "un ordinateur" },
    { k: "phone", l: "Smartphone", cue: "un smartphone" },
    { k: "printer", l: "Imprimante", cue: "une imprimante" },
    { k: "console", l: "Console de jeux", cue: "une console" },
    { k: "tv", l: "Télévision", cue: "une télévision" },
  ];
  const relies = T("Ensuite, reliés");
  const data = T("Enfin, échanger");
  const comm = T("C'est cela, communiquer");
  return (
    <>
      <Definition T={T} from={T("Commençons")} up={T("D'abord")} until={ex} />
      {/* 2.2 appareils + reliés */}
      <Plan from={T("D'abord")} to={data}>
        <Wire pts={[[430, 560], [590, 560]]} at={relies} kind="copper" />
        <Wire pts={[[1030, 560], [1190, 560]]} at={relies} kind="wifi" />
        <WifiArcs x={1110} y={560} r={90} at={relies} />
        {devices.map((d, i) => (
          <Device key={d.l} kind={d.k} x={360 + i * 300} y={560} size={140} label={d.l} at={T(d.cue)} />
        ))}
        <Txt x={510} y={480} size={26} color={C.copper} at={relies}>
          câble
        </Txt>
        <Txt x={1110} y={470} size={26} color={C.wifi} at={relies}>
          ondes radio
        </Txt>
      </Plan>
      {/* 2.3 les données, les bits */}
      <Plan from={data} to={comm}>
        {(["text", "photo", "video", "mouse"] as IconKind[]).map((k, i) => (
          <Device key={k} kind={k} x={340} y={330 + i * 130} size={100} at={data + i * 6} dim={1 - 0.6 * prog(f, T("suites de 0"), 20)} />
        ))}
        {[0, 1, 2, 3].map((i) => {
          const s = T("suites de 0") + i * 5;
          const x = interpolate(f, [s, s + 40], [420, 1000], clamp);
          return (
            <Pos key={i} x={x} y={330 + i * 130} at={s}>
              <div style={{ fontFamily: "monospace", fontSize: 40, fontWeight: 700, color: C.data, whiteSpace: "nowrap" }}>{bits.slice(i * 9, i * 9 + 17)}</div>
            </Pos>
          );
        })}
        <Pos x={1420} y={470} at={T("s'appelle un bit")}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: FONT }}>
            <div style={{ width: 90, height: 90, borderRadius: 14, background: C.data, color: "#0B1220", fontSize: 64, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: C.text }}>= 1 bit</div>
          </div>
        </Pos>
        <Device kind="computer" x={760} y={870} size={90} label="A" labelSize={22} at={T("faire passer ces bits")} />
        <Device kind="computer" x={1300} y={870} size={90} label="B" labelSize={22} at={T("faire passer ces bits")} />
        <Wire pts={[[815, 880], [1245, 880]]} at={T("faire passer ces bits")} />
        <Packet pts={[[815, 850], [1245, 850]]} t0={T("faire passer ces bits") + 10} t1={T("faire passer ces bits") + 60}>
          <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: C.data }}>0110 1001</div>
        </Packet>
      </Plan>
      {/* 2.4 communiquer */}
      <Plan from={comm} to={ex}>
        <Device kind="computer" x={560} y={540} size={160} at={comm} />
        <Device kind="computer" x={1360} y={540} size={160} at={comm} glow={prog(f, T("l'autre reçoit"))} glowColor={C.green} />
        <Wire pts={[[660, 560], [1260, 560]]} at={comm} />
        <Packet pts={[[680, 500], [1240, 500]]} t0={T("l'un envoie")} t1={T("l'un envoie") + 35} hold={60}>
          <svg width={120} height={40}>
            <path d="M5 20H100M85 6L105 20L85 34" stroke={C.data} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Packet>
        {["envoie", "reçoit", "comprend"].map((l, i) => (
          <Txt key={l} x={760 + i * 200} y={650} size={30} color={C.muted} at={T(["l'un envoie", "l'autre reçoit", "les deux interprètent"][i])}>
            {l}
          </Txt>
        ))}
        <Chip x={560} y={400} color={C.green} size={24} at={T("de la même façon")}>
          même format
        </Chip>
        <Chip x={1360} y={400} color={C.green} size={24} at={T("de la même façon")}>
          même format
        </Chip>
      </Plan>
      {/* 2.5 à 2.7 : deux ordinateurs reliés */}
      <Plan from={ex} to={T("Dernière remarque")}>
        <Device kind="computer" x={A[0]} y={A[1]} size={180} label="Ordinateur A" at={T("l'ordinateur A")} />
        <Device kind="computer" x={B[0]} y={B[1]} size={180} label="Ordinateur B" at={T("l'ordinateur B")} />
        <Wire pts={[[580, 560], [1340, 560]]} at={T("Je les relie")} dur={20} />
        <Pos x={960} y={330} at={T("deux ingrédients")} until={rules}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.text }}>Appareils + liaison</div>
            <svg width={1080} height={40}>
              <path d="M10 36Q10 10 40 10H500Q530 10 540 0Q550 10 580 10H1040Q1070 10 1070 36" stroke={C.muted} strokeWidth={3} fill="none" />
            </svg>
          </div>
        </Pos>
        {exchanges.map((e, i) => (
          <React.Fragment key={i}>
            <Packet pts={[[e.from[0] + (e.from[0] < 960 ? 120 : -120), 470], [e.to[0] + (e.to[0] < 960 ? 120 : -120), 470]]} t0={e.at} t1={e.at + 40} hold={15}>
              {e.el}
            </Packet>
            {i < 4 && (
              <Txt x={960} y={640} size={36} color={C.data} at={e.at} until={i < 3 ? exchanges[i + 1].at : rules}>
                {e.label}
              </Txt>
            )}
          </React.Fragment>
        ))}
        {/* 2.6 règles communes */}
        {[A, B].map((p, i) => (
          <Pos key={i} x={p[0]} y={330} at={rules} until={T("Remarquez aussi")}>
            <div
              style={{
                width: 220,
                height: 60,
                borderRadius: 14,
                background: f >= proto ? C.green : i ? C.server : C.wifi,
                color: "#0B1220",
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Règles
            </div>
          </Pos>
        ))}
        <Txt x={960} y={330} size={48} weight={800} color={C.green} at={proto} until={T("Remarquez aussi")}>
          Protocoles
        </Txt>
        <Panel x={960} y={820} w={760} h={170} at={T("deux personnes")} until={proto}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            <Icon kind="person" size={90} color={C.copper} />
            <Bubble color={C.wifi}>Bonjour !</Bubble>
            <Bubble color={C.server}>Konnichiwa !</Bubble>
            <Icon kind="person" size={90} color={C.copper} />
          </div>
        </Panel>
        {[0, 1, 2].map((i) => (
          <Txt key={i} x={760 + i * 200} y={interpolate(f, [T("ne mène à rien"), T("ne mène à rien") + 40], [720, 690], clamp)} size={54} color={C.red} weight={800} at={T("ne mène à rien") + i * 4} until={proto}>
            ?
          </Txt>
        ))}
        {/* 2.7 pas d'Internet */}
        <Device kind="cloud" x={1640} y={210} size={150} color={C.internet} label="Internet" at={T("pas connectés")} />
        <Mark x={1640} y={210} size={70} ok={false} at={T("pas connectés", 0, 0.6)} />
        <Txt x={960} y={780} size={44} color={C.green} weight={800} at={T("un vrai réseau")}>
          Un réseau, même sans Internet
        </Txt>
      </Plan>
      {/* 2.8 petit ou immense */}
      <Plan from={T("Dernière remarque")} to={END + 20}>
        <Pos x={380} y={500} at={T("Dernière remarque")}>
          <ScaleBox label="2 appareils">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon kind="computer" size={80} />
              <div style={{ width: 70, height: 4, background: C.copper }} />
              <Icon kind="computer" size={80} />
            </div>
          </ScaleBox>
        </Pos>
        <Pos x={960} y={500} at={T("lycée")}>
          <ScaleBox label="Lycée : plusieurs centaines">
            <Cluster n={40} cols={8} size={22} />
          </ScaleBox>
        </Pos>
        <Pos x={1540} y={500} at={T("grande entreprise")}>
          <ScaleBox label="Grande entreprise : des milliers">
            <div style={{ display: "flex", gap: 18 }}>
              {[0, 1, 2].map((k) => (
                <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <Icon kind="building" size={70} color={C.copper} />
                  <Cluster n={18} cols={6} size={12} />
                </div>
              ))}
            </div>
          </ScaleBox>
        </Pos>
        <Txt x={960} y={840} size={44} weight={800} color={C.net} at={T("des appareils, des liaisons")}>
          Appareils · Liaisons · Règles
        </Txt>
      </Plan>
    </>
  );
};

const FileTag: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 14, background: C.text }}>
    <Icon kind="file" size={34} color="#0B1220" />
    <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: "#0B1220" }}>{name}</span>
  </div>
);

const ScaleBox: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ width: 500, height: 380, borderRadius: 24, background: C.panel, border: `3px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
    {children}
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.text, textAlign: "center" }}>{label}</div>
  </div>
);

const Cluster: React.FC<{ n: number; cols: number; size: number }> = ({ n, cols, size }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: size * 0.45 }}>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ width: size, height: size * 0.75, borderRadius: 3, border: `2px solid ${C.device}`, background: "rgba(59,130,246,0.25)" }} />
    ))}
  </div>
);

// ================================================================== Séquence 3 — Pourquoi un réseau ?
const DESKS = [
  { n: "Léa", r: "accueil", x: 560, y: 340 },
  { n: "Karim", r: "comptabilité", x: 1360, y: 340 },
  { n: "Sophie", r: "commerciale", x: 560, y: 720 },
  { n: "Thomas", r: "gérant", x: 1360, y: 720 },
];
const SW: Pt = [960, 530];

export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const { T, END } = timing(2);
  const net = T("Maintenant, relions");
  const usb = T("clé USB");
  const usbP = ramp(f, usb, usb + 50);
  const usbPos: Pt = [560 + (1360 - 560) * usbP, 720 - 380 * usbP - Math.sin(usbP * Math.PI) * 120];
  const virus = T("un virus");
  const shield = T("mots de passe");
  return (
    <>
      {/* 3.1 */}
      <Plan from={T("Pourquoi a-t-on")} to={T("Imaginons")}>
        <Txt x={960} y={230} size={64} weight={800} at={T("Pourquoi a-t-on")}>
          Pourquoi des réseaux ?
        </Txt>
        <Device kind="computer" x={960} y={560} size={180} at={T("Pourquoi a-t-on")} />
        <Pos x={960} y={560} at={T("seul dans son coin")}>
          <div style={{ width: 360 - 60 * prog(f, T("seul dans son coin"), 20), height: 320 - 60 * prog(f, T("seul dans son coin"), 20), border: `3px dashed ${C.muted}`, borderRadius: 24 }} />
        </Pos>
      </Plan>
      {/* 3.2 et 3.3 : les quatre postes */}
      <Plan from={T("Imaginons")} to={T("Et en dehors")}>
        {DESKS.map((d, i) => (
          <React.Fragment key={d.n}>
            <Device kind="computer" x={d.x} y={d.y} size={130} label={`${d.n} · ${d.r}`} sub={f < net ? (f >= T("postes isolés") ? "Poste isolé" : undefined) : undefined} at={T(d.n)} />
            <Device kind="printer" x={d.x + 175} y={d.y + 10} size={90} at={T(d.n)} until={i === 3 ? undefined : net + 10} dim={f >= T("sa propre imprimante") && f < net ? 0.6 + 0.4 * Math.abs(Math.sin((f - T("sa propre imprimante")) / 5)) : 1} />
          </React.Fragment>
        ))}
        {/* clé USB de Sophie à Karim */}
        <Pos x={usbPos[0]} y={usbPos[1]} at={usb} until={T("Puis Sophie")}>
          <Icon kind="usb" size={60} color={C.wifi} />
        </Pos>
        <Chip x={1180} y={250} color={C.copper} size={24} at={T("Puis Sophie")} until={net}>
          Devis v1
        </Chip>
        <Chip x={380} y={630} color={C.wifi} size={24} at={T("Puis Sophie")} until={net}>
          Devis v2
        </Chip>
        <Txt x={960} y={530} size={40} color={C.red} weight={800} at={T("personne ne sait")} until={T("Pour imprimer")}>
          Quelle version ?
        </Txt>
        <Txt x={960} y={530} size={40} color={C.wifi} weight={800} at={T("Pour imprimer")} until={T("Et si le disque")}>
          4 imprimantes
        </Txt>
        <Txt x={1360} y={600} size={34} color={C.red} weight={800} at={T("tombe en panne")} until={net}>
          Fichiers perdus
        </Txt>
        <Pos x={1360} y={720} at={T("tombe en panne")} until={net}>
          <div style={{ width: 150, height: 120, borderRadius: 14, background: "rgba(239,68,68,0.35)" }} />
        </Pos>
        {/* 3.3 en réseau */}
        {DESKS.map((d) => (
          <Wire key={d.n} pts={[[d.x + (d.x < 960 ? 70 : -70), d.y + (d.y < 530 ? 40 : -40)], [SW[0] + (d.x < 960 ? -60 : 60), SW[1]]]} at={net + 5} />
        ))}
        <Wire pts={[[960, 290], [960, 495]]} at={net + 5} />
        <Wire pts={[[1050, 565], [1490, 715]]} at={net + 5} />
        <Device kind="switch" x={SW[0]} y={SW[1]} size={150} color={C.net} at={net} />
        <Device kind="server" x={960} y={210} size={110} color={C.server} at={net} label={f >= T("On ajoute aussi") ? "Serveur" : undefined} labelSize={24} />
        <Chip x={1180} y={170} color={C.server} size={22} at={T("dossier commun")} until={T("On ajoute aussi")}>
          Dossier commun · Devis
        </Chip>
        <Packet pts={[[960, 270], [960, 500], [1300, 380]]} t0={T("Karim l'ouvre")} t1={T("Karim l'ouvre") + 45} />
        <Chip x={960} y={640} color={C.green} size={26} at={T("qu'une seule version")} until={T("Une seule imprimante")}>
          1 seule version
        </Chip>
        <Packet pts={[[1300, 680], [1000, 545], [1490, 715]]} t0={T("Une seule imprimante")} t1={T("Une seule imprimante") + 45} />
        <Pos x={1110} y={140} at={T("chaque nuit")}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon kind="moon" size={44} color={C.wifi} />
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.text }}>Sauvegarde chaque nuit</span>
          </div>
        </Pos>
        <Packet pts={[[640, 330], [880, 520], [1280, 330]]} t0={T("des messages")} t1={T("des messages") + 45}>
          <Bubble size={20}>Message</Bubble>
        </Packet>
        {DESKS.map((d) => (
          <Chip key={d.n} x={d.x} y={d.y - 12} color={C.net} size={16} at={T("logiciel de facturation")}>
            Facturation
          </Chip>
        ))}
      </Plan>
      {/* 3.4 */}
      <Plan from={T("Et en dehors")} to={T("On peut résumer")}>
        <Panel x={620} y={520} w={620} h={380} at={T("jouer à plusieurs")}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Icon kind="console" size={130} />
              <div style={{ width: 80, height: 4, background: C.copper }} />
              <Icon kind="console" size={130} />
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.text }}>Jeu à plusieurs</div>
          </div>
        </Panel>
        <Panel x={1300} y={520} w={620} h={380} at={T("d'envoyer une photo")}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
              <Icon kind="phone" size={130} />
              <Icon kind="computer" size={130} />
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.text }}>Envoi d'une photo</div>
          </div>
        </Panel>
        <Packet pts={[[1195, 470], [1395, 470]]} t0={T("d'envoyer une photo") + 10} t1={T("d'envoyer une photo") + 40} hold={40}>
          <Icon kind="photo" size={50} color={C.data} />
        </Packet>
      </Plan>
      {/* 3.5 */}
      <Plan from={T("On peut résumer")} to={T("Attention cependant")}>
        <Txt x={560} y={400} size={84} weight={800} color={C.device} at={T("échanger")}>
          ÉCHANGER
        </Txt>
        <Txt x={1360} y={400} size={84} weight={800} color={C.data} at={T("partager")}>
          PARTAGER
        </Txt>
        {[
          ["Fichiers", "des fichiers"],
          ["Imprimantes", "des imprimantes"],
          ["Applications", "des applications"],
          ["Stockage", "de l'espace"],
        ].map(([l, cue], i) => (
          <Chip key={l} x={1230 + (i % 2) * 270} y={560 + Math.floor(i / 2) * 100} color={C.data} size={30} at={T(cue)}>
            {l}
          </Chip>
        ))}
        <Txt x={560} y={560} size={32} color={C.muted} at={T("Échanger des informations")}>
          des informations
        </Txt>
      </Plan>
      {/* 3.6 */}
      <Plan from={T("Attention cependant")} to={END + 20}>
        {[0, 1, 2, 3].map((i) => (
          <Device key={i} kind="computer" x={720 + i * 160} y={150} size={70} dim={0.6} at={T("Attention cependant")} />
        ))}
        <Wire pts={[[760, 150], [1200, 150]]} at={T("Attention cependant")} dim={0.5} />
        {f >= virus && f < shield + 15 && (
          <Pos x={720 + 160 * Math.min(3, Math.floor((f - virus) / 15))} y={110 - Math.abs(Math.sin(((f - virus) / 15) * Math.PI)) * 30}>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: C.red, boxShadow: `0 0 16px ${C.red}` }} />
          </Pos>
        )}
        {[
          { x: 420, icon: "gear" as IconKind, t: "Installer et configurer", lines: [], cue: "l'installer" },
          { x: 960, icon: "wrench" as IconKind, t: "Entretenir", lines: ["Mises à jour", "Câble défectueux"], cue: "l'entretenir" },
          { x: 1500, icon: "shield" as IconKind, t: "Protéger", lines: ["Mots de passe", "Droits d'accès", "Sauvegardes"], cue: "le protéger" },
        ].map((p) => (
          <Panel key={p.t} x={p.x} y={560} w={480} h={520} at={T(p.cue)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 50, gap: 22 }}>
              <Icon kind={p.icon} size={130} color={p.icon === "shield" ? (f >= shield ? C.green : C.copper) : C.copper} fill={p.icon === "shield" && f >= shield ? "rgba(34,197,94,0.3)" : "none"} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.text, textAlign: "center" }}>{p.t}</div>
              {p.lines.map((l) => (
                <div key={l} style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.muted }}>
                  {l}
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </Plan>
    </>
  );
};

// ================================================================== Séquence 4 — Communication
export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const { T, END } = timing(3);
  const ex = T("Voyons un exemple");
  const steps = ["Première étape", "Deuxième étape", "Troisième étape", "Quatrième étape", "Cinquième étape", "Sixième étape"].map((s) => T(s));
  const step = steps.filter((s) => f >= s).length;
  const A: Pt = [300, 620];
  const B: Pt = [1620, 620];
  const travel = steps[3];
  const order = [1, 3, 2, 5, 4, 7, 8, 6];
  const lostAt = T("s'est perdu");
  const resend = T("A le renvoie");
  const sortAt = T("Une fois tous");
  const merge = T("identique à l'original");
  return (
    <>
      {/* 4.1 éléments d'une communication */}
      <Plan from={T("Voyons maintenant")} to={T("Un protocole, c'est")}>
        <Device kind="computer" x={320} y={540} size={170} label="Émetteur" at={T("l'émetteur")} />
        <Device kind="computer" x={1600} y={540} size={170} label="Récepteur" at={T("le récepteur")} />
        <Wire pts={[[420, 560], [1500, 560]]} at={T("support de transmission")} />
        <Packet pts={[[520, 470], [960, 470]]} t0={T("le message")} t1={T("le message") + 30} hold={400}>
          {f < T("fait de données") ? <Icon kind="mail" size={90} color={C.data} /> : <div style={{ fontFamily: "monospace", fontSize: 40, fontWeight: 800, color: C.data }}>0110 1001</div>}
        </Packet>
        <Txt x={960} y={410} size={30} color={C.data} at={T("le message")}>
          {f < T("fait de données") ? "Message" : "Données"}
        </Txt>
        {(["plug", "fiber", "ap"] as const).map((k, i) => (
          <Pos key={k} x={760 + i * 200} y={670} at={T("support de transmission") + i * 4}>
            {k === "fiber" ? (
              <svg width={80} height={80} viewBox="0 0 100 100">
                <circle cx={50} cy={50} r={40} fill="none" stroke={C.fiber} strokeWidth={6} />
                <circle cx={50} cy={50} r={14} fill={C.fiber} />
              </svg>
            ) : (
              <Icon kind={k} size={80} color={k === "ap" ? C.wifi : C.copper} />
            )}
          </Pos>
        ))}
        <Txt x={960} y={760} size={28} color={C.muted} at={T("support de transmission")}>
          Support de transmission : câble en cuivre · fibre · ondes radio
        </Txt>
        <Pos x={960} y={260} at={T("règles communes")}>
          <div style={{ width: 1200, height: 80, borderRadius: 18, border: `3px solid ${C.green}`, background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.text }}>
            Protocoles : règles communes
          </div>
        </Pos>
        <Wire pts={[[400, 300], [320, 440]]} kind="dashed" at={T("règles communes")} />
        <Wire pts={[[1520, 300], [1600, 440]]} kind="dashed" at={T("règles communes")} />
      </Plan>
      {/* 4.2 un protocole par usage */}
      <Plan from={T("Un protocole, c'est")} to={ex}>
        <Txt x={960} y={230} size={40} weight={800} at={T("Un protocole, c'est")}>
          Un protocole = un ensemble de règles d'échange
        </Txt>
        {[
          { k: "globe" as IconKind, l: "Afficher une page Web", c: C.device, cue: "afficher" },
          { k: "mail" as IconKind, l: "Envoyer un courriel", c: C.wifi, cue: "envoyer un courriel" },
          { k: "file" as IconKind, l: "Transférer un fichier", c: C.server, cue: "transférer" },
        ].map((c, i) => (
          <Panel key={c.l} x={480 + i * 480} y={560} w={440} h={300} at={T(c.cue)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <Icon kind={c.k} size={110} color={c.c} />
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.text }}>{c.l}</div>
              <div style={{ padding: "4px 16px", borderRadius: 10, background: c.c, fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#0B1220" }}>règles</div>
            </div>
          </Panel>
        ))}
      </Plan>
      {/* 4.3 un fichier découpé en paquets */}
      <Plan from={ex} to={T("Attention : toutes")}>
        <Txt x={140} y={120} size={32} color={C.muted} align="left" style={{ transform: "translateX(50%)" }} at={steps[0]}>
          {step ? `Étape ${step}/6` : ""}
        </Txt>
        <Device kind="computer" x={A[0]} y={A[1]} size={160} label={step >= 1 ? "Émetteur" : "Ordinateur A"} at={ex} />
        <Device kind="computer" x={B[0]} y={B[1]} size={160} label={step >= 5 ? "Récepteur" : "Ordinateur B"} at={ex} />
        <Wire pts={[[390, 640], [1530, 640]]} at={ex} />
        <Pos x={300} y={390} at={steps[0]} until={steps[2] + 10}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Icon kind="file" size={110} color={C.text} />
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.text }}>Présentation</div>
          </div>
        </Pos>
        <Panel x={760} y={360} w={520} h={200} at={steps[1]} until={steps[2]}>
          <div style={{ padding: "24px 30px", fontFamily: FONT, color: C.text }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>Envoyer à : Ordinateur B</div>
            <div style={{ marginTop: 26, display: "inline-block", padding: "6px 16px", borderRadius: 10, background: C.green, color: "#0B1220", fontWeight: 800, fontSize: 24 }}>Protocole adapté</div>
          </div>
        </Panel>
        {/* les huit morceaux */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => {
          const split = steps[2];
          const dep = travel + i * 10;
          const arr = dep + 90;
          const slot = order.indexOf(n);
          const restX = 230 + i * 20;
          const inBx = 1460 + slot * 40;
          const sortX = 1460 + i * 40;
          const resentArr = resend + 80;
          if (f < split) return null;
          const isLost = n === 6;
          // position : départ empilé au-dessus de A, voyage, arrivée au-dessus de B
          let x = interpolate(f, [split, split + 15], [300, restX + i * 20], clamp);
          let y = 510;
          if (f >= dep) {
            const k = interpolate(f, [dep, arr], [0, 1], clamp);
            x = interpolate(k, [0, 1], [restX + i * 20, inBx]);
            y = 600 - Math.sin(k * Math.PI) * 30;
            if (isLost) {
              if (f < resend) {
                if (k > 0.55) return null;
              } else {
                const k2 = interpolate(f, [resend, resentArr], [0, 1], clamp);
                x = interpolate(k2, [0, 1], [380, inBx]);
                y = 600 - Math.sin(k2 * Math.PI) * 30;
              }
            }
            if (f >= arr && (!isLost || f >= resentArr)) {
              y = interpolate(f, [isLost ? resentArr : arr, (isLost ? resentArr : arr) + 10], [600, 480], clamp);
              x = inBx;
            }
            if (f >= sortAt) x = interpolate(f, [sortAt, sortAt + 25], [inBx, sortX], clamp);
          }
          if (f >= merge) return null;
          return (
            <div key={n} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 7, background: isLost && f >= resend ? C.wifi : C.data, color: "#0B1220", fontFamily: FONT, fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 12px ${C.data}` }}>
                {n}
              </div>
            </div>
          );
        })}
        {f >= travel + 50 && f < travel + 62 && (
          <Pos x={960} y={570}>
            <Icon kind="bolt" size={60} color={C.red} />
          </Pos>
        )}
        <Panel x={760} y={300} w={560} h={150} at={T("une sorte d'étiquette")} until={travel}>
          <div style={{ padding: "22px 30px", fontFamily: FONT, color: C.text }}>
            <div style={{ fontSize: 22, color: C.muted, fontWeight: 600 }}>Étiquette du paquet n° 3</div>
            <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800 }}>De : A — Vers : B — N° 3 sur 8</div>
          </div>
        </Panel>
        <Txt x={1260} y={250} size={56} weight={800} color={C.data} at={T("des paquets")} until={travel}>
          Paquets
        </Txt>
        <Txt x={1260} y={310} size={26} color={C.muted} at={T("segment ou de trame")} until={travel}>
          selon le niveau : segment, trame
        </Txt>
        {/* encart : sur Internet, plusieurs chemins */}
        <InternetInset at={T("Sur Internet")} until={steps[4]} />
        <Pos x={1300} y={800} at={steps[5]} until={merge}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.green }}>
            <svg width={60} height={24}>
              <path d="M55 12H6M18 2L6 12L18 22" stroke={C.green} strokeWidth={4} fill="none" strokeLinecap="round" />
            </svg>
            Reçu
          </div>
        </Pos>
        {[0, 1, 2, 3, 4].map((i) => (
          <Packet key={i} pts={[[1520, 700], [400, 700]]} t0={steps[5] + i * 18} t1={steps[5] + i * 18 + 60} color={C.green} size={16} />
        ))}
        <Pos x={1700} y={420} at={lostAt} until={resend + 80}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, border: `3px dashed ${C.red}` }} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.red }}>{f < resend ? "Perdu" : "Renvoyé"}</div>
          </div>
        </Pos>
        <Pos x={1620} y={420} at={merge}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon kind="file" size={90} color={C.text} />
            <svg width={56} height={56} viewBox="0 0 60 60">
              <circle cx={30} cy={30} r={27} fill={C.green} />
              <path d="M17 31L26 40L44 21" fill="none" stroke="#0B1220" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Pos>
        <Txt x={1500} y={300} size={30} color={C.green} weight={800} at={merge}>
          Fichier identique à l'original
        </Txt>
      </Plan>
      {/* 4.4 fiabilité ou réactivité */}
      <Plan from={T("Attention : toutes")} to={END + 20}>
        <Panel x={510} y={540} w={780} h={600} at={T("Attention : toutes")} border={f >= T("la fiabilité") && f < T("la réactivité") ? C.green : C.line}>
          <div style={{ padding: 30, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.text, textAlign: "center" }}>Transfert de fichier : fiabilité</div>
        </Panel>
        <Device kind="computer" x={260} y={560} size={110} at={T("Attention : toutes")} />
        <Device kind="computer" x={760} y={560} size={110} at={T("Attention : toutes")} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const t0 = T("Attention : toutes") + 10 + ((i * 25) % 150);
          return (
            <React.Fragment key={i}>
              <Packet pts={[[320, 540], [700, 540]]} t0={t0} t1={t0 + 40} lost={i === 2 ? 0.5 : undefined} />
              {i !== 2 && <Packet pts={[[700, 610], [320, 610]]} t0={t0 + 42} t1={t0 + 80} color={C.green} size={14} />}
            </React.Fragment>
          );
        })}
        <Packet pts={[[320, 540], [700, 540]]} t0={T("Attention : toutes") + 140} t1={T("Attention : toutes") + 180} color={C.wifi} />
        <Txt x={510} y={720} size={26} color={C.muted} at={T("Attention : toutes")}>
          accusés de réception, renvoi des pertes
        </Txt>
        <Panel x={1410} y={540} w={780} h={600} at={T("appel vidéo")} border={f >= T("la réactivité") ? C.wifi : C.line}>
          <div style={{ padding: 30, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.text, textAlign: "center" }}>Appel vidéo : réactivité</div>
        </Panel>
        <Pos x={1410} y={560} at={T("appel vidéo")}>
          <div style={{ width: 420, height: 280, borderRadius: 16, background: "#1E293B", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 160, top: 50, width: 100, height: 100, borderRadius: 50, background: C.copper }} />
            <div style={{ position: "absolute", left: 110, top: 165, width: 200, height: 140, borderRadius: "100px 100px 0 0", background: C.copper }} />
            {f >= T("un instant dégradée") && f < T("un instant dégradée") + 18 && (
              <div style={{ position: "absolute", left: 150, top: 60, width: 120, height: 120, display: "grid", gridTemplateColumns: "repeat(6, 20px)" }}>
                {Array.from({ length: 36 }, (_, k) => (
                  <div key={k} style={{ width: 20, height: 20, background: ["#475569", "#94A3B8", "#CBD5E1", "#64748B"][(k * 7) % 4] }} />
                ))}
              </div>
            )}
          </div>
        </Pos>
        <Txt x={1410} y={760} size={26} color={C.muted} at={T("appel vidéo")}>
          pas de renvoi : on privilégie le temps réel
        </Txt>
      </Plan>
    </>
  );
};

const InternetInset: React.FC<{ at: number; until: number }> = ({ at, until }) => {
  const f = useCurrentFrame();
  const nodes: Pt[] = [
    [1180, 220],
    [1320, 150],
    [1320, 300],
    [1480, 220],
    [1620, 220],
  ];
  const paths: Pt[][] = [
    [nodes[0], nodes[1], nodes[3], nodes[4]],
    [nodes[0], nodes[2], nodes[3], nodes[4]],
    [nodes[0], nodes[1], nodes[2], nodes[3], nodes[4]],
  ];
  const o = vis(f, at, until);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: 1100, top: 80, width: 640, height: 300, borderRadius: 20, background: C.panel, border: `3px solid ${C.line}` }} />
      <div style={{ position: "absolute", left: 1124, top: 96, fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.muted }}>Sur Internet : chemins différents</div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {[
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 3],
          [1, 2],
          [3, 4],
        ].map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={C.line} strokeWidth={4} />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <div key={i} style={{ position: "absolute", left: n[0], top: n[1], transform: "translate(-50%, -50%)" }}>
          <Icon kind="router" size={46} color={C.net} />
        </div>
      ))}
      {paths.map((p, i) => (
        <Packet key={i} pts={p} t0={at + 10 + i * 6} t1={at + 10 + i * 6 + [50, 54, 80][i]} hold={40} label={[1, 2, 3][i]} size={26} />
      ))}
    </div>
  );
};

// ================================================================== Séquence 5 — Supports
const Spec: React.FC<{ items: { t: string; at: number; color?: string }[]; x?: number; y?: number }> = ({ items, x = 1200, y = 260 }) => (
  <>
    {items.map((it, i) => (
      <Pos key={it.t} x={x} y={y + i * 72} at={it.at} style={{ transform: "translate(0, -50%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 30, color: it.color ?? C.text, whiteSpace: "nowrap" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: it.color ?? C.text }} />
          {it.t}
        </div>
      </Pos>
    ))}
  </>
);

const Ruler: React.FC<{ at: number; to: number; unit: "m" | "km"; markAt: number; limit?: number; label?: string }> = ({ at, to, unit, markAt, limit, label }) => {
  const f = useCurrentFrame();
  const o = vis(f, at);
  const x0 = 200;
  const x1 = 1100;
  const max = unit === "m" ? 150 : 50;
  const X = (v: number) => x0 + ((x1 - x0) * v) / max;
  const cur = interpolate(f, [markAt, markAt + 40], [0, limit ?? max], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={x0} y1={850} x2={x1} y2={850} stroke={C.muted} strokeWidth={4} />
        {limit !== undefined && f >= markAt + 40 && <line x1={X(limit)} y1={850} x2={x1} y2={850} stroke={C.red} strokeWidth={8} />}
        {Array.from({ length: unit === "m" ? 4 : 6 }, (_, i) => {
          const v = (i * max) / (unit === "m" ? 3 : 5);
          return <line key={i} x1={X(v)} y1={838} x2={X(v)} y2={862} stroke={C.muted} strokeWidth={3} />;
        })}
        {f >= markAt && <circle cx={X(cur)} cy={850} r={12} fill={C.wifi} />}
      </svg>
      {Array.from({ length: unit === "m" ? 4 : 6 }, (_, i) => {
        const v = (i * max) / (unit === "m" ? 3 : 5);
        return (
          <div key={i} style={{ position: "absolute", left: X(v), top: 880, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 600, fontSize: 22, color: C.muted }}>
            {v} {unit}
          </div>
        );
      })}
      {label && f >= markAt + 40 && (
        <div style={{ position: "absolute", left: limit !== undefined ? X(limit) : X(max), top: 790, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.wifi, whiteSpace: "nowrap" }}>{label}</div>
      )}
      <div style={{ display: "none" }}>{to}</div>
    </div>
  );
};

export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const { T, END } = timing(4);
  const p1 = T("Le premier est");
  const p2 = T("Le deuxième support");
  const p3 = T("Le troisième support");
  const p4 = T("Aucun de ces");
  const wave = (kind: "square" | "pulse" | "sine", x: number, y: number, color: string, w = 300) => {
    const pts: string[] = [];
    for (let i = 0; i <= w; i += 4) {
      const ph = (i + f * 4) / 40;
      const v = kind === "square" ? (Math.floor(ph) % 2 ? -1 : 1) : kind === "sine" ? Math.sin(ph * 1.6) : Math.max(0, Math.sin(ph * 1.6)) ** 6 * 2 - 1;
      pts.push(`${i ? "L" : "M"}${x - w / 2 + i} ${y - v * 26}`);
    }
    return <path d={pts.join(" ")} stroke={color} strokeWidth={5} fill="none" strokeLinejoin="round" />;
  };
  const cols = [
    { t: "Cuivre", c: C.copper, k: "square" as const, cue: "électrique" },
    { t: "Fibre", c: C.fiber, k: "pulse" as const, cue: "lumineux" },
    { t: "Ondes radio", c: C.wifi, k: "sine" as const, cue: "radio" },
  ];
  const rows = [
    ["Critère", "Cuivre (Ethernet)", "Fibre optique", "Wi-Fi"],
    ["Débit", "Couramment 1 Gbit/s, parfois plus", "Très élevé", "Variable selon les conditions"],
    ["Portée", "Environ 100 m par liaison", "Centaines de mètres à dizaines de km", "Quelques dizaines de mètres en intérieur"],
    ["Mobilité", "Aucune", "Aucune", "Oui"],
    ["Fiabilité", "Très bonne", "Très bonne", "Variable"],
    ["Interférences", "Sensible aux fortes perturbations électriques", "Insensible aux perturbations électromagnétiques", "Sensible aux murs, aux appareils, aux réseaux voisins"],
    ["Coût et installation", "Peu coûteux, simple", "Plus cher, raccordement délicat", "Sans câble, mise en place simple"],
  ];
  const colLit = [T("le câble en cuivre pour"), T("la fibre pour"), T("le Wi-Fi pour")];
  return (
    <>
      {/* 5.1 trois signaux */}
      <Plan from={T("Revenons sur")} to={p1}>
        {cols.map((c, i) => (
          <React.Fragment key={c.t}>
            <Txt x={400 + i * 560} y={330} size={48} weight={800} color={c.c} at={T(c.cue)}>
              {c.t}
            </Txt>
            <Pos x={400 + i * 560} y={520} at={T(c.cue)}>
              <svg width={360} height={120} viewBox={`${400 + i * 560 - 180} 460 360 120`}>
                {wave(c.k, 400 + i * 560, 520, c.c, 340)}
              </svg>
            </Pos>
          </React.Fragment>
        ))}
      </Plan>
      {/* 5.2 cuivre */}
      <Plan from={p1} to={p2}>
        <Txt x={650} y={170} size={48} weight={800} color={C.copper} at={p1}>
          Câble Ethernet en cuivre
        </Txt>
        <Pos x={260} y={420} at={p1}>
          <Icon kind="plug" size={150} color={C.copper} />
        </Pos>
        <Pos x={700} y={430} at={p1}>
          <svg width={760} height={140} viewBox="320 360 760 140">
            <rect x={330} y={418} width={740} height={26} rx={13} fill="#334155" />
            {wave("square", 700, 400, C.copper, 700)}
          </svg>
        </Pos>
        <Pos x={700} y={620} at={T("paires de fils")}>
          <svg width={200} height={200} viewBox="0 0 200 200">
            <circle cx={100} cy={100} r={90} fill="#1E293B" stroke={C.copper} strokeWidth={6} />
            {[
              ["#F97316", "#FDBA74"],
              ["#22C55E", "#86EFAC"],
              ["#3B82F6", "#93C5FD"],
              ["#A16207", "#FDE68A"],
            ].map(([a, b], i) => {
              const ang = (i * Math.PI) / 2 + f / 30;
              const cx = 100 + Math.cos(i * (Math.PI / 2)) * 45;
              const cy = 100 + Math.sin(i * (Math.PI / 2)) * 45;
              return (
                <g key={i}>
                  <circle cx={cx + Math.cos(ang) * 12} cy={cy + Math.sin(ang) * 12} r={11} fill={a} />
                  <circle cx={cx - Math.cos(ang) * 12} cy={cy - Math.sin(ang) * 12} r={11} fill={b} />
                </g>
              );
            })}
          </svg>
        </Pos>
        <Txt x={700} y={740} size={24} color={C.muted} at={T("paires de fils")}>
          4 paires de fils torsadés
        </Txt>
        <Spec
          items={[
            { t: "Signaux électriques", at: T("signaux électriques") },
            { t: "Peu coûteux · simple · fiable", at: T("peu coûteux") },
            { t: "Couramment 1 Gbit/s, parfois plus", at: T("gigabit") },
            { t: "1 Gbit/s = 1 milliard de bits/s", at: T("milliard"), color: C.muted },
            { t: "Environ 100 m entre deux équipements", at: T("cent mètres"), color: C.wifi },
            { t: "Gêné par de fortes perturbations", at: T("fortes perturbations") },
          ]}
        />
        <Ruler at={T("cent mètres")} to={p2} unit="m" markAt={T("cent mètres")} limit={100} label="≈ 100 m" />
        <Pos x={1560} y={760} at={T("Exemple : un ordinateur")}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <Icon kind="computer" size={110} />
            <div style={{ width: 80, height: 5, background: C.copper }} />
            <Icon kind="socket" size={70} color={C.copper} />
          </div>
        </Pos>
      </Plan>
      {/* 5.3 fibre */}
      <Plan from={p2} to={p3}>
        <Txt x={650} y={170} size={48} weight={800} color={C.fiber} at={p2}>
          Fibre optique
        </Txt>
        <Pos x={700} y={430} at={p2}>
          <svg width={900} height={160} viewBox="250 350 900 160">
            <rect x={260} y={380} width={880} height={100} rx={50} fill="#1E293B" stroke={C.fiber} strokeWidth={4} />
            <rect x={260} y={405} width={880} height={50} rx={25} fill="rgba(34,211,238,0.15)" />
            {(() => {
              const pts: string[] = [];
              for (let i = 0; i <= 880; i += 10) {
                const ph = ((i + f * 9) % 120) / 120;
                pts.push(`${i ? "L" : "M"}${260 + i} ${430 + (ph < 0.5 ? -1 + 4 * ph : 3 - 4 * ph) * 20}`);
              }
              return <path d={pts.join(" ")} stroke={C.fiber} strokeWidth={4} fill="none" opacity={0.9} />;
            })()}
            {[0, 1, 2, 3].map((k) => (
              <circle key={k} cx={260 + ((f * 9 + k * 220) % 880)} cy={430} r={10} fill="#FFFFFF" />
            ))}
            {f >= T("insensible") &&
              [360, 700, 1040].map((x, k) => (
                <path key={k} d={`M${x} 360L${x - 12} 380H${x + 4}L${x - 8} 400`} stroke={C.wifi} strokeWidth={5} fill="none" opacity={0.5 + 0.5 * Math.sin(f / 3 + k)} />
              ))}
          </svg>
        </Pos>
        <Pos x={700} y={630} at={p2}>
          <svg width={160} height={160} viewBox="0 0 160 160">
            <circle cx={80} cy={80} r={70} fill="#1E293B" stroke={C.fiber} strokeWidth={6} />
            <circle cx={80} cy={80} r={24} fill={C.fiber} />
          </svg>
        </Pos>
        <Txt x={700} y={740} size={24} color={C.muted} at={p2}>
          cœur en verre, plus fin qu'un cheveu
        </Txt>
        <Spec
          items={[
            { t: "Impulsions de lumière", at: T("d'impulsions") },
            { t: "Débits très élevés", at: T("débits très élevés") },
            { t: "De centaines de m à dizaines de km", at: T("quelques centaines") },
            { t: "Insensible aux perturbations", at: T("insensible") },
            { t: "Installation plus délicate · plus cher", at: T("plus délicate") },
          ]}
        />
        <Ruler at={T("quelques centaines")} to={p3} unit="km" markAt={T("quelques centaines")} label="dizaines de km" />
        <Pos x={1400} y={720} at={T("arrive dans un immeuble")}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{ width: 90, height: 5, background: C.fiber }} />
            <Icon kind="building" size={120} color={C.copper} />
          </div>
        </Pos>
        <Pos x={1680} y={720} at={T("deux bâtiments")}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <Icon kind="school" size={90} color={C.copper} />
            <div style={{ width: 40, height: 5, background: C.fiber }} />
            <Icon kind="school" size={90} color={C.copper} />
          </div>
        </Pos>
      </Plan>
      {/* 5.4 Wi-Fi */}
      <Plan from={p3} to={p4}>
        <WifiFloor T={T} from={p3} />
        <Txt x={1500} y={170} size={48} weight={800} color={C.wifi} at={p3}>
          Wi-Fi
        </Txt>
        <Spec
          x={1260}
          y={280}
          items={[
            { t: "Ondes radio, sans câble", at: T("transmises sans câble") },
            { t: "Mobilité", at: T("la mobilité") },
            { t: "Quelques dizaines de mètres", at: T("quelques dizaines") },
            { t: "Débit variable :", at: T("varie beaucoup") },
            { t: "distance, murs, appareils, voisins", at: T("varie beaucoup"), color: C.muted },
          ]}
        />
        <Pos x={1500} y={760} at={T("Exemple : votre smartphone")}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Icon kind="phone" size={100} />
            <Icon kind="box" size={110} color={C.net} />
          </div>
        </Pos>
      </Plan>
      {/* 5.5 comparaison */}
      <Plan from={p4} to={END + 20}>
        <Txt x={960} y={150} size={46} weight={800} at={p4}>
          Aucun support n'est meilleur dans l'absolu
        </Txt>
        <Pos x={960} y={530} at={p4}>
          <div style={{ display: "grid", gridTemplateColumns: "280px 460px 460px 460px", fontFamily: FONT }}>
            {rows.flatMap((r, ri) =>
              r.map((cell, ci) => {
                const lit = ci > 0 && f >= colLit[ci - 1] && (ci === 3 || f < colLit[ci]);
                return (
                  <div
                    key={`${ri}-${ci}`}
                    style={{
                      height: 82,
                      boxSizing: "border-box",
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      fontSize: ri === 0 ? 26 : 23,
                      fontWeight: ri === 0 || ci === 0 ? 800 : 600,
                      color: ri === 0 ? [C.text, C.copper, C.fiber, C.wifi][ci] : C.text,
                      background: lit ? "rgba(245,158,11,0.16)" : ri % 2 ? "rgba(30,41,59,0.9)" : "rgba(15,23,42,0.9)",
                      borderBottom: `2px solid ${C.line}`,
                      lineHeight: 1.2,
                    }}
                  >
                    {cell}
                  </div>
                );
              }),
            )}
          </div>
        </Pos>
        <Pos x={960} y={880} at={T("les trois cohabitent")}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.muted }}>
            <div style={{ width: 70, height: 5, background: C.fiber }} />
            <Icon kind="box" size={70} color={C.net} />
            <div style={{ width: 70, height: 5, background: C.copper }} />
            <Icon kind="computer" size={56} />
            <svg width={60} height={20}>
              <path d="M0 10H60" stroke={C.wifi} strokeWidth={5} strokeDasharray="8 8" />
            </svg>
            <Icon kind="phone" size={56} />
          </div>
        </Pos>
      </Plan>
    </>
  );
};

// Appartement vu de dessus : le smartphone se déplace, le signal baisse derrière les murs
const WifiFloor: React.FC<{ T: (p: string) => number; from: number }> = ({ T, from }) => {
  const f = useCurrentFrame();
  const move = T("vous vous déplacez");
  const crowd = T("le nombre d'appareils");
  const route: Pt[] = [
    [380, 560],
    [600, 560],
    [800, 420],
    [980, 680],
  ];
  const k = ramp(f, move, move + 120);
  const [px, py] = (() => {
    const lens = [0, 1, 2].map((i) => Math.hypot(route[i + 1][0] - route[i][0], route[i + 1][1] - route[i][1]));
    let d = k * lens.reduce((a, b) => a + b, 0);
    for (let i = 0; i < 3; i++) {
      if (d <= lens[i] || i === 2) {
        const t = Math.min(1, d / lens[i]);
        return [route[i][0] + (route[i + 1][0] - route[i][0]) * t, route[i][1] + (route[i + 1][1] - route[i][1]) * t];
      }
      d -= lens[i];
    }
    return route[3];
  })();
  const walls = px > 700 ? (py > 560 ? 2 : 1) : 0;
  const bars = Math.max(1, 4 - walls - (Math.hypot(px - 260, py - 400) > 600 ? 1 : 0));
  const devices = Math.round(interpolate(f, [crowd, crowd + 60], [2, 12], clamp));
  const speed = interpolate(devices, [2, 12], [1, 0.35]);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis(f, from) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={140} y={250} width={980} height={600} rx={10} fill="rgba(30,41,59,0.6)" stroke={C.copper} strokeWidth={6} />
        <path d="M700 250V480M700 560V850M700 600H1120" stroke={C.copper} strokeWidth={6} />
      </svg>
      <WifiArcs x={260} y={400} r={420} at={from} />
      <div style={{ position: "absolute", left: 260, top: 400, transform: "translate(-50%, -50%)" }}>
        <Icon kind="box" size={110} color={C.net} />
      </div>
      <div style={{ position: "absolute", left: px, top: py, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 10 }}>
        <Icon kind="phone" size={90} />
        <svg width={50} height={44}>
          {[0, 1, 2, 3].map((b) => (
            <rect key={b} x={b * 12} y={34 - b * 10} width={9} height={10 + b * 10} rx={2} fill={b < bars ? C.green : C.line} />
          ))}
        </svg>
      </div>
      {f >= crowd && (
        <div style={{ position: "absolute", left: 180, top: 800, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.text, display: "flex", alignItems: "center", gap: 20 }}>
          <span>Appareils connectés : {devices}</span>
          <div style={{ width: 260, height: 18, borderRadius: 9, background: C.line, overflow: "hidden" }}>
            <div style={{ width: `${speed * 100}%`, height: "100%", background: C.wifi }} />
          </div>
          <span style={{ color: C.muted }}>débit</span>
        </div>
      )}
    </div>
  );
};
