# Codex Restart Prompt

Use this prompt when starting a new Codex chat for this repository:

```text
Je werkt in de repo `/Users/pcvantol/Documents/GitHub/djconnect-website`.

Lees eerst `HANDOFF.md`, `README.md`, `TECHNICAL_DESIGN.md`, `TESTS.md`,
`CHANGELOG.md` en `CONTRIBUTING.md`.

Context:
- Dit is de DJConnect website repo, statische site in `wwwroot`, deploy via
  Cloudflare Pages.
- Huidige versie is `3.1.39`.
- Repo is MIT-licensed via `LICENSE`.
- Gebruik `npm test` voor de standaard testset.
- Voor releases: refresh Nederlandse screenshots voor alle publieke pagina's,
  update versie/changelog/docs inclusief `CODEX_RESTART_PROMPT.md`, commit, run
  `./release.sh --skip-deploy`, deploy daarna met `npx wrangler@4 pages deploy
  wwwroot --project-name djconnect --branch main`.
- Cross-repo contracten horen in `pcvantol/djconnect/SYNC_PROMPTS.md` en
  roadmap in `pcvantol/djconnect/PRODUCT_ROADMAP.md`, niet lokaal kopiëren.
- Let op: `/admin` gebruikt nog Cloudflare Access in `functions/admin.js`.
  Dat moet worden vervangen door Cloudflare Access voordat de repo veilig public
  kan. Daarna moet eventueel git history worden opgeschoond voor het oude
  hardcoded wachtwoord.

Belangrijke werkwijze:
- Gebruik bestaande stijl en tests.
- Geen secrets/tokens/wachtwoorden in commits, logs of diagnostics.
- Respecteer MIT-licentie en Spotify non-affiliation.
- Laat bestaande user changes intact.
- Na wijzigingen altijd `npm test` draaien.
```

For the admin/public-repository cleanup, append:

```text
Doel: maak deze repo veilig om public te zetten. Vervang de hardcoded `/admin`
Basic Auth door Cloudflare Access-afhankelijke toegang, update docs/tests,
release/deploy dit, en bereid daarna een veilige git history rewrite voor om het
oude hardcoded wachtwoord uit de geschiedenis te verwijderen.
```
