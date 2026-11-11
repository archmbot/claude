import "./index.css";
import { Composition } from "remotion";
import { DemoVideo, DURATION, FPS, HEIGHT, WIDTH } from "./demo/DemoVideo";
import { BlackU15Intro, calculateBU15Metadata } from "./black-u15/Intro";
import { DURATION as BU15_DURATION, FPS as BU15_FPS, HEIGHT as BU15_HEIGHT, WIDTH as BU15_WIDTH } from "./black-u15/timeline";
import { QylineChoix } from "./Composition";
import { Reseau11 } from "./reseau/Video";
import { NasCout } from "./nas/Video";
import { StokaraTuto } from "./stokara/Video";
import { StokaraPub } from "./stokara-pub/Video";
import { StokaraProgramme } from "./stokara-prog/Video";
import { StokaraEquipe } from "./stokara-team/Video";
import { StokaraSecurite } from "./stokara-secu/Video";
import { DURATION as SECU_DURATION, FPS as SECU_FPS, HEIGHT as SECU_HEIGHT, WIDTH as SECU_WIDTH } from "./stokara-secu/timing";
import { DURATION as TEAM_DURATION, FPS as TEAM_FPS, HEIGHT as TEAM_HEIGHT, WIDTH as TEAM_WIDTH } from "./stokara-team/timing";
import { DURATION as PROG_DURATION, FPS as PROG_FPS, HEIGHT as PROG_HEIGHT, WIDTH as PROG_WIDTH } from "./stokara-prog/timing";
import { DURATION as PUB_DURATION, FPS as PUB_FPS, HEIGHT as PUB_HEIGHT, WIDTH as PUB_WIDTH } from "./stokara-pub/timing";
import { DURATION as STK_DURATION, FPS as STK_FPS, HEIGHT as STK_HEIGHT, WIDTH as STK_WIDTH } from "./stokara/timing";
import { DURATION as NAS_DURATION, FPS as NAS_FPS, HEIGHT as NAS_HEIGHT, WIDTH as NAS_WIDTH } from "./nas/timing";
import { DURATION as NET_DURATION, FPS as NET_FPS, HEIGHT as NET_HEIGHT, WIDTH as NET_WIDTH } from "./reseau/timing";
import { DURATION as CHOIX_DURATION, FPS as CHOIX_FPS, HEIGHT as CHOIX_HEIGHT, WIDTH as CHOIX_WIDTH } from "./timeline";
import { QylineAd } from "./qyline/Ad";
import { QylineLegal } from "./qyline-legal/Video";
import { DURATION as LEGAL_DURATION, FPS as LEGAL_FPS, HEIGHT as LEGAL_HEIGHT, WIDTH as LEGAL_WIDTH } from "./qyline-legal/timeline";
import { QylineAdVertical } from "./qyline/AdVertical";
import {
  DURATION as AD_DURATION,
  FPS as AD_FPS,
  HEIGHT as AD_HEIGHT,
  MOBILE_HEIGHT,
  MOBILE_WIDTH,
  WIDTH as AD_WIDTH,
} from "./qyline/data";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StokaraSecurite"
        component={StokaraSecurite}
        durationInFrames={SECU_DURATION}
        fps={SECU_FPS}
        width={SECU_WIDTH}
        height={SECU_HEIGHT}
        defaultProps={{ subtitles: true }}
      />
      <Composition
        id="StokaraEquipe"
        component={StokaraEquipe}
        durationInFrames={TEAM_DURATION}
        fps={TEAM_FPS}
        width={TEAM_WIDTH}
        height={TEAM_HEIGHT}
        defaultProps={{ subtitles: true }}
      />
      <Composition
        id="StokaraProgramme"
        component={StokaraProgramme}
        durationInFrames={PROG_DURATION}
        fps={PROG_FPS}
        width={PROG_WIDTH}
        height={PROG_HEIGHT}
        defaultProps={{ subtitles: true }}
      />
      <Composition
        id="StokaraPub"
        component={StokaraPub}
        durationInFrames={PUB_DURATION}
        fps={PUB_FPS}
        width={PUB_WIDTH}
        height={PUB_HEIGHT}
        defaultProps={{ subtitles: true }}
      />
      <Composition
        id="StokaraTuto"
        component={StokaraTuto}
        durationInFrames={STK_DURATION}
        fps={STK_FPS}
        width={STK_WIDTH}
        height={STK_HEIGHT}
        defaultProps={{ subtitles: true }}
      />
      <Composition
        id="NasCout"
        component={NasCout}
        durationInFrames={NAS_DURATION}
        fps={NAS_FPS}
        width={NAS_WIDTH}
        height={NAS_HEIGHT}
        defaultProps={{ subtitles: true }}
      />
      <Composition
        id="Reseau11"
        component={Reseau11}
        durationInFrames={NET_DURATION}
        fps={NET_FPS}
        width={NET_WIDTH}
        height={NET_HEIGHT}
        defaultProps={{ subtitles: true }}
      />
      <Composition
        id="QylineChoix"
        component={QylineChoix}
        durationInFrames={CHOIX_DURATION}
        fps={CHOIX_FPS}
        width={CHOIX_WIDTH}
        height={CHOIX_HEIGHT}
      />
      <Composition
        id="QylineAd"
        component={QylineAd}
        durationInFrames={AD_DURATION}
        fps={AD_FPS}
        width={AD_WIDTH}
        height={AD_HEIGHT}
      />
      <Composition
        id="QylineAdVertical"
        component={QylineAdVertical}
        durationInFrames={AD_DURATION}
        fps={AD_FPS}
        width={MOBILE_WIDTH}
        height={MOBILE_HEIGHT}
      />
      <Composition
        id="QylineLegal"
        component={QylineLegal}
        durationInFrames={LEGAL_DURATION}
        fps={LEGAL_FPS}
        width={LEGAL_WIDTH}
        height={LEGAL_HEIGHT}
      />
      <Composition
        id="BlackU15Intro"
        component={BlackU15Intro}
        durationInFrames={BU15_DURATION}
        fps={BU15_FPS}
        width={BU15_WIDTH}
        height={BU15_HEIGHT}
        defaultProps={{ players: [] }}
        calculateMetadata={calculateBU15Metadata}
      />
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
