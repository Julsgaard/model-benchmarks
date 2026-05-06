#!/usr/bin/env bash
set -euo pipefail

CASE="${1:-}"
MODEL_ID="${2:-model-a}"
RUN_ID="${3:-$(date +%Y-%m-%d-benchmark-v0.1.0)}"

if [[ -z "$CASE" ]]; then
  echo "Usage: scripts/prepare-run.sh <case-name> [model-id] [run-id]" >&2
  exit 1
fi

SEED="cases/$CASE/seed-repo"
if [[ ! -d "$SEED" ]]; then
  echo "No seed repo found at $SEED" >&2
  exit 1
fi

DEST="runs/$RUN_ID/$MODEL_ID/$CASE/worktree"
mkdir -p "$(dirname "$DEST")"
rm -rf "$DEST"
cp -R "$SEED" "$DEST"

cat > "runs/$RUN_ID/$MODEL_ID/$CASE/metrics.json" <<JSON
{
  "benchmarkVersion": "0.1.0",
  "case": "$CASE",
  "modelId": "$MODEL_ID",
  "runId": "$RUN_ID",
  "runtime": "",
  "runtimeVersion": "",
  "model": "",
  "quantization": "",
  "contextSize": "",
  "temperature": "",
  "maxOutputTokens": "",
  "tokensPerSecond": null,
  "firstTokenLatencyMs": null,
  "peakVramMb": null,
  "elapsedSeconds": null,
  "notes": ""
}
JSON

cat > "runs/$RUN_ID/$MODEL_ID/$CASE/README.md" <<MD
# Run: $RUN_ID / $MODEL_ID / $CASE

## Prompt

Use: \`cases/$CASE/prompt.md\`

## Worktree

\`runs/$RUN_ID/$MODEL_ID/$CASE/worktree\`

## After model run

From the worktree, run:

\`../../../../../scripts/run-case-tests.sh $CASE $(pwd)/runs/$RUN_ID/$MODEL_ID/$CASE/worktree\`

Then save:

- final diff to \`final.diff\`
- test output to \`test-output.txt\`
- transcript/tool log to \`transcript.jsonl\` or \`transcript.md\`
- judge score to \`judge-score.md\`
MD

echo "$DEST"
