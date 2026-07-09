# DJConnect Website

Static landing page for DJConnect, published through Cloudflare Pages.

## Structure

- `wwwroot/index.html`: platform homepage with DJConnect essentials, Ask DJ, download routes and swipeable device hero.
- `wwwroot/features.html`: feature overview page, including Ask DJ and bonus mini-games: Paddle Rally, Meteor Run, Sky Dash and Maze Chase.
- `wwwroot/platform.html`: CSS-only platform architecture overview for clients, Home Assistant, Assist, Spotify and speakers.
- `wwwroot/developers.html`: developer documentation page with repository overview, client identity, pairing, Home Assistant/API contracts, Ask DJ, Music DNA, backend, OTA and security notes.
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
- DJConnect 3.2 supports Spotify Direct or Music Assistant as active music
  backend. Spotify Direct OAuth runs through the user's own Home Assistant
  installation: users create their own Spotify Developer app, register
  `https://<your-home-assistant-external-url>/api/djconnect/spotify/callback`
  as redirect URI, copy the Client ID into the DJConnect setup and authorize
  Spotify through Home Assistant. Prefer the Nabu Casa HTTPS external URL.
  DJConnect uses PKCE, so a Spotify Client Secret is preferably not required.
  Music Assistant does not require a DJConnect Spotify Client ID/OAuth; Music
  Assistant provider credentials stay in Music Assistant/Home Assistant.
- Pairing/token bootstrap is deliberately local-only. During pairing, Home
  Assistant and the DJConnect client must be on the same local network. After
  successful pairing, iPhone, Apple Watch, macOS and Windows can work remotely
  when Home Assistant has an external/Nabu Casa HTTPS URL: local pairing first,
  remote use after. iPhone pairs by scanning a Home Assistant-generated
  QR/deep-link payload. Apple Watch pairs through the iPhone proxy: Home
  Assistant generates a separate Watch QR/deep-link payload, iPhone scans it,
  and iPhone forwards the pairing details to the paired Watch. macOS and
  Windows pair by entering the local Home Assistant URL plus the
  Home Assistant-generated code. iPhone, Apple Watch, macOS and Windows are
  inbound-only app clients: Home Assistant never calls back to a local app API,
  clients post to `POST /api/djconnect/v1/pair`, and there is no app-client
  mDNS/local-API discovery or fallback. ESP32 and Raspberry Pi remain
  local-device clients: they use local/two-way pairing, may be discovered via
  `_djconnect._tcp`, use local `/api/device/*`, receive no `ha_remote_url`, and
  stay local-only.
- The public How To Start copy must keep the `3.2.x` backend contract visible:
  patch versions may differ, major/minor must match, HTTP `426`
  `version_mismatch` means update the client or integration without clearing
  pairing, and app/device identity uses mandatory `client_type` plus stable ID
  prefixes (`djconnect-ios-*`, `djconnect-macos-*`,
  `djconnect-windows-*`, `djconnect-raspberry-pi-*` and model-specific ESP32
  IDs). iOS, macOS and Windows are inbound-only app clients that post local
  pairing to `/api/djconnect/v1/pair`; ESP32 and Raspberry Pi are local-device
  clients using `_djconnect._tcp`, optional Client adres and `/api/device/*`.
  Keep public copy clear that local pairing avoids remote bootstrap exposure,
  requires LAN presence plus a temporary QR/code, and avoids the extra expiry,
  replay protection, rate limiting, phishing/error states and external URL
  dependencies that remote pairing would require.
- Current Home Assistant integration release for public copy is `3.2.44`.
- Ask DJ is a major product feature for iOS, macOS, Windows, Apple Watch and
  Raspberry Pi clients.
  Website copy should keep it clear that Ask DJ runs through Home Assistant and
  DJConnect integration 3.2.44 or newer, uses compact bounded server-side Music
  DNA/history only after opt-in, carries chat continuity across app clients, can show Ja/Nee
  follow-up controls, uses backend-aware Spotify Direct or Music Assistant
  actions, can use optional Apple push notifications only as wake/attention
  hints through Home Assistant sync and starts concrete recommendations only
  after the user taps `Play Now`. DJ announcements can optionally play through
  a configured Home Assistant `media_player` speaker. Ask DJ remains the
  intelligence/personality; the HA speaker is the physical DJ voice in the
  room. App clients support Device, Device + Home Assistant speaker, Home
  Assistant speaker only and text-only output modes; Device + Home Assistant
  speaker is the default when a HA speaker is configured, and speaker modes are
  locked otherwise. Spotify Direct playback keeps playing: DJConnect does not
  pause/resume Spotify, change Spotify volume or mix/duck Spotify audio for
  announcements. ESP32 uses the existing device-speaker/DJ response flow without
  Ask DJ chat history; Raspberry Pi has no local audio output and supports
  text-only or HA speaker output when configured.
  Music DNA summary questions such as `Wat weet je nu over mij?` /
  `What do you know about me?` are privacy/info answers from server-side
  `djconnect_music_dna` only: render text and sources, not stale album art,
  media cards, TTS replay buttons or `Play Now` controls.
  Ask DJ works without Music DNA. Music DNA is an opt-in, server-side Home
  Assistant listening profile built from compact signals such as successful
  playback/Play Now choices, preferences, listening rhythm, favorite artists,
  albums and tracks, playtime aggregates, mood mix, repeat magnets, taste
  anchors, explicit positives, recent playback metadata, available artists and
  genres, Track Insight energy/genre analysis, realtime client mood samples and
  compact Spotify profile/recently-played/top-data when the backend fetches it.
  Clients render Music DNA cards and send context; they do not store or compute
  the persistent Music DNA source of truth. Music DNA must never store OAuth
  tokens, bearer tokens, raw audio, full prompts or unlimited Spotify listening
  history. Users can enable, disable and clear Music DNA. Clear keeps the opt-in
  setting; if Music DNA remains enabled, DJConnect starts learning again from an
  empty profile, and if it is turned off learned DNA is cleared and future
  learning stops.
  Ontdek / Music Discovery is the premium recommendations surface built on
  Music DNA. It only works after explicit Music DNA consent and is generated
  server-side by Home Assistant. It is a backend-owned recommendations feed,
  not a recently-played list: raw recently played tracks must not be presented
  as Discover cards unless the backend explicitly returns them in `sections[]`.
  Home Assistant refreshes Discover and Music DNA roughly hourly while Music DNA
  is enabled, using Music DNA plus Spotify recently-played/top profile data as
  seed/context. New profile data, mood, `Play Now` and negative feedback may
  trigger a rebuild. Sections such as `new_for_you`, `rediscover`,
  `artist_spotlight` and `accepted_recommendations` are rendered in backend
  order; clients must not hardcode section ids. Items carry backend-owned
  `reason`, `reason_sources`, `quality_score`, `quality_band` and
  `quality_factors`. Freshness and dedupe are backend-owned, including
  known/recent/blocked tracks, live/remix/radio edit/remaster variants,
  album/title overlap and artist overload. `Play Now` uses
  `/api/djconnect/v1/music_discovery/play`; negative feedback uses
  `/api/djconnect/v1/music_discovery/feedback` with `not_for_me`,
  `less_like_this` and `hide_artist`. Clients keep no permanent local blocklist
  and do not compute local recommendations, reasons or quality scores. Discover
  accepted recommendations and negative feedback are fed back to Ask DJ as
  compact Music DNA signals.
  Music DNA dashboard/profile data may include `snapshot_history`,
  `privacy_dashboard` and `discovery_feedback`. `snapshot_history` is bounded,
  compact and backend-owned, not raw playback history. `privacy_dashboard`
  arrives inside `/profile` when present; it has no separate endpoint and shows
  active sources, raw counts, retention limits and controls without raw audio,
  OAuth tokens, bearer tokens, full prompts or full listening history.
  iOS and macOS support full Discover and Music DNA UI, watchOS is compact,
  Raspberry Pi may render text/desktop-style Discover and Music DNA UI while
  storing no Music DNA locally, and APNs `music_discovery_ready` contains no
  recommendations, only an open/refresh hint.
  Local app clients may optionally use Home Assistant's native `/api/websocket`
  after normal local pairing and HA websocket auth for low-latency
  `djconnect/command`, `djconnect/ask_dj/message` and
  `djconnect/track_insight` calls when `djconnect/capabilities` advertises
  them. Clients infer support from capabilities, including `features` and
  `fallbacks`, not Home Assistant version parsing. HTTP remains the canonical
  fallback for remote access, pairing, history sync/clear, voice uploads,
  image/TTS URLs, missing websocket commands and websocket failures. Optional
  controls such as negative feedback should be hidden when capabilities do not
  advertise support. Music DNA import/export remains HTTP-only through
  `/music_dna/export` and `/music_dna/import`.
- VibeCast is a premium-ready first-class Apple client feature documented on
  the Features, Platform, iOS, macOS and How To Start pages. Public copy must
  keep `GET /api/djconnect/v1/vibecast` visible, with supported Apple client
  types `ios`, `macos` and `watchos`. macOS and iOS use the same endpoint,
  response contract, item kinds, structured text segment types, disabled
  reasons, polling/cache semantics, entitlement behavior, TTL, revision and
  current-track resolution. Platform differences are presentation-only or
  capability-driven. Home Assistant/backend playback is the source of truth;
  VibeCast is backend-neutral across Spotify Direct, Music Assistant and future
  DJConnect backend abstractions. Clients render structured text segments
  (`text`, `strong`, `emphasis`, `magnify`, `accent`, `line_break`) without
  HTML/Markdown parsing and never show raw provider/cache/decode/generation
  errors. Polling is current contract; WebSocket or push may be added later
  without breaking the response contract.
  Ask DJ Track Insight should be described as server-side interpretive track
  analysis from current playback or provided track metadata. It can use language
  and realtime mood for analysis tone and visual style, and it may return track
  metadata, summary/full text, genre/subgenre, mood/vibe/texture/emotional tone,
  energy/danceability/intensity/confidence, production/instrumentation/
  arrangement/listening cues, similar tracks and a visual profile. Genre remains
  supported primarily through `analysis.genre`, with detail in
  `analysis.subgenre` and fallback/context in `track.genres[]`, enriched from
  artist metadata where available. Do not imply DJConnect directly analyzes
  encrypted Spotify playback audio, extracts hidden audio measurements, or that
  clients calculate conclusions locally. The feature is read-only and should
  never change playback.
  Realtime client mood is leading for DJ announcement style: `chill` maps to
  late-night radio, `groove` to a classic radio presenter, `energy` to an
  energetic presenter and `party` to a tight presenter. Numeric mood zones are
  0-24 chill, 25-59 groove, 60-84 energy and 85-100 party. The backend DJ voice
  profile is only fallback when the client sends no valid mood. Home Assistant
  TTS/Assist still chooses the actual audio voice; DJConnect voice profiles
  control the announcement prompt/persona/style text.
  The public visual system should follow the current app: midnight indigo base,
  violet glass panels, magenta/violet primary actions and cyan as a secondary
  analysis/voice accent.
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
- `wwwroot/assets/i18n.js`: shared i18n runtime and product/legal strings for
  the supported public languages: English, Dutch, German, French and Spanish.
- `wwwroot/assets/site-nav.css` and `wwwroot/assets/site-nav.js`: shared
  responsive navigation styling and hamburger-menu behavior included by all
  public pages with a top navigation.
- `scripts/build-sitemap.mjs`: generates `wwwroot/sitemap.xml` from the public
  page registry and supported language list.
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

GitHub Actions runs the automated website tests and release build on pull
requests and pushes to `main`. Pull requests only validate, build and test the
site. A push to `main` deploys the validated `dist/wwwroot` artifact to
Cloudflare Pages after the test job succeeds, then checks
`https://djconnect.dev` for the expected footer version. The repository must
have Actions secrets for both `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`; Cloudflare tokens and account identifiers must not be
committed.

Configure it in GitHub:

```text
Settings -> Secrets and variables -> Actions -> New repository secret
Name: CLOUDFLARE_API_TOKEN
Value: Cloudflare API token

Name: CLOUDFLARE_ACCOUNT_ID
Value: Cloudflare account ID
```

Minimum Cloudflare token permissions:

- `Cloudflare Pages:Edit`
- `Account:Read`

Use `./release.sh` for the standard release flow.

## Multilingual Content

All public website and docs pages must ship complete copy for `en`, `nl`, `de`,
`fr` and `es` in the same pull request. Add page-local strings to the
`translations` block, keep shared product/legal strings in
`wwwroot/assets/i18n.js`, and run `npm run i18n:check` before review. Legal
meaning must stay exact: keep MIT license notes and the Spotify trademark /
non-affiliation disclaimer unchanged unless the maintainer explicitly approves
new legal copy. Use only fictional artist, track, album and playlist names in
examples; real artist names must not appear in public copy, docs, release-note
assets, tests or screenshots.

Localized static routes live under `/en/`, `/de/`, `/fr/` and `/es/`; Dutch is
the root default. Each public page must keep `hreflang` alternates in sync.
Regenerate `wwwroot/sitemap.xml` with `npm run sitemap:build` whenever public
pages or supported languages change.
Setup and troubleshooting copy must stay consistent with the HACS DJConnect
integration requirements documented in `pcvantol/djconnect`.

The release script runs `npm run deps:update`, which refreshes declared npm
dependencies, logs the active npm, Wrangler and Playwright tool versions, and
stops the release if package metadata changes and still needs to be committed.
It then runs tests, verifies that the Dutch release screenshot manifest exists,
checks core documentation files, builds a minified release copy in
`dist/wwwroot`, verifies the current `HEAD` is based on `origin/main`, pushes
the release commit explicitly to `origin` with `HEAD:main`, creates a `vX.Y.Z`
tag, creates a GitHub Release from only that version's `CHANGELOG.md` section,
deploys the minified release copy to Cloudflare Pages and then automatically
removes older GitHub Releases, matching local/remote tags and older GitHub
Actions workflow runs. By default, only the newest workflow run remains.

Before every release, update or consciously re-check all repository documentation files:

- `README.md`
- `HANDOFF.md`
- `TESTS.md`
- `TODO.md`
- `ISSUES.md`
- `CHANGELOG.md`
- `TECHNICAL_DESIGN.md`
- `CHAT_BOOTSTRAP.md`

Review all public translations in `en`, `nl`, `de`, `fr` and `es` before
release, including unchanged-looking pages that may inherit shared copy, and
run `npm run i18n:check`.

Cross-repo contract changes must update the only canonical sync prompt in
`pcvantol/djconnect/SYNC_PROMPTS.md`. Product roadmap changes must update the
only canonical roadmap in `pcvantol/djconnect/PRODUCT_ROADMAP.md`. This website
repo must not keep local copies of either file.

When third-party libraries, frameworks or release tools are updated or upgraded,
also update the dependency inventory and third-party notice details in
`TECHNICAL_DESIGN.md` and any dedicated notices document before publishing.
CI runs `npm run deps:check` after `npm ci`; if `npm update --package-lock-only`
would change the lockfile, update with `npm run deps:update` and commit the
result before merging or releasing.

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

If Cloudflare credentials are only configured as GitHub Actions secrets, run
the release without direct local deploy and let the push to `main` trigger the
workflow:

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
export CLOUDFLARE_ACCOUNT_ID='your-cloudflare-account-id'
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
  Assistant, optional server-side Music DNA/history, Apple Watch/iPhone/Mac/Windows
  continuity, explicit `Play Now`, Ja/Nee follow-ups, bounded history/trim
  behavior, backend-aware Spotify Direct or Music Assistant actions, voice/PTT
  with Assist STT/TTS on iOS, macOS, Windows and Apple Watch, optional HA
  `media_player` speaker output for DJ announcements, Raspberry Pi text-only
  or HA speaker output with no local Pi audio, ESP device-speaker/DJ response
  flow without chat history, optional Apple push notifications as wake/attention hints only,
  and compact privacy boundaries without implying Spotify affiliation. Include
  the claims `Ask DJ works without Music DNA.`, `Music DNA is opt-in.`,
  `You can clear Music DNA at any time.`, `Clients do not store your persistent
  Music DNA profile.`, `Spotify credentials stay in Home Assistant.`, and
  `DJConnect is not affiliated with, endorsed by, or sponsored by Spotify AB.`
- Keep Music DNA and Ontdek copy aligned across the website, TESTS, HANDOFF and
  TECHNICAL_DESIGN. Ontdek must stay consent-gated, server-side via Home
  Assistant, backend-owned, not a recently-played list, refreshed roughly
  hourly while Music DNA is enabled and driven by Music DNA plus Spotify
  recent/top profile data. Clients must render backend sections, reasons,
  quality data, freshness/dedupe and feedback affordances without computing
  local recommendations, reasons, quality scores or permanent blocklists.
- Keep content-page navigation free of self-links. Features, Spraak, Blog,
  Support and Privacy should not show their own page as a menu option.
- Keep the homepage `Kies je interface` cards aligned with the supported
  routes: macOS, Windows, Mac Catalyst, iPhone/iPad, Voice Assistant, Embedded
  device and Linux/Raspberry Pi.
- Keep homepage hero device slides spacious: macOS, iPad/iPhone and LilyGO/ESP32 each get their own carousel slide.
- Keep the start page aligned with the current 3.2 setup order: Home Assistant
  voice pipeline, HACS, music-backend choice, backend-specific DJConnect
  configuration, local client/device pairing and first use. Pairing copy should
  emphasize `lokaal pairen, daarna remote gebruiken` for app clients.
- Keep the start page compatibility matrix explicit about `3.2.x`,
  `version_mismatch`, inbound-only iOS/macOS/Windows pairing, ESP32/Raspberry
  Pi local-device pairing, Apple Watch via iPhone proxy, HA Assist STT/TTS and
  Assist Conversation Agent-only entries with no client pairing UI.
- Keep release/download links focused on the current public sources:
  HACS/`pcvantol/djconnect`, app builds from
  `pcvantol/djconnect-app-releases`, firmware from
  `pcvantol/djconnect-firmware`, and Linux/Raspberry Pi builds from
  `pcvantol/djconnect-pi-releases`.
- Keep the start page clear that Spotify Direct requires Spotify Premium and
  the user's own Spotify Developer app because redirect URIs must be registered
  for their own Home Assistant external URL. Music Assistant does not need a
  DJConnect Spotify Client ID/OAuth.
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
