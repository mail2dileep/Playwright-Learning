import { Page, Locator } from '@playwright/test';

export class RateEstimatorPage {
  private readonly page: Page;

  // Locators for Rate Calculator Section elements
  // These are declared as readonly public to allow direct assertions in the test spec
  // while adhering to the principle of encapsulating locator definitions within the Page Object.
  public readonly electricUsageDropdown: Locator; 
  public readonly gasUsageDropdown: Locator;
  public readonly serviceTypeElectricRadio: Locator;
  public readonly serviceTypeElectricGasRadio: Locator;

  // TODO: Locators for 'Calculate' and 'Reset' buttons are not available in the provided catalog.

  constructor(page: Page) {
    this.page = page;
    // Locator assignments using recommended locators from the catalog, prioritizing stability.
    this.electricUsageDropdown = page.getByLabel('Average estimated electric usage (kWh):\nhelp info'); // locatorPriority: 3
    this.gasUsageDropdown = page.getByLabel('Average estimated gas usage (CCF):\nhelp info'); // locatorPriority: 3
    this.serviceTypeElectricRadio = page.locator('#serviceType01'); // locatorPriority: 4
    this.serviceTypeElectricGasRadio = page.locator('#serviceType02'); // locatorPriority: 4
  }

  /**
   * Navigates to the CPS Energy Residential Rate Estimator page.
   * Performs initial checks to ensure the page has loaded successfully by waiting for a key element.
   * @param url The URL of the rate estimator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    // Wait for a core element of the rate calculator to be visible to confirm page load.
    await this.electricUsageDropdown.waitFor({ state: 'visible', timeout: 10000 });
  }
}