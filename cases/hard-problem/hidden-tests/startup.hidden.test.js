import test from 'node:test';
import assert from 'node:assert/strict';
import { StartupCoordinator } from '../src/startup.js';

const delay = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

test('ready remains false until both config and connection have completed', async () => {
  const coordinator = new StartupCoordinator();

  const configPromise = coordinator.loadConfig(() => delay(30, { region: 'eu' }));
  const connectPromise = coordinator.connect(() => delay(1, { connected: true }));

  await connectPromise;
  assert.equal(coordinator.isReady(), false);

  await configPromise;
  assert.equal(coordinator.isReady(), true);
});

test('ready transitions correctly when config completes before connection', async () => {
  const coordinator = new StartupCoordinator();

  await coordinator.loadConfig(() => delay(1, { region: 'eu' }));
  assert.equal(coordinator.isReady(), false);

  await coordinator.connect(() => delay(1, { connected: true }));
  assert.equal(coordinator.isReady(), true);
});
