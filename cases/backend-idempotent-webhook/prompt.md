# Backend/API Benchmark: Idempotent Webhook

You are given a frozen backend repo. Implement idempotent handling for `checkout.session.completed` webhooks.

Requirements:
- Duplicate webhook delivery must not create duplicate licenses.
- Missing required metadata must return a clear error and not mutate state.
- Unsupported event types must be ignored safely.
- Existing tests cover duplicate delivery, invalid event type, and the happy path. Hidden tests cover additional missing-field cases.
- Do not edit tests or package scripts; fix the implementation only.
- Keep the public API unchanged unless the task explicitly requires otherwise.

Final response must include:
- Files changed
- Tests run
- Brief explanation of the idempotency mechanism
