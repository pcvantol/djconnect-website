# DJConnect Website

Static landing page for DJConnect, published through Cloudflare Pages.

## Structure

- `wwwroot/index.html`: platform homepage with DJConnect essentials, Ask DJ, download routes and swipeable device hero.
- `wwwroot/features.html`: feature overview page, including Ask DJ and bonus mini-games: Paddle Rally, Meteor Run, Sky Dash and Maze Chase.
- `wwwroot/platform.html`: CSS-only platform architecture overview for clients, Home Assistant, Assist, Spotify and speakers.
- `wwwroot/voice-commands.html`: bilingual How To page for DJConnect voice
  command intent families, including current-track status questions, direct
  playback controls, Spotify music search requests and separately rendered Ask
  DJ conversational examples. Spoken examples are mirrored from the HA repo
  canonical source `examples/voice_intents.json`.
- `wwwroot/voice-assistant.html`: bilingual explanation page for using DJConnect as Home Assistant Assist Conversation Agent with ESPHome-powered voice assistants.
- `wwwroot/support.html`: public support page with `support@djconnect.dev` and technical GitHub Issues fallback.
- `wwwroot/troubleshooting.html`: common-problems guide for Spotify OAuth,
  HACS, pairing, Home Assistant Assist, playback, downloads and firmware.
- `wwwroot/privacy.html`: App Store-ready Privacy Policy for website, apps,
  Home Assistant integration, voice/audio flow, aggregate analytics and support
  contact.
- `wwwroot/blog.html`: blog overview page for project notes and release/design stories.
- `wwwroot/blog-djconnect-project.html`: first project blogpost about the DJConnect architecture and workflow.
- `wwwroot/start.html`: Home Assistant setup flow for HACS installation, voice pipeline setup, DJConnect configuration, client downloads and pairing.
- Spotify OAuth runs through the user's own Home Assistant installation. Users
  must create their own Spotify Developer app, register
  `https://<your-home-assistant-external-url>/api/djconnect/spotify/callback`
  as redirect URI, copy the Client ID into the DJConnect setup and authorize
  Spotify through Home Assistant. Prefer the Nabu Casa HTTPS external URL.
  DJConnect uses PKCE, so a Spotify Client Secret is preferably not required.
- Ask DJ is a major product feature for iOS, macOS, Windows, Apple Watch and
  Raspberry Pi clients.
  Website copy should keep it clear that Ask DJ runs through Home Assistant and
  DJConnect integration v3.1.69+, uses compact bounded server-side DJ
  Memory/history, carries chat continuity across devices, can show Ja/Nee
  follow-up controls, can use optional Apple push notifications only as
  wake/sync hints through the central push relay and starts concrete
  recommendations only after the user taps `Play Now`. Raspberry Pi Ask DJ is
  currently read-only history display unless a future Pi release explicitly
  expands that scope.
- `wwwroot/embedded.html`: ESP32 embedded-device one-pager.
- `wwwroot/macos.html`: macOS app page with binaries from `pcvantol/djconnect-app-releases`.
- `wwwroot/windows.html`: Windows desktop app page with binaries from `pcvantol/djconnect-app-releases`.
- `wwwroot/maccatalyst.html`: Mac Catalyst diagnostic build page with unsigned binaries from `pcvantol/djconnect-app-releases`.
- `wwwroot/ios.html`: iOS app page with App Store placeholder.
- `wwwroot/testflight.html`: TestFlight beta route with requirements,
  invite-link guidance, Home Assistant pairing and feedback mailbox.
- `wwwroot/testflight-macos.html`: macOS TestFlight beta route with Mac
  TestFlight requirements, Home Assistant pairing and feedback mailbox.
- `wwwroot/raspberry-pi.html`: Raspberry Pi app page with builds from `pcvantol/djconnect-pi-releases`.
- `wwwroot/404.html`: branded noindex not-found page with Home and Support recovery links.
- `wwwroot/_headers`: Cloudflare Pages cache and security headers.
- `wwwroot/assets/`: logo, favicon, product visuals and shared browser assets.
- `wwwroot/assets/site-nav.css` and `wwwroot/assets/site-nav.js`: shared
  responsive navigation styling and hamburger-menu behavior included by all
  public pages with a top navigation.
- `functions/api/releases.js`: Cloudflare Pages Function proxy for GitHub release data.
- `functions/go/`: privacy-friendly redirect endpoints for HACS and downloadable assets.
- `functions/api/stats.js`: token-protected aggregate stats endpoint that combines redirect clicks with GitHub asset `download_count` totals.
- `migrations/`: optional D1 migration for cookieless aggregate click counters.
- `VERSION`: current site version.

## Local Preview

Open `wwwroot/index.html` directly in a browser, or serve the folder with any static web server.

For full local setup, testing, release and Cloudflare Pages details, see
`DEVELOPMENT_ENVIRONMENT.md`.

## Deploy

The production site is deployed to Cloudflare Pages:

- Production: https://djconnect.dev
- Redirect: https://www.djconnect.dev -> https://djconnect.dev
- Cloudflare Pages fallback: https://djconnect.pages.dev
- Project name: `djconnect`
- Source directory: `wwwroot`
- Release publish directory: `dist/wwwroot`
- Cloudflare account ID: `efe77cadf8317a53832fca0848e3ae51`

GitHub Actions runs the automated website tests and release build on pull
requests and pushes to `main`. Pushes to `main` and manual workflow dispatches
also deploy `dist/wwwroot` to Cloudflare Pages after the test job succeeds. The
repository must have an Actions secret named `CLOUDFLARE_API_TOKEN` with
permission to deploy Cloudflare Pages. The workflow sets
`CLOUDFLARE_ACCOUNT_ID` explicitly so Wrangler does not need to discover
account memberships during CI.

Configure it in GitHub:

```text
Settings -> Secrets and variables -> Actions -> New repository secret
Name: CLOUDFLARE_API_TOKEN
Value: Cloudflare API token
```

Minimum Cloudflare token permissions:

- `Cloudflare Pages:Edit`
- `Account:Read`

Use `./release.sh` for the standard release flow.

The release script refreshes declared npm dependencies when a lockfile exists,
checks the active Wrangler major version, runs tests, verifies that the Dutch
release screenshot manifest exists, checks core documentation files, builds a
minified release copy in `dist/wwwroot`, pushes `main`, creates a `vX.Y.Z` tag,
creates a GitHub Release, deploys the minified release copy to Cloudflare Pages
and then automatically removes older GitHub Releases, matching
local/remote tags and older GitHub Actions workflow runs. By default, only the
newest workflow run remains.

Before every release, update or consciously re-check all repository documentation files:

- `README.md`
- `HANDOFF.md`
- `TESTS.md`
- `TODO.md`
- `ISSUES.md`
- `CHANGELOG.md`
- `TECHNICAL_DESIGN.md`
- `CHAT_BOOTSTRAP.md`

Cross-repo contract changes must update the only canonical sync prompt in
`pcvantol/djconnect/SYNC_PROMPTS.md`. Product roadmap changes must update the
only canonical roadmap in `pcvantol/djconnect/PRODUCT_ROADMAP.md`. This website
repo must not keep local copies of either file.

When third-party libraries, frameworks or release tools are updated or upgraded,
also update the dependency inventory and third-party notice details in
`TECHNICAL_DESIGN.md` and any dedicated notices document before publishing.

`CHANGELOG.md` gets a separate entry per release and `HANDOFF.md` must mention the current `VERSION`.

Before committing the release, refresh the Dutch visual QA screenshots for all
public pages:

```bash
npm run screenshots:live
```

```bash
npm test
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
./release.sh
```

If `CLOUDFLARE_API_TOKEN` is only configured as a GitHub Actions secret, run the release without direct local deploy and let the push trigger the workflow:

```bash
./release.sh --skip-deploy
```

To keep more workflow runs during a release:

```bash
KEEP_WORKFLOW_RUNS=3 ./release.sh --skip-deploy
```

If the version tag and GitHub Release already exist and only the Pages deployment still needs to run, rebuild the minified release copy and deploy `dist/wwwroot` directly:

```bash
npm run build:release
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
export CLOUDFLARE_ACCOUNT_ID='efe77cadf8317a53832fca0848e3ae51'
npx wrangler@4 pages deploy dist/wwwroot --project-name djconnect --branch main
```

The live site should be checked for both HTTP availability and the footer version:

```bash
curl -I https://djconnect.dev
curl -I https://www.djconnect.dev
curl -s https://djconnect.dev | grep "DJConnect website v"
```

## Live Releases

The embedded page renders only the latest downloadable firmware release assets from `pcvantol/djconnect-firmware`.
The macOS page renders only the latest macOS binary downloads from `pcvantol/djconnect-app-releases` using `data-download-target="macos"`.
The Windows page renders only the latest Windows desktop builds from `pcvantol/djconnect-app-releases` using `data-download-target="windows"`.
The Mac Catalyst page renders only the latest unsigned Mac Catalyst validation builds from `pcvantol/djconnect-app-releases` using `data-download-target="maccatalyst"`.
The iOS page renders only the latest iOS builds from `pcvantol/djconnect-app-releases` using `data-download-target="ios"` until the App Store link is final.
The Raspberry Pi page renders only the latest binary downloads from `pcvantol/djconnect-pi-releases`.
Latest-version release cards show the GitHub release body text as an expandable changelog on macOS, iOS, ESP32 firmware and Raspberry Pi/Linux pages.
Pages that render dynamic downloads load `assets/downloads.js` with a version
query string, and `wwwroot/_headers` sets `Cache-Control: no-cache` for that
asset. This prevents stale browser/WebView caches from reusing an old download
renderer after platform-filter changes.
The Raspberry Pi install command is generated from the latest release and downloads through `https://djconnect.dev/go/linux-install`, then runs `sudo ./scripts/install.sh`.
The Raspberry Pi page also documents the fresh-Pi path and supported hardware:
Raspberry Pi Zero 2 W with header plus Pimoroni HyperPixel 4.0 Square, Raspberry
Pi OS Lite 64-bit, first-boot network/SSH/locale setup, repo-only OS bootstrap
and then the public app release installer.
iOS, macOS, Windows and Mac Catalyst do not load website repository releases and
must not show each other's release assets from the shared app release
repository. Windows public release tags use `windows/vX.Y.Z`; Mac Catalyst
public release tags use `maccatalyst/vX.Y.Z`. Both are unsigned
diagnostic/internal validation downloads for now.
For private GitHub repositories, set a Cloudflare Pages secret named `GITHUB_TOKEN` with read access to releases.

## Privacy-Friendly Download Insights

Download and HACS clicks can be counted without cookies, IP addresses, user agents or visitor identifiers.

- Website redirect clicks go through `/go/...` and are stored as daily aggregate totals in D1.
- Direct GitHub download totals come from GitHub release asset `download_count`.
- `/api/stats` combines both sources behind a `STATS_TOKEN`.
- `/admin` is retired. The new static `operator.html` UI reads the token-protected
  `/api/stats` endpoint and shows D1 redirect-click counters plus GitHub
  download totals.
- `operator.html` also shows a privacy-safe Apple device registration overview
  through the server-side `/api/operator/registrations` proxy. The browser never
  reads D1 directly and never receives APNs tokens, ciphertext, nonces or raw
  production install/device identifiers.

Cloudflare setup:

```bash
npx wrangler@4 d1 create djconnect_analytics
npx wrangler@4 d1 migrations apply djconnect_analytics --remote
```

Then add these Cloudflare Pages bindings/secrets for project `djconnect`:

- D1 binding: `ANALYTICS_DB` -> `djconnect_analytics`
- Secret: `STATS_TOKEN` -> a private token for `/api/stats`
- Secret: `DJCONNECT_RELAY_SECRET` -> API operator/bootstrap secret used only
  by server-side Pages Functions for operator actions.
- Variable/secret: `CLOUDFLARE_ACCESS_TEAM_DOMAIN` -> your Zero Trust team
  domain, for example `your-team.cloudflareaccess.com`.
- Secret: `CLOUDFLARE_ACCESS_AUD` -> the Cloudflare Access application
  audience tag for the `djconnect.dev/operator` application.
- Optional variable: `DJCONNECT_API_BASE_URL` -> defaults to
  `https://api.djconnect.dev`.
- Optional secret: `GITHUB_TOKEN` -> only needed for private release repos or higher GitHub API limits

Fetch stats:

```bash
curl -H "Authorization: Bearer $STATS_TOKEN" "https://djconnect.dev/api/stats?days=30"
```

Or use the repository helper:

```bash
STATS_TOKEN='your-stats-token' npm run stats:check
STATS_DAYS=7 STATS_TOKEN='your-stats-token' npm run stats:check
```

Open `https://djconnect.dev/operator.html` for the browser UI. External access
must be protected with a Cloudflare Access self-hosted application for
`djconnect.dev` covering `/operator`, `/operator.html` and `/api/operator/*`.
The Pages middleware verifies the `Cf-Access-Jwt-Assertion` JWT against
`CLOUDFLARE_ACCESS_TEAM_DOMAIN` and `CLOUDFLARE_ACCESS_AUD`; when either value
is missing or the JWT is invalid, operator routes fail closed. The UI does not
contain operator secrets and still requires `STATS_TOKEN` before it can read
stats data.

Operator revoke actions must stay server-side. The browser calls
`POST /api/operator/install-token/revoke`; that Pages Function uses
`DJCONNECT_RELAY_SECRET` to call central API
`POST https://api.djconnect.dev/v1/operator/install-token/revoke`. Browser
payloads contain `ha_install_id`, central API `token_id` and a short reason
only. Never send raw `djci_...` token material from the browser and never expose
`DJCONNECT_RELAY_SECRET` in static assets or client-side JavaScript.

The same admin UI also contains an operator-only install-token revoke flow for
incident response when a per-install `djci_...` token is compromised. It is
implemented through the server-side Pages Function
`POST /api/operator/install-token/revoke`, which calls
`POST https://api.djconnect.dev/v1/operator/install-token/revoke` with
`DJCONNECT_RELAY_SECRET`. The browser request contains only `ha_install_id`,
`token_id` and a bounded reason such as
`operator-disabled-compromised-install`; it never sends raw `djci_...` token
material or the operator secret. New token provisioning is a separate operator
action.

The operator Apple device overview calls `GET /api/operator/registrations`.
That Pages Function adds server-side `DJCONNECT_RELAY_SECRET` auth and forwards
to `GET https://api.djconnect.dev/v1/admin/registrations`. The UI may render
only privacy-safe metadata such as `ha_install_id_hash`, `device_id_hash`,
`client_type`, `apns_environment`, status flags, last success/error and
timestamps. Do not add raw APNs tokens, token ciphertext/nonces, per-install
tokens, raw production install IDs or raw device IDs to browser code, fixtures
or docs.

The redirect layer is fail-open: if `ANALYTICS_DB` is not configured yet, users are still redirected and no personal data is stored.

## Support

Public support is available through the website support page and email:

- https://djconnect.dev/support
- support@djconnect.dev

Technical website issues can still be reported through GitHub Issues:

https://github.com/pcvantol/djconnect/issues

## License

This repository is released under the MIT License. See `LICENSE`.

## Cleanup

Use `./cleanup_old_releases.sh` manually only when you want cleanup outside the normal release flow. `./release.sh` already runs it by default after a successful release. The cleanup script removes old GitHub Releases, matching local/remote tags and older GitHub Actions workflow runs. It keeps the current `VERSION` tag and the newest 10 workflow runs by default.

```bash
./cleanup_old_releases.sh --dry-run
./cleanup_old_releases.sh --keep-runs 10
```

## Content Hygiene

- Keep Dutch and English translation keys in sync on the homepage, start page,
  embedded page, Features page, Spraak page, Blog page, Privacy page, Support
  page, Raspberry Pi page, iOS page, macOS page and Voice Assistant page.
- Keep App Store links as placeholders until the macOS and iOS apps are published.
- Do not describe embedded devices as pre-flashed; link users to the firmware repository and flashing flow instead.
- Keep homepage navigation focused on cross-page routes: `Features`, `Ask DJ`,
  `Spraak`, `Blog`, `Installeren`, `Support`, `Privacy` and the primary `Aan de slag`
  CTA. Do not add a `Hoe werkt het` self-link to the homepage top navigation.
- Keep Ask DJ product copy user-facing, not API-reference style: mention Home
  Assistant, server-side DJ Memory/history, Apple Watch/iPhone/Mac/Windows continuity,
  explicit `Play Now`, Ja/Nee follow-ups, bounded history/trim behavior,
  voice/PTT with Assist STT/TTS on iOS, macOS, Windows and Apple Watch,
  Raspberry Pi read-only history display,
  optional Apple push notifications as wake/sync hints through the central
  push relay for Ask DJ replies or waiting choices only, and compact privacy
  boundaries without implying Spotify affiliation.
- Keep content-page navigation free of self-links. Features, Spraak, Blog,
  Support and Privacy should not show their own page as a menu option.
- Keep the homepage `Kies je interface` cards aligned with the supported
  routes: macOS, Windows, Mac Catalyst, iPhone/iPad, Voice Assistant, Embedded
  device and Linux/Raspberry Pi.
- Keep homepage hero device slides spacious: macOS, iPad/iPhone and LilyGO/ESP32 each get their own carousel slide.
- Keep the start page aligned with the current setup order: Home Assistant voice pipeline, HACS, DJConnect configuration, client pairing and first use.
- Keep the start page clear that Spotify OAuth requires the user's own Spotify
  Developer app because redirect URIs must be registered for their own Home
  Assistant external URL.
- Keep the embedded page compact: supported hardware, how it works and firmware downloads. Detailed setup, requirements, FAQ and experience content belong off this page.
- Keep macOS, Windows, Mac Catalyst, iOS, ESP32 and Raspberry Pi page navigation minimal: `Home`, `Platform`, language toggle and the page CTA.
- Keep macOS and Raspberry Pi download menu labels singular: `Download`.
- Keep `macos-download` removed; the canonical macOS app page is `wwwroot/macos.html`.
- Keep ESP32 firmware, macOS, Windows, Mac Catalyst and Raspberry Pi/Linux download embeds limited to the latest release and routed through `/go/download`.
- Keep the footer version aligned with `VERSION`, `package.json` and `CHANGELOG.md`.
- Keep click/download analytics aggregate-only: daily target counters in D1 plus GitHub `download_count`, without cookies, IP addresses, user agents or visitor identifiers.
- Keep `https://djconnect.dev` as canonical production domain in page metadata, `robots.txt`, `sitemap.xml` and public install commands.
- Keep `https://www.djconnect.dev` as a permanent redirect to `https://djconnect.dev`, preserving path and query string.

## Smoke Tests

The default test suite is dependency-free:

```bash
npm test
```

Generate live QA screenshots for all public pages in Dutch at a laptop viewport:

```bash
npm run screenshots:live
```

Screenshots are written to `screenshots/live-laptop/` with a JSON manifest that
records `"language": "nl"`.

It includes a static link checker for local page and asset references.

GitHub Actions installs Chromium and runs `tests/smoke.spec.mjs` before
building or deploying the release site. Run the same live/browser checks
locally with:

```bash
SMOKE_BASE_URL=https://djconnect.dev npm run test:smoke
```

Install Playwright browsers locally first when needed:

```bash
npx playwright install
```
