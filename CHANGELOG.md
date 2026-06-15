# Changelog

All notable changes to this website are grouped per release.

## DJConnect website v3.1.31 - 2026-06-16

- Aligned the website voice-intent example data with the Home Assistant repo
  canonical source `examples/voice_intents.json`.
- Documented the canonical intent-family rules for artist-first requests,
  explicit track/album/playlist keywords and default playlist/favorites
  handling in the sync prompt, handoff notes and voice-intent data prompt.
- Extended regression coverage so the site keeps pointing to the canonical HA
  intent source and no longer drifts into separate hardcoded examples.

## DJConnect website v3.1.30 - 2026-06-15

- Added expandable changelog/release-notes rendering to the shared latest-version
  download cards for macOS, iOS, ESP32 firmware and Raspberry Pi/Linux clients.
- Added the iOS page to the same latest app-release block used by macOS, backed
  by `pcvantol/djconnect-app-releases`.
- Extended tests to cover changelog rendering from GitHub release body text and
  the iOS latest-version release embed.

## DJConnect website v3.1.29 - 2026-06-15

- Added a functional Raspberry Pi setup section that describes the path from a
  fresh Raspberry Pi OS Lite 64-bit image through first-boot configuration,
  SSH, Git checkout and the repo-only OS bootstrap script.
- Added starter hardware requirements for the Raspberry Pi page: 32 GB microSD
  card, Raspberry Pi Zero 2 W with header and Pimoroni HyperPixel 4.0 Square.
- Clarified that the Pi source checkout is used for OS bootstrap only, while the
  app itself is installed from the public release bundle shown in the Download
  section.
- Added Dutch and English translations plus regression coverage for the new
  Raspberry Pi bootstrap guidance.

## DJConnect website v3.1.28 - 2026-06-15

- Added a temporary Basic Auth protected `/admin` Pages Function for download
  statistics.
- The admin page fetches GitHub release asset `download_count` values at
  runtime for the app, firmware and Linux/Raspberry Pi release repositories.
- Kept the first admin version intentionally persistence-free: D1 aggregate
  website click counters and download redirect totals stay out of this page
  until the next analytics iteration.
- Added noindex, no-store and automated contract coverage for the protected
  admin route.
- Updated repository documentation and handoff notes for the temporary admin
  credentials, GitHub-runtime stats scope and future replacement path.

## DJConnect website v3.1.27 - 2026-06-15

- Reworked the voice commands page around a maintainable `intentFamilies`
  data object, so intent cards and examples render from one NL/EN source.
- Added `wwwroot/assets/voice-intents.js` as the shared voice intent example
  source for the homepage and voice commands page.
- Updated the homepage voice example chips to render a rotating, varied set of
  real voice intent examples and link to the full Spraak/Voice page.
- Updated the voice page hero, artist-first explanation, interpretation order,
  tip text and intent examples to match the current DJConnect voice/PTT
  contract.
- Added the expanded Lithium, artist, album, playlist, default playlist and
  playback-control example sets in both Dutch and English.
- Added `VOICE_INTENT_DATA_PROMPT.md` so future Home Assistant integration
  updates can provide structured voice intent data without website/layout
  instructions.
- Extended tests to verify the data-driven voice intent examples and the
  required Dutch/English Lithium phrases.

## DJConnect website v3.1.26 - 2026-06-15

- Updated the voice commands page so intent examples follow the selected NL/EN
  language toggle instead of showing both language columns at the same time.
- Kept Dutch and English example phrases in the page source for search and
  documentation value, while rendering only the active language in the UI.
- Extended automated coverage for language-scoped voice command example blocks
  and their toggle behavior.

## DJConnect website v3.1.25 - 2026-06-15

- Added a bilingual voice commands page that explains the DJConnect handling
  flow from client audio/text through Home Assistant STT, Assist intent data,
  fallback parsing, Spotify playback and personal DJ announcement feedback.
- Documented the artist-first behavior for generic music requests and added
  compact Dutch and English examples for artist, track, album, playlist,
  default playlist/favorites and playback-control intent families.
- Added the voice commands page to top-level homepage/features/blog navigation,
  sitemap, README, handoff and manual test documentation.
- Extended automated tests for the voice commands route, translation coverage,
  sitemap entry, navigation link and required intent-family copy.

## DJConnect website v3.1.24 - 2026-06-15

- Restored the `Website/Docs` section in the shared canonical `SYNC_PROMPTS.md`
  so website-specific contracts remain visible to all DJConnect repos.
- Added the current website navigation, blog, SEO/social preview, latest-only
  downloads, tracked redirects, cookieless analytics and release-cleanup rules
  to the shared sync prompt bundle.
- Restored shared contract notes for Home Assistant-owned Spotify token refresh,
  ESP32 Up Next queue capacity and the current bonus mini-game names.
- Updated the canonical product roadmap structure for cross-repo use, including
  release-cycle rules, production must-haves, killer features and premium
  feature candidates.
- Added a release preflight that refreshes declared npm dependencies when a
  lockfile exists and records the active Wrangler major-version tool before
  tests.
- Documented that third-party library, framework and release-tool upgrades must
  update the dependency inventory, license details and third-party notices
  before publishing.

## DJConnect website v3.1.23 - 2026-06-14

- Added a platform-independent homepage for DJConnect essentials, with focused navigation for `Hoe werkt het`, `Features`, `Installeren` and the primary `Aan de slag` CTA.
- Reworked the homepage hero into a swipeable carousel for macOS, iPad/iPhone and LilyGO/ESP32, with spacious device slides and current Dutch/English copy.
- Renamed the homepage overview label to `DJConnect in een oogopslag`.
- Added a top-level Features page with the main DJConnect functions and renamed bonus mini-games: Paddle Rally, Meteor Run, Sky Dash and Maze Chase.
- Added macOS, iOS and Raspberry Pi/Linux pages with language toggles, minimal navigation and download/store routes.
- Reworked iOS and macOS hero visuals to match the newer premium device-card style.
- Replaced the Raspberry Pi hero mockup with a Pimoroni HyperPixel Square 4-inch inspired visual and focused the page on Linux downloads.
- Added a Home Assistant `Aan de slag` setup page for voice assist, HACS installation, DJConnect configuration, downloads, client pairing and first use.
- Reworked the start-page pairing flow into target-specific panels for ESP device, iOS app, macOS app and Raspberry Pi app.
- Reworked the embedded ESP32 page into a compact product page focused on supported hardware, how it works and firmware downloads.
- Added supported embedded hardware links for LilyGO T-Embed CC1101 and ESP32-S3-BOX-3, including the LilyGO product-specifications link.
- Switched embedded ESP32 releases to the download-asset renderer so firmware binaries appear inline like macOS and Linux downloads.
- Added privacy-friendly aggregate click counters for HACS and download redirects, plus a token-protected stats endpoint that combines redirect totals with GitHub asset `download_count`.
- Added canonical `djconnect.dev` SEO metadata, `robots.txt`, `sitemap.xml` and documented `www.djconnect.dev` redirect support.
- Added a dedicated 1200x630 social preview image for WhatsApp/Open Graph without white borders and with the current `Muziekbediening met karakter` tagline.
- Connected macOS downloads to `pcvantol/djconnect-app-releases`, ESP32 firmware downloads to `pcvantol/djconnect-firmware` and Raspberry Pi/Linux downloads to `pcvantol/djconnect-pi-releases`.
- Added a dynamic Raspberry Pi/Linux install command that uses the latest public GitHub release bundle and preserves pairing/configuration on rerun.
- Updated the Raspberry Pi/Linux install command to run the renamed public release installer `sudo ./scripts/install.sh`.
- Added a copy-to-clipboard button for the generated Raspberry Pi/Linux install command.
- Fixed dynamic GitHub download/install blocks so generated copy updates when the language toggle changes.
- Extended static regression tests for latest-only release embeds, tracked download redirects, removed legacy macOS download routes and the public Linux install redirect.
- Removed redundant local Client API / discovery notes from the start-page client pairing panels.
- Added a small translated privacy notice to site footers and removed the app-only privacy copy placement.
- Updated the Raspberry Pi pairing step to explicitly paste pairing details in the Home Assistant integration.
- Limited Linux and ESP32 firmware download embeds to the latest GitHub release only.
- Updated start-page installation navigation so `Installeren` jumps to `2. Voeg toe aan Home Assistant`.
- Renamed start-page client switch labels to `iOS`, `macOS`, `Linux` and `ESP32`.
- Updated Linux/Raspberry Pi setup copy to point users to the public GitHub release install path.
- Updated embedded ESP32 voice-flow copy to focus on asking for the next artist.
- Removed self-referencing website release embeds from app/device pages.
- Updated the Home Assistant section heading to `Powered by Home Assistant, beschikbaar voor meerdere apparaten`.
- Renamed the ESP32 homepage CTA to `Meer over ESP32` and aligned it with the grey detail buttons.
- Removed pre-flashed wording from current site copy and replaced it with firmware download and flash guidance.
- Added visible footer copyright and site version metadata.
- Added repository documentation for releases, TODOs, known issues, handoff and testing.
- Added a release documentation guard so every release checks core docs and current handoff/changelog version alignment.
- Added `TECHNICAL_DESIGN.md` with reverse-engineered code-level design decisions, language-specific coding conventions and dependency/license inventory.
- Added `TECHNICAL_DESIGN.md` to the required release documentation set.
- Added a `stats:check` helper script for token-protected aggregate download/HACS stats.
- Added sitewide support links to GitHub Issues.
- Added static local link checking to the default Node test suite.
- Added a starter Playwright smoke suite for live/browser checks.
- Documented that every release must include a test-coverage review and test expansion when the change affects behavior, routes, rendering, analytics, release scripts or deployment.
- Switched the changelog policy back to separate changelog entries per release instead of consolidating all changes into one version entry.
- Added automated Node tests for version consistency, routes, store placeholders, copyright, translation coverage, setup/navigation copy and release/download embeds.
- Added `release.sh` for manual releases and Cloudflare Pages deployment.
- Added `cleanup_old_releases.sh` for release/tag cleanup and older GitHub Actions workflow run cleanup.
- Updated `release.sh` so every normal release automatically cleans old GitHub Releases, matching local/remote tags and older workflow runs.
- Added a GitHub Actions workflow that runs tests and deploys `wwwroot` to Cloudflare Pages on every push to `main` using the `CLOUDFLARE_API_TOKEN` repository secret.
- Synced the canonical cross-repo prompt bundle with Bonjour/mDNS client discovery guidance and renamed game labels.
