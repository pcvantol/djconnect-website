# DJConnect App 3.2.28

## Changed

- Push registration now follows the Central API v1.0.11 bootstrap contract:
  Apple clients fetch short-lived `djcboot_...` proofs through a trusted
  pairing issuer, never from Home Assistant directly.

## Fixed

- Push bootstrap recovery now retries Home Assistant exactly once, keeps proofs
  only in memory, validates issuer proof expiry, and avoids retry loops for
  invalid or expired proofs.

---

Platform: macOS

Unsigned CI artifacts are intended for diagnostics and internal validation.
For normal macOS distribution, prefer the notarized Developer ID build when attached.
