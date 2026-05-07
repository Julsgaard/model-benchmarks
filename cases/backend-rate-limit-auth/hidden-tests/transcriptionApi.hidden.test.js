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

test('rejects invalid bearer token', () => {
  const store = new InMemoryRateLimitStore();
  const result = handleTranscriptionRequest(req({ headers: { authorization: 'Bearer wrong' } }), store, 1000);

  assert.equal(result.status, 401);
  assert.match(result.body.error, /invalid|token|auth/i);
});

test('missing user id returns 400 and does not consume quota', () => {
  const store = new InMemoryRateLimitStore();
  const missingUser = handleTranscriptionRequest(req({ headers: { 'x-user-id': undefined } }), store, 1000);
  assert.equal(missingUser.status, 400);
  assert.match(missingUser.body.error, /user/i);

  assert.equal(handleTranscriptionRequest(req(), store, 2000).status, 200);
  assert.equal(handleTranscriptionRequest(req(), store, 3000).status, 200);
  assert.equal(handleTranscriptionRequest(req(), store, 4000).status, 200);
});

test('quota resets outside the one-minute window and is per user', () => {
  const store = new InMemoryRateLimitStore();

  assert.equal(handleTranscriptionRequest(req(), store, 1000).status, 200);
  assert.equal(handleTranscriptionRequest(req(), store, 2000).status, 200);
  assert.equal(handleTranscriptionRequest(req(), store, 3000).status, 200);
  assert.equal(handleTranscriptionRequest(req({ headers: { 'x-user-id': 'user_456' } }), store, 4000).status, 200);
  assert.equal(handleTranscriptionRequest(req(), store, 62000).status, 200);
});
