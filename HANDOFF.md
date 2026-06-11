# Handoff

## Current State

- Repository remote: `git@github.com:pcvantol/djconnect-website.git`
- Production URL: https://djconnect.pages.dev
- Cloudflare Pages project: `djconnect`
- Publish directory: `wwwroot`
- Current version: `3.1.5`
- Main page: `wwwroot/index.html`
- Features page: `wwwroot/features.html`
- Start/setup page: `wwwroot/start.html`
- macOS app page: `wwwroot/macos.html`
- macOS binary download page: `wwwroot/macos-download.html`
- iOS app page: `wwwroot/ios.html`
- Embedded ESP32 one-pager: `wwwroot/embedded.html`

## Important Notes

- The site is static HTML/CSS/JavaScript with no build step.
- The homepage is platform-independent and routes users to setup and downloads.
- The homepage navigation intentionally contains `Wat is DJConnect`, `Features` and `Download`; the `Aan de slag` route is the primary CTA button.
- The features page summarizes the main DJConnect functions and mentions the bonus mini-games: Pong, Asteroids & Fly.
- The homepage hero uses a swipeable device carousel for macOS, iPad/iPhone and LilyGO/ESP32. Keep each device slide spacious and avoid compressing devices side-by-side.
- The homepage has prepared App Store CTA placeholders with `data-store-link="macos"` and `data-store-link="ios"`.
- The embedded page should point users to `pcvantol/djconnect-firmware` for firmware downloads and flashing. Do not reintroduce pre-flashed copy.
- The start page presents the current setup order: add DJConnect to Home Assistant through HACS, configure the Home Assistant voice assist pipeline, configure DJConnect in Home Assistant, download and pair the app/device, then use DJConnect with Spotify Connect.
- The start page links to Home Assistant voice assistant documentation, `pcvantol/djconnect-firmware` and `pcvantol/djconnect-app-releases`.
- App subpages use `assets/releases.js`, `assets/releases.css` and the Cloudflare Pages Function `functions/api/releases.js` to live-render GitHub releases.
- macOS downloads use `assets/downloads.js` and the public repo `pcvantol/djconnect-app-releases`.
- If the GitHub repository/releases are private, set `GITHUB_TOKEN` as a Cloudflare Pages secret for the `djconnect` project.
- Version is tracked in `VERSION`, `package.json`, page footers and `CHANGELOG.md`.
- Language switching on the embedded page is handled in `wwwroot/embedded.html` through the `translations` object.
- Language switching on the homepage is handled in `wwwroot/index.html` through the `translations` object.
- The embedded page keeps the detailed ESP32/Home Assistant setup, requirements and FAQ.
- Do not commit `.wrangler/`; it is local Wrangler cache.

## Release Steps

1. Commit all changes to `main`.
2. Ensure `CLOUDFLARE_API_TOKEN` is set in the shell.
3. Run `./release.sh`.
4. Verify the GitHub Release and https://djconnect.pages.dev.

## Current Verification

- `npm test` covers version consistency, route presence, homepage navigation/copy, release embeds, download embeds, translation keys, footer copyright, firmware links, LilyGO visual hygiene and stale pre-flashed wording.
- The start page should be manually checked for the HACS deeplink, Home Assistant voice documentation link, firmware/app release links, ESP pairing copy, app pairing copy and troubleshooting text.
- Manual visual checks are still needed for desktop, tablet and mobile layouts until browser regression tests are formalized in CI.
