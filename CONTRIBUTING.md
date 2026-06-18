# Contributing to DJConnect

Thanks for helping improve DJConnect.

This repository is part of the DJConnect project and is MIT-licensed. Related
DJConnect repositories are also MIT-licensed unless their own repository
metadata or a third-party dependency states otherwise.

## What Belongs Here

This repository contains the DJConnect public website, including static HTML,
CSS, JavaScript, Cloudflare Pages Functions, public release-note assets, tests,
documentation, screenshot tooling and release workflow scripts.

Do not commit secrets, tokens, WiFi passwords, OAuth credentials, private user
data, production logs or diagnostics that contain sensitive values.

## Development Setup

Install dependencies:

```bash
npm install
```

Run the default test suite:

```bash
npm test
```

Run optional browser smoke tests:

```bash
npm run test:smoke
```

Refresh Dutch visual QA screenshots for all public pages:

```bash
npm run screenshots:live
```

There is no build step for the static website. Cloudflare Pages publishes
`wwwroot`.

## Cross-Repo Contract

Changes to protocol behavior, public endpoints, client types, pairing, OTA,
Assist/STT/TTS behavior, Spotify playback, release-note contracts, download
routes or branding must be checked against the rest of the DJConnect project.

Coordinate with:

- `pcvantol/djconnect` for the Home Assistant integration;
- relevant DJConnect client, firmware and app release repositories;
- `SYNC_PROMPTS.md` and `PRODUCT_ROADMAP.md` in `pcvantol/djconnect` when a
  change touches cross-repo contracts or roadmap scope.

Do not add local copies of the canonical sync prompt or roadmap to this
website repository.

## Contribution Guidelines

- Keep changes small and focused.
- Follow the community standards in `CODE_OF_CONDUCT.md`.
- Report vulnerabilities privately through `SECURITY.md`, not public issues.
- Add or update tests for code, behavior or contract changes.
- Update documentation, examples and screenshots for user-facing changes.
- Keep secrets, tokens, passwords and private user data out of commits, logs
  and diagnostics.
- Respect the Spotify trademark and non-affiliation notice: DJConnect is not
  connected to, endorsed by or sponsored by Spotify AB.
- Use the real DJConnect brand assets from this repository. Do not redraw the
  logo or icon unless the brand asset is intentionally being replaced.

## Pull Requests

Before opening a pull request:

1. Run the repo-specific tests and checks.
2. Check `git status`.
3. Describe what changed.
4. List the checks you ran.
5. Mention any impact on other DJConnect repositories.

## Releases

The standard release flow is handled by `./release.sh`.

Before release, update `VERSION`, `package.json`, `package-lock.json`,
`CHANGELOG.md`, `HANDOFF.md`, `CHAT_BOOTSTRAP.md` and any public page
version strings. Refresh Dutch screenshots for all public pages and include the
updated files under `screenshots/live-laptop/`.

The release script expects a clean `main` worktree, runs `npm test`, verifies
release documentation, creates and pushes a `vX.Y.Z` tag, creates the GitHub
Release and can deploy `wwwroot` to Cloudflare Pages. Use
`./release.sh --skip-deploy` when deployment is handled separately or by
GitHub Actions.

After release, verify the GitHub Release, Cloudflare Pages deployment,
`https://djconnect.dev` and any cross-repo contract updates.

## Licensing

By contributing to this repository, you agree that your contribution is
licensed under the MIT License in `LICENSE`.

Spotify is a trademark of Spotify AB. DJConnect is not affiliated with,
endorsed by, or sponsored by Spotify AB.
