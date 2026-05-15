# Benchmark Results

Current benchmark version: `0.1.0`

Generated raw run artifacts live locally under `runs/<run-id>/<model-label>/<case>/` and are intentionally git-ignored because transcripts/diffs can get noisy. Each run folder usually contains:

- `metrics.json` — model/runtime metadata and elapsed time
- `test-output.txt` — visible + hidden test output when applicable
- `final.diff` — final code diff produced by the model
- `transcript.md` — OpenCode transcript/log
- `judge-score.json` — judge scoring artifact (when scored)
- `worktree/` — isolated generated repo used for the run

## Leaderboard — 2026-05-09 (all models, judged)

Fixed judge: `openai-codex/gpt-5.5` via Codex sub-agent, v0.1 judge rubric.

### Overall Rank

| Rank | Model | Runtime | Avg Judge Score | Screen | Cases | Avg Time |
|---:|---|---|---:|---:|:---|---:|
| 1 | GPT-5.4-mini | OpenAI Codex | **8.58** | 6/6 | 6 | — |
| 2 | openai-codex/gpt-5.5 | codex-subagent | **8.28** | 5/6 | 6 | — |
| 3 | kimi-k2.6 | opencode-go | **8.05** | 5/6 | 6 | 256s |
| 4 | deepseek-v4-pro | opencode-go | **7.93** | 5/6 | 6 | 192s |
| 5 | glm-5.1 | opencode-go | **7.85** | 5/6 | 6 | 110s |
| 6 | qwen3.6-plus | opencode-go | **7.77** | 5/6 | 6 | 82s |
| 7 | deepseek-v4-flash | opencode-go | **7.72** | 5/6 | 6 | 115s |
| 8 | mimo-v2.5-pro | opencode-go | **7.67** | 5/6 | 6 | 92s |

| 9 | minimax-m2.7 | opencode-go | **6.75** | 5/6 | 6 | 272s |
| 10 | openai-codex/gpt-5.3-codex | codex-subagent | **6.83** | 5/6 | 6 | — |

### Per-Case Scores — Premium Codex Models

| Case | GPT-5.4-mini | GPT-5.5 | GPT-5.3-Codex |
|---|---:|---:|---:|
| backend-idempotent-webhook | 9.0 | 5.8 | 6.0 |
| backend-rate-limit-auth | 8.0 | 9.5 | 9.0 |
| coding-fix | 9.0 | 9.4 | 9.0 |
| hard-problem | 8.5 | 9.3 | 9.0 |
| ui-landing-page | 8.0 | 9.1 | 1.0 |
| agentic-settings-sync | 9.0 | 7.5 | 7.0 |
| **Average** | **8.58** | **8.28** | **6.83** |

### Per-Case Scores — OpenCode-Go Models

| Case | dsv4-pro | glm-5.1 | qwen36 | dsv4-flash | mimo-v25 | kimi-k2.6 | mm-m27 |
|---|---:|---:|---:|---:|---:|---:|---:|
| backend-idempotent-webhook | 7.0 | 6.8 | 6.1 | 5.8 | 6.0 | 7.6 | 7.0 |
| backend-rate-limit-auth | 8.8 | 9.1 | 9.0 | 8.7 | 9.0 | 8.8 | 8.8 |
| coding-fix | 8.3 | 7.4 | 8.7 | 8.2 | 7.0 | 8.0 | 7.4 |
| hard-problem | 9.0 | 8.8 | 8.8 | 8.9 | 9.0 | 9.0 | 8.6 |
| ui-landing-page | 8.0 | 8.0 | 7.1 | 7.5 | 8.0 | 8.1 | 1.6 |
| agentic-settings-sync | 6.5 | 7.0 | 6.9 | 7.2 | 7.0 | 6.8 | 7.1 |
| **Average** | **7.93** | **7.85** | **7.77** | **7.72** | **7.67** | **8.05** | **6.75** |

## Routing Recommendation

### Daily Driver: GPT-5.4-mini (Codex runtime)
- **Strongest overall score** (8.58) with consistent 8-9 across all 6 cases.
- Best value: faster than GPT-5.5 sessions for the same Codex infrastructure, and scores higher.
- Exceptionally strong on backend-idempotent-webhook (9.0 vs GPT-5.5's 5.8) and agentic-settings-sync (9.0 vs GPT-5.5's 7.5).
- **Recommend** as default coding route for PrivateTranscribe work.

### Premium Power: GPT-5.5 (codex-subagent)
- Edges ahead on hard-problem (9.3), coding-fix (9.4), rate-limit-auth (9.5), and UI (9.1).
- Useful when a task is coding-heavy, complex, or needs the strongest individual fix quality.
- **Recommend** for complex hard-problem-style async bugs, comprehensive UI work, and rate-limit auth.

### Backup: deepseek-v4-pro
- Solid middle-of-pack at 7.93 with strong hard-problem (9.0) and rate-limit (8.8).
- Available at OpenCode-Go pricing.

### Not Recommended: GPT-5.3-Codex
- Scored 6.83 — dragged down by backend-idempotent-webhook (6.0) and a no-submission on UI (1.0).
- No advantage over GPT-5.4-mini or GPT-5.5.

### Blocked: Claude Sonnet 4.6
- OpenCode Zen billing insufficient balance. Worth revisiting if Zen credits are restored.

## Dashboard

The Atlas Dashboard (`/api/benchmarks`) auto-discovers run folders and `judge-score.json` artifacts. Accessible at:

```
http://localhost:18790/benchmarks
```

The dashboard shows sortable model scores, per-case breakdowns, test pass/fail counts, and UI previews for landing page runs.

---

## Run details

### Premium batch — 2026-05-09 (v0.1.0)

Run folder: `runs/2026-05-09-premium-v0.1.0/`

Models tested:
- `codex-gpt-55` — `openai-codex/gpt-5.5` via codex-subagent
- `codex-gpt-53-codex` — `openai-codex/gpt-5.3-codex` via codex-subagent
- `codex-gpt-54-mini` — GPT-5.4-mini via OpenAI Codex

All cases: backend-idempotent-webhook, backend-rate-limit-auth, coding-fix, hard-problem, ui-landing-page, agentic-settings-sync
All judged: ✅ 18/18 judge-score.json created and visible in dashboard.

### Clean batch — 2026-05-07 (v0.1.0)

Run folder: `runs/2026-05-07-clean-v0.1.0/`

Models tested: glm-5.1, kimi-k2.6, deepseek-v4-flash, deepseek-v4-pro, mimo-v2.5-pro, minimax-m2.7, qwen3.6-plus
All judged: ✅

### Smoke/preview runs

- `runs/2026-05-07-preview-smoke/` — Dashboard UI preview fixture.
- `runs/2026-05-06-glm-5.1-v0.1.0/` — Initial GLM 5.1 coding/backend runs (pre-judge).
- `runs/2026-05-06-kimi-v0.1.0/` — Initial Kimi K2.6 coding/backend runs (pre-judge, includes invalid+test-edit run).
- `runs/2026-05-06-kimi-v0.1.1/` — Kimi K2.6 clean backend rerun (pre-judge).
- `runs/2026-05-06-kimi-v0.1.2/` — Kimi K2.6 final clean backend rerun (pre-judge).

## Judge scoring

Fixed judge model: `openai-codex/gpt-5.5` via Codex sub-agent.

Current automated test status is shown immediately. Judge-scored runs add `judge-score.json` to the run folder using `judge/score-prompt.md` and `judge/config.json`.

Prepare a judge bundle with:

```bash
scripts/prepare-judge-input.sh runs/<run-id>/<model-label>/<case>
```

Then run a Codex sub-agent with `openai-codex/gpt-5.5` against the generated `judge-input.md` and write `judge-score.json` back to that run folder.

Next upgrades:

1. Add a tracked `results/` export with compact JSON summaries.
2. Add screenshot/reference assets for UI scoring.
3. Re-test blocked Sonnet route if Zen credits resume.
4. Consider bumping to v0.2 with refined hidden test suites.
