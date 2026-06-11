# Changelog

All notable changes to this website are documented here.

## DJConnect website v3.1.6 - 2026-06-11

- Prepared the site for a future Raspberry Pi app with a dedicated placeholder page, homepage route and start-page pairing panel.
- Added Dutch and English language toggles and translation coverage to the Features and Raspberry Pi pages.
- Reworked the embedded ESP32 page into a compact product page by removing the local quick start, requirements, FAQ and extra proposition cards.
- Updated embedded page CTAs so `Start installatie` routes to the general `Aan de slag` page.
- Improved the embedded ESP32 visual card spacing and added a direct LilyGO T-Embed CC1101 product-specifications link.
- Renamed the platform navigation item to `Home` on macOS, iOS and embedded pages.
- Updated automated tests for the Raspberry Pi route, translation coverage, compact embedded page, Home navigation labels and removed embedded setup sections.
- Updated documentation, handoff notes and manual test guidance for the current site structure.

## DJConnect website v3.1.5 - 2026-06-11

- Added a top-level Features page with the main DJConnect functions and bonus mini-games: Pong, Asteroids & Fly.
- Added the Features route to the homepage navigation.
- Reworked the start-page pairing section into a three-option switch for ESP device, iOS app and macOS app.
- Moved downloads into the selected pairing panel as step 1, with separate targets for ESP firmware, iOS and macOS.
- Updated tests and documentation for the Features route and pairing switch.

## DJConnect website v3.1.4 - 2026-06-11

- Clarified the DJConnect configuration step for assist pipeline setup and custom DJ announcement prompt styling.
- Shortened the ESP pairing flow to four steps by combining power-on and WiFi provisioning and simplifying the pairing-code step.

## DJConnect website v3.1.3 - 2026-06-11

- Consolidated the iOS/macOS app pairing steps into a shorter four-step Home Assistant flow.
- Combined ESP pairing and automatic Home Assistant configuration into one step.
- Updated tests for the simplified start-page setup instructions.

## DJConnect website v3.1.2 - 2026-06-11

- Simplified the homepage navigation to `Wat is DJConnect`, `Download` and the primary `Aan de slag` CTA.
- Removed the homepage availability pill and aligned the start-page hero copy with the homepage proposition.
- Refined the swipeable hero device carousel with a bolder title, centered macOS play icon, iPad voice icon and an empty LilyGO display.
- Updated homepage examples with quoted voice commands, music-note markers and current Dutch/English translation keys.
- Rewrote the start-page pairing, ESP provisioning and troubleshooting copy for clearer Home Assistant setup guidance.
- Updated tests for the new homepage navigation, hero copy, LilyGO visual, pairing steps and troubleshooting text.
- Updated release documentation, handoff notes and manual test guidance for the current site structure.

## DJConnect website v3.1.1 - 2026-06-11

- Moved "Aan de slag" to the first homepage navigation position.
- Fixed the Home Assistant badge icon rendering by using the icon asset without distortion.
- Updated homepage essentials copy for encrypted token storage and multi-client Home Assistant positioning.
- Reworked the homepage hero device visual into a swipeable carousel for macOS, iOS and ESP32.
- Replaced abstract equalizer bars with play and radio-microphone iconography.
- Removed trailing periods from start-page step lists and increased spacing between stacked instruction blocks.
- Reworked the start-page setup flow around HACS installation, Home Assistant voice pipeline setup, DJConnect configuration, client pairing and first use.

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
