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

test('malformed checkout event does not throw or mutate state', () => {
  const store = new LicenseStore();
  const result = handleStripeWebhook({ type: 'checkout.session.completed', data: {} }, store);

  assert.equal(result.status, 'error');
  assert.match(result.message, /session|object|checkout/i);
  assert.equal(store.listLicenses().length, 0);
});

test('missing plan metadata does not create a license', () => {
  const store = new LicenseStore();
  const result = handleStripeWebhook(eventWithObject({
    id: 'cs_missing_plan',
    customer_email: 'k@example.com',
    metadata: {},
  }), store);

  assert.equal(result.status, 'error');
  assert.match(result.message, /plan|metadata/i);
  assert.equal(store.listLicenses().length, 0);
});

test('reuses existing license for same session id after other licenses exist', () => {
  const store = new LicenseStore();

  const first = handleStripeWebhook(eventWithObject({
    id: 'cs_one',
    customer_email: 'one@example.com',
    metadata: { plan: 'pro' },
  }), store);
  const second = handleStripeWebhook(eventWithObject({
    id: 'cs_two',
    customer_email: 'two@example.com',
    metadata: { plan: 'pro' },
  }), store);
  const duplicateFirst = handleStripeWebhook(eventWithObject({
    id: 'cs_one',
    customer_email: 'one@example.com',
    metadata: { plan: 'pro' },
  }), store);

  assert.equal(duplicateFirst.license.key, first.license.key);
  assert.notEqual(second.license.key, first.license.key);
  assert.equal(store.listLicenses().length, 2);
});
