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

test('syncs initial startup preferences once', () => {
  const ipc = fakeIpc();
  const sync = new StartupPreferenceSync(ipc);

  sync.syncStartupPreferences({ language: 'en' });

  assert.equal(ipc.messages.length, 1);
  assert.equal(ipc.messages[0].channel, 'startup-preferences:sync');
  assert.equal(ipc.messages[0].payload.language, 'en');
});

test('does not re-sync identical startup preferences on remount', () => {
  const ipc = fakeIpc();
  const sync = new StartupPreferenceSync(ipc);

  sync.syncStartupPreferences({ language: 'en', idleTimeoutMinutes: 20 });
  sync.syncStartupPreferences({ language: 'en', idleTimeoutMinutes: 20 });
  sync.syncStartupPreferences({ idleTimeoutMinutes: 20, language: 'en' });

  assert.equal(ipc.messages.length, 1);
});

test('syncs again when a real preference changes', () => {
  const ipc = fakeIpc();
  const sync = new StartupPreferenceSync(ipc);

  sync.syncStartupPreferences({ language: 'en' });
  sync.syncStartupPreferences({ language: 'da' });

  assert.equal(ipc.messages.length, 2);
  assert.equal(ipc.messages[1].payload.language, 'da');
});
