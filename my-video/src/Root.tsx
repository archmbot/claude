import "./index.css";
import { Composition } from "remotion";
import { DemoVideo, DURATION, FPS, HEIGHT, WIDTH } from "./Composition";
import { QylineAd } from "./qyline/Ad";
import {
  DURATION as AD_DURATION,
  FPS as AD_FPS,
  HEIGHT as AD_HEIGHT,
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
