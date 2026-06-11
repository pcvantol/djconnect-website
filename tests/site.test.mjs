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
  assert.match(cleanVersion, /^\d+\.\d+\.\d+$/);
  assert.equal(JSON.parse(packageJson).version, cleanVersion);
  assert.match(index, new RegExp(`DJConnect website v${cleanVersion}`));
  assert.match(embedded, new RegExp(`DJConnect website v${cleanVersion}`));
});

test("homepage has platform routes and app store placeholders", async () => {
  const index = await read("wwwroot/index.html");
  assert.match(index, /href="start\.html"/);
  assert.match(index, /data-i18n="navPlatform">Hoe werkt het/);
  assert.match(index, /href="features\.html" data-i18n="navFeatures">Features/);
  assert.match(index, /data-i18n="navApps">Download/);
  assert.doesNotMatch(index, /data-i18n="navEssentials"/);
  assert.doesNotMatch(index, /data-i18n="navStart">Aan de slag/);
  assert.match(index, /href="embedded\.html"/);
  assert.match(index, /href="macos\.html"/);
  assert.match(index, /href="ios\.html"/);
  assert.match(index, /href="raspberry-pi\.html"/);
  assert.match(index, /data-store-link="macos"/);
  assert.match(index, /data-store-link="ios"/);
  assert.match(index, /Mac App Store/);
  assert.match(index, /App Store/);
  assert.match(index, /brands\.home-assistant\.io\/_\/homeassistant\/icon\.png/);
  assert.match(index, /Account token & koppelgegevens worden veilig bewaard in versleutelde opslag/);
  assert.match(index, /Powered by Home Assistant, meerdere apparaten/);
  assert.match(index, /Spotify integratie, voice assist en app koppeling lopen centraal via je smart-home/);
  assert.match(index, /Meerdere interfaces/);
  assert.match(index, /Gebruik DJConnect op je favoriete Apple scherm of embedded device/);
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
  assert.match(index, /Vraag je volgende hit aan/);
  assert.match(index, /Luister naar persoonlijke DJ aankondiging/);
  assert.match(index, /Speel muziek & bedien op afstand/);
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
  assert.match(start, /href="#spotify" data-i18n="navInstall">Installeren<\/a>/);
  assert.match(start, /href="#pairing" data-i18n="navDownload">Download<\/a>/);
  assert.match(start, /class="lang-toggle"/);
  assert.doesNotMatch(start, /href="#hacs">HACS<\/a>/);
  assert.doesNotMatch(start, /href="#spotify">Voice<\/a>/);
  assert.doesNotMatch(start, /href="#pairing">Koppelen<\/a>/);
  assert.match(start, /1\. Configureer assist pipeline in Home Assistant/);
  assert.match(start, /2\. Voeg toe aan Home Assistant/);
  assert.match(start, /Gebruik onderstaande Home Assistant Community Store knop/);
  assert.match(start, /Hulp bij Home Assistant voice assist/);
  assert.match(start, /Maak of controleer je voice assist pipeline binnen Home Assistant/);
  assert.match(start, /Voeg custom repository toe <code>https:\/\/github\.com\/pcvantol\/djconnect<\/code>/);
  assert.match(start, /https:\/\/www\.home-assistant\.io\/voice_control\/voice_remote_cloud_assistant\//);
  assert.match(start, /3\. Configureer/);
  assert.match(start, /Voeg DJConnect toe als Home Assistant integratie en koppel je Spotify account/);
  assert.match(start, /Open Home Assistant <strong>Settings -> Devices & services -> Add integration -> DJConnect<\/strong>/);
  assert.match(start, /Koppel je Spotify Premium account/);
  assert.match(start, /Configureer je assist pipeline voor stembesturing en pas de stijl van de DJ aankondigingen aan via eigen prompt/);
  assert.match(start, /id="client-ios" checked/);
  assert.match(start, /id="client-macos"/);
  assert.match(start, /id="client-esp"/);
  assert.match(start, /id="client-raspberry"/);
  assert.match(
    start,
    /<label for="client-ios" role="tab">iOS app<\/label>\s*<label for="client-macos" role="tab">macOS app<\/label>\s*<label for="client-esp" role="tab">ESP32<\/label>\s*<label for="client-raspberry" role="tab">Raspberry Pi app<\/label>/
  );
  assert.match(start, /Download ESP firmware/);
  assert.match(start, /Download iOS app/);
  assert.match(start, /Download macOS app/);
  assert.match(start, /Bekijk Raspberry Pi voorbereiding/);
  assert.match(start, /Zet het DJConnect device aan en verbind het device met WiFi via captive portal of Home Assistant BLE WiFi provisioning/);
  assert.match(start, /Open DJConnect app en kopieer de koppelgegevens/);
  assert.match(start, /Open DJConnect integratie setup in Home Assistant/);
  assert.match(start, /Kies client type <strong>iOS app<\/strong> &amp; plak de koppelgegevens in de Home Assistant integratie/);
  assert.match(start, /Kies client type <strong>macOS app<\/strong> &amp; plak de koppelgegevens in de Home Assistant integratie/);
  assert.doesNotMatch(start, /Kies client type <strong>iOS app<\/strong> of <strong>macOS app<\/strong>/);
  assert.match(start, /Kies client type <strong>Raspberry Pi app<\/strong> &amp; plak de koppelgegevens/);
  assert.match(start, /DJConnect app is klaar voor gebruik/);
  assert.match(start, /Voer de koppelcode in van het device/);
  assert.match(start, /Als automatische discovery \(mDNS\) niet werkt, kun je de Client API URL handmatig invullen in de integratie/);
  assert.doesNotMatch(start, /<li>Rond koppeling af<\/li>/);
  assert.match(start, /4\. Koppel app of device/);
  assert.match(start, /5\. Klaar voor gebruik/);
  assert.match(start, /href="embedded\.html">Download ESP firmware<\/a>/);
  assert.match(start, /href="ios\.html"/);
  assert.match(start, /href="macos\.html"/);
  assert.match(start, /Ontvang persoonlijke DJ aankondigingen in de app of op je device/);
  assert.match(start, /Geen Spotify playback/);
  assert.match(start, /Controleer of de Spotify autorisatie in Home Assistant actief is, of herstel deze/);
  assert.match(start, /Ververs HACS update informatie en download de actuele versie van DJConnect/);
  assert.match(start, /Spotify is a trademark of Spotify AB/);
  assertTranslationsCoverPage(start, "start page");
});

test("features page describes core functions and bonus games", async () => {
  const features = await read("wwwroot/features.html");
  assert.match(features, /data-i18n="heroTitle">Features<\/h1>/);
  assert.match(features, /Muziek aanvragen/);
  assert.match(features, /Spotify playback/);
  assert.match(features, /Speaker keuze/);
  assert.match(features, /Home Assistant hub/);
  assert.match(features, /DJ aankondigingen/);
  assert.match(features, /Veilige koppeling/);
  assert.match(features, /macOS/);
  assert.match(features, /iOS/);
  assert.match(features, /Raspberry Pi/);
  assert.match(features, /ESP32 device/);
  assert.match(features, /Bonus: mini-games/);
  assert.match(features, /Pong, Asteroids & Fly/);
  assertTranslationsCoverPage(features, "features page");
});

test("raspberry pi page is prepared and translated", async () => {
  const raspberry = await read("wwwroot/raspberry-pi.html");
  assert.match(raspberry, /DJConnect voor Raspberry Pi/);
  assert.match(raspberry, /data-store-link="raspberry-pi"/);
  assert.doesNotMatch(raspberry, /data-github-releases/);
  assert.doesNotMatch(raspberry, /data-github-repo="djconnect-website"/);
  assert.match(raspberry, /href="index\.html" data-i18n="navHome">Home<\/a>/);
  assert.doesNotMatch(raspberry, /href="macos\.html">macOS<\/a>/);
  assert.doesNotMatch(raspberry, /href="ios\.html">iOS<\/a>/);
  assert.doesNotMatch(raspberry, /href="embedded\.html">ESP32<\/a>/);
  assertTranslationsCoverPage(raspberry, "raspberry pi page");
});

test("embedded page contains firmware release embed", async () => {
  const embedded = await read("wwwroot/embedded.html");

  assert.match(embedded, /data-github-releases/);
  assert.match(embedded, /data-github-owner="pcvantol"/);
  assert.match(embedded, /data-github-repo="djconnect-firmware"/);
  assert.match(embedded, /assets\/releases\.js/);
});

test("site does not embed website repository releases", async () => {
  const pages = ["index", "start", "features", "ios", "macos", "raspberry-pi", "embedded"];

  for (const page of pages) {
    const html = await read(`wwwroot/${page}.html`);
    assert.doesNotMatch(html, /data-github-repo="djconnect-website"/, `${page} must not load website releases`);
  }
});

test("macOS page shows public binary release repo", async () => {
  const macos = await read("wwwroot/macos.html");

  assert.doesNotMatch(macos, /href="macos-download\.html"/);
  assert.match(macos, /href="index\.html" data-i18n="navHome">Home<\/a>/);
  assert.doesNotMatch(macos, /href="ios\.html">iOS<\/a>/);
  assert.doesNotMatch(macos, /href="embedded\.html">Embedded device<\/a>/);
  assertTranslationsCoverPage(macos, "macOS page");
  assert.match(macos, /data-github-downloads/);
  assert.match(macos, /data-github-owner="pcvantol"/);
  assert.match(macos, /data-github-repo="djconnect-app-releases"/);
  assert.match(macos, /assets\/downloads\.js/);
});

test("iOS page labels the platform route as home", async () => {
  const ios = await read("wwwroot/ios.html");
  assert.match(ios, /href="index\.html" data-i18n="navHome">Home<\/a>/);
  assert.doesNotMatch(ios, /href="index\.html">Platform<\/a>/);
  assert.doesNotMatch(ios, /href="macos\.html">macOS<\/a>/);
  assert.doesNotMatch(ios, /href="embedded\.html"/);
  assert.doesNotMatch(ios, /data-github-releases/);
  assert.doesNotMatch(ios, /data-github-repo="djconnect-website"/);
  assertTranslationsCoverPage(ios, "iOS page");
});

test("release proxy function is present", async () => {
  const proxy = await read("functions/api/releases.js");
  assert.match(proxy, /env\.GITHUB_TOKEN/);
  assert.match(proxy, /api\.github\.com\/repos/);
});

test("embedded page links back to platform homepage", async () => {
  const embedded = await read("wwwroot/embedded.html");
  assert.match(embedded, /href="index\.html"/);
  assert.match(embedded, /href="index\.html" data-i18n="navPlatform">Home<\/a>/);
  assert.match(embedded, /DJConnect op ESP32|DJConnect on ESP32/);
  assert.match(embedded, /DJConnect voor ESP32/);
  assert.match(embedded, /Gebruik DJConnect als compacte afstandsbediening voor muziek en DJ aankondiging/);
  assert.doesNotMatch(embedded, /Firmware download • Wake word "Okay Nabu" • Home Assistant/);
  assert.doesNotMatch(embedded, /<h3 data-i18n="firmwareTitle">Firmware downloads<\/h3>/);
  assert.doesNotMatch(embedded, /href="start\.html" data-i18n="navStart">Aan de slag<\/a>/);
  assert.doesNotMatch(embedded, /href="#quickstart"/);
  assert.doesNotMatch(embedded, /href="#requirements"/);
  assert.doesNotMatch(embedded, /href="#faq"/);
  assert.match(embedded, /href="#releases" data-i18n="navReleases">Download<\/a>/);
  assert.match(embedded, /href="#releases" data-i18n="navStartSetup">Download<\/a>/);
  assert.match(embedded, /href="#releases" data-i18n="heroPrimary">Download<\/a>/);
  assert.doesNotMatch(embedded, /id="quickstart"/);
  assert.doesNotMatch(embedded, /id="requirements"/);
  assert.doesNotMatch(embedded, /id="faq"/);
  assert.doesNotMatch(embedded, /id="experience"/);
  assert.doesNotMatch(embedded, /data-i18n="navExperience">Ervaring/);
  assert.doesNotMatch(embedded, /data-i18n="experienceTitle">De ervaring uit de doos/);
  assert.doesNotMatch(embedded, /Live opgehaald uit GitHub en automatisch geformatteerd/);
  assert.doesNotMatch(embedded, /data-i18n="voiceTitle">Stem via HA/);
  assert.doesNotMatch(embedded, /data-i18n="secureTitle">Veilig gekoppeld/);
  assert.doesNotMatch(embedded, /data-i18n="personalityTitle">DJ-karakter/);
});

test("embedded page lists supported hardware", async () => {
  const embedded = await read("wwwroot/embedded.html");
  assert.match(embedded, /Ondersteunde hardware/);
  assert.match(embedded, /LilyGO T-Embed CC1101/);
  assert.match(embedded, /https:\/\/lilygo\.cc\/en-us\/products\/t-embed-cc1101/);
  assert.match(embedded, /LilyGO productspecificaties/);
  assert.match(embedded, /ESP32-S3-BOX-3/);
  assert.match(embedded, /https:\/\/github\.com\/espressif\/esp-box/);
  assert.match(embedded, /hardware_overview_for_box_3\.md/);
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
    read("wwwroot/raspberry-pi.html")
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
