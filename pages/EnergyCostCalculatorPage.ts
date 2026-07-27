import { Page, Locator } from '@playwright/test';

export class EnergyCostCalculatorPage {
  private readonly page: Page;
  private readonly estimatedElectricUseField: Locator;

  constructor(page: Page) {
    this.page = page;
    // Encapsulate locators using recommendedLocator from catalog
    this.estimatedElectricUseField = this.page.getByLabel('Estimated Electric use (kWh):');
  }

  /**
   * Navigates to the Energy Cost Calculator page.
   * @param url The URL of the calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Checks if the estimated electric use input field, a key component of the rate calculator, is visible.
   * This method represents the visibility of the rate calculator section.
   * @returns A Locator representing the estimated electric use field.
   */
  isEstimatedElectricUseFieldVisible(): Locator {
    return this.estimatedElectricUseField;
  }
}
