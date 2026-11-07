// Minutage du chapitre 1.1 : tout est calé sur la voix off (src/reseau/voice.ts, généré).
import { createTiming } from "../components/voiceTiming";
import { VOICE } from "./voice";

export const FPS = 25;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const { DURATION, SEQS, cueSec, timing } = createTiming(VOICE, FPS);
