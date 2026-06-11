# Handoff

## Current State

- Repository remote: `git@github.com:pcvantol/djconnect-website.git`
- Production URL: https://djconnect.pages.dev
- Cloudflare Pages project: `djconnect`
- Publish directory: `wwwroot`
- Main page: `wwwroot/index.html`
- Embedded ESP32 one-pager: `wwwroot/embedded.html`

## Important Notes

- The site is static HTML/CSS/JavaScript with no build step.
- The homepage is platform-independent and routes users to macOS, iOS and embedded options.
- The homepage has prepared App Store CTA placeholders with `data-store-link="macos"` and `data-store-link="ios"`.
- Language switching on the embedded page is handled in `wwwroot/embedded.html` through the `translations` object.
- The embedded page keeps the detailed ESP32/Home Assistant setup, requirements and FAQ.
- Do not commit `.wrangler/`; it is local Wrangler cache.

## Release Steps

1. Commit all changes.
2. Ensure `CLOUDFLARE_API_TOKEN` is set in the shell.
3. Run `./release.sh`.
4. Verify https://djconnect.pages.dev returns HTTP 200.
