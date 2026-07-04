#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="djconnect"
PUBLISH_DIR="wwwroot"
RELEASE_PUBLISH_DIR="dist/wwwroot"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-efe77cadf8317a53832fca0848e3ae51}"
KEEP_WORKFLOW_RUNS="${KEEP_WORKFLOW_RUNS:-1}"
DOC_FILES=(README.md HANDOFF.md TESTS.md TODO.md ISSUES.md CHANGELOG.md TECHNICAL_DESIGN.md CHAT_BOOTSTRAP.md)
FORBIDDEN_CANONICAL_COPIES=(SYNC_PROMPTS.md PRODUCT_ROADMAP.md HA_SYNC_PROMPT.md ESP_SYNC_PROMPT.md IOS_MACOS_APP_HANDOFF.md APPLE_APP_SYNC_PROMPTS.md docs/SYNC_PROMPTS.md)
VERSION="$(tr -d '[:space:]' < VERSION)"
TAG="v${VERSION}"
BRANCH="$(git branch --show-current)"
usage() {
  cat <<USAGE
Usage: ./release.sh [--skip-deploy]

Runs tests, verifies release metadata, creates and pushes tag ${TAG},
creates a GitHub Release, builds a minified release copy, deploys ${RELEASE_PUBLISH_DIR} to Cloudflare Pages, and
cleans up older releases, tags and GitHub Actions workflow runs.

Environment:
  CLOUDFLARE_API_TOKEN  Required unless --skip-deploy is used.
  KEEP_WORKFLOW_RUNS    Number of newest GitHub Actions runs to keep. Defaults to 1.
USAGE
}

SKIP_DEPLOY="false"
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
elif [[ "${1:-}" == "--skip-deploy" ]]; then
  SKIP_DEPLOY="true"
elif [[ $# -gt 0 ]]; then
  usage
  exit 1
fi

if [[ "$BRANCH" != "main" ]]; then
  echo "Release must be run from main. Current branch: $BRANCH"
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has uncommitted changes. Commit or stash them before release."
  git status --short
  exit 1
fi

if [[ "$(node -p "require('./package.json').version")" != "$VERSION" ]]; then
  echo "VERSION and package.json version do not match."
  exit 1
fi

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Tag $TAG already exists."
  exit 1
fi

if [[ "$SKIP_DEPLOY" != "true" && -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "CLOUDFLARE_API_TOKEN is required for deployment."
  exit 1
fi

echo "Running tests..."
npm run deps:update
if [[ -n "$(git status --porcelain -- package.json package-lock.json)" ]]; then
  echo "Dependency refresh changed package metadata. Commit the updated dependency files before releasing."
  git status --short -- package.json package-lock.json
  exit 1
fi
npm test

echo "Checking release files..."
test -f "$PUBLISH_DIR/index.html"
test -f "$PUBLISH_DIR/embedded.html"
test -f "$PUBLISH_DIR/assets/djconnect/site.webmanifest"
test -f screenshots/live-laptop/manifest.json
grep -q '"language": "nl"' screenshots/live-laptop/manifest.json
for DOC_FILE in "${DOC_FILES[@]}"; do
  test -f "$DOC_FILE"
done
for CANONICAL_COPY in "${FORBIDDEN_CANONICAL_COPIES[@]}"; do
  if [[ -e "$CANONICAL_COPY" ]]; then
    echo "Forbidden local canonical copy exists: $CANONICAL_COPY"
    echo "Use pcvantol/djconnect/SYNC_PROMPTS.md and pcvantol/djconnect/PRODUCT_ROADMAP.md as the canonical cross-repo sources."
    exit 1
  fi
done
grep -q "DJConnect website ${TAG}" CHANGELOG.md
grep -q "Current version: \`${VERSION}\`" HANDOFF.md
grep -q "Current website version: \`${VERSION}\`" TECHNICAL_DESIGN.md
grep -q "DJConnect website v${VERSION}" "$PUBLISH_DIR/index.html"
grep -q "DJConnect website v${VERSION}" "$PUBLISH_DIR/embedded.html"

echo "Building minified release site..."
npm run build:release
test -f "$RELEASE_PUBLISH_DIR/index.html"
test -f "$RELEASE_PUBLISH_DIR/assets/site-nav.min.css"
test -f "$RELEASE_PUBLISH_DIR/assets/site-nav.min.js"
grep -q "assets/site-nav.min.css" "$RELEASE_PUBLISH_DIR/index.html"
grep -q "assets/site-nav.min.js" "$RELEASE_PUBLISH_DIR/index.html"

echo "Pushing main..."
git push origin main

echo "Creating tag $TAG..."
git tag -a "$TAG" -m "DJConnect website ${TAG}"
git push origin "$TAG"

echo "Creating GitHub Release..."
gh release create "$TAG" \
  --title "DJConnect website ${TAG}" \
  --notes-file CHANGELOG.md \
  --latest

if [[ "$SKIP_DEPLOY" == "true" ]]; then
  echo "Skipped Cloudflare Pages deploy."
else
  echo "Deploying $RELEASE_PUBLISH_DIR to Cloudflare Pages project $PROJECT_NAME..."
  CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID" npx wrangler@4 pages deploy "$RELEASE_PUBLISH_DIR" --project-name "$PROJECT_NAME" --branch main
fi

echo "Cleaning older releases, tags and workflow runs..."
./cleanup_old_releases.sh --keep "$TAG" --keep-runs "$KEEP_WORKFLOW_RUNS"

echo "Release complete: https://djconnect.pages.dev"
