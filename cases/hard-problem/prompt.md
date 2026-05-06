# Hard Problem Benchmark: Race Condition

A flaky test sometimes fails because two async startup paths race. Diagnose the root cause, fix it without arbitrary sleeps, and explain why the fix is deterministic.

Rules:
- Do not paper over the issue with timeouts/sleeps.
- Use tests/logs/source evidence.
- Preserve public behavior.
- Add or update a regression test if possible.

Scoring focuses on root-cause analysis, determinism, compatibility, and explanation quality.
