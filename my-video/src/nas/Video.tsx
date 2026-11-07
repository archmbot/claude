// « Pourquoi l'informatique coûte-t-elle si cher ? L'exemple d'un NAS » — 1 min, 1920 × 1080.
// Même charte que la formation réseaux (src/reseau/ui.tsx). À gauche, l'étape expliquée ;
// à droite, un devis indicatif qui se remplit au fil de la voix off.
import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Subtitles } from "../components/Subtitles";
import { useFonts } from "../qyline/shared";
import { Background, C, Chip, Device, FONT, Icon, Mark, Packet, Panel, Pos, Txt, Wire, Zone, clamp, prog, type IconKind } from "../reseau/ui";
import { DURATION, SEQS, timing } from "./timing";
import { VOICE } from "./voice";

const CAPTIONS = VOICE.words.map((w) => ({ text: w.text, start: w.start, end: w.end, scene: w.seq, sentence: w.para }));
// image absolue d'un repère vocal
const abs = (seq: number, phrase: string, off = 0) => SEQS[seq].from + timing(seq).T(phrase, 0, off);

// ------------------------------------------------------------------ devis indicatif (colonne de droite)
const Quote: React.FC = () => {
  const f = useCurrentFrame();
  const open = abs(2, "le matériel");
  if (f < open - 1) return null;
  const rows = [
    { l: "NAS 2 baies", p: "200 – 450 €", at: abs(2, "le NAS"), indent: true },
    { l: "2 disques NAS de 4 To", p: "400 – 500 €", at: abs(2, "deux disques"), indent: true },
    { l: "Onduleur", p: "80 – 150 €", at: abs(2, "un onduleur"), indent: true },
    { l: "Mise en place (4 à 8 h)", p: "250 – 600 €", at: abs(3, "la mise en place") },
    { l: "Sauvegarde externe", p: "100 – 250 €", at: abs(4, "la sauvegarde"), sub: "ou cloud : 5 – 15 €/mois" },
    { l: "Entretien", p: "15 – 50 €/mois", at: abs(5, "l'entretien"), monthly: true },
  ];
  const totals = [
    { at: abs(2, "un onduleur"), v: "700 – 1 100 €" },
    { at: abs(3, "la mise en place"), v: "950 – 1 700 €" },
    { at: abs(4, "la sauvegarde"), v: "1 050 – 1 950 €" },
  ];
  const total = [...totals].reverse().find((t) => f >= t.at);
  const totalPop = total ? 1 + 0.08 * Math.sin(Math.min(1, prog(f, total.at, 12)) * Math.PI) : 1;
  const final = abs(6, "Vous ne payez");
  const lit = f >= final;
  return (
    <Pos x={1570} y={520} at={open}>
      <div style={{ width: 580, height: 780, boxSizing: "border-box", borderRadius: 22, background: C.panel, border: `3px solid ${C.line}`, padding: "26px 30px", fontFamily: FONT, color: C.text, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Icon kind="file" size={46} color={C.data} />
          <div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>Devis indicatif</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: C.muted }}>ordres de grandeur, prix 2026</div>
          </div>
        </div>
        <div style={{ marginTop: 22, fontSize: 24, fontWeight: 800, color: C.muted, opacity: prog(f, open) }}>Matériel</div>
        {rows.map((r) => {
          const p = prog(f, r.at, 10);
          return (
            <div key={r.l} style={{ opacity: p, transform: `translateX(${(1 - p) * 30}px)`, marginTop: r.indent ? 10 : 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontSize: r.indent ? 25 : 27, fontWeight: r.indent ? 600 : 800, paddingLeft: r.indent ? 18 : 0, color: r.monthly ? C.wifi : C.text }}>{r.l}</span>
                <span style={{ fontSize: 26, fontWeight: 800, color: r.monthly ? C.wifi : C.data, whiteSpace: "nowrap" }}>{r.p}</span>
              </div>
              {r.sub && <div style={{ fontSize: 20, fontWeight: 600, color: C.muted, marginTop: 2 }}>{r.sub}</div>}
            </div>
          );
        })}
        <div style={{ flex: 1 }} />
        {total && (
          <div
            style={{
              borderTop: `2px solid ${C.line}`,
              paddingTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: lit ? "rgba(249,115,22,0.14)" : "transparent",
              borderRadius: 12,
              padding: "16px 14px 12px",
              margin: "0 -14px",
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 800 }}>Pour démarrer</span>
            <span style={{ fontSize: 36, fontWeight: 800, color: C.data, transform: `scale(${totalPop})`, whiteSpace: "nowrap" }}>≈ {total.v}</span>
          </div>
        )}
        {f >= abs(5, "l'entretien") && (
          <div style={{ textAlign: "right", fontSize: 22, fontWeight: 700, color: C.wifi, marginTop: 4, opacity: prog(f, abs(5, "l'entretien")) }}>puis ≈ 15 – 50 €/mois d'entretien</div>
        )}
      </div>
    </Pos>
  );
};

// ------------------------------------------------------------------ titre
const Title: React.FC = () => {
  const f = useCurrentFrame();
  const small = prog(f, SEQS[1].from - 10, 15);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: FONT, opacity: 1 - small }}>
        <div style={{ fontSize: 70, fontWeight: 800, color: C.text }}>Pourquoi l'informatique coûte-t-elle si cher ?</div>
        <div style={{ marginTop: 14, fontSize: 36, fontWeight: 700, color: C.device }}>L'exemple d'un NAS pour deux personnes</div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 44, fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.muted, opacity: small }}>
        Pourquoi l'informatique coûte-t-elle si cher ? <span style={{ color: C.device }}>· L'exemple d'un NAS</span>
      </div>
    </>
  );
};

// ------------------------------------------------------------------ étapes
const Hook: React.FC = () => {
  const { T } = timing(0);
  return (
    <>
      <Device kind="nas" x={640} y={600} size={210} color={C.server} label="NAS" at={0} />
      <Chip x={640} y={810} color={C.server} size={28} at={T("quelques centaines")}>
        quelques centaines d'euros
      </Chip>
      <Txt x={960} y={600} size={150} weight={800} color={C.wifi} at={T("mille euros")}>
        ?
      </Txt>
      <Panel x={1280} y={610} w={300} h={340} at={T("le devis")}>
        <div style={{ padding: "26px 28px", fontFamily: FONT }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: C.text }}>Devis</div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ marginTop: 16, height: 10, borderRadius: 5, background: C.line, width: `${90 - i * 15}%` }} />
          ))}
          <div style={{ marginTop: 36, fontSize: 46, fontWeight: 800, color: C.data }}>{"> 1 000 €"}</div>
        </div>
      </Panel>
    </>
  );
};

const Need: React.FC = () => {
  const { T } = timing(1);
  const local = T("Au bureau");
  const remote = T("à distance");
  return (
    <>
      <Zone x={100} y={170} w={1020} h={640} color={C.net} label="Bureau · réseau local" at={T("Prenons")} />
      <Zone x={1320} y={430} w={500} h={380} color={C.wifi} label="Domicile" at={T("depuis chez eux")} />
      <Wire pts={[[340, 470], [570, 330]]} at={T("Prenons")} />
      <Wire pts={[[880, 470], [650, 330]]} at={T("Prenons")} />
      <Wire pts={[[610, 360], [610, 490]]} at={T("Prenons")} />
      <Device kind="box" x={610} y={300} size={110} color={C.net} label="Box" labelSize={22} at={T("Prenons")} />
      <Device kind="computer" x={300} y={520} size={130} label="Léa" at={T("Léa")} />
      <Device kind="computer" x={920} y={520} size={130} label="Karim" at={T("Karim")} />
      <Device kind="nas" x={610} y={560} size={130} color={C.server} label="NAS" at={T("Prenons")} />
      {["Commun", "Léa", "Karim"].map((d, i) => (
        <Chip key={d} x={470 + i * 140} y={735} color={C.server} size={22} at={T("partagent des dossiers") + i * 4}>
          {d}
        </Chip>
      ))}
      {[300, 920].map((x, i) => (
        <Pos key={x} x={x} y={665} at={T("chacun avec son compte") + i * 5}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.wifi }}>
            <Icon kind="key" size={34} color={C.wifi} />
            {i ? "Compte Karim" : "Compte Léa"}
          </div>
        </Pos>
      ))}
      <Packet pts={[[340, 470], [610, 330], [610, 500]]} t0={local} t1={local + 30} size={24} />
      <Device kind="cloud" x={1230} y={250} size={140} color={C.internet} label="Internet" labelSize={22} at={remote} />
      <Wire pts={[[670, 290], [1160, 260]]} kind="dashed" at={remote} />
      <Wire pts={[[1290, 300], [1540, 560]]} kind="dashed" at={remote} />
      <Device kind="laptop" x={1570} y={630} size={130} label="Accès à distance" labelSize={22} at={T("depuis chez eux")} />
      <Pos x={1390} y={370} at={remote}>
        <Icon kind="lock" size={56} color={C.green} />
      </Pos>
      <Packet pts={[[1540, 580], [1290, 300], [1160, 260], [670, 290], [610, 500]]} t0={T("depuis chez eux")} t1={T("depuis chez eux") + 45} size={24} />
    </>
  );
};

const Hardware: React.FC = () => {
  const f = useCurrentFrame();
  const { T } = timing(2);
  const mirror = T("en miroir");
  const fail = T("la panne");
  const cut = T("coupures de courant");
  return (
    <>
      <Pos x={640} y={430} at={T("le NAS")}>
        <div style={{ width: 420, height: 300, borderRadius: 26, border: `4px solid ${C.server}`, background: "rgba(139,92,246,0.10)", boxShadow: f >= cut ? `0 0 40px ${C.green}` : undefined }} />
      </Pos>
      <Txt x={640} y={310} size={30} weight={800} color={C.server} at={T("le NAS")}>
        NAS
      </Txt>
      <Device kind="disk" x={555} y={440} size={110} color={f >= fail ? C.text : C.server} label="Disque 1" labelSize={22} at={T("deux disques")} />
      <Device kind="disk" x={725} y={440} size={110} color={f >= fail ? C.red : C.server} label="Disque 2" labelSize={22} at={T("deux disques")} />
      <Packet pts={[[200, 300], [555, 400]]} t0={mirror} t1={mirror + 25}>
        <Icon kind="file" size={40} color={C.data} />
      </Packet>
      <Packet pts={[[200, 300], [725, 400]]} t0={mirror} t1={mirror + 25}>
        <Icon kind="file" size={40} color={C.data} />
      </Packet>
      <Txt x={640} y={630} size={26} color={C.muted} at={mirror} until={fail}>
        Miroir : la même copie sur les deux disques
      </Txt>
      <Mark x={725} y={420} size={60} ok={false} at={fail} />
      <Mark x={555} y={420} size={60} ok at={fail + 12} />
      <Txt x={640} y={630} size={26} color={C.green} weight={800} at={fail + 12}>
        Un disque en panne : les données restent sur l'autre
      </Txt>
      <Device kind="ups" x={260} y={760} size={110} color={C.green} label="Onduleur" labelSize={22} at={T("un onduleur")} />
      <Wire pts={[[320, 740], [470, 560]]} at={T("un onduleur")} color={C.green} />
      <Pos x={130} y={640} at={cut}>
        <Icon kind="bolt" size={70} color={C.wifi} />
      </Pos>
      <Txt x={760} y={760} size={26} color={C.text} at={cut} w={560} align="left">
        Coupure de courant : le NAS reste alimenté et s'arrête proprement
      </Txt>
    </>
  );
};

const Setup: React.FC = () => {
  const { T } = timing(3);
  const remote = T("un accès à distance");
  const bad = T("plutôt qu'un");
  const rights: [string, boolean, boolean][] = [
    ["Commun", true, true],
    ["Léa", true, false],
    ["Karim", false, true],
  ];
  const ok = (v: boolean) => <span style={{ color: v ? C.green : C.red, fontWeight: 800 }}>{v ? "✓" : "✗"}</span>;
  return (
    <>
      <Panel x={330} y={290} w={440} h={200} at={T("comptes")}>
        <div style={{ padding: "20px 26px", fontFamily: FONT, color: C.text }}>
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>Comptes</div>
          {["Léa", "Karim"].map((n) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 700, marginTop: 6 }}>
              <Icon kind="key" size={30} color={C.wifi} />
              <span style={{ width: 90 }}>{n}</span>
              <span style={{ color: C.muted, letterSpacing: 4 }}>••••••••</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel x={880} y={300} w={460} h={220} at={T("droits sur chaque")}>
        <div style={{ padding: "18px 26px", fontFamily: FONT, color: C.text, fontSize: 25 }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 110px 110px", rowGap: 8, fontWeight: 700 }}>
            <span style={{ color: C.muted }}>Dossier</span>
            <span style={{ color: C.muted }}>Léa</span>
            <span style={{ color: C.muted }}>Karim</span>
            {rights.map(([d, a, b]) => (
              <React.Fragment key={d}>
                <span>{d}</span>
                {ok(a)}
                {ok(b)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Panel>
      <Device kind="phone" x={260} y={610} size={110} at={T("double authentification")} />
      <Pos x={430} y={600} at={T("double authentification", 0, 0.3)}>
        <div style={{ padding: "8px 16px", borderRadius: 12, background: C.device, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: "#0B1220" }}>Code : 482 913</div>
      </Pos>
      <Txt x={300} y={720} size={22} color={C.muted} at={T("double authentification")}>
        double authentification
      </Txt>
      <Device kind="laptop" x={660} y={620} size={110} label="À distance" labelSize={22} at={remote} />
      <Device kind="nas" x={1080} y={620} size={110} color={C.server} label="NAS" labelSize={22} at={remote} />
      <Wire pts={[[730, 620], [1010, 620]]} at={remote} color={C.green} width={14} />
      <Pos x={870} y={580} at={T("par VPN")}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 12, background: C.green, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: "#0B1220" }}>
          <Icon kind="lock" size={30} color="#0B1220" />
          VPN
        </div>
      </Pos>
      <Packet pts={[[740, 620], [1000, 620]]} t0={T("par VPN")} t1={T("par VPN") + 30} size={22} />
      <Pos x={870} y={810} at={bad}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 22px", borderRadius: 16, border: `3px solid ${C.red}`, background: "rgba(239,68,68,0.12)", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.text }}>
          <Icon kind="nas" size={50} color={C.server} />
          <svg width={60} height={20}>
            <path d="M0 10H60" stroke={C.red} strokeWidth={5} strokeDasharray="6 6" />
          </svg>
          <Icon kind="cloud" size={56} color={C.internet} />
          NAS ouvert sur Internet
        </div>
      </Pos>
      <Mark x={1150} y={780} size={50} ok={false} at={T("ouvert sur Internet")} />
    </>
  );
};

const Backup: React.FC = () => {
  const { T } = timing(4);
  const del = T("d'une suppression");
  const ransom = T("d'un rançongiciel");
  const copy = T("une copie ailleurs");
  return (
    <>
      <Pos x={640} y={370} at={T("Le miroir")}>
        <div style={{ width: 400, height: 260, borderRadius: 24, border: `4px solid ${C.server}`, background: "rgba(139,92,246,0.10)" }} />
      </Pos>
      {[555, 725].map((x) => (
        <React.Fragment key={x}>
          <Device kind="disk" x={x} y={360} size={100} color={C.server} at={T("Le miroir")} />
          <Pos x={x} y={460} at={T("Le miroir")} until={del + 10}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.text, padding: "2px 10px", borderRadius: 8, background: C.line }}>devis.pdf</div>
          </Pos>
          <Pos x={x} y={350} at={ransom}>
            <Icon kind="lock" size={64} color={C.red} />
          </Pos>
        </React.Fragment>
      ))}
      <Txt x={640} y={200} size={28} weight={800} color={C.red} at={del} until={ransom}>
        Fichier supprimé… sur les deux disques
      </Txt>
      <Txt x={640} y={200} size={28} weight={800} color={C.red} at={ransom}>
        Rançongiciel : les deux disques sont chiffrés
      </Txt>
      <Device kind="disk" x={330} y={760} size={100} color={C.green} label="Disque externe" labelSize={22} at={copy} />
      <Device kind="cloud" x={950} y={760} size={120} color={C.green} label="Cloud" labelSize={22} at={copy + 6} />
      <Wire pts={[[560, 500], [380, 700]]} kind="dashed" at={copy} />
      <Wire pts={[[720, 500], [900, 700]]} kind="dashed" at={copy + 6} />
      <Txt x={640} y={650} size={26} color={C.green} weight={800} at={copy}>
        Une copie ailleurs
      </Txt>
      <Mark x={640} y={770} size={56} ok at={T("la tester")} />
      <Txt x={640} y={840} size={24} color={C.green} weight={700} at={T("la tester")}>
        Restauration testée
      </Txt>
    </>
  );
};

const Upkeep: React.FC = () => {
  const { T } = timing(5);
  const items: { k: IconKind; l: string; cue: string }[] = [
    { k: "refresh", l: "Mises à jour", cue: "mises à jour" },
    { k: "pulse", l: "Surveillance des disques", cue: "surveillance" },
    { k: "headset", l: "Assistance", cue: "assistance" },
  ];
  return (
    <>
      <Txt x={640} y={230} size={44} weight={800} color={C.wifi} at={T("l'entretien")}>
        Entretien
      </Txt>
      {items.map((it, i) => (
        <Panel key={it.l} x={260 + i * 380} y={540} w={340} h={360} at={T(it.cue)}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <Icon kind={it.k} size={120} color={C.wifi} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.text, textAlign: "center", padding: "0 16px" }}>{it.l}</div>
          </div>
        </Panel>
      ))}
    </>
  );
};

const Close: React.FC = () => {
  const f = useCurrentFrame();
  const { T } = timing(6);
  const no = T("Vous ne payez");
  const badges: { k: IconKind; l: string; cue: string; c: string }[] = [
    { k: "shield", l: "Données protégées", cue: "données protégées", c: C.green },
    { k: "globe", l: "Accessibles partout", cue: "accessibles partout", c: C.device },
    { k: "gear", l: "Savoir-faire", cue: "le savoir-faire", c: C.data },
  ];
  return (
    <>
      <Pos x={640} y={290} at={no}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.muted }}>
          <div style={{ position: "relative" }}>
            <Icon kind="nas" size={110} color={C.muted} />
            <svg width={130} height={130} style={{ position: "absolute", left: -10, top: -10 }}>
              <path d="M10 120L120 10" stroke={C.red} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(f, no + 10, 12)} />
            </svg>
          </div>
          pas une simple boîte…
        </div>
      </Pos>
      {badges.map((b, i) => (
        <Pos key={b.l} x={260 + i * 380} y={590} at={T(b.cue)}>
          <div style={{ width: 340, height: 280, borderRadius: 22, background: C.panel, border: `3px solid ${b.c}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <Icon kind={b.k} size={110} color={b.c} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.text }}>{b.l}</div>
          </div>
        </Pos>
      ))}
      <Txt x={640} y={850} size={20} color={C.muted} w={1100} weight={600} at={no}>
        Ordres de grandeur constatés en 2026, à titre indicatif : prix variables selon le matériel, la région et le prestataire.
      </Txt>
    </>
  );
};

const STAGES = [Hook, Need, Hardware, Setup, Backup, Upkeep, Close];

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
        const next = SEQS[i + 1]?.from ?? DURATION + 10;
        const o = interpolate(f, [next - 6, next], [1, 0], clamp);
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={i < SEQS.length - 1 ? s.duration : DURATION - s.from} premountFor={10}>
            <AbsoluteFill style={{ opacity: i < SEQS.length - 1 ? o : 1 }}>
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
