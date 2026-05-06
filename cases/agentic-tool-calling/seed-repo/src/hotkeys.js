const LABELS = new Map([
  ['CommandOrControl', 'Ctrl'],
  ['Control', 'Ctrl'],
  ['Alt', 'Alt'],
  ['Shift', 'Shift'],
  ['Super', 'Win'],
  ['Meta', 'Win'],
  ['Backquote', '`'],
]);

export function formatHotkeyLabel(accelerator) {
  return accelerator
    .split('+')
    .map((part) => LABELS.get(part) ?? part)
    .join(' + ');
}

export function isModifierOnlyHotkey(accelerator) {
  const modifiers = new Set(['CommandOrControl', 'Control', 'Alt', 'Shift', 'Super', 'Meta']);
  return accelerator.split('+').every((part) => modifiers.has(part));
}

export function shouldUseNativeWindowsListener(accelerator) {
  return accelerator.startsWith('Mouse') || isModifierOnlyHotkey(accelerator);
}
