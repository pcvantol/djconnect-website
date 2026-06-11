# DJConnect Website

Static landing page for DJConnect, published through Cloudflare Pages.

## Structure

- `wwwroot/index.html`: platform homepage with DJConnect essentials.
- `wwwroot/start.html`: Home Assistant setup flow with automatic HACS route and manual steps.
- `wwwroot/embedded.html`: ESP32 embedded-device one-pager.
- `wwwroot/macos.html`: macOS app page with release embed and download route.
- `wwwroot/macos-download.html`: macOS binary download page for `pcvantol/djconnect-app-releases`.
- `wwwroot/ios.html`: iOS app page with App Store placeholder and release embed.
- `wwwroot/assets/`: logo, favicon and product visuals.
- `functions/api/releases.js`: Cloudflare Pages Function proxy for GitHub release data.
- `VERSION`: current site version.

## Local Preview

Open `wwwroot/index.html` directly in a browser, or serve the folder with any static web server.

## Deploy

The production site is deployed to Cloudflare Pages:

- Production: https://djconnect.pages.dev
- Project name: `djconnect`
- Publish directory: `wwwroot`

Use `./release.sh` for the standard release flow.

The release script runs tests, pushes `main`, creates a `vX.Y.Z` tag, creates a GitHub Release and deploys to Cloudflare Pages.

```bash
npm test
./release.sh
```

## Live Releases

App subpages render latest GitHub releases through `/api/releases`.
For private GitHub repositories, set a Cloudflare Pages secret named `GITHUB_TOKEN` with read access to releases.

## Content Hygiene

- Keep Dutch and English translation keys in sync on the homepage and embedded page.
- Keep App Store links as placeholders until the macOS and iOS apps are published.
- Do not describe embedded devices as pre-flashed; link users to the firmware repository and flashing flow instead.
- Keep the footer version aligned with `VERSION`, `package.json` and `CHANGELOG.md`.
