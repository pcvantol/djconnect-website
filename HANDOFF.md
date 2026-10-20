# Website delivery handoff

## Footer build revision — 2026-10-20

Owner requested publication of latest main plus an eight-character commit in parentheses after the footer version. Source [PR #69](https://github.com/pcvantol/djconnect-website/pull/69) merged as `59f933a541f01cb2061c2cc86b1a96d6c3aa09d8`; its whole tree matches independently reviewed `7a0dc20242b39db4e9476a0ef486b70f933e4b9a`. VERSION remains4.0.0. All20localized pages and404 use the same actual buildIdentity commit as build.json.

Source acceptance:21NodePASS,61real Chromium/WebKit browserPASS, operationalPASS and independent source/phone visualGO. First Linux run39402642733FAIL is retained:15expected footer baselines required reviewed replacement; assertions/tolerances unchanged. Final source PR Validate39403295902/push39403290102 and security/governance checksPASS. Source-main [Validate39403616559](https://github.com/pcvantol/djconnect-website/actions/runs/39403616559) and [CodeQL39403616545](https://github.com/pcvantol/djconnect-website/actions/runs/39403616545) remain exact-main authorities; publication requires their actual success, separate Finalization main qualification, downloaded-artifact Playwright, governed deployment and matching live smoke.

This separate Finalization changes records only. Actual publication identity and outcome are established by the matching `internal-website-<built commit>` release manifest/deployment/smoke receipts and live [build.json](https://djconnect.dev/build.json), rather than the historical snapshot below. No success is inferred before those checks execute. [Completion and publication contract](docs/footer-commit/COMPLETION_REPORT.md); [immutable prompt](docs/history/prompts/2026-10-20-footer-build-revision.md). No other-repository, backend, binding, credential or version change is selected.

## Original Website V2 accepted release snapshot — 2026-10-19

Published Website release: **4.0.0** at [djconnect.dev](https://djconnect.dev/).
Published source: `1253e1853f91ae1c938f009677618732ed62a5ca`.
Delivered capability: `DJC-WEBSITE-PREMIUM-CLEAN-REBUILD-V2`, canonical [#62](https://github.com/pcvantol/djconnect-website/issues/62), lane [#59](https://github.com/pcvantol/djconnect-website/issues/59).
Release state: **MERGED_RECONCILED**; last completed delivery workspace result: **WORKSPACE_READY**.

The accepted production receipt is [final-production-acceptance.json](evidence/website-v2/final-production-acceptance.json), copied byte-for-byte from the [durable exact-source evidence release](https://github.com/pcvantol/djconnect-website/releases/tag/internal-website-1253e1853f91ae1c938f009677618732ed62a5ca).
[Finalization #66](https://github.com/pcvantol/djconnect-website/pull/66) records the actual post-merge/live results.

Exact-release checks: main Validate `39323044524`, CodeQL `39323044402`, canonical qualification `39323452268`, artifact `39323451967`, governed production deployment `39323787473`, complete live smoke `39324049320`: **SUCCESS**.
Actual acceptance: **21 Node tests, 61 browser tests, one operational test and 32 hashed production screenshots**, with independent final visual/binding **GO**. One Chromium-only CDP case is inapplicable to WebKit.

The rebuilt site, complete legacy archive, shared design/page system, five locales and necessary secured operational contracts are delivered. See [completion report](docs/website-v2/COMPLETION_REPORT.md) and [technical design](TECHNICAL_DESIGN.md).

These records describe the accepted production release. The governance commit containing this reconciliation has its own protected PR and CI identity in GitHub; it is not a newly selected production candidate. A documentation-only main commit can therefore differ from the published source above. Keep publication manual and manifest-bound; this update requests no deployment, version change, public build change, backend work or new product phase.

Resume from `BOOTSTRAP_CODEX_SESSION.md`. Verify current Git branch/HEAD/remote/worktrees and actual public `build.json`; read the accepted production receipt before inferring release status. Preserve other writers and the recovery bundles. No unmerged product work is handed off by this record.

The old truncated-file reconciliation failure and the first Access smoke failure remain historical evidence; neither was reclassified. The strict no-follow Access test and complete canonical file pagination were delivered through the protected PR chain. Core branding source is accepted, while its separate HA-runtime Golden failure remains registered and unwaived. Physical iPhone/VoiceOver and an independent nontechnical comprehension study were not performed.

Previous rolling snapshot: [HANDOFF.md at the published source](https://github.com/pcvantol/djconnect-website/blob/1253e1853f91ae1c938f009677618732ed62a5ca/HANDOFF.md). Immutable prompt history and earlier Finalization documents remain unchanged.
