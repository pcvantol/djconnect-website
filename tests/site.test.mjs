import { execFile } from "node:child_process";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { promisify } from "node:util";
import vm from "node:vm";
import {
  releaseOutputDir,
  sharedReleaseAssets,
  sourceDir,
  supportedLanguages
} from "../scripts/site-config.mjs";
import {
  assertLocalRefExists,
  assertMissing,
  assertTranslationsCoverPage,
  extractRefs,
  publicPages,
  read,
  readPageTranslations
} from "./helpers/site.mjs";

const exec = promisify(execFile);

test("site version is consistent", async () => {
  const [version, packageJson, index, embedded] = await Promise.all([
    read("VERSION"),
    read("package.json"),
    read("wwwroot/index.html"),
    read("wwwroot/embedded.html")
  ]);

  const cleanVersion = version.trim();
  const packageData = JSON.parse(packageJson);
  assert.match(cleanVersion, /^\d+\.\d+\.\d+$/);
  assert.equal(packageData.version, cleanVersion);
  assert.equal(packageData.license, "MIT");
  assert.match(index, new RegExp(`DJConnect website v${cleanVersion}`));
  assert.match(embedded, new RegExp(`DJConnect website v${cleanVersion}`));
});

test("public pages expose five-language i18n routes and shared legal strings", async () => {
  const [index, i18nRuntime, readme, contributing] = await Promise.all([
    read("wwwroot/index.html"),
    read("wwwroot/assets/i18n.js"),
    read("README.md"),
    read("CONTRIBUTING.md")
  ]);

  assert.deepEqual(supportedLanguages, ["en", "nl", "de", "fr", "es"]);
  assert.ok(sharedReleaseAssets.includes("assets/i18n.js"));
  assert.match(index, /assets\/i18n\.js/);

  for (const language of supportedLanguages) {
    assert.match(index, new RegExp(`data-lang="${language}"`));
    assert.match(index, new RegExp(`hreflang="${language}"`));
    if (language !== "nl") {
      await assertLocalRefExists("index.html", `${language}/index.html`);
      await assertLocalRefExists("start.html", `${language}/start.html`);
    }
  }

  assert.match(index, /hreflang="x-default"/);
  assert.match(i18nRuntime, /Spotify is a trademark of Spotify AB\. DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB\./);
  assert.match(i18nRuntime, /Copyright Peter van Tol 2026\. Released under the MIT License\./);
  assert.match(i18nRuntime, /HACS DJConnect/);
  assert.match(readme, /All public website and docs pages must ship complete copy for `en`, `nl`, `de`,\n`fr` and `es`/);
  assert.match(contributing, /Update all public languages in the same pull request/);
});

test("public examples use fictional artist names only", async () => {
  const forbiddenNames = [
    ["Nir", "vana"],
    ["Metal", "lica"],
    ["London", " Grammar"],
    ["Pearl", " Jam"],
    ["Peter", " Gabriel"],
    ["Radio", "head"],
    ["Taylor", " Swift"],
    ["The ", "Beat", "les"],
    ["Bey", "once"],
    ["Bey", "oncé"],
    ["Dra", "ke"],
    ["Cold", "play"],
    ["Daft", " Punk"],
    ["Fleetwood", " Mac"],
    ["Ade", "le"],
    ["Prin", "ce"],
    ["Mad", "onna"],
    ["Que", "en"],
    ["Kend", "rick"],
    ["S", "ZA"],
    ["Billie", " Eilish"],
    ["Arctic", " Monkeys"],
    ["Mu", "se"],
    ["Oa", "sis"],
    ["U", "2"],
    ["AB", "BA"],
    ["David", " Bowie"],
    ["Lith", "ium"],
    ["Nothing", " Else Matters"],
    ["Never", "mind"],
    ["Rum", "ours"]
  ].map((parts) => parts.join(""));

  const collectFiles = async (directory) => {
    const entries = await readdir(new URL(`../${directory}/`, import.meta.url), { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) {
        files.push(...await collectFiles(path));
      } else if (/\.(html|js|css|json|md|svg|txt|webmanifest)$/.test(entry.name)) {
        files.push(path);
      }
    }
    return files;
  };

  const files = [
    ...await collectFiles("wwwroot"),
    ...await collectFiles("tests"),
    "README.md",
    "CONTRIBUTING.md",
    "TESTS.md",
    "HANDOFF.md",
    "CHANGELOG.md",
    "TECHNICAL_DESIGN.md"
  ];

  for (const file of files) {
    const text = await read(file);
    for (const name of forbiddenNames) {
      assert.doesNotMatch(text, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${file} should not mention real artist/track name ${name}`);
    }
  }
});

test("shared i18n runtime loads before page translation scripts", async () => {
  for (const page of publicPages) {
    const html = await read(`wwwroot/${page}.html`);
    const i18nIndex = html.indexOf("assets/i18n.js");
    const translationsIndex = html.indexOf("const translations =");
    assert.notEqual(i18nIndex, -1, `${page} should load shared i18n runtime`);
    assert.notEqual(translationsIndex, -1, `${page} should have page translations`);
    assert.ok(i18nIndex < translationsIndex, `${page} should load i18n before translations execute`);
    assert.match(html, /grid-template-columns:\s*repeat\(5,\s*1fr\)|grid-template-columns:repeat\(5,1fr\)/, `${page} should size the five-language switcher`);

    for (const language of supportedLanguages.filter((item) => item !== "nl")) {
      const localized = await read(`wwwroot/${language}/${page === "index" ? "index" : page}.html`);
      assert.ok(localized.indexOf("assets/i18n.js") < localized.indexOf("const translations ="), `${language}/${page} should load i18n before translations execute`);
    }
  }
});

test("localized start routes apply the requested setup language", async () => {
  const [i18nRuntime, start, pageTranslations] = await Promise.all([
    read("wwwroot/assets/i18n.js"),
    read("wwwroot/start.html"),
    readPageTranslations()
  ]);

  assert.match(i18nRuntime, /pathLanguage = window\.location\.pathname/);
  assert.match(i18nRuntime, /firstSupportedLanguage\(urlLanguage, storedLanguage, pathLanguage, browserLanguage, defaultLanguage\)/);
  assert.match(i18nRuntime, /navigator\.languages/);
  assert.match(start, /applyLanguage\(window\.DJCONNECT_I18N\?\.initialLanguage \|\| "nl"\)/);

  const expectedCopy = {
    de: "6. App oder Geraet lokal koppeln",
    fr: "6. Associer l'app ou l'appareil localement",
    es: "6. Empareja la app o el dispositivo localmente"
  };

  for (const [language, title] of Object.entries(expectedCopy)) {
    const localized = await read(`wwwroot/${language}/start.html`);
    assert.equal(pageTranslations.start[language].pairingTitle, title);
    assert.notEqual(pageTranslations.start[language].pairingTitle, "6. Pair app or device locally");
    assert.match(localized, /applyLanguage\(window\.DJCONNECT_I18N\?\.initialLanguage \|\| "nl"\)/);
  }
});

test("language selection persists globally and falls back to OS language", async () => {
  const i18nRuntime = await read("wwwroot/assets/i18n.js");

  assert.match(i18nRuntime, /const storedLanguage = localStorage\.getItem\("djconnect-language"\)/);
  assert.match(i18nRuntime, /const browserLanguage = \[/);
  assert.match(i18nRuntime, /firstSupportedLanguage\(urlLanguage, storedLanguage, pathLanguage, browserLanguage, defaultLanguage\)/);
  assert.match(i18nRuntime, /const localizedPathFor = \(targetUrl, language\) =>/);
  assert.match(i18nRuntime, /const localizeUrl = \(href, language = localStorage\.getItem\("djconnect-language"\) \|\| initialLanguage\) =>/);
  assert.match(i18nRuntime, /const applyLocalizedLinks = \(language = localStorage\.getItem\("djconnect-language"\) \|\| initialLanguage\) =>/);
  assert.match(i18nRuntime, /document\.addEventListener\("click", \(event\) =>/);
  assert.match(i18nRuntime, /languageButton\?\.dataset\?\.lang/);
  assert.match(i18nRuntime, /window\.setTimeout\(\(\) => applyLocalizedLinks\(languageButton\.dataset\.lang\), 0\)/);
  assert.match(i18nRuntime, /normalizedLanguage === defaultLanguage/);
  assert.doesNotMatch(i18nRuntime, /urlLanguage \|\| pathLanguage \|\| localStorage/);
  assert.doesNotMatch(i18nRuntime, /stored === "nl" \|\| stored === "en"/);

  for (const page of publicPages) {
    const html = await read(`wwwroot/${page}.html`);
    assert.doesNotMatch(html, /stored === "nl" \|\| stored === "en"/, `${page} should not restrict stored language to nl/en`);
  }
});

test("localized homepage routes render localized hero copy", async () => {
  const expected = {
    de: {
      title: "DJConnect. Musiksteuerung mit Charakter.",
      cta: "So startest du",
      nav: "Funktionen"
    },
    fr: {
      title: "DJConnect. Controle musical avec du caractere.",
      cta: "Comment demarrer",
      nav: "Fonctions"
    },
    es: {
      title: "DJConnect. Control musical con caracter.",
      cta: "Como empezar",
      nav: "Funciones"
    }
  };
  const pageTranslations = await readPageTranslations();

  for (const [language, copy] of Object.entries(expected)) {
    const localized = await read(`wwwroot/${language}/index.html`);
    assert.equal(pageTranslations.index[language].heroTitle, copy.title);
    assert.equal(pageTranslations.index[language].navChoose, copy.cta);
    assert.equal(pageTranslations.index[language].navFeatures, copy.nav);
    assert.notEqual(pageTranslations.index[language].heroTitle, "DJConnect. Music control with character.");
    assert.notEqual(pageTranslations.index[language].navChoose, "How to start");
    assert.match(localized, /applyLanguage\(getInitialLanguage\(\)\)/);
  }
});

test("screenshot tooling is available for live page review", async () => {
  const [packageJson, screenshotTest, screenshotScript, gitignore, testsDoc, readme] = await Promise.all([
    read("package.json"),
    read("tests/screenshots.spec.mjs"),
    read("scripts/capture-all-screenshots.sh"),
    read(".gitignore"),
    read("TESTS.md"),
    read("README.md")
  ]);

  const scripts = JSON.parse(packageJson).scripts;
  assert.equal(scripts.screenshots, "SCREENSHOT_LANG=nl npx playwright test tests/screenshots.spec.mjs");
  assert.equal(scripts["screenshots:all"], "./scripts/capture-all-screenshots.sh");
  assert.match(scripts["screenshots:live"], /SCREENSHOT_LANG=nl SCREENSHOT_BASE_URL=https:\/\/djconnect\.dev/);
  assert.equal(scripts["test:smoke"], "npx playwright test tests/smoke.spec.mjs");
  assert.match(screenshotScript, /rm -rf "\$OUTPUT_DIR"/);
  assert.match(screenshotScript, /publicPages, supportedLanguages, defaultLanguage/);
  assert.match(screenshotScript, /const include404 = process\.env\.INCLUDE_404_SCREENSHOT === "1"/);
  assert.match(screenshotScript, /publicPages\.filter\(\(page\) => page !== "404"\)/);
  assert.match(screenshotScript, /returned HTTP/);
  assert.match(screenshotScript, /rendered page-not-found copy unexpectedly/);
  assert.match(screenshotScript, /page\.screenshot\(\{ path: filePath, fullPage: true \}\)/);
  assert.match(screenshotScript, /manifest\.json/);
  assert.match(gitignore, /screenshots\/all-pages\//);
  assert.match(screenshotTest, /width: Number\(process\.env\.SCREENSHOT_WIDTH \|\| 1440\)/);
  assert.match(screenshotTest, /height: Number\(process\.env\.SCREENSHOT_HEIGHT \|\| 900\)/);
  assert.match(screenshotTest, /const language = process\.env\.SCREENSHOT_LANG \|\| "nl"/);
  assert.match(screenshotTest, /\/developers/);
  assert.match(screenshotTest, /localStorage\.setItem\("djconnect-language", lang\)/);
  assert.match(screenshotTest, /toHaveAttribute\("lang", language\)/);
  assert.match(screenshotTest, /language,/);
  assert.match(screenshotTest, /screenshots\/live-laptop/);
  assert.match(testsDoc, /npm run screenshots:live/);
  assert.match(testsDoc, /Dutch/);
  assert.match(readme, /npm run screenshots:live/);
});

test("development environment guide documents local workflow", async () => {
  const [guide, readme, contributing] = await Promise.all([
    read("DEVELOPMENT_ENVIRONMENT.md"),
    read("README.md"),
    read("CONTRIBUTING.md")
  ]);

  assert.match(guide, /# Development Environment/);
  assert.match(guide, /npm install/);
  assert.match(guide, /npm test/);
  assert.match(guide, /npm run screenshots:live/);
  assert.match(guide, /\.\/release\.sh --skip-deploy/);
  assert.match(guide, /CLOUDFLARE_API_TOKEN/);
  assert.match(guide, /Do not store secrets/);
  assert.match(readme, /DEVELOPMENT_ENVIRONMENT\.md/);
  assert.match(contributing, /DEVELOPMENT_ENVIRONMENT\.md/);
});

test("canonical cross-repo prompt and roadmap stay external", async () => {
  const [readme, handoff, testsDoc, todo, design, releaseScript] = await Promise.all([
    read("README.md"),
    read("HANDOFF.md"),
    read("TESTS.md"),
    read("TODO.md"),
    read("TECHNICAL_DESIGN.md"),
    read("release.sh")
  ]);

  const pointer = await read("SYNC_PROMPTS.md");
  assert.match(pointer, /^# .*Pointer|^# .*Navigation/im);
  assert.match(pointer, /pcvantol\/djconnect/);
  assert.match(pointer, /SYNC_PROMPTS\.md/);
  assert.match(pointer, /PRODUCT_ROADMAP\.md/);
  assert.match(pointer, /Do not fork .*cross-repo contracts locally/i);

  for (const forbidden of [
    "PRODUCT_ROADMAP.md",
    "HA_SYNC_PROMPT.md",
    "ESP_SYNC_PROMPT.md",
    "IOS_MACOS_APP_HANDOFF.md",
    "APPLE_APP_SYNC_PROMPTS.md",
    "docs/SYNC_PROMPTS.md"
  ]) {
    await assertMissing(forbidden);
  }

  for (const doc of [readme, handoff, testsDoc, todo, design, releaseScript]) {
    assert.match(doc, /pcvantol\/djconnect\/SYNC_PROMPTS\.md/);
    assert.match(doc, /pcvantol\/djconnect\/PRODUCT_ROADMAP\.md/);
  }

  assert.doesNotMatch(`${readme}\n${handoff}\n${testsDoc}\n${todo}\n${design}`, /byte-for-byte/i);
});

test("sync prompt pointer validation accepts pointers and rejects copied canonical content", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "djconnect-sync-pointer-"));
  const valid = path.join(directory, "valid.md");
  const invalid = path.join(directory, "invalid.md");
  const validator = "scripts/validate-sync-prompt-pointer.mjs";
  const pointer = await read("SYNC_PROMPTS.md");

  try {
    await writeFile(valid, pointer);
    await exec("node", [validator, valid]);
    await writeFile(invalid, `${pointer}\n\n## Mission\nCopied implementation prompt body.`);
    await assert.rejects(exec("node", [validator, invalid]));
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
});

test("homepage has platform routes and app store placeholders", async () => {
  const index = await read("wwwroot/index.html");
  assert.match(index, /href="start\.html"/);
  assert.doesNotMatch(index, /data-i18n="navPlatform">Hoe werkt het/);
  assert.match(index, /<title>DJConnect\. Muziekbediening met karakter<\/title>/);
  assert.match(index, /DJConnect 3\.2 verbindt fysieke muziekbediening, Ask DJ, Home Assistant en Spotify Direct of Music Assistant/);
  assert.match(index, /content="Vraag muziek, kies waar het speelt en krijg persoonlijke DJ-feedback op macOS, Windows, iOS, Linux en ESP32\."/);
  assert.doesNotMatch(index, /Een persoonlijk muziekplatform voor elk device/);
  assert.match(index, /href="features\.html" data-i18n="navFeatures">Features/);
  assert.match(index, /href="#ask-dj" data-i18n="navAskDj">Ask DJ/);
  assert.match(index, /href="voice-commands\.html" data-i18n="navVoice">Spraak/);
  assert.match(index, /href="blog\.html" data-i18n="navBlog">Blog/);
  assert.match(index, /data-i18n="navApps">Installeren/);
  assert.match(index, /href="support\.html" data-i18n="navSupport">Support/);
  assert.match(index, /href="privacy\.html" data-i18n="navPrivacy">Privacy/);
  assert.match(index, /href="voice-assistant\.html" data-i18n="voiceAssistantMore">Meer over Voice Assistant/);
  assert.match(index, /class="menu-toggle"/);
  assert.match(index, /aria-controls="primaryNav"/);
  assert.match(index, /assets\/site-nav\.css/);
  assert.match(index, /assets\/site-nav\.js/);
  assert.doesNotMatch(index, /data-i18n="navEssentials"/);
  assert.doesNotMatch(index, /data-i18n="navStart">Aan de slag/);
  assert.match(index, /href="embedded\.html"/);
  assert.match(index, /href="macos\.html"/);
  assert.match(index, /href="windows\.html"/);
  assert.match(index, /Windows builds/);
  assert.match(index, /Voor local of remote desktopbediening op Windows/);
  assert.match(index, /href="maccatalyst\.html"/);
  assert.match(index, /Mac Catalyst builds/);
  assert.match(index, /Unsigned Mac Catalyst build voor diagnostics/);
  assert.match(index, /href="ios\.html"/);
  assert.match(index, /href="raspberry-pi\.html"/);
  assert.match(index, /data-store-link="macos"/);
  assert.match(index, /data-store-link="ios"/);
  assert.match(index, /Mac App Store/);
  assert.match(index, /App Store/);
  assert.match(index, /brands\.home-assistant\.io\/_\/homeassistant\/icon\.png/);
  assert.match(index, /Geen DJConnect cloud-account nodig voor core gebruik/);
  assert.match(index, /Powered by Home Assistant, beschikbaar voor meerdere apparaten/);
  assert.match(index, /Music backend, voice assist, pairing en Ask DJ history lopen centraal via je smart-home/);
  assert.match(index, /Meerdere interfaces/);
  assert.match(index, /Gebruik remote-capable apps op desktop\/mobiel en local-only ESP32 of Raspberry Pi hardware in huis/);
  assert.match(index, /DJConnect brengt je muziekwens, playerkeuze, fysieke controls en persoonlijke DJ-feedback samen/);
  assert.match(index, /Zeg welke artiest je wilt horen/);
  assert.match(index, /data-i18n="navDiscover">Ontdek/);
  assert.match(index, /href="#discover"/);
  assert.match(index, /<script src="assets\/voice-intents\.js"><\/script>/);
  assert.match(index, /id="homepageVoiceExamples"/);
  assert.match(index, /renderHomepageVoiceExamples\(language\)/);
  assert.match(index, /href="voice-commands\.html" data-i18n="examplesMore">Bekijk meer spraakvoorbeelden/);
  assert.doesNotMatch(index, /data-i18n="exampleCommand1"/);
});

test("homepage promotes Ask DJ as a major product feature", async () => {
  const index = await read("wwwroot/index.html");
  assert.match(index, /<section id="ask-dj">/);
  assert.match(index, /data-i18n="askDjTitle">Ask DJ<\/h2>/);
  assert.match(index, /AI-DJ chat voor muziekvragen, playback-acties, Track Insight, optionele persoonlijke aanbevelingen en DJ-aankondigingen via een gekozen Home Assistant speaker/);
  assert.doesNotMatch(index, /ask-dj-pill/);
  assert.doesNotMatch(index, /Via Home Assistant en DJConnect integration v3\.1\.69\+/);
  assert.match(index, /Meer dan muziekcommands/);
  assert.match(index, /Ask DJ werkt ook als Music DNA uit staat/);
  assert.match(index, /met opt-in kan Home Assistant compacte Music DNA signalen gebruiken/);
  assert.match(index, /"Waarom koos je dit nummer\?"/);
  assert.match(index, /"Wat is er nieuw in Discover\?"/);
  assert.match(index, /"Geef me 10 uitvoeringen van dit nummer door verschillende artiesten\."/);
  assert.match(index, /"Volgende nummer\."/);
  assert.match(index, /"Zet iets rustigers op\."/);
  assert.match(index, /Home Assistant haalt context, history en playbackstatus op/);
  assert.match(index, /DJConnect antwoordt met tekst, bronnen, afbeeldingen en optionele audio op je client, een gekozen Home Assistant speaker of allebei/);
  assert.match(index, /Play Now; playback start pas na jouw tap/);
  assert.match(index, /Van vraag naar actie/);
  assert.match(index, /Vraag om muziek, kies een player of output, start een suggestie of bevestig een vervolgactie/);
  assert.match(index, /Ask DJ Track Insight/);
  assert.match(index, /Laat Ask DJ uitleggen waarom een track werkt/);
  assert.match(index, /Geef Track Insight voor dit nummer/);
  assert.match(index, /genre, subgenre, mood, vibe, texture, emotionele toon, energie, instrumentatie, arrangement, productie, luistercues, similar tracks en visual profile/);
  assert.match(index, /Track Insight draait server-side in je Home Assistant integration/);
  assert.match(index, /Continuity op Watch, iPhone, Mac en Windows/);
  assert.match(index, /server-side per Home Assistant gebruiker/);
  assert.match(index, /is begrensd/);
  assert.match(index, /trimt Home Assistant oudste berichten/);
  assert.match(index, /trim metadata netjes in sync/);
  assert.match(index, /Follow-ups met Ja\/Nee/);
  assert.match(index, /Goedemorgen/);
  assert.match(index, /Wil je dit nu afspelen/);
  assert.match(index, /Home Assistant STT transcribeert/);
  assert.match(index, /TTS kan audio-antwoorden leveren/);
  assert.match(index, /Replay verschijnt alleen als er audio beschikbaar is/);
  assert.match(index, /Optionele meldingen/);
  assert.match(index, /pushmeldingen gebruiken als wake- of attentionhint voor Ask DJ-sync/);
  assert.match(index, /Push bevat geen tokens, volledige antwoorden, audio of history/);
  assert.match(index, /Raspberry Pi leest mee/);
  assert.match(index, /Raspberry Pi heeft geen lokale audio-output/);
  assert.match(index, /ESP32 blijft device-speaker/);
  assert.match(index, /ESP32 gebruikt de bestaande device-speaker\/DJ response flow met PTT\/playback commands en krijgt geen Ask DJ chat history/);
  assert.match(index, /iOS, macOS, Apple Watch en Windows kunnen voice\/PTT gebruiken/);
  assert.match(index, /Push contains no tokens, full replies, audio or history/);
  assert.match(index, /Ask DJ works without Music DNA/);
  assert.match(index, /Music DNA is opt-in/);
  assert.match(index, /You can clear Music DNA at any time/);
  assert.match(index, /Clients do not store your persistent Music DNA profile/);
  assert.match(index, /<section id="discover" class="technical-analysis">/);
  assert.match(index, /Ontdek is een backend-owned aanbevelingenfeed, geen recent-played lijst/);
  assert.match(index, /Home Assistant bouwt persoonlijke secties uit Music DNA en Spotify recent\/top profile data/);
  assert.match(index, /new_for_you, rediscover, artist_spotlight en accepted_recommendations/);
  assert.match(index, /clients renderen de volgorde en hardcoden geen section ids/);
  assert.match(index, /Discover wordt server-side ongeveer uurlijks ververst zolang Music DNA enabled is/);
  assert.match(index, /nieuwe profile data, mood, Play Now of negatieve feedback kan een rebuild triggeren/);
  assert.match(index, /backend-owned reason, reason_sources, quality_score, quality_band en quality_factors/);
  assert.match(index, /Play Now loopt via \/api\/djconnect\/v1\/music_discovery\/play/);
  assert.match(index, /negatieve feedback via \/api\/djconnect\/v1\/music_discovery\/feedback met not_for_me, less_like_this of hide_artist/);
  assert.match(index, /Known, recent en blocked tracks, live\/remix\/radio edit\/remaster varianten, album\/title overlap en artist overload worden server-side gefilterd/);
  assert.match(index, /iOS, macOS, Apple Watch, Raspberry Pi en Windows gebruiken hetzelfde Home Assistant contract/);
  assert.match(index, /clients bewaren geen aanbevelingen, redenen, quality data of blocklists lokaal/);
  assert.match(index, /Raw recently played tracks worden niet als Discover cards gepresenteerd tenzij de backend ze expliciet in sections teruggeeft/);
  assert.match(index, /Accepted recommendations en negatieve feedback worden als compacte Music DNA signalen teruggekoppeld naar Ask DJ/);
  assert.match(index, /APNs music_discovery_ready bevat geen aanbevelingen, alleen een open\/refresh hint/);
  assert.match(index, /Spotify credentials stay in Home Assistant/);
  assert.match(index, /Music DNA mag geen OAuth tokens, bearer tokens, raw audio, volledige prompts of onbeperkte Spotify luistergeschiedenis opslaan/);
  assert.match(index, /DJConnect's active integration routes use Home Assistant Assist\/STT\/TTS and do not call direct external AI\/STT\/TTS APIs/);
  assert.match(index, /snapshot_history en Spotify recent\/top profile data/);
  assert.match(index, /Spotify Premium en Client ID zijn alleen nodig voor Spotify Direct/);
  assert.match(index, /Music Assistant gebruikt eigen providers/);
  assert.match(index, /Ask DJ hoorbaar in de kamer/);
  assert.match(index, /Home Assistant media_player als speaker voor DJ-aankondigingen/);
  assert.match(index, /Ask DJ blijft de intelligentie en persoonlijkheid; de gekozen HA speaker is de fysieke DJ-stem in de ruimte/);
  assert.match(index, /Met de Assist-agent route kun je tegen DJConnect praten via Home Assistant Voice/);
  assert.match(index, /announcement-speaker route kan DJConnect via een Home Assistant speaker terugpraten als DJ-stem in de kamer/);
  assert.match(index, /Apparaat \+ Home Assistant speaker/);
  assert.match(index, /Alleen Home Assistant speaker/);
  assert.match(index, /Alleen tekst/);
  assert.match(index, /zonder speaker blijven speaker-modi locked/);
  assert.match(index, /Raspberry Pi heeft geen lokale audio-output/);
  assert.match(index, /Pi ondersteunt tekst-only en, als in Home Assistant een announcement speaker is gekozen, Home Assistant speaker-output/);
  assert.match(index, /ESP32 gebruikt de bestaande device-speaker\/DJ response flow/);
  assert.match(index, /DJ-aankondigingen zijn geen Spotify ducking of mixing/);
  assert.match(index, /pauzeert DJConnect Spotify niet, hervat niet en past volume niet automatisch aan/);
  assert.match(index, /de DJ-stem speelt apart via de gekozen Home Assistant speaker/);
  assert.match(index, /Music Assistant kan later mogelijk rijkere native announce, current-output of ducking krijgen/);
  assert.match(index, /DJConnect spreekt via de expliciet gekozen Home Assistant speaker/);
  assert.doesNotMatch(index, /HACS DJConnect integration v3\.1\.69\+/);
  assert.match(index, /Home Assistant, HACS DJConnect integration v3\.2\.44 of nieuwer, een music backend, lokale pairing/);
  assert.match(index, /For concrete recommendations you choose Play Now yourself; playback starts only after your tap/);
  assert.match(index, /Spotify is a trademark of Spotify AB/);
  assert.match(index, /DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB/);
  assert.doesNotMatch(index, /Spotify stream analysis/i);
  assert.doesNotMatch(index, /DJConnect listens to Spotify audio/i);
  assert.doesNotMatch(index, /Spotify volume automatisch omlaag/i);
  assert.doesNotMatch(index, /Spotify audio mixt/i);
  assert.doesNotMatch(index, /official Spotify partner/i);
  assert.doesNotMatch(index, /powered by Spotify/i);
  assert.doesNotMatch(index, new RegExp("B" + "PM", "i"));
  assert.doesNotMatch(index, new RegExp("key" + " signature", "i"));
  assertTranslationsCoverPage(index, "homepage");
});

test("public pages document VibeCast Apple client parity", async () => {
  const [features, platform, ios, macos, translations] = await Promise.all([
    read("wwwroot/features.html"),
    read("wwwroot/platform.html"),
    read("wwwroot/ios.html"),
    read("wwwroot/macos.html"),
    readPageTranslations()
  ]);

  assert.match(features, /<h2 data-i18n="vibecastTitle">VibeCast<\/h2>/);
  assert.match(features, /premium-ready DJConnect feed voor Apple clients/);
  assert.match(features, /Home Assistant blijft de bron van waarheid/);
  assert.match(features, /Spotify Direct, Music Assistant en toekomstige backends lopen via DJConnect backend abstraction/);
  assert.match(features, /text, strong, emphasis, magnify, accent, emoji en line_break/);
  assert.match(features, /WebSocket of push kan later worden toegevoegd zonder contractbreuk/);
  assert.match(features, /Disabled responses blijven JSON met enabled:false/);
  assert.match(features, /href="start\.html#vibecast"/);

  assert.match(platform, /Backend-neutrale Apple feed via \/api\/djconnect\/v1\/vibecast/);
  assert.match(platform, /iOS en macOS krijgen dezelfde VibeCast contentkwaliteit/);
  assert.match(platform, /current-track resolution, cache, TTL, revision en disabled reasons/);

  assert.match(ios, /GET \/api\/djconnect\/v1\/vibecast met client_type:"ios"/);
  assert.match(ios, /dezelfde response, item kinds, structured text segmenttypes, disabled reasons, TTL, polling en cache semantics als macOS/);
  assert.match(ios, /backend behandelt iOS en macOS niet verschillend/);

  assert.match(macos, /GET \/api\/djconnect\/v1\/vibecast met client_type:"macos"/);
  assert.match(macos, /dezelfde response, item kinds, structured text segmenttypes, disabled reasons, TTL, polling en cache semantics als iOS/);
  assert.match(macos, /backend behandelt macOS en iOS niet verschillend/);

  for (const language of supportedLanguages) {
    assert.ok(translations.features[language].vibecastLead, `features ${language} should translate VibeCast lead`);
    assert.ok(translations.platform[language].legendVibecastText, `platform ${language} should translate VibeCast parity`);
    assert.ok(translations.ios[language].vibecastText, `ios ${language} should translate VibeCast`);
    assert.ok(translations.macos[language].vibecastText, `macos ${language} should translate VibeCast`);
    assert.ok(translations.start[language].vibecastReasonsText, `start ${language} should translate VibeCast disabled reasons`);
  }
});

test("developers page documents technical architecture and API contracts", async () => {
  const [developers, platform, sitemap, translations] = await Promise.all([
    read("wwwroot/developers.html"),
    read("wwwroot/platform.html"),
    read("wwwroot/sitemap.xml"),
    readPageTranslations()
  ]);

  assert.match(platform, /href="developers\.html">Developers<\/a>/);
  assert.match(sitemap, /https:\/\/djconnect\.dev\/developers/);
  assert.match(developers, /Developer Documentation/);
  assert.match(developers, /Home Assistant is the orchestration point/);
  assert.match(developers, /Home Assistant DJConnect integration/);
  assert.match(developers, /Central API \/ APNs relay/);
  assert.match(developers, /pcvantol\/djconnect-api/);
  assert.match(developers, /djconnect-lilygo-t-embed-s3-XXXXXXXXXXXX/);
  assert.match(developers, /client_type: "esp32"/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/status/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/command/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/voice/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/ask_dj\/message/);
  assert.match(developers, /GET \/api\/djconnect\/v1\/ask_dj\/history\?since_revision=&lt;number&gt;/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/ask_dj\/idle_suggestion/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/music_dna\/profile/);
  assert.match(developers, /snapshot_history/);
  assert.match(developers, /privacy_dashboard/);
  assert.match(developers, /discovery_feedback/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/music_dna\/export/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/music_dna\/import/);
  assert.match(developers, /GET \/api\/djconnect\/v1\/music_discovery/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/music_discovery\/refresh/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/music_discovery\/play/);
  assert.match(developers, /POST \/api\/djconnect\/v1\/music_discovery\/feedback/);
  assert.match(developers, /not_for_me/);
  assert.match(developers, /less_like_this/);
  assert.match(developers, /hide_artist/);
  assert.match(developers, /reason_sources/);
  assert.match(developers, /quality_score/);
  assert.match(developers, /quality_band/);
  assert.match(developers, /quality_factors/);
  assert.match(developers, /WebSocket djconnect\/capabilities/);
  assert.match(developers, /features/);
  assert.match(developers, /fallbacks/);
  assert.match(developers, /Music DNA import\/export remains HTTP-only/);
  assert.match(developers, /track_versions_search/);
  assert.match(developers, /never starts playback automatically/);
  assert.match(developers, /Clients never render recommendations from push payloads/);
  assert.match(developers, /GET \/api\/djconnect\/v1\/image_proxy\/\{token\}/);
  assert.match(developers, /POST \/api\/device\/ota/);
  assert.match(developers, /messages\[\]<\/code> is canonical for render order/);
  assert.match(developers, /music_backend_capabilities/);
  assert.match(developers, /firmware_manifest\.json/);
  assert.match(developers, /HTTP <code>426<\/code> with <code>error: "version_mismatch"/);
  assert.match(developers, /No Spotify credentials on ESP\/app clients/);
  assert.match(developers, /Spotify is a trademark of Spotify AB/);
  assert.doesNotMatch(developers, /AuthKey_/);
  assert.doesNotMatch(developers, /sk_live|client_secret|refresh_token/i);

  for (const language of supportedLanguages) {
    assert.ok(translations.developers[language].heroLead, `developers ${language} should translate hero lead`);
    assert.ok(translations.developers[language].introText, `developers ${language} should translate intro`);
  }
});

test("all public nav pages include the mobile hamburger menu", async () => {
  const [navCss, navJs] = await Promise.all([
    read("wwwroot/assets/site-nav.css"),
    read("wwwroot/assets/site-nav.js")
  ]);

  assert.match(navCss, /\.nav-links\.is-open/);
  assert.match(navCss, /\.menu-toggle/);
  assert.match(navCss, /body\.site-nav-open::before/);
  assert.match(navCss, /position: fixed/);
  assert.match(navCss, /translateX\(-105%\)/);
  assert.match(navCss, /text-align: left/);
  assert.match(navJs, /const menuToggle/);
  assert.match(navJs, /setMenuOpen/);
  assert.match(navJs, /site-nav-open/);

  const translations = await readPageTranslations();

  for (const page of publicPages) {
    const html = await read(`wwwroot/${page}.html`);
    assert.match(html, /class="menu-toggle"/, `${page} should include a mobile menu button`);
    assert.match(html, /aria-expanded="false"/, `${page} should expose collapsed menu state`);
    assert.match(html, /aria-controls="primaryNav"/, `${page} should connect the menu button to primary nav`);
    assert.match(html, /id="primaryNav"/, `${page} should identify the primary nav`);
    assert.equal(translations[page].nl.navMenu, "Menu", `${page} should translate the menu label`);
    assert.match(html, /assets\/site-nav\.css/, `${page} should include shared nav CSS`);
    assert.match(html, /assets\/site-nav\.js/, `${page} should include shared nav behavior`);
    assert.doesNotMatch(html, /MOBILE_MENU_ENHANCEMENT/, `${page} should not duplicate mobile nav CSS`);
  }
});

test("public pages expose baseline accessibility affordances", async () => {
  const navCss = await read("wwwroot/assets/site-nav.css");

  assert.match(navCss, /\.skip-link/);
  assert.match(navCss, /:focus-visible/);
  assert.match(navCss, /min-width:\s*44px/);
  assert.match(navCss, /prefers-reduced-motion:\s*reduce/);

  for (const page of publicPages) {
    const html = await read(`wwwroot/${page}.html`);
    const h1Count = [...html.matchAll(/<h1[\s>]/g)].length;
    const mainCount = [...html.matchAll(/<main\b/g)].length;

    assert.equal(mainCount, 1, `${page} should expose exactly one main landmark`);
    assert.equal(h1Count, 1, `${page} should expose exactly one h1`);
    assert.match(html, /<a class="skip-link" href="#mainContent">/, `${page} should include a skip link`);
    assert.match(html, /<main id="mainContent">/, `${page} should expose a skip-link target`);
    assert.match(html, /<html lang="nl">/, `${page} should declare an initial page language`);
    assert.doesNotMatch(html, /<img\b(?=[^>]*alt="")(?![^>]*aria-hidden="true")/s, `${page} decorative images should be hidden from assistive tech`);
  }
});

test("homepage hero uses the current device visual and copy", async () => {
  const index = await read("wwwroot/index.html");
  assert.match(index, /device-stack/);
  assert.match(index, /carousel-button prev/);
  assert.match(index, /data-carousel-direction="-1"/);
  assert.match(index, /data-carousel-direction="1"/);
  assert.match(index, /carouselPrev: "Vorige slide"/);
  assert.match(index, /carouselNext: "Volgende slide"/);
  assert.match(index, /stack\.scrollBy/);
  assert.match(index, /class="signal-field"/);
  assert.match(index, /signalPulse/);
  assert.match(index, /waveTravel/);
  assert.match(index, /prefers-reduced-motion: reduce/);
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
  assert.match(start, /geschikte Home Assistant media_player speaker voor spoken DJ announcements/);
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
  assert.match(start, /3\. Kies je music backend/);
  assert.match(start, /Spotify Direct of Music Assistant/);
  assert.match(start, /Music Assistant geinstalleerd, providers geconfigureerd en een player geselecteerd/);
  assert.match(start, /remote pairing wordt niet ondersteund/);
  assert.match(start, /Pairing\/token bootstrap gebeurt bewust lokaal, niet remote/);
  assert.match(start, /Home Assistant en de DJConnect client zitten tijdens pairing op hetzelfde lokale netwerk/);
  assert.match(start, /Lokaal pairen, daarna remote gebruiken/);
  assert.match(start, /Na succesvolle pairing kunnen iPhone, Apple Watch, macOS en Windows remote werken als Home Assistant een externe\/Nabu Casa HTTPS URL heeft/);
  assert.match(start, /Lokale pairing voorkomt remote exposure van bootstrap/);
  assert.match(start, /vereist LAN-aanwezigheid plus een tijdelijke code of QR/);
  assert.match(start, /Remote pairing zou extra expiry, replay protection, rate limiting, phishing\/error states en afhankelijkheid van je external URL vragen/);
  assert.match(start, /HTTP 426 version_mismatch betekent client of integration updaten, niet pairing resetten/);
  assert.match(start, /Patchversies mogen verschillen; major\/minor moeten matchen/);
  assert.match(start, /ESP32-S3-BOX-3<\/td><td data-i18n="notSupported">Not supported/);
  assert.match(start, /Remote-capable na lokale pairing/);
  assert.match(start, /Inbound-only app client: djconnect-ios-XXXXXXXXXXXX, client_type ios, post naar \/api\/djconnect\/v1\/pair/);
  assert.match(start, /Inbound-only app client: djconnect-macos-XXXXXXXXXXXX, client_type macos, post naar \/api\/djconnect\/v1\/pair/);
  assert.match(start, /Inbound-only app client: djconnect-windows-XXXXXXXXXXXX, client_type windows, post naar \/api\/djconnect\/v1\/pair/);
  assert.match(start, /Local-device client met _djconnect\._tcp, optioneel Client adres en \/api\/device\/\*/);
  assert.match(start, /Geen losse Home Assistant pairing; de gekoppelde iPhone proxyt Watch identity en sync/);
  assert.match(start, /Geen device token, firmware controls of client pairing UI; STT\/TTS blijven in de HA Assist pipeline/);
  assert.match(start, /4\. Alleen Spotify Direct: maak een Spotify Developer app/);
  assert.match(start, /Sla deze stap over als je Music Assistant gebruikt/);
  assert.match(start, /Kies bij “Assist Conversation Agent” de DJConnect DJ agent voor Home Assistant Assist/);
  assert.match(start, /Kies in “Spraak en playback” optioneel een Home Assistant speaker voor DJ-aankondigingen/);
  assert.match(start, /DJ-aankondigingen via Home Assistant speaker/);
  assert.match(start, /Ask DJ blijft de intelligentie en persoonlijkheid/);
  assert.match(start, /iPhone, iPad, macOS, Apple Watch en Windows ondersteunen Apparaat, Apparaat \+ Home Assistant speaker, Alleen Home Assistant speaker en Alleen tekst/);
  assert.match(start, /Raspberry Pi heeft geen lokale audio-output en ondersteunt tekst-only of HA speaker/);
  assert.match(start, /ESP32 blijft de bestaande device-speaker\/DJ response flow gebruiken/);
  assert.match(start, /Bij Spotify Direct blijft Spotify playback gewoon doorspelen/);
  assert.match(start, /DJConnect pauzeert Spotify niet, hervat niet en past volume niet automatisch aan/);
  assert.match(start, /https:\/\/&lt;your-home-assistant-external-url&gt;\/api\/djconnect\/spotify\/callback/);
  assert.match(start, /Nabu Casa HTTPS external URL/);
  assert.match(start, /VibeCast contract/);
  assert.match(start, /GET \/api\/djconnect\/v1\/vibecast/);
  assert.match(start, /Supported Apple client types zijn ios, macos en watchos/);
  assert.match(start, /enabled:true, revision, ttl_seconds, poll_after_seconds, context, items\[\]/);
  assert.match(start, /music_backend, music_backend_name en music_backend_revision/);
  assert.match(start, /track_fact, artist_fact, album_fact, genre_fact, trivia, listening_tip, mood_note, production_note, history_note en system/);
  assert.match(start, /text, strong, emphasis, magnify, accent, emoji en line_break/);
  assert.match(start, /geen HTML of Markdown te parsen/);
  assert.match(start, /enabled:false, reason, ttl_seconds, poll_after_seconds en items:\[\]/);
  assert.match(start, /feature_disabled, premium_unavailable, no_active_playback, playback_inactive, unknown_track, unsupported_backend, provider_unavailable, generative_provider_unavailable, rate_limited, cache_failure, unauthorized, invalid_client_type, client_type_mismatch en privacy_disabled/);
  assert.match(start, /client_type:"macos" en client_type:"ios"/);
  assert.match(start, /contentkwaliteit, premium entitlement, fact generation, cache, TTL, revision of current-track resolution/);
  assert.match(start, /Home Assistant\/backend playback is de source of truth/);
  assert.match(start, /Spotify Direct, Music Assistant en toekomstige backends lopen via DJConnect backend abstraction/);
  assert.match(start, /WebSocket of push kan later worden toegevoegd zonder contractbreuk/);
  assert.match(start, /DJConnect gebruikt PKCE/);
  assert.match(start, /Spotify Client Secret is bij voorkeur niet nodig/);
  assert.match(start, /Open het Spotify Developer Dashboard/);
  assert.match(start, /Maak een nieuwe app aan/);
  assert.match(start, /Kopieer de Spotify Client ID/);
  assert.match(start, /Vul de Client ID in tijdens de DJConnect setup\/config-flow/);
  assert.match(start, /Autoriseer Spotify via Home Assistant/);
  assert.match(start, /5\. Configureer DJConnect/);
  assert.match(start, /Voeg DJConnect toe als Home Assistant integratie, kies je music backend/);
  assert.match(start, /Open Home Assistant <strong>Settings -> Devices & services -> Add integration -> DJConnect<\/strong>/);
  assert.match(start, /Kies Spotify Direct of Music Assistant als music backend/);
  assert.match(start, /Bij Spotify Direct: vul je Client ID in en autoriseer Spotify via Home Assistant/);
  assert.match(start, /Bij Music Assistant: selecteer je Music Assistant player; Spotify OAuth in DJConnect is dan niet nodig/);
  assert.match(start, /niet via directe externe STT\/TTS APIs/);
  assert.match(start, /Optioneel: lokale websocket fast path/);
  assert.match(start, /Home Assistant \/api\/websocket gebruiken voor lage-latency commands/);
  assert.match(start, /djconnect\/capabilities/);
  assert.match(start, /HTTP blijft de fallback voor remote gebruik, pairing, voice uploads, history sync en media URLs/);
  assert.match(start, /id="client-ios" checked/);
  assert.match(start, /id="client-macos"/);
  assert.match(start, /id="client-windows"/);
  assert.match(start, /id="client-assist"/);
  assert.match(start, /id="client-esp"/);
  assert.match(start, /id="client-raspberry"/);
  assert.match(
    start,
    /<label for="client-ios" role="tab">iOS<\/label>\s*<label for="client-macos" role="tab">macOS<\/label>\s*<label for="client-windows" role="tab">Windows<\/label>\s*<label for="client-assist" role="tab">Voice Assistant<\/label>\s*<label for="client-raspberry" role="tab">Linux<\/label>\s*<label for="client-esp" role="tab">ESP32<\/label>/
  );
  assert.match(start, /href="voice-assistant\.html">Bekijk Voice Assistant uitleg/);
  assert.match(start, /Kies in de DJConnect setup voor <strong>Assist Conversation Agent<\/strong>/);
  assert.match(start, /Geen client pairing, device token of Client adres nodig/);
  assert.match(start, /Download ESP firmware/);
  assert.match(start, /Download iOS app/);
  assert.match(start, /Download macOS app/);
  assert.match(start, /href="windows\.html">Download Windows app/);
  assert.match(start, /Installeer de DJConnect Windows desktop app zodra je build beschikbaar is/);
  assert.match(start, /Download Linux app/);
  assert.match(start, /Installeer de DJConnect Raspberry Pi app via GitHub/);
  assert.match(start, /Zet het DJConnect device aan en verbind het device met WiFi via captive portal of Home Assistant BLE WiFi provisioning/);
  assert.match(start, /Open de DJConnect app op hetzelfde lokale netwerk als Home Assistant/);
  assert.match(start, /Scan de QR\/deep-link payload die Home Assistant genereert/);
  assert.match(start, /Voor Apple Watch genereert Home Assistant een aparte Watch QR\/deep-link payload/);
  assert.match(start, /iPhone geeft de pairinggegevens door aan de gekoppelde Watch/);
  assert.match(start, /Voer handmatig de lokale Home Assistant URL en de door Home Assistant gegenereerde koppelcode in/);
  assert.match(start, /Geen Client adres kopiëren: de app belt Home Assistant zelf via \/api\/djconnect\/v1\/\.\.\./);
  assert.match(start, /Daarna kan de app lokaal of remote werken via je Home Assistant URL/);
  assert.match(start, /Technisch: app-clients zijn inbound-only/);
  assert.match(start, /Home Assistant belt nooit terug naar de app/);
  assert.match(start, /de client post zelf naar POST \/api\/djconnect\/v1\/pair/);
  assert.match(start, /geen app-client mDNS\/local-API discovery of fallback/);
  assert.match(start, /Technisch: local-device clients blijven lokaal/);
  assert.match(start, /gebruiken lokale \/api\/device\/\*/);
  assert.match(start, /Zij krijgen geen ha_remote_url/);
  assert.doesNotMatch(start, /Kies client type <strong>iOS app<\/strong> of <strong>macOS app<\/strong>/);
  assert.match(start, /Kies client type Raspberry Pi app en koppel lokaal op hetzelfde netwerk/);
  assert.match(start, /Raspberry Pi gebruikt _djconnect\._tcp of Client adres, lokale \/api\/device\/\* runtime\/device-connectiviteit en blijft local-only/);
  assert.match(start, /Voer de koppelcode in van het device/);
  assert.match(start, /Het DJConnect ESP32 apparaat gebruikt _djconnect\._tcp of Client adres, alleen de lokale \/api\/device\/\* device API en blijft local-only/);
  assert.match(start, /Release- en downloadlinks/);
  assert.match(start, /pcvantol\/djconnect-app-releases/);
  assert.match(start, /pcvantol\/djconnect-firmware/);
  assert.match(start, /pcvantol\/djconnect-pi-releases/);
  assert.match(start, /Apple push is optioneel en alleen een wake\/sync hint/);
  assert.match(start, /geen Spotify tokens, HA tokens, raw prompts, raw audio, volledige Ask DJ history of Music DNA/);
  assert.doesNotMatch(start, /Voor iOS is de Client API URL verplicht/);
  assert.doesNotMatch(start, /Voor macOS is de Client API URL verplicht/);
  assert.doesNotMatch(start, /De Linux app gebruikt dezelfde lokale Home Assistant koppeling/);
  assert.doesNotMatch(start, /Als automatische discovery \(mDNS\) niet werkt/);
  assert.doesNotMatch(start, /<li>Rond koppeling af<\/li>/);
  assert.match(start, /6\. Koppel app of device lokaal/);
  assert.match(start, /7\. Klaar voor gebruik/);
  assert.match(start, /href="embedded\.html">Download ESP firmware<\/a>/);
  assert.match(start, /href="ios\.html"/);
  assert.match(start, /href="macos\.html"/);
  assert.match(start, /Bekijk in About\/Diagnostics je connection mode, actieve backend, target player en capabilities/);
  assert.doesNotMatch(start, /href="#troubleshooting"/);
  assert.doesNotMatch(start, /id="troubleshooting"/);
  assert.doesNotMatch(start, /Problemen oplossen/);
  assert.doesNotMatch(start, /Geen Spotify playback/);
  assert.doesNotMatch(start, /Spotify OAuth of redirect fout/);
  assert.doesNotMatch(start, /Ververs HACS update informatie/);
  assert.match(start, /Spotify is a trademark of Spotify AB/);
  assert.match(start, /DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB/);
  assert.match(start, /Optioneel: Track Insight providers/);
  assert.match(start, /Track Insight werkt standaard met beschikbare playbackcontext/);
  assert.match(start, /Optionele metadata- of contextproviders blijven server-side in Home Assistant/);
  assert.match(start, /clients render the analysis and do not calculate conclusions locally/);
  assert.match(start, /Voor Ontdek: Music DNA consent in Home Assistant/);
  assert.match(start, /Ontdek bouwt aanbevelingen server-side via Home Assistant/);
  assert.match(start, /werkt pas na expliciete Music DNA consent/);
  assert.match(start, /aanbevelingen, artwork, redenen en Play Now-acties uit het backendcontract/);
  assertTranslationsCoverPage(start, "start page");
});

test("features page describes core functions and bonus games", async () => {
  const features = await read("wwwroot/features.html");
  assert.match(features, /data-i18n="heroTitle">Features<\/h1>/);
  assert.match(features, /href="platform\.html" data-i18n="heroPlatformCta">Bekijk platform overview<\/a>/);
  assert.match(features, /Muziek aanvragen/);
  assert.match(features, /data-i18n="askDjTitle">Slimme follow-ups<\/h3>/);
  assert.match(features, /Ask DJ geeft niet alleen antwoord, maar ook acties/);
  assert.match(features, /Ask DJ Track Insight/);
  assert.match(features, /genre, subgenre, mood, vibe, texture, emotionele toon, energie, danceability, intensiteit, confidence, productie, instrumentatie, arrangement, luistercues, similar tracks en visual profile/);
  assert.match(features, /DJ-aankondigingen via HA speaker/);
  assert.match(features, /media_player voor spoken DJ announcements/);
  assert.match(features, /App-clients kunnen audio op apparaat, apparaat \+ HA speaker, alleen HA speaker of alleen tekst zetten/);
  assert.match(features, /Raspberry Pi gebruikt tekst-only of HA speaker/);
  assert.match(features, /Home Assistant Voice als route/);
  assert.match(features, /DJConnect satellites zijn je apps, Pi, ESP32, Watch en Windows/);
  assert.match(features, /Geen Spotify ducking/);
  assert.match(features, /Bij Spotify Direct blijft Spotify playback gewoon doorspelen/);
  assert.match(features, /mixt of duckt Spotify-volume niet/);
  assert.match(features, /Read-only: analyse verandert nooit je playback/);
  assert.match(features, /analysis never changes playback/);
  assert.match(features, /Gebruik dezelfde flow op Mac, Windows, iOS, Linux en ESP32/);
  assert.match(features, /Desktopbediening met Ask DJ, playback-acties en veilige tokenopslag in Windows Credential Manager/);
  assert.match(features, /Ask DJ works without Music DNA/);
  assert.match(features, /Music DNA is opt-in/);
  assert.match(features, /snapshot_history, privacy_dashboard en discovery_feedback komen uit de backend/);
  assert.match(features, /geen raw playback history/);
  assert.match(features, /data-i18n="discoverCoreTitle">Ontdek/);
  assert.match(features, /Ontdek is backend-owned recommendations, not recently played/);
  assert.match(features, /ongeveer uurlijks secties met reasons, quality scores, freshness\/dedupe en Play Now\/negative feedback/);
  assert.match(features, /Spotify credentials stay in Home Assistant/);
  assert.match(features, /Ask DJ does more than answer: it gives you actions/);
  assert.doesNotMatch(features, new RegExp("B" + "PM", "i"));
  assert.doesNotMatch(features, new RegExp("key" + " signature", "i"));
  assert.match(features, /Music backend playback/);
  assert.match(features, /Speaker keuze/);
  assert.match(features, /Home Assistant hub/);
  assert.match(features, /Spotify Direct of Music Assistant playback/);
  assert.match(features, /DJ aankondigingen/);
  assert.match(features, /Veilige koppeling/);
  assert.match(features, /macOS/);
  assert.match(features, /Windows/);
  assert.match(features, /iOS en Apple Watch/);
  assert.match(features, /Linux/);
  assert.match(features, /ESP32 device/);
  assert.match(features, /Bonus: mini-games/);
  assert.match(features, /Paddle Rally, Meteor Run, Sky Dash & Maze Chase/);
  assertTranslationsCoverPage(features, "features page");
});

test("platform overview page renders the CSS architecture map", async () => {
  const platform = await read("wwwroot/platform.html");
  assert.match(platform, /<title>DJConnect Platform overview<\/title>/);
  assert.match(platform, /href="https:\/\/djconnect\.dev\/platform"/);
  assert.match(platform, /data-i18n="heroTitle">Hoe DJConnect samenwerkt<\/h1>/);
  assert.match(platform, /DJConnect platform architectuur/);
  assert.match(platform, /macOS/);
  assert.match(platform, /Windows/);
  assert.match(platform, /iOS/);
  assert.match(platform, /Linux \/ Raspberry Pi/);
  assert.match(platform, /ESP32 device/);
  assert.match(platform, /Home WiFi/);
  assert.match(platform, /Voice input/);
  assert.match(platform, /Home Assistant/);
  assert.match(platform, /DJConnect integration/);
  assert.match(platform, /Assist pipeline: local/);
  assert.match(platform, /cloud/);
  assert.match(platform, /mixed/);
  assert.match(platform, /Spotify Direct/);
  assert.match(platform, /Music Assistant/);
  assert.match(platform, /Clients tonen acties die de actieve backend ondersteunt/);
  assert.match(platform, /ESP32 en Raspberry Pi blijven local-only/);
  assert.match(platform, /\.overview/);
  assert.match(platform, /\.flow-line/);
  assert.match(platform, /<div class="overview"/);
  assert.match(platform, /<div class="flow-line"/);
  assertTranslationsCoverPage(platform, "platform overview page");
});

test("voice commands page documents intent families and DJ response styles", async () => {
  const voice = await read("wwwroot/voice-commands.html");
  const intents = await read("wwwroot/assets/voice-intents.js");
  const sitemap = await read("wwwroot/sitemap.xml");
  const prompt = await read("VOICE_INTENT_DATA_PROMPT.md");
  const handoff = await read("HANDOFF.md");

  assert.match(voice, /<title>DJConnect Spraakopdrachten<\/title>/);
  assert.match(voice, /href="https:\/\/djconnect\.dev\/voice-commands"/);
  assert.match(voice, /DJConnect luistert naar natuurlijke muziekopdrachten/);
  assert.match(voice, /Huidige track status/);
  assert.match(voice, /Playback control/);
  assert.match(voice, /Default playlist \/ favorieten/);
  assert.match(voice, /Artiest \+ track/);
  assert.match(voice, /Artist \/ artiest fallback/);
  assert.doesNotMatch(voice, /data-i18n="artistFirstTitle"/);
  assert.doesNotMatch(voice, /data-i18n="supportedNow"/);
  assert.doesNotMatch(voice, /Artist-first bij generieke verzoeken/);
  assert.match(voice, /DJ response stijlen/);
  assert.match(voice, /Neutraal en zakelijk/);
  assert.match(voice, /Warm en persoonlijk/);
  assert.match(voice, /Humoristisch en gevat/);
  assert.match(voice, /Vrij in te vullen/);
  assert.match(voice, /Ik zet Echo Vale voor je klaar/);
  assert.match(voice, /De gekozen stijl verandert alleen de DJ-aankondiging, niet de muziekkeuze/);
  assert.match(voice, /AI- en Assist-antwoorden kunnen onjuist zijn/);
  assert.match(voice, /hangen af van je eigen Home Assistant installatie/);
  assert.match(voice, /Home Assistant Assist pipeline/);
  assert.match(voice, /Stem, taal en TTS-engine beheer je in Home Assistant Assist/);
  assert.match(voice, /ESPHome voice assistants/);
  assert.match(voice, /Home Assistant Voice Preview Edition/);
  assert.match(voice, /M5 Atom Echo/);
  assert.doesNotMatch(voice, /ESP32-S3-BOX-3/);
  assert.match(voice, /Home Assistant conversation agent/);
  assert.match(voice, /Assist Conversation Agent/);
  assert.match(voice, /href="https:\/\/esphome\.io\/projects\/"/);
  assert.match(voice, /<script src="assets\/voice-intents\.js"><\/script>/);
  assert.match(voice, /const intentFamilies = window\.DJCONNECT_VOICE_INTENTS \|\| \[\]/);
  assert.match(voice, /const askDjFamilies = window\.DJCONNECT_ASK_DJ_INTENTS \|\| \[\]/);
  assert.match(voice, /renderIntentFamilies\(lang, dictionary\)/);
  assert.match(voice, /renderAskDjFamilies\(lang, dictionary\)/);
  assert.match(voice, /family\.commands/);
  assert.match(voice, /dictionary\.noPlayback/);
  assert.match(voice, /Ask DJ voorbeelden/);
  assert.match(voice, /backend-aware Play Now-acties/);
  assert.match(voice, /Aanbevelingen starten niet automatisch/);
  assert.match(voice, /playback start pas na jouw tap/);
  assert.match(voice, /Ask DJ examples/);
  assert.doesNotMatch(voice, /data-examples-lang=/);
  assert.match(intents, /window\.DJCONNECT_VOICE_INTENTS = \[/);
  assert.match(intents, /window\.DJCONNECT_ASK_DJ_INTENTS = \[/);
  for (const language of supportedLanguages) {
    assert.match(intents, new RegExp(`"${language}":`), `voice intent data should include ${language}`);
  }
  assert.match(intents, /"de": "Was laeuft gerade\?"/);
  assert.match(intents, /"de": "Wiedergabe direkt steuern"/);
  assert.match(intents, /"fr": "Que joue-t-on maintenant \?"/);
  assert.match(intents, /"es": "Que esta sonando\?"/);
  assert.doesNotMatch(voice, /stored === "nl" \|\| stored === "en"/);
  assert.match(voice, /const localized = \(value, lang\)/);
  assert.match(voice, /const localizedList = \(value, lang\)/);
  const pageTranslations = await readPageTranslations();
  assert.equal(pageTranslations["voice-commands"].de.heroTitle, "Was kannst du sagen?");
  assert.equal(pageTranslations["voice-commands"].de.flow1, "Aktueller Trackstatus");
  assert.equal(pageTranslations["voice-commands"].de.navStart, "Loslegen");
  assert.notEqual(pageTranslations["voice-commands"].de.heroTitle, "What can you say?");
  const expectedIntentOrder = [
    "current_track",
    "playback_control",
    "default_playlist",
    "playlist",
    "artist_with_track",
    "album",
    "track",
    "artist"
  ];
  const voiceIntentSource = intents.split("window.DJCONNECT_ASK_DJ_INTENTS")[0];
  const actualIntentOrder = [...voiceIntentSource.matchAll(/"id": "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(actualIntentOrder, expectedIntentOrder);
  assert.match(intents, /"id": "current_track"/);
  assert.match(intents, /"id": "playback_control"/);
  assert.match(intents, /"id": "default_playlist"/);
  assert.match(intents, /"id": "playlist"/);
  assert.match(intents, /"id": "artist_with_track"/);
  assert.match(intents, /"id": "album"/);
  assert.match(intents, /"id": "track"/);
  assert.match(intents, /"id": "artist"/);
  assert.match(intents, /Welk nummer draait er nu\?/);
  assert.match(intents, /What song is playing\?/);
  assert.match(intents, /"playsMusic": false/);
  assert.match(intents, /"spotifyType": "status"/);
  assert.match(intents, /"spotifyType": "backend_command"/);
  assert.match(intents, /No Spotify search/);
  assert.match(intents, /"command": "pause"/);
  assert.match(intents, /"command": "play\/resume"/);
  assert.match(intents, /"command": "volume \+10"/);
  assert.match(intents, /"command": "volume -10"/);
  assert.match(intents, /"command": "next"/);
  assert.match(intents, /"command": "previous"/);
  assert.match(intents, /"command": "save_current_track"/);
  assert.match(intents, /Stop muziek/);
  assert.match(intents, /Start muziek/);
  assert.match(intents, /Zet harder/);
  assert.match(intents, /Zet zachter/);
  assert.match(intents, /Volgende nummer/);
  assert.match(intents, /Vorig nummer/);
  assert.match(intents, /Zet huidig nummer in favorieten/);
  assert.match(intents, /Voeg dit nummer toe aan favorieten/);
  assert.match(intents, /Save this track to liked songs/);
  assert.match(intents, /Like this track/);
  assert.match(intents, /Speel Neon Harbor/);
  assert.match(intents, /Start Silver Circuit/);
  assert.match(intents, /Play Neon Harbor/);
  assert.match(intents, /Speel nummer Moonlit Signal/);
  assert.match(intents, /Speel artiest Neon Harbor met nummer Moonlit Signal/);
  assert.match(intents, /Play song Moonlit Signal/);
  assert.match(intents, /Play Moonlit Signal by Neon Harbor/);
  assert.match(intents, /Play artist Neon Harbor with song Moonlit Signal/);
  assert.match(intents, /Speel album Velvet Weather/);
  assert.match(intents, /Zet de plaat Voorbeeldalbum van Voorbeeldartiest op/);
  assert.match(intents, /Play album Velvet Weather/);
  assert.match(intents, /Speel playlist DJConnect/);
  assert.match(intents, /Start mijn afspeellijst Roadtrip/);
  assert.match(intents, /Play playlist DJConnect/);
  assert.match(intents, /Speel mijn standaard playlist/);
  assert.match(intents, /Play my default playlist/);
  const askDjIntentSource = intents.split("window.DJCONNECT_ASK_DJ_INTENTS = [")[1];
  const actualAskDjIntentOrder = [...askDjIntentSource.matchAll(/"id": "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(actualAskDjIntentOrder, [
    "conversation_followup",
    "help",
    "music_discovery_help",
    "personal_music_dna_summary",
    "speaker_outputs",
    "retry_previous_request",
    "contextual_play_followup",
    "album_discography",
    "artist_item_list",
    "similar_artists",
    "artist_genre_style",
    "concert_agenda",
    "next_track_info",
    "current_track_versions",
    "track_versions_search",
    "personal_music_profile_analysis",
    "track_insight",
    "recently_played_history",
    "personal_music_recommendations",
    "seed_playlist_mix",
    "save_current_track",
    "dj_announcement",
    "ambient_music_fact",
    "idle_suggestion"
  ]);
  assert.match(intents, /Geeft niet/);
  assert.match(intents, /Wat kun je\?/);
  assert.match(intents, /Welke commando's kan ik gebruiken\?/);
  assert.match(intents, /"id": "music_discovery_help"/);
  assert.match(intents, /Wat is er nieuw in Discover\?/);
  assert.match(intents, /Ververs mijn Discover aanbevelingen/);
  assert.match(intents, /Hoe werkt Discover met feedback\?/);
  assert.match(intents, /Waarom past deze aanbeveling bij mijn smaak\?/);
  assert.match(intents, /Explanation questions do not mutate playback, Discover or Music DNA state/);
  assert.match(intents, /"id": "personal_music_dna_summary"/);
  assert.match(intents, /"action": "music_dna_summary"/);
  assert.match(intents, /"intent": "personal_music_dna_summary"/);
  assert.match(intents, /"sources": \[\s*"djconnect_music_dna"\s*\]/);
  assert.match(intents, /"images": \[\]/);
  assert.match(intents, /"playback_actions": \[\]/);
  assert.match(intents, /Wat weet je nu over mij\?/);
  assert.match(intents, /Wat weet DJConnect over mij\?/);
  assert.match(intents, /Wat staat er in mijn Music DNA\?/);
  assert.match(intents, /Wat zegt mijn Music DNA\?/);
  assert.match(intents, /Welke gegevens bewaart Music DNA over mij\?/);
  assert.match(intents, /What does DJConnect know about me\?/);
  assert.match(intents, /What is in my Music DNA\?/);
  assert.match(intents, /What data does Music DNA keep about me\?/);
  assert.match(intents, /server-side Music DNA/);
  assert.match(intents, /raw audio, OAuth tokens or full prompts/);
  assert.match(intents, /Welke speakers zijn er\?/);
  assert.match(intents, /Wissel van speaker/);
  assert.match(intents, /Move music to the living room speaker/);
  assert.match(intents, /Probeer opnieuw/);
  assert.match(intents, /Do that again/);
  assert.match(intents, /Speel maar af/);
  assert.match(intents, /Which artist do you mean\?/);
  assert.match(intents, /Welke albums hebben Voorbeeldartiest uitgebracht\?/);
  assert.match(intents, /Geef me de albums van Guns N' Roses/);
  assert.match(intents, /"id": "artist_item_list"/);
  assert.match(intents, /Welke muziek heeft Scooter gemaakt\?/);
  assert.match(intents, /Give me 5 songs by Echo Vale/);
  assert.match(intents, /Welke artiesten maken vergelijkbare muziek als wat nu speelt\?/);
  assert.match(intents, /Wat voor muziek maakt Beastie Boys\?/);
  assert.match(intents, /Wanneer speelt Voorbeeldartiest in Nederland\?/);
  assert.match(intents, /Wat wordt het volgende nummer\?/);
  assert.match(intents, /What will play next\?/);
  assert.match(intents, /"id": "current_track_versions"/);
  assert.match(intents, /Heb je een live versie\?/);
  assert.match(intents, /Find a remix of this track/);
  assert.match(intents, /"id": "track_versions_search"/);
  assert.match(intents, /"intent": "track_versions_search"/);
  assert.match(intents, /Geef me 10 uitvoeringen van Voorbeeldlied door verschillende artiesten/);
  assert.match(intents, /Doe me 10 uitvoeringen door verschillende artiesten van \\"Voorbeeldlied\\"/);
  assert.match(intents, /Zoek versies van \\"Voorbeeldlied\\"/);
  assert.match(intents, /Toon covers van \\"Voorbeeldlied\\"/);
  assert.match(intents, /Find versions of \\"Example Song\\"/);
  assert.match(intents, /Give me versions titled Example Song/);
  assert.match(intents, /requires every meaningful title-query word to appear in the found track title/);
  assert.match(intents, /does not start playback automatically/);
  assert.match(intents, /Omschrijf eens waar ik zoal naar luisterde de afgelopen maand/);
  assert.match(intents, /"id": "track_insight"/);
  assert.match(intents, /Geef Track Insight voor dit nummer/);
  assert.match(intents, /What makes this track special\?/);
  assert.match(intents, /"track_insight": true/);
  assert.match(intents, /Welke nummers heb ik afgelopen uur afgespeeld\?/);
  assert.match(intents, /Welke albums heb ik vandaag geluisterd\?/);
  assert.match(intents, /Which playlists did I play in the last hour\?/);
  assert.match(intents, /Ik voel me moe en geprikkeld, zet iets ontspannends klaar/);
  assert.match(intents, /Stel een playlist samen op basis van Voorbeeldartiest, Artiest A en Artiest B/);
  assert.match(intents, /Maak playlist obv huidig nummer/);
  assert.match(intents, /Queue similar tracks/);
  assert.match(intents, /Save this mix as a Spotify playlist/);
  assert.match(intents, /"id": "save_current_track"/);
  assert.match(intents, /"action": "set_current_track_favorite"/);
  assert.match(intents, /Toggle the currently playing Spotify track in the user's Liked Songs\/favorites/);
  assert.match(intents, /Geef me een leuke aankondiging voor wat nu speelt/);
  assert.match(intents, /Automatisch DJ feitje bij nieuw album of nieuwe artiest/);
  assert.match(intents, /Er speelt nu niets\. Zin in iets nieuws\?/);
  assert.match(intents, /"intent": "recently_played_history"/);
  assert.match(intents, /"intent_category": "informational"/);
  assert.match(intents, /"item_types": \[/);
  assert.match(intents, /"response_shape": \{/);
  assert.match(intents, /"plays_music": false/);
  assert.match(intents, /"playsMusic": false/);
  assert.match(intents, /Play Now (buttons|actions)/);
  assert.match(intents, /"messageKind": "system"/);
  assert.match(voice, /Music DNA-samenvattingen tonen geen oude album art, mediakaarten, TTS replay of Play Now-knoppen/);
  assert.match(voice, /Music DNA summaries show no old album art, media cards, TTS replay or Play Now buttons/);
  assert.match(voice, /Privacyvragen over Music DNA zijn tekst-only/);
  assert.match(voice, /Privacy questions about Music DNA are text-only/);
  assert.doesNotMatch(intents, /Zet shuffle aan/);
  assert.doesNotMatch(intents, /Turn shuffle on/);
  assert.match(voice, /Tip: noem 'nummer', 'album' of 'playlist'/);
  assert.doesNotMatch(voice, /sponsored/i);
  assert.doesNotMatch(voice, /endorsed/i);
  assert.match(sitemap, /https:\/\/djconnect\.dev\/voice-commands/);
  assert.match(prompt, /Lever uitsluitend gestructureerde intentdata aan/);
  assert.match(prompt, /examples\/voice_intents\.json/);
  assert.match(prompt, /current_track/);
  assert.match(prompt, /playback_control/);
  assert.match(prompt, /artist_with_track/);
  assert.match(prompt, /`Stop muziek` -> `pause`/);
  assert.match(prompt, /`Zet harder` -> volume `\+10`/);
  assert.match(prompt, /generieke artiestverzoeken artist-first/);
  assert.match(prompt, /`nummer`\/`liedje`\/`track`\/`song`/);
  assert.match(prompt, /`album`\/`plaat`/);
  assert.match(prompt, /`playlist`\/`afspeellijst`/);
  assert.match(prompt, /Laat website-rendering, styling, release, changelog en deploy buiten deze/);
  assert.match(handoff, /Canonical spoken music example data lives in `examples\/voice_intents\.json`/);
  assert.match(handoff, /pcvantol\/djconnect\/SYNC_PROMPTS\.md/);
  assert.match(handoff, /pcvantol\/djconnect\/PRODUCT_ROADMAP\.md/);
  assertTranslationsCoverPage(voice, "voice-commands page");
});

test("support page provides email support and technical issue fallback", async () => {
  const support = await read("wwwroot/support.html");

  assert.match(support, /<title>DJConnect Support<\/title>/);
  assert.match(support, /href="https:\/\/djconnect\.dev\/support"/);
  assert.match(support, /href="troubleshooting\.html" data-i18n="navTroubleshooting">Troubleshooting/);
  assert.match(support, /data-i18n="troubleshootingTitle">Troubleshooting/);
  assert.match(support, /macOS mDNS\/firewall-problemen/);
  assert.match(support, /href="troubleshooting\.html" data-i18n="troubleshootingButton">Open troubleshooting/);
  assert.match(support, /href="troubleshooting\.html" data-i18n="troubleshootingLink">Bekijk veelvoorkomende problemen en oplossingen/);
  assert.match(support, /href="mailto:support@djconnect\.dev">support@djconnect\.dev<\/a>/);
  assert.match(support, /data-i18n="heroTitle">Support<\/h1>/);
  assert.match(support, /Installatie/);
  assert.match(support, /Koppelen/);
  assert.match(support, /Muziekbediening/);
  assert.match(support, /href="https:\/\/github\.com\/pcvantol\/djconnect\/issues"/);
  assert.match(support, /Open GitHub Issues/);
  assertTranslationsCoverPage(support, "support page");
});

test("troubleshooting page covers common problems", async () => {
  const troubleshooting = await read("wwwroot/troubleshooting.html");
  const sitemap = await read("wwwroot/sitemap.xml");

  assert.match(troubleshooting, /<title>DJConnect Troubleshooting<\/title>/);
  assert.match(troubleshooting, /href="https:\/\/djconnect\.dev\/troubleshooting"/);
  assert.match(troubleshooting, /Spotify autorisatie lukt niet/);
  assert.match(troubleshooting, /\/api\/djconnect\/spotify\/callback/);
  assert.match(troubleshooting, /Nabu Casa HTTPS external URL/);
  assert.match(troubleshooting, /DJConnect verschijnt niet in HACS/);
  assert.match(troubleshooting, /Pairing met app of device faalt/);
  assert.match(troubleshooting, /Waarom kan ik de app niet remote pairen/);
  assert.match(troubleshooting, /Pairing\/token bootstrap is lokaal/);
  assert.match(troubleshooting, /Apple\/Windows apps hebben geen Client adres naar Home Assistant meer nodig/);
  assert.match(troubleshooting, /Apple Watch gebruikt de iPhone als Home Assistant transportproxy/);
  assert.match(troubleshooting, /Voice Assistant reageert niet goed/);
  assert.match(troubleshooting, /AI- en Assist-antwoorden kunnen onjuist zijn/);
  assert.match(troubleshooting, /Playback hangt af van je actieve music backend/);
  assert.match(troubleshooting, /Recent\/top\/favorites zijn met Music Assistant capability-dependent/);
  assert.match(troubleshooting, /Waarom werkt ESP\/Pi niet buiten huis/);
  assert.match(troubleshooting, /ESP32-S3-BOX-3 staat niet meer in de supported device lijst/);
  assert.match(troubleshooting, /Downloads, firmware of updates werken niet/);
  assert.match(troubleshooting, /support@djconnect\.dev/);
  assert.match(sitemap, /https:\/\/djconnect\.dev\/troubleshooting/);
  assertTranslationsCoverPage(troubleshooting, "troubleshooting page");
});

test("privacy policy page covers App Store requirements", async () => {
  const privacy = await read("wwwroot/privacy.html");
  const sitemap = await read("wwwroot/sitemap.xml");

  assert.match(privacy, /<title>DJConnect Privacy Policy<\/title>/);
  assert.match(privacy, /href="https:\/\/djconnect\.dev\/privacy"/);
  assert.match(privacy, /Privacy Policy/);
  assert.match(privacy, /geen advertentiecookies, trackingcookies of bezoekersprofielen/);
  assert.match(privacy, /without storing IP address, user agent, referrer or unique visitor ID/);
  assert.match(privacy, /Voor core gebruik is geen DJConnect cloud-account nodig/);
  assert.match(privacy, /Spotify credentials stay in Home Assistant/);
  assert.match(privacy, /Music Assistant provider credentials blijven in Music Assistant\/Home Assistant/);
  assert.match(privacy, /Remote pairing wordt niet ondersteund/);
  assert.match(privacy, /ESP32 bewaart geen Spotify credentials en krijgt geen Ask DJ chat history/);
  assert.match(privacy, /Ask DJ works without Music DNA/);
  assert.match(privacy, /Music DNA is opt-in/);
  assert.match(privacy, /You can clear Music DNA at any time/);
  assert.match(privacy, /Clients do not store your persistent Music DNA profile/);
  assert.match(privacy, /snapshot_history, privacy_dashboard en discovery_feedback/);
  assert.match(privacy, /Snapshot history is bounded en compact; het is geen raw playback history/);
  assert.match(privacy, /Ontdek gebruikt Music DNA alleen na opt-in/);
  assert.match(privacy, /toont eerst consent als Music DNA nog niet actief is/);
  assert.match(privacy, /Ontdek is een backend-owned aanbevelingenfeed, geen recently-played lijst/);
  assert.match(privacy, /raw recently played tracks worden niet als Discover cards gepresenteerd tenzij Home Assistant ze expliciet in sections teruggeeft/);
  assert.match(privacy, /Play Now en negatieve feedback tellen als compacte Music DNA signalen/);
  assert.match(privacy, /clients bewaren geen Music DNA of permanente blocklist lokaal/);
  assert.match(privacy, /DJConnect's active integration routes use Home Assistant Assist\/STT\/TTS and do not call direct external AI\/STT\/TTS APIs/);
  assert.match(privacy, /Diagnostics en logs redacteren secrets/);
  assert.match(privacy, /geen raw audio, full prompts, volledige Ask DJ history of Music DNA dumps/);
  assert.match(privacy, /DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB/);
  assert.match(privacy, /Apple meldingen/);
  assert.match(privacy, /api\.djconnect\.dev/);
  assert.match(privacy, /push-routingmetadata en minimale auditgegevens/);
  assert.match(privacy, /Pushberichten zijn minimale wake\/attention hints/);
  assert.match(privacy, /geen Spotify tokens, Home Assistant tokens, ruwe prompts, volledige Music DNA\/history, audio of lange DJ-antwoorden/);
  assert.match(privacy, /Push messages are minimal wake\/attention hints/);
  assert.match(privacy, /Voice en audio/);
  assert.match(privacy, /Home Assistant Assist pipeline/);
  assert.match(privacy, /support@djconnect\.dev/);
  assert.match(privacy, /href="mailto:support@djconnect\.dev"/);
  assert.match(sitemap, /https:\/\/djconnect\.dev\/privacy/);
  assertTranslationsCoverPage(privacy, "privacy policy page");
});

test("voice assistant page explains Assist Conversation Agent route", async () => {
  const assistant = await read("wwwroot/voice-assistant.html");
  const sitemap = await read("wwwroot/sitemap.xml");

  assert.match(assistant, /<title>DJConnect Voice Assistant<\/title>/);
  assert.match(assistant, /href="https:\/\/djconnect\.dev\/voice-assistant"/);
  assert.match(assistant, /Home Assistant Assist satellites die op ESPHome draaien/);
  assert.match(assistant, /Home Assistant Voice Preview Edition/);
  assert.match(assistant, /M5 Atom Echo/);
  assert.doesNotMatch(assistant, /ESP32-S3-BOX-3/);
  assert.match(assistant, /Assist Conversation Agent/);
  assert.match(assistant, /via Home Assistant Voice tegen DJConnect praten/);
  assert.match(assistant, /via een gekozen Home Assistant speaker als DJ-stem in de kamer terugpraten/);
  assert.match(assistant, /Twee routes, één DJ/);
  assert.match(assistant, /Met de Assist-agent route kun je tegen DJConnect praten via Home Assistant Voice/);
  assert.match(assistant, /announcement-speaker route kan DJConnect via een Home Assistant speaker terugpraten/);
  assert.match(assistant, /Home Assistant Voice Preview Edition, ESPHome voice satellites of speakers, Cast, Sonos, Music Assistant players/);
  assert.match(assistant, /Home Assistant registreert dan `DJConnect DJ` als conversation agent/);
  assert.match(assistant, /Kies in “Spraak en playback” optioneel een Home Assistant speaker voor DJ-aankondigingen/);
  assert.match(assistant, /AI- en Assist-antwoorden kunnen onjuist zijn/);
  assert.match(assistant, /hangen af van je eigen Home Assistant installatie/);
  assert.match(assistant, /DJConnect is geen onderdeel van ESPHome of Home Assistant/);
  assert.match(assistant, /href="https:\/\/esphome\.io\/projects\/"/);
  assert.match(sitemap, /https:\/\/djconnect\.dev\/voice-assistant/);
  assertTranslationsCoverPage(assistant, "voice-assistant page");
});

test("blog pages are present and translated", async () => {
  const [blog, post] = await Promise.all([
    read("wwwroot/blog.html"),
    read("wwwroot/blog-djconnect-project.html")
  ]);

  assert.match(blog, /<link rel="canonical" href="https:\/\/djconnect\.dev\/blog" \/>/);
  assert.match(blog, /href="blog-djconnect-project\.html"/);
  assert.match(blog, /DJConnect: muziekbediening met karakter/);
  assert.doesNotMatch(blog, /data-i18n="navBlog">Blog/);
  assert.match(blog, /href="voice-commands\.html" data-i18n="navVoice">Spraak/);

  assert.match(post, /<link rel="canonical" href="https:\/\/djconnect\.dev\/blog-djconnect-project" \/>/);
  assert.match(post, /Home Assistant als veilige basis/);
  assert.match(post, /macOS, Windows, iOS, Linux\/Raspberry Pi en ESP32/);
  assert.match(post, /privacyvriendelijk: alleen aggregate counters/);
  assert.match(post, /DJConnect: music control with character/);
});

test("raspberry pi page is prepared and translated", async () => {
  const raspberry = await read("wwwroot/raspberry-pi.html");
  assert.match(raspberry, /DJConnect voor Raspberry Pi/);
  assert.match(raspberry, /class="hyperpixel"/);
  assert.match(raspberry, /HyperPixel 4"/);
  assert.match(raspberry, /href="index\.html#apps" data-i18n="navPlatform">Platform<\/a>/);
  assert.match(raspberry, /data-i18n="hardwareTitle">Ondersteunde hardware<\/h2>/);
  assert.match(raspberry, /Raspberry Pi Zero 2 W \+ Pimoroni HyperPixel 4\.0 Square/);
  assert.match(raspberry, /aria-label="Ondersteunde Raspberry Pi hardware"/);
  assert.match(raspberry, /https:\/\/www\.sossolutions\.nl\/raspberry-pi-zero-2-w-header/);
  assert.match(raspberry, /https:\/\/shop\.pimoroni\.com\/products\/hyperpixel-4-square\?variant=30138251477075/);
  assert.match(raspberry, /data-i18n="setupTitle">Van kale Pi naar DJConnect<\/h2>/);
  assert.doesNotMatch(raspberry, /32 GB microSD-kaart/);
  assert.doesNotMatch(raspberry, /Raspberry Pi Zero 2 W met header/);
  assert.match(raspberry, /Flash Raspberry Pi OS Lite 64-bit/);
  assert.match(raspberry, /hostname, WiFi, SSH en locale/);
  assert.match(raspberry, /git clone https:\/\/github\.com\/pcvantol\/djconnect-pi\.git/);
  assert.match(raspberry, /sudo \.\/scripts\/bootstrap_raspberry_pi_os\.sh/);
  assert.match(raspberry, /data-copy-selector="\.bootstrap-command code"/);
  assert.match(raspberry, /data-i18n-attr="aria-label:copyBootstrap,title:copyBootstrap,data-copy-label:copyBootstrap,data-copied-label:copiedBootstrap"/);
  assert.match(raspberry, /The bootstrap belongs to the Pi repo/);
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

  assert.match(embedded, /--bg: #07091c/);
  assert.match(embedded, /--cyan: #38d7d2/);
  assert.match(embedded, /--green: #d13cff/);
  assert.match(embedded, /--purple: #7357ff/);
  assert.match(embedded, /radial-gradient\(circle at 86% 6%, rgba\(209, 60, 255, 0\.22\), transparent 27rem\)/);
  assert.match(embedded, /linear-gradient\(135deg, var\(--cyan\), var\(--green\)\)/);
  assert.doesNotMatch(embedded, /#7ef7a7/);
  assert.doesNotMatch(embedded, /#fb7185/);
});

test("site does not embed website repository releases", async () => {
  const pages = ["index", "start", "features", "platform", "voice-commands", "voice-assistant", "blog", "blog-djconnect-project", "support", "privacy", "ios", "testflight", "testflight-macos", "macos", "windows", "maccatalyst", "raspberry-pi", "embedded"];

  for (const page of pages) {
    const html = await read(`wwwroot/${page}.html`);
    assert.doesNotMatch(html, /data-github-repo="djconnect-website"/, `${page} must not load website releases`);
  }
});

test("macOS page shows public binary release repo", async () => {
  const macos = await read("wwwroot/macos.html");

  assert.doesNotMatch(macos, /href="macos-download\.html"/);
  assert.match(macos, /href="index\.html" data-i18n="navHome">Home<\/a>/);
  assert.match(macos, /href="index\.html#apps" data-i18n="navPlatform">Platform<\/a>/);
  assert.doesNotMatch(macos, /href="ios\.html">iOS<\/a>/);
  assert.doesNotMatch(macos, /href="embedded\.html">Embedded device<\/a>/);
  assertTranslationsCoverPage(macos, "macOS page");
  assert.match(macos, /data-github-downloads/);
  assert.match(macos, /data-download-target="macos"/);
  assert.doesNotMatch(macos, /data-download-target="ios"/);
  assert.match(macos, /href="#downloads">Download<\/a>/);
  assert.match(macos, /data-i18n="downloadCta">Download<\/a>/);
  assert.match(macos, /href="testflight-macos\.html" data-i18n="testflightCta">Join TestFlight beta<\/a>/);
  assert.match(macos, /data-i18n="testflightTitle">TestFlight beta<\/h2>/);
  assert.match(macos, /TestFlight beta's verlopen/);
  assert.match(macos, /Meldingen als synchint/);
  assert.match(macos, /via de DJConnect pushrelay/);
  assert.match(macos, /Ask DJ-antwoorden of wachtende keuzes/);
  assert.match(macos, /geen tokens, ruwe prompts of volledige history/);
  assert.match(macos, /Notifications as sync hints/);
  assert.match(macos, /data-i18n="releaseTitle">Laatste versie<\/h2>/);
  assert.doesNotMatch(macos, /Download binaries/);
  assert.doesNotMatch(macos, /Downloads voorbereid/);
  assert.doesNotMatch(macos, /Elke release toont/);
  assert.doesNotMatch(macos, /Each release shows/);
  assert.match(macos, /data-github-owner="pcvantol"/);
  assert.match(macos, /data-github-repo="djconnect-app-releases"/);
  assert.match(macos, /assets\/downloads\.js/);
});

test("Windows page shows Windows client release repo", async () => {
  const windows = await read("wwwroot/windows.html");

  assert.match(windows, /<title>DJConnect voor Windows<\/title>/);
  assert.match(windows, /href="https:\/\/djconnect\.dev\/windows"/);
  assert.match(windows, /href="index\.html" data-i18n="navHome">Home<\/a>/);
  assert.match(windows, /href="index\.html#apps" data-i18n="navPlatform">Platform<\/a>/);
  assert.match(windows, /data-i18n="heroTitle">DJConnect voor Windows<\/h1>/);
  assert.match(windows, /Windows Credential Manager/);
  assert.match(windows, /Spotify OAuth, Music DNA en backend playback blijven in Home Assistant/);
  assert.match(windows, /Ask DJ op desktop/);
  assert.match(windows, /Home Assistant STT\/TTS/);
  assert.match(windows, /data-github-downloads/);
  assert.match(windows, /data-github-repo="djconnect-app-releases"/);
  assert.match(windows, /data-download-target="windows"/);
  assert.match(windows, /data-release-limit="1"/);
  assert.match(windows, /assets\/downloads\.js/);
  assert.match(windows, /Unsigned validatiebuilds/);
  assert.match(windows, /geen Store-release, MSIX-package of signed installer/);
  assert.doesNotMatch(windows, /DJConnect pushrelay/);
  assert.doesNotMatch(windows, /TestFlight/);
  assert.doesNotMatch(windows, /App Store/);
  assertTranslationsCoverPage(windows, "Windows page");
});

test("Mac Catalyst page shows unsigned validation release repo", async () => {
  const macCatalyst = await read("wwwroot/maccatalyst.html");

  assert.match(macCatalyst, /<title>DJConnect Mac Catalyst<\/title>/);
  assert.match(macCatalyst, /href="https:\/\/djconnect\.dev\/maccatalyst"/);
  assert.match(macCatalyst, /href="index\.html" data-i18n="navHome">Home<\/a>/);
  assert.match(macCatalyst, /href="index\.html#apps" data-i18n="navPlatform">Platform<\/a>/);
  assert.match(macCatalyst, /data-i18n="heroTitle">DJConnect Mac Catalyst<\/h1>/);
  assert.match(macCatalyst, /Unsigned Mac Catalyst build/);
  assert.match(macCatalyst, /unsigned en niet genotariseerd/);
  assert.match(macCatalyst, /diagnostics en interne validatie/);
  assert.match(macCatalyst, /data-github-downloads/);
  assert.match(macCatalyst, /data-github-repo="djconnect-app-releases"/);
  assert.match(macCatalyst, /data-download-target="maccatalyst"/);
  assert.match(macCatalyst, /data-release-limit="1"/);
  assert.match(macCatalyst, /assets\/downloads\.js/);
  assert.doesNotMatch(macCatalyst, /TestFlight/);
  assert.doesNotMatch(macCatalyst, /App Store/);
  assertTranslationsCoverPage(macCatalyst, "Mac Catalyst page");
});

test("iOS page labels the platform route as home", async () => {
  const ios = await read("wwwroot/ios.html");
  assert.match(ios, /href="index\.html" data-i18n="navHome">Home<\/a>/);
  assert.match(ios, /href="index\.html#apps" data-i18n="navPlatform">Platform<\/a>/);
  assert.match(ios, /href="testflight\.html" data-i18n="testflightCta">Join TestFlight beta<\/a>/);
  assert.match(ios, /href="#downloads" data-i18n="navDownloads">Download<\/a>/);
  assert.match(ios, /TestFlight beta/);
  assert.match(ios, /TestFlight beta's verlopen/);
  assert.match(ios, /Client ID uit je eigen Spotify Developer app/);
  assert.match(ios, /Client ID from your own Spotify Developer app/);
  assert.match(ios, /Meldingen voor Ask DJ/);
  assert.match(ios, /via de DJConnect pushrelay/);
  assert.match(ios, /Ask DJ-antwoorden of keuzes die op je wachten/);
  assert.match(ios, /Ask DJ notifications/);
  assert.match(ios, /data-i18n="releaseTitle">Laatste versie<\/h2>/);
  assert.match(ios, /data-github-downloads/);
  assert.match(ios, /data-github-repo="djconnect-app-releases"/);
  assert.match(ios, /data-download-target="ios"/);
  assert.doesNotMatch(ios, /data-download-target="macos"/);
  assert.match(ios, /data-release-limit="1"/);
  assert.match(ios, /assets\/downloads\.js/);
  assert.doesNotMatch(ios, /href="macos\.html">macOS<\/a>/);
  assert.doesNotMatch(ios, /href="embedded\.html"/);
  assert.doesNotMatch(ios, /data-github-releases/);
  assert.doesNotMatch(ios, /data-github-repo="djconnect-website"/);
  assertTranslationsCoverPage(ios, "iOS page");
});

test("TestFlight page explains beta route", async () => {
  const testflight = await read("wwwroot/testflight.html");
  const testflightMacos = await read("wwwroot/testflight-macos.html");
  const sitemap = await read("wwwroot/sitemap.xml");

  assert.match(testflight, /<title>Join DJConnect TestFlight beta<\/title>/);
  assert.match(testflight, /href="https:\/\/djconnect\.dev\/testflight"/);
  assert.match(testflight, /Join TestFlight beta/);
  assert.match(testflight, /Installeer TestFlight/);
  assert.match(testflight, /Open de invite link/);
  assert.match(testflight, /Koppel lokaal met Home Assistant/);
  assert.match(testflight, /Spotify Direct of Music Assistant/);
  assert.match(testflight, /support@djconnect\.dev/);
  assert.match(testflight, /Plekken kunnen beperkt zijn/);
  assert.match(testflight, /Beta's verlopen/);
  assert.match(testflight, /data-testflight-link/);
  assert.match(testflight, /href="mailto:support@djconnect\.dev"/);
  assert.match(sitemap, /https:\/\/djconnect\.dev\/testflight/);
  assertTranslationsCoverPage(testflight, "TestFlight page");

  assert.match(testflightMacos, /<title>Join DJConnect macOS TestFlight beta<\/title>/);
  assert.match(testflightMacos, /href="https:\/\/djconnect\.dev\/testflight-macos"/);
  assert.match(testflightMacos, /Join macOS TestFlight beta/);
  assert.match(testflightMacos, /Installeer TestFlight/);
  assert.match(testflightMacos, /Mac App Store/);
  assert.match(testflightMacos, /Open de invite link/);
  assert.match(testflightMacos, /Koppel lokaal met Home Assistant/);
  assert.match(testflightMacos, /Spotify Direct of Music Assistant/);
  assert.match(testflightMacos, /Mac-model, macOS-versie/);
  assert.match(testflightMacos, /support@djconnect\.dev/);
  assert.match(testflightMacos, /Plekken kunnen beperkt zijn/);
  assert.match(testflightMacos, /Beta's verlopen/);
  assert.match(testflightMacos, /data-testflight-link/);
  assert.match(testflightMacos, /href="mailto:support@djconnect\.dev"/);
  assert.match(sitemap, /https:\/\/djconnect\.dev\/testflight-macos/);
  assertTranslationsCoverPage(testflightMacos, "macOS TestFlight page");
});

test("release proxy function is present", async () => {
  const [proxy, analytics] = await Promise.all([
    read("functions/api/releases.js"),
    read("functions/_shared/analytics.js")
  ]);
  assert.match(proxy, /githubHeaders\(env\)/);
  assert.match(proxy, /jsonResponse/);
  assert.match(analytics, /env\.GITHUB_TOKEN/);
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
  const [version, headers, downloads, ios, macos, windows, macCatalyst, raspberry, embedded] = await Promise.all([
    read("VERSION"),
    read("wwwroot/_headers"),
    read("wwwroot/assets/downloads.js"),
    read("wwwroot/ios.html"),
    read("wwwroot/macos.html"),
    read("wwwroot/windows.html"),
    read("wwwroot/maccatalyst.html"),
    read("wwwroot/raspberry-pi.html"),
    read("wwwroot/embedded.html")
  ]);
  const versionQuery = `assets/downloads.js?v=${version.trim()}`;

  assert.match(downloads, /const limit = Number\(root\.dataset\.releaseLimit \|\| 5\)/);
  assert.match(downloads, /const target = downloadTargetForRepo\(repo, root\.dataset\.downloadTarget\)/);
  assert.match(downloads, /root\.dataset\.downloadTarget/);
  assert.match(downloads, /fetchLimit = repo === "djconnect-app-releases" && target \? Math\.max\(limit, 20\) : limit/);
  assert.match(downloads, /releases = releases\.filter\(\(release\) => releaseMatchesTarget\(release, target\)\)\.slice\(0, limit\)/);
  assert.match(downloads, /const assets = \(release\.assets \|\| \[\]\)\.filter\(\(asset\) => assetMatchesTarget\(asset, target\)\)/);
  assert.match(downloads, /target === "ios"/);
  assert.match(downloads, /!name\.includes\("macos"\)/);
  assert.match(downloads, /target === "macos"/);
  assert.match(downloads, /target === "windows"/);
  assert.match(downloads, /target === "maccatalyst"/);
  assert.match(downloads, /emptyMacCatalyst/);
  assert.match(downloads, /repo === "djconnect-firmware"\) return "firmware"/);
  assert.match(downloads, /repo === "djconnect-pi-releases"\) return "linux"/);
  assert.match(downloads, /repo === "djconnect-app-releases"\) return "macos"/);
  assert.match(downloads, /asset\.browser_download_url/);
  assert.match(downloads, /asset\.download_count/);
  assert.match(downloads, /renderChangelog\(release, copy, target, language\)/);
  assert.match(downloads, /getReleaseNoteBody\(release, target, language\)/);
  assert.match(downloads, /releaseNoteVersionFromTag/);
  assert.match(downloads, /String\(tagName \|\| ""\)\.split\("\/"\)\.pop\(\)/);
  assert.match(downloads, /\/release-notes\/\$\{platform\}\/\$\{language\}\/\$\{version\}\.json/);
  assert.match(downloads, /\/release-notes\/\$\{platform\}\/en\/\$\{version\}\.json/);
  assert.match(downloads, /\/release-notes\/\$\{platform\}\/\$\{version\}\.json/);
  assert.match(downloads, /Static release notes are optional/);
  assert.match(downloads, /release\.body/);
  assert.match(downloads, /changelog: "Changelog"/);
  assert.match(downloads, /noChangelog/);
  assert.match(headers, /\/assets\/downloads\.js/);
  assert.match(headers, /Cache-Control: no-cache/);

  for (const html of [ios, macos, windows, macCatalyst, raspberry, embedded]) {
    assert.match(html, /data-github-downloads/);
    assert.match(html, /data-release-limit="1"/);
    assert.match(html, new RegExp(versionQuery.replace(/[.?]/g, "\\$&")));
    assert.doesNotMatch(html, /<script src="assets\/downloads\.js"><\/script>/);
    assert.doesNotMatch(html, /data-github-releases/);
    assert.doesNotMatch(html, /Live opgehaald uit GitHub en automatisch geformatteerd/);
    assert.doesNotMatch(html, /Elke release toont de downloadbare assets/);
    assert.doesNotMatch(html, /Each release shows the downloadable assets/);
  }

  assert.match(macos, /data-download-target="macos"/);
  assert.match(windows, /data-download-target="windows"/);
  assert.match(macCatalyst, /data-download-target="maccatalyst"/);
  assert.match(ios, /data-download-target="ios"/);
});

test("Windows and Mac Catalyst release notes expose localized v3.1.1 JSON paths", async () => {
  const expected = [
    ["windows", "en", /Platform: Windows/, /unsigned/i],
    ["windows", "nl", /Platform: Windows/, /niet ondertekend|Niet-ondertekende/i],
    ["maccatalyst", "en", /Platform: MacCatalyst|Platform: Mac Catalyst/, /not notarized|unsigned/i],
    ["maccatalyst", "nl", /Platform: MacCatalyst|Platform: Mac Catalyst/, /niet genotariseerd|niet ondertekend/i]
  ];

  for (const [platform, language, platformPattern, bodyPattern] of expected) {
    const url = `/release-notes/${platform}/${language}/v3.1.1.json`;
    const note = JSON.parse(await read(`wwwroot${url}`));
    assert.equal(note.version, "3.1.1");
    assert.equal(note.platform, platform);
    assert.equal(note.language, language);
    assert.match(note.body, platformPattern);
    assert.match(note.body, bodyPattern);
  }

  for (const platform of ["windows", "maccatalyst"]) {
    const legacy = JSON.parse(await read(`wwwroot/release-notes/${platform}/v3.1.1.json`));
    assert.equal(legacy.version, "3.1.1");
    assert.equal(legacy.platform, platform);
    assert.match(legacy.body, /DJConnect/);
  }
});

test("download changelog renderer loads localized static release notes before GitHub body", async () => {
  const downloads = await read("wwwroot/assets/downloads.js");
  const requests = [];
  const context = {
    fetch: async (url) => {
      requests.push(url);
      if (url === "/release-notes/windows/nl/v3.1.1.json") {
        return {
          ok: true,
          json: async () => ({ body: "Nederlandse Windows changelog" })
        };
      }
      return { ok: false, status: 404 };
    },
    XMLHttpRequest: function XMLHttpRequest() {},
    Intl,
    Number,
    String,
    RegExp,
    Error,
    Promise,
    document: {
      addEventListener() {},
      querySelectorAll() {
        return [];
      },
      documentElement: {
        lang: "nl"
      }
    },
    window: {
      setTimeout() {}
    },
    navigator: {}
  };
  context.MutationObserver = class MutationObserver {
    observe() {}
  };
  vm.createContext(context);
  vm.runInContext(downloads, context);

  const html = await vm.runInContext(
    "renderChangelog({ tag_name: 'windows/v3.1.1', body: 'GitHub body' }, downloadCopy.nl, 'windows', 'nl')",
    context
  );
  assert.match(html, /Nederlandse Windows changelog/);
  assert.doesNotMatch(html, /GitHub body/);
  assert.deepEqual(requests, ["/release-notes/windows/nl/v3.1.1.json"]);
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

test("D1 admin UI uses token-protected stats API without restoring legacy route", async () => {
  const [stats, sitemap, adminHtml, adminJs, adminCss] = await Promise.all([
    read("functions/api/stats.js"),
    read("wwwroot/sitemap.xml"),
    read("wwwroot/operator.html"),
    read("wwwroot/assets/admin.js"),
    read("wwwroot/assets/admin.css")
  ]);

  await assertMissing("functions/admin.js");
  assert.doesNotMatch(sitemap, /\/admin/);
  assert.match(adminHtml, /<meta name="robots" content="noindex, nofollow"/);
  assert.match(adminHtml, /Operator tooling/);
  assert.match(adminHtml, /D1 redirect clicks/);
  assert.match(adminHtml, /assets\/admin\.js\?v=/);
  assert.match(adminHtml, /assets\/admin\.css\?v=/);
  assert.match(adminHtml, /STATS_TOKEN/);
  assert.match(adminJs, /\/api\/stats\?days=/);
  assert.match(adminJs, /Authorization: `Bearer \$\{token\}`/);
  assert.match(adminJs, /sessionStorage/);
  assert.match(adminJs, /redirectClicks/);
  assert.match(adminJs, /githubDownloads/);
  assert.match(adminJs, /No D1 redirect clicks/);
  assert.match(adminCss, /\.metric-grid/);
  assert.match(stats, /STATS_TOKEN/);
  assert.match(stats, /ANALYTICS_DB/);
  assert.match(stats, /click_counters/);
  assert.match(stats, /download_count/);
  assert.match(stats, /Not found/);
  assert.match(stats, /No cookies, IP addresses, user agents or identifiers are stored/);
});

test("operator install-token revoke flow is explicit, bootstrap-only and redacted", async () => {
  const [adminHtml, adminJs, proxy, middleware, readme, testsDoc] = await Promise.all([
    read("wwwroot/operator.html"),
    read("wwwroot/assets/admin.js"),
    read("functions/api/operator/install-token/revoke.js"),
    read("functions/_middleware.js"),
    read("README.md"),
    read("TESTS.md")
  ]);

  assert.match(adminHtml, /Revoke install token/);
  assert.match(adminHtml, /Find target by IDs/);
  assert.match(adminHtml, /Do not paste raw <code>djci_\.\.\.<\/code> token values/);
  assert.doesNotMatch(adminHtml, /Operator\/bootstrap token/);
  assert.doesNotMatch(adminHtml, /operator-token/);
  assert.doesNotMatch(adminHtml, /operator-api-base/);
  assert.match(adminHtml, /example-ha-install/);
  assert.match(adminHtml, /example-install-token-id/);
  assert.match(adminHtml, /operator-disabled-compromised-install/);
  assert.match(adminHtml, /operator-disabled-requested/);
  assert.match(adminHtml, /operator-disabled-cleanup/);
  assert.match(adminHtml, /operator-disabled-other/);
  assert.match(adminHtml, /I understand this disables the install token without provisioning a replacement/);
  assert.match(adminHtml, /disabled>Revoke token/);
  assert.match(adminHtml, /blocks push\/register\/event calls/);

  assert.match(adminJs, /\/api\/operator\/install-token\/revoke/);
  assert.doesNotMatch(adminJs, /https:\/\/api\.djconnect\.dev/);
  assert.doesNotMatch(adminJs, /operatorToken/);
  assert.doesNotMatch(adminJs, /OPERATOR_TOKEN_KEY/);
  assert.doesNotMatch(adminJs, /DJCONNECT_RELAY_SECRET/);
  assert.match(adminJs, /JSON\.stringify\(preparedRevoke\)/);
  assert.match(adminJs, /ha_install_id: haInstallId/);
  assert.match(adminJs, /token_id: tokenId/);
  assert.match(adminJs, /operator-disabled-compromised-install/);
  assert.match(adminJs, /confirmRevokeCheck\.checked/);
  assert.match(adminJs, /Explicit confirmation is required before revoking/);
  assert.match(adminJs, /sanitizeError/);
  assert.match(adminJs, /djci_\[redacted\]/);
  assert.match(adminJs, /Bearer \[redacted\]/);
  assert.match(adminJs, /Token disabled\. Provisioning a new token is a separate operator action/);
  assert.match(adminJs, /Token was already disabled or no active token matched that install ID and token ID/);
  assert.doesNotMatch(adminJs, /console\./);
  assert.doesNotMatch(adminHtml + adminJs, /djci_[A-Za-z0-9_-]{16,}/);
  assert.doesNotMatch(adminHtml + adminJs, /DJCONNECT_RELAY_SECRET\s*=/);

  assert.match(proxy, /\/v1\/operator\/install-token\/revoke/);
  assert.match(proxy, /https:\/\/api\.djconnect\.dev/);
  assert.match(proxy, /DJCONNECT_RELAY_SECRET/);
  assert.match(proxy, /Authorization: `Bearer \$\{env\.DJCONNECT_RELAY_SECRET\}`/);
  assert.match(proxy, /ha_install_id: String\(input\?\.ha_install_id/);
  assert.match(proxy, /token_id: String\(input\?\.token_id/);
  assert.match(proxy, /reason: String\(input\?\.reason/);
  assert.match(proxy, /operator-disabled-compromised-install/);
  assert.match(proxy, /revoked: Number\(body\.revoked \|\| 0\) === 1 \? 1 : 0/);
  assert.match(proxy, /operator_revoke_failed_\$\{response\.status\}/);
  assert.doesNotMatch(proxy, /console\./);
  assert.doesNotMatch(proxy, /apns_token|spotify|prompt|response_text|chat_history/);

  assert.match(middleware, /PROTECTED_OPERATOR_PATHS/);
  assert.match(middleware, /"\/operator"/);
  assert.match(middleware, /"\/operator.html"/);
  assert.match(middleware, /"\/api\/operator\/"/);
  assert.match(middleware, /Cf-Access-Jwt-Assertion/);
  assert.match(middleware, /CLOUDFLARE_ACCESS_TEAM_DOMAIN/);
  assert.match(middleware, /CLOUDFLARE_ACCESS_AUD/);
  assert.match(middleware, /operator_access_not_configured/);
  assert.match(middleware, /crypto\.subtle\.verify/);
  assert.match(middleware, /cdn-cgi\/access\/certs/);
  assert.doesNotMatch(middleware, /DJCONNECT_RELAY_SECRET/);
  assert.doesNotMatch(middleware, /console\./);

  assert.match(readme, /operator-only install-token revoke flow/);
  assert.match(readme, /Cloudflare Access/);
  assert.match(readme, /CLOUDFLARE_ACCESS_TEAM_DOMAIN/);
  assert.match(readme, /CLOUDFLARE_ACCESS_AUD/);
  assert.match(readme, /New token provisioning is a separate operator action|separate operator\s+action/);
  assert.match(testsDoc, /happy path revoke/);
  assert.match(testsDoc, /confirm-required/);
  assert.match(testsDoc, /API 401\/403\s+rendering/);
  assert.match(testsDoc, /secret redaction/);
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

test("release script uses remote-safe push and scoped GitHub release notes", async () => {
  const releaseScript = await read("release.sh");

  assert.match(releaseScript, /git fetch origin main/);
  assert.match(releaseScript, /git merge-base --is-ancestor origin\/main HEAD/);
  assert.match(releaseScript, /Current HEAD is not based on origin\/main/);
  assert.match(releaseScript, /git push origin HEAD:main/);
  assert.doesNotMatch(releaseScript, /git push origin main/);
  assert.match(releaseScript, /RELEASE_NOTES_FILE="\$\(mktemp\)"/);
  assert.match(releaseScript, /trap 'rm -f "\$RELEASE_NOTES_FILE"' EXIT/);
  assert.match(releaseScript, /awk -v tag="\$TAG"/);
  assert.match(releaseScript, /CHANGELOG\.md > "\$RELEASE_NOTES_FILE"/);
  assert.match(releaseScript, /grep -q "DJConnect website \$\{TAG\}" "\$RELEASE_NOTES_FILE"/);
  assert.match(releaseScript, /--notes-file "\$RELEASE_NOTES_FILE"/);
  assert.doesNotMatch(releaseScript, /--notes-file CHANGELOG\.md/);
});

test("release build minifies shared assets before deploy", async () => {
  const [packageJson, releaseScript, buildScript, deployWorkflow, cleanupScript] = await Promise.all([
    read("package.json"),
    read("release.sh"),
    read("scripts/build-release.mjs"),
    read(".github/workflows/deploy-pages.yml"),
    read("cleanup_old_releases.sh")
  ]);
  const scripts = JSON.parse(packageJson).scripts;

  assert.equal(scripts["build:release"], "node scripts/build-release.mjs");
  assert.equal(sourceDir, "wwwroot");
  assert.equal(releaseOutputDir, "dist/wwwroot");
  assert.ok(sharedReleaseAssets.includes("assets/site-nav.css"));
  assert.ok(sharedReleaseAssets.includes("assets/downloads.js"));
  assert.ok(sharedReleaseAssets.includes("assets/voice-intents.js"));
  assert.match(buildScript, /const outputDir = path\.resolve\(releaseOutputDir\)/);
  assert.match(buildScript, /sharedReleaseAssets/);
  assert.match(buildScript, /readSiteVersion/);
  assert.match(buildScript, /minifyCss/);
  assert.match(buildScript, /minifyJs/);
  assert.doesNotMatch(buildScript, /stripJsComments/);
  assert.match(buildScript, /rewriteHtmlReferences/);
  assert.match(releaseScript, /RELEASE_PUBLISH_DIR="dist\/wwwroot"/);
  assert.match(releaseScript, /npm run build:release/);
  assert.match(releaseScript, /assets\/site-nav\.min\.css/);
  assert.match(releaseScript, /pages deploy "\$RELEASE_PUBLISH_DIR"/);
  assert.match(cleanupScript, /Warning: could not delete workflow run/);
  assert.match(deployWorkflow, /workflow_dispatch:/);
  assert.match(deployWorkflow, /candidate_sha:/);
  assert.match(deployWorkflow, /release_profile:/);
  assert.doesNotMatch(deployWorkflow, /pull_request:/);
  assert.doesNotMatch(deployWorkflow, /push:/);
  assert.match(deployWorkflow, /name: Test website/);
  // Canonical Batch 1 registry pins: actions/checkout v5 and actions/setup-node v5.
  assert.match(deployWorkflow, /actions\/checkout@93cb6efe18208431cddfb8368fd83d5badbf9bfd/);
  assert.match(deployWorkflow, /actions\/setup-node@a0853c24544627f65ddf259abe73b1d18a591444/);
  assert.match(deployWorkflow, /cache: npm/);
  assert.match(deployWorkflow, /npm ci/);
  assert.match(deployWorkflow, /npm test/);
  assert.match(deployWorkflow, /npx playwright install --with-deps chromium/);
  assert.match(deployWorkflow, /SMOKE_BASE_URL: https:\/\/djconnect\.dev/);
  assert.match(deployWorkflow, /npm run test:smoke/);
  assert.match(deployWorkflow, /npm run build:release/);
  assert.match(deployWorkflow, /needs: test/);
  assert.match(deployWorkflow, /actions\/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02/);
  assert.match(deployWorkflow, /platform-release-deployment-evidence/);
  assert.doesNotMatch(deployWorkflow, /actions\/download-artifact@/);
  assert.match(deployWorkflow, /CLOUDFLARE_ACCOUNT_ID: \$\{\{ secrets\.CLOUDFLARE_ACCOUNT_ID \}\}/);
  assert.match(deployWorkflow, /pages deploy dist\/wwwroot --project-name djconnect --branch main/);
  assert.match(deployWorkflow, /curl --fail --silent --show-error --location https:\/\/djconnect\.dev/);
  assert.doesNotMatch(deployWorkflow, /pages deploy wwwroot/);

  await exec("npm", ["run", "build:release"], { cwd: new URL("../", import.meta.url) });
  const version = (await read("VERSION")).trim();
  const [releaseIndex, releaseNavCss, releaseNavJs] = await Promise.all([
    read("dist/wwwroot/index.html"),
    read("dist/wwwroot/assets/site-nav.min.css"),
    read("dist/wwwroot/assets/site-nav.min.js")
  ]);

  assert.match(releaseIndex, new RegExp(`assets/site-nav\\.min\\.css\\?v=${version.replaceAll(".", "\\.")}`));
  assert.match(releaseIndex, new RegExp(`assets/site-nav\\.min\\.js\\?v=${version.replaceAll(".", "\\.")}`));
  assert.match(releaseIndex, new RegExp(`assets/i18n\\.min\\.js\\?v=${version.replaceAll(".", "\\.")}`));
  assert.match(releaseIndex, new RegExp(`DJConnect website v${version.replaceAll(".", "\\.")}`));
  assert.doesNotMatch(releaseIndex, /assets\/site-nav\.css\?v=/);
  assert.doesNotMatch(releaseIndex, /assets\/site-nav\.js\?v=/);
  assert.ok(releaseNavCss.length < (await read("wwwroot/assets/site-nav.css")).length);
  assert.ok(releaseNavJs.length <= (await read("wwwroot/assets/site-nav.js")).length);

  for (const script of ["i18n", "site-nav", "downloads", "releases", "voice-intents"]) {
    await exec("node", ["--check", `dist/wwwroot/assets/${script}.min.js`], { cwd: new URL("../", import.meta.url) });
  }

  for (const page of publicPages) {
    const html = await read(`dist/wwwroot/${page}.html`);
    for (const match of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      assert.doesNotThrow(() => new vm.Script(match[1]), `${page} should not contain invalid inline JavaScript`);
    }
  }

  const releaseGermanIndex = await read("dist/wwwroot/de/index.html");
  assert.match(releaseGermanIndex, /assets\/i18n\.min\.js\?v=/);
  assert.match(releaseGermanIndex, /assets\/site-nav\.min\.js\?v=/);
  assert.doesNotMatch(releaseGermanIndex, /assets\/i18n\.js\?v=/);
});

test("production headers set cache and security defaults", async () => {
  const headers = await read("wwwroot/_headers");

  assert.match(headers, /\/\*/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /Referrer-Policy: strict-origin-when-cross-origin/);
  assert.match(headers, /Permissions-Policy: camera=\(\), microphone=\(\), geolocation=\(\), payment=\(\), usb=\(\)/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /Strict-Transport-Security: max-age=31536000; includeSubDomains; preload/);
  assert.match(headers, /Cache-Control: no-cache/);
  assert.match(headers, /\/assets\/\*\s+Cache-Control: public, max-age=31536000, immutable/s);
  assert.match(headers, /\/assets\/downloads\.js\s+Cache-Control: no-cache/s);
  assert.match(headers, /\/assets\/releases\.js\s+Cache-Control: no-cache/s);
  assert.match(headers, /\/assets\/voice-intents\.js\s+Cache-Control: no-cache/s);
  assert.match(headers, /\/robots\.txt\s+Cache-Control: public, max-age=3600/s);
  assert.match(headers, /\/sitemap\.xml\s+Cache-Control: public, max-age=3600/s);
});

test("404 page is present and excluded from indexing", async () => {
  const page = await read("wwwroot/404.html");
  const sitemap = await read("wwwroot/sitemap.xml");

  assert.match(page, /<meta name="robots" content="noindex" \/>/);
  assert.match(page, /Pagina niet gevonden/);
  assert.match(page, /Page not found/);
  assert.match(page, /href="support\.html"/);
  assert.doesNotMatch(sitemap, /https:\/\/djconnect\.dev\/404/);
});

test("release script checks documentation before tagging", async () => {
  const releaseScript = await read("release.sh");

  for (const file of ["README.md", "HANDOFF.md", "TESTS.md", "TODO.md", "ISSUES.md", "CHANGELOG.md", "TECHNICAL_DESIGN.md", "CHAT_BOOTSTRAP.md", "SYNC_PROMPTS.md"]) {
    assert.match(releaseScript, new RegExp(file.replace(".", "\\.")));
  }

  assert.match(releaseScript, /DOC_FILES=.*SYNC_PROMPTS/);
  assert.doesNotMatch(releaseScript, /FORBIDDEN_CANONICAL_COPIES=\(SYNC_PROMPTS\.md/);
  assert.match(releaseScript, /FORBIDDEN_CANONICAL_COPIES=\(PRODUCT_ROADMAP\.md HA_SYNC_PROMPT\.md/);
  assert.match(releaseScript, /node scripts\/validate-sync-prompt-pointer\.mjs SYNC_PROMPTS\.md/);
  assert.match(releaseScript, /pcvantol\/djconnect\/SYNC_PROMPTS\.md and pcvantol\/djconnect\/PRODUCT_ROADMAP\.md/);
  assert.match(releaseScript, /for DOC_FILE in "\$\{DOC_FILES\[@\]\}"; do/);
  assert.match(releaseScript, /test -f "\$DOC_FILE"/);
  assert.match(releaseScript, /for CANONICAL_COPY in "\$\{FORBIDDEN_CANONICAL_COPIES\[@\]\}"; do/);
  assert.match(releaseScript, /grep -q "DJConnect website \$\{TAG\}" CHANGELOG\.md/);
  assert.match(releaseScript, /grep -q "Current version:/);
  assert.match(releaseScript, /HANDOFF\.md/);
  assert.match(releaseScript, /Current website version:/);
  assert.match(releaseScript, /TECHNICAL_DESIGN\.md/);
  assert.match(releaseScript, /test -f screenshots\/live-laptop\/manifest\.json/);
  assert.match(releaseScript, /grep -q '"language": "nl"' screenshots\/live-laptop\/manifest\.json/);
});

test("release script performs dependency and release-tool preflight", async () => {
  const [releaseScript, packageJson, refreshScript, validateWorkflow, deployWorkflow] = await Promise.all([
    read("release.sh"),
    read("package.json"),
    read("scripts/refresh-dependencies.mjs"),
    read(".github/workflows/validate.yml"),
    read(".github/workflows/deploy-pages.yml")
  ]);

  assert.match(packageJson, /"deps:update": "node scripts\/refresh-dependencies\.mjs update"/);
  assert.match(packageJson, /"deps:check": "node scripts\/refresh-dependencies\.mjs check"/);
  assert.match(releaseScript, /npm run deps:update/);
  assert.match(releaseScript, /git status --porcelain -- package\.json package-lock\.json/);
  assert.match(releaseScript, /Dependency refresh changed package metadata/);
  assert.match(refreshScript, /npm", \["--version"\]/);
  assert.match(refreshScript, /npx", \["wrangler@4", "--version"\]/);
  assert.match(refreshScript, /npx", \["playwright", "--version"\]/);
  assert.match(refreshScript, /npm", updateArgs/);
  assert.match(refreshScript, /package-lock\.json would change after npm update/);
  assert.match(validateWorkflow, /Check third-party packages and tools[\s\S]*npm run deps:check/);
  assert.match(deployWorkflow, /Check third-party packages and tools[\s\S]*npm run deps:check/);
});

test("technical design document records architecture, style and dependency inventory", async () => {
  const design = await read("TECHNICAL_DESIGN.md");

  assert.match(design, /Static-first Pages/);
  assert.match(design, /Progressive Enhancement for Dynamic Data/);
  assert.match(design, /Data Attribute Configuration/);
  assert.match(design, /Edge Functions as Thin Adapters/);
  assert.match(design, /Coding Style Conventions/);
  assert.match(design, /Frameworks, Libraries and Third-party Dependencies/);
  assert.match(design, /Node\.js/);
  assert.match(design, /Wrangler/);
  assert.match(design, /Cloudflare Pages/);
  assert.match(design, /GitHub REST API/);
  assert.match(design, /package\.json` declares no production package dependencies/);
  assert.match(design, /The only development package dependency is `@playwright\/test`/);
  assert.match(design, /Release Maintenance Rule/);
});

test("canonical SEO uses djconnect.dev", async () => {
  const pages = [
    ["index", "https://djconnect.dev/"],
    ["start", "https://djconnect.dev/start"],
    ["features", "https://djconnect.dev/features"],
    ["platform", "https://djconnect.dev/platform"],
    ["voice-commands", "https://djconnect.dev/voice-commands"],
    ["voice-assistant", "https://djconnect.dev/voice-assistant"],
    ["blog", "https://djconnect.dev/blog"],
    ["blog-djconnect-project", "https://djconnect.dev/blog-djconnect-project"],
    ["support", "https://djconnect.dev/support"],
    ["privacy", "https://djconnect.dev/privacy"],
    ["ios", "https://djconnect.dev/ios"],
    ["testflight", "https://djconnect.dev/testflight"],
    ["testflight-macos", "https://djconnect.dev/testflight-macos"],
    ["macos", "https://djconnect.dev/macos"],
    ["windows", "https://djconnect.dev/windows"],
    ["maccatalyst", "https://djconnect.dev/maccatalyst"],
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
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/platform<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/voice-commands<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/voice-assistant<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/blog<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/blog-djconnect-project<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/support<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/privacy<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/testflight<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/testflight-macos<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/windows<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/djconnect\.dev\/maccatalyst<\/loc>/);
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
  const pages = ["index", "start", "features", "platform", "voice-commands", "voice-assistant", "blog", "blog-djconnect-project", "support", "privacy", "ios", "testflight", "testflight-macos", "macos", "windows", "maccatalyst", "raspberry-pi", "embedded"];

  for (const page of pages) {
    const html = await read(`wwwroot/${page}.html`);
    assert.doesNotMatch(html, /macos-download\.html/, `${page} should not link to the removed macOS download page`);
    assert.doesNotMatch(html, /macos-download/, `${page} should not mention the removed macOS download route`);
  }
});

test("embedded page links back to platform homepage", async () => {
  const embedded = await read("wwwroot/embedded.html");
  assert.match(embedded, /href="index\.html"/);
  assert.match(embedded, /href="index\.html" data-i18n="navHome">Home<\/a>/);
  assert.match(embedded, /href="index\.html#apps" data-i18n="navPlatform">Platform<\/a>/);
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
  assert.doesNotMatch(embedded, /ESP32-S3-BOX-3/);
  assert.doesNotMatch(embedded, /https:\/\/github\.com\/espressif\/esp-box/);
  assert.doesNotMatch(embedded, /hardware_overview_for_box_3\.md/);
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
    read("wwwroot/blog.html"),
    read("wwwroot/blog-djconnect-project.html"),
    read("wwwroot/privacy.html"),
    read("wwwroot/macos.html"),
    read("wwwroot/ios.html"),
    read("wwwroot/testflight.html"),
    read("wwwroot/testflight-macos.html"),
    read("wwwroot/raspberry-pi.html")
  ]);

  const combined = pages.join("\n");
  assert.doesNotMatch(combined, /vooraf geflasht/i);
  assert.doesNotMatch(combined, /pre-flashed/i);
  assert.doesNotMatch(combined, /firmware staat al op het device/i);
  assert.doesNotMatch(combined, /firmware is already on the device/i);
});

test("all translation keys are present in Dutch and English", async () => {
  const pages = ["index", "start", "features", "platform", "voice-commands", "voice-assistant", "blog", "blog-djconnect-project", "support", "privacy", "ios", "testflight", "testflight-macos", "macos", "windows", "maccatalyst", "raspberry-pi", "embedded"];
  const htmlPages = await Promise.all(pages.map((page) => read(`wwwroot/${page}.html`)));

  htmlPages.forEach((html, index) => assertTranslationsCoverPage(html, `${pages[index]} page`));
});

test("MIT license and footer notice are shown", async () => {
  const license = await read("LICENSE");
  const pages = ["index", "start", "features", "platform", "voice-commands", "voice-assistant", "blog", "blog-djconnect-project", "support", "privacy", "ios", "testflight", "testflight-macos", "macos", "windows", "maccatalyst", "raspberry-pi", "embedded"];
  const htmlPages = await Promise.all(pages.map((page) => read(`wwwroot/${page}.html`)));

  assert.match(license, /MIT License/);
  assert.match(license, /Copyright \(c\) 2026 Peter van Tol/);
  htmlPages.forEach((html) => {
    assert.match(html, /Copyright Peter van Tol 2026\. Released under the MIT License\./);
    assert.match(html, /class="privacy-notice" data-i18n="legalPrivacy"/);
    assert.match(html, /Deze website ontvangt of bewaart geen accountgegevens/);
    assert.match(html, /This website does not receive or store account details/);
    assert.match(html, /href="privacy\.html" data-i18n="legalPrivacyLink">Privacy Policy<\/a>/);
    assert.match(html, /href="support\.html" data-i18n="legalSupport">Support<\/a>/);
  });
});

test("link checker validates local page and asset references", async () => {
  const pages = ["index.html", "start.html", "features.html", "platform.html", "voice-commands.html", "voice-assistant.html", "blog.html", "blog-djconnect-project.html", "support.html", "privacy.html", "ios.html", "testflight.html", "testflight-macos.html", "macos.html", "raspberry-pi.html", "embedded.html"];

  for (const page of pages) {
    const html = await read(`wwwroot/${page}`);
    const refs = extractRefs(html);
    assert.ok(refs.length > 0, `${page} should contain links or assets`);
    await Promise.all(refs.map((ref) => assertLocalRefExists(page, ref)));
  }
});

test("operator page lists APNs registrations through a server-side proxy", async () => {
  const [operatorHtml, adminJs, proxy] = await Promise.all([
    read("wwwroot/operator.html"),
    read("wwwroot/assets/admin.js"),
    read("functions/api/operator/registrations.js")
  ]);
  const registrationsSection = operatorHtml.slice(
    operatorHtml.indexOf('<section class="panel" aria-labelledby="registrations-title">'),
    operatorHtml.indexOf('<section class="panel danger-zone"')
  );
  const registrationsRenderer = adminJs.slice(
    adminJs.indexOf("const renderRegistrations"),
    adminJs.indexOf("const registrationQueryParams")
  );
  const registrationQueryBuilder = adminJs.slice(
    adminJs.indexOf("const registrationQueryParams"),
    adminJs.indexOf("const loadRegistrations =")
  );
  const sensitiveRegistrationFields = [
    "apns_token",
    "apns_token_ciphertext",
    "apns_token_nonce",
    "apns_token_key_version",
    "install_token",
    "djci_"
  ];

  assert.match(operatorHtml, /Apple device registrations/);
  assert.match(registrationsSection, /Privacy-safe APNs registration metadata/);
  assert.match(registrationsSection, /id="registrations-form"/);
  assert.match(operatorHtml, /id="registration-rows"/);
  assert.match(operatorHtml, /id="registrations-status"/);
  assert.match(adminJs, /\/api\/operator\/registrations/);
  assert.doesNotMatch(adminJs, /https:\/\/api\.djconnect\.dev\/v1\/admin\/registrations/);
  assert.doesNotMatch(adminJs, /DJCONNECT_RELAY_SECRET/);
  assert.match(adminJs, /ha_install_id_hash/);
  assert.match(adminJs, /device_id_hash/);
  assert.match(adminJs, /apns_environment/);
  assert.match(adminJs, /client_type/);
  assert.match(adminJs, /last_success_at/);
  assert.match(adminJs, /last_error_code/);
  assert.match(registrationsSection, /id="registration-client-type"/);
  assert.match(registrationsSection, /id="registration-apns-environment"/);
  assert.match(registrationsSection, /id="registration-status-filter"/);
  assert.match(registrationsSection, /id="registration-install-filter"/);
  assert.match(registrationsSection, /id="previous-registrations"/);
  assert.match(registrationsSection, /id="registrations-page-label"/);
  assert.match(registrationsSection, /id="next-registrations"/);
  assert.match(registrationQueryBuilder, /client_type/);
  assert.match(registrationQueryBuilder, /apns_environment/);
  assert.match(registrationQueryBuilder, /disabled/);
  assert.match(registrationQueryBuilder, /invalid/);
  assert.match(registrationQueryBuilder, /ha_install_id/);
  for (const field of sensitiveRegistrationFields) {
    assert.doesNotMatch(registrationsSection, new RegExp(field));
    assert.doesNotMatch(registrationsRenderer, new RegExp(field));
  }

  assert.match(proxy, /\/v1\/admin\/registrations/);
  assert.match(proxy, /DJCONNECT_RELAY_SECRET/);
  assert.match(proxy, /Authorization: `Bearer \$\{env\.DJCONNECT_RELAY_SECRET\}`/);
  assert.match(proxy, /apiBaseUrl\(env\)\}\$\{API_REGISTRATIONS_PATH\}\?\$\{params\}/);
  assert.match(proxy, /const limit = Number\(input\.get\("limit"\) \|\| 25\)/);
  assert.match(proxy, /const offset = Number\(input\.get\("offset"\) \|\| 0\)/);
  assert.match(proxy, /limit < 1 \|\| limit > 100/);
  assert.match(proxy, /offset < 0/);
  assert.match(proxy, /VALID_CLIENT_TYPES = new Set\(\["ios", "macos", "watchos"\]\)/);
  assert.match(proxy, /VALID_APNS_ENVIRONMENTS = new Set\(\["sandbox", "production"\]\)/);
  assert.match(proxy, /BOOLEAN_VALUES = new Set\(\["true", "false", "1", "0"\]\)/);
  assert.match(proxy, /appendIfPresent\(input, params, "client_type"/);
  assert.match(proxy, /appendIfPresent\(input, params, "apns_environment"/);
  assert.match(proxy, /appendIfPresent\(input, params, "disabled"/);
  assert.match(proxy, /appendIfPresent\(input, params, "invalid"/);
  assert.match(proxy, /appendIfPresent\(input, params, "ha_install_id", \(value\) => value\.length <= 160 && !\/\^djci_\/i\.test\(value\)\)/);
  assert.match(proxy, /sanitizeError/);
  assert.match(proxy, /djci_\[redacted\]/);
  assert.match(proxy, /Bearer \[redacted\]/);
  assert.doesNotMatch(proxy, /console\./);
});
