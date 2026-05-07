# Agentic Tool-Calling Benchmark: Settings Sync Noise

You are given a frozen Electron-style settings repo with a failing unit test. Diagnose why startup preferences are synced repeatedly even when the payload has not changed, fix the smallest correct thing, run the relevant tests, and leave the repo clean.

Context:
- Renderer code may mount/unmount settings-related pages multiple times.
- Main-process startup preference sync should happen when preferences actually change, not on every mount.
- Do not remove legitimate updates; changed settings must still sync.

Rules:
- Read/search before editing.
- Do not edit tests, package scripts, or benchmark harness files.
- Do not rewrite unrelated architecture.
- Run the smallest useful test command.
- If a test fails, inspect the failure and retry intelligently.

Final response must include:
- Root cause
- Files changed
- Tests run and result
- Why the fix avoids repeated identical syncs without blocking real changes
