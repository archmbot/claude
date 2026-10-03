import "./index.css";
import { Composition } from "remotion";
import { DemoVideo, DURATION, FPS, HEIGHT, WIDTH } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DemoVideo"
      component={DemoVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
