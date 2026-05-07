#!/usr/bin/env bash
set -euo pipefail

CASE="ui-landing-page"
MODEL_ID="preview-smoke"
RUN_ID="${1:-$(date +%Y-%m-%d-preview-smoke)}"
WORKTREE="$(scripts/prepare-run.sh "$CASE" "$MODEL_ID" "$RUN_ID")"
OUT_DIR="$(dirname "$WORKTREE")"
cp cases/$CASE/seed-repo/index.html "$WORKTREE/index.html"
cp cases/$CASE/seed-repo/styles.css "$WORKTREE/styles.css"
cat > "$OUT_DIR/final.diff" <<'DIFF'
DIFF
cat > "$OUT_DIR/test-output.txt" <<'TXT'
No automated tests for this case yet. Use manual rubric.
TXT
python3 - <<PY
import json, pathlib
p = pathlib.Path('$OUT_DIR/metrics.json')
data = json.loads(p.read_text())
data.update({
  'runtime': 'manual-smoke',
  'model': 'preview-smoke',
  'elapsedSeconds': 0,
  'notes': 'Dashboard preview smoke fixture; not a model score.'
})
p.write_text(json.dumps(data, indent=2) + '\n')
PY
echo "$OUT_DIR"
