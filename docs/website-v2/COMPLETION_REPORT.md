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
