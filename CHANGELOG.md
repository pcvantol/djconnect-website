# Changelog

All notable changes to this website are consolidated under the current website version.

## DJConnect website v3.1.22 - 2026-06-14

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
- Added automated Node tests for version consistency, routes, store placeholders, copyright, translation coverage, setup/navigation copy and release/download embeds.
- Added `release.sh` for manual releases and Cloudflare Pages deployment.
- Added `cleanup_old_releases.sh` for release/tag cleanup and older GitHub Actions workflow run cleanup.
- Updated `release.sh` so every normal release automatically cleans old GitHub Releases, matching local/remote tags and older workflow runs.
- Added a GitHub Actions workflow that runs tests and deploys `wwwroot` to Cloudflare Pages on every push to `main` using the `CLOUDFLARE_API_TOKEN` repository secret.
- Synced the canonical cross-repo prompt bundle with Bonjour/mDNS client discovery guidance and renamed game labels.
