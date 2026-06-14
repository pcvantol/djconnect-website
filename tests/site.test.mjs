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
  assert.match(index, /<title>DJConnect\. Muziekbediening met karakter<\/title>/);
  assert.doesNotMatch(index, /Een persoonlijk muziekplatform voor elk device/);
  assert.match(index, /href="features\.html" data-i18n="navFeatures">Features/);
  assert.match(index, /data-i18n="navApps">Installeren/);
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
  assert.match(index, /Powered by Home Assistant, beschikbaar voor meerdere apparaten/);
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
  assert.doesNotMatch(index, /class="iphone"/);
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
  assert.match(start, /href="\/go\/hacs" target="_blank" rel="noopener" data-i18n="hacsButton">Open DJConnect in HACS/);
  assert.doesNotMatch(start, /href="https:\/\/my\.home-assistant\.io\/redirect\/hacs_repository/);
  assert.match(start, /href="#hacs" data-i18n="navInstall">Installeren<\/a>/);
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
    /<label for="client-ios" role="tab">iOS<\/label>\s*<label for="client-macos" role="tab">macOS<\/label>\s*<label for="client-raspberry" role="tab">Linux<\/label>\s*<label for="client-esp" role="tab">ESP32<\/label>/
  );
  assert.match(start, /Download ESP firmware/);
  assert.match(start, /Download iOS app/);
  assert.match(start, /Download macOS app/);
  assert.match(start, /Download Linux app/);
  assert.match(start, /Installeer de DJConnect Raspberry Pi app via Github/);
  assert.match(start, /Zet het DJConnect device aan en verbind het device met WiFi via captive portal of Home Assistant BLE WiFi provisioning/);
  assert.match(start, /Open DJConnect app en kopieer de koppelgegevens/);
  assert.match(start, /Open DJConnect integratie setup in Home Assistant/);
  assert.match(start, /Kies client type <strong>iOS app<\/strong> &amp; plak de koppelgegevens in de Home Assistant integratie/);
  assert.match(start, /Kies client type <strong>macOS app<\/strong> &amp; plak de koppelgegevens in de Home Assistant integratie/);
  assert.doesNotMatch(start, /Kies client type <strong>iOS app<\/strong> of <strong>macOS app<\/strong>/);
  assert.match(start, /Kies client type <strong>Raspberry Pi app<\/strong> &amp; plak de koppelgegevens in de Home Assistant integratie/);
  assert.match(start, /DJConnect app is klaar voor gebruik/);
  assert.match(start, /Voer de koppelcode in van het device/);
  assert.doesNotMatch(start, /Voor iOS is de Client API URL verplicht/);
  assert.doesNotMatch(start, /Voor macOS is de Client API URL verplicht/);
  assert.doesNotMatch(start, /De Linux app gebruikt dezelfde lokale Home Assistant koppeling/);
  assert.doesNotMatch(start, /Als automatische discovery \(mDNS\) niet werkt/);
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
  assert.match(features, /Linux/);
  assert.match(features, /ESP32 device/);
  assert.match(features, /Bonus: mini-games/);
  assert.match(features, /Paddle Rally, Meteor Run, Sky Dash & Maze Chase/);
  assertTranslationsCoverPage(features, "features page");
});

test("raspberry pi page is prepared and translated", async () => {
  const raspberry = await read("wwwroot/raspberry-pi.html");
  assert.match(raspberry, /DJConnect voor Raspberry Pi/);
  assert.match(raspberry, /class="hyperpixel"/);
  assert.match(raspberry, /HyperPixel 4"/);
  assert.match(raspberry, /data-store-link="raspberry-pi"/);
  assert.match(raspberry, /data-github-downloads/);
  assert.match(raspberry, /data-github-install/);
  assert.match(raspberry, /data-github-owner="pcvantol"/);
  assert.match(raspberry, /data-github-repo="djconnect-pi-releases"/);
  assert.match(raspberry, /data-release-limit="1"/);
  assert.match(raspberry, /data-i18n="navDownloads">Download<\/a>/);
  assert.match(raspberry, /data-i18n="heroSecondary">Download<\/a>/);
  assert.match(raspberry, /data-i18n="releaseTitle">Laatste versie<\/h2>/);
  assert.match(raspberry, /assets\/downloads\.js/);
  assert.doesNotMatch(raspberry, /data-github-releases/);
  assert.doesNotMatch(raspberry, /data-github-repo="djconnect-website"/);
  assert.doesNotMatch(raspberry, /Download volgt/);
  assert.doesNotMatch(raspberry, /Bekijk pairing/);
  assert.doesNotMatch(raspberry, /Zelfde koppeling/);
  assert.doesNotMatch(raspberry, /Same pairing/);
  assert.doesNotMatch(raspberry, /Elke release toont/);
  assert.doesNotMatch(raspberry, /Each release shows/);
  assert.match(raspberry, /href="index\.html" data-i18n="navHome">Home<\/a>/);
  assert.doesNotMatch(raspberry, /href="macos\.html">macOS<\/a>/);
  assert.doesNotMatch(raspberry, /href="ios\.html">iOS<\/a>/);
  assert.doesNotMatch(raspberry, /href="embedded\.html">ESP32<\/a>/);
  assertTranslationsCoverPage(raspberry, "raspberry pi page");
});

test("embedded page contains firmware release embed", async () => {
  const embedded = await read("wwwroot/embedded.html");

  assert.match(embedded, /data-github-downloads/);
  assert.match(embedded, /data-github-owner="pcvantol"/);
  assert.match(embedded, /data-github-repo="djconnect-firmware"/);
  assert.match(embedded, /data-release-limit="1"/);
  assert.match(embedded, /assets\/downloads\.js/);
  assert.doesNotMatch(embedded, /data-github-releases/);
});

test("embedded page uses the shared site color styling", async () => {
  const embedded = await read("wwwroot/embedded.html");

  assert.match(embedded, /--cyan: #66e0ff/);
  assert.match(embedded, /--green: #7ef7a7/);
  assert.match(embedded, /radial-gradient\(circle at 86% 6%, rgba\(251, 113, 133, 0\.14\), transparent 27rem\)/);
  assert.match(embedded, /radial-gradient\(circle at 58% 72%, rgba\(126, 247, 167, 0\.1\), transparent 31rem\)/);
  assert.match(embedded, /linear-gradient\(135deg, var\(--cyan\), var\(--green\)\)/);
  assert.doesNotMatch(embedded, /linear-gradient\(135deg, var\(--accent-cyan\), #8b5cf6\)/);
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
  assert.match(macos, /href="#downloads">Download<\/a>/);
  assert.match(macos, /data-i18n="downloadCta">Download<\/a>/);
  assert.match(macos, /data-i18n="releaseTitle">Laatste versie<\/h2>/);
  assert.doesNotMatch(macos, /Download binaries/);
  assert.doesNotMatch(macos, /Downloads voorbereid/);
  assert.doesNotMatch(macos, /Elke release toont/);
  assert.doesNotMatch(macos, /Each release shows/);
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

test("download script renders dynamic Raspberry Pi install command", async () => {
  const downloads = await read("wwwroot/assets/downloads.js");
  assert.match(downloads, /installTitle: "DJConnect Pi app install"/);
  assert.match(downloads, /Installeer DJConnect Pi vanaf de publieke release-bundel/);
  assert.match(downloads, /https:\/\/djconnect\.dev\/go\/linux-install/);
  assert.match(downloads, /cd djconnect-pi-\$\{version\}/);
  assert.match(downloads, /sudo \.\/scripts\/install\.sh/);
  assert.doesNotMatch(downloads, /install_raspberry_pi\.sh/);
  assert.match(downloads, /copyCommand: "Kopieer install-commando"/);
  assert.match(downloads, /copyCommand: "Copy install command"/);
  assert.match(downloads, /class="copy-command"/);
  assert.match(downloads, /navigator\.clipboard/);
  assert.match(downloads, /document\.execCommand\("copy"\)/);
  assert.match(downloads, /new MutationObserver/);
  assert.match(downloads, /attributeName === "lang"/);
  assert.match(downloads, /renderDynamicDownloadBlocks/);
  assert.doesNotMatch(downloads, /djconnect-pi-3\.1\.16/);
});

test("download renderer keeps release embeds latest-only and tracked", async () => {
  const [downloads, macos, raspberry, embedded] = await Promise.all([
    read("wwwroot/assets/downloads.js"),
    read("wwwroot/macos.html"),
    read("wwwroot/raspberry-pi.html"),
    read("wwwroot/embedded.html")
  ]);

  assert.match(downloads, /const limit = Number\(root\.dataset\.releaseLimit \|\| 5\)/);
  assert.match(downloads, /releases = releases\.slice\(0, limit\)/);
  assert.match(downloads, /repo === "djconnect-firmware"\) return "firmware"/);
  assert.match(downloads, /repo === "djconnect-pi-releases"\) return "linux"/);
  assert.match(downloads, /repo === "djconnect-app-releases"\) return "macos"/);
  assert.match(downloads, /asset\.browser_download_url/);
  assert.match(downloads, /asset\.download_count/);

  for (const html of [macos, raspberry, embedded]) {
    assert.match(html, /data-github-downloads/);
    assert.match(html, /data-release-limit="1"/);
    assert.doesNotMatch(html, /data-github-releases/);
    assert.doesNotMatch(html, /Live opgehaald uit GitHub en automatisch geformatteerd/);
    assert.doesNotMatch(html, /Elke release toont de downloadbare assets/);
    assert.doesNotMatch(html, /Each release shows the downloadable assets/);
  }
});

test("download and HACS clicks use cookieless aggregate redirects", async () => {
  const [downloads, migration, redirect, downloadRedirect, stats] = await Promise.all([
    read("wwwroot/assets/downloads.js"),
    read("migrations/0001_create_click_counters.sql"),
    read("functions/go/[target].js"),
    read("functions/go/download.js"),
    read("functions/api/stats.js")
  ]);

  assert.match(downloads, /trackedDownloadUrl/);
  assert.match(downloads, /\/go\/download\?repo=/);
  assert.match(downloads, /asset\.download_count/);
  assert.match(redirect, /REDIRECT_TARGETS/);
  assert.match(redirect, /linux-install/);
  assert.match(downloadRedirect, /isAllowedGithubDownload/);
  assert.match(stats, /STATS_TOKEN/);
  assert.match(stats, /download_count/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS click_counters/);
  assert.match(migration, /PRIMARY KEY \(day, target, source\)/);

  assert.match(stats, /No cookies, IP addresses, user agents or identifiers are stored/);

  const combined = [migration, redirect, downloadRedirect].join("\n");
  assert.doesNotMatch(combined, /cookie/i);
  assert.doesNotMatch(combined, /user-agent/i);
  assert.doesNotMatch(combined, /cf-connecting-ip/i);
  assert.doesNotMatch(combined, /x-forwarded-for/i);
});

test("redirect endpoints expose only current public targets", async () => {
  const [analytics, targetRedirect, downloadRedirect] = await Promise.all([
    read("functions/_shared/analytics.js"),
    read("functions/go/[target].js"),
    read("functions/go/download.js")
  ]);

  assert.match(analytics, /djconnect-app-releases/);
  assert.match(analytics, /djconnect-firmware/);
  assert.match(analytics, /djconnect-pi-releases/);
  assert.match(analytics, /github-firmware-releases": "https:\/\/github\.com\/pcvantol\/djconnect-firmware\/releases"/);
  assert.match(analytics, /github-linux-releases": "https:\/\/github\.com\/pcvantol\/djconnect-pi-releases\/releases"/);
  assert.doesNotMatch(analytics, /djconnect-website\/releases/);

  assert.match(targetRedirect, /"linux-install"/);
  assert.match(targetRedirect, /fetchLatestRelease\(context\.env, config\.repo\)/);
  assert.match(targetRedirect, /trackedRedirect\(context, target, asset\.browser_download_url\)/);
  assert.match(downloadRedirect, /isAllowedGithubDownload\(destination, repo\)/);
  assert.match(downloadRedirect, /trackedRedirect\(context, target, destination\)/);
});

test("release script performs standard cleanup after release", async () => {
  const releaseScript = await read("release.sh");

  assert.match(releaseScript, /Cleaning older releases, tags and workflow runs/);
  assert.match(releaseScript, /\.\/cleanup_old_releases\.sh --keep "\$TAG" --keep-runs "\$KEEP_WORKFLOW_RUNS"/);
  assert.match(releaseScript, /KEEP_WORKFLOW_RUNS="\$\{KEEP_WORKFLOW_RUNS:-1\}"/);
});

test("canonical SEO uses djconnect.dev", async () => {
  const pages = [
    ["index", "https://djconnect.dev/"],
    ["start", "https://djconnect.dev/start"],
    ["features", "https://djconnect.dev/features"],
    ["ios", "https://djconnect.dev/ios"],
    ["macos", "https://djconnect.dev/macos"],
    ["raspberry-pi", "https://djconnect.dev/raspberry-pi"],
    ["embedded", "https://djconnect.dev/embedded"]
  ];

  for (const [page, canonical] of pages) {
    const html = await read(`wwwroot/${page}.html`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical.replace(/[/.]/g, "\\$&")}" />`));
  }

  const [index, robots, sitemap, downloads] = await Promise.all([
    read("wwwroot/index.html"),
    read("wwwroot/robots.txt"),
    read("wwwroot/sitemap.xml"),
    read("wwwroot/assets/downloads.js")
  ]);

  assert.match(index, /<meta property="og:url" content="https:\/\/djconnect\.dev\/" \/>/);
  assert.match(index, /<meta property="og:image" content="https:\/\/djconnect\.dev\/assets\/djconnect\/social-card\.png" \/>/);
  assert.match(index, /<meta property="og:image:width" content="1200" \/>/);
  assert.match(index, /<meta property="og:image:height" content="630" \/>/);
  assert.match(index, /<meta property="og:image:alt" content="DJConnect\. Muziekbediening met karakter\." \/>/);
  assert.match(index, /<meta name="twitter:image" content="https:\/\/djconnect\.dev\/assets\/djconnect\/social-card\.png" \/>/);
  assert.match(robots, /Sitemap: https:\/\/djconnect\.dev\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/embedded<\/loc>/);
  assert.match(downloads, /https:\/\/djconnect\.dev\/go\/linux-install/);
});

test("social preview image uses current branding", async () => {
  const [logoSvg, socialSvg] = await Promise.all([
    read("wwwroot/assets/djconnect/logo.svg"),
    read("wwwroot/assets/djconnect/social-card.svg")
  ]);

  assert.match(logoSvg, /MUZIEKBEDIENING MET KARAKTER/);
  assert.doesNotMatch(logoSvg, /YOUR PERSONAL MUSIC DJ/);
  assert.match(socialSvg, /width="1200" height="630"/);
  assert.match(socialSvg, /Muziekbediening met karakter/);
  assert.match(socialSvg, /djconnect\.dev/);
  assert.doesNotMatch(socialSvg, /YOUR PERSONAL/);
});

test("legacy macOS download page is not referenced", async () => {
  const pages = ["index", "start", "features", "ios", "macos", "raspberry-pi", "embedded"];

  for (const page of pages) {
    const html = await read(`wwwroot/${page}.html`);
    assert.doesNotMatch(html, /macos-download\.html/, `${page} should not link to the removed macOS download page`);
    assert.doesNotMatch(html, /macos-download/, `${page} should not mention the removed macOS download route`);
  }
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
  assert.match(embedded, /data-i18n="releaseTitle">Laatste versie<\/h2>/);
  assert.doesNotMatch(embedded, /Latest GitHub releases/);
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
  const pages = ["index", "start", "features", "ios", "macos", "raspberry-pi", "embedded"];
  const htmlPages = await Promise.all(pages.map((page) => read(`wwwroot/${page}.html`)));

  htmlPages.forEach((html, index) => assertTranslationsCoverPage(html, `${pages[index]} page`));
});

test("copyright is shown in the requested form", async () => {
  const pages = ["index", "start", "features", "ios", "macos", "raspberry-pi", "embedded"];
  const htmlPages = await Promise.all(pages.map((page) => read(`wwwroot/${page}.html`)));

  htmlPages.forEach((html) => {
    assert.match(html, /Copyright Peter van Tol 2026/);
    assert.match(html, /class="privacy-notice" data-i18n="legalPrivacy"/);
    assert.match(html, /Deze website ontvangt of bewaart geen accountgegevens/);
    assert.match(html, /This website does not receive or store account details/);
  });
});
