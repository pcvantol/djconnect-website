# Technical Design Decisions

This document records the implementation-level design choices for the DJConnect website. It is reverse-engineered from the repository and must be reviewed for every release.

Current website version: `3.1.67`

## Scope

The site is a Cloudflare Pages website with static HTML/CSS/JavaScript, small Cloudflare Pages Functions for GitHub release proxying and privacy-friendly redirect analytics, and Node.js tests.

Primary source files:

- Static pages: `wwwroot/*.html`
- Browser JavaScript: `wwwroot/assets/site-nav.js`, `wwwroot/assets/downloads.js`, `wwwroot/assets/releases.js`
- Browser CSS: inline page `<style>` blocks plus `wwwroot/assets/site-nav.css`, `wwwroot/assets/downloads.css` and `wwwroot/assets/releases.css`
- Edge functions: `functions/**/*.js`
- Data schema: `migrations/0001_create_click_counters.sql`
- Tests: `tests/site.test.mjs`
- Optional browser smoke and screenshot tests: `tests/smoke.playwright.mjs`, `tests/screenshots.spec.mjs`
- Operational helper scripts: `scripts/check-stats.mjs`
- Release tooling: `release.sh`, `scripts/build-release.mjs`, `cleanup_old_releases.sh`
- CI/CD: `.github/workflows/deploy-pages.yml`

## Architecture Decisions

### Static-first Pages

The site is implemented as static HTML pages in `wwwroot/` instead of a client framework. Each page owns its markup, critical styling, metadata and language dictionary. Shared behavior is limited to small asset scripts for responsive navigation and download/release rendering.

Why:

- Cloudflare Pages can serve static files directly with minimal runtime complexity.
- The site remains inspectable, cacheable and easy to deploy.
- Marketing/product pages do not need hydration, routing or a build step.

Sources:

- `wwwroot/index.html`
- `wwwroot/start.html`
- `wwwroot/embedded.html`
- `wwwroot/macos.html`
- `wwwroot/ios.html`
- `wwwroot/raspberry-pi.html`

### Progressive Enhancement for Dynamic Data

GitHub release data and install commands are rendered after page load by plain browser JavaScript. Static fallback containers remain valid HTML, while `assets/downloads.js` replaces them with live release cards or fallback messages.

Why:

- Pages remain deployable without a build pipeline.
- GitHub release content can change independently of website releases.
- Download links can route through `/go/download` for aggregate, cookieless click counts.
- The shared download renderer is loaded with a site-version query string and
  Cloudflare Pages `_headers` marks it `Cache-Control: no-cache`, so browsers
  and in-app WebViews revalidate platform-filter changes instead of running a
  stale release renderer.

Sources:

- `wwwroot/assets/downloads.js`
- `wwwroot/_headers`
- `wwwroot/assets/releases.js`
- `wwwroot/macos.html`
- `wwwroot/embedded.html`
- `wwwroot/raspberry-pi.html`

### Data Attribute Configuration

Dynamic components are configured with `data-*` attributes such as `data-github-owner`, `data-github-repo`, `data-release-limit`, `data-download-target`, `data-github-downloads`, `data-github-install` and `data-i18n`.

Why:

- Keeps page-specific configuration in markup.
- Allows the same script to render macOS, iOS, ESP32 firmware and Linux/Raspberry Pi downloads.
- Keeps platform filtering explicit when multiple client types share one public release repository.
- Makes static tests simple: contracts can be asserted by scanning HTML.

Sources:

- `wwwroot/assets/downloads.js`
- `tests/site.test.mjs`

### Edge Functions as Thin Adapters

Cloudflare Pages Functions are kept small and task-specific:

- `/api/releases`: proxies GitHub release API calls and applies a response cache.
- `/api/stats`: returns token-protected aggregate click counters plus GitHub `download_count` totals.
- `operator.html`: static internal UI for the D1-backed `/api/stats` contract.
  The old `/admin` Pages Function route is retired.
- `operator.html` operator tooling: prepares explicit install-token revocation
  calls through `/api/operator/install-token/revoke`, a server-side Pages
  Function that holds `DJCONNECT_RELAY_SECRET` and calls the DJConnect API
  bootstrap/operator contract.
- `/go/[target]`: redirects known targets such as HACS and latest Linux install bundle.
- `/go/download`: redirects allowed GitHub release asset URLs.

Why:

- Avoids exposing private tokens to browser JavaScript.
- Centralizes redirect allowlists and tracking.
- Keeps privacy-sensitive logic outside static pages.

Sources:

- `functions/api/releases.js`
- `functions/api/stats.js`
- `functions/go/[target].js`
- `functions/go/download.js`
- `functions/_shared/analytics.js`

### Explicit Allowlists for External Redirects

Download and redirect endpoints use explicit allowlists for supported repositories and named targets. Arbitrary destinations are rejected.

Why:

- Prevents open redirect behavior.
- Limits tracked download redirects to known DJConnect public release repos.
- Keeps analytics labels predictable through token sanitization.

Sources:

- `functions/_shared/analytics.js`
- `functions/go/download.js`
- `functions/go/[target].js`

### Cookieless Aggregate Analytics

The site tracks only daily aggregate counts by `target` and `source` in D1. It does not store cookies, IP addresses, user agents or unique identifiers.

Why:

- Gives basic insight into HACS/download usage.
- Preserves visitor privacy.
- Keeps storage schema simple and auditable.

Sources:

- `functions/_shared/analytics.js`
- `functions/api/stats.js`
- `migrations/0001_create_click_counters.sql`

### Latest-only Release Embeds

macOS, iOS, ESP32 firmware and Linux/Raspberry Pi download blocks intentionally show only the latest GitHub release by using `data-release-limit="1"`. macOS and iOS use explicit `data-download-target` values so the shared app release repository cannot show the wrong platform assets on a client page. Release body text is escaped and rendered as an expandable changelog, rather than parsed as Markdown or HTML.

Why:

- Reduces choice overload for users.
- Keeps install/download pages focused.
- Prevents old binaries from being presented as equal choices.
- Shows release context without adding a Markdown rendering dependency or
  trusting remote release HTML.

Sources:

- `wwwroot/assets/downloads.js`
- `wwwroot/macos.html`
- `wwwroot/embedded.html`
- `wwwroot/raspberry-pi.html`
- `tests/site.test.mjs`

### Static Regression Tests With Optional Browser Smoke Tests

The default test suite uses Node's built-in test runner and file inspection rather than a browser runner. Tests assert route links, local link existence, version consistency, copy contracts, translation coverage, download embed contracts, release script behavior and SEO/social metadata. Separate Playwright suites exist for live/browser smoke checks and Dutch laptop screenshot capture, and are intentionally kept out of the default `npm test` path.

Why:

- Fast default tests with no browser dependency.
- Good fit for a static site with deterministic markup.
- Easy to run in GitHub Actions before deploying.
- Browser smoke coverage can grow separately without making every local test run install browsers.
- Release screenshots force `SCREENSHOT_LANG=nl`, set the site language in browser storage and record `"language": "nl"` in `screenshots/live-laptop/manifest.json`.

Sources:

- `package.json`
- `tests/site.test.mjs`
- `tests/smoke.playwright.mjs`
- `tests/screenshots.spec.mjs`
- `.github/workflows/deploy-pages.yml`

### Release Script Owns Publishing Hygiene

`release.sh` is the canonical release path. It checks branch cleanliness,
version consistency, refreshes declared npm dependencies when a lockfile exists,
records the active `npx wrangler@4` version, runs tests, checks release files,
verifies documentation presence, checks current changelog/handoff version
references, builds a minified release copy in `dist/wwwroot`, creates and
pushes the tag, creates the GitHub Release, deploys the minified output to
Cloudflare Pages and runs cleanup. `cleanup_old_releases.sh` removes older
releases, tags and workflow runs.

The GitHub Actions workflow runs `npm ci`, `npm test` and
`npm run build:release` for pull requests and pushes to `main`. The deploy job
depends on that test job and is skipped for pull requests, so
`./release.sh --skip-deploy` and direct CI deploys publish the same minified
site structure as local releases only after automated checks pass.

Why:

- Makes repeated releases predictable.
- Prevents stale documentation and version drift.
- Keeps production HTML and shared browser assets smaller without making source
  files hard to review.
- Keeps dependency/tool upgrade checks visible before publishing.
- Keeps the GitHub Releases/tags/actions history tidy by default.

Sources:

- `release.sh`
- `scripts/build-release.mjs`
- `cleanup_old_releases.sh`
- `README.md`
- `HANDOFF.md`
- `TESTS.md`

## Coding Style Conventions

No separate formatter, linter or style guide configuration is present. The conventions below are inferred from the codebase.

### HTML

- One static HTML file per route/page.
- Semantic sections: `nav`, `header`, `section`, `article`, `footer`.
- Reusable class names such as `wrap`, `nav`, `hero`, `card`, `grid-2`, `grid-3`, `btn`.
- Accessibility attributes are used for navigation, toggles, carousel controls and decorative visuals (`aria-label`, `aria-hidden`, `aria-pressed`, `role`).
- Every public page exposes one `main` landmark, one `h1`, a skip link to
  `#mainContent`, visible focus styles and a declared document language.
- SEO and social metadata live in each page head.
- Translation keys are attached with `data-i18n` and `data-i18n-attr`.

Sources:

- `wwwroot/index.html`
- `wwwroot/start.html`
- `wwwroot/features.html`
- `wwwroot/support.html`
- `wwwroot/voice-commands.html`
- `tests/site.test.mjs`

### Production Hardening

Cloudflare Pages serves static files from the release output. The source pages
remain readable in `wwwroot`, while `scripts/build-release.mjs` creates
`dist/wwwroot` with minified HTML and shared browser assets before deploy.
`wwwroot/_headers` defines conservative defaults for HTML, long-lived immutable
caching for static assets, no-cache exceptions for dynamic renderer scripts and
baseline security headers.

The site includes a custom `wwwroot/404.html` marked `noindex`. It links back to
the homepage and support route and is intentionally excluded from the sitemap.

Why:

- Keeps production assets smaller and more cacheable.
- Keeps source files reviewable.
- Gives broken links a branded recovery path.
- Provides a baseline browser security posture without introducing app state.

Sources:

- `scripts/build-release.mjs`
- `wwwroot/_headers`
- `wwwroot/404.html`
- `.github/workflows/deploy-pages.yml`
- `tests/site.test.mjs`

### Public Support Route

Public support is routed through `wwwroot/support.html`. Site footers link to
that page, which presents `support@djconnect.dev` as the primary support
channel and keeps GitHub Issues as a technical fallback for logs, errors and
reproducible website issues.

Why:

- Gives non-technical users one clear contact address.
- Keeps GitHub Issues available for technical reports without making it the
  primary public support path.
- Avoids adding forms, tracking or account data collection to the static site.

Sources:

- `wwwroot/support.html`
- `tests/site.test.mjs`

### CSS

- CSS custom properties define per-page design tokens such as `--bg`, `--text`, `--muted`, `--line`, `--cyan`, `--green`, `--purple`.
- Layouts prefer CSS Grid and Flexbox.
- Components use low-radius cards, pill buttons and responsive media queries.
- Visuals are mostly CSS-built device mockups and SVG/PNG assets.
- Shared download/release styles are extracted to asset CSS files; page-specific styling stays inline in the relevant HTML page.

Sources:

- `wwwroot/index.html`
- `wwwroot/embedded.html`
- `wwwroot/assets/downloads.css`
- `wwwroot/assets/releases.css`

### Browser JavaScript

- Plain JavaScript, no bundler, no transpilation.
- `const`/`let`, arrow functions and small pure helpers.
- Browser APIs used directly: `fetch`, `XMLHttpRequest` fallback, `Intl.DateTimeFormat`, `MutationObserver`, `navigator.clipboard`.
- HTML generation is template-literal based, with explicit `escapeHtml` where command text is injected into attributes.
- Language changes are handled by observing the document `lang` attribute and re-rendering dynamic blocks.

Sources:

- `wwwroot/assets/downloads.js`
- `wwwroot/assets/releases.js`
- Inline translation scripts in `wwwroot/*.html`

### Cloudflare Pages Functions JavaScript

- ES modules with named exports.
- Pages Functions expose `onRequestGet`.
- Shared helpers live in `functions/_shared/analytics.js`.
- External calls use `fetch`.
- Responses use the Web `Response` API.
- Error handling favors short public messages and safe status codes.
- Sensitive endpoints return `404` when unauthorized.

Sources:

- `functions/_shared/analytics.js`
- `functions/api/releases.js`
- `functions/api/stats.js`
- `functions/go/[target].js`
- `functions/go/download.js`

### Node.js Tests

- Uses `node:test` and `node:assert/strict`.
- Tests read files directly with `node:fs/promises`.
- Tests are contract-oriented: they assert known strings, data attributes, script references, absence of removed copy and release script safety checks.
- Helper functions keep repeated parsing logic local to the test file.

Sources:

- `tests/site.test.mjs`
- `package.json`

### Bash

- Scripts start with `#!/usr/bin/env bash`.
- `set -euo pipefail` is used.
- Arguments are parsed with `case`.
- Release scripts fail early on dirty worktrees, version mismatch, missing tokens and existing tags.
- GitHub CLI is used for release and cleanup operations.

Sources:

- `release.sh`
- `cleanup_old_releases.sh`

### SQL

- D1 schema is intentionally minimal.
- Primary key is `(day, target, source)` for aggregate counters.
- An index supports target/day lookup.

Source:

- `migrations/0001_create_click_counters.sql`

### YAML

- GitHub Actions workflow is minimal and explicit.
- Node version is pinned to major `20`.
- Actions are pinned to major versions.
- Cloudflare account id is set in workflow env; token is read from repository secrets.

Source:

- `.github/workflows/deploy-pages.yml`

### Markdown

- Repository documentation uses short operational sections.
- Release documentation is split across README, HANDOFF, TESTS, TODO, ISSUES, CHANGELOG and this technical design document. Cross-repo sync prompt policy lives only in `pcvantol/djconnect/SYNC_PROMPTS.md`; the product roadmap lives only in `pcvantol/djconnect/PRODUCT_ROADMAP.md`.
- `CHANGELOG.md` is grouped per release.

Sources:

- `README.md`
- `HANDOFF.md`
- `TESTS.md`
- `CHANGELOG.md`

## Frameworks, Libraries and Third-party Dependencies

### Runtime and Build-time Dependencies

| Name | Type | Version in repo | License model | Source URL | Used by |
| --- | --- | --- | --- | --- | --- |
| Node.js | Runtime / test runner | GitHub Actions uses `20`; local version not pinned in repo | MIT-style Node.js license | https://github.com/nodejs/node | `npm test`, `node:test`, `node:assert/strict`, `node:fs/promises` |
| npm | Package/script runner | Comes with Node; no lockfile version pinned | Artistic License 2.0 | https://github.com/npm/cli | `npm test`, `npx wrangler@4` |
| Wrangler | Cloudflare CLI | `4` major via `npx wrangler@4`; latest observed during deploy: `4.104.0` | Apache-2.0 | https://github.com/cloudflare/workers-sdk | Cloudflare Pages deploy, D1 setup commands |
| Playwright / `@playwright/test` | Optional browser automation test runner | 1.61.1 locked devDependency | Apache-2.0 | https://github.com/microsoft/playwright | Optional `npm run test:smoke`, `npm run screenshots` and `npm run screenshots:live` browser checks |
| Cloudflare Pages | Hosting platform | Service, not vendored | Service terms, not source-licensed library | https://developers.cloudflare.com/pages/ | Static hosting and Pages Functions |
| Cloudflare Pages Functions / Workers runtime | Edge runtime | Service runtime, not vendored | Service terms, not source-licensed library | https://developers.cloudflare.com/pages/functions/ | `functions/**/*.js` |
| Cloudflare D1 | Managed SQLite-compatible database | Service, not vendored | Service terms, not source-licensed library | https://developers.cloudflare.com/d1/ | Aggregate click counters |
| GitHub REST API | External API | API version via `Accept: application/vnd.github+json`; no client library | Service terms, not source-licensed library | https://docs.github.com/rest | Release metadata, release assets, download counts |
| GitHub CLI (`gh`) | Release/cleanup CLI | Required locally; version not pinned in repo | MIT | https://github.com/cli/cli | `release.sh`, `cleanup_old_releases.sh` |
| GitHub Actions | CI/CD platform | Service, not vendored | Service terms, not source-licensed library | https://docs.github.com/actions | Test and deploy workflow |
| `actions/checkout` | GitHub Action | `v4` | MIT | https://github.com/actions/checkout | CI checkout |
| `actions/setup-node` | GitHub Action | `v4` | MIT | https://github.com/actions/setup-node | CI Node setup |
| Home Assistant HACS deeplink | External redirect target | Service URL, not a library | Service/project terms | https://my.home-assistant.io/ | `/go/hacs` redirect |

### Browser and Web Platform APIs

These are platform APIs, not third-party libraries:

| API | Used by | Purpose | Reference |
| --- | --- | --- | --- |
| Fetch API | Browser JS and Pages Functions | GitHub API calls and redirects | https://developer.mozilla.org/docs/Web/API/Fetch_API |
| XMLHttpRequest | `wwwroot/assets/downloads.js`, `wwwroot/assets/releases.js` | Fallback JSON loading path | https://developer.mozilla.org/docs/Web/API/XMLHttpRequest |
| Intl.DateTimeFormat | Download/release renderers | Localized release dates | https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat |
| MutationObserver | `wwwroot/assets/downloads.js` | Re-render dynamic blocks when language changes | https://developer.mozilla.org/docs/Web/API/MutationObserver |
| Clipboard API | `wwwroot/assets/downloads.js` | Copy Linux install command | https://developer.mozilla.org/docs/Web/API/Clipboard_API |
| URL / URLSearchParams | Browser JS and Functions | Query parsing and target validation | https://developer.mozilla.org/docs/Web/API/URL |
| Response | Pages Functions | JSON responses and redirects | https://developer.mozilla.org/docs/Web/API/Response |

### npm Dependencies

`package.json` declares no production package dependencies. The only development package dependency is `@playwright/test`, used for optional live smoke tests and screenshot capture. The website intentionally avoids a frontend framework, bundler, transpiler and CSS framework.

Source:

- `package.json`

### Static Assets

| Asset group | Location | Notes |
| --- | --- | --- |
| DJConnect icons, logo and social card | `wwwroot/assets/djconnect/` | Project-owned brand assets. |
| LilyGO DJConnect visuals | `wwwroot/assets/lilygo-t-embed-djconnect.svg`, `wwwroot/assets/lilygo-t-embed-djconnect-en.svg` | Project-specific device illustrations. |
| Web manifest | `wwwroot/assets/djconnect/site.webmanifest` | Browser install/metadata file. |

## Security and Privacy Decisions

- GitHub tokens are read only from server-side environment bindings and are never exposed to the browser.
- `/api/stats` requires `STATS_TOKEN`; unauthorized requests return `404`.
- The old `/admin` Pages Function route is retired. The static `operator.html`
  surface is `noindex` and still requires `STATS_TOKEN` to load data.
- Operator APNs device registration overview flow:
  `operator.html -> /api/operator/registrations -> https://api.djconnect.dev/v1/admin/registrations`.
  The Pages Function adds server-side `DJCONNECT_RELAY_SECRET` auth, validates
  pagination/filter query values and returns only privacy-safe metadata that the
  central API already redacts. The website does not query D1 directly for Apple
  device registrations.
- Operator revoke actions must go through the server-side
  `/api/operator/install-token/revoke` proxy. `DJCONNECT_RELAY_SECRET` must stay
  only in Cloudflare Pages secrets and must never be embedded in browser
  bundles, screenshots, docs or fixtures.
- Download redirects validate that the destination is a GitHub release URL in an allowed DJConnect release repo.
- Redirect analytics store aggregate counts only.
- No cookies or persistent browser identifiers are set by the website code.

Sources:

- `functions/_shared/analytics.js`
- `functions/api/stats.js`
- `functions/go/download.js`
- `README.md`

## Release Maintenance Rule

For every future release, update or consciously re-check this document together with:

- `README.md`
- `HANDOFF.md`
- `TESTS.md`
- `TODO.md`
- `ISSUES.md`
- `CHANGELOG.md`
- `CHAT_BOOTSTRAP.md`

Also decide whether test coverage needs to be expanded. Add tests when a release changes behavior, routes, copy contracts, translation keys, analytics, release scripts, deploy behavior or design-system contracts.

For cross-repo contract changes, update `pcvantol/djconnect/SYNC_PROMPTS.md` in
the Home Assistant integration repo as a follow-up. For roadmap changes, update
`pcvantol/djconnect/PRODUCT_ROADMAP.md`. Do not add local copies of either file
to this website repo.

If any third-party library, framework or release tool is updated or upgraded,
update the dependency inventory and third-party notice details in this document
and any dedicated notices document before publishing.
