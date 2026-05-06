#!/usr/bin/env bash
set -euo pipefail

CASE="${1:-}"
WORKTREE="${2:-}"

if [[ -z "$CASE" || -z "$WORKTREE" ]]; then
  echo "Usage: scripts/run-case-tests.sh <case-name> <worktree-path>" >&2
  exit 1
fi

if [[ ! -d "$WORKTREE" ]]; then
  echo "Worktree not found: $WORKTREE" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$WORKTREE"

if [[ -f package.json ]]; then
  npm test
else
  echo "No automated tests for this case yet. Use manual rubric."
fi

HIDDEN="$ROOT/cases/$CASE/hidden-tests"
if [[ -d "$HIDDEN" ]] && find "$HIDDEN" -type f ! -name '.gitkeep' | grep -q .; then
  TMP_DIR="$(mktemp -d)"
  cp -R . "$TMP_DIR/worktree"
  cp "$HIDDEN"/* "$TMP_DIR/worktree/test/"
  cd "$TMP_DIR/worktree"
  npm test
fi
