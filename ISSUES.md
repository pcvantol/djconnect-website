# Issues

Use GitHub Issues for active tracking. This file captures known repository-level concerns that do not need a ticket yet.

## Open

- The macOS and iOS visuals are illustrative placeholders until native app screenshots are available.
- The Raspberry Pi hero is a CSS HyperPixel-style mockup until a real Linux client screenshot is available.
- The site currently has no committed browser regression test; responsive layout is covered by manual checks, local browser smoke checks and static assertions.
- Cloudflare Pages deployment requires `CLOUDFLARE_API_TOKEN` locally or as a GitHub Actions secret.
- Aggregate click counters require the Cloudflare Pages D1 binding `ANALYTICS_DB`; redirects still work when the binding is not configured.
- The Home Assistant badge uses the official Home Assistant brand logo; confirm formal "Works with Home Assistant" certification requirements before presenting it as a certification mark.

## Resolved

- Initial static website deployed to Cloudflare Pages.
- Wrangler cache excluded from Git with `.gitignore`.
- Removed pre-flashed device wording and replaced it with firmware download and flashing guidance.
- Added static regression tests for homepage hero copy, current setup wording and translation key coverage.
- Embedded ESP32 downloads now render GitHub release assets inline, matching the macOS and Linux download pages.
