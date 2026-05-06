import test from 'node:test';
import assert from 'node:assert/strict';
import { formatHotkeyLabel, shouldUseNativeWindowsListener } from '../src/hotkeys.js';

test('formats standard hotkeys for humans', () => {
  assert.equal(formatHotkeyLabel('CommandOrControl+Space'), 'Ctrl + Space');
  assert.equal(formatHotkeyLabel('Control+Shift+Backquote'), 'Ctrl + Shift + `');
});

test('keeps Danish/OEM half key readable', () => {
  assert.equal(formatHotkeyLabel('½'), '½');
});

test('routes only native-only Windows hotkeys to native listener', () => {
  assert.equal(shouldUseNativeWindowsListener('CommandOrControl+Space'), false);
  assert.equal(shouldUseNativeWindowsListener('Mouse4'), true);
  assert.equal(shouldUseNativeWindowsListener('Control+Super'), true);
  assert.equal(shouldUseNativeWindowsListener('½'), true);
});
