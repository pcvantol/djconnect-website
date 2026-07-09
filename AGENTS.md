# DJConnect Agent Guidance

This repository follows the DJConnect design foundation maintained in `pcvantol/djconnect`.

Before changing product positioning, website copy, onboarding, pricing/tier messaging, architecture diagrams, privacy copy, public docs, release pages, or cross-repo protocol docs, read the source-of-truth documents in the Home Assistant integration repo:

1. `DJCONNECT_CONSTITUTION.md`
2. `PRODUCT_VISION.md`
3. `DESIGN_PRINCIPLES.md`
4. `ARCHITECTURE_PRINCIPLES.md`
5. `CI_CD_RELEASE_GOVERNANCE.md`
6. `PRODUCT_ROADMAP.md`
7. `INNOVATION_LAB.md`
8. `SYNC_PROMPTS.md`

## Operating rules

- The Constitution wins when prompts or issues conflict.
- The website sells the experience, not implementation details.
- Community message: your AI DJ understands music.
- Personal message: your AI DJ understands you.
- Do not market future Cloud capabilities as available features until they are ready.
- Spotify, Music Assistant, Home Assistant, and clients are integration surfaces, not the product identity.
- Privacy claims must match actual product behavior.

## Repository role

`pcvantol/djconnect-website` owns public product story, onboarding, setup docs, compatibility messaging, community/personal positioning, and public release/download entry points.

## Cross-repo changes

If this repository changes product positioning, setup docs, privacy docs, compatibility tables, public release pages, or contract documentation, update `pcvantol/djconnect/SYNC_PROMPTS.md` and the roadmap/design docs when needed.
