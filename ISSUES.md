# Issues

Use GitHub Issues for active tracking. This file captures known repository-level concerns that do not need a ticket yet.

## Open

- The macOS and iOS visuals are illustrative placeholders until native app screenshots are available.
- The Raspberry Pi hero is a CSS HyperPixel-style mockup until a real Linux client screenshot is available.
- Cloudflare Pages deployment requires `CLOUDFLARE_API_TOKEN` locally or as a GitHub Actions secret.
- Aggregate click counters require the Cloudflare Pages D1 binding `ANALYTICS_DB`; redirects still work when the binding is not configured.
- `/api/stats` requires `STATS_TOKEN`; without it the endpoint intentionally returns unauthorized responses.
- `/admin` is retired; the new static `operator.html` UI uses token-protected
  `/api/stats`.
- Cloudflare Access must be configured with a self-hosted application covering
  `/operator`, `/operator.html` and `/api/operator/*`; Pages middleware now
  fails these routes closed until the Access JWT settings are present.
- The Home Assistant badge uses the official Home Assistant brand logo; confirm formal "Works with Home Assistant" certification requirements before presenting it as a certification mark.

## Resolved

- Initial static website deployed to Cloudflare Pages.
- Wrangler cache excluded from Git with `.gitignore`.
- Removed pre-flashed device wording and replaced it with firmware download and flashing guidance.
- Added static regression tests for homepage hero copy, current setup wording and translation key coverage.
- Embedded ESP32 downloads now render GitHub release assets inline, matching the macOS and Linux download pages.
- ESP32, macOS and Linux download embeds are covered by static tests for latest-only rendering and tracked `/go/download` links.
- The retired `macos-download` route is covered by static tests to prevent accidental relinking.
- Local page and asset links are covered by the default Node test suite.
- A stats-check helper is available through `STATS_TOKEN=... npm run stats:check`.
- Public support/contact links now point to the website Support page with
  `support@djconnect.dev`; GitHub Issues remains available as a technical
  fallback from that page.
- App Store-ready Privacy Policy and visible footer links are live.
- Cloudflare Pages deployment is connected to GitHub Actions on `main`; direct
  Wrangler deploy remains a fallback for deploy-only recovery.
- GitHub Actions installs the Chromium Playwright browser and runs the live
  `test:smoke` suite before building/deploying the release site.
- Operator routes have fail-closed Pages middleware that verifies Cloudflare
  Access JWTs before serving `/operator` or `/api/operator/*`.
