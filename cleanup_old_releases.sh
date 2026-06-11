#!/usr/bin/env bash
set -euo pipefail

KEEP_TAG="v$(tr -d '[:space:]' < VERSION)"
DRY_RUN="false"
KEEP_RUNS="10"
SKIP_RUNS="false"

usage() {
  cat <<USAGE
Usage: ./cleanup_old_releases.sh [--dry-run] [--keep vX.Y.Z] [--keep-runs N] [--skip-runs]

Deletes older GitHub Releases, matching local/remote git tags and older GitHub
Actions workflow runs, keeping the current VERSION tag by default.

Options:
  --dry-run       Show what would be deleted without deleting anything.
  --keep TAG      Tag to keep. Defaults to ${KEEP_TAG}.
  --keep-runs N   Number of newest workflow runs to keep. Defaults to ${KEEP_RUNS}.
  --skip-runs     Do not delete GitHub Actions workflow runs.
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
    --keep-runs)
      KEEP_RUNS="${2:-}"
      if ! [[ "$KEEP_RUNS" =~ ^[0-9]+$ ]]; then
        echo "--keep-runs requires a non-negative integer."
        exit 1
      fi
      shift 2
      ;;
    --skip-runs)
      SKIP_RUNS="true"
      shift
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

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo "Working tree has uncommitted tracked changes. Commit or stash them before cleanup."
  git status --short
  exit 1
fi

echo "Keeping release/tag: ${KEEP_TAG}"

mapfile -t RELEASE_TAGS < <(gh release list --limit 100 --json tagName --jq '.[].tagName')

if [[ ${#RELEASE_TAGS[@]} -eq 0 ]]; then
  echo "No GitHub releases found."
else
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
    echo "Release/tag cleanup complete."
  fi
fi

if [[ "$SKIP_RUNS" == "true" ]]; then
  echo "Skipped workflow run cleanup."
  exit 0
fi

echo "Keeping newest ${KEEP_RUNS} GitHub Actions workflow runs."

mapfile -t RUN_IDS < <(gh run list --limit 100 --json databaseId --jq '.[].databaseId')

if [[ ${#RUN_IDS[@]} -le KEEP_RUNS ]]; then
  echo "No old workflow runs to clean up."
  exit 0
fi

RUN_DELETED="false"
for INDEX in "${!RUN_IDS[@]}"; do
  if (( INDEX < KEEP_RUNS )); then
    echo "Keeping workflow run ${RUN_IDS[$INDEX]}"
    continue
  fi

  RUN_DELETED="true"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would delete workflow run ${RUN_IDS[$INDEX]}"
    continue
  fi

  echo "Deleting workflow run ${RUN_IDS[$INDEX]}"
  gh run delete "${RUN_IDS[$INDEX]}"
done

if [[ "$RUN_DELETED" == "false" ]]; then
  echo "No old workflow runs to clean up."
else
  echo "Workflow run cleanup complete."
fi
