// BLACK U15 BASKET — intro cinématique futuriste (16:9, 25 s, 60 i/s, rendu 4K avec --scale=2).
// Les joueurs sont les vraies photos détourées : aucun visage n'est généré ni modifié.
import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Easing,
  Html5Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Cam, V3, View, focalFor, makeView, orbit } from "./camera";
import {
  Arcs,
  Basketball,
  Beam,
  COLORS,
  DISPLAY,
  Flash,
  Floor,
  Fog,
  GlowPath,
  Grain,
  HUD,
  HoloBall,
  Letterbox,
  MetalText,
  Particles,
  Player,
  PlayerSprite,
  Ring,
  Vignette,
  useFonts,
} from "./elements";
import { FPS, HEIGHT, HITS, REVEALS, REVEALS_END, T, WIDTH } from "./timeline";

export type BU15Props = { players: Player[] };

export const calculateBU15Metadata: CalculateMetadataFunction<BU15Props> = async () => {
  const res = await fetch(staticFile("black-u15/players/players.json"));
  if (!res.ok) {
    throw new Error("Photos détourées introuvables : lancez python3 scripts/black-u15/cutout.py <photos> <numeros.json>");
  }
  return { props: { players: (await res.json()) as Player[] } };
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const span = (f: number, a: number, b: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing });
const FOCAL = focalFor(40);
const TITLE = "BLACK U15 BASKET";

// Hauteur réelle approximative : les photos sont prises à la même distance
const worldHeights = (players: Player[]) => {
  const hs = players.map((p) => p.height).sort((a, b) => a - b);
  const median = hs[Math.floor(hs.length / 2)] || 1;
  return new Map(players.map((p) => [p.number, Math.min(1.82, Math.max(1.42, (1.62 * p.height) / median))]));
};

// Joueur debout en (x, y, z) projeté comme un panneau face caméra
const spriteAt = (view: View, at: V3, H: number) => {
  const feet = view.project(at);
  const head = view.project([at[0], at[1] + H, at[2]]);
  if (!feet || !head) return null;
  return { x: feet.x, y: feet.y, h: feet.y - head.y, depth: feet.depth, scale: feet.scale };
};

// ---------------------------------------------------------------- scène 1
const Activation: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / FPS;
  const dive = span(frame, T.dive, T.players, Easing.in(Easing.cubic));
  const view = makeView({ pos: [0, lerp(1.7, 0.85, dive), lerp(-15, -4.5, dive)], target: [0, lerp(0.7, 0.75, dive), 0], focal: FOCAL });
  const dot = span(frame, T.lightOn, T.lightOn + 24, Easing.out(Easing.cubic));
  const form = span(frame, T.ballForm, T.ballForm + 50);
  const cx = WIDTH / 2;
  const cy = 410 + Math.sin(t * 2.1) * 6;
  const ballR = 118 * form * (1 + dive * 3);
  const text = (start: number, label: string, y: number) => {
    const p = span(frame, start, start + 22, Easing.out(Easing.cubic));
    const out = 1 - span(frame, T.dive - 6, T.dive + 8);
    return (
      <div style={{ position: "absolute", top: y, width: "100%", textAlign: "center", opacity: p * out }}>
        <MetalText text={label} size={58} font={HUD} spacing={`${lerp(0.9, 0.32, p)}em`} depth={4} glow={0.8} />
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 45% at 50% 62%, rgba(20,50,120,0.35), rgba(0,0,0,0) 70%)", opacity: span(frame, 100, 220) }} />
      <Floor view={view} court={0.32 * span(frame, 150, 225)} circuits={span(frame, T.circuits, T.dive + 10, Easing.out(Easing.quad))} />
      {/* point lumineux qui devient un ballon holographique */}
      <div
        style={{
          position: "absolute",
          left: cx - 160,
          top: cy - 160,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230,245,255,1) 0%, rgba(79,178,255,0.9) 6%, rgba(47,123,255,0.25) 22%, rgba(47,123,255,0) 55%)",
          transform: `scale(${dot * (1 + 0.15 * Math.sin(t * 9)) * (1 - form * 0.6)})`,
          opacity: dot * (1 - form * 0.75),
        }}
      />
      <HoloBall cx={cx} cy={cy - dive * 120} r={ballR} rot={t * 0.9} draw={form} opacity={1 - span(frame, T.dive + 8, T.players)} />
      {text(T.line1, "DIX JOUEURS.", 650)}
      {text(T.line2, "UNE ÉQUIPE.", 735)}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scène 2
type Shot = {
  dist: [number, number];
  yaw: [number, number];
  camY: [number, number]; // fractions de la taille du joueur
  targetY: [number, number]; // idem ; "face" = hauteur du visage
  silhouette?: [number, number]; // contre-jour puis éclairage (fractions du plan)
};
const SHOTS: Shot[] = [
  { dist: [3.6, 3.15], yaw: [-14, -5], camY: [0.55, 0.6], targetY: [0.5, 0.52], silhouette: [0.3, 0.62] },
  { dist: [1.75, 2.7], yaw: [10, 3], camY: [0.92, 0.85], targetY: [-1, 0.7] },
  { dist: [2.6, 2.6], yaw: [-22, 12], camY: [0.72, 0.72], targetY: [0.66, 0.66] },
  { dist: [2.7, 2.3], yaw: [6, 0], camY: [0.22, 0.3], targetY: [0.25, 0.7] },
  { dist: [3.2, 2.9], yaw: [12, 2], camY: [0.6, 0.6], targetY: [0.55, 0.55], silhouette: [0.2, 0.5] },
  { dist: [2.05, 1.7], yaw: [-6, -2], camY: [0.9, 0.9], targetY: [-1, -1] },
  { dist: [2.6, 2.25], yaw: [-10, -4], camY: [0.7, 0.7], targetY: [0.64, 0.66] },
  { dist: [2.6, 2.25], yaw: [10, 4], camY: [0.7, 0.7], targetY: [0.64, 0.66] },
  { dist: [2.6, 2.25], yaw: [-10, -4], camY: [0.7, 0.7], targetY: [0.64, 0.66] },
  { dist: [2.6, 2.25], yaw: [10, 4], camY: [0.7, 0.7], targetY: [0.64, 0.66] },
];

const Reveal: React.FC<{ frame: number; index: number; p: Player; H: number }> = ({ frame, index, p, H }) => {
  const start = REVEALS[index];
  const end = REVEALS[index + 1] ?? REVEALS_END;
  const local = frame - start;
  const u = local / (end - start);
  const shot = SHOTS[index];
  const e = Easing.out(Easing.quad)(Math.min(1, Math.max(0, u)));
  const faceY = p.face ? 1 - (p.face.y + p.face.h / 2) / p.height : 0.9;
  const ty = (v: number) => (v < 0 ? faceY : v) * H;
  const punch = index >= 6 ? 1 + 0.06 * Math.exp(-local / 4) : 1;
  const cam: Cam = orbit([0, 0, 0], lerp(shot.dist[0], shot.dist[1], e) / punch, lerp(shot.yaw[0], shot.yaw[1], e), lerp(shot.camY[0], shot.camY[1], e) * H, lerp(ty(shot.targetY[0]), ty(shot.targetY[1]), e), FOCAL);
  const view = makeView(cam);
  const sp = spriteAt(view, [0, 0, 0], H);
  const t = frame / FPS;
  const sil = shot.silhouette;
  const light = sil ? span(u, sil[0], sil[1], Easing.inOut(Easing.quad)) : 0.55 + 0.45 * span(local, 0, 8);
  const sweep = sil ? interpolate(u, [sil[0] - 0.05, sil[1] + 0.12], [0, 1], clamp) : interpolate(local, [2, 26], [0, 1], clamp);
  const halo = view.project([0, H * 0.62, 0.8]);
  const num = view.project([0, H * 0.6, 2.8]);
  const label = view.project([0.55, 0.05, -0.2]);
  return (
    <AbsoluteFill>
      {halo && (
        <div
          style={{
            position: "absolute",
            left: halo.x - halo.scale * 2.2,
            top: halo.y - halo.scale * 2.2,
            width: halo.scale * 4.4,
            height: halo.scale * 4.4,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(47,123,255,0.42) 0%, rgba(47,123,255,0.12) 40%, rgba(47,123,255,0) 70%)",
          }}
        />
      )}
      {num && (
        <div
          style={{
            position: "absolute",
            left: num.x - 600,
            top: num.y - num.scale * 1.1,
            width: 1200,
            textAlign: "center",
            fontFamily: HUD,
            fontWeight: 900,
            fontSize: num.scale * 2.1,
            lineHeight: 1,
            color: "rgba(47,123,255,0.07)",
            WebkitTextStroke: `${Math.max(1.5, num.scale * 0.012)}px rgba(110,190,255,${0.5 + 0.12 * Math.sin(t * 23)})`,
            opacity: span(local, 0, 10),
          }}
        >
          {String(p.number).padStart(2, "0")}
        </div>
      )}
      {sp && <Beam x={sp.x} topW={sp.h * 0.12} bottomW={sp.h * 0.95} bottomY={sp.y} opacity={0.55 * (0.4 + 0.6 * light)} />}
      <Floor view={view} court={0.4} circuits={1} pulse={Math.exp(-local / 10)} />
      <Fog
        view={view}
        t={t}
        opacity={0.8}
        spots={[
          { at: [-1.4, 0, 0.9], w: 3.4, img: 1, drift: 1 },
          { at: [1.5, 0, 1.2], w: 3.6, img: 2, drift: -1 },
          { at: [0.2, 0, 2.6], w: 5, img: 3, drift: 0.5 },
        ]}
      />
      <Ring view={view} at={[0, 0, 0]} t={t} power={span(local, 0, 10, Easing.out(Easing.cubic))} />
      {sp && <PlayerSprite p={p} x={sp.x} y={sp.y} h={sp.h} light={light} rim={sil ? 1 - light * 0.3 : 0.7} sweep={sweep} />}
      <Particles view={view} at={[0, 0, 0]} t={t} seed={index + 1} opacity={span(local, 0, 12)} />
      {label && (
        <div
          style={{
            position: "absolute",
            left: label.x,
            top: label.y - 70,
            fontFamily: HUD,
            color: COLORS.ice,
            opacity: span(local, 4, 14),
            textShadow: "0 0 12px rgba(47,123,255,0.9)",
            borderLeft: `3px solid ${COLORS.electric}`,
            paddingLeft: 14,
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: "0.12em" }}>N°{String(p.number).padStart(2, "0")}</div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.4em", opacity: 0.8 }}>BLACK U15</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scènes 3 à 5 : terrain et équipe
// Places finales : 5 devant, 5 derrière sur une marche holographique
const FRONT_X = [-2.3, -1.15, 0, 1.15, 2.3];
const BACK_X = [-2.5, -1.25, 0, 1.25, 2.5];
const STEP_Y = 0.6;
const BACK_Z = 1.0;
// Départs dispersés sur le terrain ; la caméra recule depuis le joueur du centre
const STARTS_FRONT: V3[] = [
  [-4.9, 0, -2.6],
  [-2.7, 0, -3.4],
  [0.3, 0, -3.6],
  [2.9, 0, -3.1],
  [5.0, 0, -2.2],
];
const STARTS_BACK: V3[] = [
  [-5.4, 0, 3.0],
  [-2.9, 0, 6.0],
  [0, 0, 7.4],
  [3.0, 0, 6.2],
  [5.4, 0, 3.4],
];

const FRONT_CAM = (frame: number): Cam => {
  const push = span(frame, T.freeze, T.ballHit, Easing.inOut(Easing.quad));
  return { pos: [0, 0.95, lerp(-6.0, -5.4, push)], target: [0, 1.45, 0.5], focal: FOCAL };
};

const gatherCam = (frame: number): Cam => {
  if (frame < T.gather + 60) {
    const k = span(frame, T.gather, T.gather + 60, Easing.out(Easing.cubic));
    return { pos: lerp3([0, 1.4, -6.4], [0, 5.2, -13], k), target: lerp3([0.2, 1.0, -3.6], [0, 0.2, 1], k), focal: FOCAL };
  }
  const o = span(frame, T.gather + 60, T.freeze - 60, Easing.inOut(Easing.quad));
  const orb = orbit([0, 0, 0.5], lerp(13.5, 9.5, o), lerp(0, 14, o), lerp(5.2, 3.6, o), lerp(0.2, 0.7, o), FOCAL);
  orb.target = [0, lerp(0.2, 0.7, o), lerp(1, 0.5, o)];
  if (frame < T.freeze - 60) return orb;
  const k = span(frame, T.freeze - 60, T.freeze, Easing.inOut(Easing.cubic));
  const f = FRONT_CAM(T.freeze);
  return { pos: lerp3(orb.pos, f.pos, k), target: lerp3(orb.target, f.target, k), focal: FOCAL };
};

const TeamStage: React.FC<{ frame: number; players: Player[]; heights: Map<number, number> }> = ({ frame, players, heights }) => {
  const t = frame / FPS;
  const inGather = frame < T.freeze;
  const cam = inGather ? gatherCam(frame) : FRONT_CAM(frame);
  const view = makeView(cam);
  const lit = span(frame, T.flash, T.flash + 12, Easing.out(Easing.cubic));

  // 5 plus grands derrière ; chaque rangée, la plus grande taille au centre
  const byHeight = [...players].sort((a, b) => (heights.get(a.number) ?? 0) - (heights.get(b.number) ?? 0));
  const centerOut = (list: Player[]) => {
    const order = [2, 1, 3, 0, 4];
    const out: Player[] = new Array(list.length);
    [...list].reverse().forEach((p, i) => (out[order[i]] = p));
    return out;
  };
  const front = centerOut(byHeight.slice(0, 5));
  const back = centerOut(byHeight.slice(5));
  const slots = [
    ...front.map((p, i) => ({ p, slot: [FRONT_X[i], 0, 0] as V3, start: [...STARTS_FRONT].sort((a, b) => a[0] - b[0])[i], row: 0, i })),
    ...back.map((p, i) => ({ p, slot: [BACK_X[i], STEP_Y, BACK_Z] as V3, start: [...STARTS_BACK].sort((a, b) => a[0] - b[0])[i], row: 1, i })),
  ];

  const people = slots.map(({ p, slot, start, row, i }, n) => {
    const H = heights.get(p.number) ?? 1.6;
    const q = span(frame, T.gather + 70 + n * 7, T.freeze - 70 + n * 3, Easing.inOut(Easing.quad));
    const walking = q > 0 && q < 1;
    const phase = t * Math.PI * 2 * 1.85 + n * 1.3;
    const pos = lerp3(start, [slot[0], 0, slot[2]], q);
    // les joueurs du fond montent sur la marche à la fin du trajet
    pos[1] = slot[1] * span(q, 0.82, 1) + (walking ? 0.035 * Math.abs(Math.sin(phase)) : 0);
    pos[0] += walking ? 0.012 * Math.sin(phase / 2) : 0;
    const reveal = span(frame, T.gather + 4 + n * 3, T.gather + 26 + n * 3, Easing.out(Easing.quad));
    return { p, H, pos, reveal, row, i, n };
  });
  const sprites = people
    .map((o) => ({ ...o, sp: spriteAt(view, o.pos, o.H) }))
    .filter((o) => o.sp)
    .sort((a, b) => (b.sp?.depth ?? 0) - (a.sp?.depth ?? 0));

  const lines = inGather ? span(frame, T.gather + 10, T.gather + 40) * (1 - span(frame, T.freeze - 90, T.freeze - 40)) : 0;
  const stepUp = span(frame, T.freeze - 120, T.freeze - 50, Easing.out(Easing.cubic));
  const stepPts: V3[][] = [
    [
      [-3.2, STEP_Y * stepUp, BACK_Z - 0.32],
      [3.2, STEP_Y * stepUp, BACK_Z - 0.32],
    ],
    [
      [-3.2, 0, BACK_Z - 0.32],
      [-3.2, STEP_Y * stepUp, BACK_Z - 0.32],
    ],
    [
      [3.2, 0, BACK_Z - 0.32],
      [3.2, STEP_Y * stepUp, BACK_Z - 0.32],
    ],
  ];
  const stepFace = view.path([
    [-3.2, 0, BACK_Z - 0.32],
    [3.2, 0, BACK_Z - 0.32],
    [3.2, STEP_Y * stepUp, BACK_Z - 0.32],
    [-3.2, STEP_Y * stepUp, BACK_Z - 0.32],
  ]);
  const titleIn = span(frame, T.flash, T.flash + 14, Easing.out(Easing.back(1.4)));
  const fogSpots = Array.from({ length: 16 }, (_, i) => ({
    at: [((i * 37) % 13) - 6.5, 0, ((i * 53) % 24) - 11] as V3,
    w: 5 + (i % 3) * 1.5,
    img: (i % 3) + 1,
    drift: i % 2 ? 1 : -1,
  }));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 55% at 50% 40%, rgba(30,70,160,${0.25 + 0.35 * lit}), rgba(0,0,0,0) 70%)` }} />
      {/* projecteurs au plafond après le flash */}
      {[-0.42, -0.2, 0, 0.2, 0.42].map((dx, i) => (
        <Beam key={i} x={WIDTH / 2 + dx * WIDTH} topW={50} bottomW={520} bottomY={HEIGHT * 0.95} opacity={(inGather ? 0.18 * (i % 2) : 0.15) + 0.4 * lit} color={i % 2 ? "120,90,255" : "90,160,255"} />
      ))}
      {!inGather && (
        <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", opacity: titleIn, transform: `scale(${lerp(1.25, 1, titleIn)})` }}>
          <MetalText text={TITLE} size={196} glow={0.7 + 0.3 * Math.sin(t * 11)} sweep={interpolate(frame, [T.flash + 30, T.flash + 90], [0, 1], clamp)} />
        </div>
      )}
      {!inGather && <Arcs x={180} y={70} w={1560} h={200} frame={frame} opacity={titleIn * (0.35 + 0.65 * Math.exp(-(frame - T.flash) / 30))} />}
      <Floor
        view={view}
        court={inGather ? 0.55 : 0.45 + 0.55 * lit}
        circuits={1}
        pulse={lit}
        extra={
          <>
            {people.map((o) => (
              <path
                key={o.n}
                d={view.path([o.pos, [0, 0, 0]])}
                stroke={o.n % 3 ? COLORS.electric : COLORS.violet}
                strokeWidth={2.4}
                strokeDasharray="18 14"
                strokeDashoffset={-frame * 3}
                fill="none"
                opacity={lines * 0.9}
              />
            ))}
            {stepUp > 0 && (
              <>
                <path d={stepFace} fill="rgba(8,18,45,0.85)" />
                {stepPts.map((l, i) => (
                  <GlowPath key={i} d={view.path(l)} width={2} opacity={stepUp} />
                ))}
              </>
            )}
          </>
        }
      />
      <Fog view={view} t={t} opacity={inGather ? 0.9 : 0.7} spots={fogSpots} />
      {sprites.map(({ p, sp, reveal, n, pos, row }) =>
        sp ? (
          <React.Fragment key={p.number}>
            <Ring view={view} at={[pos[0], row && !inGather ? STEP_Y : 0, pos[2]]} t={t + n} power={(inGather ? 0.7 : 0.5 + 0.5 * lit) * reveal} />
            <PlayerSprite p={p} x={sp.x} y={sp.y} h={sp.h} light={inGather ? 0.7 : 0.38 + 0.62 * lit} rim={inGather ? 1 : 1 - 0.35 * lit} reveal={reveal} />
          </React.Fragment>
        ) : null,
      )}
      <Particles view={view} at={[0, 0, 0.5]} t={t} count={70} radius={6} opacity={0.6 + 0.4 * lit} seed={42} />
    </AbsoluteFill>
  );
};

// Ballon qui rebondit puis fonce vers l'objectif
const BallShot: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < T.ballLaunch - 30) return null;
  const cam = FRONT_CAM(frame);
  const view = makeView(cam);
  const R = 0.12;
  const bounceAt: V3 = [0.2, R, -2.6];
  let pos: V3;
  if (frame < T.ballLaunch) {
    const k = span(frame, T.ballLaunch - 30, T.ballLaunch, Easing.in(Easing.quad));
    pos = lerp3([0.45, 4.4, -2.0], bounceAt, k);
  } else {
    const fwd: V3 = [cam.target[0] - cam.pos[0], cam.target[1] - cam.pos[1], cam.target[2] - cam.pos[2]];
    const l = Math.hypot(...fwd);
    const endPos: V3 = [cam.pos[0] + (fwd[0] / l) * 0.13, cam.pos[1] + (fwd[1] / l) * 0.13, cam.pos[2] + (fwd[2] / l) * 0.13];
    const s = span(frame, T.ballLaunch, T.ballHit, Easing.in(Easing.cubic));
    const p1: V3 = [0.1, 1.7, -4.2];
    const p2: V3 = [endPos[0], endPos[1] + 0.2, endPos[2] + 1.2];
    const b = (a: number, b1: number, c: number, d: number) =>
      (1 - s) ** 3 * a + 3 * (1 - s) ** 2 * s * b1 + 3 * (1 - s) * s * s * c + s ** 3 * d;
    pos = [b(bounceAt[0], p1[0], p2[0], endPos[0]), b(bounceAt[1], p1[1], p2[1], endPos[1]), b(bounceAt[2], p1[2], p2[2], endPos[2])];
  }
  const sp = view.project(pos);
  if (!sp) return null;
  return <Basketball cx={sp.x} cy={sp.y} r={R * sp.scale} rot={frame * 0.11} />;
};

// ---------------------------------------------------------------- composition
const flashAt = (frame: number) => {
  let a = 0;
  const pulse = (at: number, peak: number, decay: number) => {
    const d = frame - at;
    if (d >= -3 && d < decay * 5) a = Math.max(a, peak * (d < 0 ? 1 + d / 3 : Math.exp(-d / decay)));
  };
  REVEALS.forEach((r, i) => pulse(r, i === 0 ? 0.85 : 0.55, 4));
  pulse(T.gather, 0.75, 5);
  pulse(T.flash, 1, 8);
  if (frame >= T.ballHit - 8) a = Math.max(a, span(frame, T.ballHit - 8, T.ballHit, Easing.in(Easing.quad)));
  return a;
};

const shake = (frame: number) => {
  let x = 0;
  let y = 0;
  for (const h of HITS) {
    const d = frame - h;
    if (d >= 0 && d < 24) {
      const a = 16 * Math.exp(-d / 5);
      x += a * Math.sin(d * 1.9 + h);
      y += a * Math.cos(d * 2.3 + h);
    }
  }
  return `translate(${x}px, ${y}px)`;
};

export const BlackU15Intro: React.FC<BU15Props> = ({ players }) => {
  useFonts();
  const frame = useCurrentFrame();
  const heights = worldHeights(players);
  const order = [...players].sort((a, b) => a.number - b.number);
  const revealIndex = REVEALS.findIndex((r, i) => frame >= r && frame < (REVEALS[i + 1] ?? REVEALS_END));
  const letterbox = 1 - span(frame, T.flash, T.flash + 14, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{ background: COLORS.black, fontFamily: DISPLAY }}>
      <Html5Audio src={staticFile("black-u15/audio.wav")} />
      <AbsoluteFill style={{ transform: shake(frame) }}>
        {frame < T.players && <Activation frame={frame} />}
        {revealIndex >= 0 && order[revealIndex] && (
          <Reveal frame={frame} index={revealIndex} p={order[revealIndex]} H={heights.get(order[revealIndex].number) ?? 1.6} />
        )}
        {frame >= T.gather && players.length === 10 && <TeamStage frame={frame} players={players} heights={heights} />}
        <BallShot frame={frame} />
      </AbsoluteFill>
      <Vignette strength={0.8 - 0.25 * span(frame, T.flash, T.flash + 20)} />
      <Grain frame={frame} />
      <Letterbox amount={letterbox} />
      <Flash amount={flashAt(frame)} />
    </AbsoluteFill>
  );
};
