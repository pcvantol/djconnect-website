# Tests

## Manual Checks

- Open `wwwroot/index.html`.
- Verify the homepage navigation shows `Hoe werkt het`, `Features` and `Installeren`, with `Aan de slag` only as the primary CTA button.
- Open `wwwroot/features.html` and verify the core features and renamed bonus mini-games are visible: Paddle Rally, Meteor Run, Sky Dash and Maze Chase.
- Open `wwwroot/raspberry-pi.html` and verify it loads Raspberry Pi builds from `pcvantol/djconnect-pi-releases`.
- Verify the generated Raspberry Pi install command ends with `sudo ./scripts/install.sh`.
- Verify the Raspberry Pi install command has a copy-to-clipboard button.
- Verify the Raspberry Pi install command downloads through `https://djconnect.dev/go/linux-install`, not a hard-coded release asset URL.
- Verify the homepage hero uses a swipeable carousel with separate macOS, landscape iPad and LilyGO/ESP32 slides.
- Verify the iOS carousel slide uses one landscape iPad only, without a second iPhone visual.
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
- Verify the footer privacy notice is present and translated on all public pages.
- Verify each pairing panel has its own download as step 1.
- Verify the app pairing flow uses the selected client type, not a combined iOS/macOS step.
- Verify the troubleshooting cards use the current Spotify authorization, HACS refresh and local reachability wording.
- Verify the Spotify Premium account is configured inside the DJConnect configuration section, not as a separate top-level setup block.
- Verify the homepage embedded card opens `wwwroot/embedded.html`.
- Open `wwwroot/macos.html` and `wwwroot/ios.html`.
- Verify macOS, iOS, Raspberry Pi and embedded pages label the homepage navigation route as `Home`; app pages should not show cross-links to other app or embedded pages.
- Open `wwwroot/macos.html` and verify it shows binaries or the empty app-release-repo state.
- Verify the embedded release cards load from GitHub or show the release fallback message.
- Open `wwwroot/embedded.html`.
- Verify Dutch and English language toggles update visible text on start, embedded, iOS, macOS, Features and Raspberry Pi pages.
- Verify the embedded page lists LilyGO T-Embed CC1101 and ESP32-S3-BOX-3 under supported hardware.
- Verify the embedded ESP32 visual card has clear spacing and includes the LilyGO product specifications link.
- Verify the embedded release block points to `pcvantol/djconnect-firmware` releases.
- Verify macOS, ESP32 firmware and Raspberry Pi/Linux release blocks show only the latest GitHub release.
- Verify macOS, ESP32 firmware and Raspberry Pi/Linux release asset links route through `/go/download`.
- Verify the macOS page no longer links to or mentions the removed `macos-download` route.
- Verify HACS and download buttons route through `/go/...` redirects and still land on the expected destination.
- Verify `/go/linux-install` resolves to the latest `pcvantol/djconnect-pi-releases` `.tar.gz` asset.
- Verify `/api/stats` is unavailable without `STATS_TOKEN` and returns aggregate-only data when authenticated.
- Verify `https://djconnect.dev` is used in canonical tags, `robots.txt`, `sitemap.xml` and public install commands.
- Verify `https://www.djconnect.dev` redirects permanently to `https://djconnect.dev`, preserving path and query string.
- Verify the embedded page uses the shared site color styling: cyan/green CTA and the same subtle cyan/pink/green background family as the homepage.
- Verify iOS does not show website repository release embeds, ESP32 uses `pcvantol/djconnect-firmware` downloadable assets and Raspberry Pi uses `pcvantol/djconnect-pi-releases`.
- Verify the embedded page does not mention pre-flashed devices.
- Verify the embedded page does not show local quick start, requirements, FAQ, the experience section or the `Stem via HA / Veilig gekoppeld / DJ-karakter` row.
- Verify embedded `Start installatie` buttons route to `wwwroot/start.html`.
- Verify the embedded page navigation can return to `wwwroot/index.html`.
- Verify the page renders at desktop width, tablet width and mobile width.

## Release Checks

Run before deploying:

```bash
node --test
npm test
git diff --check
git status --short
test -f wwwroot/index.html
test -f wwwroot/start.html
test -f wwwroot/assets/djconnect/site.webmanifest
test -f migrations/0001_create_click_counters.sql
test -f README.md
test -f HANDOFF.md
test -f TESTS.md
test -f TODO.md
test -f ISSUES.md
test -f CHANGELOG.md
test -f SYNC_PROMPTS.md
test -f TECHNICAL_DESIGN.md
```

Before every release, check whether the test suite needs to grow. Add or update tests for changed routes, copy, translations, rendering contracts, analytics redirects, release scripts or deploy behavior.

`release.sh` also enforces the core documentation-file presence and verifies that `CHANGELOG.md` and `HANDOFF.md` mention the current website version.

For a full release with a new tag:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
./release.sh
```

`release.sh` removes old GitHub Releases, matching local/remote tags and older GitHub Actions workflow runs by default. Use `KEEP_WORKFLOW_RUNS=N` to keep more workflow runs.

For a deploy-only pass after a tag/release already exists:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
npx wrangler pages deploy wwwroot --project-name djconnect --branch main
```

After deployment:

```bash
curl -I https://djconnect.dev
curl -I https://www.djconnect.dev
curl -s https://djconnect.dev | grep "DJConnect website v"
```

Expected result: `HTTP/2 200` and a footer version matching `VERSION`.

## Automated Link Checks

`npm test` includes a static link checker that scans public HTML pages for local `href` and `src` references and verifies that each local page or asset exists under `wwwroot`.

External URLs are intentionally not fetched by the default test run, keeping CI fast and independent of third-party availability.

## Optional Playwright Smoke Tests

The repository includes a starter Playwright smoke suite for live/browser behavior:

```bash
SMOKE_BASE_URL=https://djconnect.dev npm run test:smoke
```

The smoke suite covers:

- Core public pages render.
- Footer version is visible.
- Language toggle is present.
- Homepage mobile navigation and setup CTA remain reachable.
- Download pages expose their latest-release containers.

Install Playwright browsers locally before first use:

```bash
npx playwright install
```

## Future Automation

- Expand Playwright smoke tests for actual language switching behavior.
- Expand browser smoke tests for live GitHub release card rendering.
- Add a link checker for external URLs.
- Add HTML validation in CI.
