# Changelog

All notable changes to this website are documented here.

## DJConnect website v3.1.0 - 2026-06-11

- Added macOS and iOS app subpages.
- Added a macOS binary download page backed by `pcvantol/djconnect-app-releases`.
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
