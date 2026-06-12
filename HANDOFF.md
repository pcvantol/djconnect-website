# Handoff

## Current State

- Repository remote: `git@github.com:pcvantol/djconnect-website.git`
- Production URL: https://djconnect.pages.dev
- Cloudflare Pages project: `djconnect`
- Publish directory: `wwwroot`
- Current version: `3.1.16`
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
- iOS does not embed website repository releases. Add a release/download embed only when it has its own relevant app release source.
- If the GitHub repository/releases are private, set `GITHUB_TOKEN` as a Cloudflare Pages secret for the `djconnect` project.
- Version is tracked in `VERSION`, `package.json`, page footers and `CHANGELOG.md`.
- Language switching on the homepage, start page, embedded page, Features page, Raspberry Pi page, iOS page and macOS page is handled through per-page `translations` objects.
- `cleanup_old_releases.sh` removes old GitHub Releases, matching local/remote tags and older workflow runs. It keeps the current `VERSION` tag and the newest 10 workflow runs by default.
- Do not commit `.wrangler/`; it is local Wrangler cache.

## Release Steps

1. Commit all changes to `main`.
2. Ensure the GitHub Actions repository secret `CLOUDFLARE_API_TOKEN` exists.
3. Run `./release.sh --skip-deploy` when the token is only available in GitHub Actions.
4. Verify the GitHub Release, the `Deploy Cloudflare Pages` workflow run and https://djconnect.pages.dev.

The workflow deploys `wwwroot` to Cloudflare Pages on every push to `main` and sets `CLOUDFLARE_ACCOUNT_ID` explicitly.
The release script removes older GitHub Actions workflow runs by default and keeps only the newest run. Override with `KEEP_WORKFLOW_RUNS=N` when needed.

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
curl -s https://djconnect.pages.dev | grep "DJConnect website v"
```

## Current Verification

- `npm test` covers version consistency, route presence, homepage navigation/copy, firmware download embeds, macOS and Raspberry Pi download embeds, absence of website self-release embeds, translation keys, footer copyright, firmware links, compact embedded page structure, LilyGO visual hygiene and stale pre-flashed wording.
- Current released version `3.1.16` includes the single-iPad homepage hero slide, embedded page color alignment, renamed mini-games copy/sync prompt, Raspberry Pi downloads from `pcvantol/djconnect-pi-releases` and a dynamic public-release Linux install command.
- Dynamic GitHub download/install blocks now rerender when the language toggle changes, so generated install text follows NL/EN.
- The start-page client pairing panels no longer show extra Client API/discovery notes under iOS, macOS, Linux or ESP32.
- The start page `Installeren` navigation now jumps to `2. Voeg toe aan Home Assistant`; the separate `Start installatie` CTA still starts at the voice assist pipeline.
- The start page should be manually checked for the voice-assist documentation link, HACS deeplink, firmware/app release links, ESP pairing copy, app pairing copy, Raspberry Pi placeholder copy and troubleshooting text.
- The embedded page should be manually checked to confirm it no longer shows local quick start, requirements, FAQ or the `Stem via HA / Veilig gekoppeld / DJ-karakter` card row.
- Manual visual checks are still needed for desktop, tablet and mobile layouts until browser regression tests are formalized in CI.
