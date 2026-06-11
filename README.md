# DJConnect Website

Static landing page for DJConnect, published through Cloudflare Pages.

## Structure

- `wwwroot/index.html`: platform homepage with DJConnect essentials, download routes and swipeable device hero.
- `wwwroot/features.html`: feature overview page, including bonus mini-games.
- `wwwroot/start.html`: Home Assistant setup flow for HACS installation, voice pipeline setup, DJConnect configuration, client downloads and pairing.
- `wwwroot/embedded.html`: ESP32 embedded-device one-pager.
- `wwwroot/macos.html`: macOS app page with release embed and download route.
- `wwwroot/macos-download.html`: macOS binary download page for `pcvantol/djconnect-app-releases`.
- `wwwroot/ios.html`: iOS app page with App Store placeholder and release embed.
- `wwwroot/raspberry-pi.html`: prepared Raspberry Pi app placeholder page with release embed.
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
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
./release.sh
```

If the version tag and GitHub Release already exist and only the Pages deployment still needs to run, deploy the current `wwwroot` folder directly:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
npx wrangler pages deploy wwwroot --project-name djconnect --branch main
```

The live site should be checked for both HTTP availability and the footer version:

```bash
curl -I https://djconnect.pages.dev
curl -s https://djconnect.pages.dev | grep "DJConnect website v"
```

## Live Releases

App subpages render latest GitHub releases through `/api/releases`.
For private GitHub repositories, set a Cloudflare Pages secret named `GITHUB_TOKEN` with read access to releases.

## Content Hygiene

- Keep Dutch and English translation keys in sync on the homepage, embedded page, Features page and Raspberry Pi page.
- Keep App Store links as placeholders until the macOS and iOS apps are published.
- Do not describe embedded devices as pre-flashed; link users to the firmware repository and flashing flow instead.
- Keep homepage navigation focused on `Wat is DJConnect`, `Features`, `Download` and the primary `Aan de slag` CTA.
- Keep homepage hero device slides spacious: macOS, iPad/iPhone and LilyGO/ESP32 each get their own carousel slide.
- Keep the start page aligned with the current setup order: Home Assistant voice pipeline, HACS, DJConnect configuration, client pairing and first use.
- Keep the embedded page compact: experience, supported hardware, how it works, release embed and CTA. Detailed setup content belongs on `wwwroot/start.html`.
- Keep the footer version aligned with `VERSION`, `package.json` and `CHANGELOG.md`.
