# TODO

## Website

- Replace the homepage `data-store-link="macos"` placeholder with the final Mac App Store URL.
- Replace the homepage `data-store-link="ios"` placeholder with the final iOS App Store URL.
- Replace CSS-drawn macOS and iOS mockups with real screenshots when apps exist.
- Replace the homepage carousel mockups with final product screenshots when the apps and hardware visuals are ready.
- Replace the iOS and macOS hero mockups with real app screenshots once the native clients are ready.
- Replace the Raspberry Pi HyperPixel-style mockup with a real product screenshot once the Linux client UI is finalized.
- Add a tiny admin/dashboard page for aggregate download and HACS counters from `/api/stats`.
- Add a small operational note or script for checking `/api/stats` once the D1 binding and `STATS_TOKEN` are configured in Cloudflare.
- Add a dedicated privacy page if the site ever moves beyond aggregate, cookieless counters.
- Add a support/contact route or mail link.
- Replace footer version when preparing the next release.

## Platform

- Document the expected ESP32 firmware pairing flow with screenshots.
- Add firmware flashing screenshots from `pcvantol/djconnect-firmware` when the public firmware flow is stable.
- Decide whether Cloudflare Pages deployments should be manual only or connected to GitHub.
- Add automated link checking once the page links stabilize.
- Promote the current browser smoke checks into repeatable Playwright tests in CI, including language toggles, latest download cards and mobile navigation.
