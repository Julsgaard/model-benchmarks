# Backend/API Benchmark: Authenticated Rate Limit

You are given a frozen backend repo. Implement a small API guard for a transcription endpoint.

Requirements:
- Requests must include `Authorization: Bearer <token>`.
- Only token `pt_live_valid` is accepted.
- Missing or invalid auth must return `{ status: 401, body: { error: <clear message> } }`.
- Authenticated requests are limited to 3 accepted requests per minute per user id.
- User id comes from `x-user-id`; missing user id must return 400 without consuming rate limit.
- Over-limit requests must return status 429 with a clear retry message.
- Keep the public function signature unchanged.
- Do not edit tests or package scripts; fix implementation only.

Final response must include:
- Files changed
- Tests run
- Brief explanation of auth and rate-limit behavior
