# Benchmark Results

Current benchmark version: `0.1.0`

Generated raw run artifacts live locally under `runs/<run-id>/<model-label>/<case>/` and are intentionally git-ignored because transcripts/diffs can get noisy. Each run folder usually contains:

- `metrics.json` — model/runtime metadata and elapsed time
- `test-output.txt` — visible + hidden test output when applicable
- `final.diff` — final code diff produced by the model
- `transcript.md` — OpenCode transcript/log
- `worktree/` — isolated generated repo used for the run

## Leaderboard snapshot — 2026-05-06

| Model | Runtime | Coding fix | Backend webhook | Notes |
|---|---|---:|---:|---|
| GLM 5.1 | `opencode-go/glm-5.1` | ✅ 3/3, 25s | ✅ 5/5, 60s | Fastest + cleanest so far; no test edits. |
| Kimi K2.6 | `opencode-go/kimi-k2.6` | ✅ 3/3, 297s | ⚠️ 4/5, 343s | Clean backend rerun failed one hidden wording check. |
| Kimi K2.6 invalid backend run | `opencode-go/kimi-k2.6` | — | ❌ invalid | Edited tests; kept as a guardrail lesson, not a score. |

## Raw local run folders

### GLM 5.1

- Coding fix: `runs/2026-05-06-glm-5.1-v0.1.0/glm-coding/coding-fix/`
- Backend webhook: `runs/2026-05-06-glm-5.1-v0.1.0/glm-backend/backend-idempotent-webhook/`

### Kimi K2.6

- Coding fix: `runs/2026-05-06-kimi-v0.1.0/kimi-coding/coding-fix/`
- Backend invalid/test-edit run: `runs/2026-05-06-kimi-v0.1.0/kimi-backend/backend-idempotent-webhook/`
- Backend clean run: `runs/2026-05-06-kimi-v0.1.2/kimi-backend-clean2/backend-idempotent-webhook/`

## Current scoring status

This is still a manual MVP scoreboard, not the final judge-scored leaderboard.

Next upgrades:

1. Add a tracked `results/` export with compact JSON summaries.
2. Add a score script that converts tests + rubric into a consistent score.
3. Pick a fixed judge model for UI/design and non-testable quality scoring.
