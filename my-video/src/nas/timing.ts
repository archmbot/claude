// Minutage de « Pourquoi l'informatique coûte-t-elle si cher ? » : calé sur la voix off (src/nas/voice.ts).
import { createTiming } from "../components/voiceTiming";
import { VOICE } from "./voice";

export const FPS = 25;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const { DURATION, SEQS, timing } = createTiming(VOICE, FPS);
