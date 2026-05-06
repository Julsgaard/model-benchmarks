import test from 'node:test';
import assert from 'node:assert/strict';
import { StartupCoordinator } from '../src/startup.js';

const delay = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

test('is ready after config and connection complete in either order', async () => {
  for (let i = 0; i < 20; i++) {
    const coordinator = new StartupCoordinator();
    const configDelay = i % 2 === 0 ? 1 : 5;
    const connectionDelay = i % 2 === 0 ? 5 : 1;

    await Promise.all([
      coordinator.loadConfig(() => delay(configDelay, { region: 'eu' })),
      coordinator.connect(() => delay(connectionDelay, { connected: true })),
    ]);

    assert.equal(coordinator.isReady(), true);
  }
});
