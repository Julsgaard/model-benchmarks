#!/usr/bin/env bash
set -euo pipefail

RUN_DIR=${1:-}
if [[ -z "$RUN_DIR" || ! -d "$RUN_DIR" ]]; then
  echo "Usage: scripts/prepare-judge-input.sh <run-dir>" >&2
  exit 1
fi

CONFIG="judge/config.json"
if [[ ! -f "$CONFIG" ]]; then
  echo "Missing $CONFIG" >&2
  exit 1
fi

METRICS="$RUN_DIR/metrics.json"
if [[ ! -f "$METRICS" ]]; then
  echo "Missing $METRICS" >&2
  exit 1
fi

CASE=$(node -e "const m=require('./$METRICS'); console.log(m.case || '')")
OUT="$RUN_DIR/judge-input.md"

{
  echo "# Judge Input Bundle"
  echo
  echo "## Judge config"
  echo '```json'
  cat "$CONFIG"
  echo '```'
  echo
  echo "## Case prompt"
  if [[ -n "$CASE" && -f "cases/$CASE/prompt.md" ]]; then
    cat "cases/$CASE/prompt.md"
  else
    echo "Missing case prompt for: $CASE"
  fi
  if [[ -n "$CASE" && -f "cases/$CASE/rubric.md" ]]; then
    echo
    echo "## Case rubric"
    cat "cases/$CASE/rubric.md"
  fi
  echo
  echo "## Metrics"
  echo '```json'
  cat "$METRICS"
  echo '```'
  echo
  echo "## Test output"
  echo '```text'
  if [[ -f "$RUN_DIR/test-output.txt" ]]; then tail -200 "$RUN_DIR/test-output.txt"; else echo "No test-output.txt"; fi
  echo '```'
  echo
  echo "## Final diff"
  echo '```diff'
  if [[ -f "$RUN_DIR/final.diff" ]]; then cat "$RUN_DIR/final.diff"; else echo "No final.diff"; fi
  echo '```'
  echo
  echo "## Transcript excerpt"
  echo '```text'
  if [[ -f "$RUN_DIR/transcript.md" ]]; then tail -240 "$RUN_DIR/transcript.md"; else echo "No transcript.md"; fi
  echo '```'
  echo
  echo "## Instructions"
  cat judge/score-prompt.md
} > "$OUT"

echo "$OUT"
