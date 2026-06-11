# Tests

## Manual Checks

- Open `wwwroot/index.html`.
- Verify the homepage navigation scrolls to Platform, Essentials and Apps & devices.
- Verify the homepage hero shows the macOS, iPad and iPhone form factors next to each other without overlap.
- Verify the homepage hero text says `Speel, Vraag aan, Ontvang Persoonlijke DJ aankondiging`.
- Open `wwwroot/start.html` and verify the five setup sections: HACS installation, voice assist pipeline, DJConnect configuration, pairing/downloads and first use.
- Verify the start page has a clear Home button back to `wwwroot/index.html`.
- Verify the start page clearly separates automatic HACS installation from manual setup steps.
- Verify the start page links to Home Assistant voice assistant documentation, ESP firmware releases and app releases.
- Verify the Spotify Premium account is configured inside the DJConnect configuration section, not as a separate top-level setup block.
- Verify the homepage embedded card opens `wwwroot/embedded.html`.
- Open `wwwroot/macos.html` and `wwwroot/ios.html`.
- Open `wwwroot/macos-download.html` and verify it shows binaries or the empty release-repo state.
- Verify the release cards load from GitHub or show the release fallback message.
- Open `wwwroot/embedded.html`.
- Verify Dutch and English language toggles update all visible embedded-page text.
- Verify the embedded page lists LilyGO T-Embed CC1101 and ESP32-S3-BOX-3 under supported hardware.
- Verify the embedded page links to `pcvantol/djconnect-firmware` for firmware downloads.
- Verify the embedded page does not mention pre-flashed devices.
- Verify the embedded page navigation can return to `wwwroot/index.html`.
- Verify the page renders at desktop width, tablet width and mobile width.

## Release Checks

Run before deploying:

```bash
node --test
git status --short
test -f wwwroot/index.html
test -f wwwroot/start.html
test -f wwwroot/assets/djconnect/site.webmanifest
```

After deployment:

```bash
curl -I https://djconnect.pages.dev
```

Expected result: `HTTP/2 200`.

## Future Automation

- Add Playwright smoke tests for language switching and navigation behavior.
- Add browser smoke tests for live GitHub release embeds.
- Add a link checker for external URLs.
- Add HTML validation in CI.
