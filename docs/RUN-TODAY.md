# Run a Benchmark Today

## Option A — Manual local model run

Prepare a clean run directory:

```bash
scripts/prepare-run.sh coding-fix model-a
```

Open the printed `worktree` in LM Studio / llama.cpp workflow, use the prompt from:

```txt
cases/coding-fix/prompt.md
```

After the model edits files, run:

```bash
scripts/run-case-tests.sh coding-fix <printed-worktree-path>
```

Save outputs into the run folder:

- `transcript.md` or `transcript.jsonl`
- `final.diff`
- `test-output.txt`
- update `metrics.json` with model/runtime/tokens/sec

## Option B — OpenCode cloud model run

```bash
scripts/run-opencode-case.sh coding-fix opencode-go/kimi-k2.6 model-a
scripts/run-opencode-case.sh backend-idempotent-webhook opencode-go/kimi-k2.6 model-b
```

Use anonymous model IDs while judging. Reveal model mapping after scores are written.

## First recommended run

Start with:

```bash
scripts/run-opencode-case.sh coding-fix opencode-go/kimi-k2.6 model-a 2026-05-06-benchmark-v0.1.0
scripts/run-opencode-case.sh backend-idempotent-webhook opencode-go/kimi-k2.6 model-b 2026-05-06-benchmark-v0.1.0
```

For UI, run manually first because visual inspection matters:

```bash
scripts/prepare-run.sh ui-landing-page model-c 2026-05-06-benchmark-v0.1.0
```

## Judge scoring

Fixed judge model: `openai-codex/gpt-5.5` via Codex sub-agent.

Prepare a judge bundle for any run with:

```bash
scripts/prepare-judge-input.sh runs/<run-id>/<model-label>/<case>
```

Then ask a Codex sub-agent using `openai-codex/gpt-5.5` to score the generated `judge-input.md` and write `judge-score.json` in the same run folder.

## Notes

- For LM Studio, record tokens/sec from the app/server UI in `metrics.json`.
- For llama.cpp, record prompt eval/generation tok/s from server/CLI logs.
- If a prompt, seed repo, hidden test, judge prompt, judge rubric, or judge model changes, bump benchmark version.
