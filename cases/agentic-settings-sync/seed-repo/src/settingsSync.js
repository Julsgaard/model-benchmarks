const DEFAULT_PREFS = {
  model: 'turbo',
  language: 'auto',
  idleTimeoutMinutes: 15,
  smartContext: true,
};

export class StartupPreferenceSync {
  constructor(ipc) {
    this.ipc = ipc;
  }

  getStartupPreferences(overrides = {}) {
    return {
      ...DEFAULT_PREFS,
      ...overrides,
    };
  }

  syncStartupPreferences(overrides = {}) {
    const preferences = this.getStartupPreferences(overrides);
    this.ipc.send('startup-preferences:sync', preferences);
    return preferences;
  }
}
