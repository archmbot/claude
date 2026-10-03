import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FPS = 30;
export const DURATION = 300;
export const WIDTH = 1920;
export const HEIGHT = 1080;

const FONT =
  'Inter, "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, DURATION], [120, 240]);
  const orbs = [
    { x: 300, y: 250, r: 420, c: "#7c3aed", s: 0.9 },
    { x: 1500, y: 800, r: 520, c: "#06b6d4", s: 0.6 },
    { x: 1000, y: 150, r: 300, c: "#ec4899", s: 1.2 },
  ];
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, #0b1020 0%, #151a3a 55%, #0b1020 100%)`,
        overflow: "hidden",
      }}
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: o.x + Math.sin((frame / 40) * o.s + i) * 80 - o.r / 2,
            top: o.y + Math.cos((frame / 50) * o.s + i) * 60 - o.r / 2,
            width: o.r,
            height: o.r,
            borderRadius: "50%",
            background: o.c,
            filter: "blur(120px)",
            opacity: 0.35,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = ["Create", "stunning", "videos", "with", "React"];
  const sub = spring({ frame: frame - 45, fps, config: { damping: 200 } });
  const exit = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT,
        opacity: exit,
        transform: `scale(${interpolate(exit, [0, 1], [1.08, 1])})`,
      }}
    >
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center", maxWidth: 1500 }}>
        {words.map((w, i) => {
          const p = spring({ frame: frame - i * 6, fps, config: { damping: 14, stiffness: 120 } });
          return (
            <span
              key={w}
              style={{
                fontSize: 140,
                fontWeight: 800,
                color: i === 4 ? "#67e8f9" : "white",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [70, 0])}px)`,
                display: "inline-block",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 48,
          color: "#c7d2fe",
          opacity: sub,
          letterSpacing: 6,
          textTransform: "uppercase",
          transform: `translateY(${interpolate(sub, [0, 1], [30, 0])}px)`,
        }}
      >
        Programmatic motion design
      </div>
    </AbsoluteFill>
  );
};

const FEATURES = [
  { icon: "⚡", title: "Fast", text: "Rendu parallèle sur tous vos cœurs", color: "#facc15" },
  { icon: "🎨", title: "Expressif", text: "Animations pilotées par ressorts", color: "#f472b6" },
  { icon: "🚀", title: "Exportable", text: "MP4, GIF, WebM en une commande", color: "#34d399" },
];

const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heading = spring({ frame, fps, config: { damping: 200 } });
  const exit = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center", justifyContent: "center", opacity: exit }}>
      <div
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: "white",
          marginBottom: 80,
          opacity: heading,
          transform: `translateY(${interpolate(heading, [0, 1], [-40, 0])}px)`,
        }}
      >
        Pourquoi Remotion ?
      </div>
      <div style={{ display: "flex", gap: 60 }}>
        {FEATURES.map((f, i) => {
          const p = spring({ frame: frame - 15 - i * 10, fps, config: { damping: 12, stiffness: 100 } });
          const float = Math.sin((frame + i * 20) / 18) * 8;
          return (
            <div
              key={f.title}
              style={{
                width: 480,
                padding: 50,
                borderRadius: 36,
                background: "rgba(255,255,255,0.08)",
                border: `2px solid ${f.color}55`,
                boxShadow: `0 30px 80px ${f.color}22`,
                backdropFilter: "blur(10px)",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [120, 0]) + float}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`,
              }}
            >
              <div style={{ fontSize: 96 }}>{f.icon}</div>
              <div style={{ fontSize: 56, fontWeight: 700, color: f.color, marginTop: 20 }}>{f.title}</div>
              <div style={{ fontSize: 34, color: "#e2e8f0", marginTop: 14, lineHeight: 1.4 }}>{f.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 90 } });
  const ring = interpolate(frame, [0, 60], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const fade = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const R = 150;
  const C = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center", justifyContent: "center", opacity: fade }}>
      <svg width={340} height={340} style={{ transform: `scale(${pop})` }}>
        <circle cx={170} cy={170} r={R} fill="none" stroke="#ffffff22" strokeWidth={14} />
        <circle
          cx={170}
          cy={170}
          r={R}
          fill="none"
          stroke="#67e8f9"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ring)}
          transform="rotate(-90 170 170)"
        />
        <polygon points="140,110 140,230 240,170" fill="white" />
      </svg>
      <div
        style={{
          marginTop: 50,
          fontSize: 100,
          fontWeight: 800,
          color: "white",
          opacity: pop,
          transform: `translateY(${interpolate(pop, [0, 1], [40, 0])}px)`,
        }}
      >
        Votre vidéo, en code.
      </div>
      <div style={{ marginTop: 20, fontSize: 40, color: "#a5b4fc", opacity: interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        npx remotion render
      </div>
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 8,
        width: `${(frame / (DURATION - 1)) * 100}%`,
        background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
      }}
    />
  );
};

export const DemoVideo: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Sequence durationInFrames={90} premountFor={FPS}>
      <Title />
    </Sequence>
    <Sequence from={90} durationInFrames={120} premountFor={FPS}>
      <Features />
    </Sequence>
    <Sequence from={210} durationInFrames={90} premountFor={FPS}>
      <Outro />
    </Sequence>
    <ProgressBar />
  </AbsoluteFill>
);
