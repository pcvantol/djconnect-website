# TODO

Product-level ideas, killer features, production must-haves and premium feature
candidates are tracked only in `pcvantol/djconnect/PRODUCT_ROADMAP.md`.
Cross-repo contract changes are tracked only in
`pcvantol/djconnect/SYNC_PROMPTS.md`.

## Website

- Replace the homepage `data-store-link="macos"` placeholder with the final Mac App Store URL.
- Replace the homepage `data-store-link="ios"` placeholder with the final iOS App Store URL.
- Replace CSS-drawn macOS and iOS mockups with real screenshots when apps exist.
- Replace the homepage carousel mockups with final product screenshots when the apps and hardware visuals are ready.
- Replace the iOS and macOS hero mockups with real app screenshots once the native clients are ready.
- Replace the Raspberry Pi HyperPixel-style mockup with a real product screenshot once the Linux client UI is finalized.
- Replace the temporary hardcoded `/admin` Basic Auth page with Cloudflare Access
  or secret-backed authentication before broader use.
- Extend `/admin` beyond GitHub runtime `download_count` totals with D1 redirect
  click counters when the persistence layer is ready.
- Replace footer version when preparing the next release.

## Platform

- Document the expected ESP32 firmware pairing flow with screenshots.
- Add firmware flashing screenshots from `pcvantol/djconnect-firmware` when the public firmware flow is stable.
- Expand Playwright smoke tests for actual language switching, rendered latest download cards and mobile navigation behavior in CI.
