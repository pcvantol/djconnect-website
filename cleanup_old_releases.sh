#!/usr/bin/env bash
set -euo pipefail

KEEP_TAG="v$(tr -d '[:space:]' < VERSION)"
DRY_RUN="false"

usage() {
  cat <<USAGE
Usage: ./cleanup_old_releases.sh [--dry-run] [--keep vX.Y.Z]

Deletes older GitHub Releases and matching local/remote git tags, keeping the
current VERSION tag by default.

Options:
  --dry-run       Show what would be deleted without deleting anything.
  --keep TAG      Tag to keep. Defaults to ${KEEP_TAG}.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN="true"
      shift
      ;;
    --keep)
      KEEP_TAG="${2:-}"
      if [[ -z "$KEEP_TAG" ]]; then
        echo "--keep requires a tag value, for example v3.1.1"
        exit 1
      fi
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$KEEP_TAG" ]]; then
  echo "No keep tag configured."
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI 'gh' is required."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has uncommitted changes. Commit or stash them before cleanup."
  git status --short
  exit 1
fi

echo "Keeping release/tag: ${KEEP_TAG}"

mapfile -t RELEASE_TAGS < <(gh release list --limit 100 --json tagName --jq '.[].tagName')

if [[ ${#RELEASE_TAGS[@]} -eq 0 ]]; then
  echo "No GitHub releases found."
  exit 0
fi

DELETED="false"
for TAG in "${RELEASE_TAGS[@]}"; do
  if [[ "$TAG" == "$KEEP_TAG" ]]; then
    echo "Keeping ${TAG}"
    continue
  fi

  DELETED="true"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would delete release and tag ${TAG}"
    continue
  fi

  echo "Deleting GitHub release ${TAG}"
  gh release delete "$TAG" --yes

  if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "Deleting local tag ${TAG}"
    git tag -d "$TAG"
  fi

  if git ls-remote --tags origin "$TAG" | grep -q "$TAG"; then
    echo "Deleting remote tag ${TAG}"
    git push origin ":refs/tags/${TAG}"
  fi
done

if [[ "$DELETED" == "false" ]]; then
  echo "No old releases to clean up."
else
  echo "Cleanup complete."
fi
