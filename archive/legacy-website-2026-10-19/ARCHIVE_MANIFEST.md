# Legacy DJConnect website — NOT DEPLOYED / HISTORICAL

Origin: pcvantol/djconnect-website, main `3133cb833c846395ac37dae804ba96848650bb7c`, website version 3.3.1.
Snapshot taken before replacement on 2026-10-19. Contains all 980 tracked source files verbatim, including complete wwwroot (all five locales), functions, migrations, scripts, tests, package lockfile, configuration, documentation and workflows. No ignored files, credentials, caches, node_modules or generated dist are included.

`FILE_INVENTORY.json` lists original relative paths, byte sizes and SHA-256 hashes. Git history is preserved. `npm run archive:check` verifies every archived byte and coverage against the pinned Git tree.

## Historical build

Restore into an isolated directory, install Node 24, then `npm ci && npm run build:release`. The output is `dist/wwwroot`. Run `npm test`. Historical browser tests require matching Playwright Chromium. External dependencies remain external and may change. Historical release.sh and workflows can publish or delete releases: **do not execute them for restoration**.

## Restore procedure

Copy only the paths named in FILE_INVENTORY.json from this archive into an empty isolated directory, preserving permissions. Check every SHA-256 against the inventory before building. Alternatively `git archive 3133cb833c846395ac37dae804ba96848650bb7c` reconstructs the original tracked tree; compare it byte-for-byte with this snapshot. Do not overwrite active worktrees or publish directly. Any rollback uses the protected release procedure and last qualified artifact.

## Publication fence

Only the allowlisted new wwwroot output is packaged. This archive stays outside it. The build rejects archive paths, symlinks and unexpected public files. Archived tests are excluded by explicit active-test enumeration. Cloudflare source/deploy revision at snapshot time: UNVERIFIED; source main is not live-deploy proof.
