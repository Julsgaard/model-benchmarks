#!/usr/bin/env bash
set -euo pipefail

CASE="${1:-}"
MODEL="${2:-}"
MODEL_ID="${3:-model-a}"
RUN_ID="${4:-$(date +%Y-%m-%d-benchmark-v0.1.0)}"

if [[ -z "$CASE" || -z "$MODEL" ]]; then
  echo "Usage: scripts/run-opencode-case.sh <case-name> <model> [model-id] [run-id]" >&2
  echo "Example: scripts/run-opencode-case.sh coding-fix opencode-go/kimi-k2.6 model-a" >&2
  exit 1
fi

WORKTREE="$(scripts/prepare-run.sh "$CASE" "$MODEL_ID" "$RUN_ID")"
OUT_DIR="$(dirname "$WORKTREE")"
PROMPT_FILE="cases/$CASE/prompt.md"

{
  echo "# Prompt"
  cat "$PROMPT_FILE"
  echo
  echo "# Working directory"
  echo "$WORKTREE"
  echo
  echo "You may edit files in the working directory. Run the relevant tests. Finish with a concise summary."
} > "$OUT_DIR/full-prompt.md"

START=$(date +%s)
(
  cd "$WORKTREE"
  PROMPT="$(cat "$OLDPWD/$OUT_DIR/full-prompt.md")"
  EXTRA_ARGS=()
  if [[ "${OPENCODE_AUTO_APPROVE:-0}" == "1" ]]; then
    EXTRA_ARGS+=(--dangerously-skip-permissions)
  fi
  opencode run -m "$MODEL" --format json "${EXTRA_ARGS[@]}" "$PROMPT"
) | tee "$OUT_DIR/transcript.md"
END=$(date +%s)

git -C "$WORKTREE" diff > "$OUT_DIR/final.diff" || true
scripts/run-case-tests.sh "$CASE" "$WORKTREE" 2>&1 | tee "$OUT_DIR/test-output.txt" || true

python3 - <<PY
import json, pathlib
p=pathlib.Path('$OUT_DIR/metrics.json')
data=json.loads(p.read_text())
data['runtime']='opencode'
data['model']='$MODEL'
data['elapsedSeconds']=$END-$START
p.write_text(json.dumps(data, indent=2)+"\n")
PY

echo "Run saved to $OUT_DIR"
