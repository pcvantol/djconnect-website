# Handoff

## Current State

- Repository remote: `git@github.com:pcvantol/djconnect-website.git`
- Canonical cross-repo sync prompt lives in `pcvantol/djconnect/SYNC_PROMPTS.md`
  and includes the central API backend `pcvantol/djconnect-api` for APNs push
  relay contract reviews.
- Production URL: https://djconnect.dev
- WWW redirect: https://www.djconnect.dev -> https://djconnect.dev
- Cloudflare Pages fallback URL: https://djconnect.pages.dev
- Cloudflare Pages project: `djconnect`
- Source directory: `wwwroot`
- Release publish directory: `dist/wwwroot`
- Current version: `3.2.3`
- Main page: `wwwroot/index.html`
- Features page: `wwwroot/features.html`
- Platform overview page with CSS architecture diagram: `wwwroot/platform.html`
- Voice commands page: `wwwroot/voice-commands.html`
- Voice Assistant page: `wwwroot/voice-assistant.html`
- Support page: `wwwroot/support.html`
- Troubleshooting page: `wwwroot/troubleshooting.html`
- Privacy Policy page: `wwwroot/privacy.html`
- Start/setup page: `wwwroot/start.html`
- macOS app page with binary downloads: `wwwroot/macos.html`
- Windows desktop app page with binary downloads: `wwwroot/windows.html`
- Mac Catalyst validation build page with binary downloads: `wwwroot/maccatalyst.html`
- iOS app page: `wwwroot/ios.html`
- TestFlight beta page: `wwwroot/testflight.html`
- macOS TestFlight beta page: `wwwroot/testflight-macos.html`
- Raspberry Pi app page with binary downloads: `wwwroot/raspberry-pi.html`
- Embedded ESP32 one-pager: `wwwroot/embedded.html`

## Important Notes

- The site source is static HTML/CSS/JavaScript in `wwwroot`; the release cycle
  builds a minified deploy copy in `dist/wwwroot`.
- The homepage is platform-independent and routes users to setup and downloads.
- The homepage navigation intentionally contains cross-page routes only:
  `Features`, `Ask DJ`, `Spraak`, `Blog`, `Installeren`, `Support` and
  `Privacy`; the `Aan de slag` route is the primary CTA button. Do not add a
  `Hoe werkt het` self-link to the homepage top navigation.
- Content pages should avoid self-links in their top navigation. Features,
  Spraak, Blog, Support and Privacy intentionally omit their own page from the
  menu, and the compact Support/Privacy menus stay focused on their legal or
  help context.
- The homepage `Kies je interface` section lists macOS, Windows, Mac Catalyst,
  iPhone/iPad, Voice Assistant, Embedded device and Linux/Raspberry Pi. Keep the Voice
  Assistant card linked to `wwwroot/voice-assistant.html`.
- Ask DJ is a major product feature on the homepage and Features page. Keep
  copy clear that it runs through Home Assistant with DJConnect integration
  3.2.x, uses compact bounded server-side Music DNA/history per Home Assistant
  user, supports Apple Watch/iPhone/Mac/Windows continuity, can show Ja/Nee
  follow-up controls, uses backend-aware actions for Spotify Direct or Music
  Assistant, can use optional Apple push notifications only as wake/attention
  hints through Home Assistant sync, and starts recommendations only after an
  explicit `Play Now` tap. ESP32 uses PTT/playback command flow without Ask DJ
  chat history; Raspberry Pi remains local-only and read-only for history unless
  a future Pi release explicitly expands that scope.
- Ask DJ Track Insight copy must stay clear that DJConnect does not directly
  analyze encrypted Spotify playback audio. Exact BPM, key, sections or
  timestamps are shown only when available from source data or a user-configured
  local/provider analysis path; otherwise Ask DJ should label the answer as
  musical interpretation. The feature is read-only and must not imply playback
  changes.
- The features page summarizes the main DJConnect functions and mentions Ask DJ
  plus the bonus mini-games: Paddle Rally, Meteor Run, Sky Dash & Maze Chase.
- The voice commands page documents the user-facing intent families,
  interpretation order, current-track status behavior, direct playback-control
  commands, artist-first fallback behavior and bilingual example phrases.
  Canonical spoken music example data lives in `examples/voice_intents.json` in
  the Home Assistant integration repo; mirror that source in
  `wwwroot/assets/voice-intents.js`. Intent cards render from that asset, so the
  selected NL/EN language toggle controls labels, behavior notes and examples
  from one maintainable source.
- `wwwroot/assets/voice-intents.js` also exposes `DJCONNECT_ASK_DJ_INTENTS`
  from the HA repo `ask_dj_intents` source. Keep those examples rendered
  separately from deterministic voice commands so users understand which
  phrases are conversational Ask DJ requests rather than direct Spotify search
  commands.
- The `personal_music_dna_summary` Ask DJ family is a privacy / Music DNA info
  question. It has `action: "music_dna_summary"`, source `djconnect_music_dna`, no
  images and no playback actions. Website/client guidance must keep it
  text-only and must not imply live Spotify playback, Spotify profile
  enrichment, stale artwork, TTS replay or `Play Now`.
- The homepage voice-example chips also render from
  `wwwroot/assets/voice-intents.js` and should keep linking to
  `wwwroot/voice-commands.html` for the full intent list. Do not introduce a
  separate hardcoded homepage command list.
- `VOICE_INTENT_DATA_PROMPT.md` contains the compact prompt for asking the Home Assistant integration to provide only structured voice/PTT intentdata for future website updates.
- Cross-repo policy: the only canonical sync prompt is `pcvantol/djconnect/SYNC_PROMPTS.md` and the only canonical product roadmap is `pcvantol/djconnect/PRODUCT_ROADMAP.md` in the Home Assistant integration repo. Do not add local copies to this website repo. If a website change affects cross-repo contracts, the central API backend contract or roadmap scope, update and commit the canonical file in `pcvantol/djconnect` as a follow-up.
- The blog section starts at `wwwroot/blog.html`; the first post is `wwwroot/blog-djconnect-project.html` and describes DJConnect as a Home Assistant-backed multi-client music workflow.
- The homepage hero uses a swipeable device carousel for macOS, a landscape iPad and LilyGO/ESP32. Keep each device slide spacious and avoid compressing devices side-by-side.
- The iOS carousel slide intentionally shows one landscape iPad only; do not re-add a second iPhone visual unless the layout is redesigned.
- The homepage has prepared App Store CTA placeholders with `data-store-link="macos"` and `data-store-link="ios"`, plus a prepared Raspberry Pi route.
- The Raspberry Pi page loads public builds from `pcvantol/djconnect-pi-releases` using `assets/downloads.js`.
- The Raspberry Pi page includes a functional fresh-Pi setup path, a copyable
  bootstrap command and one supported-hardware section for Raspberry Pi Zero 2 W
  with header plus Pimoroni HyperPixel 4.0 Square. Keep the old separate starter
  hardware cards off the page.
- The embedded page is now a compact product page: supported hardware, how it works and firmware downloads. Keep experience, setup, requirements and FAQ content off this page.
- The embedded page should use the same site color language as the homepage: cyan/green primary CTA, subtle pink/green/cyan background accents and no dominant purple-blue page background.
- The embedded page should point users to LilyGO product specs where relevant. Firmware download and setup links belong on the start page. Do not reintroduce pre-flashed copy.
- The start page presents the current 3.2 setup order: configure the Home
  Assistant voice assist pipeline, add DJConnect to Home Assistant through HACS,
  choose Spotify Direct or Music Assistant as the music backend, configure only
  the backend-specific fields, then pair the app/device locally.
- Spotify Direct OAuth is user-owned through Home Assistant. The user must
  register
  `https://<your-home-assistant-external-url>/api/djconnect/spotify/callback`
  in their own Spotify Developer app, copy the Client ID into the DJConnect
  config-flow and authorize Spotify through Home Assistant. Prefer Nabu Casa
  HTTPS external URLs. DJConnect uses PKCE, so a Spotify Client Secret is
  preferably not required. Music Assistant does not need a DJConnect Spotify
  Client ID/OAuth; provider credentials stay in Music Assistant/Home Assistant.
- Pairing/token bootstrap is local-only. iOS, macOS and Windows are
  remote-capable after local pairing through the user's Home Assistant external
  URL. ESP32 and Raspberry Pi remain local-only. watchOS uses the iPhone proxy.
  Apple/Windows clients no longer host a local device API or require users to
  copy a Client address to Home Assistant; apps call Home Assistant through
  `/api/djconnect/...`.
- Local app clients may optionally use Home Assistant's native `/api/websocket`
  as a low-latency fast path after normal local pairing and HA websocket auth.
  Capability-detect with `djconnect/capabilities`, then use
  `djconnect/command`, `djconnect/ask_dj/message` and
  `djconnect/track_insight` only when advertised. HTTP remains canonical
  fallback for remote access, pairing, history sync/clear, voice uploads,
  image/TTS URLs and websocket timeout/error/disconnect.
- The start page links to Home Assistant voice assistant documentation, the embedded firmware page and `pcvantol/djconnect-app-releases`.
- The start page pairing switch has separate panels for ESP device, iOS app, macOS app, Windows app and Raspberry Pi app.
- macOS, Windows, Mac Catalyst, iOS, Raspberry Pi and embedded pages label the homepage navigation route as `Home`; app pages should not show cross-links to other app/device pages in the top menu.
- The embedded page uses `assets/downloads.js`, `assets/downloads.css` and the Cloudflare Pages Function `functions/api/releases.js` to live-render downloadable assets from `pcvantol/djconnect-firmware` releases.
- macOS downloads are embedded directly on `wwwroot/macos.html` using `assets/downloads.js`, `data-download-target="macos"` and the public repo `pcvantol/djconnect-app-releases`.
- Windows downloads are embedded directly on `wwwroot/windows.html` using `assets/downloads.js`, `data-download-target="windows"` and the public repo `pcvantol/djconnect-app-releases`. The public release tags are namespaced as `windows/vX.Y.Z`; current Windows downloads are unsigned diagnostic/internal validation builds, with no Store release, MSIX package or signed installer yet.
- Mac Catalyst downloads are embedded directly on `wwwroot/maccatalyst.html` using `assets/downloads.js`, `data-download-target="maccatalyst"` and the public repo `pcvantol/djconnect-app-releases`. The public release tags are namespaced as `maccatalyst/vX.Y.Z`; current Mac Catalyst downloads are unsigned and not notarized.
- iOS downloads are embedded directly on `wwwroot/ios.html` using `assets/downloads.js`, `data-download-target="ios"` and the public repo `pcvantol/djconnect-app-releases` until an App Store link replaces it. The iOS page must never show macOS release assets. The TestFlight beta route should keep warning that beta places may be limited and builds expire.
- Raspberry Pi downloads are embedded directly on `wwwroot/raspberry-pi.html` using `assets/downloads.js` and the public repo `pcvantol/djconnect-pi-releases`.
- Client latest-version cards show expandable GitHub release body text as
  `Changelog` on macOS, iOS, ESP32 firmware and Raspberry Pi/Linux pages.
- Pages that use the dynamic download renderer load `assets/downloads.js` with a
  site-version query string, and `wwwroot/_headers` sets `Cache-Control:
  no-cache` for that asset. Keep this in place so old browser/WebView caches do
  not render stale release cards after platform filter changes.
- ESP32 firmware, macOS, Windows, Mac Catalyst and Raspberry Pi/Linux download embeds intentionally show only the latest release and route asset clicks through `/go/download`.
- The old `macos-download` route is retired; keep macOS downloads on `wwwroot/macos.html`.
- The Raspberry Pi/Linux install command is generated from the latest public release, downloads through `/go/linux-install` and runs `sudo ./scripts/install.sh`.
- Download and HACS clicks are routed through `/go/...` endpoints. These endpoints optionally write aggregate daily counters to the D1 binding `ANALYTICS_DB`.
- `/api/stats` is protected by `STATS_TOKEN` and combines D1 redirect counters with GitHub release asset `download_count` totals.
- `/operator`, `/operator.html` and `/api/operator/*` are protected by
  `functions/_middleware.js`, which verifies Cloudflare Access JWTs from the
  `Cf-Access-Jwt-Assertion` header. Configure the Cloudflare Access
  self-hosted app and set `CLOUDFLARE_ACCESS_TEAM_DOMAIN` plus
  `CLOUDFLARE_ACCESS_AUD`; otherwise these routes fail closed.
- The old `/admin` Pages Function route is retired. The static `operator.html` UI
  reads the token-protected `/api/stats` endpoint, combining GitHub release
  asset download counts with optional D1 redirect-click counters.
- `operator.html` includes an Apple device registration overview for operators.
  The browser calls `GET /api/operator/registrations`; the Pages Function uses
  server-side `DJCONNECT_RELAY_SECRET` and forwards to
  `GET https://api.djconnect.dev/v1/admin/registrations`. The website must not
  read D1 directly for this data.
- The registrations overview may display only privacy-safe fields:
  `ha_install_id_hash`, `ha_user_hash`, `device_id_hash`, `client_type`,
  `apns_environment`, `topic`, `app_bundle_id`, `app_version`, `locale`,
  `categories`, `disabled`, `invalid`, `created_at`, `updated_at`,
  `last_success_at` and `last_error_code`. Never expose APNs token material,
  token ciphertext/nonces, raw production install IDs, raw device IDs or
  per-install `djci_...` tokens in the website.
- `operator.html` also includes an operator-only install-token revoke flow for
  compromised per-install `djci_...` tokens. The browser calls
  `POST /api/operator/install-token/revoke`; that Pages Function uses
  server-side `DJCONNECT_RELAY_SECRET` to call
  `POST https://api.djconnect.dev/v1/operator/install-token/revoke`. It disables
  without issuing a replacement token and never sends raw token material from
  the browser.
- `scripts/check-stats.mjs` can be run with `STATS_TOKEN=... npm run stats:check` to print aggregate redirect clicks and GitHub download totals.
- The analytics design is intentionally cookieless and identifier-free. Do not add IP address, user agent, referrer or visitor-id storage.
- Public support/contact links point to `wwwroot/support.html` from public page
  footers. The support page lists `support@djconnect.dev` as the primary
  support address and keeps GitHub Issues as a technical fallback.
- The troubleshooting page collects common setup and runtime fixes for Spotify
  OAuth redirect mismatches, HACS visibility, pairing, Home Assistant Assist,
  playback device selection, downloads and firmware updates. Keep it linked
  from Support.
- The troubleshooting page also documents macOS mDNS pairing diagnostics for
  cases where Home Assistant sees `_djconnect._tcp.local` but cannot fetch the
  advertised `local_url` endpoints. Keep the curl checks and firewall/security
  software guidance practical and short.
- Public page footers also link to `wwwroot/privacy.html`. Keep this Privacy
  Policy visible for App Store review and aligned with the aggregate-only
  website analytics, local app/Home Assistant token storage and support mailbox.
- iOS does not embed website repository releases. Add a release/download embed only when it has its own relevant app release source.
- If the GitHub repository/releases are private, set `GITHUB_TOKEN` as a Cloudflare Pages secret for the `djconnect` project.
- Version is tracked in `VERSION`, `package.json`, page footers and `CHANGELOG.md`.
- Language switching on the homepage, start page, embedded page, Features page,
  Spraak page, Blog page, Privacy page, Support page, Raspberry Pi page, iOS
  page, macOS page and Voice Assistant page is handled through per-page
  `translations` objects.
- `release.sh` automatically runs cleanup after a successful release, removing old GitHub Releases, matching local/remote tags and older workflow runs.
- `cleanup_old_releases.sh` can still be run manually for cleanup outside the normal release flow. It keeps the current `VERSION` tag and the newest 10 workflow runs by default.
- Do not commit `.wrangler/`; it is local Wrangler cache.

## Release Steps

1. Refresh Dutch screenshots for all public pages with `npm run screenshots:live`
   and include the updated `screenshots/live-laptop/` files in the release
   commit.
2. Commit all changes to `main`.
3. Update or consciously re-check all repository documentation files before release: `README.md`, `HANDOFF.md`, `TESTS.md`, `TODO.md`, `ISSUES.md`, `CHANGELOG.md`, `VOICE_INTENT_DATA_PROMPT.md`, `TECHNICAL_DESIGN.md` and `CHAT_BOOTSTRAP.md`.
4. For cross-repo contract changes, update `pcvantol/djconnect/SYNC_PROMPTS.md` in the Home Assistant integration repo. For roadmap changes, update `pcvantol/djconnect/PRODUCT_ROADMAP.md`. Keep no local copies of either file in this website repo.
5. Check whether test coverage needs to be expanded for the release change. Add tests for changed routes, copy, rendering contracts, analytics, release scripts or deployment behavior.
6. Ensure the GitHub Actions repository secret `CLOUDFLARE_API_TOKEN` exists.
7. Run `./release.sh --skip-deploy` when the token is only available in GitHub Actions.
8. Verify the GitHub Release, the `Deploy Cloudflare Pages` workflow run and https://djconnect.dev.

The workflow runs `npm ci`, `npm test` and `npm run build:release` on pull requests and pushes to `main`. Pushes to `main` and manual workflow dispatches deploy `dist/wwwroot` to Cloudflare Pages after the test job succeeds, with `CLOUDFLARE_ACCOUNT_ID` set explicitly.
The release script verifies the Dutch screenshot manifest, verifies the core documentation files exist, checks `CHANGELOG.md` and `HANDOFF.md` against the current `VERSION`, builds a minified release copy in `dist/wwwroot`, removes older GitHub Releases, matching local/remote tags and older GitHub Actions workflow runs by default. It keeps the newly released tag and only the newest workflow run. Override workflow-run retention with `KEEP_WORKFLOW_RUNS=N` when needed.
Before tests, the release script refreshes declared npm dependencies when a
lockfile exists and records the active `npx wrangler@4` version in the release
output. If any third-party library, framework or release tool changes version,
update the dependency inventory and third-party notice details in
`TECHNICAL_DESIGN.md` and any dedicated notices document before publishing.

Set the token only in the current shell when needed:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
export CLOUDFLARE_ACCOUNT_ID='efe77cadf8317a53832fca0848e3ae51'
```

If `./release.sh` was already used with `--skip-deploy` and the tag/release already exists, do not rerun the full release script. Rebuild and deploy the minified release output directly:

```bash
npm run build:release
npx wrangler@4 pages deploy dist/wwwroot --project-name djconnect --branch main
```

After deploy, confirm the live footer version:

```bash
curl -I https://djconnect.dev
curl -I https://www.djconnect.dev
curl -s https://djconnect.dev | grep "DJConnect website v"
```

For aggregate download/click stats, configure Cloudflare Pages:

```bash
npx wrangler@4 d1 create djconnect_analytics
npx wrangler@4 d1 migrations apply djconnect_analytics --remote
```

Bind `ANALYTICS_DB` to that D1 database and set `STATS_TOKEN`,
`DJCONNECT_RELAY_SECRET`, `CLOUDFLARE_ACCESS_TEAM_DOMAIN` and
`CLOUDFLARE_ACCESS_AUD`. `GITHUB_TOKEN` is optional for public release repos but
useful for higher GitHub API limits.

## Current Verification

- `npm test` covers version consistency, route presence, homepage navigation/copy, homepage voice chips from shared intent data, voice command intent-family docs, data-driven examples and language-scoped rendering behavior, firmware download embeds, macOS, Windows, Mac Catalyst and Raspberry Pi download embeds, latest-only release embed contracts, removed legacy macOS download routes, tracked download redirects, absence of website self-release embeds, translation keys, footer copyright/support links, local link checking, firmware links, compact embedded page structure, LilyGO visual hygiene and stale pre-flashed wording.
- `npm test` also covers the cookieless redirect/download analytics structure,
  D1 migration, tracked GitHub asset links, the removed legacy `/admin` route,
  the token-protected `/api/stats` contract and the release-script
  dependency/tool preflight.
- `npm run test:smoke` is the optional Playwright smoke-test entrypoint for live/browser checks. `npm run screenshots:live` captures Dutch live production screenshots at a laptop viewport into `screenshots/live-laptop/`. Neither is part of the default `npm test` run.
- Current released version `3.2.3` loads localized static What's New JSON on
  download-page changelogs before falling back to GitHub release bodies.
  Version `3.1.64` adds dedicated Windows and Mac Catalyst client pages,
  homepage cards, download rendering and release-note paths. Version `3.1.63`
  adds Windows to static homepage metadata and Features platform-flow copy.
  Version `3.1.62` syncs the website with the
  new Windows desktop client contract. Version `3.1.61` adds the operator APNs
  registration overview and privacy-focused tests/docs. Version `3.1.60` syncs Ask DJ website copy with the
  canonical Home Assistant integration `v3.1.69+` contract, including
  Raspberry Pi read-only history display, central push relay wording, refreshed
  Ask DJ conversational examples and PR CI validation. Version `3.1.52` synced
  the earlier `v3.1.65+` Ask DJ contract, including Ja/Nee follow-ups and
  bounded server-side history trim metadata.
- Canonical SEO domain is `https://djconnect.dev`; `djconnect.pages.dev` remains a Cloudflare fallback.
- `https://www.djconnect.dev` should remain a 301 redirect to the apex domain, preserving path and query string.
- Dynamic GitHub download/install blocks now rerender when the language toggle changes, so generated install text follows NL/EN.
- The start-page client pairing panels no longer show extra Client API/discovery
  notes under iOS, macOS, Windows, Linux or ESP32; app panels describe local
  QR/code pairing and app-to-Home Assistant runtime.
- Site footers now include a small translated privacy notice. Keep it aligned across homepage, setup, features, iOS, macOS, Linux/Raspberry Pi and ESP32 pages.
- Raspberry Pi setup copy now says to paste pairing details in the Home Assistant integration.
- Linux/Raspberry Pi and ESP32 firmware download embeds intentionally use `data-release-limit="1"` so only the latest release is shown.
- The start page `Installeren` navigation now jumps to `2. Voeg toe aan Home Assistant`; the separate `Start installatie` CTA still starts at the voice assist pipeline.
- The start page should be manually checked for the voice-assist documentation
  link, HACS deeplink, Spotify Developer app/OAuth redirect guidance,
  firmware/app release links, ESP pairing copy, app pairing copy and Raspberry
  Pi placeholder copy. Troubleshooting content belongs on
  `wwwroot/troubleshooting.html`, not inline on the start page.
- The embedded page should be manually checked to confirm it no longer shows local quick start, requirements, FAQ or the `Stem via HA / Veilig gekoppeld / DJ-karakter` card row.
- Manual visual checks are still needed for desktop, tablet and mobile layouts until browser regression tests are formalized in CI.
