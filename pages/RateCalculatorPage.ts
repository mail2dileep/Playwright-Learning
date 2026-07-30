import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadField: Locator;
  private readonly currentReadField: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricAndGasServiceTypeRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadField = page.getByLabel('Enter Previous Read:');
    this.currentReadField = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricAndGasServiceTypeRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.electricAndGasServiceTypeRadio.click();
  }

  /**
   * Returns the locator for the 'Enter Current Read:' field, representing an electric meter read input.
   * @returns Playwright Locator for the electric current read field.
   */
  getElectricCurrentReadField(): Locator {
    return this.currentReadField;
  }

  /**
   * Returns the locator for the 'Estimated Gas use (Ccf):' field, representing a gas meter read input.
   * @returns Playwright Locator for the estimated gas use field.
   */
  getEstimatedGasUseField(): Locator {
    return this.estimatedGasUseField;
  }
}
