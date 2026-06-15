# DJConnect Product Roadmap

This document collects product ideas for DJConnect. It is intentionally broader
than `TODO.md`: not every idea here is committed scope. Use it to shape future
releases, validate demand and decide what belongs in the free product, hardware
experience or possible paid tiers.

## Product Thesis

DJConnect should feel like music control with character: ask for music naturally,
choose where it plays, and receive useful personal DJ feedback across Home
Assistant, Apple clients, Linux displays and ESP32 hardware.

The strongest product direction is not "another remote control", but a shared
Home Assistant powered music workflow that can show up on the screen or device
that already fits the room.

## New Feature Ideas

- **Room-aware music requests**: let DJConnect remember preferred Spotify
  Connect outputs per room, device or time of day.
- **Mood and moment presets**: quick prompts such as cooking, focus, party,
  Sunday morning or late-night listening.
- **Up Next editor**: reorder, remove or pin upcoming tracks from macOS, iOS and
  Linux clients.
- **DJ style profiles**: selectable announcement styles such as subtle, radio,
  club, dry humor, short-only or Dutch/English mixed.
- **House rules**: explicit filters for volume limits, blocked artists,
  family-safe mode or quiet hours.
- **Shared now-playing wall**: a full-screen Raspberry Pi/HyperPixel view for
  cover art, current track, next item and short DJ text.
- **Party request mode**: temporary guest requests through a local web page or
  QR code, with owner approval.
- **Wake word confidence feedback**: show when the device heard "Okay Nabu" and
  when it is listening, processing or announcing.
- **Multi-room handoff**: move playback from one Spotify Connect speaker to
  another without losing context.
- **Personal music memory**: remember favorite artists, recent successful
  requests and disliked results locally through Home Assistant.
- **Routine hooks**: expose events to Home Assistant automations when music is
  requested, playback starts or a DJ announcement is generated.
- **Release-aware update hints**: show latest client/firmware versions and
  update state in the website and Home Assistant.
- **Diagnostics export**: one-button redacted diagnostic bundle for support
  issues across website, HA integration and clients.
- **Offline fallback screen**: clients show useful local status and pairing
  recovery steps when Home Assistant is unreachable.
- **Better first-run wizard**: one guided flow that explains Home Assistant,
  HACS, Spotify Premium, voice assist and client pairing without jargon.

## Killer Feature Candidates

- **Natural music request to real playback**: say an artist, mood or moment and
  have DJConnect start the right Spotify playback on the right speaker.
- **Personal DJ announcements**: short, configurable DJ reactions that make the
  system feel alive without becoming noisy.
- **One hub, many clients**: iOS, macOS, Linux/Raspberry Pi and ESP32 all use
  the same Home Assistant setup and pairing model.
- **Dedicated room controller**: a Raspberry Pi/HyperPixel or ESP32 device that
  feels like a physical music appliance, not a phone app stretched onto a wall.
- **Privacy-first local control**: no DJConnect account required for core use;
  pairing and tokens stay in Home Assistant or the client.
- **Guest request mode**: party guests can request music without receiving
  control over the whole smart home or Spotify account.
- **DJ personality engine**: announcement style, tone and prompt can be shaped
  by the user and reused across devices.

## Must Haves for Production Release

### Core Product

- Stable Home Assistant integration install path through HACS.
- Clear Spotify Premium requirement and resilient Spotify reauthorization flow.
- Reliable voice assist pipeline setup guidance.
- Consistent pairing for iOS, macOS, Linux/Raspberry Pi and ESP32.
- No client requires Spotify credentials directly.
- Clear error states for unpaired, stale token, backend unavailable, version
  mismatch and Home Assistant unreachable.
- Stable client/version compatibility policy for the `3.1.x` line.
- Public download and update path for every released client.
- Redacted diagnostics for support without secrets.

### Website and Documentation

- Canonical domain, SEO metadata, sitemap and social preview all current.
- Setup page remains the single source for installation guidance.
- App/device pages stay minimal and point to the correct latest download source.
- Blog and release notes explain major user-facing changes.
- Privacy notice accurately describes website and product behavior.
- Aggregate download/HACS counters remain cookieless.
- Link checker and translation coverage run in tests.
- Playwright smoke/monkey checks are documented for release validation.

### Quality and Support

- Automated tests cover setup copy, release embeds, navigation, redirects,
  translations and SEO.
- Manual smoke test checklist for live site and Cloudflare deploy.
- Support route via GitHub Issues or a dedicated support email.
- Production release checklist includes documentation, handoff, tests,
  changelog, sync prompts, cleanup and deployment validation.
- Clear rollback path for website deploys and client releases.

### Security and Privacy

- No bearer tokens, Spotify tokens, Wi-Fi passwords, Home Assistant tokens or
  audio URLs in logs.
- Client pairing tokens are short-lived or resettable.
- Website analytics stay aggregate-only: no cookies, IP addresses, user agents,
  referrers or visitor identifiers.
- Premium or account features, if introduced, must not weaken the local-first
  default experience.

## Premium Function Ideas

Premium features should add convenience, polish or hosted services while keeping
the core local/Home Assistant experience useful without payment.

- **Cloud sync for DJ styles**: synchronize custom DJ prompt/style profiles
  across devices.
- **Advanced DJ personalities**: curated style packs, multi-language voices,
  seasonal themes and tone presets.
- **Party mode plus moderation**: guest request queue, approval screen,
  temporary QR links and history.
- **Personal music memory**: richer request history, favorites, negative
  feedback and smart recommendations across rooms.
- **Hosted release/update dashboard**: monitor installed client versions and
  firmware update readiness from one page.
- **Advanced analytics**: privacy-preserving product usage summaries for the
  owner, such as requests per room or most-used client type.
- **Premium Linux/room display themes**: polished visual themes for HyperPixel,
  wall displays or kiosk mode.
- **Remote access helper**: guided secure setup for externally reachable Home
  Assistant URLs where needed, without storing user credentials.
- **Priority support**: faster support response, setup review or assisted
  onboarding for complex Home Assistant installations.
- **Family profiles**: different DJ styles, safe-mode rules and playback
  preferences per household member.
- **Automation recipes**: packaged Home Assistant automations for parties,
  wake-up routines, dinner mode or do-not-disturb listening.

## Free vs Paid Guardrails

- Core local pairing, playback control, Home Assistant integration and at least
  one DJ announcement style should remain free.
- Paid features should not require DJConnect to collect Spotify credentials.
- Paid features should be optional enhancements, not mandatory infrastructure
  for local control.
- The ESP32 and Linux clients should remain usable with the free Home Assistant
  integration.
- Any hosted premium service needs a clear privacy model before implementation.

## Open Product Questions

- Should DJConnect stay fully hobbyist/prosumer, or also target non-technical
  households with packaged hardware?
- Is the first paid product better as software premium, prebuilt hardware,
  support/onboarding or theme/personality packs?
- How much should DJConnect depend on Spotify versus preparing for future
  playback providers?
- Should guest request mode be local-network only or optionally hosted?
- What is the minimum App Store/TestFlight experience needed before iOS and
  macOS are presented as production-ready?
- Does ESP32 remain a reference device, or should it become a polished hardware
  product line?
