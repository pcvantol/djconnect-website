# Chat Bootstrap Prompt

Use this prompt to initialize a fresh Codex chat for this repository:

```text
Je werkt in de repo `/Users/pcvantol/Documents/GitHub/djconnect-website`.

Lees eerst `HANDOFF.md`, `README.md`, `TECHNICAL_DESIGN.md`, `TESTS.md`,
`CHANGELOG.md` en `CONTRIBUTING.md`.

Context:
- Dit is de DJConnect website repo, statische site in `wwwroot`, deploy via
  Cloudflare Pages.
- Huidige versie is `3.2.16`.
- Huidige Home Assistant integration release voor websitecopy is `3.2.44`.
- Repo is MIT-licensed via `LICENSE`.
- Gebruik `npm test` voor de standaard testset.
- Voor releases: refresh Nederlandse screenshots voor alle publieke pagina's,
  loop alle vertalingen na in `en`, `nl`, `de`, `fr` en `es`, update
  versie/changelog/docs inclusief `CHAT_BOOTSTRAP.md`, commit en run
  `./release.sh --skip-deploy` wanneer publicatie via GitHub Actions loopt.
  Controleer daarna de Pages-workflow en de live footer-versie.
- Cross-repo contracten horen in `pcvantol/djconnect/SYNC_PROMPTS.md` en
  roadmap in `pcvantol/djconnect/PRODUCT_ROADMAP.md`, niet lokaal kopiëren.
- Let op: `/admin` hoort achter Cloudflare Access te staan. Beheer toegestane
  gebruikers en policies in Cloudflare Zero Trust, niet in deze repository.
  Voeg geen admin-wachtwoorden of gedeelde secrets toe aan code, docs of tests.

Belangrijke werkwijze:
- Gebruik bestaande stijl en tests.
- DJConnect wordt ontwikkeld en onderhouden met AI-assisted/agentic engineering workflows, inclusief Codex; accepted changes blijven maintainer-reviewed en prompts/logs/issues mogen geen secrets of private data bevatten.
- Geen secrets/tokens/wachtwoorden in commits, logs of diagnostics.
- Respecteer MIT-licentie en Spotify non-affiliation.
- Laat bestaande user changes intact.
- Na wijzigingen altijd `npm test` draaien.
```

For the admin/public-repository cleanup, append:

```text
Doel: maak deze repo veilig om public te zetten. Vervang de tijdelijke
Cloudflare Access for `/admin` door Cloudflare Access- of secret-backed toegang,
update docs/tests, release/deploy dit, en bereid daarna een veilige git history
rewrite voor om oude credentialwaarden uit de geschiedenis te verwijderen.
```
