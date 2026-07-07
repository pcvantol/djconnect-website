# DJConnect App 3.2.26

## Changed

- Playback refreshes and backend recovery retries now coalesce better, reducing
  repeated network work after commands.
- The local issue and TODO documentation now reflects the completed hardening
  work.

## Fixed

- Temporary `backend_unavailable` outages now show recovery copy, retry
  automatically, and keep pairing intact.
- Generic playback-backend unavailable command failures now use the recovery
  copy while specific playback restrictions still show their own message.
- Voice/audio loading, incoming payload limits, runtime log redaction, and
  duplicate queue row identity handling are hardened.

---

Platform: iOS

Unsigned CI artifacts are intended for diagnostics and internal validation.
Unsigned iOS binaries are published here for diagnostics and internal validation. For normal iOS distribution, use TestFlight/App Store.
