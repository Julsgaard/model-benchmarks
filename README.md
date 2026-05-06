# Local Model Benchmark Suite

Purpose: compare local models on Kristian's actual use cases, not generic leaderboard scores.

## Benchmark principles

- Same prompt set for every model.
- Same repo snapshot/context for every model.
- Same runtime settings where possible: temperature, max tokens, context size, timeout.
- Same judge model for every run.
- Model outputs are scored blind when possible (`model-a`, `model-b`, etc.) before revealing names.
- Record runtime details: LM Studio / llama.cpp / Ollama, quantization, context size, GPU offload, tokens/sec, first-token latency.

## Fixed metadata per run

```md
Benchmark version:
Date:
Judge model:
Judge temperature:
Test machine:
GPU:
VRAM:
System RAM:
Runtime:
Runtime version:
Model:
Quantization:
Context size:
Temperature:
Max output tokens:
Tokens/sec:
First-token latency:
Peak VRAM:
Notes:
```

## Score scale

Use 1-10 unless otherwise specified.

- 10 = excellent, would trust/use regularly
- 7 = useful with review
- 5 = mediocre / mixed
- 3 = weak, mostly not useful
- 1 = failed or harmful

## Categories

### 1. Coding fix benchmark

Goal: can the model make a real, maintainable code change?

Test ideas:
- Fix a small PrivateTranscribe bug from a frozen repo snapshot.
- Add a small tested utility.
- Refactor a messy function without changing behavior.

Scores:
- Correctness
- Minimality
- Maintainability
- Test awareness
- Regression risk

### 2. Codebase understanding benchmark

Goal: can the model understand a real codebase before touching it?

Prompt example:
> Find how global hotkeys are registered in PrivateTranscribe. Explain the flow from settings UI to main-process registration, including Windows-native fallback behavior. Mention exact files/functions.

Scores:
- File/function accuracy
- Architecture understanding
- Missing-risk detection
- Conciseness

### 3. UI/design benchmark

Goal: can the model create or improve UI in a way Kristian would actually use?

Test modes:

#### A. UI improvement
Give the model an existing screen/component and ask it to improve hierarchy, spacing, copy, and polish.

Scores:
- Visual hierarchy
- Taste / premium feel
- Practical implementation
- Accessibility/responsiveness
- Copy quality
- Not overbuilding

#### B. New landing page
Prompt:
> Create a polished one-page landing page for PrivateTranscribe aimed at developers and privacy-conscious professionals. Use the existing brand: Deep Obsidian background, Topical Mint accent, luxury minimal feel. Include hero, feature proof, pricing, FAQ, and waitlist/download CTA.

Scores:
- Brand fit
- Layout quality
- Conversion clarity
- Component quality
- Responsiveness
- Originality without gimmicks

#### C. Redesign challenge
Give all models the same rough UI screenshot/description and ask for a cleaner version.

Scores:
- Improves the actual problem
- Avoids generic SaaS slop
- Handles edge states
- Looks shippable

### 4. Product/UX thinking benchmark

Goal: can the model generate useful product ideas, not generic filler?

Prompt example:
> Review PrivateTranscribe's onboarding and suggest the 5 highest-impact improvements for first-run success. Prioritize what would reduce drop-off for Windows beta users.

Scores:
- Specificity
- Business/product relevance
- User empathy
- Prioritization quality
- Novel useful ideas

### 5. Agentic/tool-calling benchmark

Goal: can the model behave like an agent in OpenClaw/OpenCode-style work?

This is one of the most important categories.

Test design:
- Run models through a tool-enabled harness when possible.
- Give the model a small repo task that requires reading files, editing, running tests, interpreting failure, and retrying.
- Compare not only final answer, but tool discipline.

Example task:
> In this frozen test repo, find why the unit test is failing, fix it, run the relevant test, and summarize the exact change.

Scores:
- Tool selection: reads/searches before editing
- Planning: does not over-plan or thrash
- File editing accuracy
- Test execution and interpretation
- Recovery from failing test
- Safety: avoids destructive commands
- Completion: produces a clean final state
- Token/tool efficiency

Tool-calling metrics:
- Number of tool calls
- Failed/stale tool calls
- Unnecessary broad reads
- Edit success rate
- Tests run
- Final repo cleanliness
- Time to completion

### 6. Backend/API benchmark

Goal: can the model do backend work correctly, not just UI/code snippets?

Test ideas:
- Add a small API endpoint with validation, errors, and tests.
- Fix a database/query bug.
- Implement idempotent webhook handling.
- Add rate limiting or auth guardrails.
- Refactor service logic without changing external behavior.

Example task:
> In this frozen backend repo, implement idempotent Stripe webhook handling for `checkout.session.completed`. Add tests for duplicate delivery, missing metadata, and invalid event type. Keep the public API unchanged.

Scores:
- Data-model understanding
- API correctness
- Security/auth awareness
- Error handling
- Idempotency/concurrency handling
- Test quality
- Minimality/maintainability

### 7. Hard-problem benchmark

Goal: can the model reason through non-obvious bugs or architecture tradeoffs?

Test ideas:
- Race condition with flaky test.
- State synchronization bug across renderer/main/backend.
- Performance regression with profiling clues.
- Migration plan with backward compatibility constraints.
- Security review where the model must find subtle issues.

Example task:
> A flaky test sometimes fails because two async startup paths race. Diagnose the root cause, fix it without adding arbitrary sleeps, and explain why the fix is deterministic.

Scores:
- Root-cause analysis
- Avoids superficial patching
- Handles concurrency/state carefully
- Uses evidence from tests/logs
- Maintains compatibility
- Explains tradeoffs clearly

### 8. Long-context benchmark

Goal: can the model use a large amount of project context without hallucinating?

Prompt example:
> Given these docs and source excerpts, identify stale claims and update the release checklist. Do not invent completed work.

Scores:
- Recall from supplied context
- Contradiction handling
- Hallucination avoidance
- Useful synthesis

## Isolation: how to test multiple models fairly

The benchmark must prevent models from seeing each other's solutions.

Recommended setup:

```txt
local-model-benchmarks/
  cases/
    backend-idempotent-webhook/
      prompt.md
      seed-repo/              # pristine starting repo or fixture
      hidden-tests/           # tests only the harness/judge can run
      rubric.md
    ui-landing-page/
      prompt.md
      assets/
      rubric.md
  runs/
    2026-xx-xx-rtx3090/
      model-a/
        output/
        transcript.jsonl
        metrics.json
      model-b/
        output/
        transcript.jsonl
        metrics.json
      mapping.json            # hidden until after judging
  judge/
    score-template.md
    scores/
```

Fair-run rules:

1. Start each model from a fresh copy of the same `seed-repo`.
2. Put each run in a separate directory or git worktree.
3. Do not include previous model outputs in the next model's context.
4. Use anonymous labels (`model-a`, `model-b`) during judging.
5. Reveal the model mapping only after scores are written.
6. Keep hidden tests separate from the prompt so models cannot overfit to them.
7. Record exact runtime settings: temperature, context, quantization, server/backend, GPU layers, prompt template.
8. Commit or archive the seed state so future runs are reproducible.

Practical execution options:

- **Manual first version:** Kristian runs model outputs through LM Studio/llama.cpp/OpenCode, saves results into `runs/.../model-a`, then Atlas judges blind.
- **Harness version:** script creates fresh worktrees, sends the same prompt to each OpenAI-compatible endpoint, captures output/tool transcript, runs tests, and produces score templates.
- **Agentic version:** each model is given tool access in an isolated sandbox/worktree. The harness captures every tool call and final repo diff.

For tool-calling tests, the important output is not only the final diff. Capture:

- tool calls made
- failed commands
- files read before editing
- files edited
- tests run
- final diff
- final test result
- time to completion
- token usage if available

## Overall model score

Weighted suggestion:

- Agentic/tool-calling: 25%
- Coding fix: 15%
- Backend/API: 15%
- UI/design: 15%
- Hard-problem reasoning: 15%
- Codebase understanding: 10%
- Speed/usability: 5%

Overall verdict:

```md
Daily driver? yes/no
Good for coding? yes/no
Good for UI? yes/no
Good for OpenClaw/agentic work? yes/no
Best runtime tested:
Best quant tested:
Main weakness:
```

## Notes

For UI and agentic performance, generic benchmarks are not enough. The key question is: can this model help Kristian ship PrivateTranscribe/NordicFuture-quality work with minimal babysitting?
