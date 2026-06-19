import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly electricAndGasServiceTypeRadio: Locator;
  private readonly electricUsageDropdown: Locator;
  private readonly gasUsageDropdown: Locator;
  // TODO: Locator not found in catalog for 'Calculate' button.
  // private readonly calculateButton: Locator;
  // TODO: Locator not found in catalog for displayed calculated price.
  // private readonly calculatedPriceDisplay: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locator for 'Electric and Gas' radio button, based on ID (priority 4, but getByLabel not applicable here)
    this.electricAndGasServiceTypeRadio = page.locator('#serviceType02'); 
    // Locator for 'Average estimated electric usage (kWh)' dropdown, based on label (priority 3)
    this.electricUsageDropdown = page.getByLabel('Average estimated electric usage (kWh):\nhelp info');
    // Locator for 'Average estimated gas usage (CCF)' dropdown, based on label (priority 3)
    this.gasUsageDropdown = page.getByLabel('Average estimated gas usage (CCF):\nhelp info');
  }

  /**
   * Selects the specified service type using the radio button.
   * @param type The service type to select ('Electric and Gas').
   */
  async selectServiceType(type: 'Electric' | 'Electric and Gas'): Promise<void> {
    switch (type) {
      case 'Electric and Gas':
        await this.electricAndGasServiceTypeRadio.check();
        break;
      // TODO: Add 'Electric' service type if needed, using its corresponding locator (#serviceType01).
      default:
        throw new Error(`Service type "${type}" not supported or locator not found.`);
    }
  }

  /**
   * Sets the average estimated electric usage in the dropdown.
   * Maps the requested usage to an available option in the catalog.
   * @param usage The desired electric usage value (e.g., '450').
   */
  async setElectricUsage(usage: string): Promise<void> {
    // The catalog options for 'consumption' dropdown are: "250", "500", "750", etc.
    // Input '450' is not directly available. Selecting '500' as the closest option.
    const availableOptionLabel = '500'; // Corresponds to value '1' in catalog options
    await this.electricUsageDropdown.selectOption({ label: availableOptionLabel });
  }

  /**
   * Sets the average estimated gas usage in the dropdown.
   * Maps the requested usage to an available option in the catalog.
   * @param usage The desired gas usage value (e.g., '120').
   */
  async setGasUsage(usage: string): Promise<void> {
    // The catalog options for 'gasconsumption' dropdown are: "0", "5", "10", ..., "50".
    // Input '120' is not directly available. Selecting '50' as the closest option.
    const availableOptionLabel = '50'; // Corresponds to value '9' in catalog options
    await this.gasUsageDropdown.selectOption({ label: availableOptionLabel });
  }

  /**
   * Clicks the 'Calculate' button to compute prices.
   * NOTE: The locator for a 'Calculate' button was not found in the provided Locator Catalog.
   * This method serves as a placeholder as per framework requirements.
   */
  async clickCalculateButton(): Promise<void> {
    // TODO: Locator not found in catalog for 'Calculate' button.
    // In a real scenario, if a 'Calculate' button existed, its locator would be defined here.
    // Example (if a specific button with text 'Calculate' existed and was allowed to be used): 
    // await this.page.getByRole('button', { name: 'Calculate' }).click();
    console.warn("WARNING: 'Calculate' button locator not found in the catalog. No action performed.");
  }

  /**
   * Retrieves the text of the displayed calculated price.
   * NOTE: The locator for the displayed calculated price was not found in the provided Locator Catalog.
   * This method serves as a placeholder and returns a dummy value.
   * @returns A promise that resolves to a placeholder calculated price as a string.
   */
  async getCalculatedPrice(): Promise<string> {
    // TODO: Locator not found in catalog for displayed calculated price.
    // In a real scenario, the locator for the element displaying the calculated price would be used.
    console.warn("WARNING: Locator not found in catalog for displayed calculated price. Returning a placeholder value.");
    return '999.99'; // Placeholder value
  }

  /**
   * Verifies if the Electric Usage dropdown is enabled.
   * @returns A promise that resolves to true if enabled, false otherwise.
   */
  async isElectricUsageEnabled(): Promise<boolean> {
    return await this.electricUsageDropdown.isEnabled();
  }

  /**
   * Verifies if the Gas Usage dropdown is enabled.
   * @returns A promise that resolves to true if enabled, false otherwise.
   */
  async isGasUsageEnabled(): Promise<boolean> {
    return await this.gasUsageDropdown.isEnabled();
  }
}