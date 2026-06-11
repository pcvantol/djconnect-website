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
- Cloudflare account ID: `efe77cadf8317a53832fca0848e3ae51`

Automatic deployment runs through GitHub Actions on every push to `main`.
The repository must have an Actions secret named `CLOUDFLARE_API_TOKEN` with permission to deploy Cloudflare Pages. The workflow passes the Cloudflare account ID explicitly so Wrangler does not need to discover account memberships during CI.

Configure it in GitHub:

```text
Settings -> Secrets and variables -> Actions -> New repository secret
Name: CLOUDFLARE_API_TOKEN
Value: Cloudflare API token
```

Minimum Cloudflare token permissions:

- `Cloudflare Pages:Edit`
- `Account:Read`

Use `./release.sh` for the standard release flow.

The release script runs tests, pushes `main`, creates a `vX.Y.Z` tag, creates a GitHub Release and deploys to Cloudflare Pages.

```bash
npm test
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
./release.sh
```

If `CLOUDFLARE_API_TOKEN` is only configured as a GitHub Actions secret, run the release without direct local deploy and let the push trigger the workflow:

```bash
./release.sh --skip-deploy
```

If the version tag and GitHub Release already exist and only the Pages deployment still needs to run, deploy the current `wwwroot` folder directly:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
npx wrangler pages deploy wwwroot --project-name djconnect --branch main --account-id efe77cadf8317a53832fca0848e3ae51
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

- Keep Dutch and English translation keys in sync on the homepage, embedded page, Features page, Raspberry Pi page, iOS page, macOS page and macOS download page.
- Keep App Store links as placeholders until the macOS and iOS apps are published.
- Do not describe embedded devices as pre-flashed; link users to the firmware repository and flashing flow instead.
- Keep homepage navigation focused on `Wat is DJConnect`, `Features`, `Download` and the primary `Aan de slag` CTA.
- Keep homepage hero device slides spacious: macOS, iPad/iPhone and LilyGO/ESP32 each get their own carousel slide.
- Keep the start page aligned with the current setup order: Home Assistant voice pipeline, HACS, DJConnect configuration, client pairing and first use.
- Keep the embedded page compact: supported hardware, how it works and release embed. Detailed setup, requirements, FAQ and experience content belong off this page.
- Keep the footer version aligned with `VERSION`, `package.json` and `CHANGELOG.md`.
