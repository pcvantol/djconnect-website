# DJConnect Website

Static landing page for DJConnect, published through Cloudflare Pages.

## Structure

- `wwwroot/index.html`: platform homepage with DJConnect essentials.
- `wwwroot/embedded.html`: ESP32 embedded-device one-pager.
- `wwwroot/assets/`: logo, favicon and product visuals.

## Local Preview

Open `wwwroot/index.html` directly in a browser, or serve the folder with any static web server.

## Deploy

The production site is deployed to Cloudflare Pages:

- Production: https://djconnect.pages.dev
- Project name: `djconnect`
- Publish directory: `wwwroot`

Use `./release.sh` for the standard release flow.
