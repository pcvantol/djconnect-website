#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="djconnect"
PUBLISH_DIR="wwwroot"
BRANCH="$(git branch --show-current)"

if [[ "$BRANCH" != "main" ]]; then
  echo "Release must be run from main. Current branch: $BRANCH"
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has uncommitted changes. Commit or stash them before release."
  git status --short
  exit 1
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "CLOUDFLARE_API_TOKEN is required for deployment."
  exit 1
fi

echo "Running static checks..."
test -f "$PUBLISH_DIR/index.html"
test -f "$PUBLISH_DIR/assets/djconnect/site.webmanifest"

echo "Deploying $PUBLISH_DIR to Cloudflare Pages project $PROJECT_NAME..."
npx wrangler pages deploy "$PUBLISH_DIR" --project-name "$PROJECT_NAME" --branch main

echo "Release complete: https://djconnect.pages.dev"

