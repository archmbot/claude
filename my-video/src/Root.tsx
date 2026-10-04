import "./index.css";
import { Composition } from "remotion";
import { DemoVideo, DURATION, FPS, HEIGHT, WIDTH } from "./Composition";
import { BlackU15Intro, calculateBU15Metadata } from "./black-u15/Intro";
import { DURATION as BU15_DURATION, FPS as BU15_FPS, HEIGHT as BU15_HEIGHT, WIDTH as BU15_WIDTH } from "./black-u15/timeline";
import { QylineAd } from "./qyline/Ad";
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
