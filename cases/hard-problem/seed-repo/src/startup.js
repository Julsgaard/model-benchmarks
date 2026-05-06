export class StartupCoordinator {
  constructor() {
    this.ready = false;
    this.config = null;
    this.connection = null;
  }

  async loadConfig(loader) {
    this.config = await loader();
    return this.config;
  }

  async connect(connector) {
    this.connection = await connector();
    this.ready = Boolean(this.config);
    return this.connection;
  }

  isReady() {
    return this.ready;
  }
}
