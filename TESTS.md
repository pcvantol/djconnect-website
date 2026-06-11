# Tests

## Manual Checks

- Open `wwwroot/index.html`.
- Verify the homepage navigation scrolls to Platform, Essentials and Apps & devices.
- Open `wwwroot/start.html` and verify HACS, Spotify, Assist, pairing and troubleshooting sections.
- Verify the Embedded device navigation link opens `wwwroot/embedded.html`.
- Open `wwwroot/macos.html` and `wwwroot/ios.html`.
- Open `wwwroot/macos-download.html` and verify it shows binaries or the empty release-repo state.
- Verify the release cards load from GitHub or show the release fallback message.
- Open `wwwroot/embedded.html`.
- Verify Dutch and English language toggles update all visible embedded-page text.
- Verify the embedded page lists LilyGO T-Embed CC1101 and ESP32-S3-BOX-3 under supported hardware.
- Verify the embedded page navigation can return to `wwwroot/index.html`.
- Verify the page renders at desktop width, tablet width and mobile width.

## Release Checks

Run before deploying:

```bash
node --test
git status --short
test -f wwwroot/index.html
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
