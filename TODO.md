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
- Keep the old `/admin` Pages Function retired; the static `operator.html` UI
  should stay token-backed through `/api/stats`.
- Bind `ANALYTICS_DB` in Cloudflare Pages when website redirect-click totals
  should be included in `/api/stats`.
- Keep the admin install-token revoke UI wired through the server-side
  `/api/operator/install-token/revoke` proxy so `DJCONNECT_RELAY_SECRET` never
  enters browser code.
- Keep future operator Apple device registration fields privacy-safe. Add only
  hashes, prefixes, status flags or non-sensitive metadata to the UI and tests;
  never expose raw APNs tokens, ciphertext/nonces, raw install IDs, raw device
  IDs or per-install tokens.
- Replace footer version when preparing the next release.

## Platform

- Document the expected ESP32 firmware pairing flow with screenshots.
- Add firmware flashing screenshots from `pcvantol/djconnect-firmware` when the public firmware flow is stable.
- Expand Playwright smoke tests for actual language switching, rendered latest download cards and mobile navigation behavior in CI.
