# Model Benchmark Results

Run: 2026-05-09-premium-v0.1.0  
Judge: GPT-5.5 (Codex subagent)

## Full Leaderboard (6 cases each)

| Rank | Model | Runtime | Avg Score | Notes |
|------|-------|---------|-----------|-------|
| 1 | **GPT-5.4-mini** | OpenAI Codex | **8.58** | Best value. Consistent across all case types. |
| 2 | **GPT-5.5** | OpenAI Codex | **8.28** | Strong on backend/auth, weak on idempotency edge cases. |
| 3 | Kimi K2.6 | OpenRouter | 8.05 | Solid all-rounder, good fallback. |
| 4 | DeepSeek V4 Pro | OpenRouter | 7.93 | Strong reasoning, slower. |
| 5 | GLM-5.1 | OpenRouter | 7.85 | Reliable mid-tier. |
| 6 | Qwen 3.6 | OpenRouter | 7.77 | Decent, nothing standout. |
| 7 | DeepSeek V4 Flash | OpenRouter | 7.72 | Fast but shallow on edge cases. |
| 8 | MIMO V2.5 Pro | OpenRouter | 7.67 | Mediocre, no advantage. |
| 9 | **GPT-5.3-Codex** | OpenAI Codex | **6.83** | Completely bombed UI case (score 1). |
| 10 | MiniMax M2.7 | OpenRouter | 6.75 | Weakest overall. |

## Per-Model Notes

### GPT-5.4-mini (Codex) — 8.58 ⭐ Daily Driver
- **Behavior:** Extremely consistent. No score below 8. Delivered solid fixes across UI, backend, agentic sync, and hard problems.
- **Use for:** Everyday coding tasks, quick fixes, UI work, backend patches. Best quality-per-token ratio.
- **Rubric note:** Scored 9 on agentic-settings-sync, backend-idempotent-webhook, and coding-fix. Even the "hard" race-condition fix got 8.5.

### GPT-5.5 (Codex) — 8.28
- **Behavior:** Polarized. Scored 9.3–9.5 on hard-problem, coding-fix, and backend-rate-limit-auth, but only 5.8 on backend-idempotent-webhook and 7.5 on agentic-settings-sync. Missed hidden mutation-safety and malformed-input edge cases.
- **Use for:** Complex backend logic, auth flows, rate-limiting. Avoid for UI-heavy tasks (8.2, acceptable but not great) and idempotency edge cases.
- **Rubric note:** The 9.5 on backend-rate-limit-auth was the single highest score in the entire benchmark. But the 5.8 on idempotency shows it can miss subtle validation requirements.

### GPT-5.3-Codex — 6.83 ❌ Skip
- **Behavior:** Disastrous on UI (score 1 — no implementation submitted at all). Strong on backend-rate-limit-auth (9) and hard-problem (9), but inconsistent.
- **Use for:** Nothing. GPT-5.4-mini is strictly better at the same price point.
- **Rubric note:** Complete failure on the landing-page case suggests either prompt parsing issues or runtime-level failures on multi-file frontend tasks. Not trustworthy for autonomous work.

### Kimi K2.6 — 8.05
- **Behavior:** Well-rounded with strong hard-problem (9.0) and rate-limit-auth (8.8) scores. Weak on agentic-settings-sync (6.8) and backend-idempotent-webhook (7.6).
- **Use for:** Good fallback when Codex is unavailable. Strong on algorithmic/hard problems and auth flows.
- **Rubric note:** Consistent 8+ on most cases except agentic sync, where it missed subtle state-mutation issues.

### DeepSeek V4 Pro — 7.93
- **Behavior:** Strong reasoning on hard-problem (9.0) and rate-limit-auth (8.8), but weak on agentic-settings-sync (6.5) and backend-idempotent-webhook (7.0).
- **Use for:** Complex backend logic and hard problems when you can wait (192s avg). Skip for UI and settings-sync tasks.
- **Rubric note:** Slowest OpenRouter model but delivers deep reasoning. The 6.5 on agentic-settings-sync was the lowest non-UI score among mid-tier models.

### GLM 5.1 — 7.85
- **Behavior:** Reliable mid-tier. Strong on rate-limit-auth (9.1) and hard-problem (8.8), weak on coding-fix (7.4) and backend-idempotent-webhook (6.8).
- **Use for:** Backend auth and hard problems. Acceptable fallback for general coding.
- **Rubric note:** The 9.1 on rate-limit-auth was the highest among OpenRouter models. Coding-fix weakness suggests it sometimes applies overly broad fixes.

### Qwen 3.6 — 7.77
- **Behavior:** Strong on rate-limit-auth (9.0) and hard-problem (8.8), but weak on backend-idempotent-webhook (6.1) and UI landing page (7.1).
- **Use for:** Backend auth and algorithmic problems. Decent general-purpose fallback.
- **Rubric note:** The 6.1 on idempotent webhook was a notable weakness — missed deduplication logic edge cases.

### DeepSeek V4 Flash — 7.72
- **Behavior:** Fast (115s) with strong hard-problem (8.9) and rate-limit-auth (8.7), but weak on backend-idempotent-webhook (5.8).
- **Use for:** Quick backend fixes and hard problems when speed matters. Skip for idempotency-heavy tasks.
- **Rubric note:** The 5.8 on idempotent webhook was the worst among all models on that case except MiniMax. Trading speed for thoroughness on edge cases.

### MIMO V2.5 Pro — 7.67
- **Behavior:** Strong on rate-limit-auth (9.0) and hard-problem (9.0), but weak on coding-fix (7.0) and backend-idempotent-webhook (6.0).
- **Use for:** Backend auth and hard problems. Not ideal for general coding fixes.
- **Rubric note:** Scored 9+ on two cases but 7 or below on the rest. Polarized like GPT-5.5 but without the highs.

### MiniMax M2.7 — 6.75 ❌ Skip
- **Behavior:** Weakest overall. Disastrous on UI landing page (1.6). Only strong point is rate-limit-auth (8.8).
- **Use for:** Nothing. Even its "strong" case is matched by every other model.
- **Rubric note:** The 1.6 on UI was barely better than GPT-5.3-Codex's complete no-submission. Not viable for autonomous coding.

## Routing Recommendation

- **Default / daily driver:** GPT-5.4-mini (Codex) — 8.58 avg, never below 8.
- **Premium complex tasks:** GPT-5.5 — use only when you need peak backend/auth performance and can accept occasional edge-case misses.
- **OpenRouter fallback:** Kimi K2.6 (8.05) or DeepSeek V4 Pro (7.93).
- **Blocked:** Claude Sonnet 4.6 via OpenCode Zen (insufficient balance).
- **Skip:** GPT-5.3-Codex and MiniMax M2.7.
