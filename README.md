# DJConnect Website

Static landing page for DJConnect, published through Cloudflare Pages.

## Structure

- `wwwroot/index.html`: platform homepage with DJConnect essentials.
- `wwwroot/embedded.html`: ESP32 embedded-device one-pager.
- `wwwroot/assets/`: logo, favicon and product visuals.
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

## Live Releases

App subpages render latest GitHub releases through `/api/releases`.
For private GitHub repositories, set a Cloudflare Pages secret named `GITHUB_TOKEN` with read access to releases.
