# Handoff

## Current State

- Repository remote: `git@github.com:pcvantol/djconnect-website.git`
- Production URL: https://djconnect.dev
- WWW redirect: https://www.djconnect.dev -> https://djconnect.dev
- Cloudflare Pages fallback URL: https://djconnect.pages.dev
- Cloudflare Pages project: `djconnect`
- Source directory: `wwwroot`
- Release publish directory: `dist/wwwroot`
- Current version: `3.1.45`
- Main page: `wwwroot/index.html`
- Features page: `wwwroot/features.html`
- Platform overview page with CSS architecture diagram: `wwwroot/platform.html`
- Voice commands page: `wwwroot/voice-commands.html`
- Voice Assistant page: `wwwroot/voice-assistant.html`
- Support page: `wwwroot/support.html`
- Privacy Policy page: `wwwroot/privacy.html`
- Start/setup page: `wwwroot/start.html`
- macOS app page with binary downloads: `wwwroot/macos.html`
- iOS app page: `wwwroot/ios.html`
- TestFlight beta page: `wwwroot/testflight.html`
- macOS TestFlight beta page: `wwwroot/testflight-macos.html`
- Raspberry Pi app page with binary downloads: `wwwroot/raspberry-pi.html`
- Embedded ESP32 one-pager: `wwwroot/embedded.html`

## Important Notes

- The site source is static HTML/CSS/JavaScript in `wwwroot`; the release cycle
  builds a minified deploy copy in `dist/wwwroot`.
- The homepage is platform-independent and routes users to setup and downloads.
- The homepage navigation intentionally contains `Hoe werkt het`, `Features`,
  `Spraak`, `Blog` and `Installeren`; the `Aan de slag` route is the primary
  CTA button.
- The features page summarizes the main DJConnect functions and mentions the bonus mini-games: Paddle Rally, Meteor Run, Sky Dash & Maze Chase.
- The voice commands page documents the user-facing intent families,
  interpretation order, current-track status behavior, direct playback-control
  commands, artist-first fallback behavior and bilingual example phrases.
  Canonical spoken music example data lives in `examples/voice_intents.json` in
  the Home Assistant integration repo; mirror that source in
  `wwwroot/assets/voice-intents.js`. Intent cards render from that asset, so the
  selected NL/EN language toggle controls labels, behavior notes and examples
  from one maintainable source.
- The homepage voice-example chips also render from
  `wwwroot/assets/voice-intents.js` and should keep linking to
  `wwwroot/voice-commands.html` for the full intent list. Do not introduce a
  separate hardcoded homepage command list.
- `VOICE_INTENT_DATA_PROMPT.md` contains the compact prompt for asking the Home Assistant integration to provide only structured voice/PTT intentdata for future website updates.
- Cross-repo policy: the only canonical sync prompt is `pcvantol/djconnect/SYNC_PROMPTS.md` and the only canonical product roadmap is `pcvantol/djconnect/PRODUCT_ROADMAP.md` in the Home Assistant integration repo. Do not add local copies to this website repo. If a website change affects cross-repo contracts or roadmap scope, update and commit the canonical file in `pcvantol/djconnect` as a follow-up.
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
- The start page presents the current setup order: configure the Home Assistant voice assist pipeline, add DJConnect to Home Assistant through HACS, create a Spotify Developer app for the user's Home Assistant external callback URL, configure DJConnect in Home Assistant, download and pair the app/device, then use DJConnect with Spotify Connect.
- Spotify OAuth is user-owned through Home Assistant. The user must register
  `https://<your-home-assistant-external-url>/api/djconnect/spotify/callback`
  in their own Spotify Developer app, copy the Client ID into the DJConnect
  config-flow and authorize Spotify through Home Assistant. Prefer Nabu Casa
  HTTPS external URLs. DJConnect uses PKCE, so a Spotify Client Secret is
  preferably not required.
- The start page links to Home Assistant voice assistant documentation, the embedded firmware page and `pcvantol/djconnect-app-releases`.
- The start page pairing switch has separate panels for ESP device, iOS app, macOS app and Raspberry Pi app.
- macOS, iOS, Raspberry Pi and embedded pages label the homepage navigation route as `Home`; app pages should not show cross-links to other app/device pages in the top menu.
- The embedded page uses `assets/downloads.js`, `assets/downloads.css` and the Cloudflare Pages Function `functions/api/releases.js` to live-render downloadable assets from `pcvantol/djconnect-firmware` releases.
- macOS downloads are embedded directly on `wwwroot/macos.html` using `assets/downloads.js`, `data-download-target="macos"` and the public repo `pcvantol/djconnect-app-releases`.
- iOS downloads are embedded directly on `wwwroot/ios.html` using `assets/downloads.js`, `data-download-target="ios"` and the public repo `pcvantol/djconnect-app-releases` until an App Store link replaces it. The iOS page must never show macOS release assets. The TestFlight beta route should keep warning that beta places may be limited and builds expire.
- Raspberry Pi downloads are embedded directly on `wwwroot/raspberry-pi.html` using `assets/downloads.js` and the public repo `pcvantol/djconnect-pi-releases`.
- Client latest-version cards show expandable GitHub release body text as
  `Changelog` on macOS, iOS, ESP32 firmware and Raspberry Pi/Linux pages.
- Pages that use the dynamic download renderer load `assets/downloads.js` with a
  site-version query string, and `wwwroot/_headers` sets `Cache-Control:
  no-cache` for that asset. Keep this in place so old browser/WebView caches do
  not render stale release cards after platform filter changes.
- ESP32 firmware, macOS and Raspberry Pi/Linux download embeds intentionally show only the latest release and route asset clicks through `/go/download`.
- The old `macos-download` route is retired; keep macOS downloads on `wwwroot/macos.html`.
- The Raspberry Pi/Linux install command is generated from the latest public release, downloads through `/go/linux-install` and runs `sudo ./scripts/install.sh`.
- Download and HACS clicks are routed through `/go/...` endpoints. These endpoints optionally write aggregate daily counters to the D1 binding `ANALYTICS_DB`.
- `/api/stats` is protected by `STATS_TOKEN` and combines D1 redirect counters with GitHub release asset `download_count` totals.
- `/admin` is an internal page for runtime GitHub release asset download
  statistics. It must be protected by Cloudflare Access for
  `https://djconnect.dev/admin`. Access users and policies live in Cloudflare
  Zero Trust, not in this repository. The page intentionally does not persist
  data and does not include website redirect click counters yet.
- `scripts/check-stats.mjs` can be run with `STATS_TOKEN=... npm run stats:check` to print aggregate redirect clicks and GitHub download totals.
- The analytics design is intentionally cookieless and identifier-free. Do not add IP address, user agent, referrer or visitor-id storage.
- Public support/contact links point to `wwwroot/support.html` from public page
  footers. The support page lists `support@djconnect.dev` as the primary
  support address and keeps GitHub Issues as a technical fallback.
- Public page footers also link to `wwwroot/privacy.html`. Keep this Privacy
  Policy visible for App Store review and aligned with the aggregate-only
  website analytics, local app/Home Assistant token storage and support mailbox.
- iOS does not embed website repository releases. Add a release/download embed only when it has its own relevant app release source.
- If the GitHub repository/releases are private, set `GITHUB_TOKEN` as a Cloudflare Pages secret for the `djconnect` project.
- Version is tracked in `VERSION`, `package.json`, page footers and `CHANGELOG.md`.
- Language switching on the homepage, start page, embedded page, Features page, Raspberry Pi page, iOS page and macOS page is handled through per-page `translations` objects.
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

The workflow builds `dist/wwwroot` and deploys that minified output to Cloudflare Pages on every push to `main`, with `CLOUDFLARE_ACCOUNT_ID` set explicitly.
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

Bind `ANALYTICS_DB` to that D1 database and set a `STATS_TOKEN` secret. `GITHUB_TOKEN` is optional for public release repos but useful for higher GitHub API limits.

## Current Verification

- `npm test` covers version consistency, route presence, homepage navigation/copy, homepage voice chips from shared intent data, voice command intent-family docs, data-driven examples and language-scoped rendering behavior, firmware download embeds, macOS and Raspberry Pi download embeds, latest-only release embed contracts, removed legacy macOS download routes, tracked download redirects, absence of website self-release embeds, translation keys, footer copyright/support links, local link checking, firmware links, compact embedded page structure, LilyGO visual hygiene and stale pre-flashed wording.
- `npm test` also covers the cookieless redirect/download analytics structure, D1 migration, tracked GitHub asset links, the protected GitHub-runtime `/admin` stats page contract and the release-script dependency/tool preflight.
- `npm run test:smoke` is the optional Playwright smoke-test entrypoint for live/browser checks. `npm run screenshots:live` captures Dutch live production screenshots at a laptop viewport into `screenshots/live-laptop/`. Neither is part of the default `npm test` run.
- Current released version `3.1.45` centralizes shared mobile navigation assets,
  adds a minified `dist/wwwroot` release build, publishes production cache and
  security headers, adds a noindex 404 page and enforces baseline accessibility
  contracts for public pages.
- Canonical SEO domain is `https://djconnect.dev`; `djconnect.pages.dev` remains a Cloudflare fallback.
- `https://www.djconnect.dev` should remain a 301 redirect to the apex domain, preserving path and query string.
- Dynamic GitHub download/install blocks now rerender when the language toggle changes, so generated install text follows NL/EN.
- The start-page client pairing panels no longer show extra Client API/discovery notes under iOS, macOS, Linux or ESP32.
- Site footers now include a small translated privacy notice. Keep it aligned across homepage, setup, features, iOS, macOS, Linux/Raspberry Pi and ESP32 pages.
- Raspberry Pi setup copy now says to paste pairing details in the Home Assistant integration.
- Linux/Raspberry Pi and ESP32 firmware download embeds intentionally use `data-release-limit="1"` so only the latest release is shown.
- The start page `Installeren` navigation now jumps to `2. Voeg toe aan Home Assistant`; the separate `Start installatie` CTA still starts at the voice assist pipeline.
- The start page should be manually checked for the voice-assist documentation link, HACS deeplink, Spotify Developer app/OAuth redirect guidance, firmware/app release links, ESP pairing copy, app pairing copy, Raspberry Pi placeholder copy and troubleshooting text.
- The embedded page should be manually checked to confirm it no longer shows local quick start, requirements, FAQ or the `Stem via HA / Veilig gekoppeld / DJ-karakter` card row.
- Manual visual checks are still needed for desktop, tablet and mobile layouts until browser regression tests are formalized in CI.
