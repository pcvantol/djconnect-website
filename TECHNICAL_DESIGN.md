# DJCONNECT Website V2 technical design

The 4.0.0 website replaces the old marketing surface with one short session-led homepage and three small service pages. The website owns presentation, localized copy and onboarding entry points. Core owns Session behavior and canonical branding; Apple owns its onboarding wizard; VibeCast owns its actual shared-screen implementation. No runtime feature or pairing contract is added here.

## Static composition

`src/pages/registry.mjs` defines routes and section composition. `src/layouts/SiteLayout.mjs` owns the HTML shell, SEO, header, language control, modal menu and footer. `src/layouts/sections.mjs` composes Hero, Vibe, Moment, VibeCast and service content. `src/components/ui.mjs` supplies shared semantic primitives. `src/locales/catalog.mjs` has 65 stable English keys and complete NL/EN/DE/FR/ES copy including alt and ARIA labels. Essential content and links work without JavaScript; mood preview and navigation are progressive enhancements.

`npm run build` generates 20 HTML routes into a clean `wwwroot`, then copies an allowlisted tree to `dist/wwwroot`. `VERSION` is the website version authority and must match package metadata. The source catalog and original PNG assets are never copied to public output. The source tree contains generated HTML for review; templates are the only editable page source. The build has no framework, hydration, CMS, external fonts or runtime translation dependency.

## Design language

`src/design/tokens.css` is the palette/font/typography/spacing/glass/mood/focus/motion authority. CSS uses semantic tokens and adapts the same composition to phone, tablet and desktop. The Apple source reference includes IdleDJSessionView, DJSessionWelcomeArtwork, DJConnectLaunchBanner, DJConnectCardAppearance and djSessionFrostedSurface. Native radius 32, border opacity .32 and width 1.25 informed the hierarchy; CSS approximates translucent material without claiming system Liquid Glass. Standard `dialog.showModal` plus explicit Tab wrap, Escape, backdrop and focus restoration protects keyboard users. Reduced motion, reduced transparency, unsupported-filter and forced-color fallbacks are included.

Mood controls are a local visual preview; they never pretend to configure a live Session. The four moods have distinct original artwork cues and centrally selected border/light colors. DJ Moment copy is a short explicitly illustrative musical observation, not an attributed artist fact. VibeCast artwork is a product-vision illustration, not a live connected screenshot or customer endorsement.

## Artwork and brand provenance

The owner supplied Approved-Source-Handoff ZIP, SHA-256 `a0deec308d82c812875f80c509983fab595dd9745b241c2e5f46ff58fbb11197`. Its exact 1254×1254 PNG SHA-256 is `f05fcdf4602d9c63add7799469c64060a8f13e5efa66ad6c7b762fb8273ec89f`. `src/assets/brand/approved-master.png` preserves the original bytes. Website variants resize it without redrawing; the compact wordmark is accessible live text next to that unchanged mark. No synthetic replacement logo is used. A qualified Core #1223 producer receipt remains distinct from direct owner source receipt.

Four original supporting images were generated with the built-in image_gen tool during this assignment. Original PNGs, exact prompts and provenance hashes live in `src/assets/artwork`. `scripts/optimize-images.py` reproduces WebP 480/800/1280 derivatives, mark sizes and five localized social previews with Pillow 13.0.0 (macOS Arial font for social captions; use the same font for byte reproduction). No album covers, artist endorsements or third-party image source materials were used. Hero image is eager/high priority; lower images are lazy. No image-generation service runs in the public website.

## Operational preservation and packaging

All `functions/` and `migrations/` source bytes remain unchanged from the archived baseline. The pinned Wrangler 4.151.2 compiler bundles Pages Functions into `dist/wwwroot/_worker.js/index.js` and emits `_routes.json`. This is essential: an artifact containing static files alone cannot preserve server-only Access guards and API proxies when deployed outside a source checkout. Actual compiler and workerd routing are tested, not merely source regexes.

`src/operational/` retains protected operator UI, its assets, Broadcast-only session receiver and all release-note JSON/Markdown feed paths. The receiver now rejects non-HTTP(S), malformed and credential-bearing artwork URLs before assigning the image source; this fixes CodeQL URL-injection findings while preserving ordinary relative/HTTP(S) artwork and audience-signal messages. Operator HTML removes the old decorative brand image; security behavior stays unchanged. Middleware retains Cloudflare Access JWT checks, configured audience and JWKS verification, with fail-closed defaults. `/api/stats` still requires its token, `/api/operator/*` uses the server relay secret and `/go/*` retains destination allowlists and cookieless aggregate counting. No binding, credential or Access policy is altered.

Apple source explicitly consumes `/start`, versioned/latest localized release-note feeds, and `/ios#downloads` / `/macos#downloads`. Feed bytes remain unchanged. Curated old install/platform routes redirect to compact `/start`. Retired technical/marketing routes return a real 404 through the custom noindex page. No blanket homepage redirect. `docs/website-v2/OPERATIONAL_CONTRACTS.md` records the matrix.

## Archive and test isolation

`archive/legacy-website-2026-10-19/` contains all 980 tracked files at `3133cb833c846395ac37dae804ba96848650bb7c`, with inventory, SHA-256, build and restoration instructions. Tests compare the inventory with the exact pinned Git tree, verify every hash and reconstruct an isolated source tree. npm explicitly runs `tests/*.test.mjs`; archived historical tests must never be auto-discovered. The clean generator and release allowlist exclude archive, originals, credentials, symlinks and unknown public files.

## Validation and release

Node tests cover archive/restore, catalog/key/route parity, escaping, composition, operational byte preservation, runtime guard failures and redacted proxy errors. Playwright checks the exact built tree in Chromium and WebKit, keyboard/menu behavior, touch targets, responsive widths, routes and axe WCAG AA. Visual baselines are engine- and OS-specific; Linux CI baselines must be reviewed, not silently accepted from macOS. Chromium CDP additionally emulates reduced transparency. Real workerd tests cover protected routes, stats denial, bad download destinations, HACS redirect, release-note JSON and archive 404.

The independent reviewer and release owner must close `docs/website-v2/release-gates.json` with exact evidence before publication. Owner authorization in #62 allows iterative production deployments, but existing Trusted Delivery, independent review, exact-main CI, immutable artifact/provenance and environment-readiness gates remain mandatory. `deploy-pages.yml` stays workflow_dispatch-only. No direct Wrangler production upload, force-push, release.sh direct-main push or protection bypass is authorized. Finalization remains a separate protected increment after implementation merge.

## CodeQL result remediation

The earlier statement that CodeQL was green referred incorrectly to successful analysis workflow execution. The separate CodeQL result check reported two active URL-injection findings and duplicate historical archive findings. The active receiver URL sink is now guarded by explicit parsed-URL protocol validation and covered by genuine Chromium/WebKit malicious-input and Broadcast-compatibility tests. No query is disabled or alert dismissed.

The canonical reusable CodeQL workflow exposes only a language input, so this repository uses the same pinned checkout, CodeQL init/analyze actions and default queries with a local config. Its only exclusion is `archive/**`, the hash-verified immutable nonpublished historical source. Active templates, receiver source, generated public HTML, Functions, scripts and tests remain scanned. Historical bytes are preserved; they are never substituted for patched active output.

## Exact build and production identity

`build-identity.mjs` reads the actual checked-out GitHEAD, never workflow-event
GITHUB_SHA (workflow_run can refer to a later default branch). Qualified CI
builds reject dirty/missing source identity and a mismatched WEBSITE_BUILD_SHA.
The release-artifact workflow supplies its immutable producer SHA explicitly
and accepts only successful own-repository main push validation, never a
pull-request workflow_run with a branch-name lookalike. Deploy requires the
exact candidate-named immutable artifact; smoke validates the actual successful
governed deployment run identity before reading its receipt.
`wwwroot/build.json` is ephemeral/ignored and generated anew with commit,
source_dirty, VERSION, languages and pages; it is always included in output.

Deployment still uploads only the checksum-verified artifact under `site`.
A sparse checkout supplies only the immutable readback helper, not public source.
Pinned Wrangler4.151.2 receives --commit-hash explicitly. The helper GETs the
existing Pages project before/after, whitelists only canonical production ID,
URL, branch/SHA/status/time, and never retains/logs configuration, environment
variables, token, account ID or commit text. Previous production identity is
retained. Canonical production must match candidate/main/success before an
accepted deployment receipt can be emitted. Live smoke additionally verifies
that receipt and actual public build.json commit/version/source_dirty=false.
No bindings, Access policy, DNS or credentials are modified.

References: [Wrangler Pages deployment flags](https://developers.cloudflare.com/workers/wrangler/commands/pages/)
and [Pages project canonical production metadata](https://developers.cloudflare.com/api/resources/pages/subresources/projects/methods/get/).
