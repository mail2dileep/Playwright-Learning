import { Locator, Page } from '@playwright/test';

export class ServiceTypePage {
  private readonly page: Page;
  private readonly serviceTypeSelect: Locator;
  private readonly electricMeterInput: Locator;
  private readonly gasMeterInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // Primary selectors leverage data-testid; fallbacks use semantic IDs
    this.serviceTypeSelect = page.locator('[data-testid="service-type-select"], select#serviceType');
    this.electricMeterInput = page.locator('[data-testid="electric-meter-read"], input#electricMeterRead');
    this.gasMeterInput = page.locator('[data-testid="gas-meter-read"], input#gasMeterRead');
  }

  async open(): Promise<void> {
    // Assumes baseURL is configured in Playwright config
    await this.page.goto('/service-setup');
    await this.waitForReady();
  }

  async waitForReady(): Promise<void> {
    await this.serviceTypeSelect.first().waitFor({ state: 'visible' });
  }

  async selectServiceType(label: string): Promise<void> {
    await this.serviceTypeSelect.first().selectOption({ label });
  }

  async isElectricMeterReadEnabled(): Promise<boolean> {
    return await this.electricMeterInput.first().isEnabled();
  }

  async isElectricMeterReadVisible(): Promise<boolean> {
    try {
      return await this.electricMeterInput.first().isVisible();
    } catch {
      return false;
    }
  }

  async isGasMeterReadEnabled(): Promise<boolean> {
    return await this.gasMeterInput.first().isEnabled();
  }

  async isGasMeterReadVisible(): Promise<boolean> {
    try {
      return await this.gasMeterInput.first().isVisible();
    } catch {
      return false;
    }
  }

  async isGasMeterReadDisabledOrHidden(): Promise<boolean> {
    const visible = await this.isGasMeterReadVisible();
    if (!visible) {
      return true; // Hidden satisfies the expectation
    }
    const enabled = await this.isGasMeterReadEnabled();
    return !enabled;
  }
}
