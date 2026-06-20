# Development Environment

This document describes how to work on the DJConnect website locally.

## Requirements

- Node.js 20 or newer is recommended.
- npm, included with Node.js.
- Git.
- Optional: Playwright browser binaries for smoke tests and screenshot capture.
- Optional: Wrangler for direct Cloudflare Pages deploys. The release script
  uses `npx wrangler@4`, so a global install is not required.

Do not store secrets, tokens, OAuth credentials, WiFi passwords, private URLs or
personal diagnostics in this repository, prompts, logs, screenshots or test
fixtures.

## First Setup

Install dependencies:

```bash
npm install
```

Run the default test suite:

```bash
npm test
```

There is no build step. The website is a static Cloudflare Pages site published
from `wwwroot`.

## Local Preview

For quick static page edits, open files from `wwwroot` directly in a browser.

For routes and relative assets that behave better over HTTP, serve `wwwroot`
with any static file server, for example:

```bash
npx http-server wwwroot
```

or:

```bash
python3 -m http.server 8080 --directory wwwroot
```

## Useful Commands

Default static and contract tests:

```bash
npm test
```

Optional live/browser smoke tests:

```bash
npm run test:smoke
```

Install Playwright browsers before the first browser run:

```bash
npx playwright install
```

Refresh Dutch screenshots for visual QA:

```bash
npm run screenshots:live
```

Check aggregate download/click stats when `STATS_TOKEN` is available:

```bash
STATS_TOKEN='your-stats-token' npm run stats:check
```

## Repository Layout

- `wwwroot/`: static HTML, CSS and browser JavaScript.
- `wwwroot/assets/`: shared browser assets, icons and product visuals.
- `functions/`: Cloudflare Pages Functions for release data, redirects,
  statistics and token-protected stats data.
- `wwwroot/operator.html`: static D1 admin UI that reads `/api/stats` with a
  private `STATS_TOKEN`.
- `migrations/`: optional D1 migration for cookieless aggregate counters.
- `tests/`: Node test suite plus optional Playwright smoke/screenshot tests.
- `scripts/`: local helper scripts.
- `release.sh`: standard release script.
- `cleanup_old_releases.sh`: release/tag/workflow cleanup helper.

See `README.md`, `HANDOFF.md`, `TECHNICAL_DESIGN.md` and `TESTS.md` for deeper
context before larger changes.

## Working Rules

- Keep changes small and focused.
- Run `npm test` before committing.
- Update tests for changed behavior, routes, translations, release contracts or
  user-facing copy.
- Update documentation when setup, release, privacy, security or cross-repo
  expectations change.
- Keep `VERSION`, `package.json`, page footer versions and `CHANGELOG.md`
  aligned for releases.
- Do not add local copies of `SYNC_PROMPTS.md` or `PRODUCT_ROADMAP.md`.
  Canonical versions live in `pcvantol/djconnect`.
- Respect the Spotify trademark and non-affiliation notice.
- Leave unrelated local changes intact.

## AI-Assisted Development

DJConnect is developed and maintained with AI-assisted and agentic engineering
workflows, including Codex. AI assistance may be used for code, documentation,
tests, release preparation and cross-repo consistency checks.

All accepted changes remain maintainer-reviewed. Contributors remain
responsible for correctness, tests, licensing and keeping private data out of
prompts, issues, logs and diagnostics.

## Cloudflare Pages

GitHub Actions runs `npm ci`, `npm test` and `npm run build:release` on pull
requests and pushes to `main`. Production deployment runs only for pushes to
`main` and manual workflow dispatches after the test job succeeds.

Required GitHub Actions secret:

```text
CLOUDFLARE_API_TOKEN
```

Minimum Cloudflare token permissions:

- `Cloudflare Pages:Edit`
- `Account:Read`

The Cloudflare Pages project publishes `wwwroot` for project `djconnect`.

Direct deploys are normally only needed for recovery or deploy-only passes:

```bash
export CLOUDFLARE_API_TOKEN='your-cloudflare-pages-token'
export CLOUDFLARE_ACCOUNT_ID='efe77cadf8317a53832fca0848e3ae51'
npx wrangler@4 pages deploy wwwroot --project-name djconnect --branch main
```

## Release Flow

For a normal release when deployment is handled by GitHub Actions:

```bash
npm test
./release.sh --skip-deploy
```

The release script:

- verifies the worktree is clean and on `main`;
- updates declared npm dependencies when a lockfile exists;
- runs tests;
- verifies release documentation and screenshot metadata;
- pushes `main`;
- creates and pushes the version tag;
- creates a GitHub Release;
- removes older releases, tags and workflow runs.

After release, verify:

```bash
gh run list --branch main --limit 3
curl -I https://djconnect.dev
curl -I https://www.djconnect.dev
curl -s https://djconnect.dev | grep "DJConnect website v"
```

Expected results:

- GitHub Actions deploy is successful.
- `https://djconnect.dev` returns HTTP 200.
- `https://www.djconnect.dev` redirects to the apex domain.
- The footer version matches `VERSION`.

## Security Notes

Report vulnerabilities privately through `SECURITY.md` and
`security@djconnect.dev`.

The old `/admin` Pages Function route is retired. The internal browser UI lives
at `https://djconnect.dev/operator.html`, should remain protected by Cloudflare
Access or another edge policy, and still requires `STATS_TOKEN` before it can
read `/api/stats`. Do not add admin passwords or shared secrets to this
repository, documentation, issues or diagnostics.
