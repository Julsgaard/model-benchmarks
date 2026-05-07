import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryRateLimitStore, handleTranscriptionRequest } from '../src/transcriptionApi.js';

function req(overrides = {}) {
  return {
    headers: {
      authorization: 'Bearer pt_live_valid',
      'x-user-id': 'user_123',
      ...overrides.headers,
    },
    body: { fileName: 'meeting.wav', ...overrides.body },
  };
}

test('accepts an authenticated transcription request', () => {
  const store = new InMemoryRateLimitStore();
  const result = handleTranscriptionRequest(req(), store, 1000);

  assert.equal(result.status, 200);
  assert.equal(result.body.transcript, 'queued:meeting.wav');
});

test('rejects missing authorization header', () => {
  const store = new InMemoryRateLimitStore();
  const result = handleTranscriptionRequest(req({ headers: { authorization: undefined } }), store, 1000);

  assert.equal(result.status, 401);
  assert.match(result.body.error, /auth|token|authorization/i);
});

test('rate limits after 3 accepted requests per minute', () => {
  const store = new InMemoryRateLimitStore();

  assert.equal(handleTranscriptionRequest(req(), store, 1000).status, 200);
  assert.equal(handleTranscriptionRequest(req(), store, 2000).status, 200);
  assert.equal(handleTranscriptionRequest(req(), store, 3000).status, 200);

  const limited = handleTranscriptionRequest(req(), store, 4000);
  assert.equal(limited.status, 429);
  assert.match(limited.body.error, /rate|limit|retry/i);
});
