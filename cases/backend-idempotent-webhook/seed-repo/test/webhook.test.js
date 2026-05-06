import test from 'node:test';
import assert from 'node:assert/strict';
import { LicenseStore } from '../src/licenseStore.js';
import { handleStripeWebhook } from '../src/webhook.js';

function completedSession(overrides = {}) {
  return {
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        customer_email: 'kristian@example.com',
        metadata: { plan: 'pro' },
        ...overrides,
      },
    },
  };
}

test('creates a license for a completed checkout session', () => {
  const store = new LicenseStore();
  const result = handleStripeWebhook(completedSession(), store);

  assert.equal(result.status, 'created');
  assert.equal(store.listLicenses().length, 1);
  assert.equal(store.listLicenses()[0].email, 'kristian@example.com');
});

test('ignores unsupported event types', () => {
  const store = new LicenseStore();
  const result = handleStripeWebhook({ type: 'invoice.paid', data: { object: {} } }, store);

  assert.deepEqual(result, { status: 'ignored' });
  assert.equal(store.listLicenses().length, 0);
});

test('duplicate checkout session delivery is idempotent', () => {
  const store = new LicenseStore();
  const event = completedSession();

  const first = handleStripeWebhook(event, store);
  const second = handleStripeWebhook(event, store);

  assert.equal(first.license.key, second.license.key);
  assert.equal(store.listLicenses().length, 1);
});
