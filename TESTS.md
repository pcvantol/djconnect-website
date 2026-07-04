# Tests

## Manual Checks

- Open `wwwroot/index.html`.
- Verify the homepage navigation shows `Features`, `Ask DJ`, `Spraak`, `Blog`,
  `Installeren`, `Support` and `Privacy`, with `Aan de slag` only as the
  primary CTA button. The homepage should not show a `Hoe werkt het` self-link.
- Verify the homepage and shared navigation use the app-aligned visual system:
  midnight indigo background, violet glass panels, soft violet borders,
  magenta/violet primary actions and cyan only as a secondary analysis/voice
  accent.
- Verify the homepage Ask DJ section explains chat, optional personal recommendations,
  explicit `Play Now`, Watch/iPhone/Mac/Windows continuity, Home Assistant
  server-side Music DNA/history with explicit opt-in, Ja/Nee follow-ups, bounded history trim
  behavior, backend-aware Spotify Direct or Music Assistant actions, voice/PTT
  with Assist STT/TTS, Raspberry Pi local-only readonly_actions history/status display, ESP
  PTT/playback command flow without Ask DJ chat history, optional Apple push
  notifications as wake/attention hints only, and compact privacy boundaries.
  It must state that Ask DJ works without Music DNA, Music DNA is opt-in,
  Music DNA can be cleared at any time, clients do not store the persistent
  Music DNA profile, Spotify credentials stay in Home Assistant and DJConnect
  is not affiliated with, endorsed by, or sponsored by Spotify AB.
- Verify the homepage and Features page explain Ontdek / Music Discovery as a
  premium recommendations surface that only works after Music DNA consent,
  uses Home Assistant as the source of truth, shows daily/refreshed tracks,
  albums, artists and playlists with artwork, `Play Now` and recommendation
  reasons, and feeds `Play Now` choices back as positive Music DNA signals.
- Verify Ask DJ Track Insight copy explains server-side interpretive Track
  Insight, example prompts such as "Geef Track Insight voor dit nummer",
  genre/subgenre, mood, energy, confidence, production/listening cues, similar
  tracks, visual profile and read-only playback behavior. It must not claim
  direct analysis of encrypted Spotify playback audio or show removed tempo or harmonic-analysis copy.
- Verify the homepage `Kies je interface` section includes macOS, Windows,
  Mac Catalyst, iPhone/iPad, Voice Assistant, Embedded device and
  Linux/Raspberry Pi cards.
  The Voice Assistant card must link to `wwwroot/voice-assistant.html`.
- Open `wwwroot/features.html` and verify Ask DJ, the core features and renamed
  bonus mini-games are visible: Paddle Rally, Meteor Run, Sky Dash and Maze
  Chase.
- Verify the Features page includes server-side Ask DJ Track Insight with
  genre, mood, production/listening-cue copy and read-only behavior, without
  removed tempo or harmonic-analysis wording.
- Verify the Features, Platform, iOS, macOS and How To Start pages document
  VibeCast as a premium-ready Apple client feature via `GET
  /api/djconnect/vibecast`. Confirm supported Apple client types `ios`,
  `macos` and `watchos`, explicit macOS/iOS functional parity, backend-neutral
  Home Assistant playback source of truth, structured text segment types
  `text`, `strong`, `emphasis`, `magnify`, `accent`, `line_break`, graceful
  capability fallback, JSON disabled responses, safe disabled reasons, polling
  through `ttl_seconds`/`poll_after_seconds`, optional cache metadata, and
  WebSocket/push as a future non-breaking extension path.
- Verify the Features, Spraak, Blog, Support and Privacy pages keep their top
  navigation focused on relevant cross-links only and do not show self-links.
- Open `wwwroot/voice-commands.html` and verify the current-track,
  playback-control, default playlist, playlist, artist-with-track, album, track
  and artist voice intent families.
- Verify the Spraak page shows Ask DJ examples separately from deterministic
  voice commands, including conversational follow-ups, contextual play
  follow-ups, Music DNA summary privacy questions, album/artist questions,
  concert agenda, next-track info, listening-profile analysis, recommendations
  with explicit `Play Now`, seeded mix/playlist requests, DJ announcements,
  ambient system facts and idle suggestions.
- Verify the voice commands page shows only the selected NL or EN example phrases when the language toggle changes.
- Verify every public page offers `EN`, `NL`, `DE`, `FR` and `ES` language
  controls, has matching `hreflang` alternates, and that `npm run i18n:check`
  passes without missing translation keys or broken localized routes.
- Verify `npm run sitemap:build` keeps `wwwroot/sitemap.xml` generated from the
  public page registry and includes every public route for `en`, `nl`, `de`,
  `fr` and `es`.
- Verify shared product/legal strings come from `wwwroot/assets/i18n.js`,
  including taglines, pairing wording, requirements, client names, MIT license
  notes and the Spotify trademark/non-affiliation disclaimer.
- Verify all public examples use fictional artist, track, album and playlist
  names only. Real artist names must not appear in website copy, docs,
  release-note assets, tests or screenshots.
- Verify the voice commands page mirrors the canonical HA repo
  `examples/voice_intents.json` examples: current-track questions read status
  only, playback-control phrases map directly to backend commands, generic
  artist requests stay artist-first, explicit number/song/track requests are
  track searches, album/plaat requests are album searches,
  playlist/afspeellijst requests are playlist searches and default
  playlist/favorites phrases map to the configured default playlist.
- Verify `VOICE_INTENT_DATA_PROMPT.md` still asks the Home Assistant integration for structured intentdata only.
- Open `wwwroot/blog.html` and verify the Blog overview links to `wwwroot/blog-djconnect-project.html`.
- Open `wwwroot/blog-djconnect-project.html` and verify the post explains the DJConnect project, Home Assistant base and multi-client workflow.
- Open `wwwroot/support.html` and verify `support@djconnect.dev` is the primary
  support contact, the `mailto:` link is present and GitHub Issues remains as a
  technical fallback.
- Open `wwwroot/troubleshooting.html` and verify it covers common Spotify
  OAuth redirect URI, HACS, pairing, Home Assistant Assist, playback, download
  and firmware problems. Verify Support links to this page.
- Verify the troubleshooting page covers macOS mDNS pairing where Home
  Assistant sees `_djconnect._tcp.local` but cannot fetch the advertised
  `local_url` endpoints. It should tell users to test
  `/api/device/pairing-info` and `/api/device/info` with curl from the Home
  Assistant host or another LAN device, expect HTTP 200 JSON, and check macOS
  firewall/security software such as ESET, Little Snitch or LuLu.
- Open `wwwroot/privacy.html` and verify it clearly covers website analytics,
  app/Home Assistant token storage, voice/audio processing, support email,
  optional Apple push notifications through the central push relay as Ask
  DJ-only wake/sync hints without tokens or full Ask DJ history, absence of
  tracking cookies and the `support@djconnect.dev` privacy contact. It must
  also explain that Ask DJ works normally without Music DNA, Music DNA is
  explicit opt-in in Home Assistant, learned DNA can be cleared, clients do not
  reconstruct a persistent profile from local Track Insight history, active
  integration voice routes use Home Assistant Assist/STT/TTS rather than direct
  external AI/STT/TTS APIs, and diagnostics contain no raw audio, full prompts,
  Ask DJ history or Music DNA dumps.
- Verify public page footers link to `wwwroot/support.html` rather than directly
  to GitHub Issues.
- Verify public page footers link to `wwwroot/privacy.html` for App Store
  review.
- Open `wwwroot/raspberry-pi.html` and verify it loads Raspberry Pi builds from `pcvantol/djconnect-pi-releases`.
- Verify the Raspberry Pi page has one `Ondersteunde hardware` section with a
  Raspberry Pi Zero 2 W plus Pimoroni HyperPixel 4.0 Square block and external
  links to both product pages.
- Verify the Raspberry Pi page explains the fresh-Pi flow from Raspberry Pi OS
  Lite 64-bit through first-boot configuration, SSH, Git checkout and
  `scripts/bootstrap_raspberry_pi_os.sh`.
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
- Verify the command examples are quoted, use music-note markers and are sourced
  from `wwwroot/assets/voice-intents.js`.
- Verify the homepage voice example chips render from `wwwroot/assets/voice-intents.js`
  and link to the Spraak page for more examples.
- Open `wwwroot/start.html` and verify the five setup sections: voice assist pipeline, HACS installation, DJConnect configuration, pairing/downloads and first use.
- Verify the start page has a clear Home button back to `wwwroot/index.html`.
- Verify the start page clearly separates automatic HACS installation from manual setup steps.
- Verify the start page explains that Spotify OAuth uses the user's own Spotify
  Developer app, the Home Assistant external callback URL and the Spotify
  Client ID.
- Verify the Spotify OAuth steps mention the redirect path
  `/api/djconnect/spotify/callback`, Nabu Casa HTTPS external URL preference,
  PKCE and that a Client Secret is preferably not required.
- Verify the start page explains the current pairing model in user-facing
  language: pairing is local, Home Assistant and the client must be on the same
  local network during pairing, app clients can then work remotely through an
  external/Nabu Casa HTTPS URL, ESP32/Raspberry Pi remain local-device clients,
  iPhone scans a Home Assistant-generated QR/deep-link payload, Apple Watch
  pairs through iPhone proxy, and macOS/Windows use the local Home Assistant URL
  plus the Home Assistant-generated pairing code.
- Verify the developer pairing copy says app clients are inbound-only, Home
  Assistant never calls back to a local app API, app clients post to
  `POST /api/djconnect/pair`, app-client mDNS/local-API discovery is absent,
  local-device clients may use `_djconnect._tcp` and local `/api/device/*`, and
  ESP32/Raspberry Pi receive no `ha_remote_url`.
- Verify the start page links to Home Assistant voice assistant documentation, the embedded firmware page and app releases.
- Verify the ESP pairing flow says Home Assistant configures the device automatically and the device is ready for use.
- Verify the pairing switch has separate full-width panels for ESP device, iOS app, macOS app, Windows app and Raspberry Pi app.
- Verify the footer privacy notice is present and translated on all public pages.
- Verify each pairing panel has its own download as step 1.
- Verify the app pairing flow uses the selected client type, not a combined iOS/macOS step.
- Verify the start page does not include an inline troubleshooting section;
  troubleshooting content belongs on `wwwroot/troubleshooting.html`.
- Verify the Spotify Premium account is configured inside the DJConnect configuration section, not as a separate top-level setup block.
- Verify the homepage embedded card opens `wwwroot/embedded.html`.
- Open `wwwroot/macos.html` and `wwwroot/ios.html`.
- Open `wwwroot/testflight.html` and verify it explains how to join the
  TestFlight beta, install TestFlight, open the invite link, pair with Home
  Assistant and send feedback to `support@djconnect.dev`.
- Open `wwwroot/testflight-macos.html` and verify it explains the macOS
  TestFlight route, Mac TestFlight install step, Home Assistant pairing,
  limited beta places, expiry and feedback mailbox.
- Verify macOS, Windows, Mac Catalyst, iOS, Raspberry Pi and embedded pages have `Home` plus
  `Platform` navigation, where `Platform` links to the homepage app overview.
  App pages should not show cross-links to other app or embedded pages.
- Open `wwwroot/macos.html`, `wwwroot/windows.html` and `wwwroot/maccatalyst.html` and verify each shows binaries or the empty app-release-repo state for its own target.
- Verify the embedded release cards load from GitHub or show the release fallback message.
- Open `wwwroot/embedded.html`.
- Verify Dutch and English language toggles update visible text on start, embedded, iOS, macOS, Windows, Mac Catalyst, Features and Raspberry Pi pages.
- Verify the embedded page lists LilyGO T-Embed CC1101 under supported hardware.
- Verify ESP32-S3-BOX-3 is not listed as a supported device or supported
  ESPHome voice assistant example; troubleshooting may mention that it is no
  longer supported.
- Verify the embedded ESP32 visual card has clear spacing and includes the LilyGO product specifications link.
- Verify the embedded release block points to `pcvantol/djconnect-firmware` releases.
- Verify iOS, macOS, Windows, Mac Catalyst, ESP32 firmware and Raspberry Pi/Linux release blocks show only the latest GitHub release.
- Verify iOS download cards never show macOS assets, and macOS download cards
  never show iOS assets from the shared app release repository.
- Verify Windows and Mac Catalyst download cards filter namespaced
  `windows/vX.Y.Z` and `maccatalyst/vX.Y.Z` releases separately and show the
  unsigned validation-build copy.
- Verify pages with dynamic download cards load `assets/downloads.js` with the
  current site version query string and `wwwroot/_headers` keeps that renderer
  on `Cache-Control: no-cache`.
- Verify latest-version release cards show an expandable changelog from the
  GitHub release body text on macOS, iOS, ESP32 firmware and Raspberry Pi/Linux
  pages.
- Verify macOS, Windows, Mac Catalyst, ESP32 firmware and Raspberry Pi/Linux release asset links route through `/go/download`.
- Verify the macOS page no longer links to or mentions the removed `macos-download` route.
- Verify HACS and download buttons route through `/go/...` redirects and still land on the expected destination.
- Verify `/go/linux-install` resolves to the latest `pcvantol/djconnect-pi-releases` `.tar.gz` asset.
- Verify `/api/stats` is unavailable without `STATS_TOKEN` and returns aggregate-only data when authenticated.
- Verify the old `/admin` Pages Function route is absent. The static
  `operator.html` UI must use token-protected `/api/stats`; that endpoint combines
  GitHub release asset `download_count` download counts with D1 redirect-click
  counters when `ANALYTICS_DB` is bound.
- Verify the operator install-token revoke UI calls local
  `POST /api/operator/install-token/revoke`, while the Pages Function targets
  the bootstrap-only `POST /v1/operator/install-token/revoke` API contract with
  server-side `DJCONNECT_RELAY_SECRET`. Cover happy path revoke, revoked-0
  already-disabled/not-found behavior, confirm-required behavior, API 401/403
  rendering and secret redaction. Do not include real tokens or production
  identifiers in source or fixtures.
- Verify the operator APNs registration overview is reachable only after
  Cloudflare Access, calls local `GET /api/operator/registrations`, and never
  calls the central API directly from the browser. Test filters for client type,
  APNs environment, status and install ID; test previous/next pagination; verify
  errors redact bearer tokens and `djci_...` values; confirm visible rows contain
  only hashes/prefixes and privacy-safe metadata, never raw APNs tokens,
  ciphertext, nonces, raw install IDs or raw device IDs.
  Do not document private access details or credentials in docs, issues or
  diagnostics.
- Verify `https://djconnect.dev` is used in canonical tags, `robots.txt`, `sitemap.xml` and public install commands.
- Verify every public page has one `main` landmark, one `h1`, a visible-on-focus
  skip link to `#mainContent`, explicit language metadata, and decorative empty
  images hidden from assistive technology.
- Verify shared navigation CSS provides focus-visible styling, reduced-motion
  handling and 44px touch targets for interactive controls.
- Verify `wwwroot/_headers` sets security headers, cautious HTML caching,
  long-lived immutable asset caching and no-cache rules for dynamic renderer
  scripts.
- Verify `wwwroot/404.html` exists, is marked `noindex` and links users back to
  Home and Support without being included in `sitemap.xml`.
- Verify `npm run build:release` creates `dist/wwwroot` with minified shared
  assets for root and localized routes, and that deployment commands use that
  release output.
- Verify `https://www.djconnect.dev` redirects permanently to `https://djconnect.dev`, preserving path and query string.
- Verify the embedded page uses the shared app-aligned site color styling:
  midnight indigo background, violet glass panels, magenta/violet CTA treatment
  and cyan only as a secondary analysis/voice accent.
- Verify iOS, macOS, Windows and Mac Catalyst do not show website repository release embeds, iOS/macOS/Windows/Mac Catalyst use `pcvantol/djconnect-app-releases`, ESP32 uses `pcvantol/djconnect-firmware` downloadable assets and Raspberry Pi uses `pcvantol/djconnect-pi-releases`.
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
test -f wwwroot/support.html
test -f wwwroot/privacy.html
test -f wwwroot/assets/djconnect/site.webmanifest
test -f migrations/0001_create_click_counters.sql
test -f README.md
test -f HANDOFF.md
test -f TESTS.md
test -f TODO.md
test -f ISSUES.md
test -f CHANGELOG.md
test -f TECHNICAL_DESIGN.md
test -f CHAT_BOOTSTRAP.md
test ! -e SYNC_PROMPTS.md
test ! -e PRODUCT_ROADMAP.md
test ! -e HA_SYNC_PROMPT.md
test ! -e ESP_SYNC_PROMPT.md
test ! -e IOS_MACOS_APP_HANDOFF.md
test ! -e APPLE_APP_SYNC_PROMPTS.md
test ! -e docs/SYNC_PROMPTS.md
```

Before every release, check whether the test suite needs to grow. Add or update tests for changed routes, copy, translations, rendering contracts, analytics redirects, release scripts or deploy behavior.

`release.sh` also enforces the core documentation-file presence, verifies that
`CHANGELOG.md` and `HANDOFF.md` mention the current website version, includes
`CHAT_BOOTSTRAP.md` in the release documentation set, runs
`npm run deps:update`, records active npm, Wrangler and Playwright tool
versions, fails if package metadata changes without a commit and builds the
minified release output in `dist/wwwroot`. CI runs `npm run deps:check` so
dependency drift is caught before merge. When a third-party library, framework
or release tool is upgraded, update `TECHNICAL_DESIGN.md` and any third-party
notices before publishing.

Cross-repo contract changes must update the only canonical sync prompt in
`pcvantol/djconnect/SYNC_PROMPTS.md`. Product roadmap changes must update
`pcvantol/djconnect/PRODUCT_ROADMAP.md`. This website repo must not contain
local copies of either file or any old loose sync prompt file.

For a full release with a new tag:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
export CLOUDFLARE_ACCOUNT_ID='your-cloudflare-account-id'
./release.sh
```

`release.sh` removes old GitHub Releases, matching local/remote tags and older GitHub Actions workflow runs by default. Use `KEEP_WORKFLOW_RUNS=N` to keep more workflow runs.

For a deploy-only pass after a tag/release already exists:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
export CLOUDFLARE_ACCOUNT_ID='your-cloudflare-account-id'
npm run build:release
npx wrangler@4 pages deploy dist/wwwroot --project-name djconnect --branch main
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

## Playwright Smoke Tests

GitHub Actions installs the Chromium Playwright browser and runs
`tests/smoke.spec.mjs` as the live smoke suite before building or deploying the
release site. Run the same check locally with:

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

## Operator Access Guard

Static tests assert that `/operator`, `/operator.html` and `/api/operator/*`
are covered by Pages middleware and require a Cloudflare Access JWT. The
middleware validates `Cf-Access-Jwt-Assertion` against the Access certs endpoint
for `CLOUDFLARE_ACCESS_TEAM_DOMAIN` and the configured
`CLOUDFLARE_ACCESS_AUD`. Without those Pages settings the operator routes
return a fail-closed error instead of serving the UI or proxying revoke calls.

## Live Screenshot Capture

Generate full-page screenshots for the published site in Dutch at a common
laptop viewport:

```bash
npm run screenshots:live
```

By default this captures `https://djconnect.dev` at `1440x900`, forces the
website language to Dutch and writes PNG files plus a `manifest.json` to
`screenshots/live-laptop/`. The manifest records `"language": "nl"` and the
release script checks for that value before tagging.

Override the target or viewport when needed:

```bash
SCREENSHOT_BASE_URL=https://djconnect.pages.dev npm run screenshots
SCREENSHOT_WIDTH=1366 SCREENSHOT_HEIGHT=768 npm run screenshots:live
SCREENSHOT_OUTPUT_DIR=screenshots/live-1366 npm run screenshots:live
SCREENSHOT_LANG=en SCREENSHOT_OUTPUT_DIR=screenshots/live-en npm run screenshots
```

## Future Automation

- Expand Playwright smoke tests for actual language switching behavior.
- Expand browser smoke tests for live GitHub release card rendering.
- Add a link checker for external URLs.
- Add HTML validation in CI.
