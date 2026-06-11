# Handoff

## Current State

- Repository remote: `git@github.com:pcvantol/djconnect-website.git`
- Production URL: https://djconnect.pages.dev
- Cloudflare Pages project: `djconnect`
- Publish directory: `wwwroot`
- Current version: `3.1.0`
- Main page: `wwwroot/index.html`
- macOS app page: `wwwroot/macos.html`
- macOS binary download page: `wwwroot/macos-download.html`
- iOS app page: `wwwroot/ios.html`
- Embedded ESP32 one-pager: `wwwroot/embedded.html`

## Important Notes

- The site is static HTML/CSS/JavaScript with no build step.
- The homepage is platform-independent and routes users to macOS, iOS and embedded options.
- The homepage has prepared App Store CTA placeholders with `data-store-link="macos"` and `data-store-link="ios"`.
- App subpages use `assets/releases.js`, `assets/releases.css` and the Cloudflare Pages Function `functions/api/releases.js` to live-render GitHub releases.
- macOS downloads use `assets/downloads.js` and the public repo `pcvantol/djconnect-app-releases`.
- If the GitHub repository/releases are private, set `GITHUB_TOKEN` as a Cloudflare Pages secret for the `djconnect` project.
- Version is tracked in `VERSION`, `package.json`, page footers and `CHANGELOG.md`.
- Language switching on the embedded page is handled in `wwwroot/embedded.html` through the `translations` object.
- The embedded page keeps the detailed ESP32/Home Assistant setup, requirements and FAQ.
- Do not commit `.wrangler/`; it is local Wrangler cache.

## Release Steps

1. Commit all changes to `main`.
2. Ensure `CLOUDFLARE_API_TOKEN` is set in the shell.
3. Run `./release.sh`.
4. Verify the GitHub Release and https://djconnect.pages.dev.
