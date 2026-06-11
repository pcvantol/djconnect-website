# Changelog

All notable changes to this website are documented here.

## DJConnect website v3.1.6 - 2026-06-11

- Added a platform-independent homepage for DJConnect essentials, with focused navigation for `Wat is DJConnect`, `Features`, `Download` and the primary `Aan de slag` CTA.
- Reworked the homepage hero into a swipeable carousel for macOS, iPad/iPhone and LilyGO/ESP32, with clearer device form factors, play/voice iconography and current Dutch/English copy.
- Added a top-level Features page with the main DJConnect functions and bonus mini-games: Pong, Asteroids & Fly.
- Added macOS, iOS, macOS download and Raspberry Pi placeholder pages with language toggles, release/download routes and translation coverage.
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
