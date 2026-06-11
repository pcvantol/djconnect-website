# Changelog

All notable changes to this website are documented here.

## DJConnect website v3.1.8 - 2026-06-11

- Added a platform-independent homepage for DJConnect essentials, with focused navigation for `Hoe werkt het`, `Features`, `Download` and the primary `Aan de slag` CTA.
- Reworked the homepage hero into a swipeable carousel for macOS, iPad/iPhone and LilyGO/ESP32, with clearer device form factors, play/voice iconography and current Dutch/English copy.
- Added a top-level Features page with the main DJConnect functions and bonus mini-games: Pong, Asteroids & Fly.
- Added macOS, iOS and Raspberry Pi placeholder pages with language toggles, release/download routes and translation coverage.
- Added a Home Assistant `Aan de slag` setup page for voice assist, HACS installation, DJConnect configuration, downloads, client pairing and first use.
- Reworked the start-page pairing flow into a three-option switch for ESP device, iOS app and macOS app, with target-specific download links and simplified four-step flows.
- Reworked the embedded ESP32 page into a compact product page focused on supported hardware, how it works and releases; removed local quick start, requirements, FAQ, experience and setup callout sections.
- Added supported embedded hardware links for LilyGO T-Embed CC1101 and ESP32-S3-BOX-3, including the LilyGO product-specifications link.
- Removed pre-flashed wording from current site copy and replaced it with firmware download and flash guidance.
- Added live GitHub release embeds on app and device subpages, with safer fallback copy when releases cannot be loaded.
- Added visible footer copyright and site version metadata.
- Added repository documentation for releases, TODOs, known issues, handoff and testing.
- Added automated Node tests for version consistency, routes, store placeholders, copyright, translation coverage, compact embedded content and current setup/navigation copy.
- Added `release.sh` for manual releases and Cloudflare Pages deployment.
- Added `cleanup_old_releases.sh` for release/tag cleanup.
- Added a GitHub Actions workflow that runs tests and deploys `wwwroot` to Cloudflare Pages on every push to `main` using the `CLOUDFLARE_API_TOKEN` repository secret.
- Added Dutch/English language switching to the start page.
- Renamed the homepage `Wat is DJConnect` navigation label to `Hoe werkt het`.
- Simplified the Raspberry Pi page navigation to match the app pages.
- Extended `cleanup_old_releases.sh` to remove older GitHub Actions workflow runs in addition to old releases and tags.
- Removed the duplicate macOS download page and embedded app binary downloads directly on the macOS page.
- Pointed the embedded page release embed to `pcvantol/djconnect-firmware` releases.
- Routed the start-page ESP firmware button to the embedded page instead of directly to GitHub.
- Renamed embedded page release CTAs from setup wording to `Download`.
- Added a `Download` menu item on the start page that jumps to the app/device pairing section.
- Updated `release.sh` to remove older GitHub Actions workflow runs by default and keep only the latest run.
