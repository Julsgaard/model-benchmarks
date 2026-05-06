import test from 'node:test';
import assert from 'node:assert/strict';
import { LicenseStore } from '../src/licenseStore.js';
import { handleStripeWebhook } from '../src/webhook.js';

function eventWithObject(object) {
  return { type: 'checkout.session.completed', data: { object } };
}

test('missing customer email does not create a license', () => {
  const store = new LicenseStore();
  const result = handleStripeWebhook(eventWithObject({ id: 'cs_missing_email', metadata: { plan: 'pro' } }), store);

  assert.equal(result.status, 'error');
  assert.match(result.message, /email/i);
  assert.equal(store.listLicenses().length, 0);
});

test('missing session id does not create a license', () => {
  const store = new LicenseStore();
  const result = handleStripeWebhook(eventWithObject({ customer_email: 'k@example.com', metadata: { plan: 'pro' } }), store);

  assert.equal(result.status, 'error');
  assert.match(result.message, /session/i);
  assert.equal(store.listLicenses().length, 0);
});
