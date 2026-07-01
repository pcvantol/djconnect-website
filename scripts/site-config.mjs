import { readFile } from "node:fs/promises";

export const sourceDir = "wwwroot";
export const releaseOutputDir = "dist/wwwroot";

export const sharedReleaseAssets = [
  "assets/i18n.js",
  "assets/site-nav.css",
  "assets/site-nav.js",
  "assets/downloads.css",
  "assets/downloads.js",
  "assets/admin.css",
  "assets/admin.js",
  "assets/releases.css",
  "assets/releases.js",
  "assets/voice-intents.js"
];

export const publicPages = [
  "index",
  "start",
  "features",
  "platform",
  "voice-commands",
  "voice-assistant",
  "blog",
  "blog-djconnect-project",
  "support",
  "privacy",
  "troubleshooting",
  "ios",
  "testflight",
  "testflight-macos",
  "macos",
  "windows",
  "maccatalyst",
  "raspberry-pi",
  "embedded",
  "404"
];

export const supportedLanguages = ["en", "nl", "de", "fr", "es"];

export const defaultLanguage = "nl";

export const readSiteVersion = async () => (
  await readFile("VERSION", "utf8")
).trim();
