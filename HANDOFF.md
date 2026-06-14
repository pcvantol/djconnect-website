# Handoff

## Current State

- Repository remote: `git@github.com:pcvantol/djconnect-website.git`
- Production URL: https://djconnect.dev
- WWW redirect: https://www.djconnect.dev -> https://djconnect.dev
- Cloudflare Pages fallback URL: https://djconnect.pages.dev
- Cloudflare Pages project: `djconnect`
- Publish directory: `wwwroot`
- Current version: `3.1.23`
- Main page: `wwwroot/index.html`
- Features page: `wwwroot/features.html`
- Start/setup page: `wwwroot/start.html`
- macOS app page with binary downloads: `wwwroot/macos.html`
- iOS app page: `wwwroot/ios.html`
- Raspberry Pi app page with binary downloads: `wwwroot/raspberry-pi.html`
- Embedded ESP32 one-pager: `wwwroot/embedded.html`

## Important Notes

- The site is static HTML/CSS/JavaScript with no build step.
- The homepage is platform-independent and routes users to setup and downloads.
- The homepage navigation intentionally contains `Hoe werkt het`, `Features` and `Installeren`; the `Aan de slag` route is the primary CTA button.
- The features page summarizes the main DJConnect functions and mentions the bonus mini-games: Paddle Rally, Meteor Run, Sky Dash & Maze Chase.
- The homepage hero uses a swipeable device carousel for macOS, a landscape iPad and LilyGO/ESP32. Keep each device slide spacious and avoid compressing devices side-by-side.
- The iOS carousel slide intentionally shows one landscape iPad only; do not re-add a second iPhone visual unless the layout is redesigned.
- The homepage has prepared App Store CTA placeholders with `data-store-link="macos"` and `data-store-link="ios"`, plus a prepared Raspberry Pi route.
- The Raspberry Pi page loads public builds from `pcvantol/djconnect-pi-releases` using `assets/downloads.js`.
- The embedded page is now a compact product page: supported hardware, how it works and firmware downloads. Keep experience, setup, requirements and FAQ content off this page.
- The embedded page should use the same site color language as the homepage: cyan/green primary CTA, subtle pink/green/cyan background accents and no dominant purple-blue page background.
- The embedded page should point users to LilyGO product specs where relevant. Firmware download and setup links belong on the start page. Do not reintroduce pre-flashed copy.
- The start page presents the current setup order: configure the Home Assistant voice assist pipeline, add DJConnect to Home Assistant through HACS, configure DJConnect in Home Assistant, download and pair the app/device, then use DJConnect with Spotify Connect.
- The start page links to Home Assistant voice assistant documentation, the embedded firmware page and `pcvantol/djconnect-app-releases`.
- The start page pairing switch has separate panels for ESP device, iOS app, macOS app and Raspberry Pi app.
- macOS, iOS, Raspberry Pi and embedded pages label the homepage navigation route as `Home`; app pages should not show cross-links to other app/device pages in the top menu.
- The embedded page uses `assets/downloads.js`, `assets/downloads.css` and the Cloudflare Pages Function `functions/api/releases.js` to live-render downloadable assets from `pcvantol/djconnect-firmware` releases.
- macOS downloads are embedded directly on `wwwroot/macos.html` using `assets/downloads.js` and the public repo `pcvantol/djconnect-app-releases`.
- Raspberry Pi downloads are embedded directly on `wwwroot/raspberry-pi.html` using `assets/downloads.js` and the public repo `pcvantol/djconnect-pi-releases`.
- ESP32 firmware, macOS and Raspberry Pi/Linux download embeds intentionally show only the latest release and route asset clicks through `/go/download`.
- The old `macos-download` route is retired; keep macOS downloads on `wwwroot/macos.html`.
- The Raspberry Pi/Linux install command is generated from the latest public release, downloads through `/go/linux-install` and runs `sudo ./scripts/install.sh`.
- Download and HACS clicks are routed through `/go/...` endpoints. These endpoints optionally write aggregate daily counters to the D1 binding `ANALYTICS_DB`.
- `/api/stats` is protected by `STATS_TOKEN` and combines D1 redirect counters with GitHub release asset `download_count` totals.
- The analytics design is intentionally cookieless and identifier-free. Do not add IP address, user agent, referrer or visitor-id storage.
- iOS does not embed website repository releases. Add a release/download embed only when it has its own relevant app release source.
- If the GitHub repository/releases are private, set `GITHUB_TOKEN` as a Cloudflare Pages secret for the `djconnect` project.
- Version is tracked in `VERSION`, `package.json`, page footers and `CHANGELOG.md`.
- Language switching on the homepage, start page, embedded page, Features page, Raspberry Pi page, iOS page and macOS page is handled through per-page `translations` objects.
- `release.sh` automatically runs cleanup after a successful release, removing old GitHub Releases, matching local/remote tags and older workflow runs.
- `cleanup_old_releases.sh` can still be run manually for cleanup outside the normal release flow. It keeps the current `VERSION` tag and the newest 10 workflow runs by default.
- Do not commit `.wrangler/`; it is local Wrangler cache.

## Release Steps

1. Commit all changes to `main`.
2. Ensure the GitHub Actions repository secret `CLOUDFLARE_API_TOKEN` exists.
3. Run `./release.sh --skip-deploy` when the token is only available in GitHub Actions.
4. Verify the GitHub Release, the `Deploy Cloudflare Pages` workflow run and https://djconnect.dev.

The workflow deploys `wwwroot` to Cloudflare Pages on every push to `main` and sets `CLOUDFLARE_ACCOUNT_ID` explicitly.
The release script removes older GitHub Releases, matching local/remote tags and older GitHub Actions workflow runs by default. It keeps the newly released tag and only the newest workflow run. Override workflow-run retention with `KEEP_WORKFLOW_RUNS=N` when needed.

Set the token only in the current shell when needed:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
export CLOUDFLARE_ACCOUNT_ID='efe77cadf8317a53832fca0848e3ae51'
```

If `./release.sh` was already used with `--skip-deploy` and the tag/release already exists, do not rerun the full release script. Deploy the already released version directly:

```bash
npx wrangler@4 pages deploy wwwroot --project-name djconnect --branch main
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

- `npm test` covers version consistency, route presence, homepage navigation/copy, firmware download embeds, macOS and Raspberry Pi download embeds, latest-only release embed contracts, removed legacy macOS download routes, tracked download redirects, absence of website self-release embeds, translation keys, footer copyright, firmware links, compact embedded page structure, LilyGO visual hygiene and stale pre-flashed wording.
- `npm test` also covers the cookieless redirect/download analytics structure, D1 migration and tracked GitHub asset links.
- Current released version `3.1.23` includes the single-iPad homepage hero slide, embedded page color alignment, renamed mini-games copy/sync prompt, Raspberry Pi downloads from `pcvantol/djconnect-pi-releases`, latest-only firmware/Linux embeds and a dynamic public-release Linux install command that runs `sudo ./scripts/install.sh`.
- Canonical SEO domain is `https://djconnect.dev`; `djconnect.pages.dev` remains a Cloudflare fallback.
- `https://www.djconnect.dev` should remain a 301 redirect to the apex domain, preserving path and query string.
- Dynamic GitHub download/install blocks now rerender when the language toggle changes, so generated install text follows NL/EN.
- The start-page client pairing panels no longer show extra Client API/discovery notes under iOS, macOS, Linux or ESP32.
- Site footers now include a small translated privacy notice. Keep it aligned across homepage, setup, features, iOS, macOS, Linux/Raspberry Pi and ESP32 pages.
- Raspberry Pi setup copy now says to paste pairing details in the Home Assistant integration.
- Linux/Raspberry Pi and ESP32 firmware download embeds intentionally use `data-release-limit="1"` so only the latest release is shown.
- The start page `Installeren` navigation now jumps to `2. Voeg toe aan Home Assistant`; the separate `Start installatie` CTA still starts at the voice assist pipeline.
- The start page should be manually checked for the voice-assist documentation link, HACS deeplink, firmware/app release links, ESP pairing copy, app pairing copy, Raspberry Pi placeholder copy and troubleshooting text.
- The embedded page should be manually checked to confirm it no longer shows local quick start, requirements, FAQ or the `Stem via HA / Veilig gekoppeld / DJ-karakter` card row.
- Manual visual checks are still needed for desktop, tablet and mobile layouts until browser regression tests are formalized in CI.
