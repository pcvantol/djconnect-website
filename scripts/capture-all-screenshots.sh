#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="${SOURCE_DIR:-wwwroot}"
OUTPUT_DIR="${SCREENSHOT_OUTPUT_DIR:-screenshots/all-pages}"
HOST="${SCREENSHOT_HOST:-127.0.0.1}"
PORT="${SCREENSHOT_PORT:-4176}"
BASE_URL="http://${HOST}:${PORT}"
WIDTH="${SCREENSHOT_WIDTH:-1440}"
HEIGHT="${SCREENSHOT_HEIGHT:-900}"
INCLUDE_404="${INCLUDE_404_SCREENSHOT:-0}"

cd "$ROOT_DIR"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Missing source directory: $SOURCE_DIR" >&2
  exit 1
fi

echo "Cleaning old screenshots in $OUTPUT_DIR..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

echo "Starting local static server at $BASE_URL..."
python3 -m http.server "$PORT" --bind "$HOST" --directory "$SOURCE_DIR" >/tmp/djconnect-screenshots-server.log 2>&1 &
SERVER_PID="$!"

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in {1..50}; do
  if curl -fsS "$BASE_URL/" >/dev/null 2>&1; then
    break
  fi
  sleep 0.1
done

if ! curl -fsS "$BASE_URL/" >/dev/null 2>&1; then
  echo "Local screenshot server did not start. Log:" >&2
  cat /tmp/djconnect-screenshots-server.log >&2
  exit 1
fi

SCREENSHOT_BASE_URL="$BASE_URL" \
SCREENSHOT_OUTPUT_DIR="$OUTPUT_DIR" \
SCREENSHOT_WIDTH="$WIDTH" \
SCREENSHOT_HEIGHT="$HEIGHT" \
INCLUDE_404_SCREENSHOT="$INCLUDE_404" \
node --input-type=module <<'NODE'
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { publicPages, supportedLanguages, defaultLanguage } from "./scripts/site-config.mjs";

const baseURL = process.env.SCREENSHOT_BASE_URL;
const outputDir = process.env.SCREENSHOT_OUTPUT_DIR;
const viewport = {
  width: Number(process.env.SCREENSHOT_WIDTH || 1440),
  height: Number(process.env.SCREENSHOT_HEIGHT || 900)
};
const include404 = process.env.INCLUDE_404_SCREENSHOT === "1";
const pages = include404 ? publicPages : publicPages.filter((page) => page !== "404");
const allowedUntranslatedKeys = new Set([
  "legalSpotify",
  "navAskDj",
  "askDjTitle",
  "askDjAnalysisTitle",
  "liveAnalysisTitle",
  "trackAnalysisTitle",
  "vibecastTitle",
  "navMacos",
  "navHardware",
  "macCatalystTag",
  "iosTag",
  "iosBadge",
  "macBadge",
  "espBadge",
  "raspberryTitle",
  "raspberryTag",
  "voiceAssistantTag",
  "assistTitle",
  "djTitle",
  "hubTitle",
  "hardwareBundleTitle"
]);
const allowedUntranslatedValues = new Set([
  "Ask DJ",
  "Track Insight",
  "VibeCast",
  "Music DNA",
  "Home Assistant",
  "macOS",
  "iOS",
  "ESP32",
  "Raspberry Pi",
  "Mac Catalyst",
  "DJConnect Mac Catalyst",
  "Contract",
  "Contextual",
  "Neutral",
  "Support",
  "Privacy Policy",
  "Spotify is a trademark of Spotify AB. DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB."
]);

const routeFor = (page, language) => {
  const fileName = page === "index" ? "index.html" : `${page}.html`;
  if (language === defaultLanguage) return `/${fileName}`;
  return `/${language}/${fileName}`;
};

const safeName = (page) => page.replace(/[^a-z0-9-]/gi, "-");

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const captured = [];

try {
  for (const language of supportedLanguages) {
    const context = await browser.newContext({
      viewport,
      locale: `${language}-${language.toUpperCase()}`,
      colorScheme: "dark",
      reducedMotion: "reduce"
    });
    const page = await context.newPage();

    for (const [pageIndex, pageName] of pages.entries()) {
      const route = routeFor(pageName, language);
      const url = new URL(route, baseURL).toString();

      await page.addInitScript((lang) => {
        localStorage.setItem("djconnect-language", lang);
      }, language);
      const response = await page.goto(url, { waitUntil: "networkidle" });
      if (!response || !response.ok()) {
        throw new Error(`${route} returned HTTP ${response?.status() || "no response"}`);
      }

      const actualLanguage = await page.locator("html").getAttribute("lang");
      if (actualLanguage !== language) {
        throw new Error(`${route} rendered lang="${actualLanguage}", expected "${language}"`);
      }
      const bodyText = await page.locator("body").innerText();
      if (pageName !== "404" && /404|page not found|pagina niet gevonden|seite nicht gefunden|page introuvable|pagina no encontrada/i.test(bodyText)) {
        throw new Error(`${route} rendered page-not-found copy unexpectedly`);
      }
      if (language !== "en") {
        const untranslatedKeys = await page.evaluate(({ pageName, language, allowedKeys, allowedValues }) => {
          const translations = window.DJCONNECT_PAGE_TRANSLATIONS?.[pageName];
          if (!translations?.en || !translations?.[language]) return [];
          const allowedKeySet = new Set(allowedKeys);
          const allowedValueSet = new Set(allowedValues);
          return Array.from(document.querySelectorAll("[data-i18n]"))
            .map((element) => element.getAttribute("data-i18n"))
            .filter(Boolean)
            .filter((key, index, keys) => keys.indexOf(key) === index)
            .filter((key) => {
              const english = translations.en[key];
              const localized = translations[language][key];
              if (typeof english !== "string" || typeof localized !== "string") return false;
              if (english.length <= 4 || english !== localized) return false;
              return !allowedKeySet.has(key) && !allowedValueSet.has(english);
            });
        }, {
          pageName,
          language,
          allowedKeys: Array.from(allowedUntranslatedKeys),
          allowedValues: Array.from(allowedUntranslatedValues)
        });
        if (untranslatedKeys.length) {
          throw new Error(`${route} has untranslated ${language} copy: ${untranslatedKeys.join(", ")}`);
        }
      }

      const fileName = `${language}-${String(pageIndex + 1).padStart(2, "0")}-${safeName(pageName)}-${viewport.width}x${viewport.height}.png`;
      const filePath = path.join(outputDir, fileName);
      await page.screenshot({ path: filePath, fullPage: true });
      captured.push({ language, page: pageName, route, url, file: fileName });
      console.log(`Captured ${fileName}`);
    }

    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(outputDir, "manifest.json"),
  JSON.stringify({
    baseURL,
    viewport,
    languages: supportedLanguages,
    pages,
    include404,
    capturedAt: new Date().toISOString(),
    count: captured.length,
    screenshots: captured
  }, null, 2)
);
NODE

echo "Screenshots written to $OUTPUT_DIR"
