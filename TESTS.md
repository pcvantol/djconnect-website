# Tests

## Manual Checks

- Open `wwwroot/index.html`.
- Verify the homepage navigation shows `Hoe werkt het`, `Features` and `Download`, with `Aan de slag` only as the primary CTA button.
- Open `wwwroot/features.html` and verify the core features and bonus mini-games are visible.
- Open `wwwroot/raspberry-pi.html` and verify it is clearly prepared for a future Raspberry Pi app without claiming a released binary.
- Verify the homepage hero uses a swipeable carousel with separate macOS, iPad/iPhone and LilyGO/ESP32 slides.
- Verify the homepage hero no longer shows the availability pill.
- Verify the homepage hero text says `Speel muziek & bedien op afstand`.
- Verify the macOS slide centers the play icon and does not show a microphone icon.
- Verify the iPad/iPhone slide shows the voice icon only in the iPad screen.
- Verify the LilyGO visual keeps the device display empty.
- Verify the command examples are quoted, use music-note markers and do not include `Speel Nirvana`.
- Open `wwwroot/start.html` and verify the five setup sections: voice assist pipeline, HACS installation, DJConnect configuration, pairing/downloads and first use.
- Verify the start page has a clear Home button back to `wwwroot/index.html`.
- Verify the start page clearly separates automatic HACS installation from manual setup steps.
- Verify the start page links to Home Assistant voice assistant documentation, the embedded firmware page and app releases.
- Verify the ESP pairing flow says Home Assistant configures the device automatically and the device is ready for use.
- Verify the pairing switch has separate full-width panels for ESP device, iOS app, macOS app and Raspberry Pi app.
- Verify each pairing panel has its own download as step 1.
- Verify the app pairing flow uses the selected client type, not a combined iOS/macOS step.
- Verify the troubleshooting cards use the current Spotify authorization, HACS refresh and local reachability wording.
- Verify the Spotify Premium account is configured inside the DJConnect configuration section, not as a separate top-level setup block.
- Verify the homepage embedded card opens `wwwroot/embedded.html`.
- Open `wwwroot/macos.html` and `wwwroot/ios.html`.
- Verify macOS, iOS, Raspberry Pi and embedded pages label the homepage navigation route as `Home`; app pages should not show cross-links to other app or embedded pages.
- Open `wwwroot/macos.html` and verify it shows binaries or the empty release-repo state.
- Verify the release cards load from GitHub or show the release fallback message.
- Open `wwwroot/embedded.html`.
- Verify Dutch and English language toggles update visible text on start, embedded, iOS, macOS, Features and Raspberry Pi pages.
- Verify the embedded page lists LilyGO T-Embed CC1101 and ESP32-S3-BOX-3 under supported hardware.
- Verify the embedded ESP32 visual card has clear spacing and includes the LilyGO product specifications link.
- Verify the embedded release block points to `pcvantol/djconnect-firmware` releases.
- Verify the embedded page does not mention pre-flashed devices.
- Verify the embedded page does not show local quick start, requirements, FAQ, the experience section or the `Stem via HA / Veilig gekoppeld / DJ-karakter` row.
- Verify embedded `Start installatie` buttons route to `wwwroot/start.html`.
- Verify the embedded page navigation can return to `wwwroot/index.html`.
- Verify the page renders at desktop width, tablet width and mobile width.

## Release Checks

Run before deploying:

```bash
node --test
git diff --check
git status --short
test -f wwwroot/index.html
test -f wwwroot/start.html
test -f wwwroot/assets/djconnect/site.webmanifest
```

For a full release with a new tag:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
./release.sh
```

`release.sh` keeps only the newest GitHub Actions workflow run by default. Use `KEEP_WORKFLOW_RUNS=N` to keep more.

For a deploy-only pass after a tag/release already exists:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
npx wrangler pages deploy wwwroot --project-name djconnect --branch main
```

After deployment:

```bash
curl -I https://djconnect.pages.dev
curl -s https://djconnect.pages.dev | grep "DJConnect website v"
```

Expected result: `HTTP/2 200` and a footer version matching `VERSION`.

## Future Automation

- Add Playwright smoke tests for language switching and navigation behavior.
- Add browser smoke tests for live GitHub release embeds.
- Add a link checker for external URLs.
- Add HTML validation in CI.
