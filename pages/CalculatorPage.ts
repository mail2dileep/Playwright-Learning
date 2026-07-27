import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator; // This element is marked as disabled: true in the catalog.
  private readonly electricityServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricityServiceTypeRadio = page.locator('#e');
    this.electricGasServiceTypeRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value of the month to select (e.g., 'm01' for January).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the 'Enter Previous Read:' field.
   * @param readValue The value to enter.
   */
  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters a value into the 'Enter Current Read:' field.
   * @param readValue The value to enter.
   */
  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Enters a value into the 'Estimated Electric use (kWh):' field.
   * @param value The value to enter.
   */
  async enterEstimatedElectricUse(value: string): Promise<void> {
    await this.estimatedElectricUseInput.fill(value);
  }

  /**
   * Enters a value into the 'Estimated Gas use (Ccf):' field.
   * NOTE: This field is marked as disabled in the Locator Catalog (disabled: true).
   * While a Page Object method is provided for consistency, direct interaction with a 
   * disabled element via 'fill' from a test spec is generally not recommended as per 
   * enterprise-grade automation rules unless a prior step enables it.
   * Calling this method on a disabled element may result in a Playwright error.
   * @param value The value to enter.
   */
  async enterEstimatedGasUse(value: string): Promise<void> {
    await this.estimatedGasUseInput.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Gets the current value from the 'Enter Previous Read:' field.
   * @returns The current value of the input field.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the current value from the 'Estimated Gas use (Ccf):' field.
   * @returns The current value of the input field.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' input field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseInputDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  // TODO: Add methods for retrieving validation error messages if specific locators are provided.
}
