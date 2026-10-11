// Séquences 6 à 10 du chapitre 1.1 (storyboard, partie D).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { timing } from "./timing";
import { C, Chip, Device, FONT, Icon, Mark, Packet, Panel, Plan, Pos, Txt, WifiArcs, Wire, Zone, clamp, prog, ramp, vis, type IconKind, type Pt } from "./ui";

// ================================================================== Séquence 6 — Équipements
const GRID: { k: IconKind; l: string; c: string }[] = [
  { k: "computer", l: "Ordinateur", c: C.device },
  { k: "server", l: "Serveur", c: C.server },
  { k: "switch", l: "Switch", c: C.net },
  { k: "router", l: "Routeur", c: C.net },
  { k: "ap", l: "Point d'accès", c: C.net },
  { k: "box", l: "Box Internet", c: C.net },
];
const gridPos = (i: number): Pt => [380 + (i % 3) * 580, 400 + Math.floor(i / 3) * 340];

export const S6: React.FC = () => {
  const f = useCurrentFrame();
  const { T, END } = timing(5);
  const pc = T("Commençons par l'ordinateur");
  const srv = T("Le serveur, lui");
  const sw = T("Le switch, ou");
  const rt = T("Le routeur, lui");
  const ap = T("Le point d'accès");
  const box = T("Enfin, la box");
  const last = T("Dernière précision");
  // switch : quatre postes, une table MAC qui se remplit
  const PCS: { p: Pt; port: number; mac: string }[] = [
    { p: [480, 300], port: 1, mac: "…:01" },
    { p: [480, 800], port: 2, mac: "…:02" },
    { p: [1440, 300], port: 3, mac: "…:03" },
    { p: [1440, 800], port: 4, mac: "…:04" },
  ];
  const portX = (port: number) => 960 - 210 + (port - 1) * 60;
  const pcPath = (i: number): Pt[] => {
    const { p, port } = PCS[i];
    return [
      [p[0] + (p[0] < 960 ? 70 : -70), p[1]],
      [portX(port), p[1]],
      [portX(port), 560 + (p[1] < 560 ? -40 : 40)],
    ];
  };
  const learn = T("il apprend ainsi");
  const known = T("uniquement vers ce port");
  const flood = T("tous ses autres ports");
  const room = T("salle informatique");
  const tableRows = [
    { mac: "…:01", port: 1, at: learn },
    { mac: "…:02", port: 2, at: learn + 20 },
    { mac: "…:03", port: 3, at: learn + 40 },
    { mac: "…:04", port: 4, at: flood + 70 },
  ];
  return (
    <>
      {/* 6.1 */}
      <Plan from={T("Passons aux")} to={pc}>
        <Txt x={960} y={150} size={48} weight={800} at={T("Passons aux")}>
          À quoi sert-il ?
        </Txt>
        {GRID.map((g, i) => (
          <Panel key={g.l} x={gridPos(i)[0]} y={gridPos(i)[1]} w={520} h={290} at={T("Passons aux") + i * 3}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 90, color: C.line }}>?</div>
          </Panel>
        ))}
      </Plan>
      {/* 6.2 ordinateur */}
      <Plan from={pc} to={srv}>
        <Device kind="computer" x={560} y={480} size={200} label="Ordinateur" at={pc} />
        <Txt x={560} y={680} size={30} color={C.muted} at={pc}>
          Utilise ou fournit des ressources
        </Txt>
        <Device kind="folder" x={1300} y={480} size={150} color={C.server} label="Dossier partagé" at={T("en ouvrant un fichier")} />
        <Packet pts={[[1220, 470], [680, 470]]} t0={T("en ouvrant un fichier")} t1={T("en ouvrant un fichier") + 40} hold={30}>
          <Icon kind="file" size={56} color={C.data} />
        </Packet>
        <Chip x={560} y={300} color={C.device} at={T("qu'il est client")} until={T("Il peut aussi en fournir")}>
          client
        </Chip>
        <Chip x={560} y={300} color={C.green} at={T("Il peut aussi en fournir")}>
          fournit
        </Chip>
        <Packet pts={[[680, 520], [1220, 520]]} t0={T("en partageant")} t1={T("en partageant") + 40} hold={30}>
          <Icon kind="folder" size={56} color={C.green} />
        </Packet>
      </Plan>
      {/* 6.3 serveur */}
      <Plan from={srv} to={sw}>
        <Device kind="server" x={300} y={330} size={170} color={C.server} label="Serveur" at={srv} />
        <Txt x={760} y={240} size={30} color={C.muted} align="left" style={{ transform: "translateX(50%)" }} at={srv}>
          Fournit des services à d'autres appareils
        </Txt>
        {[
          { k: "folder" as IconKind, l: "Fichiers", cue: "stocker des fichiers" },
          { k: "globe" as IconKind, l: "Site Web", cue: "héberger un site" },
          { k: "mail" as IconKind, l: "Messagerie", cue: "gérer la messagerie" },
        ].map((s, i) => (
          <Device key={s.l} kind={s.k} x={720 + i * 260} y={350} size={100} color={C.server} label={s.l} labelSize={24} at={T(s.cue)} />
        ))}
        {[
          { k: "rack" as IconKind, l: "Grand serveur" },
          { k: "nas" as IconKind, l: "Boîtier de stockage" },
          { k: "laptop" as IconKind, l: "Ordinateur portable" },
          { k: "board" as IconKind, l: "Micro-ordinateur" },
        ].map((m, i) => (
          <Device key={m.l} kind={m.k} x={420 + i * 360} y={700} size={130} color={C.server} label={m.l} sub="serveur" labelSize={24} at={T("pas forcément") + i * 8} glow={i === 1 ? prog(f, T("son rôle")) : 0} />
        ))}
        {[0, 1, 2].map((i) => (
          <React.Fragment key={i}>
            <Device kind="phone" x={620 + i * 160} y={520} size={60} at={T("son rôle")} />
            <Packet pts={[[620 + i * 160, 560], [780, 630]]} t0={T("son rôle") + i * 8} t1={T("son rôle") + i * 8 + 25} size={18} />
            <Packet pts={[[780, 630], [620 + i * 160, 560]]} t0={T("son rôle") + 35 + i * 8} t1={T("son rôle") + 60 + i * 8} size={18} color={C.green} />
          </React.Fragment>
        ))}
        <Txt x={960} y={900} size={36} weight={800} color={C.server} at={T("son rôle")}>
          Ce qui compte : le rôle
        </Txt>
      </Plan>
      {/* 6.4 switch */}
      <Plan from={sw} to={rt}>
        <Pos x={960} y={560} at={T("boîtier muni")} until={room}>
          <div style={{ width: 640, height: 120, borderRadius: 18, background: "rgba(20,184,166,0.15)", border: `4px solid ${C.net}`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 30px", boxSizing: "border-box" }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 34, height: 28, borderRadius: 4, background: C.net }} />
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.text }}>{n}</div>
              </div>
            ))}
          </div>
        </Pos>
        <Txt x={960} y={470} size={28} weight={800} color={C.net} at={T("boîtier muni")} until={room}>
          Switch (commutateur)
        </Txt>
        {PCS.map((pc, i) => (
          <React.Fragment key={i}>
            <Wire pts={pcPath(i)} at={T("relie entre eux")} until={room} />
            <Device kind="computer" x={pc.p[0]} y={pc.p[1]} size={120} label={`Port ${pc.port}`} sub={f >= T("adresse MAC") ? `MAC : ${pc.mac}` : undefined} at={T("relie entre eux")} until={room} labelSize={24} />
          </React.Fragment>
        ))}
        <Txt x={960} y={380} size={30} weight={800} color={C.data} at={T("des trames")} until={learn}>
          Trame
        </Txt>
        <Pos x={1010} y={380} at={T("des trames")} until={learn}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: C.data, marginLeft: 120 }} />
        </Pos>
        {/* table MAC */}
        <Pos x={960} y={830} at={learn - 10} until={room}>
          <div style={{ width: 420, borderRadius: 14, background: C.panel, border: `3px solid ${C.line}`, padding: "10px 18px", boxSizing: "border-box", fontFamily: FONT }}>
            <div style={{ fontWeight: 800, fontSize: 22, color: C.muted, marginBottom: 4 }}>Table des adresses MAC</div>
            {tableRows.map((r) => (
              <div key={r.mac} style={{ fontWeight: 700, fontSize: 24, color: f >= known && f < flood && r.port === 3 ? C.wifi : C.text, opacity: prog(f, r.at), height: f >= r.at ? 30 : 0, overflow: "hidden" }}>
                {r.mac} → port {r.port}
              </div>
            ))}
          </div>
        </Pos>
        {[0, 1, 2].map((i) => (
          <Packet key={i} pts={pcPath(i)} t0={learn + i * 20} t1={learn + i * 20 + 22} size={24} />
        ))}
        <Packet pts={[...pcPath(0), ...[...pcPath(2)].reverse()]} t0={known} t1={known + 50} size={28} />
        {[1, 2, 3].map((i) => (
          <Packet key={i} pts={[...pcPath(0), ...[...pcPath(i)].reverse()]} t0={flood} t1={flood + 55} size={28} />
        ))}
        <Packet pts={pcPath(3)} t0={flood + 60} t1={flood + 80} size={24} color={C.green} />
        <Pos x={960} y={540} at={room}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 90px)", gap: 18 }}>
              {Array.from({ length: 16 }, (_, k) => (
                <Icon key={k} kind="computer" size={80} />
              ))}
            </div>
            <Icon kind="switch" size={260} color={C.net} />
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.text }}>Salle informatique : 16 postes, un switch de 24 ports</div>
          </div>
        </Pos>
      </Plan>
      {/* 6.5 routeur */}
      <Plan from={rt} to={ap}>
        <Zone x={120} y={220} w={740} h={540} color={C.device} label="Réseau de l'entreprise" at={rt} />
        <Zone x={1060} y={220} w={740} h={540} color={C.internet} label="Réseau de l'opérateur, vers Internet" at={rt} />
        <Device kind="computer" x={330} y={420} size={100} at={rt} />
        <Device kind="computer" x={330} y={620} size={100} at={rt} />
        <Device kind="cloud" x={1530} y={500} size={190} color={C.internet} label="Internet" at={rt} />
        <Device kind="router" x={960} y={490} size={150} color={C.net} label="Routeur" at={rt} />
        <Pos x={960} y={300} at={T("panneaux indicateurs")}>
          <svg width={200} height={80} viewBox="0 0 200 80">
            <g transform={`rotate(${interpolate(f, [T("panneaux indicateurs"), T("panneaux indicateurs") + 15], [180, 0], clamp)} 100 40)`}>
              <path d="M20 20H160L185 40L160 60H20Z" fill={C.wifi} />
            </g>
            <rect x={96} y={58} width={8} height={22} fill={C.copper} />
          </svg>
        </Pos>
        <Packet pts={[[400, 520], [880, 490]]} t0={T("Il reçoit des paquets")} t1={T("Il reçoit des paquets") + 40} hold={T("panneaux indicateurs") - T("Il reçoit des paquets") - 30}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: C.data }} />
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.data }}>Vers : site du fournisseur</div>
          </div>
        </Packet>
        <Packet pts={[[1040, 490], [1440, 500]]} t0={T("panneaux indicateurs") + 15} t1={T("panneaux indicateurs") + 55} />
        <Pos x={960} y={870} at={T("informations de routage")}>
          <div style={{ width: 640, borderRadius: 14, background: C.panel, border: `3px solid ${C.line}`, padding: "10px 20px", boxSizing: "border-box", fontFamily: FONT, fontSize: 24, fontWeight: 700, color: C.text }}>
            <div>Réseau de l'entreprise → côté gauche</div>
            <div style={{ color: f >= T("informations de routage") + 10 ? C.wifi : C.text }}>Tout le reste → opérateur</div>
          </div>
        </Pos>
        <Chip x={960} y={180} color={C.data} size={26} at={T("l'adresse IP")}>
          Adresse IP (chapitres suivants)
        </Chip>
      </Plan>
      {/* 6.6 point d'accès */}
      <Plan from={ap} to={box}>
        <Pos x={960} y={520} at={ap}>
          <div style={{ width: 1520, height: 300, borderRadius: 20, border: `4px solid ${C.copper}`, background: "rgba(30,41,59,0.6)" }} />
        </Pos>
        <Txt x={960} y={330} size={26} color={C.muted} at={ap}>
          Couloir du lycée, vu de dessus
        </Txt>
        {[600, 1320].map((x) => (
          <React.Fragment key={x}>
            <WifiArcs x={x} y={520} r={220} at={ap} />
            <Device kind="ap" x={x} y={520} size={110} color={C.net} label="Point d'accès" labelSize={22} at={ap} />
            <Wire pts={[[x, 590], [x, 760], [960, 760], [960, 840]]} at={ap + 10} glow={prog(f, T("réseau câblé"))} />
          </React.Fragment>
        ))}
        <Device kind="switch" x={960} y={880} size={130} color={C.net} label="Switch, local technique" labelSize={20} at={ap + 10} />
        <Device kind="laptop" x={interpolate(f, [T("rejoindre un réseau"), T("rejoindre un réseau") + 40], [150, 470], clamp)} y={600} size={90} at={T("rejoindre un réseau")} />
        <Device kind="phone" x={interpolate(f, [T("rejoindre un réseau"), T("rejoindre un réseau") + 40], [1800, 1460], clamp)} y={600} size={80} at={T("rejoindre un réseau")} />
        <Chip x={470} y={470} color={C.green} size={20} at={T("rejoindre un réseau", 0, 1.8)}>
          connecté
        </Chip>
        <Chip x={1460} y={470} color={C.green} size={20} at={T("rejoindre un réseau", 0, 1.8)}>
          connecté
        </Chip>
      </Plan>
      {/* 6.7 box Internet */}
      <Plan from={box} to={last}>
        {(() => {
          const regroup = ramp(f, T("réparties dans plusieurs"), T("réparties dans plusieurs") + 30);
          const mods: { l: string; k: IconKind; p: Pt; cue: string; q: Pt }[] = [
            { l: "Routeur", k: "router", p: [560, 400], cue: "un routeur", q: [700, 560] },
            { l: "Switch (4 ports)", k: "switch", p: [1360, 400], cue: "un petit switch", q: [820, 560] },
            { l: "Point d'accès Wi-Fi", k: "ap", p: [560, 720], cue: "un point d'accès", q: [700, 680] },
            { l: "Modem ou terminaison fibre", k: "ont", p: [1360, 720], cue: "un modem", q: [1320, 600] },
          ];
          return (
            <>
              <Device kind="box" x={960} y={560} size={200} color={C.net} label={regroup > 0.5 ? "Box" : "Box Internet"} at={box} dim={regroup > 0 ? 1 : 1 - 0.6 * prog(f, T("un routeur"))} />
              {mods.map((m) => {
                const out = prog(f, T(m.cue), 15);
                const x = interpolate(out, [0, 1], [960, m.p[0]]) * (1 - regroup) + (m.l.startsWith("Modem") ? 1440 : 960 + (m.p[0] < 960 ? -110 : 110)) * regroup;
                const y = interpolate(out, [0, 1], [560, m.p[1]]) * (1 - regroup) + (m.l.startsWith("Modem") ? 560 : 560 + (m.p[1] < 560 ? -40 : 80)) * regroup;
                const small = regroup * (m.l.startsWith("Modem") ? 0 : 0.5);
                return f >= T(m.cue) ? (
                  <Pos key={m.l} x={x} y={y}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${1 - small})` }}>
                      <Icon kind={m.k} size={120} color={C.net} />
                      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.text, whiteSpace: "nowrap", opacity: 1 - regroup * (m.l.startsWith("Modem") ? 0 : 1) }}>{m.l}</div>
                    </div>
                  </Pos>
                ) : null;
              })}
              <Wire pts={[[1430, 720], [1760, 720]]} kind="fiber" at={T("un modem")} until={T("réparties dans plusieurs")} />
              <Txt x={1700} y={780} size={22} color={C.muted} at={T("un modem")} until={T("réparties dans plusieurs")}>
                Ligne de l'opérateur
              </Txt>
              <Txt x={960} y={180} size={34} weight={800} at={T("plusieurs fonctions")}>
                Une box regroupe souvent plusieurs fonctions
              </Txt>
              <Txt x={1440} y={680} size={26} color={C.muted} at={T("réparties dans plusieurs") + 20}>
                Terminaison fibre séparée
              </Txt>
            </>
          );
        })()}
      </Plan>
      {/* 6.8 */}
      <Plan from={last} to={END + 20}>
        <Pos x={960} y={450} at={T("savent aussi router")} until={T("vous serviront")}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative", width: 260, height: 200 }}>
              <div style={{ position: "absolute", left: 0, top: 30 }}>
                <Icon kind="switch" size={260} color={C.net} />
              </div>
              <div style={{ position: "absolute", left: 90, top: -10 }}>
                <Icon kind="router" size={80} color={C.wifi} />
              </div>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.text }}>Switch qui sait aussi router</div>
          </div>
        </Pos>
        {GRID.map((g, i) => (
          <Panel key={g.l} x={gridPos(i)[0]} y={gridPos(i)[1]} w={520} h={290} at={T("vous serviront") + i * 3}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <Icon kind={g.k} size={120} color={g.c} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.text }}>{g.l}</div>
            </div>
          </Panel>
        ))}
      </Plan>
    </>
  );
};

// ================================================================== Séquence 7 — Réseau local et Internet
const HOME = {
  box: [960, 520] as Pt,
  pc1: [520, 320] as Pt,
  laptop: [520, 760] as Pt,
  printer: [1400, 320] as Pt,
  phone: [1400, 760] as Pt,
};

export const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { T, END } = timing(6);
  const home = T("Regardons");
  const route = T("Mais la box a");
  const inet = T("Et Internet, alors");
  const cut = T("Voici maintenant");
  const ent = T("De même");
  const pan = ramp(f, route, route + 25);
  const showHome = f < inet - 1 || (f >= cut && f < ent);
  const homeO = interpolate(f, [inet - 10, inet, cut, cut + 10], [1, 0, 0, 1], clamp);
  const cutAt = T("soit coupée");
  const fam = [
    { l: "Opérateurs", cue: "des opérateurs", c: C.device, p: [520, 380] as Pt },
    { l: "Entreprises", cue: "des entreprises", c: C.net, p: [1400, 380] as Pt },
    { l: "Universités", cue: "des universités", c: C.server, p: [520, 740] as Pt },
    { l: "Hébergeurs", cue: "des hébergeurs", c: C.wifi, p: [1400, 740] as Pt },
  ];
  return (
    <>
      {/* 7.1 */}
      <Plan from={T("Venons-en")} to={home}>
        <Txt x={560} y={200} size={60} weight={800} color={C.net} at={T("Venons-en")}>
          Réseau local
        </Txt>
        <Txt x={1360} y={200} size={60} weight={800} color={C.internet} at={T("Venons-en")}>
          Internet
        </Txt>
        {[
          { k: "house" as IconKind, l: "Maison", cue: "une maison" },
          { k: "school" as IconKind, l: "Salle de classe", cue: "une salle de classe" },
          { k: "building" as IconKind, l: "Bureaux", cue: "les bureaux" },
        ].map((v, i) => (
          <Pos key={v.l} x={480 + i * 480} y={520} at={T(v.cue)}>
            <div style={{ width: 380, height: 300, border: `3px dashed ${C.net}`, borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <Icon kind={v.k} size={120} color={C.device} />
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.text }}>{v.l}</div>
            </div>
          </Pos>
        ))}
        <Pos x={960} y={800} at={T("généralement privé")}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.text }}>
            <Icon kind="lock" size={56} color={C.wifi} />
            Privé : le propriétaire décide qui se connecte
          </div>
        </Pos>
      </Plan>
      {/* 7.2, 7.3 et 7.5 : le réseau domestique */}
      {f >= home - 1 && f < ent + 10 && showHome && (
        <div style={{ position: "absolute", inset: 0, opacity: homeO * (1 - prog(f, ent - 10)), transform: `translateX(${-320 * pan}px)` }}>
          <Zone x={300} y={180} w={1320} h={720} color={C.net} label="Réseau local" at={T("même réseau local")} />
          <Wire pts={[[600, 340], [870, 490]]} at={T("par un câble")} />
          <Wire pts={[[600, 740], [870, 560]]} kind="wifi" at={T("utilisent le Wi-Fi")} />
          <Wire pts={[[1320, 340], [1050, 490]]} kind="wifi" at={T("utilisent le Wi-Fi")} />
          <Wire pts={[[1320, 740], [1050, 560]]} kind="wifi" at={T("utilisent le Wi-Fi")} />
          <Device kind="box" x={HOME.box[0]} y={HOME.box[1]} size={160} color={C.net} label="Box Internet" sub="switch + point d'accès Wi-Fi" at={T("une box")} glow={f >= T("elle sert de routeur") && f < inet ? 1 : 0} glowColor={C.wifi} />
          <Device kind="computer" x={HOME.pc1[0]} y={HOME.pc1[1]} size={130} label="Ordinateur 1" at={T("par un câble")} />
          <Device kind="laptop" x={HOME.laptop[0]} y={HOME.laptop[1]} size={130} label="Ordinateur 2" at={T("utilisent le Wi-Fi")} />
          <Device kind="printer" x={HOME.printer[0]} y={HOME.printer[1]} size={130} label="Imprimante" at={T("utilisent le Wi-Fi")} />
          <Device kind="phone" x={HOME.phone[0]} y={HOME.phone[1]} size={120} label="Smartphone" at={T("utilisent le Wi-Fi")} />
          <Chip x={960} y={410} color={C.wifi} size={22} at={T("elle sert de routeur")} until={inet}>
            + routeur
          </Chip>
          {/* échanges locaux */}
          <Packet pts={[[600, 340], [960, 520], [1320, 340]]} t0={T("l'ordinateur envoie")} t1={T("l'ordinateur envoie") + 50}>
            <Icon kind="file" size={44} color={C.data} />
          </Packet>
          <Packet pts={[[1320, 740], [960, 520], [600, 340]]} t0={T("le smartphone transfère")} t1={T("le smartphone transfère") + 50}>
            <Icon kind="photo" size={44} color={C.data} />
          </Packet>
          <Chip x={520} y={160} color={C.green} size={22} at={T("les services")} until={route}>
            Partage activé
          </Chip>
          <Chip x={1400} y={160} color={C.green} size={22} at={T("les services")} until={route}>
            Imprimante installée
          </Chip>
          {/* accès Internet */}
          <Wire pts={[[1050, 520], [1960, 520]]} at={T("au réseau d'un")} glow={0} color={f >= cutAt ? C.red : undefined} />
          <Wire pts={[[2040, 455], [2040, 340]]} at={T("au réseau d'un") + 15} />
          <Device kind="building" x={2040} y={520} size={110} color={C.internet} label="Opérateur" sub="fournisseur d'accès" at={T("au réseau d'un")} />
          <Device kind="cloud" x={2040} y={190} size={150} color={C.internet} label="Internet" at={T("au réseau d'un") + 15} />
          <Chip x={1640} y={470} color={C.data} size={24} at={T("on parle d'un accès")} until={cut}>
            Accès Internet
          </Chip>
          <Mark x={1640} y={520} size={70} ok={false} at={cutAt} />
          <Txt x={1640} y={420} size={30} weight={800} color={C.red} at={cutAt}>
            Plus d'Internet
          </Txt>
          <Pos x={520} y={760} at={T("les sites ne")}>
            <div style={{ marginTop: -24, padding: "4px 10px", borderRadius: 6, background: C.red, fontFamily: FONT, fontWeight: 800, fontSize: 18, color: "#0B1220" }}>Site inaccessible</div>
          </Pos>
          <Packet pts={[[600, 340], [960, 520], [1320, 340]]} t0={T("peut toujours imprimer")} t1={T("peut toujours imprimer") + 45} />
          <Mark x={1400} y={210} size={50} at={T("peut toujours imprimer", 0, 1.8)} />
          <Packet pts={[[1320, 740], [960, 520], [600, 340]]} t0={T("envoyer des photos")} t1={T("envoyer des photos") + 45}>
            <Icon kind="photo" size={44} color={C.data} />
          </Packet>
          <Txt x={960} y={960 - 40} size={34} weight={800} color={C.green} at={T("continue de fonctionner")}>
            Le réseau local fonctionne toujours
          </Txt>
        </div>
      )}
      {/* 7.4 Internet : des réseaux interconnectés */}
      <Plan from={inet} to={cut}>
        <Txt x={960} y={140} size={40} weight={800} at={inet}>
          Internet : un ensemble mondial de réseaux interconnectés
        </Txt>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: vis(f, inet) }}>
          {Array.from({ length: 28 }, (_, i) => {
            const a = ((i * 137.5) % 360) * (Math.PI / 180);
            const r = 120 + ((i * 53) % 330);
            const x = 960 + Math.cos(a) * r * 1.6;
            const y = 560 + Math.sin(a) * r * 0.9;
            const j = (i * 7 + 3) % 28;
            const a2 = ((j * 137.5) % 360) * (Math.PI / 180);
            const r2 = 120 + ((j * 53) % 330);
            return <line key={i} x1={x} y1={y} x2={960 + Math.cos(a2) * r2 * 1.6} y2={560 + Math.sin(a2) * r2 * 0.9} stroke={C.line} strokeWidth={3} />;
          })}
        </svg>
        {Array.from({ length: 28 }, (_, i) => {
          const a = ((i * 137.5) % 360) * (Math.PI / 180);
          const r = 120 + ((i * 53) % 330);
          const x = 960 + Math.cos(a) * r * 1.6;
          const y = 560 + Math.sin(a) * r * 0.9;
          const famI = (x < 960 ? 0 : 1) + (y < 560 ? 0 : 2);
          const lit = f >= T(fam[famI].cue);
          return (
            <Pos key={i} x={x} y={y} at={inet + i}>
              <div style={{ width: 40 + (i % 3) * 16, height: 40 + (i % 3) * 16, borderRadius: "50%", border: `3px solid ${lit ? fam[famI].c : C.internet}`, background: lit ? `${fam[famI].c}33` : "rgba(100,116,139,0.15)" }} />
            </Pos>
          );
        })}
        {fam.map((fa) => (
          <Chip key={fa.l} x={fa.p[0]} y={fa.p[1]} color={fa.c} size={28} at={T(fa.cue)}>
            {fa.l}
          </Chip>
        ))}
        <Txt x={960} y={560} size={30} weight={800} color={C.text} at={T("Des dizaines de milliers")} until={T("Le Web")}>
          des dizaines de milliers de réseaux
        </Txt>
        <Chip x={860} y={560} color={C.device} size={30} at={T("Le Web")}>
          Web
        </Chip>
        <Chip x={1080} y={560} color={C.device} size={30} at={T("comme la messagerie")}>
          Messagerie
        </Chip>
        <Txt x={960} y={640} size={28} color={C.muted} at={T("Le Web")}>
          Le Web : un service parmi d'autres
        </Txt>
      </Plan>
      {/* 7.6 */}
      <Plan from={ent} to={END + 20}>
        <Panel x={500} y={520} w={760} h={560} at={ent}>
          <div style={{ padding: 24, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.text, textAlign: "center" }}>Entreprise sans Internet</div>
        </Panel>
        <Device kind="server" x={300} y={540} size={120} color={C.server} label="Serveur local" labelSize={22} at={ent} glow={1} glowColor={C.green} />
        <Device kind="computer" x={560} y={540} size={100} at={ent} />
        <Wire pts={[[360, 540], [500, 540]]} at={ent} color={C.green} />
        <Device kind="cloud" x={760} y={420} size={110} color={C.internet} at={ent} />
        <Mark x={760} y={420} size={50} ok={false} at={ent + 10} />
        <Pos x={500} y={720} at={T("service en ligne")}>
          <div style={{ padding: "10px 18px", borderRadius: 12, background: "rgba(100,116,139,0.3)", fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.muted }}>Service en ligne : indisponible</div>
        </Pos>
        <Panel x={1420} y={520} w={760} h={560} at={T("un signal Wi-Fi")}>
          <div style={{ padding: 24, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.text, textAlign: "center" }}>Wi-Fi au maximum…</div>
        </Panel>
        <Pos x={1420} y={540} at={T("un signal Wi-Fi")}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Icon kind="phone" size={160} />
            <svg width={80} height={70}>
              {[0, 1, 2, 3].map((b) => (
                <rect key={b} x={b * 19} y={54 - b * 16} width={14} height={16 + b * 16} rx={2} fill={C.green} />
              ))}
            </svg>
          </div>
        </Pos>
        <Txt x={1420} y={700} size={28} weight={800} color={C.red} at={T("un signal Wi-Fi", 0, 1)}>
          … mais pas d'accès à Internet
        </Txt>
        <Txt x={960} y={880} size={44} weight={800} color={C.wifi} at={T("la liaison radio")}>
          Wi-Fi ≠ Internet
        </Txt>
      </Plan>
    </>
  );
};

// ================================================================== Séquence 8 — Réseau d'entreprise
const N = {
  lea: [360, 300] as Pt,
  karim: [760, 300] as Pt,
  sophie: [1160, 300] as Pt,
  thomas: [1560, 300] as Pt,
  sw: [960, 580] as Pt,
  server: [480, 830] as Pt,
  printer: [880, 830] as Pt,
  router: [1320, 830] as Pt,
  cloud: [1700, 830] as Pt,
  site: [1700, 590] as Pt,
};
const LINKS: Pt[][] = [
  [[360, 360], [860, 540]],
  [[760, 360], [920, 540]],
  [[1160, 360], [1000, 540]],
  [[1560, 360], [1060, 540]],
  [[900, 620], [480, 765]],
  [[940, 620], [880, 765]],
  [[1020, 620], [1320, 770]],
  [[1385, 830], [1600, 830]],
  [[1700, 765], [1700, 655]],
];

export const S8: React.FC = () => {
  const f = useCurrentFrame();
  const { T, END } = timing(7);
  const hyp = T("Avant de lancer");
  const acts = [T("Première action"), T("Deuxième action"), T("Troisième action"), T("Quatrième action"), T("Observez")];
  const act = acts.slice(0, 4).filter((a) => f >= a).length; // 0 = aucune
  const inAct = act > 0 && f < acts[4];
  const paths = [
    [0, 4],
    [1, 5],
    [2, 6, 7, 8],
    [3, 0],
  ];
  const onPath = (li: number) => !inAct || paths[act - 1].includes(li);
  const zoom = ramp(f, hyp, hyp + 20) * (1 - ramp(f, acts[0] - 10, acts[0] + 10));
  const banner = [
    "Action 1 : Léa ouvre un document du serveur · traversé : switch",
    "Action 2 : Karim imprime une facture · traversé : switch",
    "Action 3 : Sophie consulte un site · traversés : switch, routeur, opérateur",
    "Action 4 : Thomas récupère un fichier chez Léa · traversé : switch",
  ];
  const internal = T("le switch suffit");
  const outside = T("Le routeur n'entre");
  const dimFor = (ids: number[]) => (inAct && !ids.some((i) => paths[act - 1].includes(i)) ? 0.3 : 1);
  return (
    <>
      <Plan from={T("Mettons tout cela")} to={END + 20}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${-300 * zoom}px, ${40 * zoom}px) scale(${1 - 0.2 * zoom})`, transformOrigin: "50% 50%" }}>
          {LINKS.map((pts, i) => (
            <Wire
              key={i}
              pts={pts}
              at={[T("Chaque ordinateur"), T("Chaque ordinateur"), T("Chaque ordinateur"), T("Chaque ordinateur"), T("un serveur de fichiers"), T("une imprimante réseau"), T("un routeur"), T("l'accès Internet"), T("hébergé sur un serveur")][i]}
              dim={onPath(i) ? 1 : 0.25}
              glow={inAct && onPath(i) ? 1 : 0}
            />
          ))}
          <Device kind="computer" x={N.lea[0]} y={N.lea[1]} size={120} label="Léa" at={T("Léa")} dim={dimFor([0])} glow={f >= internal ? 0.8 : 0} glowColor={C.green} />
          <Device kind="computer" x={N.karim[0]} y={N.karim[1]} size={120} label="Karim" sub={act === 4 && f >= T("ne le reçoivent pas") && f < acts[4] ? "ne reçoit pas" : undefined} at={T("Karim")} dim={dimFor([1])} glow={f >= internal ? 0.8 : 0} glowColor={C.green} />
          <Device kind="computer" x={N.sophie[0]} y={N.sophie[1]} size={120} label="Sophie" sub={act === 4 && f >= T("ne le reçoivent pas") && f < acts[4] ? "ne reçoit pas" : undefined} at={T("Sophie")} dim={dimFor([2])} glow={f >= internal ? 0.8 : 0} glowColor={C.green} />
          <Device kind="computer" x={N.thomas[0]} y={N.thomas[1]} size={120} label="Thomas" at={T("Thomas")} dim={dimFor([3])} glow={f >= internal ? 0.8 : 0} glowColor={C.green} />
          <Device kind="switch" x={N.sw[0]} y={N.sw[1]} size={220} color={C.net} label="Switch" at={T("un switch")} glow={f >= internal ? 1 : 0} glowColor={C.green} />
          <Device kind="server" x={N.server[0]} y={N.server[1]} size={120} color={C.server} label="Serveur de fichiers" at={T("un serveur de fichiers")} dim={dimFor([4])} glow={f >= internal ? 0.8 : 0} glowColor={C.green} />
          <Device kind="printer" x={N.printer[0]} y={N.printer[1]} size={120} label="Imprimante réseau" at={T("une imprimante réseau")} dim={dimFor([5])} glow={f >= internal ? 0.8 : 0} glowColor={C.green} />
          <Device kind="router" x={N.router[0]} y={N.router[1]} size={110} color={C.net} label="Routeur" sub={act === 1 && f >= T("Le routeur n'intervient") && f < acts[1] ? "non utilisé" : undefined} at={T("un routeur")} dim={dimFor([6, 7])} glow={f >= outside ? 1 : 0} glowColor={C.device} />
          <Device kind="cloud" x={N.cloud[0]} y={N.cloud[1]} size={160} color={C.internet} label="Accès Internet" at={T("l'accès Internet")} dim={dimFor([7, 8])} glow={f >= outside ? 1 : 0} glowColor={C.device} />
          <Device kind="server" x={N.site[0]} y={N.site[1]} size={90} color={C.copper} label="Site du fournisseur" labelSize={20} at={T("hébergé sur un serveur")} until={acts[3]} />
          {/* action 1 */}
          <Packet pts={[[360, 360], [960, 580], [480, 770]]} t0={T("envoie une demande")} t1={T("envoie une demande") + 50} size={22} />
          <Packet pts={[[480, 770], [960, 580], [360, 360]]} t0={T("Le serveur répond")} t1={T("Le serveur répond") + 60}>
            <Icon kind="file" size={44} color={C.data} />
          </Packet>
          {/* action 2 */}
          {[0, 1, 2].map((k) => (
            <Packet key={k} pts={[[760, 360], [960, 580], [880, 770]]} t0={T("Les données partent") + k * 8} t1={T("Les données partent") + k * 8 + 50} size={22} />
          ))}
          <Pos x={880} y={interpolate(f, [T("arrivent à l'imprimante"), T("arrivent à l'imprimante") + 25], [880, 930], clamp)} at={T("arrivent à l'imprimante")} until={acts[2]}>
            <div style={{ width: 60, height: 40, background: C.text, borderRadius: 3 }} />
          </Pos>
          {/* action 3 */}
          <Packet pts={[[1160, 360], [960, 580], [1320, 770]]} t0={T("La demande de Sophie")} t1={T("La demande de Sophie") + 50} hold={T("Le routeur l'envoie") - T("La demande de Sophie") - 50} size={22} />
          <Packet pts={[[1320, 830], [1700, 830], [1700, 640]]} t0={T("Le routeur l'envoie")} t1={T("Le routeur l'envoie") + 60} size={22} />
          <Packet pts={[[1700, 640], [1700, 830], [1320, 830], [960, 580], [1160, 360]]} t0={T("La réponse revient")} t1={T("La réponse revient") + 90}>
            <Icon kind="globe" size={44} color={C.data} />
          </Packet>
          {/* action 4 */}
          <Packet pts={[[1560, 360], [960, 580], [360, 360]]} t0={T("La demande de Thomas")} t1={T("La demande de Thomas") + 55} size={22} />
          <Packet pts={[[360, 360], [960, 580], [1560, 360]]} t0={T("Le fichier revient")} t1={T("Le fichier revient") + 55}>
            <Icon kind="file" size={44} color={C.data} />
          </Packet>
        </div>
        {/* hypothèses */}
        <Panel x={1560} y={560} w={520} h={560} at={hyp} until={acts[0]}>
          <div style={{ padding: "26px 30px", fontFamily: FONT, color: C.text }}>
            <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 18 }}>Hypothèses</div>
            {[
              ["Même réseau local, bien configuré", "même réseau local"],
              ["Droits d'accès au dossier commun", "le droit"],
              ["Impression directe, sans passer par le serveur", "directement"],
              ["Ce qui sort du réseau est confié au routeur", "confier au routeur"],
            ].map(([l, cue]) => (
              <div key={l} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 18, opacity: prog(f, T(cue)), fontSize: 27, fontWeight: 700, lineHeight: 1.25 }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: C.green, marginTop: 10, flexShrink: 0 }} />
                {l}
              </div>
            ))}
          </div>
        </Panel>
        {inAct && (
          <Pos x={960} y={150} at={acts[act - 1]}>
            <div style={{ padding: "12px 28px", borderRadius: 16, background: C.panel, border: `3px solid ${C.data}`, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.text, whiteSpace: "nowrap" }}>{banner[act - 1]}</div>
          </Pos>
        )}
        <Txt x={960} y={210} size={22} color={C.muted} at={T("Je simplifie")} until={acts[3]}>
          Simplifié : la traduction du nom du site en adresse IP (DNS) et les autres opérations du routeur seront vues plus tard
        </Txt>
        <Chip x={130} y={60} color={C.muted} size={20} filled={false} at={acts[0]} until={acts[4]}>
          Hypothèses
        </Chip>
        <Txt x={960} y={140} size={36} weight={800} color={C.green} at={internal}>
          Échanges internes : le switch suffit
        </Txt>
        <Txt x={960} y={200} size={36} weight={800} color={C.device} at={outside}>
          Vers l'extérieur : le routeur
        </Txt>
      </Plan>
    </>
  );
};

// ================================================================== Séquence 9 — Questions
const Countdown: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 10) return null;
  const k = interpolate(f, [from, to], [0, 1], clamp);
  const left = Math.max(0, Math.ceil((to - f) / 25));
  return (
    <Pos x={1790} y={110}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={70} cy={70} r={60} fill="none" stroke={C.line} strokeWidth={10} />
        <circle cx={70} cy={70} r={60} fill="none" stroke={C.wifi} strokeWidth={10} pathLength={1} strokeDasharray={1} strokeDashoffset={k} transform="rotate(-90 70 70)" strokeLinecap="round" />
        <text x={70} y={86} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={C.text}>
          {left}
        </text>
      </svg>
    </Pos>
  );
};

const QUESTIONS = [
  "Chez lui, Karim voit le Wi-Fi de son smartphone au maximum, pourtant aucun site ne s'ouvre. Il arrive quand même à imprimer depuis son smartphone. Comment est-ce possible ?",
  "Léa envoie un fichier à Karim. Pourquoi le switch ne le transmet-il pas aussi aux ordinateurs de Sophie et de Thomas ?",
  "Un vieil ordinateur portable reste allumé dans un placard et partage les photos avec tous les appareils de la maison. Est-ce un serveur ?",
  "Une entreprise veut relier deux bâtiments distants de 500 mètres. Quel support choisiriez-vous ?",
  "L'entreprise ouvre une agence dans une autre ville, avec son propre réseau. Quel équipement permet aux deux réseaux de communiquer ?",
];
const ANSWERS = [
  "Le Wi-Fi relie le smartphone à la box : c'est l'accès Internet qui est coupé, pas le réseau local.",
  "Le switch connaît le port de chaque adresse MAC.",
  "Oui : un serveur se définit par son rôle, pas par sa taille.",
  "La fibre optique.",
  "Le routeur (un sur chaque site).",
];

export const S9: React.FC = () => {
  const { T, PS, PE, END } = timing(8);
  const q = [1, 2, 3, 4, 5].map((i) => T(`Question ${i}`));
  return (
    <>
      <Plan from={T("Passons à la vérification")} to={q[0]}>
        <Txt x={960} y={420} size={64} weight={800} at={T("Passons à la vérification")}>
          5 questions
        </Txt>
        <Txt x={960} y={520} size={36} color={C.muted} at={T("Répondez avant")}>
          Répondez avant la correction
        </Txt>
        <Pos x={960} y={660} at={T("mettez la vidéo en pause")}>
          <svg width={110} height={110} viewBox="0 0 110 110">
            <circle cx={55} cy={55} r={50} fill="none" stroke={C.wifi} strokeWidth={6} />
            <rect x={38} y={32} width={11} height={46} rx={3} fill={C.wifi} />
            <rect x={61} y={32} width={11} height={46} rx={3} fill={C.wifi} />
          </svg>
        </Pos>
      </Plan>
      {q.map((at, i) => {
        const qEnd = PE(2 * i + 1);
        const ans = PS(2 * i + 2);
        const to = i < 4 ? q[i + 1] : END + 20;
        return (
          <Plan key={i} from={at} to={to}>
            <Chip x={220} y={140} color={C.device} size={28} at={at}>
              {`Question ${i + 1}/5`}
            </Chip>
            <Txt x={960} y={290} size={40} w={1400} weight={700} at={at}>
              {QUESTIONS[i]}
            </Txt>
            <Countdown from={qEnd} to={ans} />
            <Txt x={1790} y={200} size={24} color={C.wifi} at={qEnd} until={ans}>
              À vous !
            </Txt>
            <QuestionArt i={i} at={at} ans={ans} T={T} />
            <Pos x={960} y={880} at={ans}>
              <div style={{ padding: "14px 34px", borderRadius: 18, background: "rgba(34,197,94,0.18)", border: `3px solid ${C.green}`, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.text, whiteSpace: "nowrap" }}>
                <span style={{ color: C.green }}>Réponse : </span>
                {ANSWERS[i]}
              </div>
            </Pos>
          </Plan>
        );
      })}
    </>
  );
};

const QuestionArt: React.FC<{ i: number; at: number; ans: number; T: (p: string, n?: number, o?: number) => number }> = ({ i, at, ans }) => {
  const f = useCurrentFrame();
  const after = f >= ans;
  if (i === 0)
    return (
      <>
        <Wire pts={[[760, 610], [900, 610]]} kind="wifi" at={at} glow={after ? 1 : 0} />
        <Wire pts={[[1020, 610], [1160, 610]]} kind="wifi" at={at} glow={after ? 1 : 0} />
        <Wire pts={[[1030, 640], [1480, 640]]} at={at} color={C.red} />
        <Device kind="phone" x={700} y={610} size={110} at={at} />
        <Device kind="box" x={960} y={610} size={120} color={C.net} label="Box" labelSize={22} at={at} />
        <Device kind="printer" x={1230} y={610} size={110} at={at} />
        <Device kind="building" x={1540} y={640} size={90} color={C.internet} label="Opérateur" labelSize={20} at={at} />
        <Mark x={1380} y={640} size={46} ok={false} at={at + 10} />
        <svg width={60} height={50} style={{ position: "absolute", left: 600, top: 520 }}>
          {[0, 1, 2, 3].map((b) => (
            <rect key={b} x={b * 14} y={40 - b * 11} width={10} height={10 + b * 11} rx={2} fill={C.green} />
          ))}
        </svg>
        <Packet pts={[[760, 580], [960, 580], [1170, 580]]} t0={ans + 20} t1={ans + 70} hold={60} />
      </>
    );
  if (i === 1) {
    const nodes: Pt[] = [
      [660, 480],
      [1260, 480],
      [660, 730],
      [1260, 730],
    ];
    const names = ["Léa", "Karim", "Sophie", "Thomas"];
    return (
      <>
        {nodes.map((n, k) => (
          <React.Fragment key={k}>
            <Wire pts={[n, [960, 605]]} at={at} dim={after && k > 1 ? 0.3 : 1} glow={after && k < 2 ? 1 : 0} />
            <Device kind="computer" x={n[0]} y={n[1]} size={100} label={names[k]} labelSize={22} at={at} dim={after && k > 1 ? 0.35 : 1} />
          </React.Fragment>
        ))}
        <Device kind="switch" x={960} y={605} size={170} color={C.net} at={at} />
        <Packet pts={[nodes[0], [960, 605], nodes[1]]} t0={at + 30} t1={at + 90} hold={20} />
        <Pos x={1600} y={605} at={ans}>
          <div style={{ padding: "10px 18px", borderRadius: 12, background: C.panel, border: `3px solid ${C.wifi}`, fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.text }}>
            <div style={{ color: C.muted, fontSize: 20 }}>Table MAC</div>
            <div style={{ color: C.wifi }}>Karim → port 2</div>
          </div>
        </Pos>
      </>
    );
  }
  if (i === 2)
    return (
      <>
        <Pos x={700} y={620} at={at}>
          <div style={{ width: 260, height: 260, border: `4px solid ${C.copper}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30,41,59,0.6)" }}>
            <Icon kind="laptop" size={150} color={after ? C.server : C.device} />
          </div>
        </Pos>
        <Txt x={700} y={790} size={24} color={C.muted} at={at}>
          placard
        </Txt>
        {(["tv", "tablet", "phone"] as IconKind[]).map((k, j) => (
          <React.Fragment key={k}>
            <Wire pts={[[840, 620], [1150, 470 + j * 150]]} kind="dashed" at={at} />
            <Device kind={k} x={1230} y={470 + j * 150} size={90} at={at} />
            {after && <Chip x={1380} y={470 + j * 150} color={C.device} size={20} at={ans + j * 4}>client</Chip>}
          </React.Fragment>
        ))}
        {after && (
          <Chip x={700} y={460} color={C.server} size={24} at={ans}>
            serveur
          </Chip>
        )}
      </>
    );
  if (i === 3)
    return (
      <>
        {[
          { l: "Cuivre", c: C.copper, note: "≈ 100 m max" },
          { l: "Fibre", c: C.fiber, note: "✓" },
          { l: "Wi-Fi", c: C.wifi, note: "portée insuffisante" },
        ].map((o, j) => (
          <Pos key={o.l} x={660 + j * 300} y={460} at={at}>
            <div
              style={{
                width: 260,
                padding: "10px 0",
                borderRadius: 14,
                border: `3px solid ${after ? (j === 1 ? C.green : j === 0 ? C.red : C.wifi) : o.c}`,
                background: after && j === 1 ? "rgba(34,197,94,0.2)" : C.panel,
                textAlign: "center",
                fontFamily: FONT,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 30, color: C.text }}>{o.l}</div>
              {after && <div style={{ fontWeight: 700, fontSize: 20, color: j === 1 ? C.green : C.muted }}>{j === 1 ? "choix le plus courant" : o.note}</div>}
            </div>
          </Pos>
        ))}
        <Device kind="building" x={560} y={680} size={120} color={C.copper} at={at} />
        <Device kind="building" x={1360} y={680} size={120} color={C.copper} at={at} />
        <Wire pts={[[640, 700], [1280, 700]]} kind={after ? "fiber" : "dashed"} at={at} />
        <Txt x={960} y={660} size={28} weight={800} at={at}>
          500 m
        </Txt>
        <Txt x={960} y={790} size={22} color={C.muted} at={ans + 40}>
          Liaison radio spécialisée : possible, mais plus sensible aux obstacles et à la météo
        </Txt>
      </>
    );
  return (
    <>
      {[
        { x: 560, l: "Siège" },
        { x: 1360, l: "Agence" },
      ].map((s, j) => (
        <React.Fragment key={s.l}>
          <Zone x={s.x - 230} y={450} w={460} h={330} color={C.device} label={s.l} at={at} />
          <Device kind="switch" x={s.x + (j ? 40 : -40)} y={640} size={130} color={C.net} at={at} />
          <Device kind="computer" x={s.x + (j ? 90 : -90)} y={530} size={70} at={at} />
          <Device kind="computer" x={s.x + (j ? -10 : 10)} y={530} size={70} at={at} />
          {after && <Device kind="router" x={s.x + (j ? -150 : 150)} y={660} size={80} color={C.wifi} at={ans} />}
        </React.Fragment>
      ))}
      <Device kind="cloud" x={960} y={640} size={140} color={C.internet} label="Opérateur ou Internet" labelSize={20} at={at} />
      {after && <Wire pts={[[730, 660], [890, 640]]} at={ans + 5} />}
      {after && <Wire pts={[[1030, 640], [1190, 660]]} at={ans + 5} />}
      <Packet pts={[[530, 640], [710, 660], [960, 640], [1210, 660], [1400, 640]]} t0={ans + 25} t1={ans + 100} />
    </>
  );
};

// ================================================================== Séquence 10 — Conclusion
export const S10: React.FC = () => {
  const f = useCurrentFrame();
  const { T, PE, END } = timing(9);
  const endCard = PE(6) + 5;
  const tiles: { k: IconKind; t: string; l: string; cue: string; c: string }[] = [
    { k: "computer", t: "Définition", l: "Des appareils reliés qui échangent des données", cue: "Un réseau informatique est", c: C.device },
    { k: "mail", t: "Communication", l: "Émetteur, récepteur, message, support, protocoles", cue: "Toute communication", c: C.data },
    { k: "plug", t: "Supports", l: "Cuivre, fibre, Wi-Fi", cue: "sur du cuivre", c: C.copper },
    { k: "switch", t: "Équipements", l: "Serveur, switch, routeur, point d'accès, box", cue: "Les principaux équipements", c: C.net },
    { k: "house", t: "Réseau local", l: "Fonctionne sans Internet", cue: "Et surtout", c: C.wifi },
    { k: "globe", t: "Internet", l: "Des réseaux reliés à l'échelle mondiale", cue: "Internet, lui", c: C.internet },
  ];
  return (
    <>
      <Plan from={T("Faisons le point")} to={T("Tout cela fonctionne")}>
        <Txt x={960} y={130} size={48} weight={800} at={T("Faisons le point")}>
          À retenir
        </Txt>
        {tiles.map((t, i) => {
          const hl = i === 4 && f >= T("Et surtout");
          return (
            <Pos key={t.t} x={380 + (i % 3) * 580} y={380 + Math.floor(i / 3) * 330} at={T(t.cue)}>
              <div style={{ width: 520, height: 290, borderRadius: 22, background: hl ? "rgba(245,158,11,0.15)" : C.panel, border: `3px solid ${hl ? C.wifi : C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 20, boxSizing: "border-box" }}>
                <Icon kind={t.k} size={90} color={t.c} />
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.text }}>{t.t}</div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, color: C.muted, textAlign: "center" }}>{t.l}</div>
              </div>
            </Pos>
          );
        })}
      </Plan>
      <Plan from={T("Tout cela fonctionne")} to={T("Vous l'avez")}>
        <Pos x={960} y={520} at={T("Tout cela fonctionne")}>
          <svg width={1500} height={700} viewBox="0 0 1500 700">
            <ellipse cx={750} cy={350} rx={720} ry={320} fill="rgba(30,41,59,0.6)" stroke={C.line} strokeWidth={4} />
            {[-480, -240, 0, 240, 480].map((dx) => (
              <ellipse key={dx} cx={750} cy={350} rx={Math.abs(dx) + 40} ry={320} fill="none" stroke={C.line} strokeWidth={2} />
            ))}
            {[-200, 0, 200].map((dy) => (
              <line key={dy} x1={60} y1={350 + dy} x2={1440} y2={350 + dy} stroke={C.line} strokeWidth={2} />
            ))}
          </svg>
        </Pos>
        <Device kind="server" x={420} y={430} size={110} color={C.server} label="Serveur en Irlande" labelSize={24} at={T("Tout cela fonctionne")} />
        <Device kind="phone" x={1500} y={480} size={100} label="Smartphone en Corée" labelSize={24} at={T("Tout cela fonctionne")} />
        <Wire pts={[[1440, 470], [1200, 330], [960, 300], [720, 330], [480, 420]]} kind="data" at={T("dialoguer")} dur={30} />
        {[[1200, 330] as Pt, [960, 300] as Pt, [720, 330] as Pt].map((p, k) => (
          <Pos key={k} x={p[0]} y={p[1]} at={T("dialoguer") + 10 + k * 6}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", border: `3px solid ${C.net}`, background: "rgba(20,184,166,0.25)" }} />
          </Pos>
        ))}
        <Txt x={960} y={780} size={40} weight={800} color={C.green} at={T("des technologies communes")}>
          Règles et technologies communes
        </Txt>
      </Plan>
      <Plan from={T("Vous l'avez")} to={endCard}>
        {[
          { k: "house" as IconKind, l: "Maison", x: 480 },
          { k: "building" as IconKind, l: "Entreprise", x: 960 },
          { k: "globe" as IconKind, l: "Internet", x: 1440 },
        ].map((s, i) => (
          <Device key={s.l} kind={s.k} x={s.x} y={430} size={110 + i * 50} color={i === 2 && f >= T("la place d'Internet") ? C.wifi : C.device} label={s.l} at={T("pas du tout") + i * 8} />
        ))}
        <Pos x={960} y={700} at={T("LAN")}>
          <svg width={1100} height={40}>
            <path d="M10 20H1070M1050 6L1080 20L1050 34" stroke={C.muted} strokeWidth={4} fill="none" />
          </svg>
        </Pos>
        <Txt x={960} y={740} size={22} color={C.muted} at={T("LAN")}>
          étendue croissante
        </Txt>
        <Chip x={480} y={660} color={C.net} size={34} at={T("LAN")}>
          LAN
        </Chip>
        <Chip x={840} y={660} color={C.net} size={34} at={T("MAN")}>
          MAN
        </Chip>
        <Chip x={1200} y={660} color={C.net} size={34} at={T("WAN")}>
          WAN
        </Chip>
        <Chip x={480} y={820} color={C.wifi} size={30} at={T("WLAN")}>
          WLAN · sans fil
        </Chip>
      </Plan>
      <Plan from={endCard} to={END + 30}>
        <Txt x={960} y={460} size={34} color={C.muted} at={endCard}>
          Chapitre suivant
        </Txt>
        <Txt x={960} y={540} size={60} weight={800} at={endCard + 5}>
          1.2 — LAN, WAN, WLAN, MAN et Internet
        </Txt>
        <div style={{ position: "absolute", inset: 0, background: "#000", opacity: interpolate(f, [END - 50, END], [0, 1], clamp) }} />
      </Plan>
    </>
  );
};
