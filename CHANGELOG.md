# Changelog

All notable changes to this website are documented here.

## DJConnect website v3.1.1 - 2026-06-11

- Moved "Aan de slag" to the first homepage navigation position.
- Fixed the Home Assistant badge icon rendering by using the icon asset without distortion.
- Updated homepage essentials copy for encrypted token storage and multi-client Home Assistant positioning.

## DJConnect website v3.1.0 - 2026-06-11

- Improved homepage hero device rendering with clearer macOS, iPad and iPhone form factors.
- Updated hero copy to "Speel, Vraag aan, Ontvang Persoonlijke DJ aankondiging".
- Removed leftover "DJConnect Studio", queue and pre-flashed wording from current site copy.
- Clarified the start page setup as automatic HACS installation or manual setup steps.
- Added regression tests for hero copy, device visual hooks and pre-flashed wording removal.
- Added macOS and iOS app subpages.
- Added a macOS binary download page backed by `pcvantol/djconnect-app-releases`.
- Added a Home Assistant "Aan de slag" setup page for HACS, Spotify, Assist and client pairing.
- Added supported embedded hardware links for LilyGO T-Embed CC1101 and ESP32-S3-BOX-3.
- Replaced pre-flashed wording with firmware download and flash guidance.
- Added live GitHub release embeds on app subpages.
- Added a platform-independent homepage for DJConnect essentials.
- Moved the ESP32 hardware content into a dedicated embedded-device one-pager.
- Prepared macOS and iOS homepage cards for future Mac App Store and App Store links.
- Added Dutch and English translation coverage for the homepage and reviewed embedded-page translation keys.
- Added visible footer copyright and site version metadata.
- Added repository documentation for releases, TODOs, known issues, handoff and testing.
- Added automated Node tests for version consistency, routes, store placeholders, copyright and translation coverage.
- Reworked `release.sh` to run tests, push `main`, create a version tag, create a GitHub Release and deploy to Cloudflare Pages.

## Initial website - 2026-06-11

- Created the initial static DJConnect website.
- Connected the repository to GitHub.
- Registered and deployed the site to Cloudflare Pages at https://djconnect.pages.dev.
