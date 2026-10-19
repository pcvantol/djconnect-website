# Website V2 — producer accepted, final delivery controls in qualification

Decision: UI/ARCHIVE/ASSET SOURCE QUALIFIED; FINAL DELIVERY CHANGES REQUIRE REVIEW/CI. Branch codex/website-premium-v2, PR https://github.com/pcvantol/djconnect-website/pull/63. Runtime source reviewed fe5bf41d71caaf1b1b8e2f1d923a6ea3696de145. Final reconciliation commit is the Git commit containing this document; no self-referential SHA is fabricated.

| Requested status | Actual outcome |
| --- | --- |
| ARCHIVE_STATUS | PASS:980 baseline tracked files, exact hashes/Git blobs, isolated historical rebuild, excluded from public output |
| DESIGN_SYSTEM_STATUS | PASS: central tokens, shared UI/shell/sections/page registry; real palette/font propagation verified |
| VISUAL_ASSETS_STATUS | PASS: four original finished art families; canonical transparent/micro/wordmark variants hash-verified from Core883cb9; protected asset producer source and separate Finalization/mainCI PASS |
| WEBSITE_IMPLEMENTATION | PASS: clean4.0.0 short four-experience homepage plus start/privacy/support |
| FIVE_LOCALE_STATUS | PASS:65-key central catalog,20static routes, parity/alt/ARIA/SEO/canonical/hreflang |
| RESPONSIVE_UX_STATUS | PASS: real320/375/390/430/768/1280, Chromium/WebKit, overlay/focus/keyboard/touch/fallbacks |
| VIBECAST_INTEGRATION | PASS: compact social product vision, original room artwork, actual vibecast.tv destination; no backend changes |
| TESTS_AND_VISUAL_ACCEPTANCE |14Node and61browserPASS, one Chromium-only emulation inapplicable to WebKit; axeAA and real compiled-worker acceptance PASS. Actual32Linuxcaptures retained with provenance and independent visual closure |
| PR_REVIEW_CI | Prior55d9425 exact source/CI/OwnerAuth PASS; new release-identity/readback corrections need fresh independent review, exact-CI and authorization |
| FINALIZATION | NOT DONE: requires protected implementation merge followed by separate reconciliation PR |
| DEPLOYMENT_STATUS | NOT DEPLOYED: no main release artifact or deployment/live receipt fabricated |
| OPEN_BLOCKERS | Core producer blocker RESOLVED: source1224/main7e14 and separate Finalization1227/mainbaac, exact-mainCI39313456009SUCCESS. Fresh website delivery-controller review/CI/authorization remain; HA-runtime-release FAIL is separately registered, not waived |

## Final delivery corrections

Owner later authorized pickup of the existing blocking CorePR1224. Source and separate Finalization were protected merged with distinct exact-SHA authorization/review, source/mainCI and immutable asset readback. Website imports are byte-identical; receipt core-producer-acceptance.json. Core HA-runtimeGolden failed0tests/unknowncause; HApackage/reconcile blocked, no runtime/native/other-consumer completion claimed. That separate gate remains intact.

New corrections close actual release-provenance gaps: build identity comes from checkout GitHEAD rather than potentially later workflow_run eventSHA, qualified builds require clean source/expectedSHA, ephemeral build.json is ignored; Wrangler receives exact commitSHA and pinned version; redacted read-only canonical Cloudflare production identity is captured before/after without configuration/secrets. Live smoke verifies CFreceipt and actual public SHA/version/clean-source.18local Node tests PASS including real Git fixtures and negative identity/redaction cases. No public layout/copy/assets/API/auth/binding changes. Fresh exact-source review/CI remains required.

## Review and durable knowledge

Initial readonly review found superseded opaque branding and stale screenshots. Canonical corrected assets imported byte-for-byte; receipt src/assets/brand/HANDOFF_RECEIPT.md. Original owner master retained only as recovery source. Reused local preview disabled; screenshots taken from verified new artifact on unique4187. The earlier0.5% full-page tolerance had masked small header/footer changes; comparisons now permit100pixels. Actual screenshots are retained even on success. Soft assertions capture later menu states while any mismatch still fails.

Independent reviewer /root/independent_review opened actual390px LinuxWebKit,768px menu and1280px desktop. The overlapping image bottom border is transparent without geometry change; the visible line through mood labels is gone. P1/P2 closed, SOURCE GO for exactfe5bf41. Evidence: final-linux-acceptance.json, source run39304056369, PRmerge3b93810b48d1e2a5b30721f5549a121c6381e6af, artifact12214005193. Final accepted Linux references are these actual32captures, not copied Darwin images. Physical iPhone/VoiceOver and a separate nontechnical comprehension study remain unclaimed.

The receiver now validates parsed HTTP(S) artwork URLs and rejects credentials/executable schemes, clearing stale images. Active CodeQL remains enabled; immutable nonpublic archive excluded without modifying historical bytes. Pages Functions compile into the artifact so source-independent deployment preserves APIs/auth/bindings. No Core/API/Apple/runtime ownership or trust contract changed.

README/TECHNICAL_DESIGN/TESTS/HANDOFF/REPOSITORY_STATUS/PROMPT_INDEX and immutable prompt history reflect implementation. No new capability activated. Recommended continuation: obtain actual protected producer readback, qualify exact candidate and authorize through existing workflow; protected merge; separate Finalization; exact-main CI and manifest-bound immutable artifact; governed deployment and real live SHA/browser smoke. Owner deploy permission remains valid but waives no gate. Preserve sole-writer branch and main checkout until safe completion.

## Historical checkpoint and evidence chronology

# Website V2 implementation checkpoint

Decision: NOT QUALIFIED FOR PRODUCTION — implementation and local validation available; independent review and remaining gates open.
Assignment: DJC-WEBSITE-PREMIUM-CLEAN-REBUILD-V2. Canonical issue: https://github.com/pcvantol/djconnect-website/issues/62. Branch: codex/website-premium-v2. Baseline: 3133cb833c846395ac37dae804ba96848650bb7c. Candidate SHA and PR are bound by the resulting Git commit and PR readback, not invented in this document.

| Requested status | Actual evidence |
| --- | --- |
| ARCHIVE_STATUS | PASS: all 980 tracked baseline files, full path/size/SHA-256 inventory, pinned-tree coverage and isolated restoration test; archive excluded from artifact |
| DESIGN_SYSTEM_STATUS | Implemented central CSS tokens, semantic UI primitives, shared shell and configurable section/page registry; real-browser accent/font propagation verified then restored |
| VISUAL_ASSETS_STATUS | Four original finished image_gen artworks, original PNGs/prompts/provenance and WebP responsive derivatives; exact owner-supplied 1254px brand master rehashed |
| WEBSITE_IMPLEMENTATION | Clean new 4.0.0 homepage plus minimal start/privacy/support; no old marketing layout foundation |
| FIVE_LOCALE_STATUS | 20 static pages generated from one 65-key catalog; key/route/SEO/escaping tests and five-locale Chromium checks PASS |
| RESPONSIVE_UX_STATUS | Chromium screenshots at 320/375/390/430/768/1280 and four translated mobile pages; menu/focus/Escape/backdrop/touch/no-overflow tests PASS |
| VIBECAST_INTEGRATION | Compact social product-vision section and original friends/TV artwork; direct https://vibecast.tv link; no backend/pairing feature changes |
| TESTS_AND_VISUAL_ACCEPTANCE | 13 Node tests PASS; 57 Chromium/WebKit browser tests PASS in the final local run, plus real workerd operational acceptance PASS; updated exact-head results recorded by CI. axe AA for five locales and open navigation states PASS. Final local run: 57 Chromium/WebKit tests PASS; one CDP media-emulation test is intentionally Chromium-only. The initial apparent WebKit startup issue was a screenshot helper waiting on offscreen lazy images; real scrolling fixed it. Safari modal Tab eligibility also differed and was corrected with explicit focus cycling |
| PR_REVIEW_CI | Protected review/CI pending; first Linux visual capture intentionally fails for missing baselines until reviewed and committed |
| FINALIZATION | Pending implementation merge, then separate exact-SHA reconciliation |
| DEPLOYMENT_STATUS | No production deployment. Current owner authorization allows governed deployment only after review/CI/artifact/readiness/acceptance gates |
| OPEN_BLOCKERS | Qualified Core producer source/wordmark receipt, independent review, Linux/WebKit/browser proof, final visual/nontechnical acceptance and exact delivery gates |

## Visual review performed

Actual locally rendered full-page Chromium screenshots at 390 and 1280px were opened and inspected. The personal session sphere, distinct four-mood forms, music-to-story ribbon and warm shared-room image form one consistent blue/violet optical-glass family. Mobile hero copy/action and language control are visible, with one image per experience. Source reference: Apple IdleDJSessionView, DJSessionWelcomeArtwork, launch banner, shared glass surfaces and card appearance (32 radius, restrained edges, rounded typography, reduce-motion-aware artwork). This is source-style comparison, not a live native-app or physical-iPhone side-by-side acceptance. A nontechnical 5-second comprehension test has not been performed.

## Important corrections and risks

- The legacy build's static-only packaging did not explicitly carry Functions when deploying the immutable artifact. This candidate bundles the unchanged existing Functions and tests actual workerd auth/routing. No authentication or binding semantics are changed.
- Old tests asserted retired feature catalogs and technical guides. They are archived intact; active tests instead assert the approved new experience, five-locale parity and preserved operational/security contracts. Runtime tests exercise meaningful negative authorization and redaction behavior.
- Mac and Linux font rendering differ. Visual baselines are OS/engine specific and initial Linux baselines must be downloaded, visually reviewed and committed. Missing baseline failures must not be waived.
- Direct owner artwork receipt is verified; it is not a claim that Core/Apple rebranding has completed. The publication gate remains open until the exact producer handoff is qualified.
- Illustrations are product-vision artwork, not real customer/native screenshots. The VibeCast public copy follows the owner's final-product-promise instruction; readiness remains an internal publication gate.
- No secrets, provider credentials, node_modules, caches or generated dist are archived. Historical release scripts/workflows are reconstructable source, not instructions to execute their side effects.

## Updated knowledge

README, TECHNICAL_DESIGN, TESTS, HANDOFF and REPOSITORY_STATUS now reflect the actual clean static architecture, archive isolation, new routes, generated artwork, packaging, test commands and release boundaries. No Core Foundation/API contract was changed. This checkpoint is not completion, installed qualification or live release proof.

Recommended continuation: close concrete review/producer/browser/acceptance gates on this same candidate, correct real CI failures, qualify exact-head and exact-main, then perform protected implementation and separate Finalization; use only the manifest-bound deploy workflow and live SHA/browser readback for publication.

## Browser correction and final local run

`npx playwright test --workers=2`: 57 PASS, 0 failed, 1 explicitly Chromium-only CDP test inapplicable to WebKit. Both real browser engines exercised all five locales, six widths, modal keyboard/focus/backdrop behavior, screenshots and axe AA. Screenshots were reviewed at mobile and desktop size for both engines. This is browser-engine qualification, not physical iPhone/VoiceOver or independent user acceptance.

Linux CI initially exposed shallow history in the archive test. Validate and coverage observation now fetch full history; coverage observation also builds the artifact before testing it. The test is retained, not skipped. Core producer receipt, independent review, CI/Linux baselines, native/nontechnical acceptance and release gates remain open.

## First real Linux capture and reviewed baselines

PR CI run 39295444260 (source 81ec58df21ab66b0028968a85f67dd32624e7866, PR merge 8c00f9471cb657d45efb48c876f33833ed7a694a) produced artifact 12209205095. It had 37 passing nonvisual checks, 20 explicit missing-baseline failures and one Chromium-only CDP test not applicable to WebKit. Inspection of the actual results confirmed that every failure was a first baseline capture, not an ignored functional or accessibility defect.

All 32 Linux Chromium/WebKit screenshots were retained with SHA-256 provenance in evidence/website-v2/linux-baseline-receipt.json. Actual phone, desktop, menu and translated images were opened and visually reviewed before importing them. Native OS font fallbacks differ; deliberate engine/OS baselines preserve that fact rather than pretending Linux is an Apple device. CI now fails on flaky tests as well as missing/different snapshots. The next exact-head run must compare against these reviewed baselines successfully; this failed first-capture run is not called a PASS.

Owner Authorization currently reports HIGH_RISK authorization required for the exact SHA. Trusted Delivery wrapper success does not waive that separate commit status. No authorization dispatch, protected merge or deployment is inferred from generic consent.

## Deployment continuation — security result correction

The user approved deployment, then repeated approval after the CodeQL findings were disclosed. Initial dispatch of authorization for 58fc267 was rejected by automatic approval review because the earlier approval predated disclosure of two high-severity results. No authorization, merge or deployment occurred.

Fresh status inspection found a separate failed CodeQL result check even though the analysis workflow succeeded. Active `src/operational/session-receiver.html` assigned arbitrary Broadcast artwork URLs to img.src. The fix admits only parsed HTTP(S) URLs without embedded credentials, removes a prior image source for invalid artwork and preserves valid relative artwork, Broadcast rendering and audience signaling. Two real-browser regression cases run in each engine (four additional tests) exercise malicious/invalid/credential-bearing URLs, stale-source clearing and valid behavior.

Archive files remain exact. Default CodeQL queries and action pins remain active; only immutable nonpublished `archive/**` is excluded through a repository config, rather than modifying historical bytes or dismissing real active alerts. This material security correction creates a new candidate; old-SHA authorization is not transferred. Exact-head security results, independent review and the governed release gates remain required.

## Website-specific owner acceptance

The owner directly supplied the exact approved brand source and approved the preview/deployment twice. The website source-input and visual owner-acceptance gates are therefore satisfied. They do not certify the separate Core/Apple integral rebrand and do not invent a qualified Core producer-code/wordmark receipt. The old static branding gate was stricter than this website's actual input requirement; it is now named approved_brand_source and records only verified owner/canonical-master evidence. No security, review, CI or readiness gate is waived. Physical VoiceOver/iPhone and a separate nontechnical comprehension study remain unclaimed.

## Remediation verification

Source b7ea5e43b70ce5e8da32627e20d1bf3ffb889aec: real Validate 39299850174 SUCCESS, separate CodeQL result 118222294749 SUCCESS with zero annotations, and the branch-scoped open-alert query returned an empty set. Semgrep, Trusted Delivery technical qualification and projection passed. Local full browser suite now has 61 PASS, zero failures and the same single Chromium-only CDP test not applicable to WebKit; 13 Node tests and the complete historical rebuild/hash checks still pass. No old-SHA authorization run was created. Remaining internal gate: independent review. A separate read-only reviewer-agent has been offered through the pending user question; no reviewer was spawned without that explicit choice.
