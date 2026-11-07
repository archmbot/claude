// Séquences 1 à 10 : introduction, connexion, explorateur, partage, messagerie, compte.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { IconName } from "./icons";
import { timing } from "./timing";
import { Card, CurKey, FONT, Icon, K, Keys, Logo, P, Pop, QylineBadge, R, Rect, Screen, SpotDef, Stage, Tip, U, clamp, grow, usePop } from "./ui";

// En-tête de l'application (boutons du bandeau, capture 1600 × 860)
const HD = { files: [958, 20, 100, 36] as Rect, msg: [1064, 20, 126, 36] as Rect, notif: [1196, 20, 133, 36] as Rect, user: [1335, 20, 145, 36] as Rect };
const side = (r: Rect): Rect => [26, r[1] - 9, 246, r[3] + 18]; // ligne entière du menu latéral
const ch = (n: number, t: string) => `${n} · ${t}`;

// ===================================================================== S1 — Introduction
const Pillar: React.FC<{ at: number; icon: IconName; title: string; sub: string; tone: string }> = ({ at, icon, title, sub, tone }) => (
  <Pop at={at}>
    <Card style={{ width: 400, padding: "34px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
      <div style={{ width: 104, height: 104, borderRadius: 30, background: tone, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 16px 34px ${tone}55` }}>
        <Icon name={icon} size={54} color="#fff" />
      </div>
      <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color: K.ink }}>{title}</div>
      <div style={{ fontFamily: FONT, fontSize: 23, color: K.ink2 }}>{sub}</div>
    </Card>
  </Pop>
);
const Node: React.FC<{ at: number; x: number; y: number; icon: IconName; title: string; sub?: string; tone?: string; big?: boolean }> = ({ at, x, y, icon, title, sub, tone = K.blue, big }) => (
  <Pop at={at} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>
    <Card style={{ padding: big ? "30px 40px" : "22px 30px", display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ width: big ? 110 : 84, height: big ? 110 : 84, borderRadius: 26, background: tone, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={big ? 60 : 44} color="#fff" />
      </div>
      <div style={{ fontFamily: FONT }}>
        <div style={{ fontSize: big ? 36 : 30, fontWeight: 700, color: K.ink }}>{title}</div>
        {sub && <div style={{ fontSize: 22, color: K.ink2, marginTop: 4 }}>{sub}</div>}
      </div>
    </Card>
  </Pop>
);
const Link: React.FC<{ at: number; a: [number, number]; b: [number, number]; label?: string; color?: string }> = ({ at, a, b, label, color = K.orange }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 14], [0, 1], clamp);
  if (p <= 0) return null;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const dash = (f * 1.6) % 28;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
      <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * p} y2={a[1] + (b[1] - a[1]) * p} stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray="14 14" strokeDashoffset={-dash} />
      {label && p === 1 && (
        <text x={(a[0] + b[0]) / 2} y={(a[1] + b[1]) / 2 - 16} textAnchor="middle" fontFamily={FONT} fontSize={22} fontWeight={600} fill={K.ink2}>
          {label}
        </text>
      )}
      {len < 0 && null}
    </svg>
  );
};

export const Opening: React.FC = () => {
  const f = useCurrentFrame();
  const drop = usePop(4, 9, 120);
  const title = usePop(22);
  const sub = usePop(36);
  const credit = usePop(52);
  const bounce = Math.abs(Math.sin(Math.min(f, 40) / 8)) * Math.max(0, 1 - f / 40) * 40;
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ transform: `translateY(${(1 - drop) * -500 - bounce}px)` }}>
          <Logo size={230} style={{ filter: "drop-shadow(0 30px 40px rgba(26,35,126,.35))" }} />
        </div>
        <div style={{ fontFamily: FONT, fontSize: 104, fontWeight: 700, color: K.ink, letterSpacing: 14 * title, opacity: title, marginTop: 20 }}>STOKARA</div>
        <div style={{ fontFamily: FONT, fontSize: 36, color: K.ink2, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}>
          Le guide complet · <span style={{ color: K.orange2, fontWeight: 600 }}>tutoriel pas à pas</span>
        </div>
        <QylineBadge style={{ marginTop: 34, opacity: credit, transform: `translateY(${(1 - credit) * 20}px)` }} />
      </AbsoluteFill>
    </Stage>
  );
};

export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const { T, PS, END } = timing(0);
  const p1 = PS(1);
  const srv = T("Il fonctionne");
  const ag = PS(3);
  const head = interpolate(f, [p1 - 6, p1 + 12], [0, 1], clamp);
  const agenda: [string, IconName, string][] = [
    ["la connexion", "box-arrow-in-right", "Se connecter"],
    ["l'explorateur de", "folder2-open", "L'explorateur de fichiers"],
    ["le partage", "link-45deg", "Partager"],
    ["la messagerie", "chat-dots-fill", "Messagerie et notifications"],
    ["votre compte", "person-circle", "Mon compte"],
    ["l'ajout", "pc-display", "Stokara dans Windows"],
    ["l'administration", "shield-lock-fill", "Administration"],
  ];
  return (
    <Stage>
      {/* titre (reprise de l'ouverture) qui se range en haut */}
      <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(head, [0, 1], [300, 40]), display: "flex", justifyContent: "center", alignItems: "center", gap: 26, transform: `scale(${1 - 0.45 * head})`, transformOrigin: "50% 0" }}>
        <Logo size={150} />
        <div style={{ fontFamily: FONT, fontSize: 100, fontWeight: 700, color: K.ink, letterSpacing: 14 }}>STOKARA</div>
      </div>
      {f < p1 && (
        <div style={{ position: "absolute", top: 500, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 30, fontFamily: FONT, fontSize: 36, color: K.ink2, opacity: interpolate(f, [p1 - 8, p1], [1, 0], clamp) }}>
          <div>
            Le guide complet · <span style={{ color: K.orange2, fontWeight: 600 }}>tutoriel pas à pas</span>
          </div>
          <QylineBadge style={{ transform: `scale(${f >= T("développé") ? 1 + 0.08 * Math.sin(Math.min(1, (f - T("développé")) / 12) * Math.PI) : 1})` }} />
        </div>
      )}
      {/* trois piliers */}
      {f >= p1 && f < srv + 6 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 44, paddingTop: 80, opacity: interpolate(f, [srv - 6, srv + 6], [1, 0], clamp) }}>
          <Pillar at={T("vos fichiers")} icon="folder-fill" title="Vos fichiers" sub="Importer, ranger, retrouver" tone={K.orange} />
          <Pillar at={T("vos dossiers")} icon="people-fill" title="Dossiers partagés" sub="Chacun voit ce qui le concerne" tone={K.blue} />
          <Pillar at={T("votre messagerie")} icon="chat-dots-fill" title="Messagerie" sub="Messages, annonces, notifications" tone={K.violet} />
        </AbsoluteFill>
      )}
      {/* le serveur au bureau, accessible partout */}
      {f >= srv && f < ag + 6 && (
        <AbsoluteFill style={{ opacity: interpolate(f, [ag - 6, ag + 6], [1, 0], clamp) }}>
          <Link at={T("au bureau comme")} a={[960, 450]} b={[430, 690]} />
          <Link at={T("à distance")} a={[960, 450]} b={[1490, 690]} />
          <Link at={T("Et le même")} a={[960, 450]} b={[960, 850]} color={K.blue} />
          <Node at={srv} x={960} y={420} icon="hdd-stack" title="Votre serveur" sub="au bureau, chez vous" tone={K.navy} big />
          <Pop at={T("vos données")} style={{ position: "absolute", left: 1270, top: 330 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: K.green, color: "#fff", fontFamily: FONT, fontWeight: 600, fontSize: 26, padding: "12px 22px", borderRadius: 40, boxShadow: "0 12px 28px rgba(21,128,61,.35)" }}>
              <Icon name="shield-check" size={30} color="#fff" /> Vos données restent chez vous
            </div>
          </Pop>
          <Node at={T("un simple navigateur")} x={430} y={700} icon="building" title="Au bureau" sub="navigateur web" tone={K.orange} />
          <Node at={T("à distance")} x={1490} y={700} icon="house-door-fill" title="À distance" sub="maison, déplacement" tone={K.orange} />
          <Node at={T("l'Explorateur")} x={960} y={860} icon="folder-symlink-fill" title="Explorateur Windows" sub="le même dossier" tone={K.blue} />
        </AbsoluteFill>
      )}
      {/* sommaire */}
      {f >= ag && (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
          <Pop at={ag}>
            <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 600, color: K.orange2, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>Au programme</div>
          </Pop>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 40px" }}>
            {agenda.map(([cue, icon, label], i) => (
              <Pop key={label} at={T(cue)}>
                <Card style={{ width: 600, display: "flex", alignItems: "center", gap: 22, padding: "16px 24px" }}>
                  <div style={{ width: 54, height: 54, borderRadius: 16, background: i % 2 ? K.blue : K.orange, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                  <Icon name={icon} size={32} color={K.ink2} />
                  <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 600, color: K.ink }}>{label}</div>
                </Card>
              </Pop>
            ))}
          </div>
        </AbsoluteFill>
      )}
      {END < 0 && null}
    </Stage>
  );
};

// ===================================================================== S2 — Connexion
export const S2: React.FC = () => {
  const { T, PS } = timing(1);
  const L = "login-empty";
  const keepRow: Rect = [612, 412, 375, 62];
  const firstField: Rect = [606, 352, 388, 50];
  const forgot = R("login-error", "forgot");
  const t = {
    user: T("Saisissez"),
    pass: T("puis votre mot"),
    eye: T("L'icône"),
    keep: T("La case"),
    btn: T("Cliquez ensuite"),
    err: T("En cas"),
    five: T("après cinq"),
    forgot: T("Cliquez sur le lien"),
    name: T("puis indiquez"),
    mail: T("vous recevez"),
    sinon: T("Sinon,"),
    first: PS(4),
  };
  const cur: CurKey[] = [
    { t: t.user, p: P(R(L, "user"), 0.3), c: "l", d: 22 },
    { t: t.pass, p: P(R(L, "pass"), 0.3), c: "l" },
    { t: t.eye + 8, p: P(R(L, "eye")), c: "l" },
    { t: t.keep + 10, p: P(R(L, "keep")), c: "l" },
    { t: t.btn, p: P(R(L, "btn")), c: "l" },
    { t: t.forgot, p: P(forgot), c: "l" },
    { t: t.name, p: [800, 455] },
    { t: t.first - 4, p: [1300, 760], hide: true },
  ];
  const spots: SpotDef[] = [
    { from: t.user, to: t.pass - 2, r: R(L, "user"), label: "Nom d'utilisateur" },
    { from: t.pass, to: t.eye - 2, r: R(L, "pass"), label: "Mot de passe" },
    { from: t.eye + 8, to: t.keep - 4, r: R(L, "eye"), label: "Afficher / masquer", pos: "right" },
    { from: t.keep + 6, to: t.btn - 4, r: keepRow, label: "Rester connecté 30 jours", pos: "right" },
    { from: t.btn, to: t.err - 4, r: R(L, "btn") },
    { from: t.err + 4, to: t.five - 2, r: R("login-error", "err"), label: "Essais restants", pos: "right" },
    { from: t.five, to: t.forgot - 6, r: R("login-error", "err"), label: "5 essais ratés : compte bloqué quelques minutes", pos: "right" },
    { from: t.name, to: t.sinon + 50, r: R("login-forgot", "box"), pos: "right" },
    { from: t.first + 30, to: t.first + 200, r: firstField, label: "8 caractères minimum", pos: "right" },
  ];
  return (
    <>
      <Screen
        url={[
          [0, "/login.html"],
          [t.first, "/login.html?premiere-connexion"],
        ]}
        chapter={ch(1, "Se connecter")}
        shots={[
          { t: 0, s: "login-empty" },
          { t: t.user + 10, s: "login-user" },
          { t: t.pass + 12, s: "login-pass" },
          { t: t.eye + 10, s: "login-eye" },
          { t: t.keep - 6, s: "login-pass" },
          { t: t.keep + 12, s: "login-keep" },
          { t: t.err, s: "login-error" },
          { t: t.forgot + 6, s: "login-forgot" },
          { t: t.first, s: "login-first", fade: 8 },
        ]}
        cam={[
          { t: 0 },
          { t: t.user - 10, r: [560, 250, 480, 340], z: 1.75 },
          { t: t.err - 6, r: [560, 250, 480, 420], z: 1.6 },
          { t: t.forgot + 6, r: grow(R("login-forgot", "box"), 40), z: 1.6 },
          { t: t.first, r: null },
          { t: t.first + 25, r: [560, 110, 480, 540], z: 1.45 },
        ]}
        cur={cur}
        spots={spots}
      />
      <Tip at={t.mail} until={t.first - 4} x={1240} y={360} icon="envelope-fill" w={560}>
        Un lien valable <b>1 heure</b> par e-mail
      </Tip>
      <Tip at={t.sinon} until={t.first - 4} x={1240} y={520} icon="shield-lock-fill" tone={K.blue} w={560}>
        Sans e-mail : <b>l'administrateur</b> est prévenu
      </Tip>
    </>
  );
};

// ===================================================================== S3 — Découverte de l'explorateur
export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const { T, PS } = timing(2);
  const S = "ex-root";
  const t = {
    top: T("En haut"),
    files: T("aux Fichiers"),
    msg: T("à la Messagerie"),
    notif: T("aux Notifications"),
    views: PS(1),
    all: T("tous les fichiers"),
    shared: T("partagés avec"),
    fav: T("favoris,"),
    rec: T("récents,"),
    links: T("mes liens"),
    trash: T("et la corbeille"),
    tree: T("l'arborescence"),
    disk: T("l'espace disque"),
    center: PS(2),
    only: T("Chacun ne voit"),
    cli: T("les clients"),
    com: T("les documents"),
    pho: T("les photos"),
    not: T("mais pas"),
  };
  const spots: SpotDef[] = [
    { from: t.files, to: t.msg - 2, r: HD.files, pos: "bottom", label: "Fichiers" },
    { from: t.msg, to: t.notif - 2, r: HD.msg, pos: "bottom", label: "Messagerie" },
    { from: t.notif, to: t.views - 4, r: HD.notif, pos: "bottom", label: "Notifications" },
    { from: t.all, to: t.shared - 1, r: side(R(S, "navAll")) },
    { from: t.shared, to: t.fav - 1, r: side(R(S, "navShared")) },
    { from: t.fav, to: t.rec - 1, r: side(R(S, "navFav")) },
    { from: t.rec, to: t.links - 1, r: side(R(S, "navRecent")) },
    { from: t.links, to: t.trash - 1, r: side(R(S, "navLinks")) },
    { from: t.trash, to: t.tree - 2, r: side(R(S, "navTrash")) },
    { from: t.tree, to: t.disk - 2, r: grow(R(S, "tree"), 4), pos: "right", label: "Arborescence" },
    { from: t.disk, to: t.center - 2, r: R(S, "storage"), pos: "right", label: "Espace disque" },
    { from: t.only, to: t.cli - 2, r: R(S, "state"), pos: "bottom", label: "Seulement les dossiers ouverts à Karim" },
    { from: t.cli, to: t.not + 40, r: R(S, "tClients") },
    { from: t.com, to: t.not + 40, r: R(S, "tCommun") },
    { from: t.pho, to: t.not + 40, r: R(S, "tPhotos") },
  ];
  const hidden = interpolate(f, [t.not, t.not + 10], [0, 1], clamp);
  return (
    <Screen
      url="/"
      chapter={ch(2, "L'explorateur")}
      shots={[{ t: 0, s: S }]}
      cam={[
        { t: 0 },
        { t: t.top - 6, r: [900, 0, 600, 80], z: 2.0 },
        { t: t.views - 4, r: [0, 90, 620, 270], z: 2.0 },
        { t: t.tree - 6, r: [0, 360, 620, 200], z: 2.0 },
        { t: t.disk - 4, r: [0, 700, 620, 160], z: 2.0 },
        { t: t.center - 4, r: [290, 190, 1310, 260], z: 1.35 },
      ]}
      spots={spots}
      overlay={
        hidden > 0 && (
          <div style={{ position: "absolute", left: 1110, top: 254, width: 151, height: 164, opacity: hidden, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, border: `3px dashed ${K.red}`, borderRadius: 14, background: "rgba(255,255,255,.7)" }}>
            <div style={{ position: "relative" }}>
              <Icon name="folder-fill" size={70} color="#c9ced9" />
              <Icon name="lock-fill" size={30} color={K.red} style={{ position: "absolute", right: -6, bottom: 4 }} />
            </div>
            <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: K.red }}>Comptabilité</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: K.ink2 }}>non visible</div>
          </div>
        )
      }
    />
  );
};

// ===================================================================== S4 — Naviguer, sélectionner, afficher
export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const { T } = timing(3);
  const t = {
    clic: T("un clic"),
    dbl: T("un double-clic"),
    ariane: T("Le fil"),
    ctrl: T("Avec la touche"),
    lasso: T("ou en traçant"),
    bar: T("La barre d'actions"),
    btns: T("Ces deux"),
    list: T("l'affichage en liste"),
    sort: T("Et le bouton"),
  };
  const D = "ex-dupont";
  const cur: CurKey[] = [
    { t: t.clic, p: P(R("ex-root", "tClients"), 0.5, 0.4), c: "l", d: 20 },
    { t: t.dbl, p: P(R("ex-root", "tClients"), 0.5, 0.4), c: "d", d: 6 },
    { t: t.dbl + 30, p: P(R("ex-clients", "tDupont"), 0.5, 0.4), c: "d" },
    { t: t.ariane + 10, p: P(R(D, "crumbClients")) },
    { t: t.ctrl + 4, p: P(R(D, "tDevis"), 0.5, 0.4), c: "l" },
    { t: t.ctrl + 30, p: P(R(D, "tPlan"), 0.5, 0.4), c: "l" },
    { t: t.lasso + 4, p: [300, 205], d: 16 },
    { t: t.lasso + 40, p: [960, 400], d: 36 },
    { t: t.btns + 10, p: P(R(D, "vGrid")) },
    { t: t.list, p: P(R(D, "vList")), c: "l" },
    { t: t.sort + 6, p: P(R(D, "sort")), c: "l" },
  ];
  const lassoP = interpolate(f, [t.lasso + 4, t.lasso + 40], [0, 1], clamp);
  const lassoO = interpolate(f, [t.lasso, t.lasso + 4, t.lasso + 46, t.lasso + 54], [0, 1, 1, 0], clamp);
  return (
    <>
      <Screen
        url={[
          [0, "/"],
          [t.dbl + 6, "/#/Clients"],
          [t.dbl + 36, "/#/Clients/Dupont SARL"],
        ]}
        chapter={ch(2, "L'explorateur")}
        shots={[
          { t: 0, s: "ex-root" },
          { t: t.clic + 2, s: "ex-root-sel", fade: 2 },
          { t: t.dbl + 8, s: "ex-clients", fade: 3 },
          { t: t.dbl + 36, s: D, fade: 3 },
          { t: t.ctrl + 32, s: "ex-multi", fade: 2 },
          { t: t.list + 3, s: "ex-list", fade: 3 },
          { t: t.sort + 8, s: "ex-sort", fade: 2 },
        ]}
        cam={[
          { t: 0, r: [290, 90, 1310, 360], z: 1.3 },
          { t: t.ariane - 4, r: [290, 90, 760, 130], z: 1.9 },
          { t: t.ctrl - 4, r: [290, 90, 1310, 330], z: 1.3 },
          { t: t.btns - 4, r: [1200, 90, 400, 230], z: 1.8 },
        ]}
        cur={cur}
        spots={[
          { from: t.ariane, to: t.ctrl - 4, r: R(D, "crumbs"), pos: "bottom", label: "Fil d'Ariane" },
          { from: t.bar, to: t.btns - 4, r: R("ex-multi", "selbar"), pos: "bottom", label: "Actions sur la sélection" },
          { from: t.btns, to: t.list - 2, r: U(R(D, "vGrid"), R(D, "vList")), pos: "bottom", label: "Mosaïque · Liste" },
          { from: t.sort + 12, to: t.sort + 140, r: R("ex-sort", "sortMenu"), pos: "left", label: "Nom · Date · Taille · Type" },
        ]}
        overlay={
          lassoO > 0 && (
            <div style={{ position: "absolute", left: 300, top: 205, width: 660 * lassoP, height: 195 * lassoP, border: `2px solid ${K.blue}`, background: "rgba(57,73,171,.12)", opacity: lassoO }} />
          )
        }
      />
      <Pop at={t.ctrl} until={t.lasso + 2} style={{ position: "absolute", left: 1350, top: 820 }}>
        <Card style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 14 }}>
          <Keys keys={["Ctrl", "+", "clic"]} size={30} />
        </Card>
      </Pop>
    </>
  );
};

// ===================================================================== S5 — Importer, créer
const DragGhost: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [from, to], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const o = interpolate(f, [from, from + 6, to + 12, to + 22], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const x = -160 + p * 900;
  const y = 600 - p * 160;
  const files: [IconName, string][] = [
    ["file-earmark-image-fill", "#2b8a3e"],
    ["file-earmark-pdf-fill", "#d93025"],
    ["play-circle-fill", "#7c3aed"],
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      {files.map(([ic, col], i) => (
        <div key={i} style={{ position: "absolute", left: i * 26, top: i * -18, width: 110, height: 130, background: "#fff", borderRadius: 12, boxShadow: "0 14px 30px rgba(21,28,60,.3)", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${(i - 1) * 7}deg)` }}>
          <Icon name={ic} size={64} color={col} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 120, top: 70, background: K.blue, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 20, borderRadius: 16, padding: "2px 12px" }}>3</div>
    </div>
  );
};
export const S5: React.FC = () => {
  const { T, PS } = timing(4);
  const t = {
    nouveau: T("cliquez sur Nouveau"),
    mk: T("créer un dossier"),
    imp: T("importer des fichiers"),
    impd: T("ou importer"),
    drag: T("glissez-déposez"),
    win: T("directement"),
    panel: T("Un panneau"),
    big: T("Les gros"),
    conflict: PS(2),
    ign: T("ignorer,"),
    both: T("garder les deux"),
    repl: T("ou remplacer"),
    old: T("L'ancienne"),
  };
  const menu = R("ex-newmenu", "menu");
  const item = (i: number): Rect => [menu[0] + 4, menu[1] + 6 + (i === 0 ? 0 : 8 + i * 33), menu[2] - 8, 33];
  return (
    <Screen
      url="/#/Clients/Dupont SARL"
      chapter={ch(2, "L'explorateur")}
      shots={[
        { t: 0, s: "ex-dupont" },
        { t: t.nouveau + 3, s: "ex-newmenu", fade: 2 },
        { t: t.drag - 2, s: "ex-dupont", fade: 3 },
        { t: t.win - 6, s: "ex-drop", fade: 4 },
        { t: t.panel - 6, s: "ex-upload", fade: 4 },
        { t: t.conflict - 2, s: "ex-conflict", fade: 4 },
      ]}
      cam={[
        { t: 0, r: [0, 80, 700, 330], z: 1.7 },
        { t: t.drag - 4, r: null },
        { t: t.panel - 4, r: [900, 480, 700, 380], z: 1.8 },
        { t: t.conflict - 4, r: grow(R("ex-conflict", "dlg"), 30), z: 1.9 },
      ]}
      cur={[
        { t: t.nouveau, p: P(R("ex-dupont", "new")), c: "l", d: 22 },
        { t: t.mk + 2, p: P(item(0), 0.35) },
        { t: t.imp + 2, p: P(item(1), 0.35) },
        { t: t.impd + 2, p: P(item(2), 0.35) },
        { t: t.drag - 2, p: [40, 560], hide: true },
        { t: t.conflict + 10, p: [800, 450] },
        { t: t.ign, p: P(R("ex-conflict", "skip")) },
        { t: t.both, p: P(R("ex-conflict", "both")) },
        { t: t.repl, p: P(R("ex-conflict", "replace")) },
      ]}
      spots={[
        { from: t.mk, to: t.imp - 1, r: item(0), pos: "right", label: "Nouveau dossier" },
        { from: t.imp, to: t.impd - 1, r: item(1), pos: "right", label: "Importer des fichiers" },
        { from: t.impd, to: t.drag - 4, r: item(2), pos: "right", label: "Importer un dossier entier" },
        { from: t.panel + 4, to: t.conflict - 6, r: R("ex-upload", "up"), pos: "left", label: "Avancement de chaque fichier" },
        { from: t.ign, to: t.both - 1, r: R("ex-conflict", "skip"), pos: "bottom", label: "Ignorer" },
        { from: t.both, to: t.repl - 1, r: R("ex-conflict", "both"), pos: "bottom", label: "Garder les deux" },
        { from: t.repl, to: t.old + 70, r: R("ex-conflict", "replace"), pos: "bottom", label: "Remplacer" },
        { from: t.old, to: t.old + 70, r: [565, 405, 470, 44] },
      ]}
      overlay={
        <>
          <DragGhost from={t.drag} to={t.win + 4} />
          {/* bulle « par morceaux » */}
          <Pop at={t.big} until={t.conflict - 4} style={{ position: "absolute", left: 880, top: 560 }}>
            <div style={{ background: K.ink, color: "#fff", fontFamily: FONT, fontWeight: 600, fontSize: 19, padding: "10px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="arrow-repeat" size={20} color={K.orange} /> Par morceaux de 8 Mo, reprise automatique
            </div>
          </Pop>
        </>
      }
    />
  );
};

// ===================================================================== S6 — Clic droit, raccourcis, déplacer, corbeille
export const S6: React.FC = () => {
  const { T, PS } = timing(5);
  const C = "ex-ctx";
  const fav: Rect = [869, 687, 225, 35];
  const t = {
    right: T("Le clic droit"),
    ap: T("aperçu,"),
    tel: T("télécharger,"),
    env: T("envoyer par"),
    lien: T("créer un lien"),
    ren: T("renommer,"),
    dep: T("déplacer,"),
    cop: T("copier,"),
    fav: T("ou ajouter"),
    keys: PS(1),
    f2: T("F2"),
    cc: T("Contrôle C"),
    sup: T("et la touche"),
    move: PS(2),
    del: PS(3),
    undo: T("Vous pouvez annuler"),
    reste: T("il reste"),
    rest: T("un clic sur Restaurer"),
  };
  const items: [number, string][] = [
    [t.ap, "open"],
    [t.tel, "download"],
    [t.env, "send"],
    [t.lien, "share"],
    [t.ren, "rename"],
    [t.dep, "move"],
    [t.cop, "copy"],
  ];
  const ends = [...items.slice(1).map((x) => x[0]), t.fav];
  const toast: Rect = [630, 790, 345, 44];
  return (
    <>
      <Screen
        url={[
          [0, "/#/Clients/Dupont SARL"],
          [t.reste, "/#corbeille"],
        ]}
        chapter={ch(2, "L'explorateur")}
        shots={[
          { t: 0, s: "ex-upload-done" },
          { t: t.right + 3, s: C, fade: 2 },
          { t: t.keys, s: "ex-rename", fade: 4 },
          { t: t.move - 2, s: "ex-move", fade: 4 },
          { t: t.del - 4, s: "ex-delete", fade: 4 },
          { t: t.del + 22, s: "ex-deleted", fade: 3 },
          { t: t.reste - 2, s: "ex-trash", fade: 4 },
        ]}
        cam={[
          { t: 0, r: [600, 180, 600, 640], z: 1.25 },
          { t: t.keys - 4, r: grow(R("ex-rename", "dlg"), 40), z: 1.7 },
          { t: t.move - 4, r: R("ex-move", "dlg"), z: 1.4 },
          { t: t.del - 4, r: grow(R("ex-delete", "dlg"), 40), z: 1.6 },
          { t: t.undo - 8, r: [450, 640, 700, 220], z: 1.9 },
          { t: t.reste - 4, r: [300, 200, 1300, 220], z: 1.3 },
        ]}
        cur={[
          { t: t.right, p: P(R(C, "tDevis"), 0.5, 0.45), c: "r", d: 22 },
          ...items.map(([at, k]) => ({ t: at + 2, p: P(R(C, k), 0.3) }) as CurKey),
          { t: t.fav + 2, p: P(fav, 0.3) },
          { t: t.keys - 2, p: [1200, 700], hide: true },
          { t: t.del + 18, p: P(R("ex-delete", "ok")), c: "l" },
          { t: t.rest, p: P(R("ex-trash", "restore")), c: "l", d: 26 },
        ]}
        spots={[
          ...items.map(([at, k], i) => ({ from: at, to: ends[i] - 1, r: R(C, k), round: 6 }) as SpotDef),
          { from: t.fav, to: t.keys - 4, r: fav, round: 6 },
          { from: t.move + 6, to: t.del - 6, r: [418, 205, 765, 400], label: "Choisissez le dossier de destination", pos: "bottom" },
          { from: t.undo, to: t.reste - 4, r: toast, label: "Annuler", pos: "top" },
          { from: t.reste + 4, to: t.rest - 2, r: [313, 330, 1257, 40], label: "Conservé 30 jours", pos: "bottom" },
          { from: t.rest, to: t.rest + 90, r: grow(R("ex-trash", "restore"), 4), label: "Restaurer", pos: "left" },
        ]}
      />
      <Pop at={t.f2} until={t.move - 2} style={{ position: "absolute", left: 70, top: 600 }}>
        <Card style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
          <Pop at={t.f2}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, fontSize: 26, color: K.ink2 }}>
              <Keys keys={["F2"]} size={28} /> renommer
            </div>
          </Pop>
          <Pop at={t.cc}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, fontSize: 26, color: K.ink2 }}>
              <Keys keys={["Ctrl", "+", "C"]} size={28} /> / <Keys keys={["Ctrl", "+", "V"]} size={28} />
            </div>
          </Pop>
          <Pop at={t.sup}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, fontSize: 26, color: K.ink2 }}>
              <Keys keys={["Suppr"]} size={28} /> supprimer
            </div>
          </Pop>
        </Card>
      </Pop>
    </>
  );
};

// ===================================================================== S7 — Recherche, aperçu, détails
export const S7: React.FC = () => {
  const { T, PS } = timing(6);
  const t = {
    rech: T("utilisez la recherche"),
    ctrlf: T("ou le raccourci"),
    cher: T("Cherchez"),
    part: T("ou partout"),
    filt: T("puis filtrez"),
    pdf: T("PDF,"),
    dbl: PS(1),
    ouvre: T("ouvre l'aperçu"),
    fl: T("Les flèches"),
    suiv: T("fichier suivant"),
    aff: PS(2),
    img: T("les images"),
    vid: T("les vidéos"),
    txt: T("les textes"),
    tab: T("les tableaux"),
    off: PS(3),
    tele: T("téléchargez-les"),
    det: PS(4),
    info: T("les informations"),
    acc: T("qui y a"),
    hist: T("et son historique"),
    note: T("laisser une note"),
  };
  const s1 = R("ex-search", "content");
  const first: Rect = [313, 254, 151, 164];
  const D = "ex-details";
  return (
    <>
      <Screen
        url={[
          [0, "/#/Clients/Dupont SARL"],
          [t.cher, "/#recherche?q=devis"],
          [t.dbl + 14, "/#/Clients/Dupont SARL"],
        ]}
        chapter={ch(2, "L'explorateur")}
        shots={[
          { t: 0, s: "ex-dupont" },
          { t: t.cher - 4, s: "ex-search", fade: 4 },
          { t: t.pdf, s: "ex-search-pdf", fade: 2 },
          { t: t.ouvre - 4, s: "ex-pdf", fade: 6 },
          { t: t.suiv + 4, s: "ex-img", fade: 4 },
          { t: t.img, s: "ex-img2", fade: 5 },
          { t: t.vid, s: "ex-video", fade: 5 },
          { t: t.txt, s: "ex-txt", fade: 5 },
          { t: t.tab, s: "ex-csv", fade: 5 },
          { t: t.off, s: "ex-office", fade: 5 },
          { t: t.det - 2, s: "ex-details", fade: 5 },
          { t: t.note + 12, s: "ex-details-note", fade: 4 },
        ]}
        cam={[
          { t: 0, r: [880, 90, 720, 200], z: 1.9 },
          { t: t.cher - 4, r: [290, 90, 1310, 340], z: 1.25 },
          { t: t.ouvre - 4, r: null },
          { t: t.det - 4, r: [1000, 80, 600, 780], z: 1.15 },
          { t: t.info - 4, r: [1150, 330, 450, 340], z: 2.0 },
          { t: t.note - 4, r: [1150, 640, 450, 220], z: 2.0 },
        ]}
        cur={[
          { t: t.rech, p: P(R("ex-dupont", "search"), 0.3), c: "l", d: 24 },
          { t: t.part, p: P(R("ex-search", "scope")), c: "l" },
          { t: t.pdf - 2, p: P(R("ex-search", "chipPdf")), c: "l" },
          { t: t.ouvre - 8, p: P(first, 0.5, 0.4), c: "d" },
          { t: t.suiv, p: P(R("ex-pdf", "next")), c: "l" },
          { t: t.aff, p: [1500, 760], hide: true },
          { t: t.tele, p: [800, 700], c: "l" },
          { t: t.det - 8, p: [1200, 300], hide: true },
          { t: t.note, p: P(R(D, "note"), 0.3), c: "l" },
        ]}
        spots={[
          { from: t.rech, to: t.cher - 4, r: R("ex-dupont", "search", 6), pos: "bottom", label: "Rechercher" },
          { from: t.part, to: t.filt - 2, r: R("ex-search", "scope", 3), pos: "bottom", label: "Ce dossier ou partout" },
          { from: t.filt, to: t.dbl - 6, r: R("ex-search", "chips", 3), pos: "bottom", label: "Filtrer par type" },
          { from: t.fl, to: t.aff - 4, r: R("ex-pdf", "next"), pos: "left", label: "Fichier suivant" },
          { from: t.tele, to: t.det - 6, r: [730, 515, 140, 180], pos: "right", label: "Télécharger" },
          { from: t.info, to: t.acc - 1, r: [1258, 340, 320, 135], label: "Informations", pos: "left" },
          { from: t.acc, to: t.hist - 1, r: [1258, 565, 320, 95], label: "Qui a accès", pos: "left" },
          { from: t.hist, to: t.note - 1, r: [1258, 680, 320, 55], label: "Liens actifs, activité", pos: "left" },
          { from: t.note, to: t.note + 120, r: R(D, "note", 4), label: "Note visible par l'équipe", pos: "left" },
        ]}
      />
      <Pop at={t.ctrlf} until={t.cher + 10} style={{ position: "absolute", left: 1380, top: 830 }}>
        <Card style={{ padding: "16px 22px" }}>
          <Keys keys={["Ctrl", "+", "F"]} size={30} />
        </Card>
      </Pop>
      {s1 && null}
    </>
  );
};

// ===================================================================== S8 — Partager
export const S8: React.FC = () => {
  const { T, PS } = timing(7);
  const t = {
    right: T("faites un clic"),
    create: T("puis Créer"),
    dur: T("la durée"),
    pw: T("ajoutez si"),
    max: T("et un nombre"),
    click: T("Cliquez sur Créer"),
    copie: T("il est aussitôt"),
    comm: T("et communiquez"),
    pub: PS(2),
    saisit: T("Il saisit"),
    voit: T("voit l'aperçu"),
    tel: T("et télécharge"),
    mail: PS(3),
    coll: T("à un collègue"),
    sec: PS(4),
    pj: T("La pièce jointe"),
    links: PS(5),
    exp: T("leur date"),
    supp: T("les supprimer"),
  };
  const D = "sh-dlg";
  const pubDl: Rect = [455, 742, 150, 40];
  return (
    <Screen
      url={[
        [0, "/#/Clients/Dupont SARL"],
        [t.pub - 4, "/s/e6c78566ff58114547b823f3cc2b9972"],
        [t.mail - 4, "/#/Clients/Dupont SARL"],
        [t.links, "/#liens"],
      ]}
      chapter={ch(3, "Partager")}
      shots={[
        { t: 0, s: "ex-dupont" },
        { t: t.right + 3, s: "sh-ctx", fade: 2 },
        { t: t.create + 12, s: D, fade: 4 },
        { t: t.click + 6, s: "sh-created", fade: 3 },
        { t: t.pub - 4, s: "sh-public-lock", fade: 8 },
        { t: t.voit - 2, s: "sh-public", fade: 6 },
        { t: t.mail - 4, s: "sh-send", fade: 6 },
        { t: t.pj, s: "sh-send-att", fade: 3 },
        { t: t.links - 2, s: "sh-links", fade: 5 },
      ]}
      cam={[
        { t: 0, r: [500, 180, 700, 640], z: 1.25 },
        { t: t.create + 10, r: grow(R(D, "dlg"), 20), z: 1.7 },
        { t: t.click + 6, r: grow(R("sh-created", "dlg"), 20), z: 1.6 },
        { t: t.pub - 4, r: null },
        { t: t.saisit - 6, r: R("sh-public-lock", "card"), z: 1.6 },
        { t: t.voit, r: [120, 640, 700, 200], z: 1.8 },
        { t: t.mail - 4, r: R("sh-send", "dlg"), z: 1.25 },
        { t: t.links - 2, r: [0, 90, 1600, 260], z: 1.2 },
        { t: t.exp - 4, r: [290, 190, 1310, 130], z: 1.45 },
      ]}
      cur={[
        { t: t.right, p: P(R("sh-ctx", "tDevis"), 0.5, 0.45), c: "r", d: 24 },
        { t: t.create, p: P(R("sh-ctx", "share"), 0.3), c: "l" },
        { t: t.dur + 4, p: P(R(D, "days")), c: "l" },
        { t: t.pw + 4, p: P(R(D, "pw")), c: "l" },
        { t: t.max + 4, p: P(R(D, "max")), c: "l" },
        { t: t.click, p: P(R(D, "create")), c: "l" },
        { t: t.copie + 10, p: P(R("sh-created", "copy")) },
        { t: t.pub - 6, p: [800, 700], hide: true },
        { t: t.tel, p: P(pubDl), c: "l" },
        { t: t.mail, p: [1000, 760], hide: true },
        { t: t.supp, p: [1555, 271], c: "l", d: 24 },
      ]}
      spots={[
        { from: t.create - 2, to: t.create + 10, r: R("sh-ctx", "share"), round: 6 },
        { from: t.dur, to: t.pw - 1, r: R(D, "days"), label: "Durée de validité", pos: "top" },
        { from: t.pw, to: t.max - 1, r: R(D, "pw"), label: "Mot de passe (facultatif)", pos: "top" },
        { from: t.max, to: t.click - 1, r: R(D, "max"), label: "Téléchargements max", pos: "top" },
        { from: t.copie, to: t.pub - 6, r: R("sh-created", "code"), label: "Lien copié", pos: "top" },
        { from: t.comm, to: t.pub - 6, r: [417, 478, 420, 22], pos: "bottom", label: "Mot de passe : par SMS ou téléphone" },
        { from: t.saisit, to: t.voit - 4, r: [540, 290, 520, 50], label: "Mot de passe du lien", pos: "bottom" },
        { from: t.tel, to: t.mail - 8, r: pubDl, label: "Télécharger", pos: "right" },
        { from: t.coll, to: t.sec - 2, r: R("sh-send", "pick"), label: "Collègues, groupes ou adresses e-mail", pos: "bottom" },
        { from: t.sec, to: t.pj - 1, r: [413, 575, 345, 26], label: "Recommandé, toutes tailles", pos: "top" },
        { from: t.pj + 4, to: t.links - 6, r: [770, 611, 300, 26], label: "20 Mo maximum", pos: "top" },
        { from: t.exp, to: t.supp - 2, r: R("sh-links", "row"), label: "Expiration et téléchargements", pos: "bottom" },
        { from: t.supp, to: t.supp + 80, r: [1540, 257, 30, 30], label: "Supprimer le lien", pos: "left" },
      ]}
    />
  );
};

// ===================================================================== S9 — Messagerie, notifications
export const S9: React.FC = () => {
  const { T, PS } = timing(8);
  const t = {
    choose: T("Choisissez une"),
    ecr: T("écrivez"),
    entree: T("puis appuyez"),
    clip: PS(1),
    pc: T("depuis votre ordinateur"),
    drv: T("ou directement"),
    pj: PS(2),
    clic: T("en un clic"),
    nouv: PS(3),
    coll: T("et choisissez"),
    abs: T("Si votre collègue"),
    bell: PS(4),
    dos: T("un dossier qui"),
    ann: T("ou une annonce"),
  };
  const att: Rect = [500, 505, 270, 40];
  const save: Rect = [765, 510, 26, 30];
  return (
    <>
      <Screen
        url={[
          [0, "/messages.html"],
          [t.bell - 4, "/"],
        ]}
        chapter={ch(4, "La messagerie")}
        shots={[
          { t: 0, s: "ms-list" },
          { t: t.choose + 4, s: "ms-thread", fade: 3 },
          { t: t.ecr + 8, s: "ms-typing", fade: 3 },
          { t: t.clip + 6, s: "ms-clip", fade: 2 },
          { t: t.pj - 2, s: "ms-thread", fade: 3 },
          { t: t.clic + 2, s: "ms-save", fade: 4 },
          { t: t.nouv + 10, s: "ms-new", fade: 4 },
          { t: t.bell - 4, s: "nt-bell", fade: 5 },
        ]}
        cam={[
          { t: 0, r: [100, 80, 400, 300], z: 1.6 },
          { t: t.choose + 4, r: [100, 80, 1400, 770], z: 1.05 },
          { t: t.ecr + 4, r: [460, 560, 1040, 290], z: 1.5 },
          { t: t.pj - 4, r: [460, 380, 700, 220], z: 1.9 },
          { t: t.clic + 2, r: R("ms-save", "dlg"), z: 1.3 },
          { t: t.nouv + 10, r: R("ms-new", "dlg"), z: 1.4 },
          { t: t.bell - 4, r: [900, 0, 700, 360], z: 1.9 },
        ]}
        cur={[
          { t: t.choose, p: [280, 178], c: "l", d: 22 },
          { t: t.ecr + 4, p: P(R("ms-thread", "input"), 0.3), c: "l" },
          { t: t.clip + 4, p: P(R("ms-thread", "clip")), c: "l" },
          { t: t.pc, p: P(R("ms-clip", "pc"), 0.4) },
          { t: t.drv, p: P(R("ms-clip", "drive"), 0.4) },
          { t: t.clic - 4, p: P(save), c: "l" },
          { t: t.nouv + 6, p: P(R("ms-list", "new")), c: "l" },
          { t: t.bell - 2, p: P(R("nt-bell", "bell")), c: "l", d: 10 },
        ]}
        spots={[
          { from: t.choose, to: t.ecr - 2, r: [118, 152, 332, 56] },
          { from: t.ecr + 8, to: t.clip - 2, r: R("ms-typing", "input"), label: "Entrée pour envoyer", pos: "top" },
          { from: t.pc, to: t.drv - 1, r: R("ms-clip", "pc"), pos: "right", label: "Depuis cet appareil" },
          { from: t.drv, to: t.pj - 4, r: R("ms-clip", "drive"), pos: "right", label: "Depuis Stokara" },
          { from: t.pj + 4, to: t.clic - 2, r: U(att, save), label: "Ranger dans un dossier Stokara", pos: "bottom" },
          { from: t.clic + 10, to: t.nouv - 2, r: R("ms-save", "ok"), label: "Ranger ici", pos: "left" },
          { from: t.coll, to: t.abs - 2, r: [417, 290, 766, 50], label: "Un collègue ou un groupe", pos: "bottom" },
          { from: t.dos, to: t.ann - 1, r: [952, 158, 372, 64] },
          { from: t.ann, to: t.ann + 80, r: [952, 96, 372, 62], label: "Annonce", pos: "left" },
        ]}
      />
      <Pop at={t.entree} until={t.clip} style={{ position: "absolute", left: 1450, top: 830 }}>
        <Card style={{ padding: "16px 22px" }}>
          <Keys keys={["Entrée ↵"]} size={30} />
        </Card>
      </Pop>
      <Tip at={t.abs} until={t.bell - 4} x={1150} y={800} icon="envelope-fill" w={600}>
        Absent ? Prévenu par <b>e-mail</b>
      </Tip>
    </>
  );
};

// ===================================================================== S10 — Mon compte
export const S10: React.FC = () => {
  const { T, PS } = timing(9);
  const A = "ac-top";
  const t = {
    name: T("votre nom"),
    mail: T("et votre adresse"),
    prev: T("et vous choisissez"),
    pw: PS(1),
    dev: PS(2),
    lost: T("Un téléphone"),
    deco: T("Un clic sur"),
  };
  const phoneDeco: Rect = [1290, 258, 112, 34];
  const phoneRow: Rect = [838, 250, 562, 48];
  return (
    <Screen
      url="/compte.html"
      chapter={ch(5, "Mon compte")}
      shots={[{ t: 0, s: A }]}
      cam={[
        { t: 0, r: R(A, "profil"), z: 1.5 },
        { t: t.pw - 4, r: R(A, "pw"), z: 1.6 },
        { t: t.dev - 4, r: R(A, "devices", 20), z: 1.7 },
      ]}
      cur={[
        { t: t.name, p: P(R(A, "name"), 0.4), c: "l", d: 22 },
        { t: t.mail, p: P(R(A, "email"), 0.4), c: "l" },
        { t: t.prev + 6, p: P(R(A, "notify")), c: "l" },
        { t: t.pw + 10, p: P([197, 660, 572, 38], 0.4), c: "l" },
        { t: t.deco, p: P(phoneDeco), c: "l", d: 24 },
      ]}
      spots={[
        { from: t.name, to: t.mail - 1, r: R(A, "name"), label: "Nom affiché", pos: "top" },
        { from: t.mail, to: t.prev - 1, r: R(A, "email"), label: "Adresse e-mail", pos: "top" },
        { from: t.prev, to: t.pw - 4, r: [192, 413, 580, 30], label: "Prévenir par e-mail", pos: "bottom" },
        { from: t.pw + 6, to: t.dev - 4, r: R(A, "pw"), pos: "right" },
        { from: t.dev + 4, to: t.lost - 1, r: R(A, "devices") },
        { from: t.lost, to: t.deco - 1, r: phoneRow, label: "Téléphone resté connecté", pos: "top" },
        { from: t.deco, to: t.deco + 80, r: phoneDeco, label: "Déconnecter", pos: "bottom" },
      ]}
    />
  );
};

export const PhoneShot: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ width: 300, height: 640, borderRadius: 46, background: "#10142b", padding: 12, boxShadow: "0 40px 80px rgba(26,35,126,.35)", ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 36, overflow: "hidden", background: "#fff" }}>
      <Img src={staticFile("stokara/caps/mob-home.jpg")} style={{ width: "100%" }} />
    </div>
  </div>
);
