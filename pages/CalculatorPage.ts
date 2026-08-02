import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly previousMeterReadField: Locator;
  private readonly currentMeterReadField: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;
  private readonly electricOnlyServiceTypeRadio: Locator;
  private readonly electricAndGasServiceTypeRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly monthSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.previousMeterReadField = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadField = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyServiceTypeRadio = page.locator('#e');
    this.electricAndGasServiceTypeRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.monthSelect = page.getByLabel('Month');
  }

  /**
   * Selects the 'Electric only' service type radio button.
   */
  async selectElectricOnlyService(): Promise<void> {
    await this.electricOnlyServiceTypeRadio.click();
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous meter read value as a string.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousMeterReadField.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current meter read value as a string.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentMeterReadField.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the locator for the 'Estimated Gas use (Ccf):' field.
   * This method is exposed for test layer assertions on the locator's state (e.g., disabled).
   * @returns The Playwright Locator for the estimated gas use field.
   */
  getEstimatedGasUseFieldLocator(): Locator {
    return this.estimatedGasUseField;
  }

  /**
   * Retrieves the locator for the 'Estimated Electric use (kWh):' field.
   * This method is exposed for test layer assertions on the locator's state or value.
   * @returns The Playwright Locator for the estimated electric use field.
   */
  getEstimatedElectricUseFieldLocator(): Locator {
    return this.estimatedElectricUseField;
  }

  /**
   * Retrieves the locator for the 'Enter Previous Read:' field.
   * This method is exposed for test layer assertions on the locator's state or value.
   * @returns The Playwright Locator for the previous meter read field.
   */
  getPreviousMeterReadFieldLocator(): Locator {
    return this.previousMeterReadField;
  }

  /**
   * Retrieves the locator for the 'Enter Current Read:' field.
   * This method is exposed for test layer assertions on the locator's state or value.
   * @returns The Playwright Locator for the current meter read field.
   */
  getCurrentMeterReadFieldLocator(): Locator {
    return this.currentMeterReadField;
  }

  // Add a navigate method if the page object is responsible for navigation
  // async navigate(url: string): Promise<void> {
  //   await this.page.goto(url);
  // }
}