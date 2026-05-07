export class InMemoryRateLimitStore {
  constructor() {
    this.hits = new Map();
  }

  get(userId) {
    return this.hits.get(userId) ?? [];
  }

  set(userId, timestamps) {
    this.hits.set(userId, timestamps);
  }
}

export function handleTranscriptionRequest(request, store, now = Date.now()) {
  return {
    status: 200,
    body: {
      transcript: `queued:${request.body?.fileName ?? 'audio.wav'}`,
    },
  };
}
