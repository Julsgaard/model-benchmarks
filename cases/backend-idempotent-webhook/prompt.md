# Backend/API Benchmark: Idempotent Webhook

You are given a frozen backend repo. Implement idempotent handling for `checkout.session.completed` webhooks.

Requirements:
- Duplicate webhook delivery must not create duplicate licenses.
- Missing required metadata must return a clear error and not mutate state.
- Unsupported event types must be ignored safely.
- Add or update tests for duplicate delivery, missing metadata, invalid event type, and the happy path.
- Keep the public API unchanged unless the task explicitly requires otherwise.

Final response must include:
- Files changed
- Tests run
- Brief explanation of the idempotency mechanism
