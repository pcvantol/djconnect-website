import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const extractDataKeys = (html) => {
  const keys = new Set();
  for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) {
    keys.add(match[1]);
  }
  for (const match of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const mapping of match[1].split(",")) {
      const [, key] = mapping.split(":").map((part) => part.trim());
      if (key) keys.add(key);
    }
  }
  return [...keys].sort();
};

const extractTranslationBlock = (html, language) => {
  const marker = `${language}: {`;
  const start = html.indexOf(marker);
  assert.notEqual(start, -1, `Missing ${language} translation block`);

  let depth = 0;
  let blockStart = html.indexOf("{", start);
  for (let index = blockStart; index < html.length; index += 1) {
    const char = html[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return html.slice(blockStart, index + 1);
  }
  throw new Error(`Could not parse ${language} translation block`);
};

const assertTranslationsCoverPage = (html, pageName) => {
  const keys = extractDataKeys(html);
  assert.ok(keys.length > 0, `${pageName} should have translatable text keys`);

  for (const language of ["nl", "en"]) {
    const block = extractTranslationBlock(html, language);
    for (const key of ["title", "metaDescription", ...keys]) {
      assert.match(block, new RegExp(`${key}:`), `${pageName} ${language} missing ${key}`);
    }
  }
};

test("site version is consistent", async () => {
  const [version, packageJson, index, embedded] = await Promise.all([
    read("VERSION"),
    read("package.json"),
    read("wwwroot/index.html"),
    read("wwwroot/embedded.html")
  ]);

  const cleanVersion = version.trim();
  assert.equal(cleanVersion, "3.1.1");
  assert.equal(JSON.parse(packageJson).version, cleanVersion);
  assert.match(index, new RegExp(`DJConnect website v${cleanVersion}`));
  assert.match(embedded, new RegExp(`DJConnect website v${cleanVersion}`));
});

test("homepage has platform routes and app store placeholders", async () => {
  const index = await read("wwwroot/index.html");
  assert.match(index, /href="start\.html"/);
  assert.match(index, /href="embedded\.html"/);
  assert.match(index, /href="macos\.html"/);
  assert.match(index, /href="ios\.html"/);
  assert.match(index, /data-store-link="macos"/);
  assert.match(index, /data-store-link="ios"/);
  assert.match(index, /Mac App Store/);
  assert.match(index, /App Store/);
  assert.match(index, /brands\.home-assistant\.io\/_\/homeassistant\/icon\.png/);
  assert.match(index, /Account token & koppelgegevens worden veilig bewaard in versleutelde opslag/);
  assert.match(index, /1 hub, meerdere schermen/);
});

test("homepage hero uses the current device visual and copy", async () => {
  const index = await read("wwwroot/index.html");
  assert.match(index, /device-stack/);
  assert.match(index, /device-slide-mac/);
  assert.match(index, /device-slide-ios/);
  assert.match(index, /device-slide-embedded/);
  assert.match(index, /class="macbook"/);
  assert.match(index, /class="ipad"/);
  assert.match(index, /class="iphone"/);
  assert.match(index, /play-icon/);
  assert.match(index, /radio-mic-icon/);
  assert.match(index, /Speel, Vraag aan, Ontvang Persoonlijke DJ aankondiging/);
  assert.doesNotMatch(index, /DJConnect Studio/);
  assert.doesNotMatch(index, /Queue, output en DJ-reactie/);
});

test("how-to-start page covers setup flow", async () => {
  const start = await read("wwwroot/start.html");
  assert.match(start, /DJConnect\. Jouw persoonlijke muziek DJ\./);
  assert.match(start, /Vraag muziek\. Krijg persoonlijk aangekondigd\./);
  assert.match(start, /Home Assistant installatie/);
  assert.match(start, /Home Assistant Community Store/);
  assert.match(start, /https:\/\/my\.home-assistant\.io\/redirect\/hacs_repository/);
  assert.match(start, /Koppel Spotify/);
  assert.match(start, /Configureer Home Assistant Assist/);
  assert.match(start, /Koppel je DJConnect device of app/);
  assert.match(start, /Geen Spotify playback/);
  assert.match(start, /Spotify is a trademark of Spotify AB/);
});

test("app subpages contain live GitHub release embeds", async () => {
  for (const page of ["macos", "ios", "embedded"]) {
    const html = await read(`wwwroot/${page}.html`);
    assert.match(html, /data-github-releases/, `${page} page needs release embed`);
    assert.match(html, /data-github-owner="pcvantol"/, `${page} page needs GitHub owner`);
    assert.match(html, /data-github-repo="djconnect-website"/, `${page} page needs GitHub repo`);
    assert.match(html, /assets\/releases\.js/, `${page} page needs release script`);
  }
});

test("macOS download page shows public binary release repo", async () => {
  const [macos, downloads] = await Promise.all([
    read("wwwroot/macos.html"),
    read("wwwroot/macos-download.html")
  ]);

  assert.match(macos, /href="macos-download\.html"/);
  assert.match(downloads, /data-github-downloads/);
  assert.match(downloads, /data-github-owner="pcvantol"/);
  assert.match(downloads, /data-github-repo="djconnect-app-releases"/);
  assert.match(downloads, /assets\/downloads\.js/);
});

test("release proxy function is present", async () => {
  const proxy = await read("functions/api/releases.js");
  assert.match(proxy, /env\.GITHUB_TOKEN/);
  assert.match(proxy, /api\.github\.com\/repos/);
});

test("embedded page links back to platform homepage", async () => {
  const embedded = await read("wwwroot/embedded.html");
  assert.match(embedded, /href="index\.html"/);
  assert.match(embedded, /DJConnect op ESP32|DJConnect on ESP32/);
});

test("embedded page lists supported hardware", async () => {
  const embedded = await read("wwwroot/embedded.html");
  assert.match(embedded, /Ondersteunde hardware/);
  assert.match(embedded, /LilyGO T-Embed CC1101/);
  assert.match(embedded, /https:\/\/lilygo\.cc\/en-us\/products\/t-embed-cc1101/);
  assert.match(embedded, /ESP32-S3-BOX-3/);
  assert.match(embedded, /https:\/\/github\.com\/espressif\/esp-box/);
  assert.match(embedded, /hardware_overview_for_box_3\.md/);
  assert.match(embedded, /https:\/\/github\.com\/pcvantol\/djconnect-firmware/);
});

test("site copy no longer claims devices are pre-flashed", async () => {
  const pages = await Promise.all([
    read("wwwroot/index.html"),
    read("wwwroot/start.html"),
    read("wwwroot/embedded.html"),
    read("wwwroot/macos.html"),
    read("wwwroot/ios.html"),
    read("wwwroot/macos-download.html")
  ]);

  const combined = pages.join("\n");
  assert.doesNotMatch(combined, /vooraf geflasht/i);
  assert.doesNotMatch(combined, /pre-flashed/i);
  assert.doesNotMatch(combined, /firmware staat al op het device/i);
  assert.doesNotMatch(combined, /firmware is already on the device/i);
});

test("all translation keys are present in Dutch and English", async () => {
  const [index, embedded] = await Promise.all([
    read("wwwroot/index.html"),
    read("wwwroot/embedded.html")
  ]);

  assertTranslationsCoverPage(index, "homepage");
  assertTranslationsCoverPage(embedded, "embedded");
});

test("copyright is shown in the requested form", async () => {
  const [index, embedded] = await Promise.all([
    read("wwwroot/index.html"),
    read("wwwroot/embedded.html")
  ]);
  assert.match(index, /Copyright Peter van Tol 2026/);
  assert.match(embedded, /Copyright Peter van Tol 2026/);
});
