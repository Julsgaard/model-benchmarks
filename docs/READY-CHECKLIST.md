# Ready Checklist

## Current status

The repo is ready for **MVP/manual benchmark runs** once a model/runtime is available.

Implemented:

- concrete prompt files
- seed repos for coding, backend, hard-problem, UI, and agentic cases
- visible failing tests for code/backend/hard-problem cases
- hidden backend tests
- run directory preparation script
- test runner script
- OpenCode runner script
- fixed judge config (`openai-codex/gpt-5.5` via Codex sub-agent)
- judge score template and judge input bundle script
- MVP run plan

## Still missing for high-quality benchmark v0.1.0

These are not blockers for a first run, but should be improved before trusting a leaderboard:

- [ ] Add hidden tests for `coding-fix`.
- [x] Add hidden tests for `hard-problem`.
- [x] Add dashboard HTML preview path for UI scoring.
- [ ] Add screenshot/reference assets for UI scoring.
- [ ] Add an automated diff/metrics summarizer.
- [x] Decide fixed judge model: `openai-codex/gpt-5.5` via Codex sub-agent.
- [ ] Decide first model list.
- [x] Run initial Kimi/GLM smoke benchmarks for coding/backend.
- [ ] Run UI preview smoke fixture and a real UI model run.

## What Kristian needs to decide

1. **First models to test**:
   - Recommended: one OpenCode cloud cheap model first, then RTX 3090 local models when available.

2. **Whether OpenCode can auto-approve edits during benchmark runs**:
   - Manual approval is safer.
   - `OPENCODE_AUTO_APPROVE=1` is faster but should only be used inside benchmark seed repos.


## Case usefulness review (2026-05-07)

Current useful cases:

- `coding-fix`: small PrivateTranscribe-shaped bugfix. Good sanity check, but too small to choose a daily driver alone.
- `backend-idempotent-webhook`: useful backend correctness/idempotency case with hidden missing-field tests. Keep.
- `backend-rate-limit-auth`: added to test auth, validation, per-user rate limiting, and hidden edge cases. This is closer to NordicFuture/PrivateTranscribe API guard work.
- `hard-problem`: async race/determinism case. Hidden tests added so sleep/superficial fixes are less likely to pass.
- `agentic-settings-sync`: added to replace the weak duplicate agentic hotkey case. Tests whether an agent can diagnose a real Electron/settings noise pattern and preserve legitimate updates.
- `ui-landing-page`: useful only with visual preview/manual rubric; Atlas Dashboard now has a preview route for runs with `worktree/index.html`.

Weak/redundant case:

- `agentic-tool-calling`: currently duplicates `coding-fix` and should not be used for serious leaderboard decisions until replaced or removed. Prefer `agentic-settings-sync`.
