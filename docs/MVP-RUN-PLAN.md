# MVP Run Plan

This benchmark suite is designed for incremental runs. You do **not** need to test every model in one sitting.

## What is missing before the first real test?

### Required for MVP

- [ ] Pick the first 2-3 benchmark cases to make concrete.
- [ ] Add seed repos/fixtures for those cases.
- [ ] Add visible tests and hidden tests where relevant.
- [ ] Add a simple run record format (`runs/<date>/<model-id>/metrics.json`).
- [ ] Decide the fixed judge model for the first benchmark version.
- [ ] Decide the first model list: local models, cloud models, or both.
- [ ] Add a `benchmark-version` label so later runs stay comparable.

### Nice but not required for MVP

- [ ] Automated harness that calls OpenAI-compatible endpoints.
- [ ] Automatic token/sec capture from LM Studio / llama.cpp / Ollama.
- [ ] Tool-call transcript parser for OpenCode/OpenClaw-style runs.
- [ ] HTML dashboard/leaderboard.

## Can runs happen across multiple days?

Yes. That is the preferred workflow.

The key is to freeze:

- benchmark case version
- seed repo commit/archive
- prompt text
- judge model
- judge rubric
- runtime settings where possible

Then a run from Wednesday and a run from Friday can be compared, as long as they both say:

```md
Benchmark version: 0.1.0
Case version: backend-idempotent-webhook@0.1.0
Judge model: <fixed judge model>
Rubric version: 0.1.0
```

If we change a prompt, hidden test, rubric, or judge model, that becomes a new benchmark version.

## Cloud models with OpenCode

Cloud models should be included. They are useful as baselines.

Recommended baseline groups:

### Local runtimes

- LM Studio local server
- llama.cpp / llama-server
- Ollama, if Kristian wants a known baseline

### Cloud/OpenCode baselines

- OpenCode Go / Kimi K2.6
- OpenRouter/Kimi or Minimax, if available
- Claude/Sonnet when auth works
- Codex as reviewer/fallback baseline

Cloud models must use the same case prompt and seed repo. For OpenCode agentic tests, capture:

- model/provider
- OpenCode version
- command/prompt used
- tool transcript if available
- final diff
- tests run
- elapsed time
- cost if available

## Recommended first MVP cases

Start with three cases only:

1. **UI landing page**
   - Fast to run.
   - Easy for Kristian to visually judge.
   - Good at exposing generic SaaS slop.

2. **Backend idempotent webhook**
   - Tests real backend correctness.
   - Good hidden-test target.
   - Useful for PrivateTranscribe/NordicFuture-style work.

3. **Agentic tool-calling bugfix**
   - Most important for OpenClaw/OpenCode usefulness.
   - Requires fresh repo copy per model.
   - Scores tool discipline, not just final code.

After those work, add hard-problem and long-context cases.

## How to avoid models seeing each other's solutions

For every model:

1. Create a fresh worktree/copy from the seed repo.
2. Run only that model in that copy.
3. Save output under anonymous ID (`model-a`, `model-b`, etc.).
4. Do not paste previous model outputs into later model contexts.
5. Judge anonymous outputs first.
6. Reveal model names after scores are written.

## Suggested run folder

```txt
runs/
  2026-05-xx-benchmark-v0.1.0/
    manifest.json
    model-a/
      metrics.json
      transcript.jsonl
      final.diff
      test-output.txt
      judge-score.md
    model-b/
      metrics.json
      transcript.jsonl
      final.diff
      test-output.txt
      judge-score.md
    mapping.hidden.json
```

`mapping.hidden.json` should not be opened until scoring is finished.

## First run recommendation

Do not start by testing 15 models. Start with 3-5:

- one fast local small/medium model
- one larger local 24GB-VRAM model
- one OpenCode cloud cheap model
- one strong cloud reference model
- optionally Ollama baseline

This gives enough signal without turning benchmarking into a hobby swamp.
