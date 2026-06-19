import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly electricOnlyServiceRadio: Locator;
  private readonly electricUsageDropdown: Locator;
  private readonly gasUsageDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locator: id: serviceType01, currentValue: "E", radioGroup: "servicetype", recommendedLocator: "locator('#serviceType01')"
    this.electricOnlyServiceRadio = page.locator('#serviceType01');
    // Locator: label: "Average estimated electric usage (kWh):\nhelp info", id: "consumption", recommendedLocator: "getByLabel('Average estimated electric usage (kWh):\nhelp info')"
    this.electricUsageDropdown = page.getByLabel('Average estimated electric usage (kWh):\nhelp info');
    // Locator: label: "Average estimated gas usage (CCF):\nhelp info", id: "gasconsumption", recommendedLocator: "getByLabel('Average estimated gas usage (CCF):\nhelp info')"
    this.gasUsageDropdown = page.getByLabel('Average estimated gas usage (CCF):\nhelp info');
  }

  /**
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects the 'Electric only' service type radio button.
   */
  async selectElectricOnlyService(): Promise<void> {
    await this.electricOnlyServiceRadio.click();
  }

  /**
   * Selects an electric meter read value from the dropdown.
   * @param value The text value (e.g., '500') to select from the options.
   */
  async enterElectricMeterRead(value: string): Promise<void> {
    await this.electricUsageDropdown.selectOption({ label: value });
  }

  /**
   * Clicks the 'Calculate' button to initiate rate calculation.
   * 
   * IMPORTANT: The 'Calculate' button locator was not found in the provided catalog.
   * This method will log a warning and not perform any action.
   */
  async clickCalculateButton(): Promise<void> {
    // TODO: Locator not found in catalog for 'Calculate' button.
    // As per rules, if no suitable locator exists in the Locator Catalog, add a TODO.
    console.warn("WARNING: Locator for 'Calculate' button not found in catalog. No action performed.");
  }

  /**
   * Retrieves the text of the displayed calculated price.
   * 
   * IMPORTANT: The locator for the calculated price display was not found in the provided catalog.
   * This method will throw an error if called.
   * @returns A promise that rejects with an error indicating the missing locator.
   */
  async getCalculatedPriceText(): Promise<string> {
    // TODO: Locator not found in catalog for the element displaying the calculated price.
    // As per rules, if no suitable locator exists in the Locator Catalog, add a TODO.
    throw new Error('Locator for calculated price display not found in catalog.');
  }

  /**
   * Checks if the Electric Meter Read field (dropdown) is enabled.
   * @returns A promise that resolves to true if the field is enabled, false otherwise.
   */
  async isElectricMeterReadFieldEnabled(): Promise<boolean> {
    return await this.electricUsageDropdown.isEnabled();
  }

  /**
   * Checks if the Gas Meter Read field (dropdown) is disabled.
   * @returns A promise that resolves to true if the field is disabled, false otherwise.
   */
  async isGasMeterReadFieldDisabled(): Promise<boolean> {
    return await this.gasUsageDropdown.isDisabled();
  }
}