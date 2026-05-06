export class LicenseStore {
  constructor() {
    this.licenses = [];
  }

  createLicense({ email, stripeSessionId, plan }) {
    const key = `PT-${String(this.licenses.length + 1).padStart(4, '0')}`;
    const license = {
      key,
      email,
      stripeSessionId,
      plan,
      createdAt: new Date().toISOString(),
    };
    this.licenses.push(license);
    return license;
  }

  listLicenses() {
    return [...this.licenses];
  }
}
