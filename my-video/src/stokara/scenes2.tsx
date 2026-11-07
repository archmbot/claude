// Séquences 11 à 18 : Stokara dans l'Explorateur Windows, administration, serveur, conclusion.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { IconName } from "./icons";
import { PhoneShot } from "./scenes1";
import { timing } from "./timing";
import { Card, Cursor, CurKey, FONT, Icon, K, Keys, Logo, P, Pop, R, Rect, Screen, SpotDef, Spots, Stage, U, clamp, grow, usePop } from "./ui";
import { CR, CRP, ContextMenu, Credentials, Desktop, EX, EXP, Explorer, ExplorerState, MENU_ITEM_Y, Sheet, WZ, WZP, Wizard } from "./windows";

const ch = (n: number, t: string) => `${n} · ${t}`;

// ===================================================================== S11 — Le même dossier, l'adresse du lecteur réseau
export const S11: React.FC = () => {
  const f = useCurrentFrame();
  const { T, PS, END } = timing(10);
  const scr = PS(2);
  const t = {
    meme: T("le même dossier"),
    cote: T("ce que vous déposez"),
    droits: T("avec les mêmes"),
    bas: T("En bas"),
    clic: T("cliquez sur Ouvrir"),
    copie: T("puis copiez"),
    dav: T("Elle se termine"),
  };
  const fadeIll = interpolate(f, [scr - 10, scr], [1, 0], clamp);
  const arrows = interpolate(f, [t.cote, t.cote + 30], [0, 1], clamp);
  return (
    <>
      {f < scr && (
        <Stage>
          <AbsoluteFill style={{ opacity: fadeIll }}>
            <Pop at={6} style={{ position: "absolute", left: 120, top: 150 }}>
              <Card style={{ width: 760, padding: 16 }}>
                <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: K.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon name="globe2" size={26} color={K.blue} /> Dans le navigateur
                </div>
                <Img src={staticFile("stokara/caps/ex-root.jpg")} style={{ width: "100%", borderRadius: 10, border: `1px solid ${K.line}` }} />
              </Card>
            </Pop>
            <Pop at={T("dans l'Explorateur")} style={{ position: "absolute", left: 1040, top: 150 }}>
              <Card style={{ width: 760, padding: 16 }}>
                <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: K.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon name="pc-display" size={26} color={K.blue} /> Dans l'Explorateur Windows
                </div>
                <div style={{ position: "relative", width: 728, height: 400, overflow: "hidden", borderRadius: 10, border: `1px solid ${K.line}` }}>
                  <div style={{ position: "absolute", left: -EX.x * 0.52, top: -EX.y * 0.52, transform: "scale(0.52)", transformOrigin: "0 0", width: 1920, height: 1080 }}>
                    <Explorer st={{ view: "stokara", network: true }} />
                  </div>
                </div>
              </Card>
            </Pop>
            <Pop at={t.meme} style={{ position: "absolute", left: 760, top: 690, width: 400 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 110, height: 110, borderRadius: 55, background: K.orange, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 34px rgba(249,135,26,.4)", transform: `rotate(${arrows * 360}deg)` }}>
                  <Icon name="arrow-repeat" size={60} color="#fff" />
                </div>
                <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: K.ink, textAlign: "center" }}>Le même dossier</div>
                <div style={{ fontFamily: FONT, fontSize: 22, color: K.ink2, textAlign: "center" }}>synchronisé en permanence</div>
              </div>
            </Pop>
            <Pop at={t.droits} style={{ position: "absolute", left: 700, top: 905, width: 520, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: K.blue, color: "#fff", fontFamily: FONT, fontWeight: 600, fontSize: 24, padding: "10px 22px", borderRadius: 40 }}>
                <Icon name="shield-lock-fill" size={26} color="#fff" /> Mêmes comptes, mêmes droits
              </div>
            </Pop>
          </AbsoluteFill>
        </Stage>
      )}
      {f >= scr - 10 && (
        <Stage>
          <Screen
            show={[scr - 10, END + 30]}
            url="/"
            chapter={ch(6, "Stokara dans Windows")}
            shots={[
              { t: 0, s: "nw-btn" },
              { t: t.clic + 4, s: "nw-dlg", fade: 5 },
            ]}
            cam={[
              { t: 0 },
              { t: t.bas, r: [0, 600, 420, 260], z: 2.0 },
              { t: t.clic + 4, r: grow(R("nw-dlg", "dlg"), 20), z: 1.65 },
            ]}
            cur={[
              { t: t.clic, p: P(R("nw-btn", "net"), 0.4), c: "l", d: 24 },
              { t: t.copie + 4, p: P(R("nw-dlg", "copy")), c: "l" },
            ]}
            spots={[
              { from: t.bas + 10, to: t.clic + 2, r: R("nw-btn", "net", 6), label: "Ouvrir dans l'Explorateur Windows", pos: "top" },
              { from: t.copie, to: t.dav - 2, r: R("nw-dlg", "code"), label: "Copier l'adresse", pos: "top" },
              { from: t.dav, to: END + 20, r: R("nw-dlg", "code"), label: "https://stokara.exemple.fr/dav/", pos: "top" },
            ]}
          />
        </Stage>
      )}
    </>
  );
};

// ===================================================================== S12 — Assistant « Ajouter un emplacement réseau »
const typed = (f: number, at: number, text: string, cps = 22) => text.slice(0, Math.max(0, Math.floor(((f - at) / 25) * cps)));

export const S12: React.FC = () => {
  const f = useCurrentFrame();
  const { T, PS } = timing(11);
  const t = {
    pc: T("et cliquez sur Ce PC"),
    right: T("Faites un clic"),
    vide: T("dans un espace"),
    choose: T("et choisissez"),
    add: T("Ajouter un emplacement"),
    wiz: PS(2),
    next1: T("cliquez sur Suivant"),
    sel: T("Sélectionnez"),
    next2: T("puis Suivant"),
    paste: PS(3),
    champ: T("dans le champ"),
    next3: T("et cliquez sur Suivant"),
    cred: PS(4),
    user: T("Saisissez votre"),
    pass: T("et votre mot"),
    coche: T("cochez"),
    ok: T("puis cliquez sur OK"),
    name: PS(5),
    ex: T("par exemple"),
    next4: T("puis Suivant", 1),
    fin: T("Terminer."),
  };
  const opened = usePop(4, 16, 140);
  const menuAt: [number, number] = [EX.x + 820, EX.y + 470];
  const page: 1 | 2 | 3 | 4 | 5 = f < t.next1 + 4 ? 1 : f < t.next2 + 4 ? 2 : f < t.name ? 3 : f < t.next4 + 4 ? 4 : 5;
  const showWiz = f >= t.wiz - 4 && f < t.fin + 8;
  const wizPop = usePop(t.wiz - 4, 16, 160);
  const showCred = f >= t.next3 + 10 && f < t.name - 2;
  const credPop = usePop(t.next3 + 10, 16, 160);
  const ex: ExplorerState = { view: f < t.pc + 3 ? "home" : "pc" };
  const cur: CurKey[] = [
    { t: t.pc, p: EXP.nav("Ce PC"), c: "l", d: 26 },
    { t: t.vide, p: menuAt, c: "r" },
    { t: t.add, p: [menuAt[0] + 140, menuAt[1] + MENU_ITEM_Y], c: "l" },
    { t: t.next1, p: WZP.next, c: "l", d: 22 },
    { t: t.sel + 6, p: WZP.custom, c: "l" },
    { t: t.next2, p: WZP.next, c: "l" },
    { t: t.champ, p: WZP.field, c: "l" },
    { t: t.next3, p: WZP.next, c: "l" },
    { t: t.user, p: CRP.user, c: "l" },
    { t: t.pass, p: CRP.pass, c: "l" },
    { t: t.coche + 4, p: CRP.remember, c: "l" },
    { t: t.ok, p: CRP.ok, c: "l" },
    { t: t.ex, p: WZP.field, c: "l" },
    { t: t.next4, p: WZP.next, c: "l" },
    { t: t.fin, p: WZP.next, c: "l" },
  ];
  const spots: SpotDef[] = [
    { from: t.pc - 6, to: t.right - 2, r: [EX.x + 10, EXP.nav("Ce PC")[1] - 20, 240, 40], label: "Ce PC", pos: "right" },
    { from: t.choose, to: t.add + 6, r: [menuAt[0] + 6, menuAt[1] + MENU_ITEM_Y - 19, 318, 38], label: "Ajouter un emplacement réseau", pos: "right" },
    { from: t.sel, to: t.next2 - 1, r: [WZ.x + 60, WZ.y + 125, 680, 76] },
    { from: t.champ, to: t.next3 - 1, r: [WZ.x + 52, WZ.y + 183, 525, 36], label: "Adresse Internet ou réseau", pos: "bottom" },
    { from: t.user, to: t.coche - 1, r: [CR.x + 22, CR.y + 129, CR.w - 44, 96], label: "Identifiants Stokara", pos: "right" },
    { from: t.coche, to: t.ok - 1, r: [CR.x + 22, CR.y + 242, 400, 28], pos: "right" },
    { from: t.ex, to: t.next4 - 1, r: [WZ.x + 52, WZ.y + 230, 475, 36], label: "Stokara", pos: "bottom" },
  ];
  return (
    <Desktop>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.92 + 0.08 * opened})`, opacity: opened }}>
        <Explorer st={ex} />
      </div>
      <ContextMenu x={menuAt[0]} y={menuAt[1]} at={f >= t.vide + 2 && f < t.add + 10 ? t.vide + 2 : 1e9} hl={f >= t.choose ? 4 : undefined} />
      {showWiz && (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, wizPop * 1.5), transform: `translateY(${(1 - wizPop) * 30}px)` }}>
          <Wizard page={page} typed={f >= t.paste + 20 ? "https://stokara.exemple.fr/dav/" : ""} name={typed(f, t.ex + 6, "Stokara", 14)} customSel={f >= t.sel + 6} />
        </div>
      )}
      {showCred && (
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, credPop * 1.5), transform: `scale(${0.95 + 0.05 * credPop})` }}>
          <Credentials user={typed(f, t.user + 6, "karim", 12)} pass={Math.min(17, Math.max(0, Math.floor((f - t.pass - 6) / 2)))} remember={f >= t.coche + 4} />
        </div>
      )}
      <Spots spots={spots} />
      <Cursor keys={cur} />
      <Pop at={t.paste + 4} until={t.champ + 30} style={{ position: "absolute", left: 1450, top: 830 }}>
        <Card style={{ padding: "16px 22px" }}>
          <Keys keys={["Ctrl", "+", "V"]} size={30} />
        </Card>
      </Pop>
    </Desktop>
  );
};

// ===================================================================== S13 — Le résultat, et quelques conseils
export const S13: React.FC = () => {
  const f = useCurrentFrame();
  const { T, PS } = timing(12);
  const t = {
    voila: T("Stokara apparaît"),
    dbl: T("Double-cliquez"),
    dos: T("vos dossiers"),
    ouvre: PS(1),
    modif: T("modifiez-le"),
    enreg: T("enregistrez"),
    site: T("il est aussitôt"),
    partout: T("Et comme"),
    vpn: T("sans VPN"),
    tips: PS(2),
    dav: T("L'adresse doit"),
    mdp: T("Si vous changez"),
    lim: PS(3),
    admin: T("Votre administrateur"),
    lettre: PS(4),
  };
  const view: ExplorerState["view"] = f < t.dbl + 8 ? "pc" : f < t.ouvre + 18 ? "stokara" : "dupont";
  const desk = f < t.partout;
  return (
    <>
      {desk && (
        <Desktop>
          <Explorer st={{ view, network: true, selected: view === "pc" && f >= t.voila ? "Stokara" : view === "dupont" && f >= t.ouvre + 26 ? "Planning chantier.xlsx" : undefined }} />
          {f >= t.modif - 4 && (
            <Pop at={t.modif - 4} style={{ position: "absolute", left: 720, top: 330 }}>
              <Sheet edit={f >= t.modif + 6 ? (f - t.modif - 6) / 1.5 : 0} saved={f >= t.enreg + 8} />
            </Pop>
          )}
          <Pop at={t.enreg + 8} until={t.partout} style={{ position: "absolute", left: 1210, top: 270 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#1d7a45", color: "#fff", fontFamily: FONT, fontWeight: 600, fontSize: 22, padding: "10px 20px", borderRadius: 30 }}>
              <Icon name="check-circle-fill" size={24} color="#fff" /> Enregistré dans Stokara
            </div>
          </Pop>
          <Pop at={t.site} until={t.partout} style={{ position: "absolute", left: 180, top: 640 }}>
            <Card style={{ width: 560, padding: "18px 22px", display: "flex", gap: 16, alignItems: "center", border: `2px solid ${K.orange}` }}>
              <Logo size={54} />
              <div style={{ fontFamily: FONT }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: K.ink }}>Planning chantier.xlsx</div>
                <div style={{ fontSize: 18, color: K.ink2 }}>modifié à l'instant · Karim (lecteur réseau)</div>
              </div>
            </Card>
          </Pop>
          <Spots
            spots={[
              { from: t.voila, to: t.dbl - 2, r: [EXP.netTile[0] - 80, EXP.netTile[1] - 80, 160, 160], label: "Emplacements réseau", pos: "right" },
              { from: t.dos, to: t.ouvre - 2, r: [EX.x + 278, EX.y + 150, 850, 160], label: "Vos dossiers, avec vos droits", pos: "bottom" },
            ]}
          />
          <Cursor
            keys={[
              { t: t.dbl, p: EXP.netTile, c: "d", d: 24 },
              { t: t.ouvre + 8, p: EXP.folder(0), c: "d" },
              { t: t.ouvre + 24, p: EXP.file(6), c: "d" },
              { t: t.modif + 4, p: [1260, 563], c: "l" },
              { t: t.enreg, p: [760, 352], c: "l" },
            ]}
          />
        </Desktop>
      )}
      {!desk && (
        <Stage>
          {f < t.tips && (
            <AbsoluteFill style={{ opacity: interpolate(f, [t.tips - 8, t.tips], [1, 0], clamp) }}>
              <Line at={t.partout + 4} a={[480, 640]} b={[960, 380]} />
              <Line at={t.partout + 10} a={[1440, 640]} b={[960, 380]} />
              <Bubble at={t.partout} x={960} y={330} icon="hdd-network-fill" title="https://stokara.exemple.fr/dav/" tone={K.navy} />
              <Bubble at={t.partout + 6} x={480} y={700} icon="building" title="Au bureau" tone={K.orange} />
              <Bubble at={t.partout + 12} x={1440} y={700} icon="house-door-fill" title="À la maison" tone={K.orange} />
              <Pop at={t.vpn} style={{ position: "absolute", left: 760, top: 560, width: 400, display: "flex", justifyContent: "center" }}>
                <div style={{ background: K.green, color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 32, padding: "12px 30px", borderRadius: 40 }}>Sans VPN</div>
              </Pop>
            </AbsoluteFill>
          )}
          {f >= t.tips && (
            <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
              <Pop at={t.tips}>
                <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 600, color: K.orange2, letterSpacing: 3, textTransform: "uppercase", marginBottom: 26 }}>Quelques conseils</div>
              </Pop>
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <TipRow at={t.dav} icon="link-45deg" tone={K.orange} title="Toujours /dav/ à la fin de l'adresse" sub="https://stokara.exemple.fr/dav/" />
                <TipRow at={t.mdp} icon="key-fill" tone={K.blue} title="Mot de passe changé ?" sub="Reconnectez-vous une fois au site avant de rouvrir le lecteur." />
                <TipRow at={t.lim} icon="exclamation-triangle-fill" tone={K.red} title="Windows limite à 50 Mo par fichier" sub="Votre administrateur peut lever cette limite." />
                <TipRow at={t.lettre} icon="hdd-fill" tone={K.teal} title="Une lettre de lecteur, comme S: ?" sub="Ce PC → Connecter un lecteur réseau, avec la même adresse." />
              </div>
            </AbsoluteFill>
          )}
          {t.admin < 0 && null}
        </Stage>
      )}
    </>
  );
};
const TipRow: React.FC<{ at: number; icon: IconName; tone: string; title: string; sub: string }> = ({ at, icon, tone, title, sub }) => (
  <Pop at={at}>
    <Card style={{ width: 1180, display: "flex", alignItems: "center", gap: 26, padding: "22px 30px", borderLeft: `10px solid ${tone}` }}>
      <div style={{ width: 76, height: 76, borderRadius: 22, background: tone, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={icon} size={40} color="#fff" />
      </div>
      <div style={{ fontFamily: FONT }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: K.ink }}>{title}</div>
        <div style={{ fontSize: 25, color: K.ink2, marginTop: 4 }}>{sub}</div>
      </div>
    </Card>
  </Pop>
);
const Bubble: React.FC<{ at: number; x: number; y: number; icon: IconName; title: string; tone: string }> = ({ at, x, y, icon, title, tone }) => (
  <Pop at={at} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>
    <Card style={{ padding: "20px 28px", display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: tone, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={42} color="#fff" />
      </div>
      <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: K.ink }}>{title}</div>
    </Card>
  </Pop>
);
const Line: React.FC<{ at: number; a: [number, number]; b: [number, number] }> = ({ at, a, b }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 14], [0, 1], clamp);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * p} y2={a[1] + (b[1] - a[1]) * p} stroke={K.orange} strokeWidth={6} strokeDasharray="14 14" strokeDashoffset={-(f * 1.6) % 28} strokeLinecap="round" />
    </svg>
  );
};

// ===================================================================== S14 — Administration : tableau de bord, comptes, groupes
export const S14: React.FC = () => {
  const { T, PS } = timing(13);
  const D = "ad-dash";
  const N = "ad-newuser";
  const t = {
    adm: T("réservée aux"),
    tab: T("Le tableau"),
    stock: T("état du stockage"),
    mails: T("des e-mails"),
    srv: T("et du serveur"),
    comptes: PS(1),
    btn: T("le bouton Nouveau"),
    id: T("identifiant,"),
    nom: T("nom affiché,"),
    mail: T("adresse e-mail,"),
    role: T("et rôle,"),
    pw: PS(2),
    force: T("et gardez"),
    perso: T("créer un dossier"),
    send: T("et lui envoyer"),
    cred: PS(3),
    grp: PS(4),
  };
  const tiles: Rect = [332, 160, 1192, 190];
  return (
    <Screen
      url="/admin.html"
      chapter={ch(7, "Administration")}
      shots={[
        { t: 0, s: D },
        { t: t.comptes - 2, s: "ad-users", fade: 4 },
        { t: t.btn + 8, s: N, fade: 4 },
        { t: t.cred - 4, s: "ad-cred", fade: 5 },
        { t: t.grp - 4, s: "ad-groups", fade: 5 },
      ]}
      cam={[
        { t: 0 },
        { t: t.tab, r: [320, 90, 1220, 280], z: 1.3 },
        { t: t.stock - 4, r: [320, 340, 1220, 520], z: 1.2 },
        { t: t.comptes - 2, r: [320, 160, 1220, 400], z: 1.25 },
        { t: t.btn + 8, r: R(N, "dlg"), z: 1.45 },
        { t: t.force - 4, r: [600, 280, 1000, 320], z: 1.6 },
        { t: t.cred - 4, r: grow(R("ad-cred", "dlg"), 30), z: 1.7 },
        { t: t.grp - 4, r: [70, 90, 1460, 360], z: 1.2 },
      ]}
      cur={[
        { t: t.comptes + 2, p: P(R("ad-users", "tUsers"), 0.3), c: "l", d: 20 },
        { t: t.btn, p: P(R("ad-users", "new")), c: "l" },
        { t: t.id, p: P(R(N, "user"), 0.2) },
        { t: t.nom, p: P(R(N, "name"), 0.2) },
        { t: t.mail, p: P(R(N, "email"), 0.2) },
        { t: t.role, p: P(R(N, "role"), 0.2) },
        { t: t.pw + 4, p: P(R(N, "pw"), 0.2) },
        { t: t.force + 4, p: P(R(N, "force")) },
        { t: t.perso + 4, p: P(R(N, "perso")) },
        { t: t.send + 4, p: P(R(N, "mail")) },
        { t: t.cred - 6, p: P(R(N, "ok")), c: "l" },
        { t: t.grp - 4, p: P(R("ad-groups", "tGroups"), 0.3), c: "l" },
      ]}
      spots={[
        { from: t.adm, to: t.tab - 2, r: R(D, "tabs"), label: "Menu d'administration", pos: "right" },
        { from: t.tab + 4, to: t.stock - 4, r: tiles, label: "Comptes, fichiers, volume, sessions…", pos: "bottom" },
        { from: t.stock, to: t.mails - 1, r: R(D, "storage"), pos: "top", label: "Stockage" },
        { from: t.mails, to: t.srv - 1, r: R(D, "mail"), pos: "left", label: "E-mails" },
        { from: t.srv, to: t.comptes - 4, r: R(D, "server"), pos: "left", label: "Serveur" },
        { from: t.btn + 2, to: t.btn + 10, r: R("ad-users", "new") },
        { from: t.id, to: t.nom - 1, r: R(N, "user"), label: "Identifiant", pos: "top" },
        { from: t.nom, to: t.mail - 1, r: R(N, "name"), label: "Nom affiché", pos: "top" },
        { from: t.mail, to: t.role - 1, r: R(N, "email"), label: "E-mail", pos: "top" },
        { from: t.role, to: t.pw - 1, r: R(N, "role"), label: "Utilisateur ou administrateur", pos: "top" },
        { from: t.pw, to: t.force - 1, r: R(N, "pw"), label: "Vide = généré automatiquement", pos: "bottom" },
        { from: t.force, to: t.perso - 1, r: [798, 415, 380, 26], label: "Changer à la 1re connexion", pos: "right" },
        { from: t.perso, to: t.send - 1, r: [798, 445, 380, 26], label: "Dossier personnel", pos: "right" },
        { from: t.send, to: t.cred - 6, r: [798, 475, 380, 26], label: "Identifiants par e-mail", pos: "right" },
        { from: t.cred + 6, to: t.grp - 6, r: [566, 355, 468, 100], label: "À transmettre à la personne", pos: "bottom" },
        { from: t.grp + 6, to: t.grp + 140, r: R("ad-groups", "pane"), pos: "bottom", label: "Bureau · Comptabilité" },
      ]}
    />
  );
};

// ===================================================================== S15 — Les droits
export const S15: React.FC = () => {
  const { T, PS } = timing(14);
  const t = {
    ouvre: T("Ouvrez un dossier"),
    droits: T("puis cliquez sur Droits"),
    ajout: PS(1),
    coche: T("et cochez"),
    pre: T("Les préréglages"),
    herit: PS(2),
    conf: T("Pour rendre"),
    seul: T("seules les"),
    prev: T("Les personnes ajoutées"),
    pw: PS(3),
    ind: T("avec un indice"),
    vue: PS(4),
  };
  const cols: Rect = [905, 385, 245, 120];
  return (
    <Screen
      url={[
        [0, "/#/Clients"],
        [t.conf - 4, "/#/Comptabilité"],
        [t.vue - 4, "/admin.html#droits"],
      ]}
      chapter={ch(7, "Administration")}
      shots={[
        { t: 0, s: "acl-btn" },
        { t: t.droits + 8, s: "acl-dlg", fade: 5 },
        { t: t.ajout + 2, s: "acl-pick", fade: 3 },
        { t: t.coche, s: "acl-added", fade: 4 },
        { t: t.herit - 2, s: "acl-dlg", fade: 4 },
        { t: t.conf - 4, s: "acl-compta", fade: 5 },
        { t: t.pw - 2, s: "acl-pw", fade: 4 },
        { t: t.vue - 4, s: "ad-droits", fade: 6 },
      ]}
      cam={[
        { t: 0, r: [280, 80, 1320, 200], z: 1.4 },
        { t: t.droits + 8, r: grow(R("acl-dlg", "dlg"), 10), z: 1.6 },
        { t: t.vue - 4, r: [320, 150, 1220, 720], z: 1.1 },
      ]}
      cur={[
        { t: t.ouvre + 4, p: P(R("acl-btn", "crumbs"), 0.8) },
        { t: t.droits, p: P(R("acl-btn", "btn")), c: "l" },
        { t: t.ajout + 2, p: P(R("acl-dlg", "add"), 0.3), c: "l" },
        { t: t.coche + 10, p: [930, 466], c: "l" },
        { t: t.pre + 4, p: P(R("acl-added", "preset")), c: "l" },
        { t: t.herit + 10, p: P(R("acl-dlg", "inh")) },
        { t: t.conf + 10, p: P(R("acl-compta", "inh")), c: "l" },
        { t: t.pw - 6, p: P(R("acl-pw", "tab")), c: "l" },
        { t: t.ind, p: P(R("acl-pw", "hint"), 0.3), c: "l" },
      ]}
      spots={[
        { from: t.droits - 4, to: t.droits + 8, r: R("acl-btn", "btn"), label: "Droits", pos: "bottom" },
        { from: t.ajout + 4, to: t.coche - 1, r: R("acl-pick", "add"), label: "Une personne ou un groupe", pos: "bottom" },
        { from: t.coche + 4, to: t.pre - 1, r: cols, label: "Voir · Modifier · Supprimer · Partager", pos: "top" },
        { from: t.pre, to: t.herit - 4, r: R("acl-added", "preset", 3), label: "Lecture · Modification · Complet", pos: "top" },
        { from: t.herit + 4, to: t.conf - 4, r: [412, 314, 300, 30], label: "Hérité vers les sous-dossiers", pos: "top" },
        { from: t.conf + 6, to: t.seul - 1, r: [412, 314, 300, 30], label: "Décoché : dossier confidentiel", pos: "top" },
        { from: t.seul, to: t.prev - 1, r: R("acl-compta", "rows"), label: "Seules ces personnes", pos: "bottom" },
        { from: t.prev, to: t.pw - 4, r: [412, 551, 400, 30], label: "Notification et e-mail", pos: "bottom" },
        { from: t.pw + 4, to: t.ind - 1, r: R("acl-pw", "npw"), label: "Mot de passe du dossier", pos: "top" },
        { from: t.ind, to: t.vue - 6, r: R("acl-pw", "hint"), label: "Indice", pos: "top" },
        { from: t.vue + 6, to: t.vue + 150, r: [332, 240, 1192, 560], label: "Tous les accès en un coup d'œil", pos: "top" },
      ]}
    />
  );
};

// ===================================================================== S16 — Annonces, stockage, RAID, serveur, journal, paramètres
export const S16: React.FC = () => {
  const { T, PS } = timing(15);
  const t = {
    ann: T("affichent"),
    login: T("la page de connexion"),
    stock: PS(1),
    disque: T("le disque"),
    dossier: T("et le dossier"),
    raid: PS(2),
    dix: T("toutes les dix"),
    panne: T("Si un disque"),
    srv: PS(3),
    taches: T("les tâches"),
    adr: T("vous réglez"),
    log: PS(4),
    param: T("Et les Paramètres"),
  };
  const RD = "ad-raid";
  return (
    <Screen
      url={[
        [0, "/admin.html#annonces"],
        [t.stock - 2, "/admin.html#stockage"],
        [t.srv - 2, "/admin.html#serveur"],
        [t.log - 2, "/admin.html#journal"],
        [t.param, "/admin.html#parametres"],
      ]}
      chapter={ch(7, "Administration")}
      shots={[
        { t: 0, s: "ad-ann" },
        { t: t.ann + 10, s: "ad-ann-new", fade: 4 },
        { t: t.stock - 2, s: "ad-stock", fade: 5 },
        { t: t.raid - 2, s: RD, fade: 5 },
        { t: t.srv - 2, s: "ad-srv", fade: 5 },
        { t: t.log - 2, s: "ad-log", fade: 5 },
        { t: t.param, s: "ad-param", fade: 5 },
      ]}
      cam={[
        { t: 0, r: [320, 160, 1220, 260], z: 1.3 },
        { t: t.ann + 10, r: R("ad-ann-new", "dlg"), z: 1.4 },
        { t: t.stock - 2, r: [320, 150, 1220, 680], z: 1.1 },
        { t: t.raid - 2, r: R(RD, "raid"), z: 1.25 },
        { t: t.srv - 2, r: [320, 150, 1220, 720], z: 1.1 },
        { t: t.log - 2, r: [320, 150, 1220, 500], z: 1.2 },
        { t: t.param, r: [320, 150, 1220, 560], z: 1.2 },
      ]}
      cur={[
        { t: t.ann, p: P(R("ad-ann", "new")), c: "l", d: 22 },
        { t: t.login + 4, p: P(R("ad-ann-new", "login")), c: "l" },
        { t: t.raid + 8, p: P(R(RD, "on")) },
        { t: t.srv, p: [1200, 760], hide: true },
      ]}
      spots={[
        { from: t.ann + 14, to: t.login - 1, r: [415, 270, 770, 160], label: "Titre, type et message", pos: "top" },
        { from: t.login, to: t.stock - 4, r: [412, 555, 330, 30], label: "Aussi sur la page de connexion", pos: "bottom" },
        { from: t.disque, to: t.dossier - 1, r: [340, 165, 1176, 225], label: "Disques du serveur", pos: "bottom" },
        { from: t.dossier, to: t.raid - 4, r: [340, 427, 1176, 383], label: "Fichiers · Corbeille · Données internes", pos: "top" },
        { from: t.raid + 4, to: t.dix - 1, r: [350, 380, 260, 32], label: "Activer la copie RAID", pos: "right" },
        { from: t.dix, to: t.panne - 1, r: [350, 470, 560, 150], label: "Copie vers E: · toutes les 10 minutes", pos: "bottom" },
        { from: t.panne, to: t.srv - 4, r: R(RD, "status"), label: "Dernière copie réussie", pos: "left" },
        { from: t.srv + 4, to: t.taches - 1, r: [332, 180, 1192, 300], label: "Apache · MySQL", pos: "bottom" },
        { from: t.taches, to: t.adr - 1, r: [932, 512, 593, 200], label: "Tâches planifiées", pos: "left" },
        { from: t.adr, to: t.log - 4, r: [332, 512, 593, 343], label: "Adresse publique", pos: "right" },
        { from: t.log + 4, to: t.param - 2, r: [332, 240, 1192, 420], label: "Connexions, imports, suppressions, partages", pos: "top" },
        { from: t.param + 6, to: t.param + 200, r: [332, 240, 1192, 300], label: "Sessions, verrouillage, corbeille, nom du site", pos: "bottom" },
      ]}
    />
  );
};

// ===================================================================== S17 — Côté serveur
export const S17: React.FC = () => {
  const f = useCurrentFrame();
  const { T, PS, END } = timing(16);
  const t = {
    srv: T("Windows Server"),
    pc: T("ou sur un PC"),
    xampp: T("avec XAMPP"),
    inst: PS(1),
    apache: T("il configure"),
    mysql: T("MySQL", 0),
    base: T("la base"),
    feu: T("le pare-feu"),
    tach: T("et les tâches"),
    pan: PS(2),
    dem: T("de démarrer"),
    dom: T("de régler"),
    raid: T("le RAID"),
    tasks: T("et les tâches", 1),
    jour: T("de lire"),
    sauv: T("et de lancer"),
  };
  const phase = f < t.inst ? 0 : f < t.pan ? 1 : 2;
  const tabs: [string, number, IconName][] = [
    ["État", t.dem, "play-circle-fill"],
    ["Configuration", t.dom, "lock-fill"],
    ["Dossiers & RAID", t.raid, "hdd-rack"],
    ["Tâches", t.tasks, "clock-history"],
    ["Journaux", t.jour, "journal-text"],
    ["Outils", t.sauv, "tools"],
  ];
  let active = 0;
  tabs.forEach(([, at], i) => {
    if (f >= at) active = i;
  });
  const detail: Record<number, string[]> = {
    0: ["Apache — ● en marche", "MySQL — ● en marche", "Démarrer · Arrêter · Redémarrer"],
    1: ["Port, nom de domaine", "Certificat HTTPS (PEM)", "Adresse publique"],
    2: ["Dossier de base, corbeille", "Copie RAID : activer, lancer, arrêter"],
    3: ["Stokara - Entretien (chaque heure)", "Stokara - RAID (toutes les 10 min)"],
    4: ["Apache, PHP, MySQL", "Entretien, RAID"],
    5: ["Sauvegarde (base + configuration)", "Mot de passe administrateur", "Adresse du lecteur réseau"],
  };
  const checks: [string, number][] = [
    ["Apache", t.apache],
    ["MySQL", t.mysql],
    ["Base de données", t.base],
    ["Pare-feu", t.feu],
    ["Tâches planifiées", t.tach],
  ];
  return (
    <Stage>
      {phase === 0 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 60 }}>
          <DeviceCard at={t.srv - 6} icon="hdd-stack" title="Windows Server" sub="2016 · 2019 · 2022" />
          <DeviceCard at={t.pc} icon="pc-display" title="PC Windows" sub="10 ou 11" />
          <Pop at={t.xampp}>
            <Card style={{ padding: "30px 36px", width: 420 }}>
              <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: K.orange2 }}>XAMPP</div>
              <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                {["Apache", "PHP", "MySQL"].map((x) => (
                  <span key={x} style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: K.blue, background: "rgba(57,73,171,.1)", padding: "6px 16px", borderRadius: 20 }}>{x}</span>
                ))}
              </div>
            </Card>
          </Pop>
        </AbsoluteFill>
      )}
      {phase === 1 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 120 }}>
          <Pop at={t.inst}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative" }}>
              <div style={{ width: 170, height: 200, borderRadius: 18, background: "#fff", boxShadow: "0 24px 50px rgba(26,35,126,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="terminal-fill" size={96} color={K.navy} />
              </div>
              <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 600, color: K.ink }}>INSTALLER_SUR_LE_SERVEUR.bat</div>
              <Ripple at={T("Un double-clic") + 6} />
            </div>
          </Pop>
          <Card style={{ padding: "30px 40px", width: 560 }}>
            {checks.map(([label, at]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 18, height: 66, fontFamily: FONT, fontSize: 32, color: f >= at ? K.ink : K.ink3 }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: f >= at ? K.green : "#e3e7f0", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${f >= at ? interpolate(f, [at, at + 8], [0.6, 1], clamp) : 1})` }}>
                  {f >= at && <Icon name="check-lg" size={26} color="#fff" />}
                </div>
                {label}
              </div>
            ))}
          </Card>
        </AbsoluteFill>
      )}
      {phase === 2 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <Pop at={t.pan}>
            <div style={{ width: 1300, height: 640, background: "#fff", borderRadius: 14, boxShadow: "0 40px 90px rgba(26,35,126,.3)", overflow: "hidden", fontFamily: FONT }}>
              <div style={{ height: 56, background: "linear-gradient(90deg, #1a237e, #3949ab)", color: "#fff", display: "flex", alignItems: "center", gap: 14, padding: "0 22px", fontSize: 22, fontWeight: 600 }}>
                <Logo size={32} /> Stokara — Panneau du serveur
                <span style={{ marginLeft: "auto", fontSize: 16, fontWeight: 400, opacity: 0.8 }}>PANNEAU_SERVEUR.bat</span>
              </div>
              <div style={{ display: "flex", gap: 6, padding: "14px 18px 0", borderBottom: `1px solid ${K.line}` }}>
                {tabs.map(([label, , icon], i) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", fontSize: 22, fontWeight: 600, color: i === active ? K.orange2 : K.ink2, borderBottom: i === active ? `4px solid ${K.orange}` : "4px solid transparent", background: i === active ? "rgba(249,135,26,.08)" : "transparent", borderRadius: "10px 10px 0 0" }}>
                    <Icon name={icon} size={22} color={i === active ? K.orange2 : K.ink3} />
                    {label}
                  </div>
                ))}
              </div>
              <div style={{ padding: "40px 50px", display: "flex", flexDirection: "column", gap: 22 }}>
                {detail[active].map((d, i) => (
                  <Pop key={`${active}-${i}`} at={tabs[active][1] + i * 4}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, color: K.ink }}>
                      <span style={{ width: 12, height: 12, borderRadius: 6, background: K.orange }} />
                      {d}
                    </div>
                  </Pop>
                ))}
              </div>
            </div>
          </Pop>
        </AbsoluteFill>
      )}
      {END < 0 && null}
    </Stage>
  );
};
const DeviceCard: React.FC<{ at: number; icon: IconName; title: string; sub: string }> = ({ at, icon, title, sub }) => (
  <Pop at={at}>
    <Card style={{ width: 380, padding: "40px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ width: 130, height: 130, borderRadius: 34, background: "linear-gradient(135deg, #3949ab, #1a237e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={70} color="#fff" />
      </div>
      <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 700, color: K.ink }}>{title}</div>
      <div style={{ fontFamily: FONT, fontSize: 26, color: K.ink2 }}>{sub}</div>
    </Card>
  </Pop>
);
const Ripple: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  return (
    <>
      {[0, 7].map((o) => {
        const tt = f - at - o;
        if (tt < 0 || tt > 18) return null;
        const r = interpolate(tt, [0, 18], [10, 70]);
        return <div key={o} style={{ position: "absolute", left: 85 - r, top: 100 - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `5px solid ${K.orange}`, opacity: 1 - tt / 18 }} />;
      })}
    </>
  );
};

// ===================================================================== S18 — Conclusion
export const S18: React.FC = () => {
  const f = useCurrentFrame();
  const { T, PS } = timing(17);
  const recap: [string, IconName, string][] = [
    ["vous connecter", "box-arrow-in-right", "Se connecter"],
    ["ranger", "folder2-open", "Ranger et retrouver"],
    ["les partager", "link-45deg", "Partager"],
    ["échanger", "chat-dots-fill", "Échanger"],
    ["et ouvrir", "pc-display", "Ouvrir dans Windows"],
  ];
  const fin = T("Vos fichiers,", 1);
  const outro = interpolate(f, [fin - 6, fin + 8], [0, 1], clamp);
  return (
    <Stage>
      <AbsoluteFill style={{ opacity: 1 - outro }}>
        <div style={{ position: "absolute", left: 180, top: 170, display: "flex", flexDirection: "column", gap: 22 }}>
          {recap.map(([cue, icon, label], i) => (
            <Pop key={label} at={T(cue)}>
              <Card style={{ width: 760, display: "flex", alignItems: "center", gap: 24, padding: "20px 28px" }}>
                <div style={{ width: 66, height: 66, borderRadius: 20, background: i % 2 ? K.blue : K.orange, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={icon} size={36} color="#fff" />
                </div>
                <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 600, color: K.ink }}>{label}</div>
                <Icon name="check-circle-fill" size={36} color={K.green} style={{ marginLeft: "auto" }} />
              </Card>
            </Pop>
          ))}
        </div>
        <Pop at={PS(1)} style={{ position: "absolute", left: 1230, top: 150 }}>
          <PhoneShot />
        </Pop>
      </AbsoluteFill>
      {outro > 0 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: outro }}>
          <Logo size={190} style={{ filter: "drop-shadow(0 30px 40px rgba(26,35,126,.35))" }} />
          <div style={{ fontFamily: FONT, fontSize: 96, fontWeight: 700, color: K.ink, letterSpacing: 14, marginTop: 16 }}>STOKARA</div>
          <div style={{ fontFamily: FONT, fontSize: 34, color: K.ink2, marginTop: 6 }}>Vos fichiers, vos dossiers partagés et votre messagerie, au même endroit.</div>
          <Pop at={T("Merci")}>
            <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 600, color: K.orange2, marginTop: 40 }}>Merci d'avoir suivi ce tutoriel !</div>
          </Pop>
        </AbsoluteFill>
      )}
    </Stage>
  );
};

export { U };
