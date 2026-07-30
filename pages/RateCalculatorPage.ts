import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInputField: Locator;
  private readonly currentReadInputField: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;
  private readonly electricServiceTypeRadioButton: Locator;
  private readonly electricGasServiceTypeRadioButton: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators based on the provided catalog and recommendedLocator
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousReadInputField = this.page.getByLabel('Enter Previous Read:');
    this.currentReadInputField = this.page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseField = this.page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseField = this.page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadioButton = this.page.locator('#e');
    this.electricGasServiceTypeRadioButton = this.page.locator('#eg');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
    this.resetButton = this.page.locator('#rateCalCancelBtn');
  }

  /**
   * Selects the 'Electric only' service type radio button.
   * Assumes 'E' corresponds to 'Electric only' based on context.
   */
  async selectServiceTypeElectricOnly(): Promise<void> {
    await this.electricServiceTypeRadioButton.click();
  }

  /**
   * Returns the locator for the 'Enter Previous Read:' input field.
   */
  getPreviousReadField(): Locator {
    return this.previousReadInputField;
  }

  /**
   * Returns the locator for the 'Enter Current Read:' input field.
   */
  getCurrentReadField(): Locator {
    return this.currentReadInputField;
  }

  /**
   * Returns the locator for the 'Estimated Electric use (kWh):' input field.
   */
  getEstimatedElectricUseField(): Locator {
    return this.estimatedElectricUseField;
  }

  /**
   * Returns the locator for the 'Estimated Gas use (Ccf):' input field.
   */
  getEstimatedGasUseField(): Locator {
    return this.estimatedGasUseField;
  }

  /**
   * Returns the locator for the 'Calculate' button.
   */
  getCalculateButton(): Locator {
    return this.calculateButton;
  }

  /**
   * Returns the locator for the 'Reset' button.
   */
  getResetButton(): Locator {
    return this.resetButton;
  }

  // Example of another action method (not used in this specific test but for illustration)
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInputField.fill(value);
  }
}
