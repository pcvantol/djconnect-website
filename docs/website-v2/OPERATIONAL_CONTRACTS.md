# Website V2 route and consumer matrix

Baseline: 3133cb833c846395ac37dae804ba96848650bb7c. Fresh Apple source observations are references, not installed-product qualification.

| Surface | Consumer/evidence | Disposition |
| --- | --- | --- |
| `/start` | Apple DJConnectRootView links in onboarding | New compact five-locale destination; actual HACS redirect and no fake Store link |
| `/ios#downloads`, `/macos#downloads` | Apple app release UI links | Curated 301 to new `/start`; no obsolete download claim |
| old install/platform/TestFlight/Pi/embedded routes | Existing external install guidance | Curated per-locale 301 to `/start` |
| `/release-notes/**` | DJConnectAppModel versioned/latest default and localized URLs; existing additional platform feeds | Preserve every path and exact byte, including MD source siblings; exclude from marketing navigation/sitemap |
| `/api/releases` | Existing release clients/widgets | Preserve function and allowlists unchanged |
| `/go/hacs`, `/go/download`, `/go/linux-install`, registered redirects | Existing install/download clients | Preserve source and aggregate behavior unchanged |
| `/api/stats` | Operator aggregate dashboard | Preserve token requirement; unauthenticated 404 |
| `/operator`, `/operator.html`, `/api/operator/*` | Operator registration/revocation UI and proxies | Preserve Access audience/JWKS guards and server-only relay secret; no bindings changed |
| `/session-receiver.html` | Existing stateless Broadcast-only receiver | Preserve Broadcast interface and audience-signal messages; validate image URL protocols to fix CodeQL injection findings; no nav/sitemap exposure or new VibeCast feature |
| `/features`, `/developers`, `/voice-*`, `/blog*`, `/troubleshooting`, `/windows`, `/maccatalyst` | Retired marketing/docs; Windows retired; no retained active dependency observed beyond historical source | Real custom noindex 404; original source archived |
| `/archive/**`, `/src/**`, source PNGs and manifests | Private historical/working source | Never in artifact; real 404 verified locally and required live |

Source functions and migrations remain byte-identical to baseline. The artifact now explicitly includes the compiled worker and routes; this avoids losing operator authentication when deploying the immutable static artifact. No destructive production operation is part of acceptance. Correct live Cloudflare bindings/Access and downstream endpoints remain distinct production gates.
