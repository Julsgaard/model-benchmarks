import test from 'node:test';
import assert from 'node:assert/strict';
import { StartupPreferenceSync } from '../src/settingsSync.js';

function fakeIpc() {
  return {
    messages: [],
    send(channel, payload) {
      this.messages.push({ channel, payload });
    },
  };
}

test('dedupe state is per sync instance, not global across windows', () => {
  const ipcA = fakeIpc();
  const ipcB = fakeIpc();
  const syncA = new StartupPreferenceSync(ipcA);
  const syncB = new StartupPreferenceSync(ipcB);

  syncA.syncStartupPreferences({ language: 'en' });
  syncB.syncStartupPreferences({ language: 'en' });

  assert.equal(ipcA.messages.length, 1);
  assert.equal(ipcB.messages.length, 1);
});

test('does not mutate returned preferences between calls', () => {
  const ipc = fakeIpc();
  const sync = new StartupPreferenceSync(ipc);

  const prefs = sync.syncStartupPreferences({ language: 'en' });
  prefs.language = 'mutated-after-send';
  sync.syncStartupPreferences({ language: 'en' });

  assert.equal(ipc.messages.length, 1);
  assert.equal(ipc.messages[0].payload.language, 'en');
});
