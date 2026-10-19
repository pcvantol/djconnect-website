# Website V2 validation

Run with Node 24:

```sh
npm ci
npm run build
npm run archive:check
npm test
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

Tests run against `dist/wwwroot`, never the original templates. The Playwright config starts a task-owned local static server unless SMOKE_BASE_URL or SCREENSHOT_BASE_URL supplies a real external target. The default includes Chromium and WebKit. Missing/unlaunchable browsers are failures, not skips. Tests enumerate 320/375/390/430/768/1280 widths, 20 locale routes, canonical/hreflang, header language links, mood interaction, dialog focus wrap/return/Escape/backdrop, touch targets, reduced motion, archive/source denial and WCAG AA with axe. Reduced-transparency CDP emulation is Chromium-only.

For actual edge routing:

```sh
npx wrangler pages dev dist/wwwroot --port 4174 --compatibility-date 2026-10-19
# in a second terminal
npm run test:operational
```

This makes only non-destructive requests against the actual workerd bundle. The Node fixture tests additionally cover happy path revoke, revoked-0, confirm-required UI/source retention, API 401/403 rendering and secret redaction. No production revoke is called.

Screenshots and diffs use `tests/visual-baselines/{platform}/{engine}`. Update only after actual visual review: `npx playwright test tests/screenshots.spec.mjs --update-snapshots`. First capture is not independent acceptance. CI uploads browser report, actual/expected/diff artifacts and reviewed baselines where available. A missing OS baseline intentionally fails until reviewed and committed. Source-generated visuals, actual screenshots and physical-device acceptance are separate evidence.

`npm run release:gate` must fail while internal release gates remain OPEN. Predeployment browser checks must bind to the exact built candidate; postdeployment checks must use the real production origin and read back build.json commit/version. A 200 response or CI success alone does not establish deployed SHA or user acceptance.

Archive restoration tests compare all 980 original paths against the pinned tree, every SHA-256 and a real isolated reconstruction. Publication tests assert archive/originals are absent, functions/migrations/feed bytes remain identical, and all local links resolve. Test commands explicitly exclude archived tests. CSS token tests and real-browser font/accent substitution prove centralized propagation, then reload the approved palette.

Current qualification and limitations: see `docs/website-v2/COMPLETION_REPORT.md`.

Release identity regressions use real temporary Git checkouts: unrelated event
SHA cannot relabel a build; wrong expectedSHA, dirty CI source and missing Git
fail closed. Pages receipt tests verify explicit secret/configuration redaction,
canonical production versus latest preview, wrong project/branch/SHA/status and
missing identity. These are offline controls; actual Cloudflare API acceptance
is established only by the separately authorized real deployment/readback.

Publishing-policy cases also reject automatic/unknown Git production settings
and malformed source identities; only absent API source (direct upload) or an
explicitly disabled supported Git source passes. Local Node suite: 19 PASS.
Actual pre-merge Cloudflare policy is separately verified by the read-only
readiness run; offline fixtures alone do not qualify the remote configuration.

Production operator Access smoke never follows authentication redirects. It
requires401/403 locally; production may instead return302 only from the exact
https://djconnect.dev origin to the exact HTTPS pcvantol.cloudflareaccess.com
loginpath for djconnect.dev, without credentials. A loginpage200 is never an
accepted protected response. Actual first live trace established this boundary;
negative origin/path/status/credential cases fail closed. No Access policy or
function changes. Old full-smokeFAIL remains recorded, not reclassified.
