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
  assert.equal(cleanVersion, "3.1.4");
  assert.equal(JSON.parse(packageJson).version, cleanVersion);
  assert.match(index, new RegExp(`DJConnect website v${cleanVersion}`));
  assert.match(embedded, new RegExp(`DJConnect website v${cleanVersion}`));
});

test("homepage has platform routes and app store placeholders", async () => {
  const index = await read("wwwroot/index.html");
  assert.match(index, /href="start\.html"/);
  assert.match(index, /data-i18n="navPlatform">Wat is DJConnect/);
  assert.match(index, /data-i18n="navApps">Download/);
  assert.doesNotMatch(index, /data-i18n="navEssentials"/);
  assert.doesNotMatch(index, /data-i18n="navStart">Aan de slag/);
  assert.match(index, /href="embedded\.html"/);
  assert.match(index, /href="macos\.html"/);
  assert.match(index, /href="ios\.html"/);
  assert.match(index, /data-store-link="macos"/);
  assert.match(index, /data-store-link="ios"/);
  assert.match(index, /Mac App Store/);
  assert.match(index, /App Store/);
  assert.match(index, /brands\.home-assistant\.io\/_\/homeassistant\/icon\.png/);
  assert.match(index, /Account token & koppelgegevens worden veilig bewaard in versleutelde opslag/);
  assert.match(index, /Powered by Home Assistant, meerdere apparaten/);
  assert.match(index, /Spotify integratie, voice assist en app koppeling lopen centraal via je smart-home/);
  assert.match(index, /Meerdere interfaces/);
  assert.match(index, /Gebruik DJConnect op je favoriete scherm/);
  assert.match(index, /DJConnect brengt je muziekwens, speaker keuze en persoonlijke DJ-feedback samen/);
  assert.match(index, /Zeg welke artiest je wilt horen/);
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
  assert.match(index, /voice-cover/);
  assert.doesNotMatch(index, /radio-mic-icon/);
  assert.match(index, /Met stemactivatie/);
  assert.match(index, /Draai embedded, voor de echte die-hards/);
  assert.match(index, /Speel, Vraag aan, Ontvang Persoonlijke DJ aankondiging/);
  assert.doesNotMatch(index, /DJConnect Studio/);
  assert.doesNotMatch(index, /Queue, output en DJ-reactie/);
});

test("how-to-start page covers setup flow", async () => {
  const start = await read("wwwroot/start.html");
  assert.match(start, /DJConnect\. Muziekbediening met karakter\./);
  assert.match(start, /DJConnect brengt spraak, muziekbediening en een persoonlijke DJ-reactie samen/);
  assert.match(start, /Home Assistant installatie/);
  assert.match(start, /Open DJConnect in HACS/);
  assert.match(start, /https:\/\/my\.home-assistant\.io\/redirect\/hacs_repository/);
  assert.match(start, /Voeg DJConnect toe aan je Home Assistant/);
  assert.match(start, /Gebruik onderstaande Home Assistant Community Store knop/);
  assert.match(start, /Configureer je voice assist pipeline in Home Assistant/);
  assert.match(start, /Hulp bij Home Assistant voice assist/);
  assert.match(start, /Maak of controleer je voice assist pipeline binnen Home Assistant/);
  assert.match(start, /https:\/\/www\.home-assistant\.io\/voice_control\/voice_remote_cloud_assistant\//);
  assert.match(start, /Configureer DJConnect in Home Assistant/);
  assert.match(start, /Voeg DJConnect toe als Home Assistant integratie en koppel je Spotify account/);
  assert.match(start, /Open Home Assistant <strong>Settings -> Devices & services -> Add integration -> DJConnect<\/strong>/);
  assert.match(start, /Koppel je Spotify Premium account/);
  assert.match(start, /Configureer je assist pipeline voor stembesturing en pas de stijl van de DJ aankondigingen aan via eigen prompt/);
  assert.match(start, /Zet het DJConnect device aan en verbind het device met WiFi via captive portal of Home Assistant BLE WiFi provisioning/);
  assert.match(start, /Open DJConnect app en kopieer de koppelgegevens/);
  assert.match(start, /Open DJConnect integratie setup in Home Assistant/);
  assert.match(start, /Kies client type <strong>iOS app<\/strong> of <strong>macOS app<\/strong> &amp; plak de koppelgegevens/);
  assert.match(start, /DJConnect app is klaar voor gebruik/);
  assert.match(start, /Voer de koppelcode in van het device/);
  assert.doesNotMatch(start, /<li>Rond koppeling af<\/li>/);
  assert.match(start, /Koppel DJConnect aan Home Assistant/);
  assert.match(start, /https:\/\/github\.com\/pcvantol\/djconnect-firmware/);
  assert.match(start, /https:\/\/github\.com\/pcvantol\/djconnect-app-releases/);
  assert.match(start, /Ontvang persoonlijke DJ aankondigingen in de app of op je device/);
  assert.match(start, /Geen Spotify playback/);
  assert.match(start, /Controleer of de Spotify autorisatie in Home Assistant actief is, of herstel deze/);
  assert.match(start, /Ververs HACS update informatie en download de actuele versie van DJConnect/);
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

test("homepage LilyGO visual keeps the device screen empty", async () => {
  const lilygo = await read("wwwroot/assets/lilygo-t-embed-djconnect.svg");
  assert.doesNotMatch(lilygo, />DJ</);
  assert.doesNotMatch(lilygo, />DJConnect</);
  assert.doesNotMatch(lilygo, />PUSH TO TALK</);
  assert.doesNotMatch(lilygo, />Vraag muziek/);
  assert.doesNotMatch(lilygo, />Krijg persoonlijk/);
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
