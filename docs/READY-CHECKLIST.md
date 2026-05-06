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
- judge score template
- MVP run plan

## Still missing for high-quality benchmark v0.1.0

These are not blockers for a first run, but should be improved before trusting a leaderboard:

- [ ] Add hidden tests for `coding-fix`.
- [ ] Add hidden tests for `hard-problem`.
- [ ] Add screenshot/reference assets for UI scoring.
- [ ] Add an automated diff/metrics summarizer.
- [ ] Decide fixed judge model.
- [ ] Decide first model list.
- [ ] Run one smoke benchmark with a cheap cloud model to validate the workflow.

## What Kristian needs to decide

1. **Judge model**: which model should Atlas use as the fixed scorer?
   - Recommended default: current Atlas main model for v0.1.0, recorded in every score.
   - Better but more expensive: one strong fixed model like Sonnet when auth works.

2. **First models to test**:
   - Recommended: one OpenCode cloud cheap model first, then RTX 3090 local models when available.

3. **Whether OpenCode can auto-approve edits during benchmark runs**:
   - Manual approval is safer.
   - `OPENCODE_AUTO_APPROVE=1` is faster but should only be used inside benchmark seed repos.
