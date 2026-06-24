# Changelog

All notable changes to this website are grouped per release.

## DJConnect website v3.1.64 - 2026-06-24

- Added dedicated Windows and Mac Catalyst client pages with Home Assistant
  pairing guidance, Ask DJ desktop copy and shared app-release download
  rendering.
- Added Windows and Mac Catalyst to the homepage interface cards, sitemap,
  screenshot manifest and platform-filtered download rendering.
- Added static EN/NL `v3.1.1` What's New release-note JSON/Markdown files for
  `windows` and `maccatalyst`, including legacy English fallback paths.
- Expanded tests and documentation for Windows/Mac Catalyst page routing,
  unsigned validation-build copy, namespaced release embeds and tracked
  download redirects.

## DJConnect website v3.1.63 - 2026-06-24

- Added Windows to the static homepage SEO/social descriptions and Features
  platform-flow copy.
- Expanded regression coverage so Windows stays present in public metadata and
  feature-map copy.

## DJConnect website v3.1.62 - 2026-06-24

- Synced public website copy and setup documentation with the new Windows
  desktop client contract.
- Added Windows to shared Ask DJ continuity, voice/PTT, platform overview,
  start-page pairing and project blog copy.

## DJConnect website v3.1.61 - 2026-06-23

- Added the operator Apple device registration overview backed by the
  server-side `/api/operator/registrations` proxy.
- Expanded static tests and documentation for APNs registration privacy,
  filters, pagination, proxy validation and redaction boundaries.

## DJConnect website v3.1.60 - 2026-06-23

- Synced the Ask DJ example voice intents with the current Home Assistant
  integration source data, including help, speaker switching, retry and recent
  listening-history examples.
- Updated regression coverage so the website keeps the Ask DJ example intent
  order and privacy-safe metadata aligned with the canonical HACS data.

## DJConnect website v3.1.59 - 2026-06-23

- Removed all On Air and AirPlay feature references from iOS and macOS
  `v3.1.40` release notes because the Apple-client feature has been removed.

## DJConnect website v3.1.58 - 2026-06-20

- Added fail-closed Pages middleware for `/operator`, `/operator.html` and
  `/api/operator/*` that verifies Cloudflare Access JWTs before serving the
  operator UI or proxying operator actions.
- Documented the required Cloudflare Access application settings and Pages
  runtime values `CLOUDFLARE_ACCESS_TEAM_DOMAIN` and
  `CLOUDFLARE_ACCESS_AUD`.

## DJConnect website v3.1.57 - 2026-06-20

- Refined the Ask DJ homepage copy by removing visible integration version
  badges and adding an action-focused feature card for speaker choice,
  suggestions and follow-up actions.
- Updated the features page with the shorter "Slimme follow-ups" Ask DJ
  marketing copy in Dutch and English.
- Wired the Playwright live smoke suite into GitHub Actions with Chromium
  browser installation before release-build validation.

## DJConnect website v3.1.56 - 2026-06-20

- Synced the Ask DJ example data with the latest Home Assistant integration
  `ask_dj_intents`, including contextual play follow-ups, next-track info,
  seeded mix/playlist requests and idle suggestions.
- Updated website and privacy copy for optional Apple push notifications,
  clarifying that they are wake/sync hints and do not carry tokens, raw prompts
  or full Ask DJ history.
- Aligned Ask DJ website requirements with the Home Assistant integration
  `v3.1.69+` contract, including Raspberry Pi read-only history display and
  central push relay wording for Ask DJ replies and waiting choices.
- Updated the GitHub Actions Pages workflow so pull requests run automated
  tests and release-build validation before deploy-capable `main` workflows.
- Removed the legacy `/admin` Pages Function and added a new static
  `operator.html` UI on top of token-protected `/api/stats`, including optional D1
  redirect-click counters when `ANALYTICS_DB` is bound.
- Added an operator-only admin flow proposal for explicitly revoking a
  compromised install token without issuing a replacement token.
- Wired the operator revoke flow through a server-side Pages Function proxy so
  `DJCONNECT_RELAY_SECRET` stays out of the browser while the API disables
  matching active install tokens.

## DJConnect website v3.1.52 - 2026-06-20

- Synced the website Ask DJ copy with the Home Assistant integration v3.1.65
  contract.
- Added user-facing copy for Ask DJ follow-up Ja/Nee controls and bounded
  server-side chat history trim behavior.
- Updated voice intent documentation to render Ask DJ conversational examples
  separately from deterministic Spotify voice commands.

## DJConnect website v3.1.51 - 2026-06-19

- Added Ask DJ as a major homepage and feature-page product section for iOS,
  macOS and Apple Watch clients.
- Documented Ask DJ chat, personal recommendations, explicit `Play Now`,
  cross-device history, voice/PTT, optional audio replies and compact
  Home Assistant-side privacy boundaries.
- Updated homepage mobile navigation behavior and removed the inline
  troubleshooting block from the start page so troubleshooting stays on the
  dedicated help route.

## DJConnect website v3.1.50 - 2026-06-18

- Added a dedicated troubleshooting page for common Spotify OAuth, HACS,
  pairing, Assist, playback, download and firmware issues.
- Added macOS mDNS/local API pairing diagnostics for cases where Home
  Assistant sees the client but cannot fetch the advertised `local_url`.
- Added a prominent Troubleshooting section to the Support page and linked the
  new route from the sitemap and documentation.

## DJConnect website v3.1.49 - 2026-06-18

- Added Voice Assistant as a homepage interface option, linking to the
  dedicated Home Assistant Assist route.
- Simplified top navigation on content pages by removing self-links and
  unnecessary cross-section menu items.
- Updated regression coverage for the revised homepage interface and
  page-specific navigation behavior.

## DJConnect website v3.1.48 - 2026-06-18

- Updated public-readiness TODO notes to reflect that `/admin` is protected by
  Cloudflare Access and should be reverified before public repository changes.
- Enabled available GitHub repository security automation for Dependabot
  vulnerability alerts and automated security fixes.
- Ran a final local public-readiness scan for worktree cleanliness, tests,
  secret-like patterns, credential files and recent git history.

## DJConnect website v3.1.47 - 2026-06-18

- Fixed an invalid extra brace in the homepage inline script that affected the
  minified production homepage.
- Added release-output syntax checks for inline scripts in all public HTML
  pages.

## DJConnect website v3.1.46 - 2026-06-18

- Fixed the release builder so JavaScript minification no longer strips
  `https://` inside template literals.
- Added release-output syntax checks for all generated `.min.js` assets before
  publishing.

## DJConnect website v3.1.45 - 2026-06-18

- Refactored shared responsive navigation behavior into reusable site assets so
  public subpages no longer duplicate hamburger-menu CSS and JavaScript.
- Added a minified release build step that publishes `dist/wwwroot` from
  `release.sh` and GitHub Actions while keeping source HTML/CSS/JS readable.
- Added production hardening with Cloudflare Pages security/cache headers, a
  branded noindex 404 page and documentation for release-output deployment.
- Added baseline accessibility affordances across public pages: skip links,
  consistent `main` targets, visible focus styles, reduced-motion handling,
  44px touch targets and decorative image checks.
- Expanded regression coverage for shared navigation, accessibility contracts,
  production headers, 404 behavior and minified release output.

## DJConnect website v3.1.44 - 2026-06-18

- Added a dedicated macOS TestFlight beta route with requirements, invite-link
  guidance, Home Assistant pairing, beta expiry notes and feedback mailbox.
- Linked the macOS app page to the macOS TestFlight beta route and added the
  route to sitemap, screenshot coverage and local link checks.
- Removed hardcoded `/admin` Basic Auth from the current admin function and
  documented Cloudflare Access as the required protection for
  `https://djconnect.dev/admin`.
- Rewrote local git history to remove the old concrete admin credential before
  making the repository safer to publish publicly.

## DJConnect website v3.1.43 - 2026-06-18

- Updated the shared voice intent data from the Home Assistant repository,
  including current-track status, direct playback-control commands,
  artist-with-track handling and the refreshed intent order.
- Extended the voice commands page with behavior badges, backend command
  mapping and clearer status-only/no-search explanations.
- Added an AI/Assist response disclaimer to the voice command and voice
  assistant pages.
- Added the development environment guide to the published documentation set.

## DJConnect website v3.1.42 - 2026-06-18

- Added a mobile hamburger menu to the homepage navigation, including
  accessible expanded-state handling, Escape-to-close behavior and regression
  coverage.

## DJConnect website v3.1.41 - 2026-06-18

- Added visible Support and Privacy links to the homepage navigation, with
  Dutch and English translation coverage.
- Updated repository bootstrap hygiene to mention AI-assisted development
  review and secret-handling expectations.

## DJConnect website v3.1.40 - 2026-06-18

- Added visible carousel arrow navigation and a lightweight animated signal
  layer to the homepage device hero.
- Added a TestFlight beta route, an App Store-ready Privacy Policy page and
  visible footer links for privacy and support.
- Clarified Spotify OAuth setup: users create their own Spotify Developer app,
  register the Home Assistant callback URL, enter the Client ID in DJConnect
  and reauthorize after external URL changes.
- Extended setup troubleshooting and regression tests for Spotify redirect URI
  mismatches, PKCE guidance and beta/privacy copy.

## DJConnect website v3.1.39 - 2026-06-18

- Changed the repository license to MIT, including `LICENSE`, package
  metadata and public footer license notices.

## DJConnect website v3.1.38 - 2026-06-18

- Added a Voice Assistant setup route and explanation page for using
  DJConnect as a Home Assistant Assist Conversation Agent with ESPHome-powered
  voice assistants.
- Updated the Spraak page with native ESPHome voice assistant guidance and
  refreshed release screenshot coverage for the new page.
- Pointed the Support page GitHub Issues fallback to the main
  `pcvantol/djconnect` repository.

## DJConnect website v3.1.37 - 2026-06-18

- Added a public Support page with `support@djconnect.dev` as the primary
  contact address and GitHub Issues as a technical fallback.
- Updated public page footers to route support links through the Support page.

## DJConnect website v3.1.36 - 2026-06-18

- Added a CSS-only Platform overview page showing clients, Home WiFi, voice
  input, Home Assistant with the DJConnect integration, Assist pipeline modes,
  Spotify, Spotify Connect speakers and future multi-music-backend space.
- Added compact DJ response style guidance to the Spraak page and removed the
  separate Artist-first status block.
- Updated release screenshot capture so Dutch screenshots are refreshed and
  validated as part of release preparation.

## DJConnect website v3.1.35 - 2026-06-16

- Added optional Playwright screenshot capture tooling for all public pages,
  including `npm run screenshots` and `npm run screenshots:live`.
- Added a laptop live-screenshot manifest and captured page images under
  `screenshots/live-laptop/` for visual QA review.
- Updated documentation, dependency inventory and regression coverage for the
  screenshot workflow and `@playwright/test` development dependency.

## DJConnect website v3.1.34 - 2026-06-16

- Added a cache-busting version query to every page that loads the shared
  `assets/downloads.js` renderer, preventing stale browser/WebView caches from
  showing macOS release cards on the iOS page after platform-filter updates.
- Added Cloudflare Pages `_headers` for `assets/downloads.js` with
  `Cache-Control: no-cache`, so the dynamic download renderer is revalidated
  while remaining cacheable.
- Extended tests to cover the cache header file and versioned download-renderer
  script references on iOS, macOS, ESP32 and Raspberry Pi pages.

## DJConnect website v3.1.33 - 2026-06-16

- Added explicit platform targeting to the shared GitHub download renderer so
  the iOS page never shows macOS assets and the macOS page never shows iOS
  assets from the shared app release repository.
- Added `Platform` navigation links back to the homepage app overview on the
  macOS, iOS, ESP32 and Raspberry Pi pages.
- Reworked the Raspberry Pi hardware guidance into one supported-hardware
  section for Raspberry Pi Zero 2 W plus Pimoroni HyperPixel 4.0 Square and
  removed the old separate starter-hardware cards.
- Added a copy-to-clipboard button to the Raspberry Pi bootstrap command block.

## DJConnect website v3.1.32 - 2026-06-16

- Removed local `SYNC_PROMPTS.md` and `PRODUCT_ROADMAP.md` copies from the
  website repo.
- Updated release hygiene, tests and documentation to point to the canonical
  Home Assistant integration repo sources:
  `pcvantol/djconnect/SYNC_PROMPTS.md` and
  `pcvantol/djconnect/PRODUCT_ROADMAP.md`.
- Added release-script checks that prevent local syncprompt, roadmap or old
  loose prompt files from being reintroduced.

## DJConnect website v3.1.31 - 2026-06-16

- Aligned the website voice-intent example data with the Home Assistant repo
  canonical source `examples/voice_intents.json`.
- Documented the canonical intent-family rules for artist-first requests,
  explicit track/album/playlist keywords and default playlist/favorites
  handling in the sync prompt, handoff notes and voice-intent data prompt.
- Extended regression coverage so the site keeps pointing to the canonical HA
  intent source and no longer drifts into separate hardcoded examples.

## DJConnect website v3.1.30 - 2026-06-15

- Added expandable changelog/release-notes rendering to the shared latest-version
  download cards for macOS, iOS, ESP32 firmware and Raspberry Pi/Linux clients.
- Added the iOS page to the same latest app-release block used by macOS, backed
  by `pcvantol/djconnect-app-releases`.
- Extended tests to cover changelog rendering from GitHub release body text and
  the iOS latest-version release embed.

## DJConnect website v3.1.29 - 2026-06-15

- Added a functional Raspberry Pi setup section that describes the path from a
  fresh Raspberry Pi OS Lite 64-bit image through first-boot configuration,
  SSH, Git checkout and the repo-only OS bootstrap script.
- Added starter hardware requirements for the Raspberry Pi page: 32 GB microSD
  card, Raspberry Pi Zero 2 W with header and Pimoroni HyperPixel 4.0 Square.
- Clarified that the Pi source checkout is used for OS bootstrap only, while the
  app itself is installed from the public release bundle shown in the Download
  section.
- Added Dutch and English translations plus regression coverage for the new
  Raspberry Pi bootstrap guidance.

## DJConnect website v3.1.28 - 2026-06-15

- Added a temporary Basic Auth protected `/admin` Pages Function for download
  statistics.
- The admin page fetches GitHub release asset `download_count` values at
  runtime for the app, firmware and Linux/Raspberry Pi release repositories.
- Kept the first admin version intentionally persistence-free: D1 aggregate
  website click counters and download redirect totals stay out of this page
  until the next analytics iteration.
- Added noindex, no-store and automated contract coverage for the protected
  admin route.
- Updated repository documentation and handoff notes for the temporary admin
  credentials, GitHub-runtime stats scope and future replacement path.

## DJConnect website v3.1.27 - 2026-06-15

- Reworked the voice commands page around a maintainable `intentFamilies`
  data object, so intent cards and examples render from one NL/EN source.
- Added `wwwroot/assets/voice-intents.js` as the shared voice intent example
  source for the homepage and voice commands page.
- Updated the homepage voice example chips to render a rotating, varied set of
  real voice intent examples and link to the full Spraak/Voice page.
- Updated the voice page hero, artist-first explanation, interpretation order,
  tip text and intent examples to match the current DJConnect voice/PTT
  contract.
- Added the expanded Lithium, artist, album, playlist, default playlist and
  playback-control example sets in both Dutch and English.
- Added `VOICE_INTENT_DATA_PROMPT.md` so future Home Assistant integration
  updates can provide structured voice intent data without website/layout
  instructions.
- Extended tests to verify the data-driven voice intent examples and the
  required Dutch/English Lithium phrases.

## DJConnect website v3.1.26 - 2026-06-15

- Updated the voice commands page so intent examples follow the selected NL/EN
  language toggle instead of showing both language columns at the same time.
- Kept Dutch and English example phrases in the page source for search and
  documentation value, while rendering only the active language in the UI.
- Extended automated coverage for language-scoped voice command example blocks
  and their toggle behavior.

## DJConnect website v3.1.25 - 2026-06-15

- Added a bilingual voice commands page that explains the DJConnect handling
  flow from client audio/text through Home Assistant STT, Assist intent data,
  fallback parsing, Spotify playback and personal DJ announcement feedback.
- Documented the artist-first behavior for generic music requests and added
  compact Dutch and English examples for artist, track, album, playlist,
  default playlist/favorites and playback-control intent families.
- Added the voice commands page to top-level homepage/features/blog navigation,
  sitemap, README, handoff and manual test documentation.
- Extended automated tests for the voice commands route, translation coverage,
  sitemap entry, navigation link and required intent-family copy.

## DJConnect website v3.1.24 - 2026-06-15

- Restored the `Website/Docs` section in the shared canonical `SYNC_PROMPTS.md`
  so website-specific contracts remain visible to all DJConnect repos.
- Added the current website navigation, blog, SEO/social preview, latest-only
  downloads, tracked redirects, cookieless analytics and release-cleanup rules
  to the shared sync prompt bundle.
- Restored shared contract notes for Home Assistant-owned Spotify token refresh,
  ESP32 Up Next queue capacity and the current bonus mini-game names.
- Updated the canonical product roadmap structure for cross-repo use, including
  release-cycle rules, production must-haves, killer features and premium
  feature candidates.
- Added a release preflight that refreshes declared npm dependencies when a
  lockfile exists and records the active Wrangler major-version tool before
  tests.
- Documented that third-party library, framework and release-tool upgrades must
  update the dependency inventory, license details and third-party notices
  before publishing.

## DJConnect website v3.1.23 - 2026-06-14

- Added a platform-independent homepage for DJConnect essentials, with focused navigation for `Hoe werkt het`, `Features`, `Installeren` and the primary `Aan de slag` CTA.
- Reworked the homepage hero into a swipeable carousel for macOS, iPad/iPhone and LilyGO/ESP32, with spacious device slides and current Dutch/English copy.
- Renamed the homepage overview label to `DJConnect in een oogopslag`.
- Added a top-level Features page with the main DJConnect functions and renamed bonus mini-games: Paddle Rally, Meteor Run, Sky Dash and Maze Chase.
- Added macOS, iOS and Raspberry Pi/Linux pages with language toggles, minimal navigation and download/store routes.
- Reworked iOS and macOS hero visuals to match the newer premium device-card style.
- Replaced the Raspberry Pi hero mockup with a Pimoroni HyperPixel Square 4-inch inspired visual and focused the page on Linux downloads.
- Added a Home Assistant `Aan de slag` setup page for voice assist, HACS installation, DJConnect configuration, downloads, client pairing and first use.
- Reworked the start-page pairing flow into target-specific panels for ESP device, iOS app, macOS app and Raspberry Pi app.
- Reworked the embedded ESP32 page into a compact product page focused on supported hardware, how it works and firmware downloads.
- Added supported embedded hardware links for LilyGO T-Embed CC1101 and ESP32-S3-BOX-3, including the LilyGO product-specifications link.
- Switched embedded ESP32 releases to the download-asset renderer so firmware binaries appear inline like macOS and Linux downloads.
- Added privacy-friendly aggregate click counters for HACS and download redirects, plus a token-protected stats endpoint that combines redirect totals with GitHub asset `download_count`.
- Added canonical `djconnect.dev` SEO metadata, `robots.txt`, `sitemap.xml` and documented `www.djconnect.dev` redirect support.
- Added a dedicated 1200x630 social preview image for WhatsApp/Open Graph without white borders and with the current `Muziekbediening met karakter` tagline.
- Connected macOS downloads to `pcvantol/djconnect-app-releases`, ESP32 firmware downloads to `pcvantol/djconnect-firmware` and Raspberry Pi/Linux downloads to `pcvantol/djconnect-pi-releases`.
- Added a dynamic Raspberry Pi/Linux install command that uses the latest public GitHub release bundle and preserves pairing/configuration on rerun.
- Updated the Raspberry Pi/Linux install command to run the renamed public release installer `sudo ./scripts/install.sh`.
- Added a copy-to-clipboard button for the generated Raspberry Pi/Linux install command.
- Fixed dynamic GitHub download/install blocks so generated copy updates when the language toggle changes.
- Extended static regression tests for latest-only release embeds, tracked download redirects, removed legacy macOS download routes and the public Linux install redirect.
- Removed redundant local Client API / discovery notes from the start-page client pairing panels.
- Added a small translated privacy notice to site footers and removed the app-only privacy copy placement.
- Updated the Raspberry Pi pairing step to explicitly paste pairing details in the Home Assistant integration.
- Limited Linux and ESP32 firmware download embeds to the latest GitHub release only.
- Updated start-page installation navigation so `Installeren` jumps to `2. Voeg toe aan Home Assistant`.
- Renamed start-page client switch labels to `iOS`, `macOS`, `Linux` and `ESP32`.
- Updated Linux/Raspberry Pi setup copy to point users to the public GitHub release install path.
- Updated embedded ESP32 voice-flow copy to focus on asking for the next artist.
- Removed self-referencing website release embeds from app/device pages.
- Updated the Home Assistant section heading to `Powered by Home Assistant, beschikbaar voor meerdere apparaten`.
- Renamed the ESP32 homepage CTA to `Meer over ESP32` and aligned it with the grey detail buttons.
- Removed pre-flashed wording from current site copy and replaced it with firmware download and flash guidance.
- Added visible footer copyright and site version metadata.
- Added repository documentation for releases, TODOs, known issues, handoff and testing.
- Added a release documentation guard so every release checks core docs and current handoff/changelog version alignment.
- Added `TECHNICAL_DESIGN.md` with reverse-engineered code-level design decisions, language-specific coding conventions and dependency/license inventory.
- Added `TECHNICAL_DESIGN.md` to the required release documentation set.
- Added a `stats:check` helper script for token-protected aggregate download/HACS stats.
- Added sitewide support links to GitHub Issues.
- Added static local link checking to the default Node test suite.
- Added a starter Playwright smoke suite for live/browser checks.
- Documented that every release must include a test-coverage review and test expansion when the change affects behavior, routes, rendering, analytics, release scripts or deployment.
- Switched the changelog policy back to separate changelog entries per release instead of consolidating all changes into one version entry.
- Added automated Node tests for version consistency, routes, store placeholders, copyright, translation coverage, setup/navigation copy and release/download embeds.
- Added `release.sh` for manual releases and Cloudflare Pages deployment.
- Added `cleanup_old_releases.sh` for release/tag cleanup and older GitHub Actions workflow run cleanup.
- Updated `release.sh` so every normal release automatically cleans old GitHub Releases, matching local/remote tags and older workflow runs.
- Added a GitHub Actions workflow that runs tests and deploys `wwwroot` to Cloudflare Pages on every push to `main` using the `CLOUDFLARE_API_TOKEN` repository secret.
- Synced the canonical cross-repo prompt bundle with Bonjour/mDNS client discovery guidance and renamed game labels.
