/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { existsSync, readdirSync } from 'node:fs';
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");

// Sandboxed environments without access to remotion.media: reuse a local headless shell
// (Playwright install, whatever its version and directory layout).
const browsers = "/opt/pw-browsers";
const localShell = existsSync(browsers)
  ? readdirSync(browsers)
      .filter((d) => d.startsWith("chromium_headless_shell-"))
      .sort()
      .reverse()
      .flatMap((d) => [`${browsers}/${d}/chrome-linux/headless_shell`, `${browsers}/${d}/chrome-headless-shell-linux64/chrome-headless-shell`])
      .find((p) => existsSync(p))
  : undefined;
if (localShell) {
  Config.setBrowserExecutable(localShell);
}
