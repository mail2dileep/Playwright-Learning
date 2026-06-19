import { Page, Locator, expect } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly electricUsageDropdown: Locator;
  private readonly gasUsageDropdown: Locator;
  private readonly electricOnlyServiceTypeRadio: Locator;
  private readonly electricAndGasServiceTypeRadio: Locator;
  // TODO: Locator for 'Calculate' button not found in catalog
  // TODO: Locator for 'Calculated Price' display not found in catalog

  constructor(page: Page) {
    this.page = page;
    this.electricUsageDropdown = page.getByLabel('Average estimated electric usage (kWh):\nhelp info');
    this.gasUsageDropdown = page.getByLabel('Average estimated gas usage (CCF):\nhelp info');
    this.electricOnlyServiceTypeRadio = page.locator('#serviceType01');
    this.electricAndGasServiceTypeRadio = page.locator('#serviceType02');
  }

  /**
   * Selects the 'Electric only' service type option.
   */
  async selectElectricOnlyServiceType(): Promise<void> {
    await this.electricOnlyServiceTypeRadio.click();
  }

  /**
   * Sets the estimated electric usage.
   * @param usageKwh The electric usage value to select (e.g., '500', '1000').
   */
  async setElectricUsage(usageKwh: string): Promise<void> {
    await this.electricUsageDropdown.selectOption({ label: usageKwh });
  }

  /**
   * Retrieves the currently selected electric usage value.
   * @returns The selected electric usage value as a string.
   */
  async getElectricUsageValue(): Promise<string> {
    return await this.electricUsageDropdown.inputValue();
  }

  /**
   * Checks if the electric usage field is enabled.
   * @returns True if the electric usage field is enabled, false otherwise.
   */
  async isElectricUsageFieldEnabled(): Promise<boolean> {
    return await this.electricUsageDropdown.isEnabled();
  }

  /**
   * Checks if the gas usage field is disabled or hidden.
   * @returns True if the gas usage field is disabled or hidden, false otherwise.
   */
  async isGasUsageFieldDisabledOrHidden(): Promise<boolean> {
    const isDisabled = await this.gasUsageDropdown.isDisabled();
    const isHidden = await this.gasUsageDropdown.isHidden();
    return isDisabled || isHidden;
  }

  /**
   * Clicks the 'Calculate' button to compute the rates.
   * TODO: Locator not found in catalog. Placeholder for future implementation.
   */
  async clickCalculateButton(): Promise<void> {
    console.warn("WARNING: 'Calculate' button locator not found in catalog. This action cannot be performed.");
    // Example of how it would be called if a locator was available:
    // await this.calculateButton.click();
  }

  /**
   * Retrieves the calculated price displayed on the page.
   * TODO: Locator for 'Calculated Price' display not found in catalog. Placeholder for future implementation.
   * @returns The calculated price as a string, or an empty string if not found.
   */
  async getCalculatedPrice(): Promise<string> {
    console.warn("WARNING: 'Calculated Price' display locator not found in catalog. Cannot retrieve price.");
    // Example of how it would be called if a locator was available:
    // return await this.calculatedPriceDisplay.textContent() || '';
    return '';
  }
}