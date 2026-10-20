# DJCONNECT website

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/pcvantol/djconnect/7e14e5970b3f68d33d243ae6bab2b281fad59bb2/assets/djconnect/brand-v2/wordmark-primary-dark.png">
  <img src="https://raw.githubusercontent.com/pcvantol/djconnect/7e14e5970b3f68d33d243ae6bab2b281fad59bb2/assets/djconnect/brand-v2/wordmark-primary-light.png" alt="DJConnect" width="640">
</picture>

Your music. Your DJ.

The website is a compact session-led one-pager in Dutch, English, German, French and Spanish, with shared onboarding, privacy and support routes. It is a static build from shared templates, semantic design tokens and a central translation catalog.

```sh
npm ci
npm run build
npm test
npx playwright install chromium webkit
npm run test:e2e
```

Edit `src/`, then rebuild `wwwroot` and `dist/wwwroot`. `VERSION` owns the website version. See [technical design](TECHNICAL_DESIGN.md), [tests](TESTS.md) and [handoff](HANDOFF.md).

The entire previous website is recoverable in [the nonpublished archive](archive/legacy-website-2026-10-19/ARCHIVE_MANIFEST.md). Only the new allowlisted `dist/wwwroot` artifact is eligible for production; this includes bundled Pages Functions to preserve secured operational contracts.

## Operator infrastructure

The existing operator-only install-token revoke flow and registration overview remain behind Cloudflare Access. `CLOUDFLARE_ACCESS_TEAM_DOMAIN` and `CLOUDFLARE_ACCESS_AUD` are required for JWT verification; missing configuration fails closed. `/api/operator/*` uses server-side `DJCONNECT_RELAY_SECRET`. New token provisioning is a separate operator action. `/api/stats` retains `STATS_TOKEN` and optional `ANALYTICS_DB` aggregate counters. No secrets belong in source, public build metadata or screenshots. Configuration and bindings remain release-owner managed.

Production uses protected PRs, exact-main qualification, immutable artifact/provenance, the manually dispatched deploy workflow and live postdeployment verification. Owner permission for this assignment is recorded in #62; permission does not waive review, readiness or security gates. Never use historical release.sh to push directly to main or bypass the governed artifact pipeline.
